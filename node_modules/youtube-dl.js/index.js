const fs = require("fs");
const got = require("got");
const execFile = require("child_process").execFile;

const isWin = /^win/.test(process.platform);

function getRemoteVersion() {
  return new Promise((resolve, reject) => {
    const API_URL = "https://api.github.com/repos/rg3/youtube-dl/releases/latest";
    got.get(API_URL)
      .then(response => {
        if (response.statusCode === 200) {
          const json_body = JSON.parse(response.body);
          resolve(json_body.tag_name);
        } else {
          reject(response.body);
        }
      })
      .catch(reject);
  });
}

function getBinaryVersion() {
  return new Promise((resolve, reject) => {
    let binaryPath = __dirname + "/bin/youtube-dl";
    if (isWin) binaryPath += ".exe";
    if (!fs.existsSync(binaryPath)) {
      reject("Couldn't find youtube-dl binary. Try running 'npm run updateytdl'");
    }
    execFile(binaryPath, ["--version"], (error, stdout, stderr) => {
      if (error) reject(error);
      const version = stdout.replace(/\r?\n|\r/g, "");
      resolve(version);
    });
  });
}

function downloadBinary() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(__dirname + "/bin")) fs.mkdirSync(__dirname + "/bin");
    let url, filePath;
    if (isWin) {
      url = "https://yt-dl.org/downloads/latest/youtube-dl.exe";
      filePath = __dirname + "/bin/youtube-dl.exe";
    } else {
      url = "https://yt-dl.org/downloads/latest/youtube-dl";
      filePath = __dirname + "/bin/youtube-dl";
    }
    got(url, { followRedirect: true, encoding: null })
      .then(resp => {
        fs.writeFileSync(filePath, resp.body, { mode: 0755 });
        resolve();
      })
      .catch(reject);
  });
}

run = (url, args, options) => {
  return new Promise((resolve, reject) => {
    let binaryPath = __dirname + "/bin/youtube-dl";
    args.push(url);
    if (isWin) binaryPath += ".exe";
    if (!fs.existsSync(binaryPath)) {
      reject("Couldn't find youtube-dl binary. Try running 'npm run updateytdl'");
    }
    execFile(binaryPath, args, options, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout.trim());
    });
  });
};

run.updateBinary = () => {
  return new Promise((resolve, reject) => {
    const startTime = new Date().getTime();
    const versionFile = __dirname + "/bin/version.json";
    let currentVersion = "0";
    getRemoteVersion()
      .then(remoteVersion => {
        if (fs.existsSync(versionFile)) {
          currentVersion = require(versionFile).version;
        }
        if (new Date(remoteVersion).getTime() > new Date(currentVersion).getTime()) {
          downloadBinary()
            .then(() => {
              getBinaryVersion()
                .then(binaryVersion => {
                  const versionObj = {
                    version: binaryVersion,
                    downloadTime: new Date().getTime()
                  };
                  fs.writeFileSync(versionFile, JSON.stringify(versionObj, null, 2));
                  resolve({ time: (new Date().getTime() - startTime) / 1000, version: binaryVersion });
                })
                .catch(reject);
            })
            .catch(reject);
        } else {
          resolve({ version: currentVersion, time: (new Date().getTime() - startTime) / 1000 });
        }
      })
      .catch(reject);
  });
};

module.exports = run;

const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("child_process");
const http = require("http");
const net = require("net");
const path = require("path");
const fs = require("fs");

let serverProcess;

function loadLocalEnvironment() {
  const portableExecutable = process.env.PORTABLE_EXECUTABLE_FILE;
  const configDirectories = [
    process.env.PORTABLE_EXECUTABLE_DIR,
    portableExecutable ? path.dirname(portableExecutable) : undefined,
    path.dirname(process.execPath),
    app.getPath("userData"),
  ].filter(Boolean);
  const envPath = configDirectories
    .map((directory) => path.join(directory, ".env.local"))
    .find((candidate) => fs.existsSync(candidate));

  if (!envPath) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || line.trimStart().startsWith("#")) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

function waitForServer(url, attempts = 100) {
  return new Promise((resolve, reject) => {
    const tryRequest = (remaining) => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });
      request.on("error", () => {
        if (remaining <= 0) {
          reject(new Error("本地服务启动超时"));
          return;
        }
        setTimeout(() => tryRequest(remaining - 1), 100);
      });
      request.setTimeout(500, () => request.destroy());
    };
    tryRequest(attempts);
  });
}

async function createWindow() {
  loadLocalEnvironment();
  const port = await getAvailablePort();
  const appRoot = app.getAppPath();
  const standalonePath = path.join(appRoot, ".next", "standalone");
  const serverPath = path.join(standalonePath, "server.js");

  if (!fs.existsSync(serverPath)) {
    throw new Error("未找到本地应用文件。请先运行 npm run build:desktop 进行打包。");
  }

  serverProcess = spawn(process.execPath, [serverPath], {
    cwd: standalonePath,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
    },
    windowsHide: true,
    stdio: "ignore",
  });

  const url = `http://127.0.0.1:${port}/zh-CN`;
  await waitForServer(url);

  const window = new BrowserWindow({
    width: 1280,
    height: 920,
    minWidth: 900,
    minHeight: 680,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  window.once("ready-to-show", () => window.show());
  await window.loadURL(url);
}

app.whenReady().then(createWindow).catch((error) => {
  dialog.showErrorBox("GameGrid 启动失败", error.message);
  app.quit();
});

app.on("window-all-closed", () => app.quit());
app.on("before-quit", () => {
  if (serverProcess && !serverProcess.killed) serverProcess.kill();
});

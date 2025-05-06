// index.js
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { Menu } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'src/icon/wspnicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'wspndskcontrol.html'));

  // 메뉴 완전 제거
  mainWindow.setMenu(null);

  // 단축키로 새로고침 (F5, Ctrl+R, Cmd+R)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (
      (input.key === 'F5')
    ) {
      mainWindow.reload();
      event.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Start server.js
  serverProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    shell: true,
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    console.log('[server]', msg);

    if (msg.includes('READY')) {
      mainWindow.loadURL('http://localhost:5001/wspndskcontrol.html');
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
      });
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('[server ERROR]', data.toString());
  });

  mainWindow.on('close', () => {
    app.quit(); // before-quit handles cleanup
  });
});

// ✅ 강제 포트 5000 종료 + 앱 종료
app.on('before-quit', (event) => {
  event.preventDefault();

  console.log('[app] Checking for PID using port 5001...');
  exec('netstat -ano | findstr :5001', (err, stdout) => {
    if (err || !stdout) {
      console.warn('[app] No PID found on port 5001');
      return app.exit();
    }

    const lines = stdout.trim().split('\n');
    const pid = lines[0]?.trim().split(/\s+/).pop();

    if (pid) {
      console.log(`[app] Killing PID ${pid} on port 5001...`);
      exec(`taskkill /PID ${pid} /F`, (err2) => {
        if (err2) {
          console.error('[app] Failed to kill process:', err2);
        } else {
          console.log('[app] Port 5001 released.');
        }
        app.exit();
      });
    } else {
      console.warn('[app] PID not found in netstat output.');
      app.exit();
    }
  });
});
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 기본 타이틀 바를 제거
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:5173'); // Vite 개발 서버

  // 메뉴 바 삭제
  Menu.setApplicationMenu(null);
}

app.on('ready', createWindow);

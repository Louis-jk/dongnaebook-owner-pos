import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import * as path from 'path';
const fs = require('fs');
const os = require('os');
const url = require('url');
const { setup: setupPushReceiver } = require('electron-push-receiver');

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'customButtonsOnHover',
    roundedCorners: false,
    vibrancy: 'fullscreen-ui',
    transparent: true,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    width: 1024,
    height: 768,
    backgroundColor: '#2e2c29',
    kiosk: false, // 키오스크 모드(실행시 전체 화면 fixed)
    center: true,
    title: '오늘의주문',
    icon: path.join(app.getAppPath(), '/build/icons/png/64x64.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(app.getAppPath(), '/preload.js'), // 빌드시 /build/preload.js 로 변경 필요
    },
  });

  let indexPath;

  indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(app.getAppPath(), '/index.html'), // 빌드시 /build/index.html 로 변경 필요
    slashes: true,
  });
  mainWindow.loadURL(indexPath);
  setupPushReceiver(mainWindow.webContents);

  // 기본 메뉴 숨기기
  mainWindow.setMenuBarVisibility(false);

  // 개발자 툴 오픈
  mainWindow.webContents.openDevTools(); // 빌드시 해제 필요

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);

// 프린트 기능
ipcMain.on('pos_print', (event, data) => {
  let win = new BrowserWindow({ width: 302, height: 793, show: false });
  win.once('ready-to-show', () => win.hide());
  fs.writeFile(path.join(os.tmpdir(), '/printme.html'), data, function () {
    win.loadURL(`file://${path.join(os.tmpdir(), 'printme.html')}`);

    win.webContents.on('did-finish-load', () => {
      // Finding Default Printer name
      let printerInfo = win.webContents.getPrinters();
      let printer = printerInfo.filter(
        (printer) => printer.isDefault === true
      )[0];

      console.log('printer info', printer);

      const options = {
        marginsType: 0,
        printBackground: true,
        printSelectionOnly: false,
        landscape: false,
        scaleFactor: 100,
        silent: true,
        deviceName: printer.name,
        pageSize: { height: 301000, width: 72000 },
      };

      win.webContents.print(options, () => {
        win = null;
      });
    });
  });
  event.returnValue = true;
});

// 창 닫기
ipcMain.on('windowClose', (event, data) => {
  console.log('app quit?', data);
  app.exit();
});

// 창 내리기
ipcMain.on('windowMinimize', (event, data) => {
  mainWindow.minimize();
});

// 토큰 가져오기
let fcmToken = '';
ipcMain.on('fcmToken', (event, data) => {
  console.log('electron token data', data);
  fcmToken = data;
  event.sender.send('electronToken', data);
});

ipcMain.on('callToken', (event, data) => {
  event.sender.send('electronToken', fcmToken);
});

// 사운드 카운트 받기
ipcMain.on('sound_count', (event, data) => {
  event.sender.send('get_sound_count', data);
});

// 접수 처리 시 사운드 STOP
ipcMain.on('sound_stop', (event, data) => {
  event.sender.send('get_stop_sound', data);
});

// 사운드 VOLUMNE 설정
ipcMain.on('sound_volume', (event, data) => {
  event.sender.send('get_sound_vol', data);
});

// 프린트 정보 열기
ipcMain.on('openPrint', (event, data) => {
  const printerInfo = mainWindow.webContents.getPrinters();
  console.log('printerInfo ??', printerInfo);
  event.sender.send('printInfo', printerInfo);
});

// 메인프로세서 종료
ipcMain.on('closeWindow', (event, data) => {
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.platform === 'win32') {
  app.setAppUserModelId('오늘의 주문');
}

ipcMain.handle('quit-app', () => {
  app.quit();
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

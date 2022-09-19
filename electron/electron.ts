import { app, BrowserWindow, Menu, ipcMain } from "electron";
import * as path from "path";
const fs = require("fs");
const os = require("os");
const url = require("url");
const { setup: setupPushReceiver } = require("electron-push-receiver");
const SerialPort = require('serialport')
const escpos = require('escpos')
escpos.SerialPort = require('escpos-serialport');
import * as isDev from "electron-is-dev";

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: "customButtonsOnHover",
    roundedCorners: false,
    vibrancy: "fullscreen-ui",
    transparent: true,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    width: 1024,
    height: 768,
    backgroundColor: "#2e2c29",
    kiosk: false, // 키오스크 모드(실행시 전체 화면 fixed)
    center: true,
    title: "동네북",
    icon: path.join(
      app.getAppPath(),
      isDev ? "/icons/png/64x64.png" : "/build/icons/png/64x64.png"
    ),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(
        app.getAppPath(),
        isDev ? "/preload.js" : "/build/preload.js"
      ), // 빌드시 /build/preload.js 로 변경 필요
    },
  });

  let indexPath;

  indexPath = url.format({
    protocol: "file:",
    pathname: path.join(
      app.getAppPath(),
      isDev ? "/index.html" : "/build/index.html"
    ), // 빌드시 /build/index.html 로 변경 필요
    slashes: true,
  });

  setupPushReceiver(mainWindow.webContents);

  // 기본 메뉴 숨기기
  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools(); // // 개발자 툴 오픈
  } else {
    mainWindow.loadURL(indexPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);


const options = { encoding: 'cp949' }

// Serialport 리스트
ipcMain.on('requestPortsList', (event: any, data: any) => {
  console.log('serialPortsList called!')
  SerialPort.list().then((ports: any, err: any) => {
    console.log('ports ?', ports)
    event.sender.send('responsePortList', ports)
  })
})

// serialport 테스트 인쇄
ipcMain.on('testPrint', (event: any, data: any) => {
  
  const {port, baudRate} = data;

  const device = new escpos.SerialPort(port, { baudRate });
  const printer = new escpos.Printer(device, options)
  device.open(function(err: any) {
    console.log('serialport error', err)

    printer
    .size(0.1, 0.1)
    .font('A')
    .align('ct')
    .style('bu')
    .text('동네북 영수증')
    .newLine()
    .align('LT')
    .style('NORMAL')
    .newLine()
    .size(0.01, 0.01)
    .text('테스트 인쇄')
    .tableCustom([
      { text: '총금액', width: 0.4, align: 'LEFT' },
      { text: '2,000,000 원', width: 0.6, align: 'RIGHT' }
    ])
    .newLine()
    .newLine()
    .newLine()
    .cut()
    .close();
  })
})

// const device = new SerialPort({
//   path: 'COM4',
//   baudRate: 9600
// })

/*
const device = new escpos.SerialPort('COM4', { baudRate: 9600 });

const options = { encoding: 'cp949' }
const printer = new escpos.Printer(device, options)

device.open(function(err: any) {
  console.log('serialport error', err)

  printer
  .size(0.01, 0.01)
  .font('A')
  .align('ct')
  .style('bu')
  .text('동네북 영수증')
  .newLine()
  .align('LT')
  .style('NORMAL')
  .tableCustom([
    { text: 'Date:', width: 0.2 },
    { text: '2021-01-04 11:11', width: 0.6 }
  ])
  .style('NORMAL')
  .tableCustom([
    { text: 'Order ID:', width: 0.2 },
    { text: '050-7866-2406', width: 0.6 }
  ])
  .style('NORMAL')
  .tableCustom([
    { text: '전화번호:', width: 0.2 },
    { text: '200000000', width: 0.6, align: 'LEFT' }
  ], { encoding: 'EUC-KR' })
  .tableCustom([
    { text: '메모:', width: 0.4 },
    { text: '문앞에 두고 벨을 눌러주세요', width: 0.6 }
  ], 'CP949')
  .drawLine()
  .newLine()
  .tableCustom([
    { text: '기사님 이름:', width: 0.4 },
    { text: '기사이름', width: 0.6 }
  ], 'CP949')
  .tableCustom([
    { text: '기사님 번호:', width: 0.4 },
    { text: '010-1234-5678', width: 0.6 }
  ], 'CP949')
  .drawLine()
  .newLine()
  .tableCustom([
    { text: '합계', width: 0.4, align: 'LEFT' },
    { text: '2,000,000 원', width: 0.6, align: 'RIGHT' }
  ], 'CP949')
  .tableCustom([
    { text: '배송료(11.2km)', width: 0.4, align: 'LEFT' },
    { text: '2,000 원', width: 0.6, align: 'RIGHT' }
  ], 'CP949')
  .tableCustom([
    { text: '수수료', width: 0.4, align: 'LEFT' },
    { text: '-0 원', width: 0.6, align: 'RIGHT' }
  ], 'CP949')
  .drawLine()
  .newLine()
  .tableCustom([
    { text: '총금액', width: 0.4, align: 'LEFT' },
    { text: '2,000,000 원', width: 0.6, align: 'RIGHT' }
  ], 'CP949')
  .newLine()
  .newLine()
  .newLine()
  .cut()
  .close();
  
});
*/

  // printer
  //   .font('a')
  //   .align('ct')
  //   .style('bu')
  //   .size(1, 1)
  //   .text('The quick brown fox jumps over the lazy dog')
  //   .text('테스트 영수증 프린터')
  //   .cut()
  //   .close();
  //   // .barcode('1234567', 'EAN8')
  //   // .table(["One", "Two", "Three"])
  //   // .tableCustom(
  //   //   [
  //   //     { text:"Left", align:"LEFT", width:0.33, style: 'B' },
  //   //     { text:"Center", align:"CENTER", width:0.33},
  //   //     { text:"Right", align:"RIGHT", width:0.33 }
  //   //   ],
  //   //   { encoding: 'cp857', size: [1, 1] } // Optional
  //   // )
  //   // .qrimage('https://github.com/song940/node-escpos', function(err: any){
  //   //   this.cut();
  //   //   this.close();
  //   // });
// })

// 프린트 기능
ipcMain.on("pos_print", (event, data) => {
  let win = new BrowserWindow({ width: 302, height: 793, show: false });
  win.once("ready-to-show", () => win.hide());
  fs.writeFile(path.join(os.tmpdir(), "/printme.html"), data, function () {
    win.loadURL(`file://${path.join(os.tmpdir(), "printme.html")}`);

    win.webContents.on("did-finish-load", () => {
      // Finding Default Printer name
      let printerInfo = win.webContents.getPrinters();
      let printer = printerInfo.filter(
        (printer) => printer.isDefault === true
      )[0];

      console.log("printer info", printer);

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
ipcMain.on("windowClose", (event, data) => {
  console.log("app quit?", data);
  app.exit();
});

// 창 내리기
ipcMain.on("windowMinimize", (event, data) => {
  mainWindow.minimize();
});

// 토큰 가져오기
let fcmToken = "";
ipcMain.on("fcmToken", (event, data) => {
  console.log("electron token data", data);
  fcmToken = data;
  event.sender.send("electronToken", data);
});

ipcMain.on("callToken", (event, data) => {
  event.sender.send("electronToken", fcmToken);
});

// 사운드 카운트 받기
ipcMain.on("sound_count", (event, data) => {
  event.sender.send("get_sound_count", data);
});

// 접수 처리 시 사운드 STOP
ipcMain.on("sound_stop", (event, data) => {
  event.sender.send("get_stop_sound", data);
});

// 사운드 VOLUMNE 설정
ipcMain.on("sound_volume", (event, data) => {
  event.sender.send("get_sound_vol", data);
});

// 프린트 정보 열기
ipcMain.on("openPrint", (event, data) => {
  const printerInfo = mainWindow.webContents.getPrinters();
  console.log("printerInfo ??", printerInfo);
  event.sender.send("printInfo", printerInfo);
});

// 메인프로세서 종료
ipcMain.on("closeWindow", (event, data) => {
  mainWindow = null;
  if (process.platform !== "darwin") {
    app.quit();
  }
});

if (process.platform === "win32") {
  app.setAppUserModelId("오늘의 주문");
}

ipcMain.handle("quit-app", () => {
  app.quit();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

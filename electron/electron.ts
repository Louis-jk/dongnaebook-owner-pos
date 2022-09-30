import { app, BrowserWindow, Menu, ipcMain } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
const fs = require("fs");
const os = require("os");
const url = require("url");
const { setup: setupPushReceiver } = require("electron-push-receiver");
const SerialPort = require("serialport");
const escpos = require("escpos");
escpos.SerialPort = require("escpos-serialport");

interface PrinterSettingsObjects {
  port: string;
  baudRate: number;
}

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: "customButtonsOnHover",
    roundedCorners: false,
    vibrancy: "fullscreen-ui",
    thickFrame: true,
    transparent: false,
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
      ),
    },
  });

  let indexPath;

  indexPath = url.format({
    protocol: "file:",
    pathname: path.join(
      app.getAppPath(),
      isDev ? "/index.html" : "/build/index.html"
    ),
    slashes: true,
  });

  setupPushReceiver(mainWindow.webContents);

  // 기본 메뉴 숨기기
  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools(); // 개발자 툴 오픈
  } else {
    mainWindow.loadURL(indexPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);

// ▼　receiptio 테스트
// const receiptio = require("receiptio");
// const receiptmd = `^^배달 주문전표

// 주문번호 | 20220915173224123
// 결제방식 | 카드결제완료
// -
// 배달주소 |
// 부산 금정구 금정로 225 4층 |

// 연락처 |
// 010-2017-0700 |
// -
// 요청사항 |
// 사장님께 | 요청사항이 없습니다.
// 기사님께 | 요청사항이 없습니다.요청사항이 없습니다.요청사항이 없습니다.
// -
// 메뉴명 | 수량 | 금액
// -
// 짬뽕밥 | 1개 | 8500원
// - 기본옵션 : 짬뽕밥 |
// - 옵션금액 : 0원 |
// - 추가옵션 : 군만두 : 소 |
// - 옵션금액 : 2000원 |

// 탕수육 | 1개 | 13000원
// - 기본옵션 : 사이즈 : 소 |
// - 옵션금액 : 0원 |
// -
// 결제정보 |
// 총 주문금액 | 28500원
// 배달 팁 | 0원
// 포인트 | 0원
// 쿠폰 | 0원
// -
// ^^합계(결제완료) | ^^25,500원
// `;

// receiptio.print(receiptmd, "-d COM4 -p escpos -c 42").then((result: any) => {
//   console.log("receiptio ", result);
// });

// ▲　receiptio 테스트

const sqlite3 = require("sqlite3").verbose();

// 프린터 DB가 있을 시, DB에 레코드값을 있을 시 데이터 값 반환
ipcMain.on("getPrinterSettings", (event: any, data: any) => {
  const db = new sqlite3.Database(
    "./database/printerSetting.db",
    (err: any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Connected to the printerSetting database");
    }
  );

  db.serialize(() => {
    // db.run("DROP TABLE IF EXISTS settings");
    // return;

    db.run(
      `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        port TEXT DEFAULT '', 
        baudRate INTEGER DEFAULT 9600
      )`
    );

    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      "settings",
      (err: any, row: any) => {
        console.log("db.get table result :: ", row);
      }
    );

    db.get(`SELECT * FROM settings WHERE id=?`, 1, (err: any, row: any) => {
      console.log("db.get row result :: ", row);

      if (typeof row !== "undefined" && row.port && row.baudRate) {
        let data = {
          port: row.port,
          baudRate: row.baudRate,
        };

        event.sender.send("dbPrinterSettings", data);
      }
    });
  });

  db.close((err: any) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

// 프린터 DB 초기화
ipcMain.on("initPrintSettings", (event: any, data: any) => {
  const db = new sqlite3.Database(
    "./database/printerSetting.db",
    (err: any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Connected to the printerSetting database");
    }
  );

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        port TEXT DEFAULT '', 
        baudRate INTEGER DEFAULT 9600
      )`
    );

    db.each("SELECT * FROM settings", (err: any, row: any) => {
      console.log("search table error : ", err);
      console.log("search table content : ", row);
      console.log("search table id : ", row.id);
      console.log("search table port : ", row.port);
      console.log("search table baudRate : ", row.baudRate);
    });
  });

  db.close((err: any) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

// 프린터 포트 설정 및 DB 저장
ipcMain.on(
  "savingPrintSettings",
  (event: any, data: PrinterSettingsObjects) => {
    const { port, baudRate } = data;

    const db = new sqlite3.Database(
      "./database/printerSetting.db",
      (err: any) => {
        if (err) {
          return console.error("re connect error: ", err.message);
        }
        console.log("reConnected to the printerSetting database");
      }
    );

    db.serialize(() => {
      db.run(
        "INSERT or REPLACE INTO settings (id, port, baudRate) VALUES((SELECT id from settings WHERE id = 1), ?, ?)",
        [port, baudRate]
      );
    });

    db.each("SELECT * FROM settings", (err: any, row: any) => {
      console.error("update settings table error : ", err);
      console.log("update settings table content : ", row);
      console.log("update settings table port : ", row.port);
      console.log("update settings table baudRate : ", row.baudRate);
    });

    db.close((err: any) => {
      if (err) {
        return console.error("re connect close error: ", err.message);
      }
      console.log("reConnect the database close.");
    });
  }
);

// const device = new SerialPort({
//   path: 'COM4',
//   baudRate: 9600
// })
const options = { encoding: "cp949", width: 32 }; // cp949 or EUC-KR

// Serialport 리스트
ipcMain.on("requestPortsList", (event: any, data: any) => {
  console.log("serialPortsList called!");
  SerialPort.list().then((ports: any, err: any) => {
    // console.log("serial ports list : ", ports);

    let serialPortsArr: any[] = [];

    if (ports && ports.length > 0) {
      let sortArr = ports.filter((port: any) => port.path.startsWith("COM"));
      serialPortsArr = sortArr;
    }

    event.sender.send("responsePortList", serialPortsArr);
  });
});

// serialport 테스트 인쇄
ipcMain.on("testPrint", (event: any, data: any) => {
  const { port, baudRate } = data;

  const device = new escpos.SerialPort(port, { baudRate });
  const printer = new escpos.Printer(device, options);
  device.open(function (err: any) {
    console.log("serialport error", err);

    printer
      // .encode('EUC-KR')
      .align("CT")
      .style("B")
      .size(0.1, 0.1)
      .text("동네북 주문전표")
      .style("NORMAL")
      .size(0.01, 0.01)
      .tableCustom([
        { text: "사장님", align: "LEFT", width: 0.1 },
        { text: "요청사항이 없습니다.", align: "RIGHT", width: 0.9 },
      ])
      .drawLine()
      .text("tableRow")
      .drawLine()
      .tableRow([
        { text: "사장님", align: "LEFT", width: 0.1 },
        { text: "요청사항이 없습니다.", align: "RIGHT", width: 0.9 },
      ])
      .text("Custom No Line TABLE")
      .tableNoLine(["사장님", "요청사항이 없습니다."])
      .drawLine()
      .text("ORIGIN TABLE")
      .table(["사장님", "요청사항이 없습니다."])
      .cut()
      .close();
  });
});

// serialport 점표 인쇄
ipcMain.on("orderPrint", (event: any, data: any) => {
  // orderAddress02
  const {
    port,
    baudRate,
    orderId,
    orderPaymentType,
    orderType,
    orderAddress01,
    orderAddress03,
    orderAddressOld,
    orderContactNumber,
    requestToStore,
    requestToOfficer,
    requestToItem,
    orderMenus,
    totalOrderAmount,
    deliveryTip,
    point,
    coupon,
    totalPaymentAmount,
    orderStore,
    orderDateTime,
    origin,
  } = data;

  const device = new escpos.SerialPort(port, { baudRate });
  const printer = new escpos.Printer(device, options);
  device.open(function (err: any) {
    printer
      // .encode("EUC-KR")
      .size(0.1, 0.1)
      .align("CT")
      .style("B")
      .text(`${orderType} 주문전표`)
      .newLine()
      .newLine()
      .style("NORMAL")
      .size(0.01, 0.01)
      .align("LT")
      .size(0.01, 0.01)
      .table(["주문번호", `${orderId}`])
      .table(["결제방식", `${orderPaymentType}`])
      .drawLine()
      .text(`${orderType} 주소`)
      .text(`${orderAddress01} ${orderAddress03}`)
      .text(`${orderAddressOld}`)
      .text("연락처")
      .text(`${orderContactNumber}`)
      .drawLine()
      .text("요청사항")
      .table(["사장님", `${requestToStore}`])
      .tableCustom([
        { text: "사장님", align: "LEFT", width: 0.1 },
        { text: "요청사항이 없습니다.", align: "RIGHT", width: 0.9 },
      ])
      .table(["기사님", `${requestToOfficer}`])
      .table(["일회용 수저, 포크", `${requestToItem}`])
      .drawLine()
      .table(["메뉴명", "수량", "금액"])
      .drawLine();

    orderMenus.forEach((menus: any, index: number) => {
      printer
        .encode("EUC-KR")
        .style("NORMAL")
        .size(0.01, 0.01)
        .table([
          `${menus.it_name}`,
          `${menus.ct_qty}개`,
          `${menus.sum_price}원`,
        ]);

      if (menus.cart_option && menus.cart_option.length > 0) {
        menus.cart_option.forEach((defaultOption: any, index: number) => {
          printer
            .encode("EUC-KR")
            .style("NORMAL")
            .size(0.01, 0.01)
            .text(`└ 기본옵션 : ${defaultOption.ct_option}`)
            .text(`└ 옵션금액 : ${defaultOption.io_price}원`);
        });
      }

      if (menus.cart_add_option && menus.cart_add_option.length > 0) {
        menus.cart_add_option.forEach((addOption: any, index: number) => {
          printer
            .encode("EUC-KR")
            .style("NORMAL")
            .size(0.01, 0.01)
            .text(`└ 추가옵션 : ${addOption.ct_option}`)
            .text(`└ 옵션금액 : ${addOption.io_price}원`);
        });
      }

      printer.newLine();
    });

    printer
      .encode("EUC-KR")
      .style("NORMAL")
      .size(0.01, 0.01)
      .drawLine()
      .newLine()
      .text("결제정보")
      .newLine()
      .table(["총 주문금액", `${totalOrderAmount}`])
      .table(["배달 팁", `${deliveryTip}`])
      .table(["포인트", `${point}`])
      .table(["쿠폰", `${coupon}`])
      .drawLine()
      .table(["합계(결제완료)", `${totalPaymentAmount}`])
      .drawLine()
      .table(["주문매장", `${orderStore}`])
      .table(["주문번호", `${orderId}`])
      .table(["주문일시", `${orderDateTime}`])
      .drawLine()
      .text("원산지")
      .text(`${origin}`)
      .newLine()
      .cut()
      .close();
  });
});

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

import types from './types';

interface PrinterSetting {
  port: string,
  baudRate: string
}

export function updatePrinterPort(data: string) {

  return {
    type: types.UPDATE_PRINTER_PORT,
    port: data
  };
}

export function updatePrinterBaudRate(data: string) {

  return {
    type: types.UPDATE_PRINTER_BAUDRATE,
    baudRate: data
  };
}


export function updatePrinter(data: PrinterSetting) {

  return {
    type: types.UPDATE_PRINTER_SETTING,
    port: data.port,
    baudRate: data.baudRate
  };
}

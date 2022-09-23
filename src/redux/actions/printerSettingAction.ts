import { PrinterSettingsObjects } from "../../interfaces/serialport.interface";
import types from "./types";

export function updatePrinterPort(data: string) {
  return {
    type: types.UPDATE_PRINTER_PORT,
    port: data,
  };
}

export function updatePrinterBaudRate(data: number) {
  return {
    type: types.UPDATE_PRINTER_BAUDRATE,
    baudRate: data,
  };
}

export function updatePrinter(data: PrinterSettingsObjects) {
  return {
    type: types.UPDATE_PRINTER_SETTING,
    port: data.port,
    baudRate: data.baudRate,
  };
}

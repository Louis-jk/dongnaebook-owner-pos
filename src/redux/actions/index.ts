import * as loginAction from "./loginAction";
import * as orderAction from "./orderAction";
import * as printerSettingAction from "./printerSettingAction";
import * as checkOrderAction from "./checkOrderAction";
import * as orderDetailAction from "./orderDetailAction";
import * as storeAction from "./storeAction";
import * as menuControlAction from "./menuControlAction";

const ActionCreators = Object.assign(
  {},
  loginAction,
  orderAction,
  printerSettingAction,
  checkOrderAction,
  orderDetailAction,
  storeAction,
  menuControlAction
);

export default ActionCreators;

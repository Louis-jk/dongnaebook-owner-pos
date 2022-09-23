import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import loginReducer from "./loginReducer";
import OrderDetailReducer from "./OrderDetailReducer";
import allStoreReducer from "./allStoreReducer";
import orderReducer from "./orderReducer";
import printerSettingReducer from "./printerSettingReducer";
import checkOrderReducer from "./checkOrderReducer";
import menuControl from "./menuControl";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login", "orderDetail", "store"],
  // blacklist: ['']
};

const rootReducer = combineReducers({
  login: loginReducer,
  orderDetail: OrderDetailReducer,
  store: allStoreReducer,
  order: orderReducer,
  printerSetting: printerSettingReducer,
  checkOrder: checkOrderReducer,
  menuContr: menuControl,
});

export default persistReducer(persistConfig, rootReducer);

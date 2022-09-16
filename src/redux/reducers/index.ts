import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import loginReducer from './loginReducer';
import OrderDetailReducer from './OrderDetailReducer';
import allStoreReducer from './allStoreReducer';
import orderReducer from './orderReducer';
import checkOrderReducer from './checkOrderReducer';
import menuControl from './menuControl';
// import indexReducer from './indexReducer';
// import gpsReducer from './gpsReducer';
// import sconfReducer from './sconfReducer';
// import selectStoreReducer from './selectStoreReducer';
// import couponReducer from './couponReducer';
// import holidayReducer from './holidayReducer';
// import storeTimeReducer from './storeTimeReducer';
// import closeDayReducer from './closeDayReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['login', 'orderDetail', 'store'],
  // blacklist: ['']
};

const rootReducer = combineReducers({
  login: loginReducer,
  orderDetail: OrderDetailReducer,
  store: allStoreReducer,
  order: orderReducer,
  checkOrder: checkOrderReducer,
  menuContr: menuControl,
  // index: indexReducer,
  // gps: gpsReducer,

  // sconf: sconfReducer,
  // slctStore: selectStoreReducer,
  // coupon: couponReducer,
  // regularHoliday: holidayReducer,
  // storeTime: storeTimeReducer,
  // closedDay: closeDayReducer,
  // order: orderReducer
});

export default persistReducer(persistConfig, rootReducer);

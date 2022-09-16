import { type } from 'os';
import types from '../actions/types';

interface loginState {
  [key: string]: string | number;
}

const defaultState = {
  id: '',
  mt_id: '',
  mt_jumju_code: '',
  mt_jumju_key: '',
  mt_name: '',
  mt_nickname: '',
  mt_hp: '',
  mt_email: '',
  mt_level: '',
  mt_gubun: '',
  mt_point: 0,
  mt_sound: '',
  mt_coupon: 0,
  mt_print: '',
  mt_app_token: '',
  updateTime: '',
  fcmToken: '',
  mt_store: '',
  mt_ca_code: '',
  mb_ca_name: '',
  mt_addr: '',
  mt_lat: '',
  mt_lng: '',
  do_jumju_origin_use: '',
  mt_alarm_vol: 1,
};

const loginReducer = (state: loginState = defaultState, action: any) => {
  // For Debugger
  // console.log(state);

  switch (action.type) {
    case types.UPDATE_LOGIN_CK:
      return {
        id: action.id, // add
        mt_id: action.mt_id,
        mt_jumju_code: action.mt_jumju_code,
        mt_jumju_key: action.mt_jumju_key,
        mt_name: action.mt_name,
        mt_nickname: action.mt_nickname,
        mt_hp: action.mt_hp,
        mt_email: action.mt_email,
        mt_level: action.mt_level,
        mt_gubun: action.mt_gubun,
        mt_point: action.mt_point,
        mt_sound: action.mt_sound,
        mt_coupon: action.mt_coupon,
        mt_print: action.mt_print,
        mt_app_token: action.mt_app_token,
        mt_store: action.mt_store,
        updateTime: action.updateTime,
        mt_ca_code: action.mt_ca_code,
        mb_ca_name: action.mb_ca_name,
        mt_addr: action.mt_addr,
        mt_lat: action.mt_lat,
        mt_lng: action.mt_lng,
        do_jumju_origin_use: action.do_jumju_origin_use, // 원산지 출력 여부
        mt_alarm_vol: action.mt_alarm_vol, // 알림음 소리 볼륨
      };
    case types.UPDATE_FCM_TOKEN:
      return {
        ...state,
        mt_app_token: action.payload,
      };
    case types.SELECT_STORE:
      return {
        ...state,
        mt_jumju_code: action.mt_jumju_code,
        mt_store: action.mt_store,
      };
    case types.UPDATE_NOTIFY_COUNT:
      return {
        ...state,
        mt_sound: action.payload,
      };
    case types.UPDATE_AUTO_PRINT:
      return {
        ...state,
        mt_print: action.payload,
      };
    case types.UPDATE_ORIGIN_PRINT:
      return {
        ...state,
        do_jumju_origin_use: action.payload,
      };
    case types.UPDATE_ALARM_VOL:
      return {
        ...state,
        mt_alarm_vol: action.payload,
      };
    default:
      return state;
  }
};

export default loginReducer;

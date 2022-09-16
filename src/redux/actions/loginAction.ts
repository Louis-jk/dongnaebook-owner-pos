import types from './types';

// 최초 로그인시 업데이트
export function updateLogin(data: string) {
  const args = JSON.parse(data);

  return {
    type: types.UPDATE_LOGIN_CK,
    id: args.id ? args.id : null, // add
    mt_id: args.mt_id,
    mt_jumju_code: args.mt_jumju_code,
    mt_jumju_key: args.mt_jumju_key,
    mt_name: args.mt_name,
    mt_nickname: args.mt_nickname,
    mt_hp: args.mt_hp,
    mt_email: args.mt_email,
    mt_level: args.mt_level,
    mt_gubun: args.mt_gubun,
    mt_point: args.mt_point,
    mt_sound: args.mt_sound,
    mt_coupon: args.mt_coupon,
    mt_print: args.mt_print,
    mt_app_token: args.mt_app_token,
    updateTime: args.updateTime,
    mt_store: args.mt_store,
    mt_ca_code: args.mt_ca_code ? args.mt_ca_code : null, // add
    mb_ca_name: args.mb_ca_name ? args.mb_ca_name : null, // add
    mt_addr: args.mt_addr ? args.mt_addr : null, // add
    mt_lat: args.mt_lat ? args.mt_lat : null, // add
    mt_lng: args.mt_lng ? args.mt_lng : null, // add
    do_jumju_origin_use: args.do_jumju_origin_use, // add
    mt_alarm_vol: args.mt_alarm_vol, // add
  };
}

// 토큰 업데이트(firebase)
export function updateToken(data: string) {
  return {
    type: types.UPDATE_FCM_TOKEN,
    payload: data,
  };
}

// 알림 설정(1회, 2회, 3회)
export function updateNotify(data: string) {
  return {
    type: types.UPDATE_NOTIFY_COUNT,
    payload: data,
  };
}

// 알림 설정(1회, 2회, 3회)
export function updateAlarmVol(data: number) {
  return {
    type: types.UPDATE_ALARM_VOL,
    payload: data,
  };
}

// 주문 접수시 자동 프린트 여부
export function updateAutoPrint(data: string) {
  return {
    type: types.UPDATE_AUTO_PRINT,
    payload: data,
  };
}

// 원산지 출력 여부
export function updateOriginPrint(data: string) {
  return {
    type: types.UPDATE_ORIGIN_PRINT,
    payload: data,
  };
}

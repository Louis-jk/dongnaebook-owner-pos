import types from './types';

export function updateStore(store: any) {
  return {
    type: types.UPDATE_STORE,
    storeUpdate: store,
  };
}

export function selectStore(id: string, mt_jumju_id: string, mt_jumju_code: string, mt_store: string, mt_addr: string) {
  return {
    type: types.SELECT_STORE,
    id: id,
    mt_jumju_id: mt_jumju_id,
    mt_jumju_code: mt_jumju_code,
    mt_store: mt_store,
    mt_addr: mt_addr,
  };
}

export function closedStore(store: any) {
  console.log("closed Redux action", store);
  return {
    type: types.CLOSED_STORE,
    storeClosed: store,
  };
}

export function updateStoreOriginPrint(mt_id: string, origin: string) {
  console.log("updateOriginPrint Store id", mt_id);
  console.log("updateOriginPrint Store result", origin);
  // console.log("updateOriginPrint Store origin", origin);
  return {
    type: types.UPDATE_ORIGIN_PRINT_STORE,
    mt_id,
    origin,
  };
}
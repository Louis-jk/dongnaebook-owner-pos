import types from './types';

export function updateNewOrder(data: any) {
  const args = JSON.parse(data);
  
  return {
    type: types.UPDATE_NEW_ORDER_LIST,
    payload: args !== null ? args : []
  };
}

export function updateCheckOrder(data: any) {
  const args = JSON.parse(data);
  
  return {
    type: types.UPDATE_CHECK_ORDER_LIST,
    payload: args !== null ? args : []
  };
}

export function updateDeliveryOrder(data: any) {
  const args = JSON.parse(data);
  
  return {
    type: types.UPDATE_DELIVERY_ORDER_LIST,
    payload: args !== null ? args : []
  };
}

export function updateDoneOrder(data: any) {
  const args = JSON.parse(data);
  
  return {
    type: types.UPDATE_DONE_ORDER_LIST,
    payload: args !== null ? args : []
  };
}

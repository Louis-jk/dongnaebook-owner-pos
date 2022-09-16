import types from '../actions/types';

const defaultState = {
  newOrder: [],
  checkOrder: [],
  deliveryOrder: [],
  doneOrder: []
};

const order = (state = defaultState, action: any) => {
  // For Debugger
  
  switch (action.type) {
  case types.UPDATE_NEW_ORDER_LIST:
    return {
      ...state,
      newOrder: action.payload
    };
  case types.UPDATE_CHECK_ORDER_LIST:
    return {
      ...state,
      checkOrder: action.payload
    };
  case types.UPDATE_DELIVERY_ORDER_LIST:
    return {
      ...state,
      deliveryOrder: action.payload
    };
  case types.UPDATE_DONE_ORDER_LIST:
    return {
      ...state,
      doneOrder: action.payload
    };
  default:
    return state;
  }
};

export default order;
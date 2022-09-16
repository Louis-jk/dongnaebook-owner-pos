import types from '../actions/types';

const defaultState = {
  order: null,
  product: [],
  store: null
};

const OrderDetailReducer = (state = defaultState, action: any) => {
  // For Debugger
  // console.log(state);

  switch (action.type) {
  case types.UPDATE_ORDER_DETAIL:
    return {
      order: action.order,
      product: action.product,
      store: action.store
    };
  default:
    return state;
  }
};

export default OrderDetailReducer;

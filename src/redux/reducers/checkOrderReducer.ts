import types from '../actions/types';

const defaultState = {
  isChecked: false,
};

const checkOrder = (state = defaultState, action: any) => {
  // For Debugger

  switch (action.type) {
    case types.UPDATE_CHECKED:
      return {
        isChecked: action.payload,
      };
    default:
      return state;
  }
};

export default checkOrder;

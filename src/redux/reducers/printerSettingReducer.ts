import types from '../actions/types';

const defaultState = {
  port: '',
  baudRate: ''
};

const checkOrder = (state = defaultState, action: any) => {
  
  switch (action.type) {
    case types.UPDATE_PRINTER_PORT:
      return {
        ...state,
        port: action.port
      };
    case types.UPDATE_PRINTER_BAUDRATE:
      return {
        ...state,
        baudRate: action.baudRate
      };
    case types.UPDATE_PRINTER_SETTING:
      return {
        port: action.port,
        baudRate: action.baudRate
      };
    default:
      return state;
  }
};

export default checkOrder;

import types from '../actions/types';

// type inputType = 'order' | 'store';
interface menuSelect {
  [key: string]: string;
}

const defaultState = {
  selectType: 'order'
}

const menuControlReducer = (state: menuSelect = defaultState, action: any) => {
  
  switch(action.type) {
    case types.MENU_CONTROL_SELECT: 
      return {
        selectType: action.selectType
      }
    default:
      return state;
  }
}

export default menuControlReducer;
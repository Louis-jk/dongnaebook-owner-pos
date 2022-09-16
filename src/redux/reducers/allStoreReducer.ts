import types from '../actions/types';

interface Init {
  [key: string]: string;
}

interface State {
  allStore: Init[];
  selectedStore: Init;
}

const defaultState = {
    allStore: [],
    selectedStore: {
      id: '',
      mt_jumju_id: '',
      mt_jumju_code: '',
      mt_store: '',
      mt_addr: ''
    },
    closedStore: []
  };


const store = (state: State = defaultState, action: any) => {
  
  switch (action.type) {
  case types.UPDATE_STORE:
    return {
      ...state,
      allStore: [...action.storeUpdate]
    };
  case types.SELECT_STORE:
    return {
      ...state,
      selectedStore: {
        id: action.id,
        mt_jumju_id: action.mt_jumju_id,
        mt_jumju_code: action.mt_jumju_code,
        mt_store: action.mt_store,
        mt_addr: action.mt_addr
      }
    };
  case types.CLOSED_STORE:
    return {
      ...state,
      closedStore: action.storeClosed
    };
  case types.UPDATE_ORIGIN_PRINT_STORE:
    return {
      ...state,
      allStore: state.allStore.map(
        (store, index) => store.mt_id === action.mt_id ? {...store, do_jumju_origin_use: action.origin} 
                                                        : store
      )
    };
  default:
    return state;
  }
};

export default store;
import reducers from '../reducers';
import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
// import createSagaMiddleware from 'redux-saga';
// import logger from 'redux-logger';
// import thunk from 'redux-thunk';

// const sagaMiddleware = createSagaMiddleware();

export default function initStore() {
  const store = createStore(
    reducers,
    composeWithDevTools(),
  );
  return store;
}

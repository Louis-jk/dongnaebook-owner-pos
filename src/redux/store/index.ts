import reducers from "../reducers";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

export default function initStore() {
  const store = createStore(reducers, composeWithDevTools());
  return store;
}

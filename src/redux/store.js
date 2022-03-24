import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./reducers";

const logger = (store) => {
  return (next) => {
    return (action) => {
      // console.log("[Middleware] Dispatching ", action.type);
      const result = next(action);
      // console.log("[Middleware] next state", store.getState());
      return result;
    };
  };
};
// const composeEnhancers =
//   process.env.NODE_ENV === "development"
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     : null || compose;

export default createStore(
  rootReducer,
  // composeEnhancers(applyMiddleware(logger, thunk)),
  compose(applyMiddleware(logger, thunk)),
);

// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";

// const initialState = {};

// const middleware = [thunk];

// export default createStore(
//   rootReducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware)),
// );

import * as actionTypes from "../actions/actionTypes";
import storeUtility from "../utility";

const initialState = {
  loading: false,
  auth: false,
  user: "",
  token: "",
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return storeUtility.updateObject(state, {
        loading: false,
        auth: false,
        user: "",
        token: "",
        error: null,
      });

    case actionTypes.SET_LOADING:
      return storeUtility.updateObject(state, {
        error: null,
        loading: action.loading,
      });

    case actionTypes.ON_LOGIN:
      return storeUtility.updateObject(state, {
        auth: true,
        error: null,
        token: action.token,
        user: action.user,
        loading: false,
      });

    case actionTypes.ON_LOGOUT:
      return storeUtility.updateObject(state, {
        auth: false,
        error: null,
        token: "",
        user: "",
        loading: false,
      });

    case actionTypes.SET_USER:
      return storeUtility.updateObject(state, { user: action.user });

    default:
      return state;
  }
};

export default reducer;

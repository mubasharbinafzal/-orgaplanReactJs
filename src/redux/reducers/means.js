import * as actionTypes from "../actions/actionTypes";
import storeUtility from "../utility";

const initialState = {
  loading: false,
  means: "",
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_MEANS_DATA:
      return storeUtility.updateObject(state, {
        loading: false,
        means: action.means,
        error: null,
      });

    case actionTypes.ADD_MEANS_DATA:
      return storeUtility.updateObject(state, {
        loading: false,
        error: null,
      });
    case actionTypes.UPDATE_MEANS_DATA:
      return storeUtility.updateObject(state, {
        loading: false,
        error: null,
      });
      

    case actionTypes.DELETE_MEANS_DATA:
      return storeUtility.updateObject(state, {
        loading: false,
        error: null,
      });
    case actionTypes.SET_LOADING:
      return storeUtility.updateObject(state, {
        error: null,
        loading: action.loading,
      });

    default:
      return state;
  }
};

export default reducer;

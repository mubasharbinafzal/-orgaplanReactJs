import * as actionTypes from "../actions/actionTypes";
import storeUtility from "../utility";

const initialState = {
  site: null,
  company: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return storeUtility.updateObject(state, {
        site: null,
        company: null,
      });
    case actionTypes.SET_SITE:
      return storeUtility.updateObject(state, {
        site: action.site,
      });
    case actionTypes.SET_COMPANY:
      return storeUtility.updateObject(state, {
        company: action.company,
      });

    default:
      return state;
  }
};

export default reducer;

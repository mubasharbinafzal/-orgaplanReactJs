import * as actionTypes from "./actionTypes";

// Sync
export const reset_state = () => ({
  type: actionTypes.SET_SITE,
});

export const set_site = (site) => ({
  type: actionTypes.SET_SITE,
  site,
});

export const set_company = (company) => ({
  type: actionTypes.SET_SITE,
  company,
});

import * as actionTypes from "./actionTypes";

import GLOBALS from "../../globals";
import * as Notistack from "./notistack";
import * as Admin from "./admin";

// Sync
export const set_loading = (loading) => ({
  type: actionTypes.SET_LOADING,
  loading,
});

export const set_error = (error) => ({
  type: actionTypes.SET_LOADING,
  error,
});

export const set_login = (user, token) => {
  localStorage.setItem("orgaplan", token);
  return {
    type: actionTypes.ON_LOGIN,
    user: user,
    token: token,
    loading: false,
    error: null,
  };
};

export const set_logout = () => {
  localStorage.removeItem("orgaplan");
  return {
    type: actionTypes.ON_LOGOUT,
    loading: false,
    error: null,
  };
};

export const set_user = (user) => ({
  type: actionTypes.SET_USER,
  user: user,
});

// Async
export const do_logout = () => async (dispatch) => {
  dispatch(Admin.reset_state());
  dispatch(set_logout());
};

export const do_login = (email, password) => async (dispatch) => {
  try {
    dispatch(set_loading(true));
    const result = await GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.LOGIN,
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    dispatch(set_login(result.data.user, result.data.token));
    dispatch(
      Notistack.enqueueSnackbar(Notistack.snackBar(result.message, "success")),
    );
  } catch ({ message }) {
    dispatch(set_loading(false));
    dispatch(Notistack.enqueueSnackbar(Notistack.snackBar(message, "error")));
  }
};

export const checkLogin = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("orgaplan");
    if (!token) {
      dispatch(set_logout());
      return Promise.resolve();
    } else {
      const result = await GLOBALS.API({
        uri: GLOBALS.Constants.GET_PROFILE,
        token: token,
      });
      dispatch(set_login(result.data.user, token));
      return Promise.resolve();
    }
  } catch (err) {
    dispatch(set_logout());
    return Promise.resolve();
  }
};

// Other
export const postDataResult = (data) => ({
  type: actionTypes.POST_DATA,
  data,
  isLoading: false,
});

export const onApiError = (error) => ({
  type: actionTypes.SET_ERROR,
  error,
  isLoading: false,
});

export const postData = (endpoint, body) => {
  return async (dispatch) => {
    dispatch(set_loading(true));

    const response = await GLOBALS.API({
      method: "POST",
      uri: endpoint,
      body: JSON.stringify(body),
    });
    if (response.success) dispatch(postDataResult(response));
    else dispatch(onApiError(response));
  };
};

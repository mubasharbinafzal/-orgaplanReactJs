import * as actionTypes from "./actionTypes";
import GLOBALS from "../../globals";
import * as Notistack from "./notistack";
export const set_loading = (loading) => ({
  type: actionTypes.SET_LOADING,
  loading,
});
export const get_means = () => async (dispatch) => {
  try {
    dispatch(set_loading(true));
    const token = localStorage.getItem("orgaplan");

    const result = await GLOBALS.API({
      method: "GET",
      token: token,
      uri: GLOBALS.Constants.GET_MEAN_HISTORY,
    });

    dispatch({
      type: actionTypes.GET_MEANS_DATA,
      means: result.data,
      loading: false,
      error: null,
    });
  } catch ({ message }) {
    dispatch(set_loading(false));
    dispatch(Notistack.enqueueSnackbar(Notistack.snackBar(message, "error")));
  }
};

export const add_mean = (event) => async (dispatch) => {
  try {
    dispatch(set_loading(true));
    const token = localStorage.getItem("orgaplan");

    const result = await GLOBALS.API({
      method: "POST",
      token: token,
      uri: GLOBALS.Constants.CREATE_BOOKING_MEAN,
      body: JSON.stringify(event),
    });
    dispatch(
      Notistack.enqueueSnackbar(Notistack.snackBar(result.message, "success")),
    );
    dispatch({
      type: actionTypes.ADD_MEANS_DATA,
      loading: false,
      error: null,
    });
  } catch ({ message }) {
    dispatch(set_loading(false));
    dispatch(Notistack.enqueueSnackbar(Notistack.snackBar(message, "error")));
  }
};

export const update_mean = (event, id) => async (dispatch) => {
  try {
    dispatch(set_loading(true));
    const token = localStorage.getItem("orgaplan");

    const result = await GLOBALS.API({
      method: "PUT",
      token: token,
      uri: GLOBALS.Constants.Update_BOOKING_MEAN + "/" + id,
      body: JSON.stringify(event),
    });
    dispatch(
      Notistack.enqueueSnackbar(Notistack.snackBar(result.message, "success")),
    );
    dispatch({
      type: actionTypes.UPDATE_MEANS_DATA,
      loading: false,
      error: null,
    });
  } catch ({ message }) {
    dispatch(set_loading(false));
    dispatch(Notistack.enqueueSnackbar(Notistack.snackBar(message, "error")));
  }
};

export const delete_mean = (id) => async (dispatch) => {
  try {
    dispatch(set_loading(true));
    const token = localStorage.getItem("orgaplan");

    const result = await GLOBALS.API({
      method: "DELETE",
      token: token,
      uri: GLOBALS.Constants.Delete_BOOKING_MEAN + "/" + id,
    });
    dispatch(
      Notistack.enqueueSnackbar(Notistack.snackBar(result.message, "success")),
    );
    dispatch({
      type: actionTypes.DELETE_MEANS_DATA,
      means: result.data,
      loading: false,
      error: null,
    });
  } catch ({ message }) {
    dispatch(set_loading(false));
    dispatch(Notistack.enqueueSnackbar(Notistack.snackBar(message, "error")));
  }
};

// get single mean

// validate a mean

export const validateMean = (id) => async (dispatch) => {
  try {
    dispatch(set_loading(true));
    const token = localStorage.getItem("orgaplan");

    const result = await GLOBALS.API({
      method: "PUT",
      token: token,
      uri: GLOBALS.Constants.Update_BOOKING_MEAN_STATUS + "/" + id,
    });
    dispatch(
      Notistack.enqueueSnackbar(Notistack.snackBar(result.message, "success")),
    );
  } catch ({ message }) {
    dispatch(set_loading(false));
    dispatch(Notistack.enqueueSnackbar(Notistack.snackBar(message, "error")));
  }
};

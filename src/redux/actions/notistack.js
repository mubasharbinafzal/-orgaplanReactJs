import * as ActionTypes from "./actionTypes";

export const enqueueSnackbar = (notification) => {
  const key = notification.options && notification.options.key;

  return {
    type: ActionTypes.ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = (key) => ({
  type: ActionTypes.CLOSE_SNACKBAR,
  dismissAll: !key, // dismiss all if no key has been defined
  key,
});

export const removeSnackbar = (key) => ({
  type: ActionTypes.REMOVE_SNACKBAR,
  key,
});

export const snackBar = (message, variant) => ({
  message,
  options: {
    key: new Date().getTime() + Math.random(),
    variant,
  },
});

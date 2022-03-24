import * as AuthActions from "./auth";

import * as AdminActions from "./admin";
import * as NotiActions from "./notistack";
import * as MeanActions from "./means";

const exportsObj = {
  notistack: {
    snackbar: NotiActions.snackBar,
    closeSnackbar: NotiActions.closeSnackbar,
    removeSnackbar: NotiActions.removeSnackbar,
    enqueueSnackbar: NotiActions.enqueueSnackbar,
  },
  auth: {
    set_user: AuthActions.set_user,
    do_login: AuthActions.do_login,
    set_error: AuthActions.set_error,
    do_logout: AuthActions.do_logout,
    set_logout: AuthActions.set_logout,
    checkLogin: AuthActions.checkLogin,
    set_loading: AuthActions.set_loading,
  },
  admin: {
    set_site: AdminActions.set_site,
    set_company: AdminActions.set_company,
    reset_state: AdminActions.reset_state,
  },
  means: {
    get_means: MeanActions.get_means,
  },
};

export default exportsObj;

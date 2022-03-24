import { combineReducers } from "redux";

import auth from "./auth";
import admin from "./admin";
import notistack from "./notistack";
import means from "./means";

export default combineReducers({ auth, admin, notistack, means });

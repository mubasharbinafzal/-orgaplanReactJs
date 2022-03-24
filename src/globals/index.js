import API from "./API";
import I18n from "i18next";
import Styles from "./Styles";
import Data from "./Data.json";
import Constants from "./Constants";
import Functions from "./functions";
import * as ActionTypes from "../redux/actions/actionTypes";

let obj = {
  API,
  Constants,
  ActionTypes,
  I18n,
  Data,
  Styles,
  Functions,
};

export default obj;

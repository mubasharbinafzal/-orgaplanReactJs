import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Clients from "./Clients";
import AddClient from "./AddClient";
import VerifyClient from "./VerifyClient";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Clients} />
      <Route
        exact
        component={AddClient}
        path={props.match.path + "/add-client"}
      />
      <Route
        exact
        component={VerifyClient}
        path={props.match.path + "/verify-client"}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

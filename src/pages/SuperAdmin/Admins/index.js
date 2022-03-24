import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Admins from "./Admins";
import AddAdmin from "./AddAdmin";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Admins} />
      <Route
        exact
        path={props.match.path + "/add-admin"}
        component={AddAdmin}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

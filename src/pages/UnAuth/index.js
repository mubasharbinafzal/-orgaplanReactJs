import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./Login";
import Landing from "./Landing";
import Privacy from "./Privacy";

export default function UnAuth() {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/privacy" component={Privacy} />
      <Route path="/login" component={Login} />
      <Redirect from="*" to="/" />
    </Switch>
  );
}

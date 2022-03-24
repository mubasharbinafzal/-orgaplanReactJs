import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Mean from "./Means";
import Historic from "./Historic";
import MeanCalender from "../MeanCalender";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Mean} />
      <Route
        exact
        path={props.match.path + "/calendar"}
        component={MeanCalender}
      />
      <Route
        exact
        path={props.match.path + "/mean-history"}
        component={Historic}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

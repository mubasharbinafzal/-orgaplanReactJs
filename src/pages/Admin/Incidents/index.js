import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Incidents from "./Incidents";
import AddIncidents from "./addIncidents";
import EditIncidents from "./editIncidents";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Incidents} />
      {/* <Route path={props.match.path + "/:id"} component={Incidents} /> */}
      <Route
        exact
        path={props.match.path + "/add-incidents"}
        component={AddIncidents}
      />
      <Route
        exact
        path={props.match.path + "/edit-incidents"}
        component={EditIncidents}
      />

      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

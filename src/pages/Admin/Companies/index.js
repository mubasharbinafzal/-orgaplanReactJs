import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Users from "./UserList";
import AddUser from "./AddUser";
import Edit from "./EditCompany";
import Companies from "./Companies";
import AddCompany from "./AddCompany";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Companies} />
      <Route exact path={props.match.path + "/add"} component={AddCompany} />
      <Route exact path={props.match.path + "/edit/:id"} component={Edit} />
      <Route
        exact
        path={props.match.path + "/user-list/:id"}
        component={Users}
      />
      <Route exact path={props.match.path + "/add-user"} component={AddUser} />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

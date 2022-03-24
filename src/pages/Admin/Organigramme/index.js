import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import AddContact from "./AddContact";
import EditContact from "./EditContact";
import Organigramme from "./Organigramme";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Organigramme} />
      <Route
        exact
        path={props.match.path + "/add-contact"}
        component={AddContact}
      />
      <Route
        exact
        path={props.match.path + "/edit-contact"}
        component={EditContact}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

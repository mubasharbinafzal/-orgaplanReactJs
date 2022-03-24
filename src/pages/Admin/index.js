import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import Pic from "./Pic";
import Means from "./Means";
import Sites from "./Sites.js";
import AddSite from "./AddSite";
import Calender from "./Calender";
import Companies from "./Companies";
import Incidents from "./Incidents";
import AdminHeader from "./AdminHeader";
import Organigramme from "./Organigramme";

export default function AdminIndex() {
  const store = useSelector((state) => state.admin);

  return !store.site ? (
    <Switch>
      <Route exact path="/" component={Sites} />
      <Route exact path="/add-site" component={AddSite} />
      <Redirect from="*" to="/" />
    </Switch>
  ) : (
    <AdminHeader>
      <Switch>
        <Route exact path="/" component={Calender} />
        <Route path="/companies" component={Companies} />
        <Route path="/incidents" component={Incidents} />
        <Route path="/means" component={Means} />
        <Route path="/pic-interactive" component={Pic} />
        <Route path="/organigramme" component={Organigramme} />
        <Redirect from="*" to="/" />
      </Switch>
    </AdminHeader>
  );
}

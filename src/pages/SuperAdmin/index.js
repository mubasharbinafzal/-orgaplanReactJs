import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Home from "./Home";
import Logs from "./Logs";
import Sites from "./Sites";
import Admins from "./Admins";
import Clients from "./Clients";
import Invoices from "./Invoices";
import Header from "./SuperAdminHeader";

export default function UnAuth() {
  return (
    <Header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/clients" component={Clients} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/logs" component={Logs} />
        <Route path="/sites" component={Sites} />
        <Route path="/admins" component={Admins} />
        <Redirect from="*" to="/" />
      </Switch>
    </Header>
  );
}

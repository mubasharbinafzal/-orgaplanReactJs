import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Invoices from "./Invoices";
import AddInvoice from "./AddInvoice";
import EditInvoice from "./EditInvoice";

export default function Index(props) {
  return (
    <Switch>
      <Route
        exact
        path={props.match.path + "/add-invoice"}
        component={AddInvoice}
      />
      <Route
        exact
        component={EditInvoice}
        path={props.match.path + "/edit-invoice/:id"}
      />
      <Route
        exact
        component={Invoices}
        path={props.match.path + "/:clientId?"}
      />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

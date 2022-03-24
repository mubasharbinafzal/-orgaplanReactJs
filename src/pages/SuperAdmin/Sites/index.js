import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ZACs from "./ZACs";
import Sites from "./Sites";
import AddZAC from "./AddZAC";
import AddSite from "./AddSite";
import EditSite from "./EditSite";
import ArchivedSites from "./ArchivedSites";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/zacs"} component={ZACs} />
      <Route exact path={props.match.path + "/add-zac"} component={AddZAC} />
      <Route exact path={props.match.path + "/add-site"} component={AddSite} />
      <Route
        exact
        component={EditSite}
        path={props.match.path + "/edit-site/:siteId"}
      />
      <Route
        exact
        path={props.match.path + "/archives"}
        component={ArchivedSites}
      />
      <Route exact path={props.match.path + "/:clientId?"} component={Sites} />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

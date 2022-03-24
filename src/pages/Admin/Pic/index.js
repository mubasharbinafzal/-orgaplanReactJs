import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// import Pic from "./Pic";
import Pic from "./PicCanvas";

export default function Index(props) {
  return (
    <Switch>
      <Route exact path={props.match.path + "/"} component={Pic} />
      <Redirect from="*" to={props.match.path + "/"} />
    </Switch>
  );
}

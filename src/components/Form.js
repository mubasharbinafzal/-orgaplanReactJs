import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import GLOBALS from "../globals";

const Root = (props) => {
  const useStyles = makeStyles((theme) => ({
    form: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      maxWidth: props.maxWidth,
      justifyContent: "center",
    },
  }));
  const classes = useStyles();

  return (
    <div className={`${classes.form} ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

const Form = (props) => {
  const useStyles = makeStyles((theme) => ({
    form: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: props.maxWidth,
    },
  }));
  const classes = useStyles();

  return (
    <form
      {...props}
      className={`${classes.form} ${props.className}`}
      onSubmit={props.onSubmit}
      style={props.style}
    >
      {props.children}
    </form>
  );
};

const Item = (props) => {
  const useStyles = makeStyles((theme) => ({
    formItem: {
      width: props.width || "100%",
      margin: props.margin
        ? props.margin
        : props.noMargin
        ? 0
        : `${GLOBALS.Styles.margin}px 0`,
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={`${classes.formItem} ${props.className}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

const Row = (props) => {
  const useStyles = makeStyles((theme) => ({
    formRow: {
      display: "flex",
      width: props.width || "100%",
      flexDirection: props.flexDirection || "row",
      alignItems: props.alignItems || "flex-start",
      justifyContent: props.justifyContent || "space-between",
      margin: props.margin
        ? props.margin
        : props.noMargin
        ? 0
        : `${GLOBALS.Styles.margin}px 0`,
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={`${classes.formRow} ${props.className}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

const RowItem = (props) => {
  const useStyles = makeStyles((theme) => ({
    formRowItem: {
      width: props.width || "48%",
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={`${classes.formRowItem} ${props.className}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

const Column = (props) => {
  const useStyles = makeStyles((theme) => ({
    formColumn: {
      display: "flex",
      width: props.width || "100%",
      alignItems: props.alignItems || "flex-start",
      flexDirection: props.flexDirection || "column",
      justifyContent: props.justifyContent || "space-between",
      margin: props.margin
        ? props.margin
        : props.noMargin
        ? 0
        : `${GLOBALS.Styles.margin}px 0`,
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={`${classes.formColumn} ${props.className}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

const ButtonContainer = (props) => {
  const useStyles = makeStyles((theme) => ({
    formButtonContainer: {
      display: "flex",
      width: props.width || "100%",
      alignItems: props.alignItems || "center",
      flexDirection: props.flexDirection || "row",
      justifyContent: props.justifyContent || "center",
      margin: props.margin
        ? props.margin
        : props.noMargin
        ? 0
        : GLOBALS.Styles.marginButtonContainer,
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={`${classes.formButtonContainer} ${props.className}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

const items = {
  Root,
  Form,
  Item,
  Row,
  RowItem,
  Column,
  ButtonContainer,
};

export default items;

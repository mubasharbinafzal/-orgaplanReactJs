import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "./custom.css";

export default function PhoneBox(props) {
  const theme = useTheme();

  const error = props.disabled
    ? theme.palette.custom.disabled
    : theme.palette.error.main;

  const white = theme.palette.common.white;
  const color = props.disabled
    ? theme.palette.custom.disabled
    : props.error
    ? error
    : theme.palette.primary.contrastText;
  const borderColor = props.disabled
    ? theme.palette.custom.disabled
    : props.error
    ? error
    : theme.palette.grey[100];

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
      width: "100%",
    },
    input: {
      border: 0,
      outline: 0,
      height: 45,
      color: color,
      width: "100%",
      borderWidth: 1,
      display: "flex",
      overflow: "hidden",
      padding: "14px 29px",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
      textAlign: props.textAlign ? props.textAlign : "left",
      transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
      "&::placeholder": {
        color: color,
      },
    },
    error: {
      color: error,
      fontWeight: 400,
      position: "absolute",
      fontSize: theme.typography.pxToRem(12),
    },
  }));
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${props.className}`} style={props.style}>
      <input
        disabled={true}
        value={"+"}
        style={{
          position: "absolute",
          left: 6,
          top: 1,
          border: 0,
          backgroundColor: "white",
          height: 42,
          width: "5%",
          color: color,
        }}
      />
      <input
        name={props.name}
        type={props.type}
        accept={props.accept}
        value={props.value}
        max={props.max}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        className={classes.input}
        onChange={props.onChange}
        required={props.required}
        disabled={props.disabled}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        style={props.disabled ? { cursor: "not-allowed" } : {}}
      />
      {props.error !== "" && (
        <span className={classes.error}>{props.error}</span>
      )}
    </div>
  );
}

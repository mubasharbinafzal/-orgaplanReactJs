import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

export default function Input(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const primaryText = theme.palette.primary.contrastText;

  const white = theme.palette.common.white;
  const color = props.error ? error : primaryText;
  const borderColor = props.error ? error : theme.palette.grey[100];

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
      width: "100%",
    },
    select: {
      border: 0,
      outline: 0,
      height: 45,
      color: color,
      width: "100%",
      borderWidth: 1,
      display: "flex",
      // textIndent: "40%",
      overflow: "hidden",
      padding: "10px 12px",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
      textAlign: props.textAlign ? props.textAlign : "center",
      transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
      "&::placeholder": {
        color: color,
      },
      [theme.breakpoints.down("sm")]: {
        width: 225,
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
      <select
        name={props.name}
        value={props.value}
        selected={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        className={classes.select}
        style={props.disabled ? { cursor: "not-allowed" } : {}}
      >
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {props.values.map((item, index) => (
          <option key={Date.now() + index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {props.error !== "" && (
        <span className={classes.error}>{props.error}</span>
      )}
    </div>
  );
}

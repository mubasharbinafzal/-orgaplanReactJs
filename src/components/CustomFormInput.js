import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

export default function Input(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;

  const white = theme.palette.common.white;
  const color = props.error ? error : theme.palette.primary.contrastText;
  const borderColor = props.error ? error : theme.palette.grey[100];

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
      textAlign: "center",
      padding: "14px 12px",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
      transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
      "&::placeholder": {
        color: color,
      },
    },
    textArea: {
      border: 0,
      outline: 0,
      color: color,
      width: "100%",
      resize: "none",
      borderWidth: 1,
      display: "flex",
      overflow: "hidden",
      padding: "14px 12px",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
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
      {props.textArea ? (
        <textarea
          name={props.name}
          rows={props.rows}
          value={props.value}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          onChange={props.onChange}
          disabled={props.disabled}
          readOnly={props.readOnly}
          maxLength={props.maxLength}
          minLength={props.minLength}
          className={classes.textArea}
          placeholder={props.placeholder}
        />
      ) : props.type === "date" ? (
        <input
          type="text"
          name={props.name}
          value={props.value}
          className={classes.input}
          // startIcon={Images.calender}
          onChange={props.onChange}
          disabled={props.disabled}
          placeholder={props.placeholder}
          onFocus={(e) => {
            e.target.type = "date";
            props.focus && props.onFocus(e);
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              e.target.type = "text";
            }
            props.onBlur && props.onBlur(e);
          }}
        />
      ) : (
        <input
          name={props.name}
          type={props.type}
          value={props.value}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          className={classes.input}
          onChange={props.onChange}
          disabled={props.disabled}
          placeholder={props.placeholder}
        />
      )}
      {props.error !== "" && (
        <span className={classes.error}>{props.error}</span>
      )}
    </div>
  );
}

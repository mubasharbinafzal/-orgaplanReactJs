import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TimePicker } from "antd";

export default function Input(props) {
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
    error: {
      color: error,
      fontWeight: 400,
      position: "absolute",
      fontSize: theme.typography.pxToRem(12),
    },
  }));
  const classes = useStyles();

  const datepickerStyle = {
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
  };

  return (
    <div className={`${classes.root} ${props.className}`} style={props.style}>
      <TimePicker
        size="large"
        format="HH:mm"
        showNow={false}
        name={props.name}
        value={props.value}
        style={datepickerStyle}
        required={props.required}
        disabledHours={() => props.disabledHours}
        disabledMinutes={props.disabledMinutes}
        disabled={props.disabled}
        onChange={props.onChange}
        minuteStep={props.minuteStep}
        placeholder={props.placeholder}
      />
      {props.error !== "" && (
        <span className={classes.error}>{props.error}</span>
      )}
    </div>
  );
}

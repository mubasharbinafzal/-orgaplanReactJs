import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { DatePicker } from "antd";
import moment from "moment";
import "./custom.css";

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
    input: {
      border: 0,
      outline: 0,
      height: 45,
      color: color,
      width: "100%",
      borderWidth: 1,
      display: "flex",
      overflow: "hidden",
      padding: "14px 12px",
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
    textArea: {
      border: 0,
      outline: 0,
      color: color,
      width: props.width ? props.width : "100%",
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
      {props.textArea ? (
        <textarea
          name={props.name}
          value={props.value}
          onBlur={props.onBlur}
          rows={props.rows || 5}
          cols={props.cols || 5}
          onFocus={props.onFocus}
          required={props.required}
          onChange={props.onChange}
          disabled={props.disabled}
          readOnly={props.readOnly}
          maxLength={props.maxLength}
          minLength={props.minLength}
          className={classes.textArea}
          placeholder={props.placeholder}
          style={props.disabled ? { cursor: "not-allowed" } : {}}
        />
      ) : props.type === "date" ? (
        <DatePicker
          size={"large"}
          max={props.max}
          min={props.min}
          name={props.name}
          showToday={false}
          required={props.required}
          value={props.value ? moment(props.value) : 0}
          format="DD-MM-YYYY"
          disabled={props.disabled}
          placeholder={props.placeholder}
          onChange={(e) => {
            const event = {
              target: {
                name: props.name,
                value: e && e.format("YYYY-MM-DD"),
              },
            };
            props.onChange(event);
          }}
          //  disabledDate={props.disabledDate}  // asfand line
          disabledDate={(d) =>
            (props.min && d.isBefore(props.min)) ||
            (props.max && d.isSameOrAfter(props.max))
          }
          style={{
            ...datepickerStyle,
            cursor: props.disabled ? "not-allowed" : "default",
          }}
        />
      ) : (
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
      )}
      {props.error !== "" && (
        <span className={classes.error}>{props.error}</span>
      )}
    </div>
  );
}

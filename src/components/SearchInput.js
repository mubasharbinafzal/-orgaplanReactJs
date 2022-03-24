import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import { ReactComponent as Search } from "../assets/icons/Search.svg";

export default function Input(props) {
  const theme = useTheme();

  const primary = theme.palette.common.white;
  const primaryText = theme.palette.primary.contrastText;

  const color = primaryText;
  const backgroundColor = props.color || primary;

  const useStyles = makeStyles((theme) => ({
    container: {
      height: 45,
      color: color,
      width: "100%",
      maxWidth: 300,
      borderWidth: 1,
      display: "flex",
      overflow: "hidden",
      position: "relative",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: backgroundColor,
      borderColor: theme.palette.grey.custom,
      transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
    },
    endAdornment: {
      width: "12%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      border: 0,
      outline: 0,
      fontSize: 16,
      color: color,
      width: "100%",
      height: "100%",
      textAlign: "center",
      padding: "14px 12px",
      backgroundColor: "transparent",
      "&::placeholder": {
        color: color,
      },
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={`${classes.container} ${props.className}`}
      style={props.style}
    >
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
      <IconButton onClick={props.onClick} disabled={props.buttonDisabled}>
        <Search style={{ width: 16, height: 16 }} />
      </IconButton>
    </div>
  );
}

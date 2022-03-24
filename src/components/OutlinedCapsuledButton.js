import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

export default function OutlinedCapsuledButton(props) {
  const useStyles = makeStyles((theme) => ({
    button: {
      fontSize: 10,
      borderRadius: 4,
      padding: "2px 8px",
      fontWeight: props.bold ? "bold" : "light",
      color: theme.palette.primary.contrastText,
      border: props.border || `1px solid ${theme.palette.grey[200]}`,
    },
  }));

  const classes = useStyles();

  return (
    <Button
      to={props.to}
      onClick={props.onClick}
      endIcon={props.endIcon}
      disabled={props.disabled}
      startIcon={props.startIcon}
      fullWidth={props.fullWidth}
      type={props.type || "button"}
      variant={props.variant || "outlined"}
      component={props.component || "button"}
      className={classes.button + " " + props.className}
      style={props.style}
    >
      {props.children}
      {props.text}
    </Button>
  );
}

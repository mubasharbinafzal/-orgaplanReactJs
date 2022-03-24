import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

export default function ButtonComponent(props) {
  const useStyles = makeStyles((theme) => ({
    button: {
      padding: "2px 8px",
      color: theme.palette.common.white,
      backgroundColor: props.color || theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
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
      variant={props.variant || "contained"}
      component={props.component || "button"}
      className={classes.button + " " + props.className}
      style={props.style}
    >
      {props.children}
      {props.text}
    </Button>
  );
}

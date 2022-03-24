import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Loader from "./Loader";

export default function ButtonComponent(props) {
  const useStyles = makeStyles((theme) => ({
    button: {
      height: 42,
      width: props.width,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      color: props.textColor || theme.palette.common.white,
      backgroundColor: props.color || theme.palette.primary.main,
      "&:hover": {
        backgroundColor: props.color || theme.palette.primary.main,
      },
    },
    label: {
      width: "100%",
      whiteSpace: "nowrap",
      color: props.textColor || theme.palette.common.white,
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
      size={props.size || "large"}
      type={props.type || "button"}
      variant={props.variant || "contained"}
      component={props.component || "button"}
      fullWidth={props.fullWidth === false ? false : true}
      className={classes.button + " " + props.className}
      style={props.style}
      classes={{ label: classes.label }}
    >
      {props.children}
      <Typography noWrap variant="button" className={classes.label}>
        {props.loading ? <Loader.Progress /> : props.text}
      </Typography>
    </Button>
  );
}

import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export default function SubHeading(props) {
  const useStyles = makeStyles((theme) => ({
    subHeading: {
      marginBottom: props.noMargin ? 0 : 10,
    },
    primary: {
      fontSize: theme.typography.pxToRem(18),
      color: theme.palette.primary.contrastText,
      fontWeight: props.bold ? "bold" : "normal",
    },
    secondary: {
      fontWeight: "normal",
      fontSize: theme.typography.pxToRem(13),
      color: theme.palette.primary.contrastText,
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={classes.subHeading + " " + props.className}
      style={props.style}
    >
      <Typography className={classes.primary}>{props.primary}</Typography>
      {props.secondary && (
        <Typography className={classes.secondary}>{props.secondary}</Typography>
      )}
    </div>
  );
}

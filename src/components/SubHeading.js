import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export default function SubHeading({
  className,
  noMargin,
  bold,
  topPadding,
  ...props
}) {
  const useStyles = makeStyles((theme) => ({
    subHeading: {
      marginBottom: noMargin ? 0 : 10,
      paddingTop: topPadding && 20,
      fontSize: props.fontSize || theme.typography.pxToRem(18),
      color: theme.palette.primary.contrastText,
      fontWeight: bold ? "bold" : "normal",
    },
  }));
  const classes = useStyles();

  return (
    <Typography className={classes.subHeading + " " + className} {...props}>
      {props.primary}
    </Typography>
  );
}

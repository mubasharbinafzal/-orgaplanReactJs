import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

export default function SmallText({ className, bold, noMargin, ...props }) {
  const useStyles = makeStyles((theme) => ({
    text: {
      textDecoration: "none",
      fontWeight: bold ? "bold" : "normal",
      marginBottom: noMargin ? 0 : 10,
      paddingBottom: props.underline ? 3 : 0,
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.primary.contrastText,
      textAlign: props.textAlign ? props.textAlign : "left",
      borderBottom: props.underline
        ? `2px solid ${theme.palette.primary.contrastText}`
        : 0,
      "&:hover": {
        textDecoration: "none",
        color: props.to && theme.palette.blue,
        borderBottom: props.underline ? `2px solid ${theme.palette.blue}` : 0,
      },
    },
  }));
  const classes = useStyles();

  return props.to ? (
    <Link
      to={props.to}
      className={classes.text + " " + className}
      style={props.style}
    >
      {props.primary}
    </Link>
  ) : (
    <Typography
      className={classes.text + " " + className}
      style={props.style}
      {...props}
    >
      {props.primary}
    </Typography>
  );
}

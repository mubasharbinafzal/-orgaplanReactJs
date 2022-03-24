import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const Card = (props) => {
  const useStyles = makeStyles((theme) => ({
    card: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: theme.shadows[25],
      justifyContent: "space-between",
      height: !props.disableHeight && "100%",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      padding: props.padding ? props.padding : 15,
      cursor: props.onClick ? "pointer" : "default",
    },
  }));
  const classes = useStyles();

  return (
    <div
      style={props.style}
      onClick={props.onClick}
      className={`${classes.card} ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export default Card;

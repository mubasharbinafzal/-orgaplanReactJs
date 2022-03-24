import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    overflow: "hidden",
    overflowY: "scroll",
  },
  headerContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: "20px",
    // justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
    cursor: "pointer",
    textAlign: "left",
    color: "rgba(0, 0, 0, 0.54)",
  },
  headerTitle: {
    flex: 1,
    margin: 0,
    textAlign: "center",
    whiteSpace: "nowrap",
    color: "rgba(0, 0, 0, 0.54)",
  },
  headerRight: {
    flex: 1,
    display: "grid",
    cursor: "pointer",
    placeItems: "end",
    color: "rgba(0, 0, 0, 0.54)",
  },
  body: {
    width: "100%",
  },
  actions: {
    display: "flex",
    padding: "20px 0px",
    flexDirection: "column",
    alignItems: "center",
  },

  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Transition}
    >
      <div className={classes.root}>
        <div className={classes.headerContainer}>
          <div className={classes.headerLeft}> </div>
          <h2 className={classes.headerTitle}>{props.title}</h2>
          <div className={classes.headerRight}>
            <CloseIcon onClick={props.onClose} />
          </div>
        </div>
        <div className={classes.body}>{props.body}</div>
        {props.actions && (
          <div className={classes.actions}>{props.actions}</div>
        )}
      </div>
    </Dialog>
  );
};

export default Modal;

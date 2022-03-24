import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    overflow: "hidden",
    overflowY: "auto",
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
    placeItems: "end",
    color: "rgba(0, 0, 0, 0.54)",
  },
  onClose: { cursor: "pointer" },
  body: {
    width: "100%",
  },
  actions: {
    display: "flex",
    padding: "20px 0px",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Modal = (props) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth={props.maxWidth || "md"}
      fullWidth={true}
      open={props.open}
      onClose={props.onClose}
    >
      <div className={classes.root}>
        <div className={classes.headerContainer}>
          <div className={classes.headerLeft}> </div>
          <h2 className={classes.headerTitle}>{props.title}</h2>
          <div className={classes.headerRight}>
            <CloseIcon onClick={props.onClose} className={classes.onClose} />
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

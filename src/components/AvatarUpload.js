import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import GLOBALS from "../globals";
import Actions from "../redux/actions";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

export default function FormMultipleUpload(props) {
  const theme = useTheme();

  const white = theme.palette.common.white;

  const useStyles = makeStyles((theme) => ({
    root: {
      width: 100,
      outline: 0,
      height: 100,
      display: "grid",
      cursor: "pointer",
      position: "relative",
      placeItems: "center",
      backgroundColor: white,
    },
    image: {
      width: "100%",
      height: "100%",
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
    },
    plus: {
      zIndex: 10,
      width: "40%",
      height: "40%",
      position: "absolute",
      color: theme.palette.common.white,
    },
  }));

  const classes = useStyles();
  const dispatch = useDispatch();
  const [update, setUpdate] = useState(false);

  return (
    <div
      className={`${classes.root} ${props.className}`}
      style={props.style}
      onClick={() => document.getElementById(`fileinput`).click()}
    >
      {update && ""}
      {!props.disabled && <Plus className={classes.plus} />}
      <Avatar
        alt="avatar"
        variant="circular"
        src={props.value.uri}
        className={classes.image}
      />
      <input
        hidden
        type="file"
        id={`fileinput`}
        disabled={props.disabled}
        onChange={(e) => {
          const file = e.target.files[0];
          let fileSize = GLOBALS.Constants.FILE_SIZE;
          let fileTypes = ["image/png", "image/jpg", "image/jpeg"];
          if (props.fileTypes) {
            fileTypes = props.fileTypes;
          }
          if (props.fileSize) {
            fileSize = props.fileSize;
          }
          if (
            file &&
            file.size <= fileSize &&
            fileTypes.some((typ) => typ === file.type)
          ) {
            props.onChange(file);
            setUpdate((st) => !st);
          } else {
            dispatch(
              Actions.notistack.enqueueSnackbar(
                Actions.notistack.snackbar(
                  "Max size can be 10MB of types: PNG, JPEG, JPG",
                  "error",
                ),
              ),
            );
          }
        }}
      />
    </div>
  );
}

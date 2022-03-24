import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ClearIcon from "@material-ui/icons/Clear";

import Actions from "../redux/actions";
import GLOBALS from "../globals";
import Form from "./Form";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

export default function FormMultipleUpload(props) {
  const theme = useTheme();

  const white = theme.palette.common.white;
  const errorColor = theme.palette.error.main;
  const borderColor = props.disabled
    ? theme.palette.custom.disabled
    : props.error
    ? errorColor
    : theme.palette.grey[100];

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      position: "relative",
    },
    container: {
      width: 45,
      height: 45,
      outline: 0,
      borderWidth: 1,
      display: "grid",
      cursor: "pointer",
      borderStyle: "solid",
      placeItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
    },
    images: {
      marginTop: 15,
    },
    imageWrapper: {
      marginLeft: 15,
      position: "relative",
      width: 45,
      height: 45,
    },
    image: {
      width: "100%",
      height: "100%",
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
    },
    imageCross: {
      top: 4,
      right: 4,
      width: 10,
      height: 10,
      fontSize: 8,
      display: "grid",
      cursor: "pointer",
      position: "absolute",
      borderRadius: "100%",
      placeItems: "center",
      color: theme.palette.common.white,
      backgroundColor: theme.palette.common.black,
    },
    error: {
      fontWeight: 400,
      color: errorColor,
      position: "absolute",
      fontSize: theme.typography.pxToRem(12),
    },
  }));

  const classes = useStyles();
  const dispatch = useDispatch();
  const [update, setUpdate] = useState(false);

  const onAdd = (e) => {
    const file = e.target.files[0];

    let fileSize = GLOBALS.Constants.FILE_SIZE;
    let fileTypes = ["image/png", "image/jpg", "image/jpeg"];
    let errorTypes = "PNG, JPEG, JPG";

    if (props.fileTypes) fileTypes = props.fileTypes;
    if (props.fileSize) fileSize = props.fileSize;
    if (props.errorTypes) errorTypes = props.errorTypes;
    if (
      file &&
      file.size <= fileSize &&
      fileTypes.some((typ) => typ === file.type)
    ) {
      const uri = URL.createObjectURL(file);
      let newValues = props.values;
      props.multiple
        ? newValues.push({ key: newValues.length, file: file, uri: uri })
        : (newValues[0] = { key: newValues.length, file: file, uri: uri });
      props.onChange(newValues);
      document.getElementById(`fileinput-${props.name}`).value = "";
      setUpdate((st) => !st);
    } else {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(
            `Max size can be ${fileSize / 1048576}MB of types: ${errorTypes}`,
            "error",
          ),
        ),
      );
    }
  };

  const handleDelete = (value) => () => {
    const newValues = props.values.filter((chip) => chip.key !== value.key);
    props.onChange(newValues);
    setUpdate((st) => !st);
  };

  return (
    <Form.Row
      noMargin
      style={props.style}
      justifyContent="flex-start"
      className={`${classes.root} ${props.className}`}
    >
      <div>
        <div
          className={classes.container}
          style={props.disabled ? { cursor: "not-allowed" } : {}}
          onClick={() => {
            !props.disabled &&
              document.getElementById(`fileinput-${props.name}`).click();
          }}
        >
          <Plus style={{ width: 20, height: 20 }} />
          <input
            hidden
            type="file"
            onChange={onAdd}
            onBlur={props.onBlur}
            accept={props.fileTypes}
            id={`fileinput-${props.name}`}
          />
        </div>
        {props.error !== "" && (
          <span className={classes.error}>{props.error}</span>
        )}
      </div>
      {update && ""}
  
      {props.values.map((value, index) => (
        <div className={classes.imageWrapper} key={index}>
          <Avatar
            variant="square"
            className={classes.image}
            src={
              value.file ? value.uri : GLOBALS.Constants.BASE_URL + value.uri
            }
            alt={props.name}
          />
          {!props.disabled && (
            <div onClick={handleDelete(value)} className={classes.imageCross}>
              <ClearIcon fontSize="inherit" color="inherit" />
            </div>
          )}
        </div>
      ))}
    </Form.Row>
  );
}

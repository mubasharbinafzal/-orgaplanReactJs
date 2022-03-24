import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

export default function MultiAdderInput(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const white = theme.palette.common.white;
  const primaryColor = props.disabled
    ? theme.palette.custom.disabled
    : theme.palette.primary.contrastText;
  const borderColor = props.disabled
    ? theme.palette.custom.disabled
    : props.error
    ? error
    : theme.palette.grey[100];
  const color = props.disabled
    ? theme.palette.custom.disabled
    : props.error
    ? error
    : theme.palette.primary.contrastText;

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
    },
    container: {
      border: 0,
      outline: 0,
      height: 45,
      color: color,
      width: "100%",
      borderWidth: 1,
      display: "flex",
      overflow: "hidden",
      padding: "14px 12px",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
      transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
      "&::placeholder": {
        color: color,
      },
    },
    input: {
      border: 0,
      outline: 0,
      width: "100%",
      height: "100%",
      padding: "14px 5px",
      color: color,
      backgroundColor: "transparent",
      "&::placeholder": {
        color: color,
      },
    },
    endAdornment: {
      width: "12%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    chips: {
      margin: 0,
      marginTop: 15,
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      justifyContent: "center",
    },
    chip: {
      color: primaryColor,
      margin: theme.spacing(0.5),
    },
    error: {
      top: 45,
      color: error,
      fontWeight: 400,
      position: "absolute",
      fontSize: theme.typography.pxToRem(12),
    },
  }));
  const classes = useStyles();

  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(true);

  const onAdd = () => {
    if (props.validate) {
      if (!props.validate(text)) {
        setIsValid(true);
        let newValues = props.values;
        newValues.push({ key: props.values.length, label: text });
        props.onChange(newValues);
        setText("");
      } else {
        setIsValid(false);
      }
    } else {
      let newValues = props.values;
      newValues.push({ key: props.values.length, label: text });
      props.onChange(newValues);
      setText("");
    }
  };

  const handleDelete = (chipToDelete) => () => {
    const newValues = props.values.filter(
      (chip) => chip.key !== chipToDelete.key,
    );
    props.onChange(newValues);
  };
  return (
    <div className={`${classes.root} ${props.className}`} style={props.style}>
      <div className={classes.container}>
        <input
          value={text}
          name={props.name}
          type={props.type}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          className={classes.input}
          disabled={props.disabled}
          placeholder={props.placeholder}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={classes.endAdornment}>
          <IconButton onClick={onAdd} disabled={props.disabled || !text}>
            <Plus style={{ width: 20, height: 20 }} />
          </IconButton>
        </div>
      </div>
      <ul className={classes.chips}>
        {props.values ? (
          props.values.map((data) => (
            <li key={data.key}>
              <Chip
                label={data.label}
                className={classes.chip}
                onDelete={handleDelete(data)}
              />
            </li>
          ))
        ) : (
          <li></li>
        )}
      </ul>
      {!isValid && <span className={classes.error}>{props.validateError}</span>}
      {props.error && <span className={classes.error}>{props.error}</span>}
    </div>
  );
}

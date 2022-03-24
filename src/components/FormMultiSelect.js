import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const primaryText = theme.palette.primary.contrastText;

  const white = theme.palette.common.white;
  const color = props.error ? error : primaryText;
  const borderColor = props.error ? error : theme.palette.grey[100];

  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
      width: "100%",
    },
    select: {
      border: 0,
      outline: 0,
      height: 45,
      color: color,
      width: "100%",
      borderWidth: 1,
      display: "flex",
      overflow: "hidden",
      padding: "10px 12px",
      borderStyle: "solid",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: white,
      borderColor: borderColor,
      textAlign: props.textAlign ? props.textAlign : "left",
      transition: "background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
      "&::placeholder": {
        color: color,
      },
      [theme.breakpoints.down("sm")]: {
        width: 225,
      },
      "& .Mui-disabled": {
        cursor: "not-allowed",
      },
    },
  }));
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${props.className}`} style={props.style}>
      <Select
        multiple
        fullWidth
        displayEmpty
        input={<Input />}
        name={props.name}
        value={props.value}
        MenuProps={MenuProps}
        disabled={props.disabled}
        onChange={props.onChange}
        className={classes.select}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>{props.placeholder}</em>;
          }
          let toRender = [];
          selected.map((item) => {
            let ind = props.values.findIndex((option) => option.value === item);
            if (ind > -1) {
              toRender.push(props.values[ind].label);
            }
            return true;
          });
          return toRender.join(", ");
        }}
      >
        {props.placeholder && (
          <MenuItem disabled value="">
            <em>{props.placeholder}</em>
          </MenuItem>
        )}
        {props.values.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            style={getStyles(item.label, props.value, theme)}
          >
            <Checkbox
              color="primary"
              checked={props.value.indexOf(item.value) > -1}
            />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

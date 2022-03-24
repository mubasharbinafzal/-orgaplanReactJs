import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    "& .MuiTypography-body1": {
      color: theme.palette.primary.contrastText,
    },
  },
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {},
  },
  checkedIcon: {
    backgroundColor: theme.palette.grey[100],
    "input:hover ~ &": {
      backgroundColor: theme.palette.grey[100],
    },
  },
}));

export default function CustomizedRadios(props) {
  const classes = useStyles();
  return (
    <RadioGroup
      name={props.name}
      value={props.value}
      style={props.style}
      aria-label={props.name}
      onChange={props.onChange}
      className={classes.container}
      defaultValue={props.defaultValue}
    >
      <Form.Row noMargin>
        {props.items.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            label={item.label}
            disabled={props.disabled || item.disabled}
            style={{
              width: String(100 / props.items.length - 3) + "%",
            }}
            control={
              <Radio
                disableRipple
                color="default"
                className={classes.root}
                checkedIcon={
                  <span className={clsx(classes.icon, classes.checkedIcon)} />
                }
                icon={<span className={classes.icon} />}
              />
            }
          />
        ))}
      </Form.Row>
    </RadioGroup>
  );
}

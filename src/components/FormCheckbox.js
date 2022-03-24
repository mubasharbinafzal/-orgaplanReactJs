import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function FormCheckbox(props) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name={props.name}
          checked={props.checked}
          disabled={props.disabled}
          onChange={props.onChange}
          color={props.color || "default"}
          style={props.style}
        />
      }
      label={props.label}
    />
  );
}

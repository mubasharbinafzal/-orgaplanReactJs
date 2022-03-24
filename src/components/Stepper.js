import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Form from "./Form";
import Button from "./Button";

const StepsComponent = ({ className, ...props }) => {
  const useStyles = makeStyles((theme) => ({
    step: {
      backgroundColor: theme.palette.common.white,
      borderWidth: 1,
    },
    button: {},
  }));

  const theme = useTheme();
  const classes = useStyles();

  return (
    <Form.Row className={`${classes.steps} ${className}`} {...props}>
      {props.steps.map((step, index) => (
        <Button
          key={index}
          text={step}
          className={classes.button}
          disableRipple={props.disabled}
          disableFocusRipple={props.disabled}
          // onClick={() => !props.disabled && props.setStep(index + 1)}
          onClick={() => props.setStep(index + 1)}
          maxWidth={String(100 / props.steps.length - 1.5) + "%"}
          color={props.step !== index + 1 && theme.palette.common.white}
          textColor={props.step !== index + 1 && theme.palette.common.black}
        />
      ))}
    </Form.Row>
  );
};

export default StepsComponent;

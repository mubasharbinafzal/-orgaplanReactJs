import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
    marginTop: theme.spacing(0),
  },
  formControl: {
    minWidth: 170,
    marginTop: theme.spacing(-2),
  },
}));

export default function ControlledOpenSelect({
  overlap,
  overlapOpen,
  handleOpen,
  handleClose,
  handleChange,
}) {
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Overlap</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={overlapOpen}
          onClose={handleClose}
          onOpen={handleOpen}
          value={overlap}
          onChange={handleChange}
        >
          <MenuItem value="Enable">Enable</MenuItem>
          <MenuItem value="Disable">Disable</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

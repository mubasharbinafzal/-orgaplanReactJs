import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import GLOBALS from "../globals";
import FormSelect from "../components/FormSelect";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

const types = [
  {
    value: "STORAGEAREA",
    label: "Storage Area",
  },
  {
    value: "DELIVERYAREA",
    label: "Delivery Area",
  },
];

export default function CustomInputModal(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const white = theme.palette.common.white;
  const primaryColor = theme.palette.primary.contrastText;
  const borderColor = props.error ? error : theme.palette.grey[100];

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
      color: error,
      fontWeight: 400,
      position: "absolute",
      fontSize: theme.typography.pxToRem(12),
    },
  }));

  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [update, setUpdate] = useState(false);

  const [type, setType] = useState("");
  const [area, setArea] = useState("");

  const onAdd = async () => {
    let valuesAr = props.values;
    let elem =
      type === "STORAGEAREA"
        ? props.storageAreas.find((el) => el.value === area)
        : props.deliveryAreas.find((el) => el.value === area);
    const val = {
      key: area,
      type: type,
      label: elem.label,
    };
    valuesAr.push(val);
    props.onChange(valuesAr);
    setUpdate((st) => !st);
    setModal(false);
    setType("");
    setArea("");
  };

  const handleDelete = (value) => () => {
    const newValues = props.values.filter((chip) => chip.key !== value.key);
    props.onChange(newValues);
    setUpdate((st) => !st);
  };

  return (
    <>
      <div className={`${classes.root} ${props.className}`} style={props.style}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div className={classes.container}>
              <div
                onClick={() => {
                  setModal(true);
                  props.onBlur && props.onBlur();
                }}
              >
                <Plus style={{ width: 20, height: 20 }} />
              </div>
            </div>
            {props.error !== "" && (
              <span className={classes.error}>{props.error}</span>
            )}
          </Grid>
          {update && ""}
          <ul className={classes.chips}>
            {props.values.map((data) => (
              <li key={data.key}>
                <Chip
                  label={data.label}
                  className={classes.chip}
                  onDelete={handleDelete(data)}
                />
              </li>
            ))}
          </ul>
        </Grid>
      </div>
      <Modal
        open={modal}
        title="ADD LOCATION"
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form>
            <Form.Row>
              <FormSelect
                name="type"
                value={type}
                values={types}
                placeholder="Select Type"
                style={GLOBALS.Styles.inputWidth}
                onChange={(event) => setType(event.target.value)}
              />
              <FormSelect
                name="area"
                value={area}
                disabled={!type}
                placeholder="Select Type"
                style={GLOBALS.Styles.inputWidth}
                onChange={(event) => setArea(event.target.value)}
                values={
                  type === "STORAGEAREA"
                    ? props.storageAreas
                    : props.deliveryAreas
                }
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text="VALIDATE"
                onClick={onAdd}
                disabled={!area}
                fullWidth={false}
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}

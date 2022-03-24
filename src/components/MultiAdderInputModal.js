import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";

import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

export default function MultiAdderInputModal(props) {
  const theme = useTheme();

  const error = theme.palette.error.main;
  const white = theme.palette.common.white;
  const primaryColor = theme.palette.primary.contrastText;
  const borderColor = props.error ? error : theme.palette.grey[100];

  const useStyles = makeStyles((theme) => ({
    root: {
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

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");

  const handleChange = (name, value) => {
    if (name === "street") setStreet(value);
    else if (name === "city") setCity(value);
    else if (name === "postal") {
      if (value.length <= 5) {
        setPostal(value);
      }
    }
  };

  async function onSubmit() {
    let newValues = props.values;

    const values = {
      _id: newValues.length,
      street: street,
      city: city,
      postal: postal,
      label: `${street} ${city} ${postal}`,
    };
    newValues.push(values);
    props.onChange(newValues);

    setUpdate((st) => !st);
    setModal(false);
    setStreet("");
    setCity("");
    setPostal("");
  }

  const handleDelete = (value) => () => {
    const newValues = props.values.filter((chip) => chip._id !== value._id);
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
              <li key={data._id}>
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
        title="ADD ADDRESS"
        open={modal}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form>
            <Form.Row>
              <FormInput
                name="street"
                value={street}
                maxLength="80"
                textAlign="center"
                placeholder="Street"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                name="city"
                value={city}
                maxLength="30"
                textAlign="center"
                placeholder="City (text only)"
                onChange={({ target: { name, value } }) => {
                  (/^[A-Za-z]+$/.test(value) || value === "") &&
                    handleChange(name, value);
                }}
              />
            </Form.Row>
            <Form.Row>
              <FormInput
                type="number"
                name="postal"
                maxLength={5}
                value={postal}
                textAlign="center"
                placeholder="Postal (5 digits only)"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={onSubmit}
                disabled={
                  !street ||
                  !postal ||
                  postal.length !== 5 ||
                  !city ||
                  !/^[a-zA-Z]+$/.test(city)
                }
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}

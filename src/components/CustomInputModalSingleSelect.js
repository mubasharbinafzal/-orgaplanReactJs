import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import { useFormik } from "formik";
import GLOBALS from "../globals";
import FormSelect from "../components/FormSelect";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

// const addAddressesYup = Yup.object().shape({
//   street: Yup.string().required("Required"),
//   city: Yup.string().required("Required"),
//   postal: Yup.string().required("Required"),
// });

export default function CustomInputModalSingleSelect(props) {
  useEffect(() => {
    if (props.chipDefaultValues !== undefined)
      setChipValues(props.chipDefaultValues);

    // eslint-disable-next-line
  }, []);

  const theme = useTheme();

  const error = theme.palette.error.main;
  const white = theme.palette.common.white;
  const primaryColor = theme.palette.primary.contrastText;
  const borderColor = props.error ? error : theme.palette.grey[100];

  const formik = useFormik({
    initialValues: {
      logo: [],
      name: "",
      storage: "",
      deliveryAreas: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      contractType: "CLIENTPERSITE",
      contractStartDate: "",
      contractEndDate: "",
      functionality: "DELIVERY",
      additionalInfo: "",
      notificationPriorToDays: "",
      notificationTo: [],
    },

    onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
  });

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
  const [update] = useState(false);

  // const [street, setStreet] = useState("");
  // const [city, setCity] = useState("");
  // const [postal, setPostal] = useState("");
  const [chipValues, setChipValues] = useState([]);

  async function onSubmit() {
    let value = props.value;
    let id = props.id;

    let valuesTemp = [...chipValues];
    if (valuesTemp) {
      const values = {
        key: value.length + Date.now().toString(),
        label: value,
        id: id !== undefined ? id : Date.now().toString(),
      };
      valuesTemp.push(values);
      setChipValues(valuesTemp);
      if (props.chipValues !== undefined) props.chipValues(valuesTemp);
    }

    setModal(false);
  }

  const handleDelete = (value) => () => {
    const newValues = chipValues.filter((chip) => chip.key !== value.key);
    setChipValues(newValues);
    if (props.chipValues !== undefined) props.chipValues(newValues);
    //props.onChange(newValues);
    //  setUpdate((st) => !st);
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
            {chipValues.map((data) => (
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
        title="ADD LOCATION"
        open={modal}
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form>
            <Form.Row>
              <FormSelect
                placeholder={props.placeholder}
                {...props}
                name="deliveryAreas"
                style={GLOBALS.Styles.inputWidth}
                onChange={(event) => {
                  props.onChange(event);
                  return formik.handleChange;
                }}
                value={(formik.values.deliveryAreas = props.value)}
                error={formik.errors.deliveryAreas}
                values={props.values}
              />
            </Form.Row>

            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={onSubmit}
                disabled={!props.value}
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}

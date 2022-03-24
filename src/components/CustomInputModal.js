import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import { useFormik } from "formik";
import GLOBALS from "../globals";
import FormSelect from "../components/FormSelect";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import { ReactComponent as Plus } from "../assets/icons/Plus.svg";

export default function CustomInputModal(props) {
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
  const [update] = useState(false);

  const [chipValues, setChipValues] = useState([]);

  async function onSubmit() {
    let leftValue = props.leftValue;
    let rightValue = props.rightValue;
    let rightId = props.rightId;

    let valuesTemp = [...chipValues];
    if (leftValue) {
    }
    if (rightValue) {
      const values = {
        key: rightValue.length + Date.now().toString(),
        label: rightValue,
        id: rightId,
        type: leftValue,
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
            {chipValues.map((data, index) => (
              <li key={index}>
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
                placeholder={props.leftDropdwonPlaceholder}
                name="Storage"
                style={GLOBALS.Styles.inputWidth}
                onChange={(event) => {
                  props.leftDropdwonValueChange(event);
                  return formik.handleChange;
                }}
                value={(formik.values.storage = props.leftValue)}
                error={formik.errors.storage}
                values={props.leftDropdownValues}
              />
              <FormSelect
                placeholder={props.rightDropdownPlaceholder}
                name="deliveryAreas"
                style={GLOBALS.Styles.inputWidth}
                onChange={(event) => {
                  props.rightDropdwonValueChange(event);
                  return formik.handleChange;
                }}
                value={(formik.values.deliveryAreas = props.rightValue)}
                error={formik.errors.deliveryAreas}
                values={props.rightDropdownValues}
              />
            </Form.Row>

            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={onSubmit}
                disabled={!props.rightValue || !props.leftValue}
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}

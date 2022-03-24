import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useTheme } from "@material-ui/core/styles";
import * as Yup from "yup";

import GLOBALS from "../globals";

import Form from "./Form";
import Modal from "./Modal";
import Button from "./Button";
import FormLabel from "./FormLabel";
import FormSelect from "./FormSelect";
import RadioButton from "./RadioButton";

const addOpeningTimes = Yup.object().shape({
  day1Start: Yup.number()
    .integer()
    .lessThan(Yup.ref("day1End"), "Invalid combination")
    .required(),
  day1End: Yup.number()
    .integer()
    .moreThan(Yup.ref("day1Start"), "Invalid combination")
    .required(),
  day2Start: Yup.number()
    .integer()
    .lessThan(Yup.ref("day2End"), "Invalid combination")
    .required(),
  day2End: Yup.number()
    .integer()
    .moreThan(Yup.ref("day2Start"), "Invalid combination")
    .required(),
  day3Start: Yup.number()
    .integer()
    .lessThan(Yup.ref("day3End"), "Invalid combination")
    .required(),
  day3End: Yup.number()
    .integer()
    .moreThan(Yup.ref("day3Start"), "Invalid combination")
    .required(),
  day4Start: Yup.number()
    .integer()
    .lessThan(Yup.ref("day4End"), "Invalid combination")
    .required(),
  day4End: Yup.number()
    .integer()
    .moreThan(Yup.ref("day4Start"), "Invalid combination")
    .required(),
  day5Start: Yup.number()
    .integer()
    .lessThan(Yup.ref("day5End"), "Invalid combination")
    .required(),
  day5End: Yup.number()
    .integer()
    .moreThan(Yup.ref("day5Start"), "Invalid combination")
    .required(),
  day6Start: Yup.number()
    .integer()
    .lessThan(Yup.ref("day6End"), "Invalid combination")
    .required(),
  day6End: Yup.number()
    .integer()
    .moreThan(Yup.ref("day6Start"), "Invalid combination")
    .required(),
  day7Start: Yup.number()
    .integer()
    .lessThan(Yup.ref("day7End"), "Invalid combination")
    .required(),
  day7End: Yup.number()
    .integer()
    .moreThan(Yup.ref("day7Start"), "Invalid combination")
    .required(),
});

export default function MultiAdderInputModal(props) {
  const theme = useTheme();

  const [modal, setModal] = useState(false);
  const [update, setUpdate] = useState(false);

  const formik = useFormik({
    initialValues: props.values,
    validationSchema: addOpeningTimes,
    onSubmit: onSubmit,
  });

  useEffect(() => {
    setUpdate((st) => !st);
    formik.setValues(props.values);
    // eslint-disable-next-line
  }, [props.values, modal]);

  async function onSubmit(values) {
    props.onChange(values);
    setUpdate((st) => !st);
    setModal(false);
    formik.setSubmitting(false);
    formik.handleReset();
  }

  const values = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18" },
    { value: 19, label: "19" },
    { value: 20, label: "20" },
    { value: 21, label: "21" },
    { value: 22, label: "22" },
    { value: 23, label: "23" },
  ];

  return (
    <>
      <Button
        minWidth={200}
        fullWidth={false}
        text="SEE OPENING TIMES"
        color={theme.palette.blue}
        onClick={() => setModal(true)}
      />
      {update && ""}
      <Modal
        open={modal}
        title="OPENING TIMES"
        onClose={() => setModal((st) => !st)}
        body={
          <Form.Form onSubmit={formik.handleSubmit}>
            <Form.Row alignItems="center" justifyContent="center">
              <FormLabel noMargin bold primary="Day Off" />
            </Form.Row>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Monday" />
              </Form.Row>
              <RadioButton
                name="day1Off"
                // error={contractType}
                value={formik.values.day1Off}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  formik.setFieldValue(name, value === "true" ? true : false)
                }
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              <Form.Row noMargin>
                <FormSelect
                  values={values}
                  name="day1Start"
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  value={formik.values.day1Start}
                  error={formik.errors.day1Start}
                  disabled={formik.values.day1Off}
                  style={GLOBALS.Styles.inputWidth}
                />
                <FormSelect
                  name="day1End"
                  values={values}
                  value={formik.values.day1End}
                  error={formik.errors.day1End}
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  disabled={formik.values.day1Off}
                  style={GLOBALS.Styles.inputWidth}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Tuesday" />
              </Form.Row>
              <RadioButton
                name="day2Off"
                // error={contractType}
                value={formik.values.day2Off}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  formik.setFieldValue(name, value === "true" ? true : false)
                }
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              <Form.Row noMargin>
                <FormSelect
                  values={values}
                  name="day2Start"
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  value={formik.values.day2Start}
                  error={formik.errors.day2Start}
                  disabled={formik.values.day2Off}
                  style={GLOBALS.Styles.inputWidth}
                />
                <FormSelect
                  name="day2End"
                  values={values}
                  value={formik.values.day2End}
                  error={formik.errors.day2End}
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  disabled={formik.values.day2Off}
                  style={GLOBALS.Styles.inputWidth}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Wednesday" />
              </Form.Row>
              <RadioButton
                name="day3Off"
                // error={contractType}
                value={formik.values.day3Off}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  formik.setFieldValue(name, value === "true" ? true : false)
                }
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              <Form.Row noMargin>
                <FormSelect
                  values={values}
                  name="day3Start"
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  value={formik.values.day3Start}
                  error={formik.errors.day3Start}
                  disabled={formik.values.day3Off}
                  style={GLOBALS.Styles.inputWidth}
                />
                <FormSelect
                  name="day3End"
                  values={values}
                  value={formik.values.day3End}
                  error={formik.errors.day3End}
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  disabled={formik.values.day3Off}
                  style={GLOBALS.Styles.inputWidth}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Thursday" />
              </Form.Row>
              <RadioButton
                name="day4Off"
                // error={contractType}
                value={formik.values.day4Off}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  formik.setFieldValue(name, value === "true" ? true : false)
                }
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              <Form.Row noMargin>
                <FormSelect
                  values={values}
                  name="day4Start"
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  value={formik.values.day4Start}
                  error={formik.errors.day4Start}
                  disabled={formik.values.day4Off}
                  style={GLOBALS.Styles.inputWidth}
                />
                <FormSelect
                  name="day4End"
                  values={values}
                  value={formik.values.day4End}
                  error={formik.errors.day4End}
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  disabled={formik.values.day4Off}
                  style={GLOBALS.Styles.inputWidth}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Friday" />
              </Form.Row>
              <RadioButton
                name="day5Off"
                // error={contractType}
                value={formik.values.day5Off}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  formik.setFieldValue(name, value === "true" ? true : false)
                }
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              <Form.Row noMargin>
                <FormSelect
                  values={values}
                  name="day5Start"
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  value={formik.values.day5Start}
                  error={formik.errors.day5Start}
                  disabled={formik.values.day5Off}
                  style={GLOBALS.Styles.inputWidth}
                />
                <FormSelect
                  name="day5End"
                  values={values}
                  value={formik.values.day5End}
                  error={formik.errors.day5End}
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  disabled={formik.values.day5Off}
                  style={GLOBALS.Styles.inputWidth}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Saturday" />
              </Form.Row>
              <RadioButton
                name="day6Off"
                // error={contractType}
                value={formik.values.day6Off}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  formik.setFieldValue(name, value === "true" ? true : false)
                }
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              <Form.Row noMargin>
                <FormSelect
                  values={values}
                  name="day6Start"
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  value={formik.values.day6Start}
                  error={formik.errors.day6Start}
                  disabled={formik.values.day6Off}
                  style={GLOBALS.Styles.inputWidth}
                />
                <FormSelect
                  name="day6End"
                  values={values}
                  value={formik.values.day6End}
                  error={formik.errors.day6End}
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  disabled={formik.values.day6Off}
                  style={GLOBALS.Styles.inputWidth}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Sunday" />
              </Form.Row>
              <RadioButton
                name="day7Off"
                // error={contractType}
                value={formik.values.day7Off}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  formik.setFieldValue(name, value === "true" ? true : false)
                }
                items={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
              <Form.Row noMargin>
                <FormSelect
                  values={values}
                  name="day7Start"
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  value={formik.values.day7Start}
                  error={formik.errors.day7Start}
                  disabled={formik.values.day7Off}
                  style={GLOBALS.Styles.inputWidth}
                />
                <FormSelect
                  name="day7End"
                  values={values}
                  value={formik.values.day7End}
                  error={formik.errors.day7End}
                  onChange={({ target: { name, value } }) =>
                    formik.setFieldValue(name, Number(value))
                  }
                  disabled={formik.values.day7Off}
                  style={GLOBALS.Styles.inputWidth}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                type="submit"
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import PhoneBox from "../../../components/PhoneBox";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import ColorPicker from "../../../components/ColorPcker";
import RadioButton from "../../../components/RadioButton";
import MultiAdderInput from "../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function AddClient(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const plus = "+";

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [logo, setLogo] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [color, setColor] = useState("green");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [notificationTo, setNotificationTo] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [contractStartDate, setContractStartDate] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [contractType, setContractType] = useState("CLIENTPERSITE");
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("");

  const [errors, setErrors] = useState({});

  function handleChange(name, value) {
    if (name === "logo") setLogo(value);
    else if (name === "name") setName(value);
    else if (name === "color") setColor(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "contractType") {
      setContractStartDate("");
      setContractEndDate("");
      setContractType(value);
    } else if (name === "contractStartDate") {
      setContractEndDate("");
      setContractStartDate(value);
    } else if (name === "contractEndDate") setContractEndDate(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "additionalInfo") setAdditionalInfo(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") setNotificationTo(value);
    setUpdate((st) => !st);
  }

  function validation(name, value) {
    if (name === "name") {
      if (GLOBALS.Functions.empty(value))
        setErrors({ ...errors, name: "Company name is required" });
      else setErrors({ ...errors, name: "" });
    } else if (name === "email") {
      if (!GLOBALS.Functions.empty(value) && GLOBALS.Functions.email(value))
        setErrors({ ...errors, email: "Please enter valid email" });
      else setErrors({ ...errors, email: "" });
    } else if (name === "phone") {
      if (!GLOBALS.Functions.empty(value) && GLOBALS.Functions.phone(value))
        setErrors({ ...errors, phone: "Phone must be 10-25 digits" });
      else setErrors({ ...errors, phone: "" });
    } else if (name === "additionalInfo") {
      if (GLOBALS.Functions.length(value, 300))
        setErrors({
          ...errors,
          additionalInfo: "Additional Info must be less than 300 characters",
        });
      else setErrors({ ...errors, additionalInfo: "" });
    } else if (name === "firstName") {
      if (GLOBALS.Functions.length(value, 30))
        setErrors({
          ...errors,
          firstName: "First Name must be less than 30 characters",
        });
      else setErrors({ ...errors, firstName: "" });
    } else if (name === "lastName") {
      if (GLOBALS.Functions.length(value, 30))
        setErrors({
          ...errors,
          lastName: "Last Name must be less than 30 characters",
        });
      else setErrors({ ...errors, lastName: "" });
    }
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      const notificationToArray = notificationTo.map((item) => item.label);
      var formdata = new FormData();
      formdata.append("logo", logo[0].file);
      formdata.append("name", name);
      formdata.append("color", color);
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("email", email);
      formdata.append("phone", plus + phone);
      formdata.append("contractType", contractType);
      formdata.append("contractStartDate", contractStartDate);
      formdata.append("contractEndDate", contractEndDate);
      formdata.append("functionality", functionality);
      formdata.append("additionalInfo", additionalInfo);
      formdata.append("notificationPriorToDays", notificationPriorToDays);
      formdata.append("notificationTo", JSON.stringify(notificationToArray));

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.CLIENTS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.push("/clients");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD A CLIENT" />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="COMPANY NAME* :" />
            <FormInput
              name="name"
              value={name}
              maxLength="30"
              error={errors.name}
              placeholder="Company name"
              style={GLOBALS.Styles.inputWidth}
              onBlur={({ target: { name, value } }) => validation(name, value)}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          {update && ""}
          <Form.Row>
            <FormLabel bold primary="COMPANY LOGO* :" />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="logo"
                values={logo}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => handleChange("logo", values)}
              />
              <div style={GLOBALS.Styles.inputWidth}>
                <ColorPicker
                  color={color}
                  handleChange={({ hex }) => handleChange("color", hex)}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE COMPANY : " />
            <Form.Row noMargin width="48%">
              <FormInput
                maxLength="30"
                name="firstName"
                value={firstName}
                placeholder="First Name"
                error={errors.firstName}
                style={GLOBALS.Styles.inputWidth}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                maxLength="30"
                name="lastName"
                value={lastName}
                placeholder="Last Name"
                error={errors.lastName}
                style={GLOBALS.Styles.inputWidth}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RESPONSIBLE CONTACT : " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="email"
                value={email}
                error={errors.email}
                placeholder="E-mail Address"
                style={GLOBALS.Styles.inputWidth}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <PhoneBox
                name="phone"
                value={phone}
                type="number"
                error={errors.phone}
                placeholder="Phone Number"
                style={GLOBALS.Styles.inputWidth}
                onBlur={({ target: { name, value } }) =>
                  value.length < 26 ? validation(name, value) : ""
                }
                onChange={({ target: { name, value } }) =>
                  value.length < 26 ? handleChange(name, value) : ""
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF CONTRACT* : " />
            <RadioButton
              name="contractType"
              value={contractType}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              items={[
                { value: "CLIENTPERSITE", label: "Per Site" },
                { value: "MASTERCLIENT", label: "Master Contract" },
              ]}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="CONTRACT DATE* : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                placeholder="Start date"
                name="contractStartDate"
                value={contractStartDate}
                min={moment().format("YYYY-MM-DD")}
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                type="date"
                placeholder="End date"
                name="contractEndDate"
                value={contractEndDate}
                min={moment(contractStartDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD")}
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="FUNCTIONALITY SUBSCRIBED : " />
            <RadioButton
              name="functionality"
              value={functionality}
              style={GLOBALS.Styles.inputWidth}
              items={[{ value: "DELIVERY", label: "Delivery module" }]}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
            <FormInput
              textArea
              rows={3}
              maxLength="300"
              name="additionalInfo"
              value={additionalInfo}
              error={errors.additionalInfo}
              style={GLOBALS.Styles.inputWidth}
              placeholder="Additional information"
              onBlur={({ target: { name, value } }) => validation(name, value)}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFICATION : " />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="flex-start"
            >
              <FormInput
                type="number"
                placeholder="0"
                name="notificationPriorToDays"
                value={notificationPriorToDays}
                disabled={contractType !== "MASTERCLIENT"}
                style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText
                primary="Days before end of the contract"
                style={{ marginLeft: "10px", marginBottom: 0 }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
            <MultiAdderInput
              name="notificationTo"
              values={notificationTo}
              validateError="Invalid Email"
              placeholder="Enter email address"
              style={GLOBALS.Styles.inputWidth}
              disabled={contractType !== "MASTERCLIENT"}
              onChange={(values) => handleChange("notificationTo", values)}
              validate={(text) => {
                const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                return !re.test(String(text).toLowerCase());
              }}
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              onClick={onSubmit}
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                !name ||
                errors.name ||
                logo.length === 0 ||
                errors.firstName ||
                errors.lastName ||
                errors.phone ||
                errors.additionalInfo ||
                Number(notificationPriorToDays) < 0 ||
                (contractType === "MASTERCLIENT" &&
                  (!contractStartDate ||
                    !contractEndDate ||
                    moment(contractEndDate).diff(
                      moment(contractStartDate),
                      "days",
                    ) <= 0))
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}

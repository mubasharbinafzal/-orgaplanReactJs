import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
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

export default function VerifyClient(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [logo, setLogo] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("green");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contractType, setContractType] = useState("CLIENTPERSITE");
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("0");
  const [notificationTo, setNotificationTo] = useState([]);

  const [errors, setErrors] = useState({});

  function handleChange(name, value) {
    if (name === "logo") setLogo(value);
    else if (name === "name") setName(value);
    else if (name === "color") setColor(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "contractType") setContractType(value);
    else if (name === "contractStartDate") setContractStartDate(value);
    else if (name === "contractEndDate") setContractEndDate(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "additionalInfo") setAdditionalInfo(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") setNotificationTo(value);
    setUpdate((st) => !st);
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      let item = props.location.item;

      const notificationToArray = notificationTo.map((item) => item.label);

      var formdata = new FormData();
      formdata.append("logo", logo[0].file);
      formdata.append("color", color);
      formdata.append("clientId", item._id);
      formdata.append("companyId", item.companyId._id);
      formdata.append("contractType", contractType);
      formdata.append("contractEndDate", contractEndDate);
      formdata.append("contractStartDate", contractStartDate);
      formdata.append("functionality", functionality);
      formdata.append("additionalInfo", additionalInfo);
      formdata.append("notificationPriorToDays", notificationPriorToDays);
      formdata.append("notificationTo", JSON.stringify(notificationToArray));

      await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.QUOTE_VERIFY}`,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.replace("/clients");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function validation(name, value) {
    if (name === "additionalInfo") {
      if (GLOBALS.Functions.length(value, 300))
        setErrors({
          ...errors,
          additionalInfo: "Additional Info must be less than 300 characters",
        });
      else setErrors({ ...errors, additionalInfo: "" });
    }
  }

  useEffect(() => {
    let item = props.location.item;
    setName(item.companyId.name);
    setFirstName(item.companyId.incharge.firstName);
    setLastName(item.companyId.incharge.lastName);
    setEmail(item.companyId.incharge.email);
    setPhone(item.companyId.incharge.phone);
    setContractType(item.companyId.type);

    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="VERIFY A QUOTE" />
      {update && ""}
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="COMPANY NAME* :" />
            <FormInput
              disabled
              name="name"
              value={name}
              // error={name}
              placeholder="Company name"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
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
                disabled
                name="firstName"
                value={firstName}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                disabled
                name="lastName"
                value={lastName}
                placeholder="Last Name"
                style={GLOBALS.Styles.inputWidth}
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
                disabled
                name="email"
                value={email}
                placeholder="E-mail Address"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                disabled
                name="phone"
                type="number"
                value={phone}
                placeholder="Phone Number"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF CONTRACT* : " />
            <RadioButton
              disabled
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
                style={GLOBALS.Styles.inputWidth}
                min={moment().format("YYYY-MM-DD")}
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
                style={GLOBALS.Styles.inputWidth}
                disabled={contractType !== "MASTERCLIENT"}
                min={moment(contractStartDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD")}
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
                name="notificationPriorToDays"
                value={notificationPriorToDays}
                disabled={contractType !== "MASTERCLIENT"}
                style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
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
              style={GLOBALS.Styles.inputWidth}
              placeholder="Enter email address"
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
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                logo.length === 0 ||
                (contractType === "MASTERCLIENT" &&
                  (!contractStartDate ||
                    !contractEndDate ||
                    moment(contractEndDate).diff(
                      moment(contractStartDate),
                      "days",
                    ) <= 0)) ||
                errors.additionalInfo ||
                Number(notificationPriorToDays) < 0
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}

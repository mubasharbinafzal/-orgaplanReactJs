import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
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
  error: {
    color: "red",
  },
}));

export default function AddAdmin(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [company, setCompany] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState([]);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [adminType, setAdminType] = useState("ADMINPERSITE");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.COMPANY}`,
      });

      const itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.name,
      }));

      setAllCompanies(result.data.items);
      setCompanies(itemsArray);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      formdata.append("email", email);
      formdata.append("phone", "+" + phone);
      formdata.append("lastName", lastName);
      formdata.append("firstName", firstName);
      formdata.append("adminType", adminType);
      formdata.append("companyId", companyId);
      formdata.append("image", image[0]?.file);

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADMINS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setLoading(false);
      props.history.push("/admins");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "adminType") setAdminType(value);
    else if (name === "image") setImage(value);
    else if (name === "companyId") {
      setCompanyId(value);
      value
        ? setCompany(allCompanies.find((item) => item._id === value))
        : setCompany("");
    }
    setUpdate((st) => !st);
  }

  function validation(name, value) {
    if (name === "email") {
      if (GLOBALS.Functions.email(value))
        setEmailError("Please enter valid email");
      else setEmailError("");
    } else if (name === "phone") {
      if (GLOBALS.Functions.phone(value))
        setPhoneError("Phone must be 10-25 digits");
      else setPhoneError("");
    } else if (name === "firstName") {
      if (GLOBALS.Functions.empty(value))
        setFirstNameError("First name is required");
      else setFirstNameError("");
    } else if (name === "lastName") {
      if (GLOBALS.Functions.empty(value))
        setLastNameError("Last name is required");
      else setLastNameError("");
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD AN ADMIN" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO*: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="email"
                type="email"
                value={email}
                error={emailError}
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
                type="number"
                value={phone}
                error={phoneError}
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
          {update && ""}
          <Form.Row>
            <FormLabel bold primary="IDENTITY*: " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="firstName"
                value={firstName}
                error={firstNameError}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                value={lastName}
                error={lastNameError}
                placeholder="Last Name"
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
            <FormLabel bold primary="PROFILE*: " />
            <FormMultipleUpload
              name="image"
              values={image}
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => handleChange("image", values)}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY*: " />
            <FormSelect
              name="companyId"
              value={companyId}
              values={companies}
              placeholder="Select Company"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          {company.type === "MASTERCLIENT" && (
            <Form.Row>
              <FormLabel bold primary="TYPE OF ADMIN* : " />
              <RadioButton
                name="adminType"
                value={adminType}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                items={[
                  { value: "ADMINPERSITE", label: "Admin Per Site" },
                  { value: "MASTERADMIN", label: "Master Admin" },
                ]}
              />
            </Form.Row>
          )}
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                emailError ||
                !email ||
                phoneError ||
                !phone ||
                firstNameError ||
                !firstName ||
                lastNameError ||
                !lastName ||
                !companyId
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}

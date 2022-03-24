import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
// import * as Yup from "yup";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
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
    color: "#FF0000",
  },
}));

export default function EditContact(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const setValues = () => {
    const contactInfo = props.location.data;
    setType(contactInfo.type);
    setEmail(contactInfo.email);
    setPhone(contactInfo.phone.substring(1));
    setFirstName(contactInfo.firstName);
    setLastName(contactInfo.lastName);
    setImage([{ key: 0, file: undefined, uri: contactInfo.image }]);
    setCompany(contactInfo.company);
    setRole(contactInfo.role);
  };

  async function fetchData() {
    try {
      await setValues();
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleChange = (name, value) => {
    if (name === "email") {
      setEmail(value);
      // eslint-disable-next-line
      var mailformat =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!value.match(mailformat)) {
        setEmailError("Please enter valid format");
      } else {
        setEmailError("");
      }
    } else if (name === "phone") {
      setPhone(value);
      if (value.length < 10 || value.length > 25) {
        setPhoneError("Telephone must have 10 to 25 digits");
      } else {
        setPhoneError("");
      }
    } else if (name === "firstName") {
      setFirstName(value);
      if (value.length > 30) {
        setFirstNameError("Maximum chracters limit 30");
      } else {
        setFirstNameError("");
      }
    } else if (name === "lastName") {
      setLastName(value);
      if (value.length > 30) {
        setLastNameError("Maximum chracters limit 30");
      } else {
        setLastNameError("");
      }
    } else if (name === "company") {
      setCompany(value);
      if (value.length > 30) {
        setCompanyError("Maximum chracters limit 30");
      } else {
        setCompanyError("");
      }
    } else if (name === "role") {
      setRole(value);
      if (value.length > 30) {
        setRoleError("Maximum chracters limit 30");
      } else {
        setRoleError("");
      }
    } else if (name === "image") setImage(value);
    else if (name === "company") setCompany(value);
    else if (name === "role") setRole(value);
  };

  async function onDelete() {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        console.log(store.token);
        await GLOBALS.API({
          method: "DELETE",
          uri:
            GLOBALS.Constants.DELETE_SITE_ORGANIGRAMMES +
            "/" +
            props.location.data._id,
          token: store.token,
        });
        props.history.goBack();
      }
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        emailError !== "" ||
        phoneError !== "" ||
        firstNameError !== "" ||
        lastNameError !== "" ||
        companyError !== "" ||
        roleError !== ""
      ) {
        alert("something went wrong");
      } else {
        e.preventDefault();
        setLoading(true);
        var formdata = new FormData();
        formdata.append("email", email);
        formdata.append("phone", "+" + phone);
        formdata.append("firstName", firstName);
        formdata.append("lastName", lastName);
        formdata.append("image", image[0].file);
        formdata.append("company", company);
        formdata.append("siteId", adminStore.site.siteId._id);
        formdata.append("type", type);
        formdata.append("role", role);

        await GLOBALS.API({
          method: "PUT",
          uri:
            GLOBALS.Constants.PUT_SITE_ORGANIGRAMMES +
            "/" +
            props.location.data._id,
          headers: {
            Authorization: store.token,
          },
          body: formdata,
        });
        setLoading(false);
        props.history.push("/organigramme", { type: type });
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="EDIT A CONTACT" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="TYPE OF ORGANIGRAMME: " />
            <Form.Row noMargin width="55%">
              <FormSelect
                name="type"
                value={type}
                // error={companyId}
                values={[
                  { value: "LOGISTICS", label: "LOGISTICS" },
                  { value: "SITE", label: "SITE" },
                ]}
                placeholder="Type"
                style={GLOBALS.Styles.inputWidth}
                onChange={(e) => {
                  const index = e.target.selectedIndex - 1;
                  console.log("index", index);
                  if (index !== -1) {
                    const item = e.target.value;

                    console.log(item);
                    setType(item);
                  } else {
                    setType("");
                  }
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO : " />
            <Form.Row
              noMargin
              width="55%"
              style={{ justifyContent: "flex-start", gap: "20px" }}
            >
              <div style={{ width: "45%" }}>
                <FormInput
                  name="email"
                  value={email}
                  // error={firstName}
                  placeholder="Adresse e-mail"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                {emailError !== "" && (
                  <div className={classes.error}>{emailError}</div>
                )}
              </div>
              <div style={{ width: "45%" }}>
                <PhoneBox
                  name="phone"
                  value={phone}
                  type="number"
                  // error={lastName}
                  placeholder="Téléphone"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                {phoneError !== "" && (
                  <div className={classes.error}>{phoneError}</div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IDENTITY :  " />
            <Form.Row
              noMargin
              width="55%"
              style={{ justifyContent: "flex-start", gap: "10px" }}
            >
              <div style={{ width: "30%" }}>
                <FormInput
                  name="firstName"
                  value={firstName}
                  // error={firstName}
                  placeholder="First Name"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                {firstNameError !== "" && (
                  <div className={classes.error}>{firstNameError}</div>
                )}
              </div>
              <div style={{ width: "30%" }}>
                <FormInput
                  name="lastName"
                  value={lastName}
                  // error={lastName}
                  placeholder="Last Name"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                {lastNameError !== "" && (
                  <div className={classes.error}>{lastNameError}</div>
                )}
              </div>
              <div style={{ width: "30%" }}>
                <FormMultipleUpload
                  name="profile"
                  // error={image}
                  values={image}
                  style={{ width: "100%" }}
                  onChange={(values) => handleChange("profile", values)}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY: " />
            <Form.Row noMargin width="55%">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="company"
                  value={company}
                  // error={lastName}
                  placeholder="Enterprise"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                {companyError !== "" && (
                  <div className={classes.error}>{companyError}</div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="Rôle: " />
            <Form.Row noMargin width="55%">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="role"
                  value={role}
                  // error={lastName}
                  placeholder="Role"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
                {roleError !== "" && (
                  <div className={classes.error}>{roleError}</div>
                )}
              </div>
            </Form.Row>
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading || !type || !email || !phone || !firstName || !lastName
              }
            />
          </Form.ButtonContainer>

          <Button
            text="DELETE"
            minWidth={200}
            fullWidth={false}
            color={theme.palette.error.main}
            onClick={onDelete}
            loading={loading}
            disabled={loading}
          />
        </Form.Form>
      </div>
    </div>
  );
}

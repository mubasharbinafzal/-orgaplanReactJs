import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import TextField from "@material-ui/core/TextField";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import ColorPicker from "../../../components/ColorPcker";
import RadioButton from "../../../components/RadioButton";
import FormMultiSelect from "../../../components/FormMultiSelect";
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
  autoComplete: {
    "& .MuiFormControl-marginNormal": {
      marginTop: "0 !important",
      marginBottom: "0 !important",
    },
    "& .MuiOutlinedInput-root ": {
      borderRadius: "0 !important",
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
      padding: "4px !important",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #707070 !important",
    },
    "& .MuiFormLabel-root": {
      marginTop: -5,
    },
  },
}));

export default function AddCompanies(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [color, setColor] = useState("#d71313");
  const [image, setImage] = useState([]);
  const [companyType, setCompanyType] = useState("generalcontractor");
  const [parentCompanyId, setParentCompanyId] = useState("");
  const [trades, setTrades] = useState([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [website, setWebsite] = useState("");
  const [addInfo, setAddInfo] = useState("");

  const [nameError, setNameError] = useState("");
  const [companyTypeError, setCompanyTypeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  // Dropdowns
  const [allTrades, setAllTrades] = useState([]);

  // All Data
  const [allSiteCompanies, setAllSiteCompanies] = useState([]);

  const [nonSiteCompanies, setNonSiteCompanies] = useState([]);
  const [allNonSiteCompanies, setAllNonSiteCompanies] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  async function getData() {
    try {
      const getAllCompaniesResponse = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_COMPANY_EXCLUDE_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const siteCo = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      setCompanies(getAllCompaniesResponse.data);
      setNonSiteCompanies(response.data);
      setAllNonSiteCompanies(
        response.data.map((item) => ({
          label: item.name,
          value: item._id,
        })),
      );
      setAllSiteCompanies(
        siteCo.data.map((item) => ({
          label: item.companyId.name,
          value: item.companyId._id,
        })),
      );
      setAllTrades(
        adminStore.site.siteId.trades.map((trade) => ({
          label: trade,
          value: trade,
        })),
      );
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onSubmit() {
    try {
      if (emailError || phoneError || websiteError || !image[0]) {
        alert("something went wrong");
      } else {
        let checkCompanyExists = companies.filter(
          (company) => company.companyId.name === name,
        );
        if (checkCompanyExists.length > 0) {
          return dispatch(
            Actions.notistack.enqueueSnackbar(
              Actions.notistack.snackbar(
                "Company already Exists With this name,Please use another name",
                "error",
              ),
            ),
          );
        }
        setLoading(true);
        const incharge = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: "+" + phone,
        };
        var formdata = new FormData();
        image[0].file && formdata.append("logo", image[0].file);
        formdata.append("name", name);
        formdata.append("color", color);
        formdata.append("website", website);
        formdata.append("description", addInfo);
        formdata.append("trades", JSON.stringify(trades));
        formdata.append("siteId", adminStore.site.siteId._id);
        formdata.append("incharge", JSON.stringify(incharge));
        companyId && formdata.append("companyId", companyId);
        companyType === "subcontractor" &&
          parentCompanyId &&
          formdata.append("parentCompanyId", parentCompanyId);
        // for (let [key, value] of formdata) {
        //   console.log(`formdatais ${key}: ${value}`);
        // }
        // console.log("company type", formdata.get("parentCompanyId"));

        const response = await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.ADMIN_COMPANY,
          headers: {
            Authorization: store.token,
          },
          body: formdata,
        });
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(response.message, "success"),
          ),
        );
        setLoading(false);
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

  function inputChange(name, value) {
    if (name === "name") {
      setName(value);
      if (name === "" || name === null) {
        setNameError(true);
      } else {
        setNameError(false);
      }
    } else if (name === "color") setColor(value);
    else if (name === "companyType") {
      setCompanyType(value);
      if (!value) {
        setCompanyTypeError(true);
      } else {
        setCompanyTypeError(false);
      }
    } else if (name === "parentCompanyId") {
      setParentCompanyId(value);
    } else if (name === "email") {
      setEmail(value);
      // eslint-disable-next-line
      var mailformat =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!value.match(mailformat)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    } else if (name === "phone") {
      setPhone(value);
      if (value.length < 10 || value.length > 25) {
        setPhoneError("Telephone must have 10 to 25 digits");
      } else {
        setPhoneError("");
      }
    } else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "image") {
      setImage(value);
      setUpdate((st) => !st);
    } else if (name === "trades") {
      setTrades(value);
    } else if (name === "addInfo") {
      setAddInfo(value);
    } else if (name === "website") {
      setWebsite(value);
      const web =
        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
      if (!value.match(web)) {
        setWebsiteError("Invalid Url");
      } else {
        setWebsiteError("");
      }
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      {update && ""}
      <Heading primary="ADD A COMPANY" />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="IDENTITY* :" />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <Autocomplete
                  freeSolo
                  fullWidth
                  inputValue={name}
                  // disabled={!fieldsEnabled}
                  options={allNonSiteCompanies}
                  className={classes.autoComplete}
                  getOptionLabel={(option) => option.label}
                  onChange={(e, option) => {
                    if (option) {
                      let comp = nonSiteCompanies.find(
                        (com) => com._id === option.value,
                      );
                      if (comp) {
                        setCompanyId(option.value);
                        if (comp.incharge) {
                          setEmailError("");
                          setPhoneError("");
                          setWebsiteError("");
                          setEmail(comp.incharge.email);
                          setPhone(comp.incharge.phone);
                          setFirstName(comp.incharge.firstName);
                          setLastName(comp.incharge.lastName);
                        }
                        comp.logo &&
                          setImage([{ key: image.length, uri: comp.logo }]);
                      }
                    }
                  }}
                  onInputChange={(e, value) => {
                    if (companyId) {
                      setEmail("");
                      setPhone("");
                      setFirstName("");
                      setLastName("");
                      setImage([]);
                    }
                    inputChange("name", value);
                    setCompanyId("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="name"
                      label="Name"
                      variant="outlined"
                    />
                  )}
                />
                {nameError && (
                  <div className={classes.error}>Please enter name</div>
                )}
              </Form.Column>
              <div style={GLOBALS.Styles.inputWidth}>
                <ColorPicker
                  color={color}
                  handleChange={(color) => inputChange("color", color.hex)}
                />
              </div>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IMAGE* :" />
            <FormMultipleUpload
              name="image"
              values={image}
              // enabled={companyId}
              style={GLOBALS.Styles.inputWidth}
              onChange={(values) => inputChange("image", values)}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TYPE OF COMPANY* :" />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin>
                <RadioButton
                  name="companyType"
                  value={companyType}
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                  items={[
                    {
                      value: "generalcontractor",
                      label: "General Contractor",
                    },
                    { value: "subcontractor", label: "Subcontractor" },
                  ]}
                />
                {companyTypeError === true && (
                  <div className={classes.error}>Please select company</div>
                )}
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="GENERAL CONTRACTOR* :" />
            <Form.Row noMargin width="48%">
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormSelect
                  name="parentCompanyId"
                  value={parentCompanyId}
                  values={allSiteCompanies}
                  placeholder="Select Company"
                  disabled={companyType === "generalcontractor"}
                  onChange={({ target: { name, value } }) => {
                    inputChange(name, value);
                  }}
                />
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="TRADES :" />
            <Form.Row noMargin width="48%">
              <FormMultiSelect
                name="trades"
                value={trades}
                values={allTrades}
                placeholder="Trades"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IDENTITY OF RESPONSIBLE :" />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormInput
                  name="email"
                  value={email}
                  disabled={companyId}
                  placeholder="Adresse e-mail"
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                />
                {emailError === true && (
                  <div className={classes.error}>Please enter valid email</div>
                )}
              </Form.Column>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <PhoneBox
                  name="phone"
                  type="number"
                  maxLength="25"
                  value={phone}
                  disabled={companyId}
                  placeholder="Téléphone"
                  onChange={({ target: { name, value } }) =>
                    value.length < 26 ? inputChange(name, value) : ""
                  }
                />
                {phoneError && (
                  <div className={classes.error}>{phoneError}</div>
                )}
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel />
            <Form.Row width="48%" noMargin>
              <FormInput
                maxLength="30"
                name="firstName"
                value={firstName}
                disabled={companyId}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                value={lastName}
                disabled={companyId}
                placeholder="Last Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="WEBSITE :" />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormInput
                  name="website"
                  value={website}
                  placeholder="http://"
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                />
                {websiteError && (
                  <div className={classes.error}>{websiteError}</div>
                )}
              </Form.Column>
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
            <Form.Row width="48%" noMargin>
              <FormInput
                textArea
                rows={3}
                name="addInfo"
                maxLength="300"
                value={addInfo}
                placeholder="Informations complémentaires"
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              onClick={onSubmit}
              disabled={
                loading ||
                !name ||
                !color ||
                image.length === 0 ||
                (companyType !== "generalcontractor" && !parentCompanyId)
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}

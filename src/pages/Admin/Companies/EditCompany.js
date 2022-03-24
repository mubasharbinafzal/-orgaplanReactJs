import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
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

  // Dropdowns
  const [allTrades, setAllTrades] = useState([]);

  // All Data
  const [allSiteCompanies, setAllSiteCompanies] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  async function getData() {
    try {
      const siteCo = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
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
      let company = siteCo.data.find(
        (item) => item.companyId._id === props.match.params.id,
      );
      setName(company.companyId.name);
      setColor(company.color);
      setTrades(company.trades);
      company.companyId.incharge.firstName &&
        setFirstName(company.companyId.incharge.firstName);
      company.companyId.incharge.lastName &&
        setLastName(company.companyId.incharge.lastName);
      company.companyId.incharge.email &&
        setEmail(company.companyId.incharge.email);
      company.companyId.incharge.phone &&
        setPhone(company.companyId.incharge.phone.substring(1));
      company.companyId.website && setPhone(company.companyId.website);
      company.companyId.description &&
        setAddInfo(company.companyId.description);
      company.companyId.logo &&
        setImage([{ key: 0, uri: company.companyId.logo }]);

      company.parentCompanyId && setCompanyType("subcontractor");
      company.parentCompanyId &&
        setParentCompanyId(company.parentCompanyId._id);
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
        setLoading(true);

        var formdata = {
          email: email,
          description: addInfo,
          siteId: adminStore.site.siteId._id,
          parentCompanyId:
            companyType === "generalcontractor" ? undefined : parentCompanyId,
        };

        const response = await GLOBALS.API({
          method: "PUT",
          token: store.token,
          body: JSON.stringify(formdata),
          uri: `${GLOBALS.Constants.ADMIN_COMPANY}/${props.match.params.id}`,
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
      if (value.charAt(0) !== "0") {
        setPhoneError("Telephone shoud starts with 0");
      } else if (value.charAt(0) === "0" && value.length > 25) {
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
      <Heading primary="EDIT A COMPANY" />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="IDENTITY* :" />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin style={GLOBALS.Styles.inputWidth}>
                <FormInput
                  name="name"
                  value={name}
                  disabled={true}
                  placeholder="Name"
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
                  }
                />
                {nameError && (
                  <div className={classes.error}>Please enter name</div>
                )}
              </Form.Column>
              <div style={GLOBALS.Styles.inputWidth}>
                <ColorPicker
                  color={color}
                  disabled={true}
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
              disabled={true}
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
                  placeholder="Select Company"
                  values={allSiteCompanies.filter(
                    (item) => item.value !== props.match.params.id,
                  )}
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
                disabled={true}
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
                  value={phone}
                  disabled={true}
                  placeholder="Téléphone"
                  onChange={({ target: { name, value } }) =>
                    inputChange(name, value)
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
                disabled={true}
                name="firstName"
                value={firstName}
                placeholder="First Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  inputChange(name, value)
                }
              />
              <FormInput
                name="lastName"
                disabled={true}
                value={lastName}
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
                  disabled={true}
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

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
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

export default function AddUser(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [siteName, setSiteName] = useState("");
  const [logo, setLogo] = useState([]);

  const [dropdownRoles, setDropdownRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [disableUser, setDisableUser] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    try {
      setSiteName(adminStore.site.siteId.name);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_USER}/${adminStore.site.siteId._id}/${store.user._id}`,
        token: store.token,
      });
      const userResponse = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ALL_USERS}`,
        token: store.token,
      });
      setUsers(userResponse.data);
      if (response.data.site_companies != null) {
        const companyTemp = [];
        response.data.site_companies.companies.map((item, index) => {
          return companyTemp.push({
            label: item.companyId.name,
            value: item.companyId._id,
          });
        });
        setDropdownCompanies(companyTemp);
      }
      if (response.data.roles != null) {
        const rolesTemp = [];
        response.data.roles.map((item, index) => {
          return rolesTemp.push({ label: item, value: item });
        });
        setDropdownRoles(rolesTemp);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      var formdata = new FormData();
      logo[0]?.file && formdata.append("image", logo[0].file);
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("email", email);
      formdata.append("phone", "+" + phone);
      formdata.append("siteId", adminStore.site.siteId._id);
      formdata.append("companyId", selectedCompany);
      formdata.append("role", selectedRole);
      // for (let [key, value] of formdata) {
      //   console.log(`formdata in add user ${key}: ${value}`);
      // }
      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADD_COMPANY_USER,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      setLoading(false);
      props.history.goBack();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  function inputChange(name, value) {
    if (name === "phone") {
      setPhone(value);
    }
  }
  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD USER" />
      <div className={classes.content}>
        <Form.Form>
          <Form.Row>
            <FormLabel bold primary="CONTACT INFO* :" />
            <Form.Row width="48%">
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                style={{
                  ...GLOBALS.Styles.inputWidth,
                  marginRight: "10px",
                  marginTop: "-17px",
                }}
                onSelect={(event) => {
                  users.forEach((item, index) => {
                    if (item.email === event.target.value) {
                      setEmail(item.email);
                      setFirstName(item.firstName);
                      setLastName(item.lastName);
                      setPhone(parseInt(item.phone));
                      setLogo([{ uri: item.image }]);
                      setDisableUser(true);
                    } else {
                      setDisableUser(false);
                    }
                  });
                }}
                options={users.map(
                  (option) => option.email !== undefined && option.email,
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      users.forEach((item, index) => {
                        if (item.email !== e.target.value) {
                          setEmail(e.target.value);
                          setFirstName("");
                          setLastName("");
                          setPhone("");
                          setLogo([]);
                          setDisableUser(true);
                        }
                      });
                    }}
                  />
                )}
              />
              <PhoneBox
                name="phone"
                type="number"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
                maxLength="25"
                value={phone}
                disabled={disableUser}
                placeholder="Téléphone"
                onChange={({ target: { name, value } }) =>
                  value.length < 26 ? inputChange(name, value) : ""
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IDENTITY* :" />
            <Form.Row width="48%">
              <FormInput
                name="firstName"
                value={firstName}
                disabled={disableUser}
                placeholder="FIRST NAME"
                style={(GLOBALS.Styles.inputWidth, { marginRight: "10px" })}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FormInput
                name="lastName"
                value={lastName}
                disabled={disableUser}
                placeholder="LAST NAME"
                style={(GLOBALS.Styles.inputWidth, { marginRight: "10px" })}
                onChange={(e) => setLastName(e.target.value)}
              />
              {/* 
              <FormMultipleUpload
                name="logo"
                values={logo}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => setLogo(values)}
              /> */}
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="IMAGE " />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="logo"
                values={logo}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => setLogo(values)}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="COMPANY : " />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="Company"
                values={dropdownCompanies}
                value={selectedCompany}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = event.target.value;

                    setSelectedCompany(item);
                  } else {
                    setSelectedCompany("");
                  }
                }}
                style={{ marginRight: "20px", maxWidth: 250 }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="RÔLE : " />
            <Form.Row noMargin width="48%">
              <FormSelect
                name="color"
                placeholder="RÔLE : "
                style={GLOBALS.Styles.inputWidth}
                values={dropdownRoles}
                value={selectedRole}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;
                  if (index !== -1) {
                    const item = event.target.value;

                    setSelectedRole(item);
                  } else {
                    setSelectedRole("");
                  }
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="CONSTRUCTION SITE : " />
            <Form.Row noMargin width="48%">
              <FormInput
                name="site"
                disabled={true}
                value={siteName}
                placeholder="Site"
                style={{ ...GLOBALS.Styles.inputWidth, marginRight: "10px" }}
              />
            </Form.Row>
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              minWidth={200}
              text="CONTINUER"
              fullWidth={false}
              onClick={onSubmit}
              loading={loading}
              disabled={
                loading ||
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !selectedCompany ||
                !selectedRole
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}

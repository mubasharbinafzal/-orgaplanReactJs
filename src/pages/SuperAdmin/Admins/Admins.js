import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Modal from "../../../components/Modal";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import Pagination from "../../../components/Pagination";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import RadioButton from "../../../components/RadioButton";
import SearchInput from "../../../components/SearchInput";
import AvatarUpload from "../../../components/AvatarUpload";

import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
    backgroundColor: theme.palette.secondary.main,
  },
  error: {
    color: "red",
  },
}));

export default function Admins(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [data, setData] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [company, setCompany] = useState("");
  const [allCompanies, setAllCompanies] = useState([]);

  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [adminType, setAdminType] = useState("ADMINPERSITE");

  const [phoneError, setPhoneError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  async function fetchData() {
    try {
      setLoading(true);
      const admins = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMINS}?page=${page}&name=${query}`,
      });
      const companies = await GLOBALS.API({
        uri: `${GLOBALS.Constants.COMPANY}`,
      });

      setAllCompanies(companies.data.items);
      const companiesArray = [];
      companies.data.items.map((item) => {
        if (!item.adminId) {
          companiesArray.push({
            value: item._id,
            label: item.name,
          });
        }
        return true;
      });
      setModal(false);
      setItems(admins.data.items);
      setCompanies(companiesArray);
      setData(admins.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onUpdate(e) {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      formdata.append("phone", "+" + phone);
      formdata.append("lastName", lastName);
      formdata.append("firstName", firstName);
      // formdata.append("email", email);
      formdata.append("companyId", companyId);
      formdata.append("adminType", adminType);
      formdata.append("adminId", selectedItem._id);
      image.file && formdata.append("image", image.file);

      const result = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMINS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      const itemsArray = items.map((item) =>
        item._id === selectedItem._id
          ? { ...result.data, sites: item.sites }
          : item,
      );
      setItems(itemsArray);
      setModal(false);
      setLoading(false);
      resetForm();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onDelete(itemId) {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "DELETE",
          token: store.token,
          uri: GLOBALS.Constants.ADMIN_DELETE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
        fetchData();
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

  function resetForm() {
    setFirstName("");
    setEmail("");
    setLastName("");
    setPhone("");
    setImage("");
    setCompanyId("");
  }

  function handleChange(name, value) {
    if (name === "phone") setPhone(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "email") setEmail(value);
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
    if (name === "phone") {
      if (GLOBALS.Functions.phone(value))
        setPhoneError("Phone must be 10-25 digits");
      else setPhoneError("");
    } else if (name === "firstName") {
      if (GLOBALS.Functions.empty(value))
        setFirstNameError("First name is required");
      else setFirstNameError("");
    } else if (name === "email") {
      if (GLOBALS.Functions.empty(value)) setEmailError("email  is required");
      else setEmailError("");
    } else if (name === "lastName") {
      if (GLOBALS.Functions.empty(value))
        setLastNameError("Last name is required");
      else setLastNameError("");
    }
  }

  const rows = items.map((item) => {
    const sendTo = [
      item.company.name,
      item.firstName + " " + item.lastName,
      item.phone,
      item.sites,
    ];
    return [
      ...sendTo,
      <IconButton
        onClick={() => {
          setSelectedItem(item);
          setImage({
            uri: GLOBALS.Constants.BASE_URL + item.image,
          });
          setFirstName(item.firstName);
          setEmail(item.email);
          setLastName(item.lastName);
          setPhone(item.phone.substring(1));
          item.adminType && setAdminType(item.adminType);
          setCompanyId(item.company._id);
          item.company._id &&
            setCompany(
              allCompanies.find((item2) => item2._id === item.company._id),
            );
          setModal(true);
        }}
      >
        <Pencil style={{ width: 15, height: 15 }} />
      </IconButton>,
    ];
  });

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center">
          <Heading primary="ADMINS LIST" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading
                noMargin
                primary={data && `Total : ${data.totalItems} Admins`}
                bold
              />
              <Button
                fullWidth={false}
                component={NavLink}
                text="CREATE AN ADMIN"
                style={{ marginLeft: "20px" }}
                to={"/admins/add-admin"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin>
          <SearchInput
            value={query}
            placeholder="Name"
            onClick={fetchData}
            onChange={({ target: { value } }) => setQuery(value)}
          />
        </Form.Row>
        <div className={classes.content}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <Table headers={GLOBALS.Data.admins.headings} rows={rows} />
          )}
          {!loading && data.totalItems > 10 && (
            <Pagination
              page={page}
              count={data.totalPages}
              onChange={(e, value) => {
                setPage(value);
              }}
            />
          )}
        </div>
      </div>
      {update && ""}
      <Modal
        title="EDIT ADMIN"
        open={selectedItem ? modal : false}
        onClose={() => {
          setModal((st) => !st);
          resetForm();
          setPhoneError("");
        }}
        body={
          <Form.Form onSubmit={onUpdate}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                value={image}
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  handleChange("image", { file, uri });
                }}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="firstName"
                  value={firstName}
                  error={firstNameError}
                  placeholder="First Name"
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="lastName"
                  value={lastName}
                  error={lastNameError}
                  placeholder="Last Name"
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormInput
                  name="email"
                  value={email}
                  error={emailError}
                  disabled
                  placeholder="Email "
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <PhoneBox
                  name="phone"
                  type="number"
                  value={phone}
                  error={phoneError}
                  placeholder="Phone Number"
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                  onBlur={({ target: { name, value } }) =>
                    validation(name, value)
                  }
                />
                {phoneError && (
                  <div className={classes.error}>{phoneError}</div>
                )}
              </div>
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={{ width: "50%" }}>
                <FormSelect
                  name="companyId"
                  value={companyId}
                  values={companies}
                  placeholder={"Select Company"}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </div>
            </Form.Row>
            {company.type === "MASTERCLIENT" && (
              <Form.Row justifyContent="center">
                <div style={{ width: "50%" }}>
                  <RadioButton
                    name="adminType"
                    value={adminType}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, value)
                    }
                    items={[
                      { value: "ADMINPERSITE", label: "Admin Per Site" },
                      { value: "MASTERADMIN", label: "Master Admin" },
                    ]}
                  />
                </div>
              </Form.Row>
            )}
            <Form.Column alignItems="center">
              <Form.Row justifyContent="center">
                <Button
                  type="submit"
                  minWidth={200}
                  text="VALIDATE"
                  fullWidth={false}
                  loading={loading}
                  disabled={
                    loading ||
                    !firstName ||
                    !lastName ||
                    !phone ||
                    !/^[+]?\d{10,25}$/g.test(phone) ||
                    image === "" ||
                    !companyId
                  }
                />
              </Form.Row>
              <Form.Row justifyContent="center">
                <Button
                  text="DELETE"
                  minWidth="30%"
                  fullWidth={false}
                  loading={loading}
                  disabled={loading}
                  color={theme.palette.error.main}
                  onClick={() => onDelete(selectedItem._id)}
                />
              </Form.Row>
            </Form.Column>
          </Form.Form>
        }
      />
    </>
  );
}

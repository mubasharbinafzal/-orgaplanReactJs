import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Modal from "../../../components/Modal";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import SmallText from "../../../components/SmallText";
import Pagination from "../../../components/Pagination";
import SubHeading from "../../../components/SubHeading";
import ColorPicker from "../../../components/ColorPcker";
import RadioButton from "../../../components/RadioButton";
import SearchInput from "../../../components/SearchInput";
import AvatarUpload from "../../../components/AvatarUpload";

import { ReactComponent as Plus } from "../../../assets/icons/Plus.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Report } from "../../../assets/icons/Report.svg";

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
}));

export default function Clients(props) {
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

  const [modal, setModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedNestedItem, setSelectedNestedItem] = useState("");

  const [logo, setLogo] = useState([]);
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
  const [monthlyCost, setMonthlyCost] = useState("0");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  async function fetchData() {
    try {
      setLoading(true);
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}?page=${page}&name=${query}`,
      });
      setItems(result.data.items);
      setData(result.data);
      setModal(false);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "logo") setLogo(value);
    else if (name === "color") setColor(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "email") setEmail(value);
    else if (name === "phone") setPhone(value);
    else if (name === "contractType") {
      setContractStartDate("");
      setContractEndDate("");
      setContractType(value);
    } else if (name === "contractStartDate") setContractStartDate(value);
    else if (name === "contractEndDate") setContractEndDate(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "additionalInfo") setAdditionalInfo(value);
    else if (name === "monthlyCost") setMonthlyCost(value);
    setUpdate((st) => !st);
  }

  function modifyClick(item, contract) {
    setSelectedItem(item);
    setSelectedNestedItem(contract);
    setLogo({
      uri: GLOBALS.Constants.BASE_URL + item.companyId.logo,
    });
    setColor(item.companyId.color);
    if (item.companyId.incharge) {
      setFirstName(item.companyId.incharge.firstName || "");
      setLastName(item.companyId.incharge.lastName || "");
      setEmail(item.companyId.incharge.email || "");
      setPhone(item.companyId.incharge.phone.substring(1) || "");
    }
    setContractType(contract.contractType);
    if (contract.contractType === "MASTERCLIENT") {
      setContractStartDate(
        moment(contract.contractStartDate).format("YYYY-MM-DD"),
      );
      setContractEndDate(moment(contract.contractEndDate).format("YYYY-MM-DD"));
    }
    setFunctionality(contract.functionality);
    setAdditionalInfo(contract.additionalInfo);
    setMonthlyCost(contract.monthlyCost || 0);
    setModal(true);
  }

  async function onUpdate(e) {
    try {
      e.preventDefault();
      setLoading(true);
      var formdata = new FormData();
      logo.file && formdata.append("logo", logo.file);
      formdata.append("color", color);
      formdata.append("clientId", selectedItem._id);
      formdata.append("contractId", selectedNestedItem._id);
      formdata.append("companyId", selectedItem.companyId._id);
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("email", email);
      formdata.append("phone", "+" + phone);
      formdata.append("contractType", contractType);
      formdata.append("contractStartDate", contractStartDate);
      formdata.append("contractEndDate", contractEndDate);
      formdata.append("functionality", functionality);
      formdata.append("additionalInfo", additionalInfo);
      formdata.append("monthlyCost", monthlyCost);

      const result = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.CLIENTS,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      const itemsArray = items.map((item) =>
        item._id === selectedItem._id ? result.data : item,
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
          uri: GLOBALS.Constants.CLIENT_DELETE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
        fetchData();
        setModal(false);
        setLoading(false);
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

  function resetForm() {
    setLogo([]);
    setColor("green");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setContractType("CLIENTPERSITE");
    setContractStartDate("");
    setContractEndDate("");
    setFunctionality("DELIVERY");
    setAdditionalInfo("");
    setMonthlyCost("0");
  }

  const rows = [];
  items.map((item) => {
    if (item.companyId.quoteVerified) {
      item.contractIds.map((contract) => {
        rows.push([
          item.companyId.name,
          item.companyId.incharge
            ? `${item.companyId.incharge.firstName} ${item.companyId.incharge.lastName}`
            : "",
          item.companyId.incharge
            ? item.companyId.incharge.phone
              ? item.companyId.incharge.phone
              : ""
            : "",
          item.sites,
          contract.contractType === "MASTERCLIENT"
            ? moment(contract.contractStartDate).format("DD/MM/YY")
            : "-",
          contract.contractType === "MASTERCLIENT"
            ? moment(contract.contractEndDate).format("DD/MM/YY")
            : "-",
          contract.contractType,
          <>
            <IconButton
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                modifyClick(item, contract);
              }}
            >
              <Pencil style={{ width: 15, height: 15 }} />
            </IconButton>
            <IconButton
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                props.history.push(`/invoices/${item._id}`);
              }}
            >
              <Report style={{ width: 15, height: 15 }} />
            </IconButton>
          </>,
        ]);
        return true;
      });
    } else {
      rows.push([
        item.companyId.name,
        item.companyId.incharge.firstName +
          " " +
          item.companyId.incharge.lastName,
        item.companyId.incharge.phone ? item.companyId.incharge.phone : "",
        item.sites,
        "-",
        "-",
        "Requested",
        <IconButton
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            props.history.push({
              pathname: "/clients/verify-client",
              item,
            });
          }}
        >
          <Plus style={{ width: 15, height: 15 }} />
        </IconButton>,
      ]);
      return true;
    }
    return true;
  });

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center">
          <Heading primary="CLIENTS LIST" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading
                noMargin
                primary={data && `Total : ${data.totalItems} Clients`}
                bold
              />
              <Button
                fullWidth={false}
                component={NavLink}
                text="CREATE A CLIENT"
                style={{ marginLeft: "20px" }}
                to={"/clients/add-client"}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin>
          <SearchInput
            value={query}
            onClick={fetchData}
            placeholder="Name of Client"
            onChange={({ target: { value } }) => setQuery(value)}
          />
        </Form.Row>
        <div className={classes.content}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <Table
              rows={rows}
              onClick={(index) =>
                props.history.push(`/sites/${items[index]._id}`)
              }
              headers={GLOBALS.Data.clients.headings}
            />
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
        title="EDIT A CLIENT"
        open={selectedItem ? modal : false}
        onClose={() => {
          setModal((st) => !st);
          resetForm();
        }}
        body={
          <Form.Form onSubmit={onUpdate}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                value={logo}
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  handleChange("logo", { file, uri });
                }}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <div style={GLOBALS.Styles.inputWidth}>
                <ColorPicker
                  color={color}
                  handleChange={({ hex }) => handleChange("color", hex)}
                />
              </div>
            </Form.Row>
            <Form.Row>
              <FormInput
                name="firstName"
                value={firstName}
                error={errors.firstName}
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
                error={errors.lastName}
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
            <Form.Row>
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
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row>
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
            <Form.Row>
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
            <Form.Row justifyContent="center">
              <Form.Row noMargin alignItems="center" width="150px">
                <FormInput
                  type="number"
                  name="monthlyCost"
                  value={monthlyCost}
                  style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
                  onChange={({ target: { name, value } }) =>
                    value >= 0 && handleChange(name, value)
                  }
                />
                <SmallText primary="€/month" noMargin />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormInput
                textArea
                rows={3}
                name="additionalInfo"
                value={additionalInfo}
                error={errors.additionalInfo}
                placeholder="Additional information"
                onBlur={({ target: { name, value } }) =>
                  validation(name, value)
                }
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
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
                    !logo ||
                    errors.firstName ||
                    errors.lastName ||
                    errors.phone ||
                    errors.additionalInfo ||
                    (contractType === "MASTERCLIENT" &&
                      (!contractStartDate ||
                        !contractEndDate ||
                        moment(contractEndDate).diff(
                          moment(contractStartDate),
                          "days",
                        ) <= 0)) ||
                    Number(monthlyCost) < 0
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
                  onClick={() => onDelete(selectedItem._id)}
                  color={theme.palette.error.main}
                />
              </Form.Row>
            </Form.Column>
          </Form.Form>
        }
      />
    </>
  );
}

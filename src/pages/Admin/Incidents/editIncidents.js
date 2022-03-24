import React, { useState, useEffect } from "react";
import { TimePicker } from "antd";
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
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { useHistory } from "react-router-dom";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles(() => ({
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

export default function AddIncidents(props) {
  const classes = useStyles();
  const history = useHistory();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownLocation, setDropdownLocation] = useState([]);

  const [selectedLocationType, setselectedLocationType] = useState("");
  const [selectedLocation, setselectedLocation] = useState("");

  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  const [isBillable, setIsBillable] = useState(false);
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const [comment, setComment] = useState("");
  const [image, setImage] = useState([]);
  const [priceDisable, setPriceDisable] = useState("true");
  const [companies, setCompanies] = useState([]);
  const [generalContractor, setGeneralContractor] = useState("");
  const [isPaid, setIsPaid] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [adminStore, history]);
  useEffect(() => {
    fetchLocationDataOnTypeChange();
    // eslint-disable-next-line
  }, [selectedLocationType]);
  useEffect(() => {
    if (companyId) {
      let comp = companies.find((com) => com.companyId._id === companyId);
      if (comp.parentCompanyId) setGeneralContractor(comp.parentCompanyId.name);
      else setGeneralContractor("");
    }
    // eslint-disable-next-line
  }, [companyId]);

  const fetchData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_INCIDENT}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      if (response.data.site_companies) {
        setCompanies(response.data.site_companies);
        setDropdownCompanies(
          response.data.site_companies.map((item) => ({
            label: item.companyId.name,
            value: item.companyId._id,
          })),
        );
      }
      await setValues();
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const setValues = () => {
    const incident = history.location?.data;
    setName(incident.name);
    setCompanyId(incident?.companyId?._id);
    setDate(incident?.date);
    setIsBillable(incident?.isBillable);
    setPrice(incident?.price);
    setType(incident?.type);
    setStatus(incident?.status);
    setDescription(incident?.description);
    setIsPaid(incident.isPaid);
    setImage([{ key: 0, file: undefined, uri: incident.photos[0] }]);
    if (incident?.isBillable) {
      setPriceDisable("true");
    } else {
      setPriceDisable("false");
    }
    if (incident.location?.storageArea) {
      setselectedLocationType("storageArea");
      setselectedLocation(incident.location?.storageArea);
      const locationObject = {
        ["storageArea"]: incident.location?.storageArea,
      };
      setLocation(locationObject);
    } else if (incident.location?.deliveryArea) {
      setselectedLocationType("deliveryArea");

      setselectedLocation(incident.location?.deliveryArea);
      const locationObject = {
        ["deliveryArea"]: incident.location?.deliveryArea,
      };
      setLocation(locationObject);
    }
  };
  const handleChange = (name, value) => {
    if (name === "image") setImage(value);
  };
  const nameChange = (e) => {
    if (e.target.name === "name") setName(e.target.value);
    if (e.target.name === "date") setDate(e.target.value);
    if (e.target.name === "time") setTime(e.target.value);
    if (e.target.name === "description") setDescription(e.target.value);
    if (e.target.name === "isBillable") setIsBillable(e.target.value);
    if (e.target.name === "price") setPrice(e.target.value);
    if (e.target.name === "comment") setComment(e.target.value);
    if (e.target.name === "profile") setImage(e.target.value);
    if (e.target.name === "type") setType(e.target.value);
    if (e.target.name === "status") setStatus(e.target.value);
    if (e.target.name === "comapnyId") setCompanyId(e.target.value);
    if (e.target.name === "location") {
      setselectedLocation(e.target.value);
      const locationObject = {
        [selectedLocationType]: e.target.value,
      };
      setLocation(locationObject);
    }
  };
  const fetchLocationDataOnTypeChange = async () => {
    try {
      if (selectedLocationType === "storageArea") {
        const response = await GLOBALS.API({
          uri: `${GLOBALS.Constants.GET_STORAGE_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
          token: store.token,
        });
        const storageValue = [
          {
            label: response.data.name,
            value: response.data._id,
          },
        ];

        setDropdownLocation(storageValue);
      }
      if (selectedLocationType === "deliveryArea") {
        const response = await GLOBALS.API({
          uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
          token: store.token,
        });
        if (response.data) {
          setDropdownLocation(
            response.data.map((item) => ({
              label: item.name,
              value: item._id,
            })),
          );
        }
      }
    } catch (err) {}
  };

  const locationChange = (e) => {
    setselectedLocation(e.target.value);
    const locationObject = {
      [selectedLocationType]: e.target.value,
    };
    setLocation(locationObject);
  };

  const locationTypeChange = (e) => {
    setselectedLocationType(e.target.value);
  };
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      var formdata = new FormData();
      formdata.append("name", name);
      formdata.append("date", date);
      formdata.append("time", time);
      formdata.append("status", status);
      formdata.append("description", description);
      formdata.append("isBillable", isBillable);
      formdata.append("price", price);
      formdata.append("type", type);
      formdata.append("comment", comment);
      formdata.append("companyId", companyId);
      formdata.append("isPaid", isPaid);
      formdata.append("location", JSON.stringify(location));

      if (image[0]?.file) formdata.append("photos", image[0].file);
      formdata.append("siteId", adminStore.site.siteId._id);
      // for (let [key, value] of formdata) {
      //   console.log(`formdata in add user ${key}: ${value}`);
      // }
      await GLOBALS.API({
        method: "PUT",
        uri:
          GLOBALS.Constants.POST_ADD_SITE_INCIDENTS +
          "/" +
          props.location.data._id,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      props.history.goBack();
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const timeChange = (e) => {
    setTime(moment(e?._d).format("HH:mm:ss"));
  };
  console.log("selectedLocation", selectedLocation);
  console.log("location", location);

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="EDIT AN INCIDENTS" />
      <div className={classes.content}>
        <Form.Form onSubmit={submitHandler}>
          <Form.Row>
            <FormLabel bold primary="GENERAL :" />
            <Form.Row noMargin width="48%">
              <FormSelect
                name="type"
                id="bill"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={nameChange}
                value={type}
                values={[
                  { value: "INCIDENT", label: "Incident" },
                  { value: "MEAN", label: "Mean" },
                  { value: "DELAY", label: "Delay" },
                  { value: "UNEXPRECTED", label: "Unexp" },
                ]}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="DESIGNATION* :" />
            <FormInput
              name="name"
              style={GLOBALS.Styles.inputWidth}
              placeholder="Name of incident"
              onChange={nameChange}
              value={name}
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="NAME OF COMPANY* :" />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormSelect
                placeholder="Nom de I'enterprise"
                name="comapnyId"
                style={GLOBALS.Styles.inputWidth}
                onChange={nameChange}
                value={companyId}
                values={dropdownCompanies}
              />
              <SmallText
                primary={generalContractor}
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="DATE AND TIME : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                style={GLOBALS.Styles.inputWidth}
                placeholder="Date"
                name="date"
                onChange={nameChange}
                value={date}
              />
              <TimePicker
                name="time"
                format="HH:mm"
                style={{ width: "48%", height: "45px", color: "#8B8989" }}
                onChange={timeChange}
                // value={time}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="LOCATION : " />
            <Form.Row noMargin width="48%">
              <FormSelect
                placeholder="Type of location"
                name="locationType"
                style={GLOBALS.Styles.inputWidth}
                onChange={locationTypeChange}
                value={selectedLocationType}
                values={[
                  { value: "storageArea", label: "Storage Area" },
                  { value: "deliveryArea", label: "Delivery Area" },
                ]}
              />
              <FormSelect
                placeholder="LOCATION"
                name="location"
                style={GLOBALS.Styles.inputWidth}
                onChange={locationChange}
                value={selectedLocation}
                values={dropdownLocation}
                disabled={!selectedLocationType}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="DESCRIPTION : " />
            <FormInput
              textArea
              rows={3}
              value={description}
              style={GLOBALS.Styles.inputWidth}
              onChange={nameChange}
              placeholder="Information complementaires"
              name="description"
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="ADD PICTURES : " />
            <Form.Row noMargin width="48%">
              <FormMultipleUpload
                name="profile"
                values={image}
                style={GLOBALS.Styles.inputWidth}
                onChange={(values) => {
                  handleChange("image", values);
                }}
              />
            </Form.Row>
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="BILLABLE* : " />
            <Form.Row width="48%">
              <FormSelect
                key="1abc"
                name="comapnyId"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={(e) => {
                  setPriceDisable(e.target.value);
                  if (e.target.value === "false") {
                    setPrice("0");
                    setIsBillable(false);
                  } else if (e.target.value === "true") {
                    setIsBillable(true);
                  }
                }}
                value={isBillable}
                values={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="Paid : " />
            <Form.Row width="48%">
              <FormSelect
                disabled={priceDisable === "false" || priceDisable === false}
                name="paid"
                style={{ width: "40%", height: "45px", color: "#8B8989" }}
                onChange={(e) => {
                  if (e.target.value === "false") {
                    setIsPaid(false);
                  } else if (e.target.value === "true") {
                    setIsPaid(true);
                  }
                }}
                value={isPaid}
                values={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
              />
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="Status:" />
            <Form.Row width="48%" noMargin>
              <Form.Column noMargin>
                <RadioButton
                  name="status"
                  value={status}
                  // onChange={({ target: { name, value } }) =>
                  //   nameChange(name, value)
                  // }

                  onChange={nameChange}
                  items={[
                    {
                      value: "OPEN",
                      label: "Open",
                    },
                    { value: "CLOSED", label: "Closed" },
                  ]}
                />
              </Form.Column>
            </Form.Row>
          </Form.Row>

          <Form.Row>
            <FormLabel bold primary="AMOUNT :" />
            <Form.Row width="48%" noMargin alignItems="center">
              <Form.Row width="24%" noMargin alignItems="center">
                <FormInput
                  type="number"
                  name="price"
                  onChange={nameChange}
                  value={price}
                  disabled={priceDisable === "false" || priceDisable === false}
                />
                <SmallText style={{ marginLeft: 10 }} primary="€" />
              </Form.Row>
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="COMMENT ON INVOICE : " />
            <FormInput
              textArea
              rows={3}
              style={GLOBALS.Styles.inputWidth}
              onChange={nameChange}
              value={comment}
              placeholder="Ajouter un commentaire"
              name="comment"
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDER"
              fullWidth={false}
              disabled={!name || !date || !dropdownCompanies}
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}

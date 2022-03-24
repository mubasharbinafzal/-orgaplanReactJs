import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Chip from "@material-ui/core/Chip";
import _ from "lodash";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import SmallText from "../../../components/SmallText";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/FormInput";
import ColorPicker from "../../../components/ColorPcker";
import FormMultiSelect from "../../../components/FormMultiSelect";
import MultiAdderInput from "../../../components/MultiAdderInput";
import UnavailabilityTimes from "../../../components/UnavailabilityTimes";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
  chip: {
    color: theme.palette.primary.contrastText,
    marginRight: theme.spacing(1),
  },
}));

export default function DeliveryArea(props) {
  const { setSelectedShape } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [isFull, setIsFull] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#d71313");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDeliveryAreas, setSelectedDeliveryAreas] = useState([]);
  const [unavailability, setUnavailabilities] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("0");
  const [notificationTo, setNotificationTo] = useState([]);

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [means, setMeans] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [props]);

  async function fetchData() {
    try {
      const companies = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const deliveryAreas = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      setCompanies(
        companies.data.map((item) => ({
          value: item.companyId._id,
          label: item.companyId.name,
        })),
      );

      setDeliveryAreas(
        deliveryAreas.data.map((item) => ({
          value: item._id,
          label: item.name,
        })),
      );
      if (props.selectedShape) {
        const means = await GLOBALS.API({
          uri: `${GLOBALS.Constants.GET_STORAGE_AREA_MEANS}/${props.selectedShape.storageArea._id}`,
          token: store.token,
        });
        setMeans(means.data.map((item) => item.name));
        setName(props.selectedShape.storageArea.name);
        setIsFull(props.selectedShape.storageArea.isFull);
        props.selectedShape.storageArea.color !== undefined
          ? setColor(props.selectedShape.storageArea.color)
          : setColor(color);
        setStartDate(props.selectedShape.storageArea.availability.start);
        setEndDate(props.selectedShape.storageArea.availability.end || "");
        setSelectedDeliveryAreas(props.selectedShape.storageArea.deliveryArea);
        setUnavailabilities(
          props.selectedShape.storageArea.unavailability?.map((key, index) => {
            delete key._id;
            return key;
          }),
        );
        setSelectedCompanies(props.selectedShape.storageArea.companies);
        setNotificationPriorToDays(
          props.selectedShape.storageArea.notificationPriorToDays,
        );
        setNotificationTo(props.selectedShape.storageArea.notificationTo);
        setUpdate((st) => !st);
      } else {
        setEndDate(moment(adminStore.site.siteId.end).format("YYYY-MM-DD"));
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "name") setName(value);
    else if (name === "isFull") setIsFull(value);
    else if (name === "color") setColor(value);
    else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "deliveryAreas") setSelectedDeliveryAreas(value);
    else if (name === "unavailabilityDates") {
      setUpdate((st) => !st);
      setUnavailabilities(value);
    } else if (name === "companies") setSelectedCompanies(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") {
      setUpdate((st) => !st);
      setNotificationTo(value);
    }
  }
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const notificationToAr = notificationTo.map((item) => item.label);

      const formdata = {
        siteId: adminStore.site.siteId._id,
        isFull: isFull,
        name,
        color: color,
        availability: {
          start: startDate,
          end: endDate,
        },
        isInside: props.level ? true : false,
        deliveryArea: selectedDeliveryAreas,
        unavailability,
        companies: selectedCompanies,
        notificationPriorToDays,
        notificationTo: notificationToAr,
      };
      props.level && (formdata["level"] = props.level);

      let response = await GLOBALS.API({
        method: props.selectedShape ? "PUT" : "POST",
        uri: props.selectedShape
          ? `${GLOBALS.Constants.CREATE_STORAGE_AREA}/${props.selectedShape._id}`
          : GLOBALS.Constants.CREATE_STORAGE_AREA,
        token: store.token,
        body: JSON.stringify(formdata),
      });

      let propShapes = _.cloneDeep(props.shapes);
      let propShape = props.shape
        ? _.cloneDeep(props.shape)
        : _.cloneDeep(props.selectedShape);
      let inde = propShapes.findIndex((item) => item._id === propShape._id);
      propShapes[inde]._id = response.data._id;
      propShape._id = response.data._id;
      propShapes[inde].name = name;
      propShape.name = response.data.name;
      propShapes[inde].color = color;
      propShape.color = response.data.color;
      propShapes[inde].storageArea = response.data;
      propShape.storageArea = response.data;

      if (!props.selectedShape) {
        if (props.level) {
          await GLOBALS.API({
            method: "POST",
            uri: GLOBALS.Constants.ADMIN_LEVEL_PIC_SHAPE,
            token: store.token,
            body: JSON.stringify({
              picId: props.pic._id,
              mean: response.data._id,
              ...propShape,
            }),
          });
        } else {
          await GLOBALS.API({
            method: "POST",
            uri: GLOBALS.Constants.ADMIN_PIC_SHAPE,
            token: store.token,
            body: JSON.stringify({
              picId: props.pic._id,
              deliveryArea: response.data._id,
              ...propShape,
            }),
          });
        }
      }

      setLoading(false);
      props.setShapes(propShapes, propShape);
      setSelectedShape("");
      props.setSelectedShape("")
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.content}>
      <Form.Form onSubmit={onSubmit}>
        <Form.Row justifyContent="flex-end">
          <FormControlLabel
            control={
              <Checkbox
                name="isFull"
                color="default"
                checked={isFull}
                onChange={({ target: { name, checked } }) =>
                  handleChange(name, checked)
                }
              />
            }
            label="isFull"
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Name : " />
          <Form.Row noMargin width="65%">
            <FormInput
              name="name"
              value={name}
              placeholder="Name"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <div style={GLOBALS.Styles.inputWidth}>
              <ColorPicker
                color={color}
                handleChange={(color) => handleChange("color", color.hex)}
              />
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABILITY :" />
          <Form.Row noMargin width="65%">
            <FormInput
              type="date"
              name="startDate"
              value={startDate}
              min={
                moment().isAfter(moment(adminStore.site.siteId.start), "day")
                  ? moment().format("YYYY-MM-DD")
                  : moment(adminStore.site.siteId.start).format("YYYY-MM-DD")
              }
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              placeholder={`Date de début`}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormInput
              type="date"
              name="endDate"
              disabled={!startDate}
              placeholder="Date de fin"
              min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              value={endDate}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Unavailabilities: " />
          <Form.Row noMargin width="65%">
            <UnavailabilityTimes
              name="unavailabilityDates"
              values={unavailability}
              style={GLOBALS.Styles.inputWidth}
              unavailabilityDates={unavailability}
              setUnavailabilityDates={setUnavailabilities}
              startRange={startDate}
              endRange={moment(endDate).add(1, "days")}
              onChange={(values) => handleChange("unavailabilityDates", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Delivery Areas: " />
          <Form.Row noMargin width="65%">
            <FormMultiSelect
              name="deliveryAreas"
              values={deliveryAreas}
              placeholder="Delivery Areas"
              value={selectedDeliveryAreas}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Companies: " />
          <Form.Row noMargin width="65%">
            <FormMultiSelect
              name="companies"
              values={companies}
              placeholder="Companies"
              value={selectedCompanies}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="Means : " />
          <Form.Row noMargin width="65%" justifyContent="flex-start">
            {means.map((mean, index) => (
              <Chip key={index} label={mean} className={classes.chip} />
            ))}
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="NOTIFICATION : " />
          <Form.Row
            noMargin
            width="65%"
            alignItems="center"
            justifyContent="flex-start"
          >
            <FormInput
              type="number"
              placeholder="0"
              textAlign="center"
              name="notificationPriorToDays"
              value={notificationPriorToDays}
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
        <Form.Row>
          <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
          <Form.Row noMargin width="65%">
            <MultiAdderInput
              name="notificationTo"
              values={notificationTo ? notificationTo : ""}
              style={{ width: "100%" }}
              validateError="Invalid Email"
              placeholder="Enter email address"
              onChange={(values) => handleChange("notificationTo", values)}
              validate={(text) => {
                const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
                return !re.test(String(text).toLowerCase());
              }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              disabled={loading || !name || !color || !startDate}
            />
          </Form.ButtonContainer>
        </Form.Row>
      </Form.Form>
      {update && ""}
    </div>
  );
}

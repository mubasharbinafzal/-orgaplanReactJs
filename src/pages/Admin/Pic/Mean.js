import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import _ from "lodash";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import ColorPicker from "../../../components/ColorPcker";
import MeanLocationModal from "../../../components/MeanLocationModal";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import UnavailabilityTimes from "../../../components/UnavailabilityTimes";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function AddMean(props) {
  const classes = useStyles();
  const { setSelectedShape } = props;
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [meanType, setMeanType] = useState("");
  const [color, setColor] = useState("#d71313");
  const [image, setImage] = useState([]);
  const [locations, setLocations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [techSheet, setTechSheet] = useState([]);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [rate, setRate] = useState("0");
  const [addInfo, setAddInfo] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [storageAreas, setStorageAreas] = useState([]);
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_MEAN}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.data.site_delivery_areas !== null) {
        const temp = [];
        response.data.site_delivery_areas.map((item) =>
          temp.push({
            label: item.name,
            value: item._id,
          }),
        );
        setDeliveryAreas(temp);
      }
      if (response.data.site_storage_areas !== null) {
        const temp = [];
        response.data.site_storage_areas.map((item) =>
          temp.push({ label: item.name, value: item._id }),
        );
        setStorageAreas(temp);
      }
      if (props.selectedShape) {
        setName(props.selectedShape.mean.name);
        setMeanType(props.selectedShape.mean.meanType);
        setColor(props.selectedShape.mean.color);
        setUnavailabilities(
          props.selectedShape.mean.unavailability?.map((key, index) => {
            delete key._id;
            return key;
          }),
        );
        setStartDate(props.selectedShape.mean.availability.start);
        setEndDate(props.selectedShape.mean.availability.end || "");
        setRate(props.selectedShape.mean.pricePerHour);
        props.selectedShape.mean.image &&
          setImage([
            {
              key: 0,
              uri: props.selectedShape.mean.image,
            },
          ]);
        const locaAr = props.selectedShape.mean.location.map((loc) => ({
          key:
            loc.locationType === "STORAGEAREA"
              ? loc.storageArea
              : loc.deliveryArea,
          type: loc.locationType,
          label: loc.label,
        }));
        setLocations(locaAr);
        props.selectedShape.mean.sheet &&
          setTechSheet([
            {
              key: 0,
              uri: props.selectedShape.mean.sheet,
            },
          ]);
        setAddInfo(props.selectedShape.mean.additionalInfo);
        setUpdate((st) => !st);
        setLoading(false);
      } else {
        setEndDate(moment(adminStore.site.siteId.end).format("YYYY-MM-DD"));
        setLoading(false);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const handleChange = (name, value) => {
    if (name === "name") {
      setName(value);
    } else if (name === "color") setColor(value);
    else if (name === "meanType") setMeanType(value);
    else if (name === "image") {
      setImage(value);
      setUpdate((st) => !st);
    } else if (name === "locations") {
      setLocations(value);
      setUpdate((st) => !st);
    } else if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
    else if (name === "techSheet") setTechSheet(value);
    else if (name === "rate") setRate(value);
    else if (name === "addInfo") setAddInfo(value);
  };

  const createMean = async () => {
    
    try {
      setLoading(true);

      const locationsAr = locations.map((ite) => {
        let vals =
          ite.type === "STORAGEAREA"
            ? { storageArea: ite.key }
            : { deliveryArea: ite.key };
        return { locationType: ite.type, label: ite.label, ...vals };
      });
      var formdata = new FormData();
      let availabilities = {
        start: startDate,
        end: endDate,
      };

      formdata.append("siteId", adminStore.site.siteId._id);
      formdata.append("name", name);
      formdata.append("meanType", meanType);
      formdata.append("isInside", props.level ? true : false);
      props.level && formdata.append("level", props.level);
      formdata.append("color", color);
      image[0] && image[0].file
        ? formdata.append("image", image[0].file)
        : formdata.append("image", "uploads/mean/grey.png");

      formdata.append("location", JSON.stringify(locationsAr));
      formdata.append("availability", JSON.stringify(availabilities));
      techSheet[0] &&
        techSheet[0].file &&
        formdata.append("sheet", techSheet[0].file);
      formdata.append("unavailability", JSON.stringify(unavailabilities));
      formdata.append("pricePerHour", rate);
      formdata.append("additionalInfo", addInfo);
      const response = await GLOBALS.API({
        method: props.selectedShape ? "PUT" : "POST",
        uri: props.selectedShape
          ? `${GLOBALS.Constants.MEAN}/${props.selectedShape._id}`
          : GLOBALS.Constants.MEAN,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      let propShapes = _.cloneDeep(props.shapes);
      let propShape = props.shape
        ? _.cloneDeep(props.shape)
        : _.cloneDeep(props.selectedShape);
      let inde = propShapes.findIndex((item) => item._id === propShape._id);

      if (image[0] && image[0].file) {
        const formdataImage = new FormData();
        formdataImage.append("image", image[0].file);

        let imageData = await GLOBALS.API({
          method: "POST",
          uri: `${GLOBALS.Constants.FILE_UPLOAD}/mean`,
          headers: {},
          body: formdataImage,
        });
        propShapes[inde].image = imageData.image;
        propShape.image = imageData.image;
      } else {
        propShapes[inde].image = "uploads/mean/grey.png";
        propShape.image = "uploads/mean/grey.png";
      }
      propShapes[inde].color = color;
      propShape.color = color;
      propShapes[inde].mean = response.data;
      propShape.mean = response.data;
      propShapes[inde].name = name;
      propShape.name = name;
      propShapes[inde]._id = response.data._id;
      propShape._id = response.data._id;

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
              mean: response.data._id,
              ...propShape,
            }),
          });
        }
      }
      setLoading(false);
      props.setShapes(propShapes, propShape);
      setSelectedShape("");
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  var obj = [{ uri: "uploads/mean/grey.png" }];
  return (
    <div className={classes.content}>
      <Form.Form>
        <Form.Row>
          {update && ""}
          <FormLabel bold primary="IDENTITY * : " />
          <Form.Row
            noMargin
            width="65%"
            style={{ justifyContent: "space-between" }}
          >
            <FormInput
              name="name"
              value={name}
              placeholder="Name"
              style={{ width: "32%" }}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <FormSelect
              name="type"
              value={meanType}
              placeholder="Type"
              values={[
                {
                  label: "LIFTING",
                  value: "LIFTING",
                },
                {
                  label: "ROUTING",
                  value: "ROUTING",
                },
              ]}
              style={{ width: "32%" }}
              onChange={(event) => handleChange("meanType", event.target.value)}
            />
            <div style={{ width: "32%" }}>
              <ColorPicker
                color={color}
                handleChange={(values) => handleChange("color", values.hex)}
              />
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="IMAGE :  " />
          <Form.Row noMargin width="65%">
            <FormMultipleUpload
              name="image"
              values={
                image[0] && image[0].file
                  ? image
                  : image[0] && image[0].uri
                  ? image
                  : obj
              }
              onChange={(values) => {
                handleChange("image", values);
              }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="TECHNICAL SHEET :" />
          <Form.Row noMargin width="65%">
            <FormMultipleUpload
              name="techSheet"
              values={techSheet}
              fileTypes={["application/pdf"]}
              onChange={(values) => {
                handleChange("techSheet", values);
              }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="ACCESSIBILITY * :  " />
          <Form.Row noMargin width="65%">
            <MeanLocationModal
              name="location"
              values={locations}
              deliveryAreas={deliveryAreas.filter(
                (item) => !locations.some((item2) => item2.key === item.value),
              )}
              storageAreas={storageAreas.filter(
                (item) => !locations.some((item2) => item2.key === item.value),
              )}
              onChange={(values) => handleChange("locations", values)}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABILITIES * :" />
          <Form.Row noMargin width="65%" justifyContent="space-between">
            <FormInput
              type="date"
              name="startDate"
              value={startDate}
              style={{ width: "49%" }}
              placeholder={`Start date`}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              min={
                moment().isAfter(moment(adminStore.site.siteId.start), "day")
                  ? moment().format("YYYY-MM-DD")
                  : moment(adminStore.site.siteId.start).format("YYYY-MM-DD")
              }
            />
            <FormInput
              type="date"
              name="endDate"
              value={endDate}
              disabled={!startDate}
              placeholder="End date"
              style={{ width: "49%" }}
              min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
              max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        {startDate !== "" && endDate !== "" ? (
          <>
            <Form.Row>
              <FormLabel bold primary="UNAVAILABILITIES" />
              <Form.Row noMargin width="65%">
                <UnavailabilityTimes
                  name="unavailabilityDates"
                  values={unavailabilities}
                  style={GLOBALS.Styles.inputWidth}
                  unavailabilityDates={unavailabilities}
                  setUnavailabilityDates={setUnavailabilities}
                  startRange={startDate}
                  endRange={moment(endDate).add(1, "days")}
                  onChange={(values) =>
                    handleChange("unavailabilityDates", values)
                  }
                />
              </Form.Row>
            </Form.Row>
          </>
        ) : (
          ""
        )}
        <Form.Row alignItems="flex-start">
          <FormLabel bold primary="HOURLY RATE :" />
          <Form.Row noMargin width="65%">
            <div style={{ width: "49%", height: "100%", position: "relative" }}>
              <FormInput
                type="number"
                name="rate"
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
                value={rate}
              />
              <span style={{ position: "absolute", top: "25%", right: "5%" }}>
                €
              </span>
            </div>
          </Form.Row>
        </Form.Row>
        <Form.Row alignItems="flex-start">
          <FormLabel bold primary="ADDITIONAL INFORMATION :" />
          <Form.Row noMargin width="65%">
            <FormInput
              textArea
              rows={3}
              maxLength="300"
              style={{ width: "100%" }}
              placeholder="Informations complémentaires"
              name="addInfo"
              className="means-addinfo"
              onChange={({ target: { name, value } }) => {
                handleChange(name, value);
              }}
              value={addInfo}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <Form.ButtonContainer style={{ width: "80%" }}>
            <Button
              minWidth={200}
              text="VALIDATE"
              loading={loading}
              fullWidth={false}
              onClick={createMean}
              disabled={
                loading ||
                !name ||
                !meanType ||
                !color ||
                !startDate ||
                !endDate ||
                locations.length === 0
              }
            />
          </Form.ButtonContainer>
        </Form.Row>
      </Form.Form>
    </div>
  );
}

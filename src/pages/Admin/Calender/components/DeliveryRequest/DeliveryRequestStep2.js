import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import GLOBALS from "../../../../../globals";
import Actions from "../../../../../redux/actions";
import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import FormLabel from "../../../../../components/FormLabel";
import FormSelect from "../../../../../components/FormSelect";
import FormMultiSelect from "../../../../../components/FormMultiSelect";
import FormCheckbox from "../../../../../components/FormCheckbox";
export default function AddSiteStep1(props) {
  const dispatch = useDispatch();
  const adminStore = useSelector((state) => state.admin);
  const store = useSelector((state) => state.auth);
  const [building, setBuilding] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [storageArea, setStorageArea] = useState("");
  const [propsFilterStorageArea, setPropsFilterStorageArea] = useState();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [means, setMeans] = useState([]);
  const [routingMeans, setRoutingMeans] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [disableRoutingMeans, setDisableRoutingMeans] = useState("");

  const filterUnavailableStorageArea = () => {
    let tempArray = props.storageAreas.filter((filter, index) => {
      let flag = 0;
      filter.unavailability?.map((key, index) => {
        if (key.dayOff === false) {
          let DBStartTime = moment(key.date).set("hours", key.startHour);
          let DBEndTime = moment(key.date).set("hours", key.endHour);
          if (
            moment(startTime).isBetween(
              DBStartTime,
              DBEndTime,
              undefined,
              "[]",
            ) ||
            moment(endTime).isBetween(DBStartTime, DBEndTime, undefined, "[]")
          ) {
            // matched
            flag = 1;
          } else {
            // not matched
          }
        }
      });
      if (flag === 0) {
        return filter;
      }
    });
    setPropsFilterStorageArea(tempArray);
  };
  useEffect(() => {
    if (props.step1Data) {
      props.step1Data.startTime &&
        setStartTime(
          moment(props.step1Data.date)
            .set("hours", props.step1Data.startTime.split(":")[0])
            .set("minutes", props.step1Data.startTime.split(":")[1]),
        );
      props.step1Data.endTime &&
        setEndTime(
          moment(props.step1Data.date)
            .set("hours", props.step1Data.endTime.split(":")[0])
            .set("minutes", props.step1Data.endTime.split(":")[1]),
        );
    }
  }, []);

  useEffect(() => {
    if (props.step2Data) {
      if (props.step2Data.building) {
        setBuilding(props.step2Data.building);
      } else if (props.eventId) {
        setBuilding("Exterior");
      }
    }
    // eslint-disable-next-line
  }, [props.step2Data]);

  useEffect(() => {
    setBuildings(
      props.buildings.map((item) => ({
        value: item._id,
        label: item.name,
      })),
    );
    // eslint-disable-next-line
  }, []);
  const getAllDeliveryMean = async (meanArray) => {
    if (meanArray.length !== 0) {
      // Start  checking mean Availabilty in Delivery Request
      const getAllDelivery = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_VALIDATED_DELIVERY_MEAN}`,
        token: store.token,
      });
      getAllDelivery.data?.map((delivery, dIndex) => {
        /*start hours and mints Convert into Date Object*/
        let DBstartDate = new Date(delivery.date);
        let startHours = delivery.startTime.slice(0, 2);
        let startmint = delivery.startTime.slice(3, 5);
        DBstartDate.setHours(startHours);
        DBstartDate.setMinutes(startmint);
        /*start hours and mints Convert into Date Object*/

        /*End hours and mints Convert into Date Object*/
        let DBEndDate = new Date(delivery.date);
        let endHours = delivery.endTime.slice(0, 2);
        let endmint = delivery.endTime.slice(3, 5);
        DBEndDate.setHours(endHours);
        DBEndDate.setMinutes(endmint);
        /*End hours and mints Convert into Date Object*/

        delivery?.routingMeans.map((dmean, dmIndex) => {
          meanArray = meanArray?.filter((mean, mIndex) => {
            if (
              dmean === mean.value &&
              moment(DBstartDate).isBetween(
                startTime,
                endTime,
                undefined,
                "[]",
              ) &&
              moment(DBEndDate).isBetween(startTime, endTime, undefined, "[]")
            ) {
              // remove matched array
              // console.log("mean matched", mean.label);
            } else {
              //console.log("mean not matched", mean.label);
              return mean;
            }
          });
        });
      });
      // END checking mean Availabilty in Delivery Request
    }
    // Start checking mean Availabilty in Mean Booking
    const getAllMeanBooking = await GLOBALS.API({
      uri: `${GLOBALS.Constants.GET_VALIDATED_MEAN}`,
      token: store.token,
    });

    getAllMeanBooking.data.map((meanB, Bindex) => {
      meanArray = meanArray.filter((dmean, dindex) => {
        if (
          (dmean.value === meanB._id &&
            moment(meanB.startDate).isBetween(
              startTime,
              endTime,
              undefined,
              "[]",
            )) ||
          // remove &&
          moment(meanB.endDate).isBetween(startTime, endTime, undefined, "[]")
        ) {
          //match mean remove
        } else {
          // return filtered mean
          return dmean;
        }
      });
    });
    // END checking mean Availabilty in Mean Booking

    // check mean Unavailability   //
    meanArray = meanArray.filter((filter, index) => {
      let flag = 0;
      console.log(filter);
      filter.unavailability?.map((key, index) => {
        if (key.dayOff === false) {
          let DBStartTime = moment(key.date).set("hours", key.startHour);
          let DBEndTime = moment(key.date).set("hours", key.endHour);
          if (
            moment(startTime).isBetween(
              DBStartTime,
              DBEndTime,
              undefined,
              "[]",
            ) ||
            moment(endTime).isBetween(DBStartTime, DBEndTime, undefined, "[]")
          ) {
            // matched
            console.log("flag on");
            flag = 1;
          } else {
            // not matched
            console.log("flag off");
          }
        }
      });
      if (flag === 0) {
        return filter;
      }
    });
    // check mean unavailability  //
    return meanArray;
  };
  useEffect(() => {
    let mean_array = props.means.reduce((accumulator, currentValue) => {
      if (
        currentValue.meanType === "ROUTING" &&
        currentValue.location.find(
          (loc) => loc.storageArea && loc.storageArea === storageArea,
        ) &&
        moment(props.date).isBetween(
          currentValue.availability.start,
          currentValue.availability.end,
          "day",
          "[]",
        )
      ) {
        accumulator.push({
          value: currentValue._id,
          label: currentValue.name,
          currentValue,
          unavailability: currentValue.unavailability,
        });
      }
      return accumulator;
    }, []);

    let delivery_means = getAllDeliveryMean(mean_array);
    delivery_means.then((mean) => {
      setMeans(mean);
    });
    filterUnavailableStorageArea();
    // eslint-disable-next-line
  }, [props, storageArea, startTime, endTime]);

  useEffect(() => {
    if (building) {
      setLevel("");
      setStorageArea("");
      let buil = props.buildings.find((item) => item._id === building);
      if (buil) {
        setLevels(
          buil.levels.map((item) => ({
            value: item._id,
            label: item.number,
          })),
        );
      }
      if (props.step2Data && !rendered) {
        setLevel(props.step2Data.level);
        setStorageArea(props.step2Data.storageArea);

        if (props.step2Data.routingMeans.length === 0) {
          setDisableRoutingMeans(true);
        } else {
          setRoutingMeans(props.step2Data.routingMeans);
        }

        setRendered(true);
      }
    }
    // eslint-disable-next-line
  }, [building]);
  async function onSubmit(e) {
    e.preventDefault();
    let selectedRoutingMeans = means.filter((o1) =>
      routingMeans?.some((o2) => o1.value === o2),
    );
    console.log("selectedRoutingMeans", selectedRoutingMeans);

    const values = {
      building,
      level,
      storageArea,
      selectedRoutingMeans,
      routingMeans,
    };
    props.setStep2Data(values);
    props.setStep(3);
  }

  const selectedCompanyId = props.step1Data.company;
  const filterStorageAreas = [];
  propsFilterStorageArea?.forEach((val) => {
    val.companies.map((cP) => {
      if (cP === selectedCompanyId) {
        filterStorageAreas.push(val);
      }
    });
  });

  return (
    <Form.Form onSubmit={onSubmit}>
      <Form.Row>
        <FormLabel bold primary="LOCATION* :" />
        <FormSelect
          name="location"
          value={building}
          disabled={props.eventId}
          placeholder="Select a location"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setBuilding(value)}
          values={[...[{ label: "Exterior", value: "Exterior" }], ...buildings]}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="LEVEL* :" />
        <FormSelect
          name="level"
          value={level}
          values={levels}
          placeholder="Select a Level"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLevel(value)}
          disabled={!building || building === "Exterior" || props.eventId}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="STORAGE AREA*:" />
        <Form.Row noMargin width="48%">
          <FormSelect
            name="storageArea"
            value={storageArea}
            placeholder="Select Storage Area"
            values={filterStorageAreas.filter((item) =>
              building && building === "Exterior"
                ? !item.level
                : item.level === level,
            )}
            onChange={({ target: { value } }) => setStorageArea(value)}
            disabled={
              !building || (building !== "Exterior" && !level) || props.eventId
            }
          />
        </Form.Row>
      </Form.Row>

      <Form.Row>
        <FormLabel bold primary="TRANSPORTING MEANS* :" />
        <Form.Row noMargin width="48%">
          <FormMultiSelect
            name="means"
            values={means}
            placeholder="Means"
            value={routingMeans}
            disabled={!storageArea || disableRoutingMeans}
            onChange={({ target: { value } }) => setRoutingMeans(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <div class="col-sm-6" style={{ paddingLeft: "0px" }}>
          <FormLabel bold primary="" />
        </div>
        <div class="col-sm-6" style={{ paddingLeft: "30px" }}>
          <FormCheckbox
            name={disableRoutingMeans}
            checked={disableRoutingMeans}
            onChange={(event) => {
              setDisableRoutingMeans(event.target.checked);
              setRoutingMeans([]);
            }}
            style={{ color: "#DBB20A" }}
            label="none"
          />
        </div>
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          disabled={
            !building || (building !== "Exterior" && !level) || !storageArea
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}

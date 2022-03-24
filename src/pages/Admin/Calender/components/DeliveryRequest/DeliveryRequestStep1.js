import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";

import GLOBALS from "../../../../../globals";
import { useSelector, useDispatch } from "react-redux";

import Form from "../../../../../components/Form";
import Button from "../../../../../components/Button";
import FormInput from "../../../../../components/FormInput";
import FormLabel from "../../../../../components/FormLabel";
import TimeInput from "../../../../../components/TimeInput";
import FormSelect from "../../../../../components/FormSelect";
import FormMultiSelect from "../../../../../components/FormMultiSelect";
import MultiAdderInput from "../../../../../components/MultiAdderInput";
import Checkbox from "@material-ui/core/Checkbox";
import FormCheckbox from "../../../../../components/FormCheckbox";
export default function AddSiteStep1(props) {
  const adminStore = useSelector((state) => state.admin);
  const store = useSelector((state) => state.auth);
  const [company, setCompany] = useState("");
  let { deliveryArea, setDeliveryArea } = props;
  const [filterdeliveryArea, setFilterdeliveryArea] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [trades, setTrades] = useState([]);
  const [means, setMeans] = useState([]);
  const [liftingMeans, setLiftingMeans] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [update, setUpdate] = useState(false);
  const [disableMean, setDisableMean] = useState("");
  const [siteAvailabilityStart] = useState(adminStore.site.siteId.start);
  const [siteAvailabilityEnd] = useState(adminStore.site.siteId.end);
  const [disableLiftingMeans, setDisableLiftingMeans] = useState(false);
  let endTimeDisabledHours = [];
  let startTimeDisabledHours = [];
  var minutes = [];

  const getDisabledHoursEndTime = () => {
    for (var i = 0; i <= moment(startTime).format("h"); i++) {
      endTimeDisabledHours.push(i);
    }
    return;
  };

  const getDisabledHoursStartTime = () => {
    return endTimeDisabledHours;
  };

  const checkavailability = (value) => {
    let customDate = "2021-06-06";
    return true;
  };
  // filter delivery area Which are not availbile
  const filterUnavailableDeliveryArea = () => {
    let tempArray = props.deliveryAreas.filter((filter, index) => {
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
    setFilterdeliveryArea(tempArray);
  };

  const getAllDeliveryMean = async (meanArray) => {
    let deliveryMeanArray = [];
    let meanBooking = [];
    if (meanArray.length !== 0) {
      // if edit validate DR then
      // if (props.editDelivery) {
      //   return meanArray;
      // }
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

        delivery?.liftingMeans.map((dmean, dmIndex) => {
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
            } else {
              // means which are not matched
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
          // remove && operaator
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

    // check mean unavailability //

    meanArray = meanArray.filter((filter, index) => {
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
    // check mean unavailability  //
    return meanArray;
  };
  useEffect(() => {
    if (props.step1Data) {
      setCompany(props.step1Data.company);
      setDeliveryArea(props.step1Data.deliveryArea);
      setDate(props.step1Data.date);
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
      setTrades(props.step1Data.trades);
      setMaterials(
        props.step1Data.materials &&
          props.step1Data.materials.map((item, i) => ({ key: i, label: item })),
      );
      if (props.step1Data.liftingMeans.length === 0) {
        setDisableLiftingMeans(true);
      } else {
        setLiftingMeans(props.step1Data.liftingMeans);
      }

      setUpdate((st) => !st);
    } else {
      setDate(props.date);
      setStartTime(moment(props.date).set("hour", props.start));
      setEndTime(moment(props.date).set("hour", props.end));
    }
    // eslint-disable-next-line
  }, [props.step1Data]);
  useEffect(() => {
    let mean_array = props.means.reduce((accumulator, currentValue) => {
      if (
        currentValue.meanType === "LIFTING" &&
        currentValue.location.find(
          (loc) => loc.deliveryArea && loc.deliveryArea === deliveryArea,
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
          currentValue: currentValue,
          unavailability: currentValue.unavailability,
        });
      }

      return accumulator;
    }, []);

    let delivery_means = getAllDeliveryMean(mean_array);

    delivery_means.then((mean) => {
      setMeans(mean);
    });
    filterUnavailableDeliveryArea();
    // eslint-disable-next-line
  }, [deliveryArea, date, startTime, endTime]);

  async function onSubmit(e) {
    e.preventDefault();
    let selectedMeans = means.filter((o1) =>
      liftingMeans?.some((o2) => o1.value === o2),
    );
    const values = {
      company,
      deliveryArea,
      date,
      selectedMeans,
      startTime: moment(startTime).format("HH:mm"),
      endTime: moment(endTime).format("HH:mm"),
      trades,
      liftingMeans,
      materials: materials.map((item) => item.label),
    };
    props.setStep1Data(values);
    props.setStep(2);
  }
  function disabledDate2(current) {
    let customDate = "2021-6-6";
    return (
      (current && current < moment(customDate, "YYYY-MM-DD")) ||
      current > moment(customDate, "YYYY-MM-DD")
    );
  }

  const DateRangeforminmax2 = (value) => {
    let customDate = "2021-06-06";

    if (value === customDate) {
      alert("notavailable");
      return false;
    } else {
      return true;
    }
  };
  return (
    <Form.Form onSubmit={onSubmit}>
      {update && ""}
      <Form.Row>
        <FormLabel bold primary="COMPANY* :" />
        <FormSelect
          name="company"
          value={company}
          disabled={props.eventId}
          values={props.companies}
          placeholder="Select a Company"
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setCompany(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="DELIVERY AREA* :" />
        <FormSelect
          name="deliveryArea"
          value={deliveryArea}
          disabled={props.eventId}
          // values={props.deliveryAreas}
          values={filterdeliveryArea}
          style={GLOBALS.Styles.inputWidth}
          placeholder="Select a Delivery Area"
          onChange={({ target: { value } }) => setDeliveryArea(value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="DATE AND TIME* :" />
        <Form.Row width="48%" noMargin>
          <FormInput
            type="date"
            name="date"
            value={date}
            // disabled={true}
            placeholder="Date"
            style={{ width: "31%" }}
            min={moment().format("YYYY-MM-DD")}
            // disabledDate={disabledDate}
            onChange={({ target: { value } }) => {
              checkavailability(value) && setDate(value);
            }}
          />
          <TimeInput
            format="HH:mm"
            minuteStep={15}
            name="startTime"
            value={startTime}
            disabledHours={getDisabledHoursEndTime()}
            // disabledMinutes={(a) => getDisabledMinutes(a)}
            placeholder="Start Time"
            style={{ width: "31%" }}
            onChange={(value) => setStartTime(value)}
          />
          <TimeInput
            name="endTime"
            format="HH:mm"
            minuteStep={15}
            value={endTime}
            disabledHours={getDisabledHoursStartTime()}
            // disabledMinutes={(a) => getDisabledEndMinutes(a)}
            placeholder="End Time"
            style={{ width: "31%" }}
            onChange={(value) => setEndTime(value)}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="SELECT TRADES* :" />
        <FormMultiSelect
          name="trades"
          value={trades}
          placeholder="Trades"
          values={props.trades}
          disabled={props.eventId}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setTrades(value)}
        />
      </Form.Row>

      <Form.Row>
        <FormLabel bold primary="UNLOADING MEANS* :" />
        <FormMultiSelect
          name="means"
          values={means}
          placeholder="Means"
          value={liftingMeans}
          disabled={!deliveryArea || disableLiftingMeans}
          style={GLOBALS.Styles.inputWidth}
          onChange={({ target: { value } }) => setLiftingMeans(value)}
        />
      </Form.Row>
      <Form.Row>
        <div class="col-sm-6" style={{ paddingLeft: "0px" }}>
          <FormLabel bold primary="" />
        </div>
        <div class="col-sm-6" style={{ paddingLeft: "30px" }}>
          <FormCheckbox
            name={disableLiftingMeans}
            checked={disableLiftingMeans}
            onChange={(event) => {
              setDisableLiftingMeans(event.target.checked);
              setLiftingMeans([]);
            }}
            style={{ color: "#DBB20A" }}
            label="none"
          />
        </div>
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="MATERIALS DELIVERED* :" />
        <MultiAdderInput
          name="materials"
          values={materials}
          disabled={props.eventId}
          placeholder="Enter Materials"
          style={GLOBALS.Styles.inputWidth}
          onChange={(values) => {
            setMaterials(values);
            setUpdate((st) => !st);
          }}
        />
        {/* {
              !props.eventId && setMaterials(values);
              !props.eventId && setUpdate((st) => !st);
            } */}
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          disabled={
            !company ||
            !deliveryArea ||
            !date ||
            !startTime ||
            !endTime ||
            trades.length === 0 ||
            materials.length === 0
          }
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}

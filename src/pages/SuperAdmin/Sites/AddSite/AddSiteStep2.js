import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";
import SmallText from "../../../../components/SmallText";
import FormInput from "../../../../components/FormInput";
import FormLabel from "../../../../components/FormLabel";
import OpeningTimes from "../../../../components/OpeningTimes";
import MultiAdderInput from "../../../../components/MultiAdderInput";
import UnavailabilityTimes from "../../../../components/UnavailabilityTimes";

export default function AddSiteStep2(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [openingHours, setOpeningHours] = useState({
    day1Start: 0,
    day1End: 23,
    day1Off: false,
    day2Start: 0,
    day2End: 23,
    day2Off: false,
    day3Start: 0,
    day3End: 23,
    day3Off: false,
    day4Start: 0,
    day4End: 23,
    day4Off: false,
    day5Start: 0,
    day5End: 23,
    day5Off: false,
    day6Start: 0,
    day6End: 23,
    day6Off: true,
    day7Start: 0,
    day7End: 23,
    day7Off: true,
  });
  const [unavailabilityDates, setUnavailabilityDates] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [notificationPriorToDays, setNotificationPriorToDays] = useState("0");
  const [notificationTo, setNotificationTo] = useState([]);

  function handleChange(name, value) {
    if (name === "start") {
      setEnd("");
      setStart(value);
    } else if (name === "end") setEnd(value);
    else if (name === "openingHours") {
      setUpdate((st) => !st);
      setOpeningHours(value);
    } else if (name === "unavailabilityDates") {
      setUpdate((st) => !st);
      setUnavailabilityDates(value);
    } else if (name === "additionalInfo") setAdditionalInfo(value);
    else if (name === "notificationPriorToDays")
      setNotificationPriorToDays(value);
    else if (name === "notificationTo") {
      setUpdate((st) => !st);
      setNotificationTo(value);
    }
  }

  async function onSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);

      const notificationToArray = notificationTo.map((item) => item.label);
      let step1 = props.step1Data;
      const trades = step1.trades.map((item) => item.label);
      const addresses = step1.addresses.map((item) => ({
        street: item.street,
        city: item.city,
        postal: item.postal,
      }));
      let openingHoursArray = [
        {
          day: 1,
          startHour: openingHours.day1Start,
          endHour: openingHours.day1End,
          dayOff: openingHours.day1Off,
        },
        {
          day: 2,
          startHour: openingHours.day2Start,
          endHour: openingHours.day2End,
          dayOff: openingHours.day2Off,
        },
        {
          day: 3,
          startHour: openingHours.day3Start,
          endHour: openingHours.day3End,
          dayOff: openingHours.day3Off,
        },
        {
          day: 4,
          startHour: openingHours.day4Start,
          endHour: openingHours.day4End,
          dayOff: openingHours.day4Off,
        },
        {
          day: 5,
          startHour: openingHours.day5Start,
          endHour: openingHours.day5End,
          dayOff: openingHours.day5Off,
        },
        {
          day: 6,
          startHour: openingHours.day6Start,
          endHour: openingHours.day6End,
          dayOff: openingHours.day6Off,
        },
        {
          day: 7,
          startHour: openingHours.day7Start,
          endHour: openingHours.day7End,
          dayOff: openingHours.day7Off,
        },
      ];
      var formdata = new FormData();
      formdata.append("name", step1.name);
      step1.logo.length > 0 && formdata.append("logo", step1.logo[0].file);
      formdata.append("zacId", step1.zacId);
      formdata.append("clientAdmin", JSON.stringify(step1.clientAdmin));
      formdata.append("functionality", step1.functionality);
      formdata.append("addresses", JSON.stringify(addresses));
      formdata.append("trades", JSON.stringify(trades));
      formdata.append(
        "penaltyforLateDelivery",
        Number(step1.penaltyforLateDelivery),
      );
      formdata.append(
        "penaltyforUnexpDelivery",
        Number(step1.penaltyforUnexpDelivery),
      );

      formdata.append("start", start);
      formdata.append("end", end);
      formdata.append("openingHours", JSON.stringify(openingHoursArray));
      formdata.append(
        "unavailabilityDates",
        JSON.stringify(unavailabilityDates),
      );
      formdata.append("additionalInfo", additionalInfo);
      formdata.append(
        "notificationPriorToDays",
        Number(notificationPriorToDays),
      );
      formdata.append("notificationTo", JSON.stringify(notificationToArray));

      // for (let [key, value] of formdata) {
      //   console.log(`formdatais in add site step 2 ${key}: ${value}`);
      // }
      const data = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.SITES,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      props.setStep2Data(data);
      setLoading(false);
      props.setStep(3);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <Form.Form onSubmit={onSubmit}>
      <Form.Row>
        <FormLabel bold primary="SITE DATES* : " />
        <Form.Row width="48%" noMargin>
          <FormInput
            type="date"
            name="start"
            value={start}
            // error={start}
            placeholder="Start date"
            style={GLOBALS.Styles.inputWidth}
            min={moment().format("YYYY-MM-DD")}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
          />
          <FormInput
            name="end"
            type="date"
            value={end}
            // error={end}
            disabled={!start}
            placeholder="End date"
            style={GLOBALS.Styles.inputWidth}
            min={moment(start).add(1, "days").format("YYYY-MM-DD")}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
          />
        </Form.Row>
      </Form.Row>
      {update && ""}
      <Form.Row>
        <FormLabel bold primary="OPENING TIME : " />
        <Form.Row
          noMargin
          width="48%"
          alignItems="center"
          justifyContent="flex-start"
        >
          <OpeningTimes
            name="openingHours"
            values={openingHours}
            style={GLOBALS.Styles.inputWidth}
            onChange={(value) => handleChange("openingHours", value)}
          />
        </Form.Row>
      </Form.Row>

      {start !== "" && end !== "" ? (
        <>
          <Form.Row>
            <FormLabel bold primary="UNAVAILABILITY TIME :" />
            <Form.Row
              noMargin
              width="48%"
              alignItems="center"
              justifyContent="flex-start"
            >
              <UnavailabilityTimes
                name="unavailabilityDates"
                values={unavailabilityDates}
                style={GLOBALS.Styles.inputWidth}
                unavailabilityDates={unavailabilityDates}
                setUnavailabilityDates={setUnavailabilityDates}
                startRange={start}
                endRange={moment(end).add(1, "days")}
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

      <Form.Row>
        <FormLabel bold primary="ADDITIONNAL INFORMATION :" />
        <FormInput
          textArea
          rows={3}
          maxLength="300"
          name="additionalInfo"
          value={additionalInfo}
          style={GLOBALS.Styles.inputWidth}
          placeholder="Additional information"
          // error={additionalInfo}
          onChange={({ target: { name, value } }) => handleChange(name, value)}
        />
      </Form.Row>
      <Form.Row>
        <FormLabel bold primary="NOTIFICATION : " />
        <Form.Row
          noMargin
          width="48%"
          justifyContent="flex-start"
          alignItems="center"
        >
          <FormInput
            type="number"
            name="notificationPriorToDays"
            value={notificationPriorToDays}
            // error={notificationPriorToDays}
            style={{ ...GLOBALS.Styles.inputWidth, maxWidth: 100 }}
            onChange={({ target: { name, value } }) =>
              value >= 0 && handleChange(name, value)
            }
          />
          <SmallText
            style={{ marginLeft: 10 }}
            primary="Days before end of the site"
          />
        </Form.Row>
      </Form.Row>
      <Form.Row style={{ alignItems: "flex-start" }}>
        <FormLabel bold primary="NOTIFY THE ADDRESSES : " />
        <MultiAdderInput
          name="notificationTo"
          values={notificationTo}
          validateError="Invalid Email"
          style={GLOBALS.Styles.inputWidth}
          placeholder="Enter email address"
          onChange={(values) => handleChange("notificationTo", values)}
          validate={(text) => {
            const re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
            return !re.test(String(text).toLowerCase());
          }}
        />
      </Form.Row>
      <Form.ButtonContainer>
        <Button
          type="submit"
          minWidth={200}
          text="VALIDATE"
          fullWidth={false}
          loading={loading}
          disabled={loading || !start || !end}
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}

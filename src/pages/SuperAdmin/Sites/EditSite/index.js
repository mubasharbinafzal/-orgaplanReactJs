import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import EditSiteStep1 from "./EditSiteStep1";
import EditSiteStep2 from "./EditSiteStep2";
import EditSiteStep3 from "./EditSiteStep3";
import Stepper from "../../../../components/Stepper";
import Heading from "../../../../components/Heading";
import { ReactComponent as BackArrow } from "../../../../assets/icons/BackArrow.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function EditSite(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const store = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [step1Data, setStep1Data] = useState("");
  const [step2Data, setStep2Data] = useState("");
  const [step2SubmittedData, setStep2SubmittedData] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_GET}/${props.match.params.siteId}`,
      });
      response = response.data;

      const trades = response.trades.map((trade, index) => ({
        key: index,
        label: trade,
      }));
      const addresses = response.addresses.map((address, index) => ({
        _id: index,
        street: address.street,
        city: address.city,
        postal: address.postal,
        label: `${address.street} ${address.city} ${address.postal}`,
      }));
      setStep1Data({
        name: response.name,
        logo: response.logo,
        zacId: response.zacId?._id,
        adminId: response.clientAdmin,
        functionality: response.functionality,
        addresses: addresses,
        trades: trades,
        penaltyforLateDelivery: response.penaltyforLateDelivery,
        penaltyforUnexpDelivery: response.penaltyforUnexpDelivery,
      });

      const openingHours = {};
      response.openingHours.map((day) => {
        openingHours[`day${day.day}Start`] = day.startHour;
        openingHours[`day${day.day}End`] = day.endHour;
        openingHours[`day${day.day}Off`] = day.dayOff;
        return true;
      });
      const unavailabilityDates = [];

      response.unavailabilityDates.map((key) => {
        unavailabilityDates.push({
          date: key.date,
          dayOff: key.dayOff,
          endHour: key.endHour,
          reason: key.reason,
          startHour: key.startHour,
        });
        return true;
      });
      const notificationToArray = response.notificationTo.map(
        (notification, index) => ({
          key: index,
          label: notification,
        }),
      );
      setStep2Data({
        start: moment(response.start).format("YYYY-MM-DD"),
        end: moment(response.end).format("YYYY-MM-DD"),
        openingHours: openingHours,
        unavailabilityDates: unavailabilityDates,
        additionalInfo: response.additionalInfo,
        notificationPriorToDays: response.notificationPriorToDays,
        notificationTo: notificationToArray,
      });

      setData(response);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="EDIT A SITE" />
      <Stepper
        step={step}
        setStep={setStep}
        steps={["Step 1: General Information", "Step 2: Dates", "Text 1: PIC"]}
      />
      <div className={classes.content}>
        {!loading &&
          (step === 1 ? (
            <EditSiteStep1
              {...props}
              data={data}
              step={step}
              setStep={setStep}
              step1Data={step1Data}
              step2Data={step2Data}
              setStep1Data={setStep1Data}
              setStep2Data={setStep2Data}
            />
          ) : step === 2 ? (
            <EditSiteStep2
              {...props}
              data={data}
              step={step}
              setStep={setStep}
              step1Data={step1Data}
              step2Data={step2Data}
              setStep1Data={setStep1Data}
              setStep2Data={setStep2Data}
              step2SubmittedData={step2SubmittedData}
              setStep2SubmittedData={setStep2SubmittedData}
            />
          ) : (
            <EditSiteStep3
              {...props}
              data={data}
              step={step}
              setStep={setStep}
              step1Data={step1Data}
              step2Data={step2Data}
              setStep1Data={setStep1Data}
              setStep2Data={setStep2Data}
            />
          ))}
      </div>
    </div>
  );
}

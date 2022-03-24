import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import GLOBALS from "../../../../../globals";
import Actions from "../../../../../redux/actions";

import Loader from "../../../../../components/Loader";
import Stepper from "../../../../../components/Stepper";
import DeliveryRequestStep1 from "./DeliveryRequestStep1";
import DeliveryRequestStep2 from "./DeliveryRequestStep2";
import DeliveryRequestStep3 from "./DeliveryRequestStep3";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function DeliveryRequest(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [step1Data, setStep1Data] = useState("");
  const [step2Data, setStep2Data] = useState("");
  const [step3Data, setStep3Data] = useState("");

  // Step1 Data
  const [companies, setCompanies] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [trades, setTrades] = useState([]);
  const [means, setMeans] = useState([]);
  // Step2 Data
  const [buildings, setBuildings] = useState([]);
  const [storageAreas, setStorageAreas] = useState([]);

  const [deliveryArea, setDeliveryArea] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [deliveryArea]);

  const fetchData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const deliveryAreas = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY_AREA_BY_SITE_ID}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const means = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_MEANS}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const buildings = await GLOBALS.API({
        uri: `${GLOBALS.Constants.BUILDINGS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      const storageAreas = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREAS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      deliveryAreas.data.forEach((val, index) => {
        val.unavailabilityDates?.map((key) => {
          if (key.dayOff === true) {
            if (moment(props.date).isSame(key.date, "day")) {
              deliveryAreas.data[index].isDisable = true;
            }
          }
        });
      });

      storageAreas.data.forEach((val1, index1) => {
        val1.unavailability?.map((key1) => {
          if (key1.dayOff === true) {
            if (moment(props.date).isSame(key1.date, "day")) {
              storageAreas.data[index1].isDisable = true;
            }
          }
        });
      });
      means.data.forEach((val1, index1) => {
        val1.unavailability?.map((key1) => {
          if (key1.dayOff === true) {
            if (moment(props.date).isSame(key1.date, "day")) {
              means.data[index1].isDisable = true;
            }
          }
        });
      });

      setDeliveryAreas(
        deliveryAreas.data.reduce((accumulator, currentValue) => {
          if (
            moment(props.date).isBetween(
              currentValue.availability.start,
              currentValue.availability.end,
              "day",
              "[]",
            )
          ) {
            if (!currentValue.isDisable) {
              accumulator.push({
                value: currentValue._id,
                label: currentValue.name,
                unavailability: currentValue.unavailabilityDates,
              });
            }
          }
          return accumulator;
        }, []),
      );
      setStorageAreas(
        //deliveryArea
        storageAreas.data.reduce((accumulator, currentValue) => {
          currentValue.deliveryArea?.map((key, index) => {
            if (key === deliveryArea) {
              if (
                moment(props.date).isBetween(
                  currentValue.availability.start,
                  currentValue.availability.end,
                  "day",
                  "[]",
                )
              ) {
                if (!currentValue.isDisable) {
                  accumulator.push({
                    value: currentValue._id,
                    label: currentValue.name,
                    level: currentValue.level,
                    companies: currentValue.companies,
                    unavailability: currentValue.unavailability,
                  });
                }
              }
            }
            return;
          });
          return accumulator;
        }, []),
      );
      setMeans(
        means.data.reduce((accumulator, currentValue) => {
          if (
            moment(props.date).isBetween(
              currentValue.availability.start,
              currentValue.availability.end,
              "day",
              "[]",
            )
          ) {
            if (!currentValue.isDisable) {
              // accumulator.push({
              //   value: currentValue._id,
              //   label: currentValue.name,
              //   unavailability: currentValue.unavailability,
              // });
              accumulator.push(currentValue);
            }
          }
          return accumulator;
        }, []),
      );
      setCompanies(
        response.data?.map((company) => ({
          label: company.companyId.name,
          value: company.companyId._id,
        })),
      );
      setTrades(
        adminStore.site.siteId.trades?.map((trade) => ({
          label: trade,
          value: trade,
        })),
      );

      setBuildings(buildings.data.items);
      props.eventId && fetchEvent();
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_DELIVERY}/${props.eventId}`,
        token: store.token,
      });
      setStep1Data({
        company: response.data.companyId._id,
        deliveryArea: response.data.deliveryArea._id,
        date: response.data.date,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
        trades: response.data.trades,
        liftingMeans: response.data.liftingMeans?.map((item) => item._id),
        materials: response.data.materials,
      });
      setStep2Data({
        building: response.data.building,
        level: response.data.level,
        storageArea: response.data.storageArea._id,
        routingMeans: response.data.routingMeans?.map((item) => item._id),
      });
      setStep3Data({
        comment: response.data.comment,
        sendDeliverySummary: response.data.sendDeliverySummary,
      });
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.root}>
      <Stepper
        step={step}
        disabled={true}
        setStep={setStep}
        steps={[
          "Step 1: Delivery Area",
          "Step 2: Storage Area",
          "Text 1: Confirmation",
        ]}
      />
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : step === 1 ? (
          <DeliveryRequestStep1
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            companies={companies}
            deliveryAreas={deliveryAreas}
            editDelivery={props.editDelivery}
            trades={trades}
            means={means}
            eventId={props.eventId}
            deliveryArea={deliveryArea}
            setDeliveryArea={setDeliveryArea}
          />
        ) : step === 2 ? (
          <DeliveryRequestStep2
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            means={means}
            storageAreas={storageAreas}
            buildings={buildings}
            eventId={props.eventId}
          />
        ) : (
          <DeliveryRequestStep3
            {...props}
            step={step}
            setStep={setStep}
            step1Data={step1Data}
            step2Data={step2Data}
            step3Data={step3Data}
            setStep1Data={setStep1Data}
            setStep2Data={setStep2Data}
            companies={companies}
            deliveryAreas={deliveryAreas}
            trades={trades}
            means={means}
            storageAreas={storageAreas}
            buildings={buildings}
            history={props.history}
            onClose={props.onClose}
            eventId={props.eventId}
            event={props.event}
            editDelivery={props.editDelivery}
          />
        )}
      </div>
    </div>
  );
}

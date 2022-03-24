import React, { useState, useEffect } from "react";
import GLOBALS from "../../../globals";
import "./Calender.css";

import { Modal, Button, Alert } from "react-bootstrap";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import PopoverModal from "./components/popoverModal";
import MyWorkWeek from "./components/MyWorkWeek";
import TimePicker from "react-time-picker";
import { addDays } from "date-fns";
import DatePicker from "react-datepicker";
import Form from "../../../components/Form";
import FormSelect from "../../../components/FormSelect";
import "react-datepicker/dist/react-datepicker.css";
import Heading from "../../../components/Heading";
import SubHeading from "../../../components/SubHeading";
import Loader from "../../../components/Loader";
import FullScreenModal from "../../../components/FullScreenModal";
import {
  get_means,
  add_mean,
  update_mean,
  delete_mean,
} from "../../../redux/actions/means";
import Actions from "../../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import DeliveryRequest from "./components/DeliveryRequest";
import { EventToolTips } from "./components/TooltipCustom";
let view = {
  month: true,
  day: true,
  work_week: MyWorkWeek,
  agenda: true,
};

const localizer = momentLocalizer(moment);

let formats = {
  dateFormat: "DD",
  monthHeaderFormat: "DD/MM/YYYY",
  dayHeaderFormat: "DD/MM/YYYY",
  dayRangeHeaderFormat: "DD/MM/YYYY",
  timeGutterFormat: (date, culture, localizer) =>
    localizer.format(date, "HH:mm", culture),
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    localizer.format(start, "HH:mm") + "-" + localizer.format(end, "HH:mm"),
};

const Calender = (props) => {
  moment.locale("es-es", {
    week: {
      dow: 1, //Monday is the first day of the week.
    },
  });

  const dispatch = useDispatch();
  const adminStore = useSelector((state) => state.admin);
  const store = useSelector((state) => state.auth);
  // *****
  const [isLoading, setLoading] = useState(true);
  const [siteMeans, setSiteMeans] = useState("");
  const [alertBoxTime, setAlertBoxTime] = useState(false);
  const [days] = useState([]);
  const [popoverShow, setpopoverShow] = useState(false);
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState("");

  const [show, setShow] = useState(false);
  let [startTime] = useState("");
  let [endTime] = useState("");
  let [starttimeslice, setstarttimeslice] = useState("");
  let [Endtimeslice, setEndtimeslice] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [statusColor, setStatusColor] = useState("#FFFF00");
  const [showEdit, setShowEdit] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  let [startTimeEdit, setStartTimeEdit] = useState("");
  let [endTimeEdit, setEndTimeEdit] = useState("");
  let [starttimesliceEdit, setstarttimesliceEdit] = useState("");
  let [endtimesliceEdit, setEndtimesliceEdit] = useState("");
  const [statusColorEdit, setStatusColorEdit] = useState("");
  const [bookingslot, setbookingslot] = useState(false);
  const [bookingEvent] = useState();
  const [bookingTitle, setBookingTitle] = useState();
  let [bookingstartTime] = useState("");
  let [bookingEndTime] = useState("");
  let [bookingstartTimeslice, setBookingstartTimeslice] = useState("");
  let [bookingendTimeslice, setBookingendTimeslice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [eventID, seteventID] = useState("");
  const [filterDate, setFilterDate] = useState(new Date());

  const [typeOfPlace, setTypeOfPlace] = useState([]);
  const [dropdownCompany, setDropdownCompany] = useState([]);
  const [enterprise, setEnterprise] = useState("");
  const [typeOfPlaning, setTypeOfPlaning] = useState("Deliveries");
  const [status, setStatus] = useState("");
  const [typeOfPlacevalue, setTypeOfPlacevalue] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [deliveriesMeansStatus, setDeliveriesMeansStatus] = useState([
    { value: "PENDING", label: "PENDING" },
    { value: "VALIDATED", label: "VALIDATED" },
    { value: "MODIFIED", label: "MODIFIED" },
    { value: "ALERT", label: "ALERT" },
  ]);
  const [updateMeanStatus, setUpdateMeanStatus] = useState("");
  const [openingHours] = useState(adminStore.site.siteId.openingHours);
  const [overlap] = useState("Enable");
  const [addDelivery, setAddDelivery] = useState(false);
  const [disableHours, setDisableHours] = useState([]);
  const [disableDay, setDisableDay] = useState([]);
  const [deliverDate, setDeliverDate] = useState("");
  const [deliverStartHours, setDeliverStartHours] = useState("");
  const [deliverEndHours, setDeliverEndHours] = useState("");
  const [siteAvailabilityStart] = useState(adminStore.site.siteId.start);
  const [siteAvailabilityEnd] = useState(adminStore.site.siteId.end);
  const [onEditDeliveryData, setOnEditDeliveryData] = useState("");
  const [editDelivery, setEditDelivery] = useState(false);
  useEffect(() => {
    if (props.location.companyId != null) {
      setEnterprise(props.location.companyId);
    }
    if (props.location.selectedShape != null) {
      setTypeOfPlacevalue(props.location.selectedShape.type);
      if (props.location.selectedShape.type === "DELIVERYAREA") {
        getDeliveryAreaSiteBySiteId();
      } else if (props.location.selectedShape.type === "STORAGEAREA") {
        getStorageSiteBysiteId();
      } else if (props.location.selectedShape.type === "BUILDING") {
        getbuildingBysiteId();
      }
    }
    if (props.location.selectedShape != null) {
      setPlaceId(props.location.selectedShape._id);
    }
    getfilterdata();
    unavailabilityDates();
    functionDisableDay();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    filterBookingCalendar();
    // eslint-disable-next-line
  }, [
    enterprise,
    typeOfPlaning,
    status,
    typeOfPlacevalue,
    placeId,
    siteMeans,
    updateMeanStatus,
    addDelivery,
    popoverShow,
  ]);

  // !!!!!!
  const handleClose = () => setShow(false);
  let work_week_obj = {
    Sunday: true,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
  };
  for (let i = 0; i < days.length; i++) {
    if (days[i] === 0) {
      work_week_obj.Sunday = false;
    } else if (days[i] === 1) {
      work_week_obj.Monday = false;
    } else if (days[i] === 2) {
      work_week_obj.Tuesday = false;
    } else if (days[i] === 3) {
      work_week_obj.Wednesday = false;
    } else if (days[i] === 4) {
      work_week_obj.Thursday = false;
    } else if (days[i] === 5) {
      work_week_obj.Friday = false;
    } else if (days[i] === 6) {
      work_week_obj.Saturday = false;
    }
  }

  const updateEvent = () => {
    if (titleEdit !== "") {
      /* start time*/
      startTimeEdit = String(startTimeEdit);
      starttimesliceEdit = String(starttimesliceEdit);
      startTimeEdit = Array.from(startTimeEdit);
      starttimesliceEdit = Array.from(starttimesliceEdit);
      startTimeEdit[16] = starttimesliceEdit[0];
      startTimeEdit[17] = starttimesliceEdit[1];
      startTimeEdit[18] = starttimesliceEdit[2];
      startTimeEdit[19] = starttimesliceEdit[3];
      startTimeEdit[20] = starttimesliceEdit[4];
      startTimeEdit = String(startTimeEdit);
      startTimeEdit = startTimeEdit.replace(/,/g, "");
      startTimeEdit = new Date(startTimeEdit);
      /* start time*/
      /* End time*/
      endTimeEdit = String(endTimeEdit);
      endtimesliceEdit = String(endtimesliceEdit);
      endTimeEdit = Array.from(endTimeEdit);
      endtimesliceEdit = Array.from(endtimesliceEdit);
      endTimeEdit[16] = endtimesliceEdit[0];
      endTimeEdit[17] = endtimesliceEdit[1];
      endTimeEdit[18] = endtimesliceEdit[2];
      endTimeEdit[19] = endtimesliceEdit[3];
      endTimeEdit[20] = endtimesliceEdit[4];
      endTimeEdit = String(endTimeEdit);
      endTimeEdit = endTimeEdit.replace(/,/g, "");
      endTimeEdit = new Date(endTimeEdit);
      /* End time*/
      let preDateTime = new Date();
      let milliseconds = Date.parse(preDateTime);
      milliseconds = milliseconds - 1 * 60 * 1000;
      preDateTime = new Date(milliseconds);
      if (startTimeEdit > preDateTime && startTimeEdit < endTimeEdit) {
        const updateElement = events.filter((e) => e._id === eventID);
        updateElement[0].title = titleEdit;
        updateElement[0].start = startTimeEdit;
        updateElement[0].end = endTimeEdit;
        updateElement[0].color = statusColorEdit;
        setEvents([...events, updateElement]);

        var DbElement = {
          bookingReason: updateElement[0].title,
          startDate: updateElement[0].start,
          endDate: updateElement[0].end,
        };
        dispatch(update_mean(DbElement, eventID));
        dispatch(get_means());

        setTitleEdit("");
        setShowEdit(false);
      } else {
        setAlertBoxTime(true);
        setTimeout(function () {
          setAlertBoxTime(false);
        }, 2000);
      }
    } else {
      setAlertBoxTime(true);
      setTimeout(function () {
        setAlertBoxTime(false);
      }, 2000);
    }
  };
  const saveEvent = () => {
    if (title !== "") {
      /* start time*/
      startTime = String(startTime);
      starttimeslice = String(starttimeslice);
      startTime = Array.from(startTime);
      starttimeslice = Array.from(starttimeslice);
      startTime[16] = starttimeslice[0];
      startTime[17] = starttimeslice[1];
      startTime[18] = starttimeslice[2];
      startTime[19] = starttimeslice[3];
      startTime[20] = starttimeslice[4];
      startTime = String(startTime);
      startTime = startTime.replace(/,/g, "");
      startTime = new Date(startTime);

      /* start time*/
      /* End time*/
      endTime = String(endTime);
      Endtimeslice = String(Endtimeslice);
      endTime = Array.from(endTime);
      Endtimeslice = Array.from(Endtimeslice);
      endTime[16] = Endtimeslice[0];
      endTime[17] = Endtimeslice[1];
      endTime[18] = Endtimeslice[2];
      endTime[19] = Endtimeslice[3];
      endTime[20] = Endtimeslice[4];
      endTime = String(endTime);
      endTime = endTime.replace(/,/g, "");
      endTime = new Date(endTime);
      /* End time*/
      let beforeTime = moment(startTime).format("DD/MM/YYYY HH:mm");
      let afterTime = moment(endTime).format("DD/MM/YYYY HH:mm");
      let dateCheck1 = events.find((item) => {
        return (
          moment(item.start).format("DD/MM/YYYY HH:mm") === beforeTime ||
          moment(item.end).format("DD/MM/YYYY HH:mm") === afterTime
        );
      });

      let dateCheck2 = events.findIndex((item) => {
        return startTime > item.start;
      });
      let dateCheck3 = events.findIndex((item) => {
        return startTime > item.end;
      });
      /*check not in previous day  Start */
      let preDateTime = new Date();
      let milliseconds = Date.parse(preDateTime);
      milliseconds = milliseconds - 1 * 60 * 1000;
      preDateTime = new Date(milliseconds);
      /*check not in previous day End  */

      if (startTime > preDateTime && startTime < endTime) {
        if (overlap === "Enable") {
          setShow(false);
          var stateElement = {
            title: title,
            start: startTime,
            end: endTime,
            color: statusColor,
          };

          var DbElement = {
            bookingReason: title,
            startDate: startTime,
            endDate: endTime,
          };
          // setEvents([...events, stateElement]);
          dispatch(add_mean(DbElement));
          dispatch(get_means());
          setTitle("");
        } else if (
          overlap === "Disable" &&
          dateCheck2 !== -1 &&
          dateCheck3 !== -1 &&
          dateCheck1 !== undefined
        ) {
          setAlertBoxTime(true);
          setTimeout(function () {
            setAlertBoxTime(false);
          }, 1000);
        } else {
          setShow(false);

          setEvents([...events, stateElement]);
          dispatch(add_mean(DbElement));
          setTitle("");
        }
      } else {
        setAlertBoxTime(true);
        setTimeout(function () {
          setAlertBoxTime(false);
        }, 1000);
      }
    } else {
      setAlertBoxTime(true);
      setTimeout(function () {
        setAlertBoxTime(false);
      }, 1000);
    }
  };

  const AddDeliveryRequest = ({ start, end }) => {
    setAddDelivery(false);
    setDeliverStartHours(start.getHours());
    setDeliverEndHours(end.getHours());
    // start.setHours(0);
    setDeliverDate(start);
    let flagDate = false;
    let flagOpeningHoursDay = false;
    let flagHours = false;
    let flagOpeningHours = false;
    let disableDayFlag = false;
    let pastdayFlag = false;
    let betweenDay = false;
    let preDateTime = new Date();
    let milliseconds = Date.parse(preDateTime);
    milliseconds = milliseconds - 1 * 60 * 1000;
    preDateTime = new Date(milliseconds);
    if (start < preDateTime && start < end) {
      pastdayFlag = true;
    }
    if (
      !moment(start).isBetween(
        moment(adminStore.site.siteId.start).set({ hours: 0 }),
        moment(adminStore.site.siteId.end),
        null,
        "()",
        "days",
      )
    ) {
      betweenDay = true;
    }

    disableHours.map((key, index) => {
      if (moment(start).isSame(key) || moment(end).isSame(key)) {
        flagHours = true;
      }
      return {};
    });
    disableDay.map((key, index) => {
      if (moment(start).isSame(key) || moment(end).isSame(key)) {
        disableDayFlag = true;
      }
      return {};
    });

    let currentDay = moment(start).day();
    if (currentDay === 0) {
      // disorder of days of Opening Hours component
      currentDay = 7;
    }
    adminStore.site.siteId.unavailabilityDates.map((key, index) => {
      if (key.dayOff === true) {
        if (moment(start).isSame(key.date, "day")) {
          flagDate = true;
        }
      }
      return {};
    });
    openingHours.map((key, index) => {
      if (key.dayOff === true && currentDay === key.day) {
        flagOpeningHoursDay = true;
      }
      return true;
    });

    openingHours.map((key, index) => {
      if (key.dayOff === true && currentDay === key.day) {
        flagOpeningHours = true;
      } else if (key.dayOff === false && currentDay === key.day) {
        if (
          inRange(start.getHours(), key.startHour, key.endHour) &&
          inRange(end.getHours(), key.startHour, key.endHour)
        ) {
        } else {
          flagOpeningHours = true;
        }
      }
      return true;
    });
    if (
      flagDate ||
      flagOpeningHoursDay ||
      flagOpeningHours ||
      disableDayFlag ||
      pastdayFlag ||
      flagHours ||
      betweenDay
    ) {
      if (flagDate || disableDayFlag || betweenDay) {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Disable Day", "error"),
          ),
        );
      } else if (flagOpeningHoursDay || flagOpeningHours || flagHours) {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Disable hours", "error"),
          ),
        );
      } else if (betweenDay) {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Site Date is Out of Range", "error"),
          ),
        );
      } else if (pastdayFlag) {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(
              "Booking can't be in Previous day",
              "error",
            ),
          ),
        );
      }
    } else {
      setAddDelivery(true);
    }
  };
  // const AddEvent = ({ start, end, slots }) => {
  //   setAlertBoxTime(false);
  //   let preDateTime = new Date();
  //   let milliseconds = Date.parse(preDateTime);
  //   milliseconds = milliseconds - 1 * 60 * 1000;
  //   preDateTime = new Date(milliseconds);

  //   if (
  //     start.getDay() === days[0] ||
  //     start.getDay() === days[1] ||
  //     start.getDay() === days[2] ||
  //     start.getDay() === days[3] ||
  //     start.getDay() === days[4] ||
  //     start.getDay() === days[5] ||
  //     start.getDay() === days[6]
  //   ) {
  //     console.log("not active day");
  //   } else {
  //     // active days
  //     let beforeTime = moment(start).format("HH:mm");
  //     let afterTime = moment(end).format("HH:mm");
  //     let dateCheck = events.filter((item) => {
  //       return (
  //         moment(item.start).format("DD/MM/YYYY HH:mm") === beforeTime &&
  //         moment(item.end).format("DD/MM/YYYY HH:mm") === afterTime
  //       );
  //     });
  //     if (dateCheck.length === 0 && overlap) {
  //       if (start > preDateTime && start < end) {
  //         if (slots.length >= 2) {
  //           var format = "HH:mm";
  //           let time = moment(start, format);
  //           let beforeTime = moment(start).format("HH:mm");
  //           let afterTime = moment(end).format("HH:mm");
  //           let checkDiff = time.isBetween(beforeTime, afterTime);
  //           if (
  //             beforeTime !== "17:00" &&
  //             beforeTime !== "17:30" &&
  //             checkDiff === false
  //           ) {
  //             setShow(!show);
  //             setStartTime(start);
  //             setEndTime(end);
  //             let getstart = String(start);
  //             let getend = String(end);
  //             getstart = getstart.slice(16, 21);
  //             getend = getend.slice(16, 21);
  //             setstarttimeslice(getstart);
  //             setEndtimeslice(getend);
  //           } else {
  //             return false;
  //           }
  //         } else {
  //           setShow(!show);
  //           setStartTime(start);
  //           setEndTime(end);
  //           let getstart = String(start);
  //           let getend = String(end);
  //           getstart = getstart.slice(16, 21);
  //           getend = getend.slice(16, 21);
  //           setstarttimeslice(getstart);
  //           setEndtimeslice(getend);
  //         }
  //       } else {
  //         setAlertBoxTime(true);
  //         setTimeout(function () {
  //           setAlertBoxTime(false);
  //         }, 2000);
  //       }
  //     } else {
  //       console.log("disable time clicked");
  //     }
  //   }
  // };
  const statusColorChange = (event) => {
    setValue(event.target.value);
  };
  const handlePopoverClose = () => {
    seteventID("");
    setEvent("");
    setEditDelivery(false);
    setpopoverShow(false);
  };
  const handleEditEvent = () => {
    setpopoverShow(!popoverShow);
    setShowEdit(true);
    setAlertBoxTime(false);
    const fill = events.filter((e) => e._id === eventID);

    setTitleEdit(fill[0].title);
    let getstart = String(fill[0].start);
    let getend = String(fill[0].end);
    setStartTimeEdit(getstart);
    setEndTimeEdit(getend);
    setStatusColorEdit(fill[0].color);
    // Start slice a time
    getstart = getstart.slice(16, 21);
    getend = getend.slice(16, 21);
    setstarttimesliceEdit(getstart);
    setEndtimesliceEdit(getend);
  };
  const handleDeleteEvent = (confirm) => {
    if (confirm === "yes") {
      setAlertBoxTime(true);
      setpopoverShow(!popoverShow);
      // const fill = events.filter((e) => e.id !== eventID);
      //  setEvents(fill);
      dispatch(delete_mean(eventID));
    } else if (confirm === "no") {
      setAlertBoxTime(false);
    } else {
      setAlertBoxTime(true);
      setpopoverShow(popoverShow);
    }
  };
  const handleDeleteDelivery = (confirm) => {
    if (confirm === "yes") {
      setAlertBoxTime(true);
      setpopoverShow(!popoverShow);
      const fill = events.filter((e) => e.id !== eventID);
      setEvents(fill);
      delete_Delivery(eventID);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar("Delivery Deleted", "success"),
        ),
      );
      setSiteMeans("");
    } else if (confirm === "no") {
      setAlertBoxTime(false);
    } else {
      setAlertBoxTime(true);
      setpopoverShow(popoverShow);
    }
  };
  const handleValidateMeans = () => {
    setpopoverShow(!popoverShow);
    const fill = events.filter((e) => e.id !== eventID);
    setEvents(fill);
    update_mean_status(eventID);
  };
  const handleValidateDelivery = () => {
    setpopoverShow(!popoverShow);
    const fill = events.filter((e) => e.id !== eventID);
    setEvents(fill);
    update_delivery_status(eventID);
  };

  const handlePopoverShow = (event) => {
    // console.log("handlepopup show", event.id);
    setAlertBoxTime(false);
    seteventID(event.id);
    const fill = events.filter((e) => e.id === event.id);
    setEvent(fill[0]);
    setpopoverShow(!popoverShow);
    // admin code end
  };
  // const bookingSlot = (event) => {
  //   // booking Event
  //   setbookingslot(true);
  //   const fill = events.filter((e) => e.id === event.id);
  //   setbookingEvent(fill[0]);
  //   setBookingstartTime(fill[0].start);
  //   setBookingEndTime(fill[0].end);

  //   /* show time start */
  //   let getstart = String(fill[0].start);
  //   let getend = String(fill[0].end);
  //   getstart = getstart.slice(16, 21);
  //   getend = getend.slice(16, 21);

  //   setBookingstartTimeslice(getstart);
  //   setBookingendTimeslice(getend);
  //   /* show time End  */
  // };
  const saveBooking = () => {
    /* start time*/
    bookingstartTime = String(bookingstartTime);
    bookingstartTimeslice = String(bookingstartTimeslice);
    bookingstartTime = Array.from(bookingstartTime);
    bookingstartTimeslice = Array.from(bookingstartTimeslice);
    bookingstartTime[16] = bookingstartTimeslice[0];
    bookingstartTime[17] = bookingstartTimeslice[1];
    bookingstartTime[18] = bookingstartTimeslice[2];
    bookingstartTime[19] = bookingstartTimeslice[3];
    bookingstartTime[20] = bookingstartTimeslice[4];
    bookingstartTime = String(bookingstartTime);
    bookingstartTime = bookingstartTime.replace(/,/g, "");
    bookingstartTime = new Date(bookingstartTime);
    /* start time*/
    /* End  time*/
    bookingEndTime = String(bookingEndTime);
    bookingendTimeslice = String(bookingendTimeslice);
    bookingEndTime = Array.from(bookingEndTime);
    bookingendTimeslice = Array.from(bookingendTimeslice);
    bookingEndTime[16] = bookingendTimeslice[0];
    bookingEndTime[17] = bookingendTimeslice[1];
    bookingEndTime[18] = bookingendTimeslice[2];
    bookingEndTime[19] = bookingendTimeslice[3];
    bookingEndTime[20] = bookingendTimeslice[4];
    bookingEndTime = String(bookingEndTime);
    bookingEndTime = bookingEndTime.replace(/,/g, "");
    bookingEndTime = new Date(bookingEndTime);

    if (
      bookingEvent.start <= bookingstartTime &&
      bookingEvent.end >= bookingEndTime
    ) {
      // console.log("Add time in array ");
    } else {
      setAlertBoxTime(true);
      setTimeout(function () {
        setAlertBoxTime(false);
      }, 1000);
    }
  };
  const update_mean_status = async (id) => {
    try {
      const response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.UPDATE_MEAN_STATUS}/${id}`,
        token: store.token,
      });
      if (response.success) {
        setUpdateMeanStatus(response._id);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const update_delivery_status = async (id) => {
    try {
      // 1invoice on validate DR
      console.log("validate delivery", event);
      if (event.liftingMeans.length >= 1) {
        let startHour = moment(event.start).format("H");
        let endHour = moment(event.end).format("H");
        event.liftingMeans.map(async (m) => {
          var formdata1 = new FormData();
          formdata1.append("name", m?.name);
          formdata1.append("date", moment(event.start).format("YYYY-MM-DD"));
          formdata1.append("time", event.start);
          formdata1.append("type", "MEAN");
          // props.location.mean?.meanType
          formdata1.append("isBillable", true);
          formdata1.append("price", m?.pricePerHour * (endHour - startHour));
          formdata1.append("isPaid", false);
          formdata1.append("companyId", event.company?._id);
          formdata1.append("siteId", adminStore.site.siteId._id);

          // for (let [key, value] of formdata1) {
          //   console.log(
          //     `formdata1 in meanbook delivery invoice ${key}: ${value}`,
          //   );
          // }
          await GLOBALS.API({
            method: "POST",
            uri: GLOBALS.Constants.POST_ADD_SITE_INCIDENTS,
            headers: {
              Authorization: store.token,
            },
            body: formdata1,
          });
        });
      }
      const response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.updateDeliveryStatus}/${id}`,
        token: store.token,
      });

      if (response.success) {
        setUpdateMeanStatus(response._id);
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const delete_Delivery = async (id) => {
    try {
      await GLOBALS.API({
        method: "DELETE",
        token: store.token,
        uri: GLOBALS.Constants.delete_Delivery + "/" + id,
      });
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const getfilterdata = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_LIST_OF_MEANS}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data.site_companies !== null) {
          const temp = [];
          response.data.site_companies.map((item, index) => {
            return temp.push({
              label: item.companyId.name,
              value: item.companyId._id,
            });
          });
          setDropdownCompany(temp);
        }
      } else {
      }

      //   setItems(response.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  function handleChangeTypeOfPlace(e) {
    setTypeOfPlacevalue(e.target.value);
    if (e.target.value === "DELIVERYAREA") {
      getDeliveryAreaSiteBySiteId();
    } else if (e.target.value === "STORAGEAREA") {
      getStorageSiteBysiteId();
    } else if (e.target.value === "BUILDING") {
      getbuildingBysiteId();
    } else {
      setTypeOfPlace([]);
    }
  }
  const getbuildingBysiteId = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.getBuildingsBySiteId}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data !== null) {
          const temp = [];
          response.data.map((item, index) => {
            return temp.push({
              label: item.name,
              value: item._id,
            });
          });

          setTypeOfPlace(temp);
        }
      } else {
      }

      //   setItems(response.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const getStorageSiteBysiteId = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_STORAGE_AREAS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data !== null) {
          const temp = [];

          response.data.map((item, index) => {
            return temp.push({
              label: item.name,
              value: item._id,
            });
          });
          setTypeOfPlace(temp);
        }
      } else {
      }

      //   setItems(response.data.items);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const getDeliveryAreaSiteBySiteId = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.getDeliveryAreaSiteBySiteId}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      if (response.success) {
        if (response.data !== null) {
          const temp = [];

          response.data.map((item, index) => {
            return temp.push({
              label: item.name,
              value: item._id,
            });
          });

          setTypeOfPlace(temp);
        }
      } else {
        dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar("Delivery Area Site By SiteId Error"),
          ),
        );
      }
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  function Alertbox(props) {
    return (
      <Alert
        show={alertBoxTime}
        variant="danger"
        onClose={() => setAlertBoxTime(!alertBoxTime)}
        dismissible
      >
        {props.message}
      </Alert>
    );
  }
  const functionDisableDay = () => {
    let tempDisableDay = [];
    adminStore.site.siteId.unavailabilityDates.map((key, index) => {
      if (key.dayOff === true) {
        for (let i = 0; i <= 23; i++) {
          let date = new Date(key.date);
          date.setHours(i);
          tempDisableDay.push(date);
        }
      }
      return {};
    });
    setDisableDay(tempDisableDay);
  };
  const customDayPropGetter = (date) => {
    let flagDate = false;
    let flagOpeningHoursDay = false;
    let betweenDate = false;
    let currentDay = moment(date).day();
    if (currentDay === 0) {
      // disorder of days of Opening Hours component
      currentDay = 7;
    }
    adminStore.site.siteId.unavailabilityDates.map((key) => {
      if (key.dayOff === true) {
        if (moment(date).isSame(key.date, "day")) {
          flagDate = true;
        }
      }
      return {};
    });
    openingHours.map((key) => {
      if (key.dayOff === true && currentDay === key.day) {
        flagOpeningHoursDay = true;
      }
      return true;
    });
    if (
      !moment(date).isBetween(
        moment(siteAvailabilityStart),
        moment(siteAvailabilityEnd).add(1, "day"),
        null,
        "[]",
        "day",
      )
    ) {
      betweenDate = true;
    }
    if (flagDate || flagOpeningHoursDay || betweenDate) {
      return {
        className: "special-day",
        style: {
          backgroundColor: "#EBEBE4",
        },
      };
    }
  };
  const filterBookingCalendar = async () => {
    let count = 0;
    let tempEvent;
    try {
      const response = await GLOBALS.API({
        method: "POST",
        token: store.token,
        uri: `${GLOBALS.Constants.filterBookingCalendar}`,
        body: JSON.stringify({
          siteId: adminStore.site.siteId._id,
          companyId: enterprise,
          typeOfPlaning: typeOfPlaning,
          status: status,
          typeOfPlace: typeOfPlacevalue,
          placeId: placeId,
        }),
      });
      if (response.success) {
        if (typeOfPlaning === "Deliveries") {
          let background = "";
          let fontColor = "";

          tempEvent = response.data.Deliveries.map((key, index) => {
            if (!(key.startTime && key.endTime)) {
              return {};
            }
            if (key.status === "PENDING") {
              if (key.alert === true && status === "ALERT") {
                fontColor = "red";
                background = "yellow";
              } else {
                background = "yellow";
              }
            } else if (key.status === "VALIDATED") {
              if (key.alert === true && status === "ALERT") {
                fontColor = "red";
                background = "green";
              } else {
                background = "green";
              }
            } else if (key.status === "MODIFIED") {
              if (key.alert === true && status === "ALERT") {
                fontColor = "red";
                background = "orange";
              } else {
                background = "orange";
              }
            }

            /* start time converstion */
            let start = new Date(key.date);
            let startHours = key.startTime.slice(0, 2);
            let startmint = key.startTime.slice(3, 5);
            start.setHours(startHours);
            start.setMinutes(startmint);
            /* start time converstion */

            /* End time converstion */
            let end = new Date(key.date);
            let endHours = key.endTime.slice(0, 2);
            let endmint = key.endTime.slice(3, 5);
            end.setHours(endHours);
            end.setMinutes(endmint);
            /* End time converstion */

            count++;
            return {
              objectName: "Deliveries",
              id: key._id,
              title: key.comment,
              start: start,
              end: end,
              background: background,
              fontColor: fontColor,
              liftingMeans: key.liftingMeans,
              routingMeans: key.routingMeans,
              company: key.companyId,
              materials: key.materials,
              deliveryArea: key.deliveryArea,
              storageArea: key.storageArea,
              building: key.building,
              status: key.status,
              user: key.userId,
            };
          });
          setSiteMeans(`DELIVERY REQUESTS : ${count} DELIVERIES`);
        } else if (typeOfPlaning === "Means") {
          tempEvent = response.data.Means.map((key, index) => {
            let background = "";
            let fontColor = "white";

            if (key.status === "VALIDATED") {
              background = "green";
            } else {
              background = "";
            }
            let start = new Date(key.startDate);
            let end = new Date(key.endDate);
            count++;
            return {
              objectName: "Means",
              id: key._id,
              title: key.bookingReason,
              start: start,
              end: end,
              companyName: key.companyId.name,
              meanName: key.meanId.name,
              status: key.status,
              background: background,
              fontColor: fontColor,
              user: key.userId,
            };
          });
          setSiteMeans(`TOTAL MEANS Booking : ${count}`);
        }
        setEvents(tempEvent);
      }
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }
  const slotPropGetter = (date) => {
    let flagDateAndTime = false;
    let flagOpeningHours = false;
    let currentDay = moment(date).day();
    if (currentDay === 0) {
      // disorder of days of Opening Hours component
      currentDay = 7;
    }
    let newStyle = {
      backgroundColor: "#EBEBE4",
    };
    openingHours.map((key, index) => {
      if (key.dayOff === true && currentDay === key.day) {
        flagOpeningHours = true;
      } else if (key.dayOff === false && currentDay === key.day) {
        if (inRange(date.getHours(), key.startHour, key.endHour)) {
        } else {
          flagOpeningHours = true;
        }
      }
      return true;
    });
    disableHours.map((key, index) => {
      if (moment(date).isSame(key)) {
        flagDateAndTime = true;
      }
      return {};
    });

    if (flagDateAndTime || flagOpeningHours) {
      return {
        className: "rbc-day-slot rbc-time-slot",
        style: newStyle,
      };
    }
  };
  //setDisableHours
  const unavailabilityDates = () => {
    let tempDisabledTime = [];
    adminStore.site.siteId.unavailabilityDates.map((key, index) => {
      if (key.dayOff === false) {
        for (let i = key.startHour; i <= key.endHour; i++) {
          let date = new Date(key.date);
          date.setHours(i);
          tempDisabledTime.push(date);
        }
      }
      return {};
    });
    setDisableHours(tempDisabledTime);
  };

  return (
    <>
      <FullScreenModal
        open={addDelivery}
        title={editDelivery ? "Edit Delivery Request" : "Delivery Request"}
        onClose={() => {
          setAddDelivery(false);
          setEditDelivery(false);
          seteventID("");
        }}
        body={
          <DeliveryRequest
            date={deliverDate || onEditDeliveryData?.start}
            end={deliverEndHours}
            history={props.history}
            start={deliverStartHours}
            eventId={eventID}
            event={event}
            editDelivery={editDelivery}
            onClose={() => {
              setAddDelivery(false);
              seteventID("");
              setEditDelivery(false);
            }}
          />
        }
      />
      <Modal show={bookingslot} onHide={() => setbookingslot(false)} centered>
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title className="text-center w-100">BOOKING</Modal.Title>
        </Modal.Header>
        <Alertbox message="Invalid Time" />
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <input
                type="text"
                style={{ border: "1px solid #707070" }}
                placeholder="Company : ConstructBTP"
                className="w-100 p-2 mb-2"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="starttime">
                <label>Start time</label>
                <TimePicker
                  value={bookingstartTimeslice}
                  onChange={(e) => setBookingstartTimeslice(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="endTime">
                <label>End Time</label>
                <TimePicker
                  value={bookingendTimeslice}
                  onChange={(e) => setBookingendTimeslice(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
          </div>
          <div className="row pt-3">
            <div className="col-md-12">
              <div className="description">
                <div className="form-group ">
                  {/* <label for="exampleFormControlTextarea1">Add message</label> */}
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    placeholder="Reason of booking"
                    rows="3"
                    value={bookingTitle}
                    onChange={(e) => setBookingTitle(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button
            className="w-100 py-2"
            onClick={saveBooking}
            style={{
              color: "#fff",
              backgroundColor: "#DBB20A",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Book
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking</Modal.Title>
        </Modal.Header>
        <Alertbox message="Please Add valid Time and Event" />
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-4">
              <div>
                <DatePicker
                  showPopperArrow={true}
                  dateFormat="dd-MMMM-yyyy"
                  selected={startDate}
                  popperPlacement="top-start"
                  showYearDropdown
                  minDate={addDays(new Date(), 1)}
                  placeholderText="Booking Date"
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                  className="modal-datepicker"
                />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <FormSelect
                placeholder="ConstructBTP"
                values={[
                  { value: "INCIDENT", label: "Incident" },
                  { value: "MEAN", label: "Mean" },
                  { value: "DELAY", label: "Delay" },
                  { value: "UNEXPRECTED", label: "Unexp" },
                ]}
                style={{ marginRight: "20px" }}
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="starttime">
                <label>Start hour</label>
                <TimePicker
                  value={starttimeslice}
                  onChange={(e) => setstarttimeslice(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="endTime">
                <label>End hour</label>
                <TimePicker
                  value={Endtimeslice}
                  onChange={(e) => setEndtimeslice(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="description">
                <div class="form-group">
                  <textarea
                    placeholder="Reason of booking"
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    onChange={(e) => setTitle(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div class="form-group statusColor">
                <label>Status Color </label>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="gender"
                    name="statusColor"
                    value={statusColor}
                    onChange={statusColorChange}
                  >
                    <FormControlLabel
                      value="#FFFF00"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColor(e.target.value)}
                        />
                      }
                      label="Pending validation"
                      className="pending"
                    />
                    <FormControlLabel
                      value="#808080"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColor(e.target.value)}
                        />
                      }
                      label="Not availble"
                      className="notAvailble"
                    />
                    <FormControlLabel
                      value="#008000"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColor(e.target.value)}
                        />
                      }
                      label="Validate"
                      className="validate"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        </Modal.Body>
        {isLoading && ""}
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#DBB20A", padding: "5px 20px" }}
            onClick={saveEvent}
          >
            Book
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event </Modal.Title>
        </Modal.Header>
        <Alertbox message="Please Add valid Time and Event" />
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="description">
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">Edit Event</label>
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    value={titleEdit}
                    onChange={(e) => setTitleEdit(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="starttime">
                <label>Start time</label>
                <TimePicker
                  value={starttimesliceEdit}
                  onChange={(e) => setstarttimesliceEdit(e)}
                  locale="sv-sv"
                />
              </div>
              <div class="form-group statusColor">
                {value && ""}
                <label>Status Color </label>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="statusColor"
                    name="statusColor"
                    value={statusColorEdit}
                    onChange={statusColorChange}
                  >
                    <FormControlLabel
                      value="#FFFF00"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColorEdit(e.target.value)}
                        />
                      }
                      label="Pending validation"
                      className="pending"
                    />
                    <FormControlLabel
                      value="#808080"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColorEdit(e.target.value)}
                        />
                      }
                      label="Not availble"
                      className="notAvailble"
                    />
                    <FormControlLabel
                      value="#008000"
                      control={
                        <Radio
                          color="primary"
                          onChange={(e) => setStatusColorEdit(e.target.value)}
                        />
                      }
                      label="Validate"
                      className="validate"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="col-md-6">
              <div className="endTime">
                <label>End Time</label>
                <TimePicker
                  value={endtimesliceEdit}
                  onChange={(e) => setEndtimesliceEdit(e)}
                  locale="sv-sv"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={updateEvent}>
            Update Event
          </Button>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="pt-5">
        <PopoverModal
          popoverShow={popoverShow}
          handlePopoverClose={handlePopoverClose}
          handleDeleteEvent={handleDeleteEvent}
          handleEditEvent={handleEditEvent}
          handleValidateMeans={handleValidateMeans}
          event={event}
          setEvent={setEvent}
          setEditDelivery={setEditDelivery}
          setAlertBoxTime={setAlertBoxTime}
          alertBoxTime={alertBoxTime}
          handleValidateDelivery={handleValidateDelivery}
          handleDeleteDelivery={handleDeleteDelivery}
          onEditDelivery={(data) => {
            setOnEditDeliveryData(data);
            // setEditDelivery(true);
            setpopoverShow(false);
            setAddDelivery(true);
          }}
        />
        <div style={{ flexBasis: "100%" }}>
          <div className="px-2">
            <Form.Row alignItems="center">
              <Form.Row noMargin>
                <Heading primary="PLANNING" noWrap />
                <SubHeading
                  noMargin
                  topPadding
                  style={{ color: "#F80303", paddingRight: "3rem" }}
                  primary={siteMeans}
                  bold
                />
              </Form.Row>
            </Form.Row>
            <Form.Row alignItems="center" noMargin>
              <Form.Row justifyContent="flex-start" noMargin>
                <div style={{ marginRight: "20px", width: 250 }}>
                  <DatePicker
                    showPopperArrow={true}
                    dateFormat="dd-MM-yyyy"
                    selected={filterDate}
                    popperPlacement="top-start"
                    showYearDropdown
                    placeholderText="Delivery date"
                    onChange={(filterDate) => {
                      setFilterDate(filterDate);
                    }}
                  />
                </div>
                {props.location.companyId != null ? (
                  <>
                    <FormSelect
                      placeholder="Enterprise"
                      value={enterprise}
                      values={dropdownCompany}
                      style={{ marginRight: "20px", maxWidth: 250 }}
                      onChange={(e) => setEnterprise(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <FormSelect
                      placeholder="Enterprise"
                      value={enterprise}
                      values={dropdownCompany}
                      style={{ marginRight: "20px", maxWidth: 250 }}
                      onChange={(e) => setEnterprise(e.target.value)}
                    />
                  </>
                )}

                <FormSelect
                  value={typeOfPlaning}
                  values={[
                    { value: "Deliveries", label: "Deliveries" },
                    { value: "Means", label: "Means" },
                  ]}
                  onChange={(e) => {
                    setTypeOfPlaning(e.target.value);
                    if (e.target.value === "Deliveries") {
                      setDeliveriesMeansStatus([
                        { value: "PENDING", label: "PENDING" },
                        { value: "VALIDATED", label: "VALIDATED" },
                        { value: "MODIFIED", label: "MODIFIED" },
                        { value: "ALERT", label: "ALERT" },
                      ]);
                    } else if (e.target.value === "Means") {
                      setDeliveriesMeansStatus([
                        { value: "AVAILABLE", label: "AVAILABLE" },
                        { value: "UNAVAILABLE", label: "UNAVAILABLE" },
                      ]);
                    }
                  }}
                  style={{ marginRight: "20px", maxWidth: 250 }}
                />
                <FormSelect
                  placeholder="Status"
                  value={status}
                  values={deliveriesMeansStatus}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ marginRight: "5px", maxWidth: 250 }}
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <Form.Row justifyContent="flex-start" noMargin>
                {props.location.selectedShape != null ? (
                  <>
                    <FormSelect
                      placeholder="Type of place"
                      value={typeOfPlacevalue}
                      values={[
                        { value: "DELIVERYAREA", label: "Delivery area" },
                        { value: "STORAGEAREA", label: "Storage area" },
                        { value: "BUILDING", label: "Emplacement" },
                      ]}
                      style={{ marginRight: "20px", maxWidth: 250 }}
                      onChange={handleChangeTypeOfPlace}
                    />

                    <FormSelect
                      placeholder="place"
                      value={placeId}
                      values={typeOfPlace}
                      style={{ marginRight: "20px", maxWidth: 250 }}
                      onChange={(e) => setPlaceId(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <FormSelect
                      placeholder="Type of place"
                      value={typeOfPlacevalue}
                      values={[
                        { value: "DELIVERYAREA", label: "Delivery area" },
                        { value: "STORAGEAREA", label: "Storage area" },
                        { value: "BUILDING", label: "Emplacement" },
                      ]}
                      style={{ marginRight: "20px", maxWidth: 250 }}
                      onChange={handleChangeTypeOfPlace}
                    />

                    <FormSelect
                      placeholder="place"
                      value={placeId}
                      values={typeOfPlace}
                      style={{ marginRight: "20px", maxWidth: 250 }}
                      onChange={(e) => setPlaceId(e.target.value)}
                    />
                  </>
                )}
              </Form.Row>
            </Form.Row>
          </div>
          {events ? (
            <Calendar
              tooltipAccessor={null}
              components={{ event: EventToolTips }}
              slotPropGetter={slotPropGetter}
              popup
              selectable
              formats={formats}
              localizer={localizer}
              events={events}
              views={view}
              defaultView="work_week"
              step={60}
              timeslots={1}
              onSelectEvent={handlePopoverShow}
              // onSelectEvent={bookingSlot}
              onSelecting={true}
              // onSelectSlot={AddEvent}
              onSelectSlot={AddDeliveryRequest}
              // onSelectSlot={AddAvailability}
              startAccessor="start"
              endAccessor="end"
              style={{
                width: "98%",
                height: "540px",
              }}
              eventPropGetter={(events, start, end, isSelected) => {
                let { background, fontColor } = events;
                let newStyle = {
                  clear: "both",
                  display: "block",
                  borderRadius: "4px",
                  padding: "5px",
                  marginTop: "5px !important",
                  marginLeft: "5px !important",
                  lineHeight: "14px",
                  background: `${background}`,
                  border: "2px solid #fff",
                  color: fontColor ? `${fontColor}` : "black",
                  fontWeight: "bold",
                  fontSize: "16px",
                };

                if (events.isMine) {
                  newStyle.backgroundColor = "color";
                  newStyle.border = "2px solid #fff";
                }

                return {
                  className: "",
                  style: newStyle,
                };
              }}
              custom_week_days={days}
              dayPropGetter={customDayPropGetter}
              date={filterDate}
              onNavigate={(date) => {
                setFilterDate(date);
              }}
            />
          ) : (
            <Loader.Progress />
          )}
        </div>
      </div>
    </>
  );
};

export default Calender;

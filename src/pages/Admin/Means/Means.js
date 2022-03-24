import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";

import { Images } from "../../../assets/Assets";

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

const Means = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [means, setMeans] = useState([]);
  const [totalMeans, setTotalMeans] = useState(0);
  const [loading, setLoading] = useState(true);

  const [deliveryArea, setDeliveryArea] = useState("");
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [building, setBuilding] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [buildingObj, setBuildingsObj] = useState([]);
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [storageArea, setStorageArea] = useState("");
  const [storageAreas, setStorageAreas] = useState([]);
  const [type, setType] = useState("");
  const [types, setTypes] = useState([]);
  const [status, setStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");

  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [bookingMeans, setBookingMeans] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterMean();
    // eslint-disable-next-line
  }, [deliveryArea, storageArea, name, type, status, startDate, endDate]);

  useEffect(() => {
    company && fetchBookings();
    // eslint-disable-next-line
  }, [company]);

  useEffect(() => {
    let build = buildingObj.find((lo) => lo._id === building);
    if (building === "Exterior" || !build) {
      setLevel("");
      setStorageArea("");
    } else {
      setStorageArea("");
      setLevels(
        build.levels.map((bu) => ({
          label: bu.number,
          value: bu._id,
        })),
      );
    }
    // eslint-disable-next-line
  }, [building]);

  const fetchData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_LIST_OF_MEANS}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      setTotalMeans(response.data.total_means);
      setDeliveryAreas(
        response.data.site_delivery_areas.map((item) => ({
          label: item.name,
          value: item._id,
        })),
      );
      setStorageAreas(
        response.data.site_storage_areas.map((item) => ({
          label: item.name,
          value: item._id,
          level: item.level,
        })),
      );
      setCompanies(
        response.data.site_companies.map((item) => ({
          label: item.companyId.name,
          value: item.companyId._id,
        })),
      );
      setBuildingsObj(response.data.site_locations);
      setBuildings(
        response.data.site_locations.map((item) => ({
          label: item.name,
          value: item._id,
        })),
      );
      setTypes(
        response.data.mean_types.map((item) => ({ label: item, value: item })),
      );
      setStatuses(
        response.data.mean_status.map((item) => ({ label: item, value: item })),
      );
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const filterMeanByName = (name) => {
    let tempName = name.toLowerCase();
    const filters = { name: tempName };
    const filteredUsers = means.filter((user) => {
      let isValid = true;
      for (let key in filters) {
        let searchKey=user[key].toLowerCase()
        isValid = isValid && searchKey.includes(filters[key]);
      }
      return isValid;
    });
    setMeans(filteredUsers);
  };

  const filterMean = async () => {
    try {
      setLoading(true);
      const params = { siteId: adminStore.site.siteId._id };
      deliveryArea && (params["deliveryArea"] = deliveryArea);
      storageArea && (params["storageArea"] = storageArea);
      type && (params["type"] = type);
      company && (params["company"] = company);
      status && (params["status"] = status);
      startDate && (params["startDate"] = startDate);
      endDate && (params["endDate"] = endDate);
      name && (params["name"] = name);

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_MEANS}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      setMeans(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.BOOKINGS_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      setBookingMeans(response.data.bookings.map((item) => item.meanId));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const rows = means.reduce((accum, item) => {
    if (company) {
      if (bookingMeans.find((loc) => loc && item._id === loc))
        accum.push([
          item.name,
          item.status,
          item.meanType,
          item.location
            .map((loca) =>
              loca.storageArea &&
              loca.locationType !== undefined &&
              loca.locationType === "STORAGEAREA"
                ? loca.storageArea.name
                : "",
            )
            .join(" "),
          item.location
            .map((loca) =>
              loca.deliveryArea &&
              loca.locationType !== undefined &&
              loca.locationType === "DELIVERYAREA"
                ? loca.deliveryArea.name
                : "",
            )
            .join(" "),
          <div>
            <NavLink
              to={{
                pathname: "/means/calendar",
                mean: item,
              }}
            >
              <img
                src={Images.calender}
                style={{ width: 18, height: 15, paddingLeft: 5 }}
                alt="Icon"
              />
            </NavLink>
            <NavLink
              to={{
                pathname: "/means/mean-history",
                mean: item,
              }}
            >
              <img
                src={Images.incidents}
                style={{ width: 18, height: 15, paddingLeft: 5 }}
                alt="Icon"
              />
            </NavLink>
          </div>,
        ]);
    } else {
      accum.push([
        item.name,
        item.status,
        item.meanType,
        item.location
          .map((loca) =>
            loca.storageArea &&
            loca.locationType !== undefined &&
            loca.locationType === "STORAGEAREA"
              ? loca.storageArea.name
              : "",
          )
          .join(" "),
        item.location
          .map((loca) =>
            loca.deliveryArea &&
            loca.locationType !== undefined &&
            loca.locationType === "DELIVERYAREA"
              ? loca.deliveryArea.name
              : "",
          )
          .join(" "),
        <div>
          <NavLink
            to={{
              pathname: "/means/calendar",
              mean: item,
            }}
          >
            <img
              src={Images.calender}
              style={{ width: 18, height: 15, paddingLeft: 5 }}
              alt="Icon"
            />
          </NavLink>
          <NavLink
            to={{
              pathname: "/means/mean-history",
              mean: item,
            }}
          >
            <img
              src={Images.incidents}
              style={{ width: 18, height: 15, paddingLeft: 5 }}
              alt="Icon"
            />
          </NavLink>
        </div>,
      ]);
    }
    return accum;
  }, []);

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center" justifyContent="space-between">
        <Heading primary="LIST OF MEANS" noWrap noMargin />
        <Form.Row alignItems="center" justifyContent="flex-end" width="50%">
          <SubHeading bold noMargin primary={`TOTAL : ${totalMeans} means`} />
          <Button
            fullWidth={false}
            loading={loading}
            disabled={loading}
            component={NavLink}
            text="MEANS REQUEST"
            to={"/sites/means-request"}
            style={{ marginLeft: "20px", width: "200px" }}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row alignItems="center">
        <Form.Row justifyContent="flex-start" noMargin>
          <FormSelect
            value={deliveryArea}
            values={deliveryAreas}
            placeholder="Select Delivery area"
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              setDeliveryArea(value);
            }}
          />
          <FormSelect
            value={building}
            values={[
              ...[{ label: "Exterior", value: "Exterior" }],
              ...buildings,
            ]}
            placeholder="Location"
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              setBuilding(value);
            }}
          />
          <FormSelect
            value={level}
            values={levels}
            placeholder="Level"
            style={{ marginRight: "20px", maxWidth: 250 }}
            disabled={!building || building === "Exterior"}
            onChange={({ target: { value } }) => {
              setLevel(value);
            }}
          />
          <FormSelect
            value={storageArea}
            placeholder="Select Storage area"
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              setStorageArea(value);
            }}
            disabled={!building || (building !== "Exterior" && !level)}
            values={storageAreas.filter((item) =>
              building && building === "Exterior"
                ? !item.level
                : item.level === level,
            )}
          />
          <FormSelect
            value={type}
            values={types}
            placeholder="Type"
            style={{ marginRight: "5px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              setType(value);
            }}
          />
        </Form.Row>
      </Form.Row>
      <Form.Row alignItems="center">
        <Form.Row justifyContent="flex-start" noMargin>
          <FormSelect
            value={company}
            values={companies}
            placeholder="Company"
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              setCompany(value);
            }}
          />
          <FormSelect
            value={status}
            values={statuses}
            placeholder="Status"
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              setStatus(value);
            }}
          />
          <FormInput
            type="date"
            name="startDate"
            value={startDate}
            placeholder="Start date"
            style={{ marginRight: "20px", maxWidth: 250 }}
            min={moment(adminStore.site.siteId.start).format("YYYY-MM-DD")}
            max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
            onChange={({ target: { value } }) => setStartDate(value)}
          />
          <FormInput
            type="date"
            name="endDate"
            value={endDate}
            placeholder="End date"
            style={{ marginRight: "20px", maxWidth: 250 }}
            min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
            max={moment(adminStore.site.siteId.end).format("YYYY-MM-DD")}
            onChange={({ target: { value } }) => setEndDate(value)}
          />
          <SearchInput
            value={name}
            placeholder="Mean name"
            style={{ marginRight: "5px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              setName(value);
              filterMeanByName(value);
            }}
          />
        </Form.Row>
      </Form.Row>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.means.headings} rows={rows} />
      </div>
    </div>
  );
};

export default Means;

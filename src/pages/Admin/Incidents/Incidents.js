import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker } from "antd";
// import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import * as QueryString from "query-string";
import { makeStyles } from "@material-ui/core/styles";
import { Images } from "../../../assets/Assets";
import Modal from "react-bootstrap/Modal";
import "./popover.scss";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";
import generatePDF from "./generatePDF";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";
import { date } from "yup";

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
  link: {
    marginRight: 20,
    whiteSpace: "nowrap",
    color: theme.palette.primary.contrastText,
  },
  image: {
    height: 70,
    borderRadius: theme.shape.borderRadius,
  },
}));
let statciincidentsdata = [
  { name: "name", price: "2", date: new Date(), status: "true", type: "mean" },
  {
    name: "name1",
    price: "22",
    date: new Date(),
    status: "true",
    type: "delay",
  },
  {
    name: "name2",
    price: "222",
    date: new Date(),
    status: "true",
    type: "mean",
  },
];
let siteis = { name: "test site" };

const Incidents = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const storeAdmin = useSelector((state) => state.admin);

  const [popoverShow, setpopoverShow] = useState(false);

  const [value, onChange] = useState(new Date());

  const [incidents, setIncidents] = useState([]);
  const [items, setItems] = useState([]);
  const [incidentsdata, setIncidentsdata] = useState([]);
  const [siteDeliveryArea, setSiteDeliveryArea] = useState([]);
  const [siteComapny, setSiteComapny] = useState([]);
  const [sitedata, setSiteData] = useState({});
  const [flagforStartdate, setFlag1] = useState(false);
  const [flagforEnddate, setFlag2] = useState(false);
  const [selectedStatus, setselectedStatus] = useState([]);
  const [status, setStatus] = useState([]);
  const [tatalInvoices, seTatalInvoices] = useState([]);
  const [tatalPrice, seTatalPrice] = useState([]);
  const [nameText, setNameText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [siteBuilding, setSiteBuilding] = useState([]);
  const [allBuilding, setAllBuilding] = useState([]);
  const [dropDownLevels, setDropDownLevels] = useState([]);
  const [dropDownStorageArea, setDropDownStorageArea] = useState([]);
  const [selectedStorageAreaValue, setSelectedStorageAreaValue] = useState("");
  const [selectedDeliveryArea, setSelectedDeliveryArea] = useState("");
  const [disableStorageDropdown, setDisableStorageDropdown] = useState(true);
  const [disableLevelDropdown, setDisableLevelDropdown] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");

  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterIncidents();
    // eslint-disable-next-line
  }, [
    nameText,
    companyId,
    selectedType,
    selectedStatus,
    startDate,
    endDate,
    selectedStorageAreaValue,
    selectedDeliveryArea,
  ]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ALL_SITE_INCIDENTS}/${adminStore.site.siteId._id}`,
      });
      setIncidents(result.data.incidents);
      if (result.data.incidents) {
        seTatalInvoices(result.data.incidents.length);

        getIncidentsfiltered(result.data.incidents);
      }

      if (result.data.site_delivery_areas) {
        getDeliveryArea(result.data.site_delivery_areas);
      }
      if (result.data.type) {
        getType(result.data.type);
      }
      if (result.data.status) {
        getStatus(result.data.status);
      }
      if (result.data.site_companies) {
        getCompanies(result.data.site_companies);
      }
      if (result.data.site_buildings) {
        getBuildingLocation(result.data.site_buildings);
      }
      setDropDownStorageArea(
        result.data.site_storage_areas.map((item) => ({
          label: item.name,
          value: item._id,
          level: item.level,
        })),
      );

      const params = QueryString.parse(props.location.search);
      if (params.companyId) {
        setCompanyId(params.companyId);
      }
      // setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function filterIncidents() {
    try {
      setLoading(true);
      const params = { siteId: adminStore.site.siteId._id };

      if (nameText.length !== 0) params["name"] = nameText;
      if (companyId.length !== 0) params["company"] = companyId;
      if (selectedType.length !== 0) params["type"] = selectedType;
      if (selectedStatus.length !== 0) params["status"] = selectedStatus;
      if (!isNaN(moment(startDate))) params["startDate"] = startDate;
      if (!isNaN(moment(endDate))) params["endDate"] = endDate;
      if (selectedStorageAreaValue.length !== 0)
        params["storageArea"] = selectedStorageAreaValue;
      if (selectedDeliveryArea.length !== 0)
        params["deliveryArea"] = selectedDeliveryArea;

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_INCIDENT}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      if (response.success) {
        getIncidentsfiltered(response.data);
        // setItems(temp);
        setLoading(false);
      } else {
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function getBuildingLocation(data) {
    setAllBuilding(data);
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item.name,
        value: item._id,
      });
    });
    setSiteBuilding(temp);
  }
  function getCompanies(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item.companyId.name,
        value: item.companyId._id,
      });
    });
    setSiteComapny(temp);
  }
  function getStatus(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item,
        value: item,
      });
    });
    setStatus(temp);
  }

  function getType(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item,
        value: item,
      });
    });
  }

  function getDeliveryArea(data) {
    let temp = [];
    data.map((item, index) => {
      return temp.push({
        label: item.name,
        value: item._id,
      });
    });
    setSiteDeliveryArea(temp);
  }

  function getIncidentsfiltered(data) {
    setIncidentsdata(data);
    let temp = [];
    let total = 0;
    data.map((item, index) => {
      total = total + item.price;
      let data = [];
      data[0] = item.date ? moment(item.date).format("DD/MM/yyyy") : " ";
      data[1] = item?.type;
      data[2] = item?.name;
      data[3] = item.companyId?.name;
      data[4] = item.status;
      data[5] =
        item.location?.deliveryArea?.name ||
        item.location?.storageArea?.name ||
        "";
      data[6] = item?.isBillable ? "Yes" : "No";
      data[7] = item?.price;
      data[8] = item?.isPaid ? "Yes" : "No";
      return temp.push(data);
    });
    seTatalPrice(total);
    setItems(temp);
  }
  const handlePopoverClose = () => setpopoverShow(false);
  const rows = items.map((item, index) => {
    return [
      item[0] ? item[0] : "",
      item[1] ? item[1] : " ",
      item[2] ? item[2] : " ",
      item[3] ? item[3] : " ",
      item[4] ? item[4] : " ",
      item[5] ? item[5] : " ",
      item[6] ? item[6] : " ",
      item[7] ? item[7] : " ",
      item[8] ? item[8] : " ",
    ];
  });
  const getCompanyName = (id) => {
    if (id) {
      let getcompany = siteComapny.filter((s) => s.value === id);
      let cName = getcompany[0].label;
      setCompanyName(cName);
    } else {
      return setCompanyName("");
    }
  };

  function fetchLevelesOfSelectedBuilding(buildingId) {
    const data = allBuilding.filter((x) => x._id === buildingId)[0].levels;
    if (data) {
      let temp = [];
      data.map((item, index) => {
        return temp.push({
          label: item.number,
          value: item._id,
        });
      });
      setDropDownLevels(temp);
    }
  }
  // console.log("companyId", companyId);
  // console.log("companyName", companyName);
  // console.log(selectedType, "selectedType");
  // console.log("incidents", incidents);
  // console.log("site", storeAdmin?.site?.siteId);

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center">
          <Heading primary="RE-INVOICING" noWrap />
          <span className="pl-5" style={{ width: "40%", marginBottom: "15px" }}>
            <img
              alt="custom"
              src={Images.uploadIcon}
              style={{ width: "1.5rem", cursor: "pointer" }}
              onClick={() => setpopoverShow(true)}
            />
          </span>
          <div>
            <Form.Row
              alignItems="flex-start"
              noMargin
              justifyContent="flex-end"
            >
              <SubHeading
                noMargin
                topPadding
                style={{ color: "#F80303" }}
                primary={`TOTAL: ${tatalInvoices} RE-INVOICING
              ${tatalPrice}€`}
                bold
              />
              <Form.Column style={{ width: "50%" }}>
                <Button
                  fullWidth={false}
                  disabled={loading}
                  component={NavLink}
                  text="CREATE AN INCIDENT"
                  to={"/incidents/add-incidents"}
                  style={{
                    marginLeft: "20px",
                    marginBottom: "7px",
                    width: "200px",
                    fontWeight: "bold",
                    backgroundColor: "#F80303",
                  }}
                />
              </Form.Column>
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row alignItems="center" noMargin>
          <Form.Row justifyContent="flex-start" noMargin>
            <FormSelect
              values={siteDeliveryArea}
              placeholder="Delivery area"
              style={{ marginRight: "20px", maxWidth: 250 }}
              value={selectedDeliveryArea}
              onChange={(event) => {
                setSelectedDeliveryArea(event.target.value);
                // const index = event.target.selectedIndex - 1;
                // if (index !== -1) {
                //   setSelectedDeliveryArea(event.target.value);
                // } else {
                //   setSelectedDeliveryArea(" ");
                // }
              }}
            />
            <FormSelect
              values={[
                ...[{ label: "Exterior", value: "Exterior" }],
                ...siteBuilding,
              ]}
              placeholder="Location"
              style={{ marginRight: "20px", maxWidth: 250 }}
              value={selectedBuilding}
              onChange={(event) => {
                const index = event.target.selectedIndex - 1;
                setSelectedBuilding(event.target.value);
                if (index !== -1) {
                  if (event.target.value === "Exterior") {
                    setDisableLevelDropdown(true);
                    setDisableStorageDropdown(false);
                  } else {
                    fetchLevelesOfSelectedBuilding(event.target.value);
                    setDisableLevelDropdown(false);
                    setDisableStorageDropdown(true);
                  }
                } else {
                  setDisableLevelDropdown(true);
                }
              }}
            />
            <FormSelect
              values={dropDownLevels}
              placeholder="Level"
              disabled={disableLevelDropdown}
              value={selectedLevel}
              style={{ marginRight: "20px", maxWidth: 250 }}
              onChange={(event) => {
                const index = event.target.selectedIndex - 1;
                if (index !== -1) {
                  setDisableStorageDropdown(false);
                  setSelectedLevel(event.target.value);
                } else {
                  setDisableStorageDropdown(true);
                }
              }}
            />
            <FormSelect
              values={dropDownStorageArea.filter((item) =>
                selectedBuilding && selectedBuilding === "Exterior"
                  ? !item.level
                  : item.level === selectedLevel,
              )}
              placeholder="Storage area"
              disabled={disableStorageDropdown}
              style={{ marginRight: "20px", maxWidth: 250 }}
              onChange={(event) => {
                const index = event.target.selectedIndex - 1;
                if (index !== -1) {
                  setSelectedStorageAreaValue(event.target.value);
                }
              }}
            />
            <FormSelect
              placeholder="Type"
              value={selectedType}
              values={[
                { value: "INCIDENT", label: "Incident" },
                { value: "MEAN", label: "Mean" },
                { value: "DELAY", label: "Delay" },
                { value: "UNEXPRECTED", label: "Unexp" },
              ]}
              style={{ marginRight: "5px", maxWidth: 250 }}
              onChange={(event) => {
                const index = event.target.selectedIndex - 1;
                if (index !== -1) {
                  const item = event.target.value;
                  setSelectedType(item);
                } else {
                  setSelectedType("");
                }
              }}
            />
          </Form.Row>
        </Form.Row>

        <Form.Row alignItems="center" className="mt-3">
          <Form.Row justifyContent="flex-start" noMargin>
            <FormSelect
              placeholder="Company"
              value={companyId}
              values={siteComapny}
              onChange={(event) => {
                setCompanyId(event.target.value);
                getCompanyName(event.target.value);
              }}
              style={{ marginRight: "20px", maxWidth: 250 }}
            />

            <FormInput
              type="date"
              placeholder="Start date"
              name="startDate"
              icon
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              style={{ marginRight: "20px", maxWidth: 250 }}
            />
            <FormInput
              type="date"
              placeholder="End date"
              name="endDate"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              style={{ marginRight: "20px", maxWidth: 250 }}
            />
            <FormSelect
              values={status}
              style={{ marginRight: "20px", maxWidth: 250 }}
              onChange={(event) => {
                setselectedStatus(event.target.value);
              }}
            />
            <SearchInput
              placeholder="Designation"
              style={{ marginRight: "5px", maxWidth: 250 }}
              onChange={(event) => {
                setNameText(event.target.value);
              }}
            />
          </Form.Row>
        </Form.Row>

        <div className={classes.content}>
          <Table
            headers={GLOBALS.Data.incidents.headings}
            rows={rows}
            onClick={(e) => {
              return props.history.push({
                pathname: "/incidents/edit-incidents",
                data: incidents[e],
              });
            }}
          />
        </div>
      </div>
      <Modal
        size="lg"
        show={popoverShow}
        onHide={handlePopoverClose}
        className=""
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Re-Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="showPopover"
            //  style={{ width: "90%", margin: "auto" }}
          >
            <Form.Row alignItems="center" className="mt-3">
              <Form.Row justifyContent="flex-start" noMargin>
                {/* <DatePicker
                  size={"large"}
                  name={"startDate"}
                  format="DD-MM-YYYY"
                  onChange={(v) => setStartDate(moment(v).format("yyyy-MM-DD"))}
                  value={startDate}
                  placeholderText={"Start Date"}
                  icon
                /> */}
                {flagforStartdate ? (
                  <input
                    type="date"
                    placeholder="Start Date"
                    onBlur={() =>
                      startDate ? setFlag1(flagforStartdate) : setFlag1(false)
                    }
                    name="startDate"
                    icon
                    value={startDate}
                    onChange={(e) => {
                      console.log("e", e.target.value);
                      setStartDate(e.target.value);
                    }}
                    style={{
                      height: "6vh",
                      opacity: ".7",
                      marginRight: "10px",
                      width: "50%",
                    }}
                  />
                ) : (
                  <DatePicker
                    size={"large"}
                    onFocus={() => setFlag1(true)}
                    onBlur={() => setFlag1(false)}
                    placeholder="Start Date"
                    value={startDate}
                    style={{
                      height: "6vh",
                      opacity: ".7",
                      marginRight: "10px",
                      width: "50%",
                      borderColor: "black",
                      borderStyle: "solid",
                    }}
                  />
                )}

                {flagforEnddate ? (
                  <input
                    type="date"
                    placeholder="End Date"
                    onBlur={() =>
                      endDate ? setFlag2(flagforEnddate) : setFlag2(false)
                    }
                    name="endDate"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                    style={{
                      height: "6vh",
                      opacity: ".7",
                      marginRight: "10px",
                      width: "50%",
                    }}
                  />
                ) : (
                  <DatePicker
                    size={"large"}
                    onFocus={() => setFlag2(true)}
                    onBlur={() => setFlag2(false)}
                    placeholder="End Date"
                    style={{
                      height: "6vh",
                      opacity: ".7",
                      marginRight: "10px",
                      width: "50%",
                      borderColor: "black",
                      borderStyle: "solid",
                    }}
                  />
                )}
                {/* <DatePicker
                  size={"large"}
                  name="endDate"
                  value={endDate}
                  format="DD-MM-YYYY"
                  onChange={(v) => setEndDate(moment(v).format("yyyy-MM-DD"))}
                  placeholderText={"End Date"}
                  icon
                />
                 */}
              </Form.Row>
            </Form.Row>

            <Form.Row alignItems="center" noMargin>
              <Form.Row justifyContent="flex-start" noMargin>
                <FormSelect
                  placeholder="Company"
                  value={companyId}
                  values={siteComapny}
                  onChange={(event) => {
                    setCompanyId(event.target.value);
                    getCompanyName(event.target.value);
                  }}
                  style={{ marginRight: "20px", maxWidth: "50%" }}
                />
                <FormSelect
                  placeholder="Type"
                  value={selectedType}
                  values={[
                    { value: "INCIDENT", label: "Incident" },
                    { value: "MEAN", label: "Mean" },
                    { value: "DELAY", label: "Delay" },
                    { value: "UNEXPRECTED", label: "Unexp" },
                  ]}
                  style={{ marginRight: "5px", maxWidth: "50%" }}
                  onChange={(event) => {
                    const index = event.target.selectedIndex - 1;
                    if (index !== -1) {
                      const item = event.target.value;
                      setSelectedType(item);
                    } else {
                      setSelectedType("");
                    }
                  }}
                />
              </Form.Row>
            </Form.Row>
          </div>
          <div className={classes.content}>
            <Table headers={GLOBALS.Data.incidents.headings} rows={rows} />
          </div>
          {incidentsdata.length >= 1 && companyId && selectedType && (
            <div style={{ textAlign: "right", margin: "5px" }}>
              <Button
                fullWidth={false}
                text="EXPORT"
                style={{ marginLeft: "20px" }}
                onClick={() =>
                  generatePDF(
                    incidentsdata,
                    companyName,
                    storeAdmin?.site?.siteId,
                    tatalPrice,
                  )
                }
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Incidents;

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Modal from "../../../components/Modal";
import Table from "../../../components/Table";
import Loader from "../../../components/Loader";
import { Images } from "../../../assets/Assets";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";
import uploadIcon from "../../../assets/images/upload.png";

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

export default function Companies(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);

  const [companies, setCompanies] = useState([]);

  const [nameOfResponsible, setNameOfResponsible] = useState("");
  const [nameOfCompany, setNameOfCompany] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storageAreaRequest, setStorageAreaRequest] = useState([]);
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      setCompanies(response.data);
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

  const filterCompany = async () => {
    try {
      const params = { siteId: adminStore.site.siteId._id };
      if (nameOfCompany.length !== 0) params["companyName"] = nameOfCompany;
      if (nameOfResponsible.length !== 0)
        params["responsibleName"] = nameOfResponsible;

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_SITE_COMPANY_FILTER}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      const companies = response.data.companies.filter((x) => {
        return x.companyId !== null || undefined;
      });
      setCompanies(companies);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const handleClickOpen = async () => {
    await fetchAccessToZone();
    setOpen(true);
  };
  const fetchAccessToZone = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_STORAGE_AREA}/${adminStore.site.siteId._id}`,
        token: store.token,
      });
      setStorageAreaRequest(response.data);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const onAccept = async (id) => {
    try {
      await GLOBALS.API({
        uri: `${GLOBALS.Constants.ACCEPT_SITE_STORAGE_AREA}/${id}`,
        token: store.token,
      });
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(
            GLOBALS.I18n.t("storageAreaAccept"),
            "success",
          ),
        ),
      );
      await fetchAccessToZone();
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const onReject = async (id) => {
    try {
      await GLOBALS.API({
        uri: `${GLOBALS.Constants.REJECT_SITE_STORAGE_AREA}/${id}`,
        token: store.token,
      });

      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(
            GLOBALS.I18n.t("storageAreaRequestReject"),
            "success",
          ),
        ),
      );
      await fetchAccessToZone();
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const requestRows = storageAreaRequest.map((item) => {
    return [
      item.companyId.name,
      item.requestDate ? moment(item.requestDate).format("DD/MM/yyyy") : " ",
      item.storageAreaId.name,
      <div>
        <Button
          onClick={() => onAccept(item._id)}
          type="submit"
          text="ACCEPT"
          fullWidth={false}
        />{" "}
        <Button
          type="submit"
          color={theme.palette.error.main}
          text="REJECT"
          fullWidth={false}
          onClick={() => onReject(item._id)}
        />
      </div>,
    ];
  });

  const rows = companies.map((item, index) => {
    return [
      <img src={Images.site} alt="Icon" />,
      item.companyId.name,
      item.parentCompanyId ? item.parentCompanyId.name : "N/A",
      item.companyId.incharge !== undefined
        ? item.companyId.incharge.firstName +
          " " +
          item.companyId.incharge.lastName
        : "N/A",
      item.companyId.incharge !== undefined
        ? item.companyId.incharge.phone
        : "N/A",
      item.companyId.incharge !== undefined
        ? item.companyId.incharge.email
        : "N/A",
      <div>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <NavLink
            to={{
              pathname: `/companies/user-list/${item.companyId._id}`,
              id: item.companyId._id,
            }}
          >
            <img
              src={Images.comapnies}
              style={{ width: 18, height: 17 }}
              alt="Icon"
            />
          </NavLink>
        </IconButton>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <NavLink to={`/companies/edit/${item.companyId._id}`}>
            <img
              src={Images.pencil}
              style={{ width: 18, height: 17 }}
              alt="Icon"
            />
          </NavLink>
        </IconButton>
        <IconButton style={{ padding: "6px" }} onClick={() => {}}>
          <NavLink
            to={{
              pathname: "/",
              companyId: item.companyId._id,
            }}
          >
            <img
              src={Images.calender}
              style={{ width: 18, height: 17 }}
              alt="Icon"
            />
          </NavLink>
        </IconButton>
        <IconButton
          style={{ padding: "6px", color: "#1890ff" }}
          onClick={() => {}}
        >
          <NavLink
            to={{
              pathname: `/incidents`,
              search: `?companyId=${item.companyId._id}`,
            }}
          >
            <img
              src={Images.incidents}
              style={{ width: 18, height: 17 }}
              alt="Icon"
            />
          </NavLink>
        </IconButton>
      </div>,
    ];
  });

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center" className="pr-3">
          <Heading primary="LIST OF COMPANIES" noWrap noMargin />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading
                bold
                noMargin
                disableMargin
                primary={`Total : ${companies.length} COMPANIES`}
              />
              <Button
                fullWidth={false}
                component={NavLink}
                text="ADD A COMPANY"
                to={"/companies/add"}
                style={{ marginLeft: "20px" }}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin className="pr-3">
          <Form.Row style={{ justifyContent: "flex-start" }} noMargin>
            <SearchInput
              placeholder="Name of responsible"
              value={nameOfResponsible}
              onClick={filterCompany}
              onChange={(event) => {
                setNameOfResponsible(event.target.value);
              }}
            />
            <SearchInput
              style={{ marginLeft: "20px" }}
              placeholder="Name of company"
              value={nameOfCompany}
              onClick={filterCompany}
              onChange={(event) => {
                setNameOfCompany(event.target.value);
              }}
            />
          </Form.Row>
          <Button
            noWrap
            fullWidth={true}
            onClick={handleClickOpen}
            style={{ width: "330px" }}
            text="ACCESS REQUEST TO ZONES"
          />
        </Form.Row>
        <div className={classes.content}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <Table headers={GLOBALS.Data.companies.headings} rows={rows} />
          )}
        </div>
      </div>

      <Modal
        title="Access to storage area"
        open={open}
        onClose={() => setOpen(false)}
        body={
          <div className={classes.content}>
            <Table
              headers={GLOBALS.Data.accessToStorageArea.headings}
              rows={requestRows}
            />
          </div>
        }
      />
    </>
  );
}

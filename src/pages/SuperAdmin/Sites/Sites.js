import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";
import Heading from "../../../components/Heading";
import Pagination from "../../../components/Pagination";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SmallButton from "../../../components/SmallButton";
import SearchInput from "../../../components/SearchInput";

import SiteImage from "../../../assets/images/Site.png";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";

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

export default function Sites(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [client, setClient] = useState("ALL");

  const [data, setData] = useState("");
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [client, page, status]);
  useEffect(() => {
    props.match.params.clientId && setClient(props.match.params.clientId);
    // eslint-disable-next-line
  }, [clients]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITES}?page=${page}&name=${query}&status=${status}&client=${client}`,
      });
      const clients = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}`,
      });

      setClients(clients.data.items);
      setItems(result.data.items);
      setData(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onArchive(itemId) {
    try {
      if (window.confirm("Are you sure, you want to do this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "PUT",
          token: store.token,
          uri: GLOBALS.Constants.SITE_ARCHIVE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
        fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const clientsArray = [
    {
      value: "ALL",
      label: "Client",
    },
  ];
  clients.map((client) =>
    clientsArray.push({
      value: client._id,
      label: client.companyId.name,
    }),
  );
  const statusArray = [
    { value: "ALL", label: "Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];
  const rows = items.map((item) => [
    <img
      src={item.logo ? GLOBALS.Constants.BASE_URL + item.logo : SiteImage}
      alt="siteimage"
      className={classes.image}
    />,
    item.name,
    item.zacId ? item.zacId.name : "N/A",
    item.clientAdmin.map((adminId, index) => {
      return (
        <>
          <li>{adminId.adminId.firstName + " " + adminId.adminId.lastName}</li>
        </>
      );
    }),
    item.status,
    <Form.Row alignItems="center" justifyContent="center">
      <IconButton
        onClick={() => props.history.push(`/sites/edit-site/${item._id}`)}
      >
        <Pencil style={{ width: 15, height: 15 }} />
      </IconButton>
      <SmallButton
        text="Archive"
        disabled={loading}
        onClick={() => onArchive(item._id)}
        color={theme.palette.primary.contrastText}
        style={{
          marginLeft: 10,
          borderRadius: 4,
        }}
      />
    </Form.Row>,
  ]);

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading primary="SITES LIST" noWrap />
        <div>
          <Form.Row alignItems="center" noMargin>
            <SubHeading
              noMargin
              primary={data && `Total : ${data.totalItems} Sites`}
              bold
            />
            <Button
              fullWidth={false}
              component={NavLink}
              text="ZACS LIST"
              to={"/sites/zacs"}
              style={{ marginLeft: "20px" }}
            />
            <Button
              fullWidth={false}
              component={NavLink}
              text="CREATE A SITE"
              to={"/sites/add-site"}
              style={{ marginLeft: "20px" }}
            />
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row alignItems="center" noMargin>
        <Form.Row justifyContent="flex-start" noMargin>
          <SearchInput
            value={query}
            onClick={fetchData}
            placeholder="Site name"
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => setQuery(value)}
          />
          <FormSelect
            name="client"
            value={client}
            values={clientsArray}
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => {
              props.history.replace("/sites");
              setClient(value);
            }}
          />
          <FormSelect
            name="status"
            value={status}
            values={statusArray}
            style={{ marginRight: "20px", maxWidth: 250 }}
            onChange={({ target: { value } }) => setStatus(value)}
          />
        </Form.Row>
        <NavLink className={classes.link} to="/sites/archives">
          See archived sites
        </NavLink>
      </Form.Row>
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : (
          <Table headers={GLOBALS.Data.sites.headings} rows={rows} />
        )}
        {!loading && data.totalItems > 10 && (
          <Pagination
            page={page}
            count={data.totalPages}
            onChange={(e, value) => {
              setPage(value);
            }}
          />
        )}
      </div>
    </div>
  );
}

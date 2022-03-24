import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import Pagination from "../../../components/Pagination";
import FormSelect from "../../../components/FormSelect";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";

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

export default function Invoices(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [data, setData] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(props.match.params.clientId);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    client && fetchData();
    // eslint-disable-next-line
  }, [page, client]);

  useEffect(() => {
    props.match.params.clientId
      ? setClient(props.match.params.clientId)
      : setClient("ALL");
    // eslint-disable-next-line
  }, [client]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.INVOICES}/?page=${page}&clientId=${client}`,
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

  async function onDelete(itemId) {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "DELETE",
          token: store.token,
          uri: GLOBALS.Constants.INVOICE_DELETE + "/" + itemId,
        });
        const itemsArray = items.filter((item) => item._id !== itemId);
        setItems(itemsArray);
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

  let clientsArray = [
    {
      value: "ALL",
      label: "ALL",
    },
  ];
  clients.map((client) =>
    clientsArray.push({
      value: client._id,
      label: client.companyId.name,
    }),
  );
  console.log("items", items);
  const rows = items.map((item) => [
    item.clientId.companyId.name,
    moment(item.startDate).format("DD/MM/YYYY"),
    moment(item.endDate).format("DD/MM/YYYY"),
    item.siteId?.name,
    item.amount,
    item.description,
    <>
      <IconButton component={NavLink} to={`/invoices/edit-invoice/${item._id}`}>
        <Pencil style={{ width: 15, height: 15 }} />
      </IconButton>
      <IconButton onClick={() => onDelete(item._id)}>
        <Cross style={{ width: 15, height: 15, color: "red" }} />
      </IconButton>
    </>,
  ]);

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading primary="INVOICES" noWrap />
        <Button
          fullWidth={false}
          component={NavLink}
          text="CREATE AN INVOICE"
          to={{
            pathname: "/invoices/add-invoice",
            clientId: client,
          }}
        />
      </Form.Row>
      <Form.Row noMargin>
        <FormSelect
          value={client}
          disabled={loading}
          values={clientsArray}
          style={{ maxWidth: 250 }}
          onChange={({ target: { value } }) => {
            props.history.replace(`/invoices/${value}`);
            setClient(value);
          }}
        />
      </Form.Row>
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : (
          <Table headers={GLOBALS.Data.invoices.headings} rows={rows} />
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

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import Pagination from "../../../components/Pagination";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "40px 15px",
  },
  content: {
    padding: 15,
    marginTop: 10,
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function ZACS(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [data, setData] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ZACS}?page=${page}`,
      });
      setItems(result.data.items);
      setData(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.messagerr, "error"),
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
          uri: GLOBALS.Constants.ZAC_DELETE + "/" + itemId,
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

  const rows = [];
  items.map((item) => {
    rows.push([
      item.name,
      item.sites.length,
      <IconButton disabled={loading} onClick={() => onDelete(item._id)}>
        <Cross style={{ width: 15, height: 15, color: "red" }} />
      </IconButton>,
    ]);
    return true;
  });

  return (
    <div className={classes.root}>
      <Form.Row>
        <Heading primary="ZACS LIST" noMargin />
        <Button
          fullWidth={false}
          component={NavLink}
          text="CREATE A ZAC"
          to="/sites/add-zac"
        />
      </Form.Row>
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : (
          <Table headers={GLOBALS.Data.zacs.headings} rows={rows} />
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

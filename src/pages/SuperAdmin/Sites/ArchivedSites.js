import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Loader from "../../../components/Loader";
import Heading from "../../../components/Heading";
import Pagination from "../../../components/Pagination";
import SmallButton from "../../../components/SmallButton";
import SearchInput from "../../../components/SearchInput";

import SiteImage from "../../../assets/images/Site.png";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";

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
  image: {
    height: 70,
    borderRadius: theme.shape.borderRadius,
  },
}));

export default function ArchivedSites(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [data, setData] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_ARCHIVES}?page=${page}&name=${query}`,
      });
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

  async function onUnArchive(itemId) {
    try {
      if (window.confirm("Are you sure, you want to do this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "PUT",
          token: store.token,
          uri: GLOBALS.Constants.SITE_UN_ARCHIVE + "/" + itemId,
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

  async function onDelete(itemId) {
    try {
      if (window.confirm("Are you sure, you want to delete this?")) {
        setLoading(true);
        await GLOBALS.API({
          method: "DELETE",
          token: store.token,
          uri: GLOBALS.Constants.SITE_DELETE + "/" + itemId,
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

  const rows = items.map((item) => [
    <img
      src={item.logo ? GLOBALS.Constants.BASE_URL + item.logo : SiteImage}
      alt="siteimage"
      className={classes.image}
    />,
    item.name,
    item.zacId ? item.zacId.name : "N/A",
    `${item.adminId.firstName} ${item.adminId.lastName}`,
    item.status,
    <Form.Row alignItems="center" justifyContent="center">
      <SmallButton
        text="Unarchive"
        fullWidth={false}
        disabled={loading}
        onClick={() => onUnArchive(item._id)}
        color={theme.palette.primary.contrastText}
        style={{
          marginRight: 10,
          borderRadius: 4,
        }}
      />
      <IconButton onClick={() => onDelete(item._id)}>
        <Cross style={{ width: 15, height: 15, color: "red" }} />
      </IconButton>
    </Form.Row>,
  ]);

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Form.Column>
        <Heading primary="ARCHIVED SITES" />
        <SearchInput
          value={query}
          onClick={fetchData}
          placeholder="Site name"
          style={{ marginRight: "20px", maxWidth: 250 }}
          onChange={({ target: { value } }) => setQuery(value)}
        />
      </Form.Column>
      <div className={classes.content}>
        {loading ? (
          <Loader.Progress />
        ) : (
          <Table headers={GLOBALS.Data.archivedSites.headings} rows={rows} />
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

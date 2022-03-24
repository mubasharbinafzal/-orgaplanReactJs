import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";

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

export default function Organigramme(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const adminStore = useSelector((state) => state.admin);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [organigramme, setOrganigrammes] = useState([]);
  const [completeOrganigramme, setCompleteOrganigrammes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    getOrganigramme(selectedFilter);
    // eslint-disable-next-line
  }, [selectedFilter]);

  async function fetchData() {
    try {
      const oranigramme = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_SITE_ORGANIGRAMMES}/${adminStore.site.siteId._id}`,
      });
      if (oranigramme.success) {
        setCompleteOrganigrammes(oranigramme.data);
        setOrganigrammes(oranigramme.data);
        if (props?.location?.state?.type) {
          setSelectedFilter(props?.location?.state?.type);
        } else {
          setSelectedFilter("SITE");
        }
      }
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const rows = items.map((item, index) => {
    return [
      <img
        src={item[0] ? GLOBALS.Constants.BASE_URL + item[0] : null}
        alt="Organigramme"
        style={{ width: 50, height: 50 }}
      />,
      item[1] ? item[1] : null,
      item[2] ? item[2] : null,
      item[3] ? item[3] : null,
      item[4] ? item[4] : null,
      item[5] ? item[5] : null,
      item[6] ? item[6] : null,
    ];
  });

  function getOrganigramme(value) {
    setSelectedFilter(value);
    let filterData = completeOrganigramme.filter((x) => x.type === value);
    setOrganigrammes(filterData);
    let temp = [];
    filterData.map((item, index) => {
      let data = [];
      data[0] = item.image;
      data[1] = item.firstName;
      data[2] = item.lastName;
      data[3] = item.company;
      data[4] = item.role;
      data[5] = item.phone;
      data[6] = item.email;
      return temp.push(data);
    });
    setItems(temp);
  }

  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center" className="pr-3">
          <Heading primary="ORGANIGRAMME" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <Button
                fullWidth={false}
                component={NavLink}
                text="ADD A CONTACT"
                style={{ marginLeft: "20px" }}
                to={{
                  pathname: "/organigramme/add-contact",
                  type: selectedFilter,
                }}
              />
            </Form.Row>
          </div>
        </Form.Row>
        <Form.Row noMargin>
          <Form.Row style={{ justifyContent: "flex-start" }} noMargin>
            <Button
              fullWidth={false}
              text="SITE ORGANIGAMME"
              style={{
                marginLeft: "20px",
                backgroundColor:
                  selectedFilter === "LOGISTICS" ? "#fff" : "#140772",
              }}
              textColor={selectedFilter === "LOGISTICS" ? "#7E7878" : ""}
              onClick={() => getOrganigramme("SITE")}
            />
            <Button
              fullWidth={false}
              text="LOGISTIC ORGANIGAMME"
              style={{
                marginLeft: "20px",
                backgroundColor: selectedFilter === "SITE" ? "#fff" : "#140772",
              }}
              textColor={selectedFilter === "SITE" ? "#7E7878" : ""}
              onClick={() => getOrganigramme("LOGISTICS")}
            />
          </Form.Row>
        </Form.Row>
        <div className={classes.content}>
          <Table
            headers={GLOBALS.Data.oranigramme.headings}
            rows={rows}
            onClick={(e) => {
              props.history.push({
                pathname: "/organigramme/edit-contact",
                data: organigramme[e],
              });
            }}
          />
        </div>
      </div>
      {loading && ""}
    </>
  );
}

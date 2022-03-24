import React, { useState, useEffect } from "react";
import GLOBALS from "../../../globals";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Heading from "../../../components/Heading";
import FormSelect from "../../../components/FormSelect";
import moment from "moment";
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

const Historic = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const [history, setHistory] = useState([]);

  const [means, setMeans] = useState([]);
  const [dorpdownMeans, setDropdownMeans] = useState([]);
  const [selectedMean, setSelectedMean] = useState("");
  const [selectedMeanIndex, setSelectedMeanIndex] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(null);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterBooking();
    // eslint-disable-next-line
  }, [selectedMeanIndex, selectedCompanyIndex]);

  const filterBooking = async () => {
    try {
      const params = { siteId: adminStore.site.siteId._id };
      if (selectedMean.length !== 0)
        params["meanId"] = means[selectedMeanIndex]._id;
      if (selectedCompany.length !== 0)
        params["companyId"] = companies[selectedCompanyIndex].companyId._id;

      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_BOOKING}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      if (response.success) {
        setHistory(response.data);
      } else {
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const getData = async () => {
    try {
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_MEAN_HISTORY}/${props.location.mean._id}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      if (response.success) {
        setHistory(response.data.history);
        setCompanies(response.data.site_companies);
        if (response.data.site_means != null) {
          setMeans(response.data.site_means);
          let selectedMeanIndex = 0;

          const temp = [];
          const companyTemp = [];
          response.data.site_means.map((item, index) => {
            if (item._id === props.location.mean._id) {
              selectedMeanIndex = index;
              setSelectedMean(item.name);
            }
            return temp.push({ label: item.name, value: item.name });
          });
          setDropdownMeans(temp);

          setSelectedMeanIndex(selectedMeanIndex);

          response.data.site_companies.map((item, index) => {
            return companyTemp.push({
              label: item.companyId.name,
              value: item.companyId.name,
            });
          });
          setDropdownCompanies(companyTemp);
        }
      } else {
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const rows = history.map((item) => {
    return [
      moment(item.startDate).format("MM/DD/yyy") + " " + item.startTime,
      moment(item.endDate).format("MM/DD/yyy") + " " + item.endTime,
      item.companyId.name,
      item.bookingReason,
    ];
  });

  return (
    <div className={classes.root}>
      <Form.Row alignItems="center">
        <Heading primary="LIST OF MEANS - HISTORIC" noWrap />
        <div>
          <Form.Row
            alignItems="flex-start"
            noMargin
            justifyContent="flex-end"
            style={{ paddingRight: "50px" }}
          >
            <Form.Column style={{ width: "50%", marginRight: "50px" }}>
              <img src={Images.site} alt="" />
            </Form.Column>
          </Form.Row>
        </div>
      </Form.Row>
      <Form.Row alignItems="center" noMargin>
        <Form.Row justifyContent="flex-start" noMargin>
          {/* <SearchInput
            placeholder="Site name"
            style={{ marginRight: "20px", maxWidth: 250 }}
          /> */}
          <FormSelect
            placeholder="Company"
            values={dropdownCompanies}
            value={selectedCompany}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;

              if (index !== -1) {
                const item = event.target.value;

                setSelectedCompanyIndex(index);

                setSelectedCompany(item);
              } else {
                setSelectedCompanyIndex(null);

                setSelectedCompany("");
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
          <FormSelect
            placeholder="Mean"
            values={dorpdownMeans}
            value={selectedMean}
            onChange={(event) => {
              const index = event.target.selectedIndex - 1;

              if (index !== -1) {
                const item = event.target.value;

                setSelectedMeanIndex(index);

                setSelectedMean(item);
              } else {
                setSelectedMeanIndex(null);

                setSelectedMean("");
              }
            }}
            style={{ marginRight: "20px", maxWidth: 250 }}
          />
        </Form.Row>
        {/* <NavLink className={classes.link} to="/sites/archives">
          See archived sites
        </NavLink> */}
      </Form.Row>
      <div className={classes.content}>
        <Table headers={GLOBALS.Data.meansOfHistoric.headings} rows={rows} />
      </div>
    </div>
  );
};

export default Historic;

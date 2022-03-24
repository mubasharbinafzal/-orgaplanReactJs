import React, { useState, useEffect } from "react";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import GLOBALS from "../../globals";
import Actions from "../../redux/actions";

import Card from "../../components/Card";
import Form from "../../components/Form";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import SmallText from "../../components/SmallText";
import SubHeading from "../../components/SubHeading";

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
  tab: {
    minWidth: 80,
    fontSize: 12,
  },
}));

const TabsComponent = ({ items }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        textColor="primary"
        variant="fullWidth"
        onChange={handleChange}
        indicatorColor="primary"
        scrollButtons="auto"
      >
        <Tab label={"Per " + items[0].title} className={classes.tab} />
        <Tab label={"Per " + items[1].title} className={classes.tab} />
      </Tabs>
      {items[value].items.map((item, index) => (
        <Form.Row key={index}>
          <SmallText
            noWrap
            primary={Object.keys(item)[0]}
            style={{
              width: "80%",
            }}
          />
          <SmallText
            noWrap
            style={{
              width: "20%",
              textAlign: "right",
            }}
            primary={Object.values(item)[0]}
          />
        </Form.Row>
      ))}
    </>
  );
};

const CardComponent = ({ card }) => {
  return (
    <Card>
      <div>
        <Form.Row>
          <SubHeading primary={card.title} bold noWrap />
          {card.total && (
            <SmallText primary={"Total : " + card.total} bold noWrap />
          )}
        </Form.Row>
        {card.tabs ? (
          <TabsComponent items={card.items} />
        ) : (
          card.items.map((item, index) => (
            <Form.Row key={index}>
              <SmallText
                noWrap
                primary={Object.keys(item)[0]}
                style={{
                  width: "80%",
                }}
              />
              <SmallText
                noWrap
                style={{
                  width: "20%",
                  textAlign: "right",
                }}
                primary={Object.values(item)[0]}
              />
            </Form.Row>
          ))
        )}
      </div>
      <div style={{ display: "grid", placeItems: "center" }}>
        {card.path && (
          <Button
            to={card.path}
            text={card.text}
            fullWidth={false}
            component={NavLink}
          />
        )}
      </div>
    </Card>
  );
};

export default function Home(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  const [invoices, setInvoices] = useState("");
  const [deliveries, setDeliveries] = useState("");
  const [means, setMeans] = useState("");
  const [incidents, setIncidents] = useState("");

  const [invoiceArray, setInvoiceArray] = useState("");
  const [subSiteArray, setSubSiteArray] = useState([]);
  const [subClientArray, setSubClientArray] = useState([]);
  const [siteDeliveryArray, setSiteDeliveryArray] = useState([]);
  const [clientDeliveryArray, setClientDeliveryArray] = useState([]);
  const [siteMeanArray, setSiteMeanArray] = useState([]);
  const [clientMeanArray, setClientMeanArray] = useState([]);
  const [siteIncidentArray, setSiteIncidentArray] = useState([]);
  const [clientIncidentArray, setClientIncidentArray] = useState([]);
  const [siteCustomerRateArray, setSiteCustomerRateArray] = useState([]);
  const [clientCustomerRateArray, setClientCustomerRateArray] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    fetchDashboardData();
    fetchInvoices();
    fetchEndOfSubscriton();
    fetchDeliveries();
    fetchMeans();
    fetchIncident();
    fetchCustomerRate();
  }

  async function fetchDashboardData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}`,
      });
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
  async function fetchInvoices() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}/invoices`,
      });
      setInvoices(result.data);
      fetchInvoicesArray(result.data?.invoices);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function fetchDeliveries() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}/deliveries`,
      });
      setDeliveries(result.data);
      fetchDeliveriesArray(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function fetchMeans() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}/means`,
      });
      setMeans(result.data);
      fetchMeanArray(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function fetchIncident() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}/incidents`,
      });
      setIncidents(result.data);
      fetchIncidentArray(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function fetchEndOfSubscriton() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}/endOfSubscription`,
      });
      fetchEndOfSubscriptionArray(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function fetchCustomerRate() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.DASHBOARD}/customerRate`,
      });
      fetchCustomerRateArray(result.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function fetchIncidentArray(data) {
    const siteTemp = [];
    const clientTemp = [];
    let siteIncidentsTemp = data?.siteIncidents?.filter(
      (item, index) => item?.siteId?.name !== undefined,
    );

    siteIncidentsTemp && siteIncidentsTemp.map((item, index) => {
      return siteTemp.push({ [item?.siteId?.name]: item.count });
    });

    data?.clientIncidents?.map((item, index) => {
      return clientTemp.push({ [item.comapanyName]: item.count });
    });
    setSiteIncidentArray(siteTemp);
    setClientIncidentArray(clientTemp);
  }
  async function fetchMeanArray(data) {
    const siteTemp = [];
    const clientTemp = [];
    let siteMeanTemp =  data?.siteMean?.filter(
      (item, index) => item?.siteId?.name !== undefined,
    );
    siteMeanTemp && siteMeanTemp.map((item, index) => {
      return siteTemp.push({ [item?.siteId?.name]: item.count });
    });

    data?.clientMean?.map((item, index) => {
      return clientTemp.push({ [item.comapanyName]: item.count });
    });
    setSiteMeanArray(siteTemp);
    setClientMeanArray(clientTemp);
  }

  async function fetchDeliveriesArray(data) {
    const siteTemp = [];
    const clientTemp = [];
    let siteDeliveriesTemp =  data?.siteDeliveries?.filter(
      (item, index) => item?.siteId?.name !== undefined,
    );
    siteDeliveriesTemp &&  siteDeliveriesTemp.map((item, index) => {
      return siteTemp.push({ [item?.siteId?.name]: item.count });
    });

    data?.clientDeliveries?.map((item, index) => {
      return clientTemp.push({ [item.comapanyName]: item.count });
    });

    setSiteDeliveryArray(siteTemp);
    setClientDeliveryArray(clientTemp);
  }

  async function fetchEndOfSubscriptionArray(data) {
    const siteTemp = [];
    const clientTemp = [];
    let siteTempfill =  data?.site?.filter(
      (item, index) => item?.name !== undefined,
    );
    siteTempfill && siteTempfill.map((item, index) => {
      return siteTemp.push({ [item.name]: item.daysLeft });
    });

    data?.client.map((item, index) => {
      return clientTemp.push({ [item.comapanyName]: item.daysLeft });
    });
    setSubSiteArray(siteTemp);
    setSubClientArray(clientTemp);
  }
  async function fetchInvoicesArray(data) {
    const temp = [];
    let siteTempfill =  data?.filter(
      (item, index) => item?.siteId?.name !== undefined,
    );
    
    siteTempfill && siteTempfill.map((item, index) => {
      const invoiceObject = {
        [item?.siteId?.name]: item.totalAmount,
      };
      return temp.push(invoiceObject);
    });
    setInvoiceArray(temp);
  }
  async function fetchCustomerRateArray(data) {
    const siteTemp = [];
    const clientTemp = [];
    let clientTempfill =  data?.clientPerSite?.filter(
      (item, index) => item?.comapanyName !== undefined,
    );
    clientTempfill && clientTempfill.map((item, index) => {
      return siteTemp.push({ [item.comapanyName]: item.amount });
    });

    data?.masterClient.map((item, index) => {
      return clientTemp.push({ [item.comapanyName]: item.amount });
    });
    setSiteCustomerRateArray(siteTemp);
    setClientCustomerRateArray(clientTemp);
  }
  let renderArray = [
    {
      multiple: true,
      items: [
        {
          title: "CLIENTS",
          tabs: false,
          total: data && data?.clients?.total,
          path: "/clients",
          text: "Clients list",
          items: [
            { "Delivery Module": data && data?.clients.delivery },
            { "Lockers module": data && data?.clients.lockers },
          ],
        },
        {
          title: "INVOICE",
          total: invoices && invoices.total,
          tabs: false,
          path: "/invoices",
          text: "Invoices list",
          items: [...invoiceArray],
        },
      ],
      cols: 4,
    },
    {
      title: "DELIVERIES",
      total: deliveries && deliveries.total,
      tabs: true,
      items: [
        {
          title: "site",
          items: siteDeliveryArray,
        },
        {
          title: "client",
          items: clientDeliveryArray,
        },
      ],
      cols: 4,
    },
    {
      title: "INCIDENTS",
      total: incidents && incidents.total,
      tabs: true,
      items: [
        {
          title: "site",
          items: siteIncidentArray,
        },
        {
          title: "client",
          items: clientIncidentArray,
        },
      ],
      cols: 4,
    },
    {
      title: "MEANS",
      total: means && means.total,
      tabs: true,
      items: [
        {
          title: "site",
          items: siteMeanArray,
        },
        {
          title: "client",
          items: clientMeanArray,
        },
      ],
      cols: 4,
    },
    {
      title: "END OF SUBSCRIPTION",
      total: null,
      tabs: true,
      items: [
        {
          title: "site",
          items: subSiteArray,
        },
        {
          title: "client",
          items: subClientArray,
        },
      ],
      cols: 4,
    },
    {
      title: "TARIFICATION CLIENTS",
      total: null,
      tabs: true,
      items: [
        {
          title: "site",
          items: siteCustomerRateArray,
        },
        {
          title: "client",
          items: clientCustomerRateArray,
        },
      ],
      cols: 4,
    },
  ];

  return (
    <div className={classes.root}>
      {loading && ""}
      <Heading primary="DASHBOARD" />
      <div className={classes.content}>
        <Grid container spacing={2}>
          {renderArray.map((card, index) =>
            card.multiple ? (
              <Grid item container xs={12} sm={6} md={3} key={index}>
                {card.items.map((item, indexItem) => (
                  <Grid
                    item
                    xs={12}
                    key={indexItem}
                    style={{
                      marginBottom: card.items.length > indexItem + 1 ? 20 : 0,
                    }}
                  >
                    <CardComponent card={item} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <CardComponent card={card} />
              </Grid>
            ),
          )}
        </Grid>
      </div>
    </div>
  );
}

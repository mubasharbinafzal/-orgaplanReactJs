import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import { ReactComponent as BackArrow } from "../../../assets/icons/BackArrow.svg";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
  },
}));

export default function AddInvoice(props) {
  // console.log("props", props);
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [sites, setSites] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState(props.location.clientId);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [siteId, setSiteId] = useState("");
  const [amount, setAmount] = useState(0);
  const [pdf, setPdf] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [logo, setLogo] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    clientId && clientId !== "ALL" && fetchSitesByClient();
    setSiteId("");
    // eslint-disable-next-line
  }, [clientId]);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}`,
        token: store.token,
      });
      let itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.companyId.name,
      }));
      setClients(itemsArray);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function fetchSitesByClient() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITES_BY_CLIENT}/${clientId}`,
        token: store.token,
      });
      let itemsArray = result.data.items.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setSites(itemsArray);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handlePdfChange = (e) => {
    if (e.target.files.length) {
      let file = e.target.files[0];
      const uri = URL.createObjectURL(file);
      if (file.size > 15000000) {
        return dispatch(
          Actions.notistack.enqueueSnackbar(
            Actions.notistack.snackbar(
              `File is large,Max size can be 15 MB`,
              "error",
            ),
          ),
        );
      }

      setPdfFile(file);
      setPdfFileName(file.name);
      setPdfUri(uri);
    }
  };

  const handleChange = (name, value) => {
    if (name === "clientId") setClientId(value);
    else if (name === "startDate") {
      setEndDate("");
      setStartDate(value);
    } else if (name === "endDate") setEndDate(value);
    else if (name === "siteId") setSiteId(value);
    else if (name === "amount") setAmount(value);
    else if (name === "description") setDescription(value);
  };
  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);
      // test formdata
      var formdata = new FormData();
      formdata.append("clientId", clientId);
      formdata.append("startDate", startDate);
      formdata.append("endDate", endDate);
      formdata.append("siteId", siteId);
      formdata.append("amount", amount);
      formdata.append("description", description);
      formdata.append("file", pdfFile);
      // for (let [key, value] of formdata) {
      //   console.log(`formdatais in add site step 2 ${key}: ${value}`);
      // }
      // end test

      // const formdata = JSON.stringify({
      //   clientId: clientId,
      //   startDate: startDate,
      //   endDate: endDate,
      //   siteId: siteId,
      //   amount: amount,
      //   description: description,
      //   file: pdfFile,
      // });

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.INVOICES,
        headers: {
          Authorization: store.token,
        },
        token: store.token,
        body: formdata,
      });
      setLoading(false);
      props.history.goBack();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={() => props.history.goBack()}>
        <BackArrow style={{ width: 30, height: 30 }} />
      </IconButton>
      <Heading primary="ADD AN INVOICE" />
      <div className={classes.content}>
        <Form.Form onSubmit={onSubmit}>
          <Form.Row>
            <FormLabel bold primary="CLIENT NAME* :" />
            <FormSelect
              name="clientId"
              values={clients}
              value={clientId}
              // error={clientId}
              placeholder="Select Client"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row>
            <FormLabel bold primary="INVOICE DATES* : " />
            <Form.Row noMargin width="48%">
              <FormInput
                type="date"
                name="startDate"
                value={startDate}
                // error={startDate}
                placeholder="Start date"
                style={GLOBALS.Styles.inputWidth}
                min={moment().format("YYYY-MM-DD")}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
              <FormInput
                type="date"
                name="endDate"
                value={endDate}
                // error={endDate}
                placeholder="End date"
                disabled={!startDate}
                min={moment(startDate).add(1, "days").format("YYYY-MM-DD")}
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="CONSTRUCTION SITE*:" />
            <FormSelect
              name="siteId"
              value={siteId}
              values={sites}
              // error={siteId}
              placeholder="Select Site"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="AMOUNT*:" />
            <FormInput
              type="number"
              name="amount"
              value={amount}
              // error={amount}
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                value >= 0 && handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="PDF File:" />
            <div style={GLOBALS.Styles.pdffile}>
              <Button
                fullWidth={false}
                // disabled={isLoading}
                text={"Upload PDF"}
                onClick={() =>
                  document.getElementById("upload-canvas-pdf-button").click()
                }
              />
              <input
                hidden
                type="file"
                accept="application/pdf"
                id="upload-canvas-pdf-button"
                onChange={(e) => handlePdfChange(e)}
              />
              <p className="m-2">{pdfFileName && pdfFileName}</p>
            </div>
            {/* <input
              type="file"
              name="pdf"
              accept="application/pdf"
              onChange={(e) => handlePdfChange(e)}
            /> */}
          </Form.Row>
          <Form.Row alignItems="flex-start">
            <FormLabel bold primary="DESCRIPTION:" />
            <FormInput
              textArea
              rows={3}
              name="description"
              value={description}
              // error={description}
              placeholder="Description"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
          <Form.ButtonContainer>
            <Button
              type="submit"
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              loading={loading}
              disabled={
                loading ||
                !clientId ||
                !startDate ||
                !endDate ||
                !siteId ||
                Number(amount) <= 0
              }
            />
          </Form.ButtonContainer>
        </Form.Form>
      </div>
    </div>
  );
}

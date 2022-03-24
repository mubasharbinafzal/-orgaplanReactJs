import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Button from "../../../components/Button";
import SmallText from "../../../components/SmallText";
import FormInput from "../../../components/FormInput";
import FormLabel from "../../../components/FormLabel";
import FormSelect from "../../../components/FormSelect";
import RadioButton from "../../../components/RadioButton";
import MultiAdderInput from "../../../components/MultiAdderInput";
import FormMultipleUpload from "../../../components/FormMultipleUpload";
import MultiAdderInputModal from "../../../components/MultiAdderInputModal";

export default function AddSiteStep1(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [zacs, setZacs] = useState([]);
  const [clients, setClients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [clientName, setClientName] = useState("");
  const [update, setUpdate] = useState(false);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState([]);
  const [zacId, setZacId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [functionality, setFunctionality] = useState("DELIVERY");
  const [addresses, setAddresses] = useState([]);
  const [trades, setTrades] = useState([]);
  const [penaltyforLateDelivery, setPenaltyforLateDelivery] = useState("");
  const [penaltyforUnexpDelivery, setPenaltyforUnexpDelivery] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    clients.map((client) =>
      client.adminIds.map(
        (admin) =>
          admin._id === adminId && setClientName(client.companyId.name),
      ),
    );
  }, [clients, adminId]);

  async function fetchData() {
    try {
      const zacsResult = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ZACS}`,
      });
      const clientsResult = await GLOBALS.API({
        uri: `${GLOBALS.Constants.CLIENTS}`,
      });
      const zacsArray = zacsResult.data.items.map((zac) => ({
        value: zac._id,
        label: zac.name,
      }));
      const adminsArray = [];
      clientsResult.data.items.map((client) => {
        client.adminIds.map((admin) =>
          adminsArray.push({
            value: admin._id,
            label: `${admin.firstName} ${admin.lastName}`,
          }),
        );
        return true;
      });
      setZacs(zacsArray);
      setAdmins(adminsArray);
      setClients(clientsResult.data.items);
      setAdminId(store.user._id);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "name") setName(value);
    else if (name === "logo") setLogo(value);
    else if (name === "zacId") setZacId(value);
    else if (name === "adminId") setAdminId(value);
    else if (name === "functionality") setFunctionality(value);
    else if (name === "addresses") {
      setUpdate((st) => !st);
      setAddresses(value);
    } else if (name === "trades") setTrades(value);
    else if (name === "penaltyforLateDelivery")
      setPenaltyforLateDelivery(value);
    else if (name === "penaltyforUnexpDelivery")
      setPenaltyforUnexpDelivery(value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const values = {
      name,
      logo,
      zacId,
      adminId,
      functionality,
      addresses,
      trades,
      penaltyforLateDelivery,
      penaltyforUnexpDelivery,
    };
    props.setStep1Data(values);
    props.setStep(2);
  }

  return (
    <>
      <Form.Form onSubmit={onSubmit}>
        <Form.Row>
          <FormLabel bold primary="SITE NAME* :" />
          <FormInput
            name="name"
            value={name}
            maxLength="50"
            placeholder="Site name"
            style={GLOBALS.Styles.inputWidth}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
          />
        </Form.Row>
        {update && ""}
        <Form.Row>
          <FormLabel bold primary="SITE PICTURE : " />
          <FormMultipleUpload
            name="logo"
            values={logo}
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => handleChange("profile", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="ZAC OF THE SITE : " />
          <Form.Row width="48%" noMargin>
            <FormSelect
              name="zacId"
              values={zacs}
              value={zacId}
              placeholder="Select a ZAC"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="SITE RESPONSIBLE* :" />
          <Form.Row
            noMargin
            width="48%"
            alignItems="center"
            justifyContent="flex-start"
          >
            <FormSelect
              name="adminId"
              value={adminId}
              values={admins}
              disabled={true}
              placeholder="Admin"
              style={GLOBALS.Styles.inputWidth}
              onChange={({ target: { name, value } }) =>
                handleChange(name, value)
              }
            />
            <SmallText
              noMargin
              primary={clientName}
              style={{ marginLeft: 20 }}
            />
          </Form.Row>
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="AVAILABLE FUNCTIONALITY : " />
          <RadioButton
            name="functionality"
            value={functionality}
            style={GLOBALS.Styles.inputWidth}
            items={[{ value: "DELIVERY", label: "Delivery module" }]}
            onChange={({ target: { name, value } }) =>
              handleChange(name, value)
            }
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="SITE ADDRESS(ES)* : " />
          <MultiAdderInputModal
            name="addresses"
            values={addresses}
            style={GLOBALS.Styles.inputWidth}
            placeholder="Enter site addresses"
            onChange={(values) => handleChange("addresses", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="TRADES : " />
          <MultiAdderInput
            name="trades"
            values={trades}
            placeholder="Enter trades"
            style={GLOBALS.Styles.inputWidth}
            onChange={(values) => handleChange("trades", values)}
          />
        </Form.Row>
        <Form.Row>
          <FormLabel bold primary="COST OF DELIVERY PENALITIES: " />
          <Form.Row width="48%" noMargin>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder="Delay"
                name="penaltyforLateDelivery"
                value={penaltyforLateDelivery}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText noMargin style={{ marginLeft: 10 }} primary="€" />
            </Form.Row>
            <Form.Row width="48%" noMargin alignItems="center">
              <FormInput
                type="number"
                placeholder="Unexp delivery"
                name="penaltyforUnexpDelivery"
                value={penaltyforUnexpDelivery}
                onChange={({ target: { name, value } }) =>
                  value >= 0 && handleChange(name, value)
                }
              />
              <SmallText noMargin style={{ marginLeft: 10 }} primary="€" />
            </Form.Row>
          </Form.Row>
        </Form.Row>
        <Form.ButtonContainer>
          <Button
            type="submit"
            minWidth={200}
            text="VALIDATE"
            fullWidth={false}
            loading={loading}
            disabled={loading || !name || !adminId || addresses.length === 0}
          />
        </Form.ButtonContainer>
      </Form.Form>
    </>
  );
}

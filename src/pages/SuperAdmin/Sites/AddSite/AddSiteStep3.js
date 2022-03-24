import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

import GLOBALS from "../../../../globals";
import Actions from "../../../../redux/actions";

import Form from "../../../../components/Form";
import Modal from "../../../../components/Modal";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import FormLabel from "../../../../components/FormLabel";
import FormInput from "../../../../components/FormInput";
import FormSelect from "../../../../components/FormSelect";
import SmallButton from "../../../../components/SmallButton";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 15,
    marginTop: 10,
    width: "100%",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const levelNumberList = [
  { value: -10, label: -10 },
  { value: -9, label: -9 },
  { value: -8, label: -8 },
  { value: -7, label: -7 },
  { value: -6, label: -6 },
  { value: -5, label: -5 },
  { value: -4, label: -4 },
  { value: -3, label: -3 },
  { value: -2, label: -2 },
  { value: -1, label: -1 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
];

export default function AddSiteStep3(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [site, setSite] = useState();
  const [siteId, setSiteId] = useState();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [levelModal, setLevelModal] = useState(false);
  const [buildingModal, setBuildingModal] = useState(false);

  const [buildings, setBuildings] = useState([]);
  const [activeBuilding, setActiveBuilding] = useState("");

  const [levelNumber, setLevelNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [props]);

  async function fetchData() {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.SITE_GET}/${props.step2Data.data._id}`,
        token: store.token,
      });
      setSiteId(props.step2Data.data._id);
      setSite(response.data);

      setLoading(false);
      setUpdate((st) => !st);
      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onAddExteriorImage(file) {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("siteId", siteId);

      // FormData Creation
      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMIN_PIC_PDF,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      setSite(response.data);

      setLoading(false);
      setUpdate((st) => !st);
      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onCreateBuilding() {
    try {
      setLoading(true);
      const color = GLOBALS.Functions.randomColor();
      const formdata = JSON.stringify({
        name: buildingName,
        siteId: siteId,
        color,
      });

      // JSON.stringify Creation
      const response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.BUILDINGS,
        token: store.token,
        body: formdata,
      });

      const buildingsArray = buildings;
      buildingsArray.push(response.data);
      setBuildings(buildingsArray);

      setBuildingModal((st) => !st);
      setLoading(false);
      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onCreateLevel() {
    try {
      setLoading(true);

      // FormData Creation
      const formdata = JSON.stringify({
        number: levelNumber,
        building: activeBuilding._id,
      });

      const response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.LEVELS,
        token: store.token,
        body: formdata,
      });

      const activeBuildingObj = activeBuilding;
      activeBuildingObj.levels.push(response.data);
      setActiveBuilding(activeBuildingObj);

      setLoading(false);
      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  async function onAddLevelImage(levelId, file, index) {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("levelId", levelId);

      // FormData Creation
      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMIN_PIC_PDF,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      const activeBuildingObj = activeBuilding;
      activeBuildingObj.levels[index].plan = response.data.plan;
      setActiveBuilding(activeBuildingObj);

      setLoading(false);
      setUpdate((st) => !st);
      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }
  function handleChange(name, value) {
    if (name === "buildingName") setBuildingName(value);
    else if (name === "levelNumber") setLevelNumber(value);
  }
  function resetStates() {
    setBuildingName("");
    setLevelNumber("");
  }

  // Rendering
  const buildingRows = buildings.map((building) => [
    building.name,
    building.levels.length,
    <Form.Row style={{ justifyContent: "center" }}>
      <SmallButton
        text="Modify"
        onClick={() => {
          setActiveBuilding(building);
          setLevelModal((st) => !st);
        }}
        color={theme.palette.primary.contrastText}
        style={{
          marginLeft: 10,
          borderRadius: 4,
        }}
      />
    </Form.Row>,
  ]);
  const levelRows = [];
  activeBuilding?.levels?.map((level, index) =>
    levelRows.push([
      level.number === 0 ? "RDC" : level.number,
      level.plan,
      <Form.Row style={{ justifyContent: "center" }}>
        <SmallButton
          text="Add Plan"
          disabled={loading}
          color={theme.palette.primary.contrastText}
          onClick={() => {
            if (level.plan) {
              if (
                window.confirm("Are you sure? The current file will be deleted")
              ) {
                document.getElementById(`fileinput${index}`).click();
              }
            } else {
              document.getElementById(`fileinput${index}`).click();
            }
          }}
          style={{
            marginLeft: 10,
            borderRadius: 4,
          }}
        />
        <input
          hidden
          type="file"
          id={`fileinput${index}`}
          onChange={(e) => {
            const file = e.target.files[0];
            if (
              file &&
              file.size <= GLOBALS.Constants.FILE_SIZE &&
              file.type === "application/pdf"
            ) {
              onAddLevelImage(level._id, file, index);
              e.target.value = "";
            } else {
              dispatch(
                Actions.notistack.enqueueSnackbar(
                  Actions.notistack.snackbar(
                    "Max size can be 10MB of type: PDF",
                    "error",
                  ),
                ),
              );
            }
          }}
        />
      </Form.Row>,
    ]),
  );

  return (
    <>
      <div>
        <Form.Row justifyContent="flex-start">
          <Button
            maxWidth="30%"
            text="Create a Building"
            style={{ marginRight: 20 }}
            color={theme.palette.common.black}
            onClick={() => setBuildingModal((st) => !st)}
          />
        </Form.Row>
        <div className={classes.content}>
          <Form.Row alignItems="center">
            <Form.Row
              width="80%"
              alignItems="center"
              justifyContent="flex-start"
            >
              <FormLabel bold primary="Exterior: " />
              &nbsp;
              <FormLabel primary={site?.plan} />
            </Form.Row>
            <Form.Row width="20%" alignItems="center" justifyContent="flex-end">
              <SmallButton
                text="Add Plan"
                disabled={loading}
                color={theme.palette.primary.contrastText}
                onClick={() => {
                  if (site.plan) {
                    if (
                      window.confirm(
                        "Are you sure? The current file will be deleted",
                      )
                    ) {
                      document.getElementById(`fileinput-exterior`).click();
                    }
                  } else {
                    document.getElementById(`fileinput-exterior`).click();
                  }
                }}
                style={{
                  marginLeft: 10,
                  borderRadius: 4,
                }}
              />
              <input
                hidden
                type="file"
                id={`fileinput-exterior`}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (
                    file &&
                    file.size <= GLOBALS.Constants.FILE_SIZE &&
                    file.type === "application/pdf"
                  ) {
                    onAddExteriorImage(file);
                    e.target.value = "";
                  } else {
                    dispatch(
                      Actions.notistack.enqueueSnackbar(
                        Actions.notistack.snackbar(
                          "Max size can be 10MB of type: PDF",
                          "error",
                        ),
                      ),
                    );
                  }
                }}
              />
            </Form.Row>
          </Form.Row>
          <Table
            rows={buildingRows}
            headers={GLOBALS.Data.buildings.headings}
          />
        </div>
        <Form.ButtonContainer>
          <Button
            minWidth={200}
            text="COMPLETE"
            fullWidth={false}
            onClick={() => props.history.replace("/sites")}
          />
        </Form.ButtonContainer>
      </div>
      {update && ""}
      {/* Create a building */}
      <Modal
        open={buildingModal}
        title="Create a building"
        onClose={() => setBuildingModal((st) => !st)}
        body={
          <Form.Form>
            <Form.Row>
              <Form.Row noMargin>
                <FormLabel noMargin bold primary="Building Name" />
              </Form.Row>
              <FormInput
                name="buildingName"
                value={buildingName}
                maxLength="30"
                placeholder="Building Name"
                style={GLOBALS.Styles.inputWidth}
                onChange={({ target: { name, value } }) =>
                  handleChange(name, value)
                }
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
                onClick={onCreateBuilding}
                disabled={loading || !buildingName}
              />
            </Form.Row>
          </Form.Form>
        }
      />
      {/* Create a level */}
      <Modal
        open={levelModal}
        title={
          activeBuilding.name === "Exterior" ? "Site Plan" : "Create a level"
        }
        onClose={() => setLevelModal((st) => !st)}
        body={
          activeBuilding.name === "Exterior" ? (
            <>
              <div className={classes.content}>
                <Table rows={levelRows} headers={["Plan", "Action"]} />
              </div>
            </>
          ) : (
            <>
              <Form.Form>
                <Form.Row alignItems="center">
                  <Form.Row noMargin>
                    <FormLabel noMargin bold primary="Level Name" />
                  </Form.Row>
                  {activeBuilding && (
                    <FormInput
                      name="levelNumber"
                      value={levelNumber}
                      placeholder="Level Name"
                      style={GLOBALS.Styles.inputWidth}
                      onChange={({ target: { name, value } }) =>
                        handleChange(name, value)
                      }
                    />
                    // <FormSelect
                    //   name="levelNumber"
                    //   value={levelNumber}
                    //   // error={levelNumber}
                    //   style={GLOBALS.Styles.inputWidth}
                    //   onChange={({ target: { name, value } }) =>
                    //     handleChange(name, value)
                    //   }
                    //   values={levelNumberList.filter(
                    //     (item) =>
                    //       !activeBuilding.levels.some(
                    //         (item2) => item2.number === item.value,
                    //       ),
                    //   )}
                    // />
                  )}
                </Form.Row>
                <Form.Row justifyContent="center">
                  <Button
                    minWidth={200}
                    text="VALIDATE"
                    fullWidth={false}
                    onClick={onCreateLevel}
                    disabled={loading || !levelNumber}
                  />
                </Form.Row>
              </Form.Form>
              <Divider />
              <FormLabel
                bold
                noMargin
                primary={`Building: ${activeBuilding.name}`}
              />
              <Divider />
              <div className={classes.content}>
                <Table
                  rows={levelRows}
                  headers={GLOBALS.Data.levels.headings}
                />
              </div>
            </>
          )
        }
      />
    </>
  );
}

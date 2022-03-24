import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import _ from "lodash";
import FullScreenModal from "../../../components/FullScreenModal";
import moment from "moment";
import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";
import { jsPDF } from "jspdf";
import Form from "../../../components/Form";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import FormLabel from "../../../components/FormLabel";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import SmallButton from "../../../components/SmallButton";

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

let propsShapesCon = [];
let propsShapeCon = "";
export default function AddSiteStep3(props) {
  const { setSelectedShape } = props;

  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const storeAdmin = useSelector((state) => state.admin);

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const [levelNumber, setLevelNumber] = useState("");
  const [histories, setHistories] = useState("");

  const [buildingName, setBuildingName] = useState("");
  const [activeBuilding, setActiveBuilding] = useState("");

  const [extraBuildings, setExtraBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  useEffect(() => {
    if (props.selectedShape) {
      setActiveBuilding(props.selectedShape.building);
      setLoading(false);
    } else {
      setLoading(false);
    }
    propsShapesCon = _.cloneDeep(props.shapes);
    propsShapeCon = props.shape
      ? _.cloneDeep(props.shape)
      : _.cloneDeep(props.selectedShape);
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.BUILDINGS_BY_SITE}/${storeAdmin.site.siteId._id}`,
      });
      setExtraBuildings(
        response.data.items.filter(
          (item) =>
            item.buildingType !== "EXTERIOR" &&
            !props.shapes.some((item2) => item2._id === item._id),
        ),
      );
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const handleChange = (name, value) => {
    if (name === "buildingName") setBuildingName(value);
    else if (name === "levelNumber") setLevelNumber(value);
  };

  const resetStates = () => {
    setBuildingName("");
    setLevelNumber("");
  };

  const onCreateBuilding = async () => {
    try {
      setLoading(true);
      let color;
      if (props.selectedShape) color = props.selectedShape.building.color;
      // else color = GLOBALS.Functions.randomColor();
      else color = "white";

      const formdata = JSON.stringify({
        name: buildingName,
        siteId: storeAdmin.site.siteId._id,
        color,
      });

      // JSON.stringify Creation
      const response = await GLOBALS.API({
        method: props.selectedShape ? "PUT" : "POST",
        uri: props.selectedShape
          ? `${GLOBALS.Constants.BUILDINGS}/${props.selectedShape._id}`
          : GLOBALS.Constants.BUILDINGS,
        token: store.token,
        body: formdata,
      });

      setActiveBuilding(response.data);
      resetStates();

      let propShapes = _.cloneDeep(propsShapesCon);
      let propShape = _.cloneDeep(propsShapeCon);

      let inde = propShapes.findIndex((item) => item._id === propShape._id);

      propShapes[inde]._id = response.data._id;
      propShape._id = response.data._id;
      propShapes[inde].name = buildingName;
      propShape.name = buildingName;
      propShapes[inde].color = color;
      propShape.color = color;
      propShapes[inde].building = response.data;
      propShape.building = response.data;
      propShapes[inde].levels = [];
      propShape.levels = [];

      if (!props.selectedShape) {
        await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.ADMIN_PIC_SHAPE,
          token: store.token,
          body: JSON.stringify({
            picId: props.pic._id,
            building: response.data._id,
            ...propShape,
          }),
        });
      }
      setLoading(false);

      propsShapesCon = _.cloneDeep(propShapes);
      propsShapeCon = _.cloneDeep(propShape);

      props.setShapes(propShapes, propShape, true);
      setSelectedShape("");
      props.setSelectedShape("")
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const onCreateLevel = async () => {
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

      let propShapes = _.cloneDeep(propsShapesCon);
      let propShape = _.cloneDeep(propsShapeCon);

      let inde = propShapes.findIndex((item) => item._id === propShape._id);

      propShapes[inde].levels = activeBuildingObj.levels;
      propShape.levels = activeBuildingObj.levels;

      propsShapesCon = _.cloneDeep(propShapes);
      propsShapeCon = _.cloneDeep(propShape);

      props.setShapes(propShapes, propShape, true);

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
  };

  const fetchHistoryPdf = (levelId) => {
    let findLevel = activeBuilding.levels.find((dt) => dt._id === levelId);
    return findLevel.plan;
  };
  const onAddLevelImage = async (levelId, file, index) => {
    try {
      let plan = fetchHistoryPdf(levelId);
      setLoading(true);
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("levelId", levelId);
      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMIN_PIC_PDF,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      if (plan) {
        await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.HistoryOfPlan,
          token: store.token,
          body: JSON.stringify({
            name: plan,
            siteId: storeAdmin.site.siteId._id,
            LevelId: levelId,
            BuildingId: props.selectedShape.building._id,
          }),
        });
      }

      const activeBuildingObj = activeBuilding;
      activeBuildingObj.levels[index].plan = response.data.plan;

      setActiveBuilding(activeBuildingObj);
      setLoading(false);
      setUpdate((st) => !st);

      let propShapes = _.cloneDeep(propsShapesCon);
      let propShape = _.cloneDeep(propsShapeCon);

      let inde = propShapes.findIndex((item) => item._id === propShape._id);

      propShapes[inde].levels = activeBuildingObj.levels;
      propShape.levels = activeBuildingObj.levels;

      propsShapesCon = _.cloneDeep(propShapes);
      propsShapeCon = _.cloneDeep(propShape);

      props.setShapes(propShapes, propShape, true);

      resetStates();
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const getHistoryPlan = async (level) => {
    try {
      let response = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.GetHistoryOfPlans,
        token: store.token,
        body: JSON.stringify({
          siteId: storeAdmin.site.siteId._id,
          LevelId: level._id,
          BuildingId: level.building,
        }),
      });
      setHistories(response.data);
      setModal(true);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const addExistingBuilding = async () => {
    try {
      setLoading(true);
      let color;
      if (props.selectedShape) color = props.selectedShape.building.color;
      else color = GLOBALS.Functions.randomColor();

      let buildi = extraBuildings.find((buil) => buil._id === selectedBuilding);
      setActiveBuilding(buildi);
      resetStates();

      let propShapes = _.cloneDeep(propsShapesCon);
      let propShape = _.cloneDeep(propsShapeCon);

      let inde = propShapes.findIndex((item) => item._id === propShape._id);

      propShapes[inde]._id = buildi._id;
      propShape._id = buildi._id;
      propShapes[inde].name = buildingName;
      propShape.name = buildingName;
      propShapes[inde].color = color;
      propShape.color = color;
      propShapes[inde].building = buildi;
      propShape.building = buildi;
      propShapes[inde].levels = [];
      propShape.levels = [];

      if (!props.selectedShape) {
        await GLOBALS.API({
          method: "POST",
          uri: GLOBALS.Constants.ADMIN_PIC_SHAPE,
          token: store.token,
          body: JSON.stringify({
            picId: props.pic._id,
            building: buildi._id,
            ...propShape,
          }),
        });
      }
      setLoading(false);

      propsShapesCon = _.cloneDeep(propShapes);
      propsShapeCon = _.cloneDeep(propShape);

      props.setShapes(propShapes, propShape, true);
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const levelRows = [];
  activeBuilding.levels?.map((level, index) =>
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
          accept="application/pdf"
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
        <SmallButton
          text="Historique des plans"
          disabled={loading}
          color={theme.palette.primary.contrastText}
          onClick={() => {
            if (level) {
              
              getHistoryPlan(level);
            } else {
              alert("Please add a level");
            }
          }}
          style={{
            marginLeft: 10,
            borderRadius: 4,
          }}
        />
      </Form.Row>,
    ]),
  );
  const historyRows = [];
  histories &&
    histories?.map((level, index) => {
      historyRows.push([
        level.name,
        moment(level.createdAt).format("DD/MM/YYYY"),
        <Form.Row style={{ justifyContent: "center" }}>
          <SmallButton
            text="Download"
            disabled={level.name ? false : true}
            color={theme.palette.primary.contrastText}
            onClick={async () => {
              let fileName = level.name;
              var url = GLOBALS.Constants.BASE_URL + fileName;
              var req = new XMLHttpRequest();
              req.open("GET", url, true);
              req.responseType = "blob";
              req.onload = function () {
                var blob = new Blob([req.response], {
                  type: "application/octetstream",
                });
                var isIE = false || !!document.documentMode;
                if (isIE) {
                  window.navigator.msSaveBlob(blob, fileName);
                } else {
                  var url = window.URL || window.webkitURL;
                  let link = url.createObjectURL(blob);

                  var a = document.createElement("a");
                  a.setAttribute("download", fileName);
                  a.setAttribute("href", link);
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              };
              req.send();
            }}
            style={{
              marginLeft: 10,
              borderRadius: 4,
            }}
          />
        </Form.Row>,
      ]);
    });

  return (
    <div>
      <FullScreenModal
        title={`Historique des plans`}
        open={modal}
        onClose={() => {
          setModal((st) => !st);
        }}
        body={
          <Table
            rows={historyRows}
            headers={GLOBALS.Data.pdfHistory.headings}
          />
        }
      />
      {!activeBuilding && (
        <Form.Form>
          <Form.Row justifyContent="center">
            <FormLabel noMargin bold primary="Select a Building" />
          </Form.Row>
          <Form.Row>
            <Form.Row noMargin>
              <FormLabel noMargin bold primary="Building" />
            </Form.Row>
            <FormSelect
              name="buildingName"
              value={selectedBuilding}
              placeholder="Building Name"
              style={GLOBALS.Styles.inputWidth}
              onChange={async ({ target: { value } }) =>
                setSelectedBuilding(value)
              }
              values={extraBuildings.map((buil) => ({
                label: buil.name,
                value: buil._id,
              }))}
            />
          </Form.Row>
          <Form.Row justifyContent="center">
            <Button
              minWidth={200}
              text="VALIDATE"
              fullWidth={false}
              onClick={addExistingBuilding}
              disabled={loading || !selectedBuilding}
            />
          </Form.Row>
          <Form.Row justifyContent="center">
            <FormLabel noMargin bold primary="OR Create a building" />
          </Form.Row>
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
      )}
      {activeBuilding && (
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
                //   placeholder="Level Number"
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
            <Table rows={levelRows} headers={GLOBALS.Data.levels.headings} />
          </div>
        </>
      )}
      {update && ""}
    </div>
  );
}

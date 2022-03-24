import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import _ from "lodash";
import moment from "moment";
import Mean from "./Mean";
import Building from "./Building";
import GLOBALS from "../../../globals";
import StorageArea from "./StorageArea";
import DeliveryArea from "./DeliveryArea";
import Form from "../../../components/Form";
import Actions from "../../../redux/actions";
import Canvas from "../../../components/Canvas";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import FullScreenModal from "../../../components/FullScreenModal";
import { ReactComponent as Cross } from "../../../assets/icons/Cross.svg";
import { ReactComponent as Pencil } from "../../../assets/icons/Pencil.svg";
import { ReactComponent as Calendar } from "../../../assets/icons/Calendar.svg";
// "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
// import { ReactComponent as PICIcon } from "../../../assets/icons/PICIcon.svg";

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
  canvasRow: {
    height: "735px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoDrawerContainer: {
    width: "20%",
    height: "100%",
    marginRight: "12px",
  },
  infoDrawer: {
    width: "100%",
    height: "80%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  infoDrawer3: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  infoDrawer2: {
    marginTop: "20px",
    display: "flex",

    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
}));

let selectedShapeReserver;
const PicCanvas = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  const SITE_ID = adminStore.site.siteId._id;

  const [sitePic, setSitePic] = useState("");
  const [levelPic, setlevelPic] = useState("");
  const [loading, setLoading] = useState(true);

  const [shape, setShape] = useState("");
  const [rendering, setRendering] = useState("");

  const [shapes, setShapes] = useState([]);
  const [pdf, setPdf] = useState(undefined);
  const [modal, setModal] = useState(false);
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedBuilding, setselectedBuilding] = useState("");

  const [level, setLevel] = useState("");
  const [allLeves, setAllLevels] = useState([]);
  const [levelsDropdown, setLevelsDropdown] = useState([]);
  useEffect(() => {
    if (level) {
      fetchLevelPic(level);
    } else {
      fetchSitePic();
    }
    // eslint-disable-next-line
  }, [adminStore, rendering, level]);

  const expiredShapes = (shapes) => {
    let array = [];

    shapes.map((sp) => {
      if (sp.storageArea && Object.keys(sp.storageArea).length > 0) {
        let isExist = sp?.storageArea?.availability?.end;
        if (isExist) {
          let check = moment(isExist).isSame(new Date(), "day");
          if (check == false) {
            array.push(sp);
          }
        }
      } else if (sp.mean && Object.keys(sp.mean).length > 0) {
        let isExist = sp?.mean?.availability?.end;
        if (isExist) {
          let check = moment(isExist).isSame(new Date(), "day");
          if (check == false) {
            array.push(sp);
          }
        }
      } else if (sp.deliveryArea && Object.keys(sp.deliveryArea).length > 0) {
        let isExist = sp?.deliveryArea?.availability?.end;
        if (isExist) {
          let check = Date.now() > new Date(isExist);
          if (check == false) {
            array.push(sp);
          }
        }
      } else if (sp.building && Object.keys(sp.building).length > 0) {
        array.push(sp);
      }
    });

    return array;
  };
  const handleColorAndNameOfShape = (shape) => {
    if (shape.deliveryArea && Object.keys(shape?.deliveryArea).length > 0) {
      shape.name = shape?.deliveryArea.name;
      shape.color = shape.deliveryArea.color;
    } else if (
      shape.storageArea &&
      Object.keys(shape?.storageArea).length > 0
    ) {
      shape.name = shape.storageArea.name;
      shape.color = shape.storageArea.color;
    } else if (shape.building && Object.keys(shape?.building).length > 0) {
      shape.name = shape.building.name;
      shape.color = shape.building.color;
    } else if (shape.mean && Object.keys(shape?.mean).length > 0) {
      if (shape.mean.image) {
        shape.image = shape.mean.image;
      } else {
        shape.color = shape.mean.color;
      }
    }
  };

  const fetchSitePic = async () => {
    try {
      setPdf(
        adminStore.site.siteId?.plan
          ? GLOBALS.Constants.BASE_URL + adminStore.site.siteId?.plan
          : undefined,
      );
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_PIC_BY_SITE}/${adminStore.site.siteId._id}`,
        token: store.token,
      });

      let shapes = response.data.shapes;
      let newShapes = expiredShapes(shapes);

      if (newShapes) {
        newShapes.map((st) => handleColorAndNameOfShape(st));

        setShapes(newShapes);
      } else {
        shapes.map((st) => handleColorAndNameOfShape(st));
        setShapes(shapes);
      }
      // setShapes(response.data.shapes);

      setSitePic(response.data);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const fetchLevelPic = async (levelId) => {
    try {
      let response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_LEVEL_PIC_BY_LEVEL}/${levelId}`,
        token: store.token,
      });
      setlevelPic(response.data);
      let shapes = response.data.shapes;
      shapes.map((st) => handleColorAndNameOfShape(st));
      setShapes(shapes);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const handlePdfChange = (pdfUri, pdf) => {
    setPdf(pdfUri);
    level ? onAddLevelPlan(pdf) : onAddSitePlan(pdf);
  };

  const onAddSitePlan = async (file) => {
    try {
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("siteId", adminStore.site.siteId._id);

      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMIN_PIC_PDF,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      dispatch(
        Actions.admin.set_site({ ...adminStore.site, siteId: response.data }),
      );
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const onAddLevelPlan = async (file) => {
    try {
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("levelId", level);

      const response = await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.ADMIN_PIC_PDF,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });

      const buildingIndex = sitePic.shapes.findIndex(
        (shp) => shp._id === response.data.building,
      );
      let buildingFind = sitePic.shapes[buildingIndex];
      if (buildingFind) {
        let buildingCloned = _.cloneDeep(buildingFind);

        let levelIn = buildingCloned.building.levels.findIndex(
          (lev) => lev._id === level,
        );
        buildingCloned.building.levels[levelIn].plan = response.data.plan;
        let sitePicCloned = _.cloneDeep(sitePic);
        sitePicCloned.shapes[buildingIndex] = buildingCloned;

        let levelsArr = _.cloneDeep(buildingCloned.building.levels);
        setSitePic(sitePicCloned);
        setSelectedShape(buildingCloned);
        setAllLevels(_.cloneDeep(levelsArr));
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const handleChange = (shapesArray) => {
    let getShape = shapesArray[shapesArray.length - 1];
    if (
      selectedShape &&
      getShape.type !== "MEAN" &&
      Object.keys(selectedShape).length > 0 &&
      level === ""
    ) {
      let newShape = selectedShape;

      var removeIndex = shapesArray
        ?.map(function (item) {
          return item._id;
        })
        .indexOf(newShape._id);
      shapesArray[removeIndex].points = getShape.points;

      let updatedShape = shapesArray[removeIndex];
      level && (selectedShapeReserver = selectedShape);
      updatedShape && setShape(updatedShape);
      setShapes(shapesArray);
      updateShape(updatedShape);
      // remove object
      // removeIndex && shapesArray.splice(removeIndex, 1);
      setSelectedShape("");
    } else if (
      selectedShape &&
      getShape.type !== "MEAN" &&
      getShape.type === "STORAGEAREA" &&
      selectedShape.type !== "BUILDING" &&
      Object.keys(selectedShape).length > 0 &&
      level
    ) {
      let newShape = selectedShape;
      var removeIndex = shapesArray
        ?.map(function (item) {
          return item._id;
        })
        .indexOf(newShape._id);
      shapesArray[removeIndex].points = getShape.points;

      let updatedShape = shapesArray[removeIndex];
      level && (selectedShapeReserver = selectedShape);
      updatedShape && setShape(updatedShape);
      setShapes(shapesArray);
      updateLevelShape(updatedShape);
      // remove object
      // removeIndex && shapesArray.splice(removeIndex, 1);
      setSelectedShape("");
    } else {
      level && (selectedShapeReserver = selectedShape);

      getShape && setShape(getShape);

      setShapes(shapesArray);
      setModal(true);
      setSelectedShape("");
    }
  };
  // update Building

  const updateShape = async (newShape) => {
    try {
      let response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.ADMIN_PIC_SHAPE_POINTS}/${SITE_ID}`,
        token: store.token,
        body: JSON.stringify({
          points: newShape.points,
          picID: newShape._id,
        }),
      });
      setRendering(response);
    } catch (error) {
      console.log(error, "update shape error");
    }
  };
  const updateLevelShape = async (newShape) => {
    try {
      let response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.ADMIN_LEVEL_PIC_SHAPE_POINTS}/${level}`,
        token: store.token,
        body: JSON.stringify({
          points: newShape.points,
          picID: newShape._id,
        }),
      });
      setRendering(response);
    } catch (error) {
      console.log(error, "update shape error");
    }
  };

  const handleClick = (id, shape) => {
    setSelectedShape(shape);
    if (shape.type === "BUILDING") {
      setselectedBuilding(shape);
      let levelsArr = _.cloneDeep(shape.building.levels);
      setAllLevels(_.cloneDeep(levelsArr));
      let levs = [];

      levelsArr.map((le) =>
        levs.push({
          label: le.number === 0 ? "RDC" : le.number,
          value: le._id,
        }),
      );

      setLevelsDropdown(levs);
    }
  };
  const checkShape = () => {
    level && setSelectedShape(selectedShapeReserver);
    if (shape && modal) {
      if (!shape.name) {
        let shp = shapes.filter(
          (item) => String(item._id) !== String(shape._id),
        );
        setShapes(shp);
        setShape("");
      } else {
        setShape("");
      }
    }
    // eslint-disable-next-line
  };

  const onClear = () => {
    setSelectedShape("");
  };

  const setShapesFn = (newShapes, shape, modalDecision) => {
    setShapes(newShapes);
    if (!modalDecision) {
      setModal(modalDecision);
      if (shape) {
        setShape("");
      } else if (selectedShape) {
        setSelectedShape(shape);
      }
      if (selectedShapeReserver) {
        setSelectedShape(selectedShapeReserver);
      }
    }
  };

  // InfoDrawer
  const onDeleteShape = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this shape?")) {
        if (level) {
          let response = await GLOBALS.API({
            method: "DELETE",
            uri: `${GLOBALS.Constants.ADMIN_LEVEL_PIC_SHAPE}/${levelPic._id}/${selectedShape._id}`,
            token: store.token,
          });
          setlevelPic(response.data);

          let shapes = response.data.shapes;
          let newShapes = expiredShapes(shapes);

          if (newShapes) {
            newShapes.map((st) => handleColorAndNameOfShape(st));

            setShapes(newShapes);
          } else {
            shapes.map((st) => handleColorAndNameOfShape(st));
            setShapes(shapes);
          }
          setSelectedShape("");
          setLoading(false);
        } else {
          let response = await GLOBALS.API({
            method: "DELETE",
            uri: `${GLOBALS.Constants.ADMIN_PIC_SHAPE}/${sitePic._id}/${selectedShape._id}`,
            token: store.token,
          });
          setSitePic(response.data);
          let shapes = response.data.shapes;
          let newShapes = expiredShapes(shapes);

          if (newShapes) {
            newShapes.map((st) => handleColorAndNameOfShape(st));

            setShapes(newShapes);
          } else {
            shapes.map((st) => handleColorAndNameOfShape(st));
            setShapes(shapes);
          }
          setSelectedShape("");
          setLoading(false);
        }
      }
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const BuildingComponent = () => {
    return (
      <>
        <SubHeading primary={selectedBuilding.name} bold fontSize={22} />
        <SubHeading primary={`Type : ${selectedBuilding.type}`} />
        <FormSelect
          name="level"
          value={level}
          values={levelsDropdown}
          placeholder="Select Level"
          onChange={({ target: { value } }) => {
            setLevel(value);

            if (value) {
              fetchLevelPic(value);
              const leve = allLeves.find((lev) => lev._id === value);
              setPdf(
                leve?.plan ? GLOBALS.Constants.BASE_URL + leve.plan : undefined,
              );
            }
          }}
        />
      </>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.canvasRow}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <Canvas
              shapes={shapes}
              onClick={handleClick}
              onChange={handleChange}
              setSelectedShape={setSelectedShape}
              selectedShape={selectedShape}
              onClear={onClear}
              pdf={pdf}
              setRendering={setRendering}
              onPdfChange={handlePdfChange}
              level={level ? true : false}
            />
          )}
          <div className={classes.infoDrawerContainer}>
            {selectedShape && selectedShape.type === "BUILDING" && level && (
              <Button
                text="Show Exterior"
                className="mt-2"
                onClick={() => {
                  setPdf(
                    adminStore.site.siteId?.plan
                      ? GLOBALS.Constants.BASE_URL +
                          adminStore.site.siteId?.plan
                      : undefined,
                  );

                  setShapes(sitePic.shapes);
                  setLevel("");
                  setSelectedShape("");
                  setselectedBuilding("");
                  selectedShapeReserver = null;
                }}
              />
            )}
            {selectedBuilding && selectedShape.type !== "BUILDING" && level && (
              <>
                <Button
                  text="Show Exterior"
                  className="mt-2"
                  onClick={() => {
                    setPdf(
                      adminStore.site.siteId?.plan
                        ? GLOBALS.Constants.BASE_URL +
                            adminStore.site.siteId?.plan
                        : undefined,
                    );

                    setShapes(sitePic.shapes);
                    setLevel("");
                    setSelectedShape("");
                    setselectedBuilding("");
                    selectedShapeReserver = null;
                  }}
                />
                <div className={classes.infoDrawer2}>{BuildingComponent()}</div>
              </>
            )}

            {selectedShape && (
              <div
                className={
                  selectedShape && selectedShape.type !== "BUILDING" && level
                    ? classes.infoDrawer3
                    : classes.infoDrawer
                }
              >
                <SubHeading primary={selectedShape.name} bold fontSize={22} />
                <SubHeading primary={`Type : ${selectedShape.type}`} />
                {selectedShape.type === "BUILDING" && (
                  <FormSelect
                    name="level"
                    value={level}
                    values={levelsDropdown}
                    placeholder="Select Level"
                    onChange={({ target: { value } }) => {
                      setLevel(value);

                      if (value) {
                        fetchLevelPic(value);
                        const leve = allLeves.find((lev) => lev._id === value);
                        setPdf(
                          leve?.plan
                            ? GLOBALS.Constants.BASE_URL + leve.plan
                            : undefined,
                        );
                      }
                    }}
                  />
                )}
                <Form.Row>
                  {level === "" ? (
                    <IconButton
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal(true);
                      }}
                    >
                      <Pencil className={classes.infoIcon} />
                    </IconButton>
                  ) : selectedShape.type === "BUILDING" ? (
                    ""
                  ) : (
                    <IconButton
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal(true);
                      }}
                    >
                      <Pencil className={classes.infoIcon} />
                    </IconButton>
                  )}

                  {selectedShape.type === "MEAN" ? (
                    <>
                      <NavLink
                        disabled={loading}
                        to={{
                          pathname: "/means/calendar",
                          selectedShape: selectedShape,
                        }}
                      >
                        <IconButton>
                          <Calendar className={classes.infoIcon} />
                        </IconButton>
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        disabled={loading}
                        to={{
                          pathname: "/",
                          selectedShape: selectedShape,
                        }}
                      >
                        <IconButton>
                          <Calendar className={classes.infoIcon} />
                        </IconButton>
                      </NavLink>
                    </>
                  )}

                  <IconButton
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteShape();
                    }}
                  >
                    <Cross className={classes.infoIcon} />
                  </IconButton>
                </Form.Row>
              </div>
            )}
          </div>
        </div>
      </div>
      <>
        {modal &&
          (shape || selectedShape) &&
          ((
            shape
              ? shape.type === "DELIVERYAREA"
              : selectedShape.type === "DELIVERYAREA"
          ) ? (
            <FullScreenModal
              title={`${shape ? "ADD" : "EDIT"} DELIVERY AREA`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              body={
                <DeliveryArea
                  shape={shape}
                  pic={level ? levelPic : sitePic}
                  level={level}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                  setSelectedShape={setSelectedShape}
                />
              }
            />
          ) : (
              shape
                ? shape.type === "STORAGEAREA"
                : selectedShape.type === "STORAGEAREA"
            ) ? (
            <FullScreenModal
              title={`${shape ? "ADD" : "EDIT"} STORAGE AREA`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              body={
                <StorageArea
                  shape={shape}
                  pic={level ? levelPic : sitePic}
                  level={level}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                  setSelectedShape={setSelectedShape}
                />
              }
            />
          ) : (
              shape
                ? shape.type === "BUILDING"
                : selectedShape.type === "BUILDING"
            ) ? (
            <FullScreenModal
              title={`${shape ? "ADD" : "EDIT"} BUILDING`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              body={
                <Building
                  shape={shape}
                  pic={level ? levelPic : sitePic}
                  level={level}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                  setSelectedShape={setSelectedShape}
                />
              }
            />
          ) : (
              shape ? shape.type === "MEAN" : selectedShape.type === "MEAN"
            ) ? (
            <FullScreenModal
              title={`${shape ? "ADD" : "EDIT"} MEAN`}
              open={modal}
              onClose={() => {
                checkShape();
                setModal((st) => !st);
                setSelectedShape("");
              }}
              body={
                <Mean
                  shape={shape}
                  pic={level ? levelPic : sitePic}
                  level={level}
                  shapes={shapes}
                  setShapes={setShapesFn}
                  selectedShape={selectedShape}
                  setSelectedShape={setSelectedShape}
                />
              }
            />
          ) : (
            ""
          ))}
      </>
    </div>
  );
};

export default PicCanvas;

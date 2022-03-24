import React, { Component } from "react";
import ConvaExample from "./ConvaExample";
import Header from "./Components/Header";
import Button from "../Button";
import GLOBALS from "../../globals";
import _ from "lodash";

export const width = 1000;
export const height = 420;

const loadImage = (data) =>
  new Promise((res, rej) => {
    try {
      let catImage = new Image();
      catImage.src = data;
      catImage.onload = async () => {
        res(catImage);
      };
    } catch (err) {
      rej(err);
    }
  });

class App extends Component {
  state = {
    points: [],
    meanPoints: [],
    shapes: [],
    means: [],
    curMousePos: [0, 0],
    isMouseOverStartPoint: false,
    isFinished: false,
    image: null,
    tempImage: "",
    tempPdf: "",
    checkDisable: true,
    meanDisable: true,
    color: "white",
    shapeId: "",
    meanShapeId: "",
    shapeName: "",
    meanCheck: "",
    meanValue: "",
    meanFinish: false,
    isLoading: false,
    clickedShape: "",
    shapeColor: "",
    meanColor: "",
  };
  // LifeCycle Hooks
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.tempImage !== this.state.tempImage) {
      this.showPdf(this.state.tempImage);
    } else if (prevState.shapes !== this.state.shapes) {
    } else if (!_.isEqual(prevProps.shapes, this.props.shapes)) {
      const newArray = [];
      this.setState({ meanCheck: "" });
      await Promise.all(
        this.props.shapes &&
          this.props.shapes.map(async (tempShap) => {
            const tempShape = _.cloneDeep(tempShap);
            if (tempShape.image && typeof tempShape.image === "string") {
              const image = await loadImage(
                `${GLOBALS.Constants.BASE_URL}${tempShape.image}`,
              );

              tempShape.image = image;
            }
            newArray.push(tempShape);
            return tempShape;
          }),
      );
      this.setState({ shapes: [] }, () => this.setState({ shapes: newArray }));
      // this.setState({ shapes: this.props.shapes });
    } else if (prevProps.pdf !== this.props.pdf) {
      this.showPdf(this.props.pdf);
    } else {
      return null;
    }
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }
  async componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
    this.props.pdf && this.showPdf(this.props.pdf);

    if (this.props.shapes) {
      const newArray = [];
      await Promise.all(
        this.props.shapes.map(async (tempShape) => {
          if (tempShape.image && typeof tempShape.image === "string") {
            let response = await GLOBALS.API({
              method: "GET",
              uri: `${GLOBALS.Constants.GET_MEAN_PATH}/?path=${tempShape.image}`,
            });
            if (response.data !== "true") {
              let removeIndex = this.props.shapes
                ?.map(function (item) {
                  return item._id;
                })
                .indexOf(tempShape._id);
              removeIndex && this.props.shapes.splice(removeIndex, 1);
            } else {
              const image = await loadImage(
                `${GLOBALS.Constants.BASE_URL}${tempShape.image}`,
              );
              tempShape.image = image;
            }
          }
          newArray.push(tempShape);
          return tempShape;
        }),
      );

      this.setState({ shapes: newArray });
      // this.setState({ shapes: this.props.shapes });
    }

    if (!this.props.pdf) {
      this.setState({ isLoading: false });
    }
  }

  // ******************
  // escape function
  escFunction = (event) => {
    if (event.keyCode === 27) {
      const { shapes, shapeId, meanShapeId } = this.state;

      if (shapeId) {
        let tempArr = shapes.find((sp) => sp._id === shapeId);

        if (tempArr) {
          tempArr.opacity = this.state.clickedShape.opacity;
        } else {
          return;
        }
      }
      if (meanShapeId) {
        let tempArr = shapes.find((sp) => sp._id === meanShapeId);
        if (tempArr) {
          tempArr.color = this.state.meanColor;
        } else {
          return;
        }
      }
      this.setState({
        shapeId: "",
        checkDisable: true,
        meanDisable: true,
        meanCheck: "",
        meanShapeId: "",
        points: [],
      });
      this.props.setSelectedShape("");
      this.props.setRendering("hello");

      this.props.onClear();
      //Do whatever when esc is pressed
    }
  };
  showPdf = async (uri) => {
    const PDFJS = window.pdfjsLib;
    try {
      var _PDF_DOC = await PDFJS.getDocument({
        url: uri,
      });
      var page = await _PDF_DOC.getPage(1);
      var canvas = document.getElementById("pdf-canvas");
      var rotate;
      if (page.view[2] > 612 && page.view[3] > 792) {
        rotate = (page.rotate + 150) % 360;
      } else {
        rotate = (page.rotate + 270) % 360;
      }

      // var viewport = page.getViewport(1);
      var unscaledViewport = page.getViewport(1);

      var scale = Math.min(
        canvas.height / unscaledViewport.height,
        canvas.width / unscaledViewport.width,
      );

      var viewport = page.getViewport(scale);

      var render_context = {
        canvasContext: document.querySelector("#pdf-canvas").getContext("2d"),
        viewport: viewport,
      };
      await page.render(render_context);
      var img = canvas.toDataURL("image/png");
      let catImage2 = new Image();
      this.setState({ image2: img });
      catImage2.src = img;
      catImage2.onload = () => {
        this.setState({ image: catImage2 });
      };

      this.setState({ isLoading: false });

      // this.setState({ tempImage: "" });

      canvas.display = "none";
      return true;
    } catch (error) {
      console.log("error pdf", error.message);

      return false;
    }
  };

  handleUpdateMean = () => {
    const { meanValue, meanShapeId } = this.state;
    if (meanShapeId) {
      let catImage = new Image();
      catImage.src = meanValue;
      catImage.onload = () => {
        this.setState({ image2: catImage });
      };
      let tempArr = this.state.shapes.filter(
        (sp) => sp._id === this.state.meanShapeId,
      );
      tempArr[0].image = catImage;
      catImage.onload = () => {
        this.setState({
          shapes: this.state.shapes,
          checkDisable: true,
          meanDisable: true,
        });
      };
    } else {
      alert("please first select a shape");
    }
  };
  handleDisableShape = (id) => {
    const { shapes, shapeId, shapeColor, meanShapeId } = this.state;
    if (meanShapeId) {
      let tempArr = shapes.find((sp) => sp._id === meanShapeId);
      if (tempArr) {
        tempArr.color = this.state.meanColor;
      } else {
        return;
      }
    }
    if (shapes.length > 0) {
      let tempArr = shapes.find((sp) => sp._id === id);
      let orgni = _.cloneDeep(tempArr);
      this.props.onClick(id, orgni);
      this.setState({ meanCheck: orgni.type, clickedShape: orgni });
      tempArr.opacity = 0.5;

      this.setState({
        shapeName: tempArr.name,
        shapeColor: tempArr.color,
      });
      if (shapeId) {
        let tempArr2 = shapes.find((sp) => sp._id === shapeId);
        if (tempArr2) {
          if (shapeId !== id) {
            tempArr2.color = shapeColor;
            tempArr2.opacity = 1;
          } else {
            return;
          }
        }
      }
    }
    this.setState({ checkDisable: false, shapeId: id });
    return;
  };
  handleDeleteShape = () => {
    const { shapes, shapeId } = this.state;
    if (shapeId) {
      let tempArr = shapes.filter((sp) => sp._id !== shapeId);
      this.setState({ shapes: tempArr, checkDisable: true, shapeId: "" });
    } else {
      alert("Please first select shape");
    }
  };
  handleDeleteMean = () => {
    const { shapes, meanShapeId } = this.state;
    if (meanShapeId) {
      let tempArr = shapes.filter((sp) => sp._id !== meanShapeId);
      this.setState({
        shapes: tempArr,
        checkDisable: true,
        meanShapeId: "",
        meanDisable: true,
      });
    } else {
      alert("Please first select shape");
    }
  };
  // handleUpdateShape = () => {
  //   const { shapes, color, shapeId, shapeName } = this.state;
  //   if (shapeId) {
  //     let tempArr = shapes.filter((sp) => sp._id === shapeId);
  //     tempArr[0].color = color;
  //     tempArr[0].name = shapeName;
  //     this.setState({ shapes: shapes, checkDisable: true, shapeName: "" });
  //   } else {
  //     alert("Please first select shape");
  //   }
  // };
  getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  handleNameChange = (e) => {
    this.setState({ shapeName: e.target.value });
  };
  handleElementChange = (e) => {
    if (e.target.value === "MEAN") {
      this.setState({
        meanCheck: e.target.value,
        points: [],
        checkDisable: true,
        meanDisable: true,
      });
    } else {
      this.setState({
        meanCheck: e.target.value,
        checkDisable: true,
        points: [],

        meanDisable: true,
      });
    }
    if (this.props.selectedShape !== e.target.value) {
      const { shapes, shapeId, meanShapeId } = this.state;

      if (shapeId) {
        let tempArr = shapes.find((sp) => sp._id === shapeId);

        if (tempArr) {
          tempArr.opacity = this.state.clickedShape.opacity;
        } else {
          return;
        }
      }
      if (meanShapeId) {
        let tempArr = shapes.find((sp) => sp._id === meanShapeId);
        if (tempArr) {
          tempArr.color = this.state.meanColor;
        } else {
          return;
        }
      }
     
      this.props.setSelectedShape("");
      this.props.setRendering("hello");

      this.props.onClear();
      
    }
  };

  handleConvaClick = (event) => {
    const {
      state: {
        points,
        isMouseOverStartPoint,
        isFinished,
        shapes,
        meanCheck,
        meanFinish,
        meanPoints,
        image,
        shapeId,
        meanShapeId,
      },
      getMousePos,
    } = this;
    var finishDisable = false;
    var checkMean = false;
    const stage = event.target.getStage();
    const pointer = stage.getPointerPosition();
    const mousePos = getMousePos(stage);

    if (event.target.attrs.image) {
      if (shapeId) {
        let tempArr = shapes.find((sp) => sp._id === shapeId);

        if (tempArr) {
          tempArr.opacity = this.state.clickedShape.opacity;
        } else {
          return;
        }
      } else if (meanShapeId) {
        let tempArr = shapes.find((sp) => sp._id === meanShapeId);
        if (tempArr) {
          tempArr.color = this.state.meanColor;
        } else {
          return;
        }
      }
      this.props.setSelectedShape("");

      return;
    }
    if (shapes.length > 0) {
      var flat = event.target.attrs.points;

      if (flat !== undefined && event.target.attrs.closed === true) {
        if (flat.length === 6) {
          finishDisable = this.isInsideTriangle(flat, pointer.x, pointer.y);
        } else if (flat.length === 8) {
          finishDisable = this.isInsideRectangle(flat, pointer.x, pointer.y);
        } else if (flat.length === 10) {
          finishDisable = this.isInsidePentagon(flat, pointer.x, pointer.y);
        } else if (flat.length === 12) {
          finishDisable = this.isInsideHexagon(flat, pointer.x, pointer.y);
        } else if (flat.length === 14) {
          finishDisable = this.isInsideHeptagon(flat, pointer.x, pointer.y);
        } else if (flat.length === 16) {
          finishDisable = this.isInsideOctagon(flat, pointer.x, pointer.y);
        } else if (flat.length === 18) {
          finishDisable = this.isInsidePloygon(flat, pointer.x, pointer.y);
        } else if (flat.length === 20) {
          finishDisable = this.isInsideDecagon(flat, pointer.x, pointer.y);
        }
      }
      if (event.target.attrs.meanFinish === false) {
        checkMean = true;
      } else if (event.target.attrs.meanFinish === true) {
        checkMean = true;
      } else if (
        event.target.attrs.fillPatternImage &&
        this.state.meanShapeId &&
        event.target.attrs.meanFinish === false
      ) {
        checkMean = true;
      } else {
        checkMean = false;
      }
      // ********************************
      // ********************************
    }
    // console.log(meanCheck,"meanCheck")

    if (meanCheck !== "" && image !== null) {
      if (finishDisable !== true && checkMean !== true) {
        if (meanCheck === "MEAN") {
          if (meanFinish === false) {
            // alert("hello");

            let rand = Date.now();

            this.setState(
              {
                shapes: [
                  ...shapes,
                  {
                    _id: rand,
                    type: meanCheck,
                    color: this.state.color,
                    opacity: 1,

                    points: [...meanPoints, mousePos],
                  },
                ],
              },
              () => {
                this.props.onChange(this.state.shapes);
              },
            );

            this.setState(
              {
                meanFinish: true,
              },
              () => {
                this.setState({
                  meanFinish: false,
                });
              },
            );
          }
        } else {
          let rand = Date.now();

          if (isMouseOverStartPoint && points.length >= 3) {
            this.setState(
              {
                shapes: [
                  ...shapes,
                  {
                    _id: rand,
                    type: meanCheck,
                    color: this.state.color,
                    opacity: 1,
                    points,
                  },
                ],
              },
              () => {
                this.props.onChange(this.state.shapes);
              },
            );
            this.setState({
              isFinished: true,
            });
            this.setState({
              points: [],
            });
          } else if (points.length >= 10) {
            alert("You only can make upto Decagon shape");
            return;
          } else {
            this.setState({
              points: [...points, mousePos],
            });
            if (isFinished) {
              this.setState({
                isFinished: false,
              });
            }
          }
        }
      } else {
        return;
      }
    } else if (image === null) {
      if (checkMean === true || finishDisable === true) return;
      else alert("Upload a pdf first");
    } else {
      if (checkMean === true || finishDisable === true) return;
      else alert("Select an element first");
    }
  };

  handleMouseMove = (event) => {
    const { getMousePos } = this;
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    this.setState({
      curMousePos: mousePos,
    });
  };
  handleMouseOverStartPoint = (event) => {
    if (this.state.isFinished || this.state.points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    this.setState({
      isMouseOverStartPoint: true,
    });
  };
  handleMouseOutStartPoint = (event) => {
    event.target.scale({ x: 1, y: 1 });
    this.setState({
      isMouseOverStartPoint: false,
    });
  };

  handleColorChange = (e) => {
    this.setState({ color: e.target.value });
  };
  handleMeansChange = (e) => {
    this.setState({
      meanValue: e.target.value,
    });
  };
  handlePdfChange = (e) => {
    if (e.target.files.length) {
      let file = e.target.files[0];
      if (file.type === "application/pdf") {
        const uri = URL.createObjectURL(file);
        this.props.onPdfChange(uri, file);
        this.setState({ tempPdf: file });
        this.setState({ isLoading: true });
        this.setState({ tempImage: uri });
      } else {
        alert("You can upload only pdf file");
      }
    }
  };
  handleConvaLineMouseOver = (id) => {
    let tempArr = this.state.shapes.filter((sp) => sp._id === id);
    tempArr[0].opacity = 0.5;
  };
  handleConvaLineMouseOut = (id) => {
    let tempArr = this.state.shapes.filter((sp) => sp._id === id);
    tempArr[0].opacity = this.state.clickedShape.opacity;
  };
  handleConvaLineClick = (id) => {
    this.handleDisableShape(id);
  };
  handleConvaCircleClick = (id) => {
    this.handleDisableMean(id);
  };
  handleConvaCircleImageClick = (id) => {
    const { shapes, meanShapeId, meanColor } = this.state;
    this.setState({ meanCheck: "MEAN" });

    if (shapes.length > 0) {
      let tempArr = shapes.find((sp) => sp._id === id);
      let orgni = _.cloneDeep(tempArr);
      this.props.onClick(id, orgni);
      this.setState({ clickedShape: orgni });
    }
  };
  handleDisableMean = (id) => {
    const { shapes, meanShapeId, meanColor, shapeId } = this.state;

    if (shapeId) {
      let tempArr = shapes.find((sp) => sp._id === shapeId);

      if (tempArr) {
        tempArr.opacity = this.state.clickedShape.opacity;
      } else {
        return;
      }
    }
    this.setState({ meanCheck: "MEAN" });

    if (shapes.length > 0) {
      let tempArr = shapes.find((sp) => sp._id === id);
      let orgni = _.cloneDeep(tempArr);
      this.props.onClick(id, orgni);
      this.setState({ clickedShape: orgni });

      this.setState({
        meanColor: tempArr.color,
      });
      // tempArr.color = "white";

      if (meanShapeId) {
        let tempArr2 = shapes.find((sp) => sp._id === meanShapeId);
        if (tempArr2) {
          if (meanShapeId !== id) {
            tempArr2.color = meanColor;
          }
        }
      }
    }
    this.setState({
      meanDisable: false,
      meanShapeId: id,
    });
  };

  AreaOfTriangle = (x1, y1, x2, y2, x3, y3) => {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
  };
  isInsidePentagon = (arr, p1, p2) => {
    let tempArr = Array.from(Array(100).keys());
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x4 = arr[6];
    let y4 = arr[7];
    let x5 = arr[8];
    let y5 = arr[9];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A =
      AreaOfTriangle(x1, y1, x2, y2, x3, y3) +
      AreaOfTriangle(x1, y1, x4, y4, x3, y3) +
      AreaOfTriangle(x4, y4, x3, y3, x5, y5);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x1, y1, x2, y2);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x, y, x3, y3, x4, y4);
    let A4 = AreaOfTriangle(x, y, x1, y1, x4, y4);

    let A5 = AreaOfTriangle(x, y, x4, y4, x5, y5);
    let tempA = A1 + A2 + A3 + A4 + A5;

    let splitA = tempA.toString(10).replace(/\D/g, "0").split("").map(Number);
    let splitB = A.toString(10).replace(/\D/g, "0").split("").map(Number);
    let num1 = Number(`${splitA[0]}${splitA[1]}`);
    let num2 = Number(`${splitB[0]}${splitB[1]}`);

    let diff = Math.abs(num1 - num2);
    let tempCheck = tempArr.find((dt) => dt === diff);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (tempCheck !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  isInsideHexagon = (arr, p1, p2) => {
    let tempArr = Array.from(Array(100).keys());
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x4 = arr[6];
    let y4 = arr[7];
    let x5 = arr[8];
    let y5 = arr[9];
    let x6 = arr[10];
    let y6 = arr[11];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A =
      AreaOfTriangle(x1, y1, x2, y2, x3, y3) +
      AreaOfTriangle(x1, y1, x4, y4, x3, y3) +
      AreaOfTriangle(x4, y4, x3, y3, x5, y5) +
      AreaOfTriangle(x4, y4, x6, y6, x5, y5);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x1, y1, x2, y2);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x, y, x3, y3, x4, y4);
    let A4 = AreaOfTriangle(x, y, x1, y1, x4, y4);

    let A5 = AreaOfTriangle(x, y, x4, y4, x5, y5);
    let A6 = AreaOfTriangle(x, y, x4, y4, x6, y6);

    let tempA = A1 + A2 + A3 + A4 + A5 + A6;

    let splitA = tempA.toString(10).replace(/\D/g, "0").split("").map(Number);
    let splitB = A.toString(10).replace(/\D/g, "0").split("").map(Number);
    let num1 = Number(`${splitA[0]}${splitA[1]}`);
    let num2 = Number(`${splitB[0]}${splitB[1]}`);

    let diff = Math.abs(num1 - num2);
    let tempCheck = tempArr.find((dt) => dt === diff);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (tempCheck !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  // 7points

  isInsideHeptagon = (arr, p1, p2) => {
    let tempArr = Array.from(Array(100).keys());
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x4 = arr[6];
    let y4 = arr[7];
    let x5 = arr[8];
    let y5 = arr[9];
    let x6 = arr[10];
    let y6 = arr[11];
    let x7 = arr[12];
    let y7 = arr[13];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A =
      AreaOfTriangle(x1, y1, x2, y2, x3, y3) +
      AreaOfTriangle(x1, y1, x4, y4, x3, y3) +
      AreaOfTriangle(x4, y4, x3, y3, x5, y5) +
      AreaOfTriangle(x4, y4, x6, y6, x5, y5) +
      AreaOfTriangle(x1, y1, x6, y6, x7, y7);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x1, y1, x2, y2);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x, y, x3, y3, x4, y4);
    let A4 = AreaOfTriangle(x, y, x1, y1, x4, y4);

    let A5 = AreaOfTriangle(x, y, x4, y4, x5, y5);
    let A6 = AreaOfTriangle(x, y, x4, y4, x6, y6);
    let A7 = AreaOfTriangle(x, y, x4, y4, x7, y7);

    let tempA = A1 + A2 + A3 + A4 + A5 + A6 + A7;

    let splitA = tempA.toString(10).replace(/\D/g, "0").split("").map(Number);
    let splitB = A.toString(10).replace(/\D/g, "0").split("").map(Number);
    let num1 = Number(`${splitA[0]}${splitA[1]}`);
    let num2 = Number(`${splitB[0]}${splitB[1]}`);

    let diff = Math.abs(num1 - num2);
    let tempCheck = tempArr.find((dt) => dt === diff);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (tempCheck !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  isInsideOctagon = (arr, p1, p2) => {
    let tempArr = Array.from(Array(100).keys());
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x4 = arr[6];
    let y4 = arr[7];
    let x5 = arr[8];
    let y5 = arr[9];
    let x6 = arr[10];
    let y6 = arr[11];
    let x7 = arr[12];
    let y7 = arr[13];
    let x8 = arr[14];
    let y8 = arr[15];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A =
      AreaOfTriangle(x1, y1, x2, y2, x3, y3) +
      AreaOfTriangle(x1, y1, x4, y4, x3, y3) +
      AreaOfTriangle(x4, y4, x3, y3, x5, y5) +
      AreaOfTriangle(x4, y4, x6, y6, x5, y5) +
      AreaOfTriangle(x1, y1, x6, y6, x7, y7) +
      AreaOfTriangle(x1, y1, x6, y6, x8, y8);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x1, y1, x2, y2);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x, y, x3, y3, x4, y4);
    let A4 = AreaOfTriangle(x, y, x1, y1, x4, y4);

    let A5 = AreaOfTriangle(x, y, x4, y4, x5, y5);
    let A6 = AreaOfTriangle(x, y, x4, y4, x6, y6);
    let A7 = AreaOfTriangle(x, y, x4, y4, x7, y7);
    let A8 = AreaOfTriangle(x, y, x4, y4, x8, y8);

    let tempA = A1 + A2 + A3 + A4 + A5 + A6 + A7 + A8;

    let splitA = tempA.toString(10).replace(/\D/g, "0").split("").map(Number);
    let splitB = A.toString(10).replace(/\D/g, "0").split("").map(Number);
    let num1 = Number(`${splitA[0]}${splitA[1]}`);
    let num2 = Number(`${splitB[0]}${splitB[1]}`);

    let diff = Math.abs(num1 - num2);
    let tempCheck = tempArr.find((dt) => dt === diff);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (tempCheck !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  isInsidePloygon = (arr, p1, p2) => {
    let tempArr = Array.from(Array(100).keys());
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x4 = arr[6];
    let y4 = arr[7];
    let x5 = arr[8];
    let y5 = arr[9];
    let x6 = arr[10];
    let y6 = arr[11];
    let x7 = arr[12];
    let y7 = arr[13];
    let x8 = arr[14];
    let y8 = arr[15];
    let x9 = arr[16];
    let y9 = arr[17];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A =
      AreaOfTriangle(x1, y1, x2, y2, x3, y3) +
      AreaOfTriangle(x1, y1, x4, y4, x3, y3) +
      AreaOfTriangle(x4, y4, x3, y3, x5, y5) +
      AreaOfTriangle(x4, y4, x6, y6, x5, y5) +
      AreaOfTriangle(x1, y1, x6, y6, x7, y7) +
      AreaOfTriangle(x1, y1, x6, y6, x8, y8) +
      AreaOfTriangle(x1, y1, x6, y6, x9, y9);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x1, y1, x2, y2);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x, y, x3, y3, x4, y4);
    let A4 = AreaOfTriangle(x, y, x1, y1, x4, y4);

    let A5 = AreaOfTriangle(x, y, x4, y4, x5, y5);
    let A6 = AreaOfTriangle(x, y, x4, y4, x6, y6);
    let A7 = AreaOfTriangle(x, y, x4, y4, x7, y7);
    let A8 = AreaOfTriangle(x, y, x4, y4, x8, y8);
    let A9 = AreaOfTriangle(x, y, x4, y4, x9, y9);

    let tempA = A1 + A2 + A3 + A4 + A5 + A6 + A7 + A8 + A9;

    let splitA = tempA.toString(10).replace(/\D/g, "0").split("").map(Number);
    let splitB = A.toString(10).replace(/\D/g, "0").split("").map(Number);
    let num1 = Number(`${splitA[0]}${splitA[1]}`);
    let num2 = Number(`${splitB[0]}${splitB[1]}`);

    let diff = Math.abs(num1 - num2);
    let tempCheck = tempArr.find((dt) => dt === diff);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (tempCheck !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  isInsideDecagon = (arr, p1, p2) => {
    let tempArr = Array.from(Array(100).keys());
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x4 = arr[6];
    let y4 = arr[7];
    let x5 = arr[8];
    let y5 = arr[9];
    let x6 = arr[10];
    let y6 = arr[11];
    let x7 = arr[12];
    let y7 = arr[13];
    let x8 = arr[14];
    let y8 = arr[15];
    let x9 = arr[16];
    let y9 = arr[17];
    let x10 = arr[18];
    let y10 = arr[19];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A =
      AreaOfTriangle(x1, y1, x2, y2, x3, y3) +
      AreaOfTriangle(x1, y1, x4, y4, x3, y3) +
      AreaOfTriangle(x4, y4, x3, y3, x5, y5) +
      AreaOfTriangle(x4, y4, x6, y6, x5, y5) +
      AreaOfTriangle(x1, y1, x6, y6, x7, y7) +
      AreaOfTriangle(x1, y1, x6, y6, x8, y8) +
      AreaOfTriangle(x1, y1, x6, y6, x9, y9) +
      AreaOfTriangle(x1, y1, x6, y6, x10, y10);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x1, y1, x2, y2);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x, y, x3, y3, x4, y4);
    let A4 = AreaOfTriangle(x, y, x1, y1, x4, y4);

    let A5 = AreaOfTriangle(x, y, x4, y4, x5, y5);
    let A6 = AreaOfTriangle(x, y, x4, y4, x6, y6);
    let A7 = AreaOfTriangle(x, y, x4, y4, x7, y7);
    let A8 = AreaOfTriangle(x, y, x4, y4, x8, y8);
    let A9 = AreaOfTriangle(x, y, x4, y4, x9, y9);
    let A10 = AreaOfTriangle(x, y, x4, y4, x10, y10);

    let tempA = A1 + A2 + A3 + A4 + A5 + A6 + A7 + A8 + A9 + A10;

    let splitA = tempA.toString(10).replace(/\D/g, "0").split("").map(Number);
    let splitB = A.toString(10).replace(/\D/g, "0").split("").map(Number);
    let num1 = Number(`${splitA[0]}${splitA[1]}`);
    let num2 = Number(`${splitB[0]}${splitB[1]}`);

    let diff = Math.abs(num1 - num2);
    let tempCheck = tempArr.find((dt) => dt === diff);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (tempCheck !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  // *
  isInsideRectangle = (arr, p1, p2) => {
    let tempArr = Array.from(Array(100).keys());
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x4 = arr[6];
    let y4 = arr[7];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A =
      AreaOfTriangle(x1, y1, x2, y2, x3, y3) +
      AreaOfTriangle(x1, y1, x4, y4, x3, y3);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x1, y1, x2, y2);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x, y, x3, y3, x4, y4);
    let A4 = AreaOfTriangle(x, y, x1, y1, x4, y4);
    /* Check if sum of A1, A2 and A3 is same as A */
    let tempA = A1 + A2 + A3 + A4;

    let splitA = tempA.toString(10).replace(/\D/g, "0").split("").map(Number);
    let splitB = A.toString(10).replace(/\D/g, "0").split("").map(Number);
    let num1 = Number(`${splitA[0]}${splitA[1]}`);
    let num2 = Number(`${splitB[0]}${splitB[1]}`);

    let diff = Math.abs(num1 - num2);
    let tempCheck = tempArr.find((dt) => dt === diff);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (tempCheck !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  isInsideTriangle = (arr, p1, p2) => {
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4];
    let y3 = arr[5];
    let x = p1;
    let y = p2;

    /* Calculate AreaOfTriangle of triangle ABC */
    const { AreaOfTriangle } = this;
    let A = AreaOfTriangle(x1, y1, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PBC */
    let A1 = AreaOfTriangle(x, y, x2, y2, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAC */
    let A2 = AreaOfTriangle(x1, y1, x, y, x3, y3);

    /* Calculate AreaOfTriangle of triangle PAB */
    let A3 = AreaOfTriangle(x1, y1, x2, y2, x, y);
    /* Check if sum of A1, A2 and A3 is same as A */
    let check = false;
    if (A === A1 + A2 + A3) {
      check = true;
    }
    return check;
  };

  render() {
    const {
      state: {
        points,
        isFinished,
        curMousePos,
        image,
        shapes,
        meanCheck,
        means,
        meanFinish,
        isLoading,
      },
      handleConvaClick,
      handleMouseMove,
      handleMouseOverStartPoint,
      handleMouseOutStartPoint,
      handleElementChange,
      handleConvaLineMouseOver,
      handleConvaLineMouseOut,
      handleConvaLineClick,
      handleConvaCircleClick,
      handleConvaCircleImageClick,
    } = this;

    return (
      <div>
        <Header
          meanCheck={meanCheck}
          handleElementChange={handleElementChange}
          image={image}
          level={this.props.level}
        />
        <div className="py-2 px-4" id="stage-parent">
          <ConvaExample
            onClick={handleConvaClick}
            onMouseMove={handleMouseMove}
            onMouseOverStartPoint={handleMouseOverStartPoint}
            onMouseOutStartPoint={handleMouseOutStartPoint}
            handleConvaLineMouseOver={handleConvaLineMouseOver}
            handleConvaLineMouseOut={handleConvaLineMouseOut}
            handleConvaLineClick={handleConvaLineClick}
            handleConvaCircleClick={handleConvaCircleClick}
            handleConvaCircleImageClick={handleConvaCircleImageClick}
            image={image}
            curMousePos={curMousePos}
            isFinished={isFinished}
            points={points}
            shapes={shapes}
            means={means}
            meanFinish={meanFinish}
            width={width}
            height={height}
          />
          <div className="mt-3">
            <Button
              fullWidth={false}
              disabled={isLoading}
              text={isLoading === true ? "LOADING..." : "Upload PDF"}
              onClick={() =>
                document.getElementById("upload-canvas-pdf-button").click()
              }
            />
          </div>
        </div>
        <div className="pl-4">
          <input
            hidden
            type="file"
            accept="application/pdf"
            id="upload-canvas-pdf-button"
            onChange={this.handlePdfChange}
          />
        </div>
        <canvas
          id="pdf-canvas"
          width={width}
          height={height}
          style={{ display: "none" }}
        ></canvas>
      </div>
    );
  }
}
export default App;

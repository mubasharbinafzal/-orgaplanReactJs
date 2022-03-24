import React from "react";
import { Stage, Layer, Circle, Rect, Image } from "react-konva";
import ConvaLine from "./Components/Line";
import Rectangle from "./Components/Rectangle";
import moment from "moment";
import useImage from "use-image";
export default function Canvas({
  onClick,
  onMouseMove,
  onMouseOverStartPoint,
  onMouseOutStartPoint,
  handleConvaLineMouseOver,
  handleConvaLineMouseOut,
  handleConvaCircleImageClick,
  handleConvaLineClick,
  handleConvaCircleClick,
  // states start
  image,
  points,
  isFinished,
  curMousePos,
  shapes,
  meanFinish,
  width,
  height,
}) {
  const [img] = useImage(
    "https://cdn1.iconfinder.com/data/icons/round-ui/134/27-512.png",
  );
  var flattenedPoints = points
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  // storageAlert
  const checkStorageAlert = (shape) => {
    let date = moment();
    let obj = {};
    obj.x = shape.points[0][0] + 40;
    obj.y = shape.points[0][1];
    obj.name = shape.name;

    let newShape = shape.storageArea;
    obj.expireDay = newShape ? newShape.notificationPriorToDays : 0;

    if (newShape && Number(newShape?.notificationPriorToDays) > 0) {
      date.add(newShape?.notificationPriorToDays, "days");
      if (moment(newShape.availability.end).isSame(date, "day")) {
        obj.expires = true;
      } else {
        obj.expires = false;
      }
    }
    return obj;
  };

  // DeliverAlert

  const checkDeliverAlert = (shape) => {
    let date = moment();
    let obj = {};

    let newShape = shape.deliveryArea;
    obj.x = shape.points[0][0] + 40;
    obj.y = shape.points[0][1];
    obj.name = shape.name;

    obj.expireDay = newShape ? newShape.notificationPriorToDays : 0;
    if (newShape && Number(newShape?.notificationPriorToDays) > 0) {
      date.add(newShape?.notificationPriorToDays, "days");
      if (moment(newShape?.availability.end).isSame(date, "day")) {
        obj.expires = true;
      } else {
        obj.expires = false;
      }
    }
    return obj;
  };
  {
  }

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={(e) => {
        // style stage container:
        const container = e.target.getStage().container();
        container.style.cursor = "crosshair";
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = "default";
      }}
    >
      <Layer>
        {image ? (
          <Rectangle fillPatternImage={image} width={width} height={height} />
        ) : (
          <Rectangle fill={"#ccc"} width={width} height={height} />
        )}
        <ConvaLine
          points={flattenedPoints}
          stroke="black"
          fill="blue"
          strokeWidth={1}
          closed={isFinished}
        />
        {shapes && shapes.length > 0
          ? shapes.map((shape) => {
              let flattenedPoint = [];
              const width = 6;
              let x = 0;
              let y = 0;
              let storageArea;
              let deliveryArea;

              if (shape.type === "STORAGEAREA") {
                storageArea = checkStorageAlert(shape);
              } else if (shape.type === "DELIVERYAREA") {
                deliveryArea = checkDeliverAlert(shape);
              }
              if (shape.type === "MEAN") {
                x = shape.points[0][0] - width / 2;
                y = shape.points[0][1] - width / 2;
              } else {
                flattenedPoint = shape.points.reduce((a, b) => a.concat(b), []);
              }
              return (
                <>
                  {shape.type === "MEAN" ? (
                    shape.image ? (
                      <Image
                        key={shape._id}
                        x={x}
                        y={y}
                        width={50}
                        height={50}
                        onMouseOver={(e) => {
                          // style stage container:
                          const container = e.target.getStage().container();
                          container.style.cursor = "pointer";
                        }}
                        onMouseOut={(e) => {
                          const container = e.target.getStage().container();
                          container.style.cursor = "crosshair";
                        }}
                        image={shape.image}
                        stroke={shape.color}
                        meanFinish={meanFinish}
                        strokeWidth={1}
                        onClick={(e) => handleConvaCircleImageClick(shape._id)}
                      />
                    ) : (
                      <Rect
                        key={shape._id}
                        x={x}
                        y={y}
                        onMouseOver={(e) => {
                          // style stage container:
                          const container = e.target.getStage().container();
                          container.style.cursor = "pointer";
                        }}
                        onMouseOut={(e) => {
                          const container = e.target.getStage().container();
                          container.style.cursor = "crosshair";
                        }}
                        width={50}
                        fill={shape.color}
                        meanFinish={meanFinish}
                        stroke={shape.color}
                        strokeWidth={1}
                        onClick={(e) => handleConvaCircleClick(shape._id)}
                      />
                    )
                  ) : (
                    <>
                      <ConvaLine
                        key={shape._id}
                        stroke="black"
                        points={flattenedPoint}
                        fill={shape.color}
                        opacity={
                          shape.type === "BUILDING" ? 0.8 : shape.opacity
                        }
                        strokeWidth={1}
                        // onMouseOver={() => handleConvaLineMouseOver(shape._id)}
                        // onMouseOut={() => handleConvaLineMouseOut(shape._id)}
                        onMouseOver={(e) => {
                          // style stage container:
                          const container = e.target.getStage().container();
                          container.style.cursor = "pointer";
                        }}
                        onMouseOut={(e) => {
                          const container = e.target.getStage().container();
                          container.style.cursor = "crosshair";
                        }}
                        onClick={() => handleConvaLineClick(shape._id)}
                        closed={true}
                      />
                      {storageArea && storageArea?.expires === true ? (
                        <Image
                          key={shape._id}
                          image={img}
                          x={storageArea?.x}
                          y={storageArea?.y}
                          width={50}
                          height={50}
                          onMouseOver={() => {
                            alert(
                              `Your ${storageArea.name} is going to expire after ${storageArea.expireDay} days`,
                            );
                            return;
                          }}
                          onMouseEnter={(e) => {
                            // style stage container:
                            const container = e.target.getStage().container();
                            container.style.cursor = "pointer";
                          }}
                          onMouseLeave={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "crosshair";
                          }}
                          // I will use offset to set origin to the center of the image
                        />
                      ) : deliveryArea && deliveryArea?.expires === true ? (
                        <Image
                          key={shape._id}
                          image={img}
                          x={deliveryArea?.x}
                          y={deliveryArea?.y}
                          width={50}
                          height={50}
                          onMouseOver={(e) => {
                            alert(
                              `Your ${deliveryArea.name} is going to expire after ${deliveryArea.expireDay} days`,
                            );
                            return;
                          }}
                          onMouseEnter={(e) => {
                            // style stage container:
                            const container = e.target.getStage().container();
                            container.style.cursor = "pointer";
                          }}
                          onMouseLeave={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "crosshair";
                          }}
                          // I will use offset to set origin to the center of the image
                          // offsetX={deliveryArea?.x}
                          // offsetY={deliveryArea?.y}
                        />
                      ) : null}
                    </>
                  )}
                  {points.map((point, index) => {
                    const width = 6;
                    const x = point[0] - width / 2;
                    const y = point[1] - width / 2;
                    const startPointAttr =
                      index === 0
                        ? {
                            hitStrokeWidth: 12,
                            onMouseOver: onMouseOverStartPoint,
                            onMouseOut: onMouseOutStartPoint,
                          }
                        : null;

                    return (
                      <React.Fragment key={index}>
                        <Rectangle
                          x={x}
                          y={y}
                          width={width}
                          height={width}
                          fill="blue"
                          stroke="black"
                          strokeWidth={6}
                          startPointAttr={startPointAttr}
                        />
                      </React.Fragment>
                    );
                  })}
                </>
              );
            })
          : points.map((point, index) => {
              const width = 6;

              const x = point[0] - width / 2;
              const y = point[1] - width / 2;

              const startPointAttr =
                index === 0
                  ? {
                      hitStrokeWidth: 12,
                      onMouseOver: onMouseOverStartPoint,
                      onMouseOut: onMouseOutStartPoint,
                    }
                  : null;

              return (
                <React.Fragment key={index}>
                  <Rectangle
                    x={x}
                    y={y}
                    width={width}
                    height={width}
                    fill="blue"
                    stroke="black"
                    strokeWidth={6}
                    startPointAttr={startPointAttr}
                  />
                </React.Fragment>
              );
            })}
      </Layer>
    </Stage>
  );
}

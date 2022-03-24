import React from "react";
import { Rect } from "react-konva";

export default function Rectangle({
  key,
  x,
  y,
  width,
  fill,
  stroke,
  opacity,
  strokeWidth,
  onDragStart,
  onDragMove,
  onDragEnd,
  startPointAttr,
  onClick,
  fillPatternImage,
}) {
  return (
    <Rect
      key={key}
      x={x}
      y={y}
      fillPatternImage={fillPatternImage}
      width={width}
      height={width}
      fill={fill}
      stroke={stroke}
      opacity={opacity}
      onClick={onClick}
      strokeWidth={strokeWidth}
      {...startPointAttr}
    />
  );
}

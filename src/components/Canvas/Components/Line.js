import React from "react";
import { Line } from "react-konva";

export default function App({
  points,
  stroke,
  fill,
  strokeWidth,
  onClick,
  closed,
  opacity,
  key,
  onMouseOver,
  onMouseOut,
}) {
  return (
    <Line
      key={key}
      points={points}
      stroke={stroke}
      fill={fill}
      opacity={opacity}
      strokeWidth={strokeWidth}
      onClick={onClick}
      closed={closed}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    />
  );
}

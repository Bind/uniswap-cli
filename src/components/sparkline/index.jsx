import React from "react";
import CanvasComponent from "../../canvas/index.jsx";
import { line, area } from "d3-shape";

const Sparkline = ({
  width,
  height,
  data,
  scale: { xScale, yScale },
  accessors,
}) => {
  const draw = (ctx) => {
    var areaGenerator = area()
      .x((d) => xScale(accessors.x(d)))
      .y0(2 * height)
      .y1((d) => yScale(accessors.y(d)));
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.beginPath();
    // lineGenerator.context(ctx)(data);
    areaGenerator.context(ctx)(data);

    ctx.fill();
    ctx.closePath();

    return ctx.toString();
  };
  return (
    <CanvasComponent height={height} width={width} color="grey" draw={draw} />
  );
};

export default Sparkline;

import React from "react";
import CanvasComponent from "../canvas/index.jsx";
import { line, area } from "d3-shape";
import { min, max } from "d3-array";
import { scaleTime, scaleLinear } from "d3-scale";

const defaultScaleSelectors = {
  minX: (data) => min(data.map((d) => d.x)),
  minY: (data) => min(data.map((d) => d.y)),
  maxX: (data) => max(data.map((d) => d.x)),
  maxY: (data) => min(data.map((d) => d.y)),
};

function generateScales(data, width, height, selectors) {
  const xScale = scaleTime()
    .domain([
      new Date(selectors.minX(data) * 1000),
      new Date(selectors.maxX(data) * 1000),
    ])
    .range([0, width]);

  const yScale = scaleLinear()
    .domain([selectors.minY(data), selectors.maxY(data)])
    .range([0, height * 2]);

  return { xScale, yScale };
}

const Sparkline = ({ width, height, data, selectors, accessors }) => {
  const { xScale, yScale } = generateScales(data, width, height, selectors);
  const draw = (ctx) => {
    const lineGenerator = line()
      .x((d) => xScale(accessors.x(d)))
      .y((d) => yScale(accessors.y(d)));
    var areaGenerator = area()
      .x((d) => xScale(accessors.x(d)))
      .y0(2 * height)
      .y1((d) => yScale(accessors.y(d)));
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.beginPath();
    lineGenerator.context(ctx)(data);
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

import React from "react";
import CanvasComponent from "../canvas/index.jsx"
import {line} from "d3-shape"
import {min, max} from "d3-array"
import {scaleTime, scaleLinear} from "d3-scale";

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
  // console.log(
  //   selectors.minX(data) * 1000,
  //   selectors.maxX(data) * 1000,
  //   selectors.minY(data),
  //   selectors.maxY(data)
  // );
  return { xScale, yScale };
}

const Sparkline = ({ width, height, data, selectors }) => {
  const { xScale, yScale } = generateScales(data, width, height, selectors);

  const draw = (ctx) => {
    const lineGenerator = 
      line()
      .x((d) => xScale(new Date(d.timestamp * 1000)))
      .y((d) => yScale(d.open));
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.beginPath();
    lineGenerator.context(ctx)(data);
    ctx.stroke();
    ctx.closePath();
    return ctx.toString();
  };
  return <CanvasComponent height={height} width={width} draw={draw} />;
};

export default  Sparkline;

import Canvas from "../../deps/canvas";
import rawData from "./tmp.json";
import {line} from "d3-shape";
import {min,max} from "d3-array";
import {scaleTime, scaleLinear} from "d3-scale";
import React from 'react'

let x = 0;
let test = [];
while (x < 100) {
  test.push({ y: x * Math.random(), x });
  x++;
}

var xScale = scaleTime()
  .domain([
    new Date(min(rawData.map((d) => d.timestamp * 1000))),
    new Date(max(rawData.map((d) => d.timestamp * 1000))),
  ])
  .range([0, 100]);
var yScale = 
  scaleLinear()
  .domain([0, max(rawData.map((d) => d.open))])
  .range([80, 0]);

const draw = (ctx) => {
  const lineGenerator = line()
  .x((d) => xScale(new Date(d.timestamp * 1000)))
  .y((d) => yScale(d.open));
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  ctx.beginPath();
  lineGenerator.context(ctx)(rawData);
  ctx.stroke();
  ctx.closePath();
  return ctx.toString();
};
const CanvasComponent = () => {
  
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    const canvas = new Canvas(50, 15);
    const c = canvas.getContext("2d");
    const timer = setInterval(() => {
      setContent(draw(c, 1000 / 30));
    }, 1000 / 30);
    return () => {
      clearInterval(timer);
    };
  }, [draw]);
  return content;
};

export default  CanvasComponent;

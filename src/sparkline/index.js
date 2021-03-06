const importJsx = require("import-jsx");
const CanvasComponent = importJsx("../canvas");
var d3 = require("d3-shape");
var d3Array = require("d3-array");
var scaleLinear = require("d3-scale");
const React = require("react");

const defaultScaleSelectors = {
  minX: (data) => d3Array.min(data.map((d) => d.x)),
  minY: (data) => d3Array.min(data.map((d) => d.y)),
  maxX: (data) => d3Array.max(data.map((d) => d.x)),
  maxY: (data) => d3Array.min(data.map((d) => d.y)),
};

function generateScales(data, width, height, selectors) {
  const xScale = scaleLinear
    .scaleTime()
    .domain([
      new Date(selectors.minX(data) * 1000),
      new Date(selectors.maxX(data) * 1000),
    ])
    .range([0, width]);
  const yScale = scaleLinear
    .scaleLinear()
    .domain([selectors.minY(data), selectors.maxY(data)])
    .range([0, height * 2]);
  console.log(
    selectors.minX(data) * 1000,
    selectors.maxX(data) * 1000,
    selectors.minY(data),
    selectors.maxY(data)
  );
  return { xScale, yScale };
}

const Sparkline = ({ width, height, data, selectors }) => {
  const { xScale, yScale } = generateScales(data, width, height, selectors);

  const draw = (ctx) => {
    const line = d3
      .line()
      .x((d) => xScale(new Date(d.timestamp * 1000)))
      .y((d) => yScale(d.open));
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    ctx.beginPath();
    line.context(ctx)(data);
    ctx.stroke();
    ctx.closePath();
    return ctx.toString();
  };
  return <CanvasComponent height={height} width={width} draw={draw} />;
};

module.exports = Sparkline;

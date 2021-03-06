const Canvas = require("../../deps/canvas");
var d3 = require("d3-shape");
var d3Array = require("d3-array");
var scaleLinear = require("d3-scale");
const React = require("react");
const { Text, Box, Newline } = require("ink");

const CanvasComponent = ({ width, height, draw, framerate = 1000 / 30 }) => {
  const [content, setContent] = React.useState("tempor");
  React.useEffect(() => {
    const canvas = new Canvas(width, height * 2);
    const c = canvas.getContext("2d");
    const timer = setInterval(() => {
      setContent(draw(c, framerate));
    }, framerate);
    return () => {
      clearInterval(timer);
    };
  }, [width, height]);
  return <Text color="white">{content}</Text>;
};

module.exports = CanvasComponent;

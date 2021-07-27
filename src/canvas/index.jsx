import Canvas from "../../deps/canvas";
import React from "react";
import { Text } from "ink";

const CanvasComponent = ({
  color,
  width,
  height,
  draw,
  framerate = 1000 / 30,
}) => {
  const [content, setContent] = React.useState("");
  React.useEffect(() => {
    const canvas = new Canvas(width, height * 2);
    const c = canvas.getContext("2d");
    const timer = setInterval(() => {
      setContent(draw(c, framerate));
    }, framerate);
    return () => {
      clearInterval(timer);
    };
  }, [width, height, draw]);
  return <Text color={color}>{content}</Text>;
};

export default CanvasComponent;

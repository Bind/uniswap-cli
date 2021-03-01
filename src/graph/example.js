const Canvas = require("drawille-canvas");
// var rawData = require('./tmp.json')
// var d3 = require("d3-shape")
var now = require("performance-now");
const React = require("react");
const { Text, Box } = require("ink");
const test = [{x:0,y:1},{x:1,y:2},{x:2,y:1}]


// const line = d3.line().x(d => d.x).y(d => d.y);


var canvas = new Canvas(200,80);
const draw = (ctx ) => {
    const frameCount = now() * 3.14 /1000;
    ctx.clearRect(0, 0, ctx.width, ctx.height)
    ctx.fillStyle = '#000000'
     ctx.beginPath()
    ctx.arc(ctx.width/2, ctx.height/2, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
     ctx.fill()
    // line.context(ctx)(test);

     return ctx.toString()
  }
const CanvasComponent = () => {
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    const c = canvas.getContext("2d");
    c.font = "17px sans-serif";
    const timer = setInterval(() => {
      setContent(draw(c, 1000/30));
    }, 1000 / 30);
    return () => {
      clearInterval(timer);
    };
  }, []);
      
      return (<Box borderColor="red" borderStyle="classic"  ><Text > {content}</Text></Box>);
};

module.exports = CanvasComponent;

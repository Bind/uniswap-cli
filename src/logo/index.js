const importJsx = require("import-jsx");
const React = require("react");
const GetLogo = require("./GetLogo.js");
const CanvasComponent = importJsx("../canvas");

const LogoComponent = ({ height, width }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [logoData, setLogoData] = React.useState("");
  React.useEffect(() => {
    const _ = async () => {
      const tmp = await GetLogo(width, height);
      setLoaded(true);
      setLogoData(tmp);
    };
    _();
  }, []);

  const drawLogo = loaded
    ? (ctx, framerate) => {
        // console.log(logoData.width, logoData.height, width, height);
        ctx.putImageData(
          {
            data: logoData.frame(),
            width: logoData.width,
            height: logoData.height,
          },
          0,
          0
        );
        // ctx.rotate(20);
        // ctx.scale(0.5, 0.5);
        return logoData.frame();
      }
    : () => {};
  return (
    <CanvasComponent
      color={"#FF007A"}
      height={height}
      width={width}
      draw={drawLogo}
    />
  );
};

module.exports = LogoComponent;

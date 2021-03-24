import fs from 'fs';
import {PNG} from"pngjs";
import RawCanvas from "../../deps/drawille.js";


// Needs work, ideally we can pass it in a height and width and it would scale image to canvas size
// Currently 3 image sizes 128 looks the best

let LogoPointMatrix;
const getLogo = async (width, height) => {
  const c = new RawCanvas(width, height);
  if (typeof LogoPointMatrix === "undefined") {
    LogoPointMatrix = await new Promise((resolve, reject) =>
      fs
        .createReadStream(`${__dirname}/../static/uniswap-128.png`)
        .pipe(
          new PNG({
            filterType: 4,
          })
        )
        .on("parsed", function () {
          for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
              var idx = (this.width * y + x) << 2;
              if (this.data[idx + 3] > 128) {
                c.set(x, y);
              }
            }
          }
          resolve(c);
        })
    );
  }
  return LogoPointMatrix;
};

export default getLogo;

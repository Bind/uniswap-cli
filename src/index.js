process.env.FORCE_COLOR = "1";
global.randomBytes = require("crypto").randomBytes;

import { render } from "ink";
import React from "react";

import App from "./graph/index.jsx";

render(React.createElement(App));

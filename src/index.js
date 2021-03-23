process.env.FORCE_COLOR = "1";

import { render } from "ink";
import React from "react";

import App from "./graph/index.jsx";

render(React.createElement(App));

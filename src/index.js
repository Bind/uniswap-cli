#!/usr/bin/env node
process.env.FORCE_COLOR = "1";
global.randomBytes = require("crypto").randomBytes;
const { Command } = require("commander");
const program = new Command();
program.version("0.0.1");
import { render } from "ink";
import React from "react";

import App from "./appWrapper.jsx";

program.option("-a, --address <address>", "Token Pair address");
program.option("-t, --token <ticker>", "Token short code");
program.option("-l, --list <list>", "Token List Url ");
program.option("--init");

program.parse(process.argv);

const options = program.opts();
// console.log("options", options);
// console.log("args", program.args);
render(React.createElement(App, { ...options }));

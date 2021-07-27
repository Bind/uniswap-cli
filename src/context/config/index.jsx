import toml from "toml";
import fs from "fs";
import os from "os";
import React from "react";
const currUser = os.userInfo().username;
let config;
try {
  var data = fs.readFileSync(`/Users/${currUser}/.uni/config.toml`);
} catch (e) {
  console.error("Instantiate a toml file at ~/.uni/config.toml");
}
try {
  config = toml.parse(data);
} catch (e) {
  console.error(
    "Parsing error on line " +
      e.line +
      ", column " +
      e.column +
      ": " +
      e.message
  );
}

const ConfigContext = React.createContext(config);

export const ConfigProvider = ({ children }) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

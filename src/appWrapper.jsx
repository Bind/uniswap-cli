import React, { useRef } from "react";
import { Box } from "ink";
import { ConfigProvider } from "./context/config/index.jsx";

import PairDataProvider from "./context/pairData";
import GlobalDataProvider from "./context/globalData";
import UniswapProvider from "./context/uniswap";
import { ViewProvider, VIEWS } from "./context/view/index.jsx";
import ViewRouter from "./views/index.jsx";

const getEntryView = (address, token) => {
  if (address) {
    return VIEWS.TABlE;
  } else {
    return VIEWS.LIST;
  }
};

const AppWrapper = ({ address, token }) => {
  return (
    <Box>
      <ConfigProvider>
        <ViewProvider view={getEntryView(address, token)}>
          <UniswapProvider>
            <PairDataProvider>
              <GlobalDataProvider>
                <ViewRouter address={address} token={token} />
              </GlobalDataProvider>
            </PairDataProvider>
          </UniswapProvider>
        </ViewProvider>
      </ConfigProvider>
    </Box>
  );
};

export default AppWrapper;

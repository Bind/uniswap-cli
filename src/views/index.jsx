import React from "react";
import { useView, VIEWS } from "../context/view";
import Table from "./pair";
import TokenLists from "./tokenList";
import Loading from "./loading";

const ViewRouter = ({ address, token }) => {
  const {
    state: { view },
  } = useView();
  switch (view) {
    case VIEWS.TABLE:
      return <Table></Table>;
    case VIEWS.LIST:
      return <TokenLists searchString={token} />;
    default:
      return <Loading />;
  }
};

export default ViewRouter;

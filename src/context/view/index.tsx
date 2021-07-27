import React from "react";

export enum VIEWS {
  TABLE,
  LIST,
  LOADING
}
const initial_state = {
  view: VIEWS.LOADING
};

interface ViewContextInt{
  state: any;
  setView: any
}

const ViewContext = React.createContext<ViewContextInt>({state: {}, setView: () => {}});

export const ViewProvider = ({ view, children }) => {
  const [state, setState] = React.useState({...initial_state, view})

  const setView = (view: VIEWS) => {
    console.log('setting view', view)
    setState({...state, view})
  }

  const payload = {
    state,
    setView
  }

  return <ViewContext.Provider value={payload}>{children}</ViewContext.Provider>;
};

export const useView = () => {
  const context = React.useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};


import React from "react";


const initial_state = {
    pair_address: ""
}




function AppReducer(state, action) {
    switch (action.type) {
      case 'set_address': {
        return {...state,
        address: action.address
        }
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
  }


const AppContext = React.createContext({state:initial_state, setAddress: () => {}});


export const ViewProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(AppReducer, initial_state)

  const setAddress = (address) => {
    dispatch({type:"set_address", address})
  }  

  return <AppContext.Provider value={state}>{{state, setAddress}}</AppContext.Provider>;
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

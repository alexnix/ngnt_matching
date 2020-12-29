import React from "react";

const AppContext = React.createContext();

function AppContextProvider({ children }) {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);

  return (
    <AppContext.Provider value={{ loading, data, setLoading, setData }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider };

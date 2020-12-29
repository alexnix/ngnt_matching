import React from "react";

const DetailsPopUpCtx = React.createContext();

function DetailsPopUpProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({}); // place and visibleColumns
  return (
    <DetailsPopUpCtx.Provider
      value={{
        open,
        setOpen,
        data,
        setData
      }}
    >
      {children}
    </DetailsPopUpCtx.Provider>
  );
}

export { DetailsPopUpCtx, DetailsPopUpProvider };

import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./LoadingScreen.css";

const LoadingScreenContext = React.createContext();
function LoadingScreenProvider({ children }) {
  const [message, setMessage] = React.useState([]);

  function appendLoadingMessage(m) {
    setMessage([...message, m]);
  }

  function setLoadingMessage(m) {
    setMessage([m]);
  }

  return (
    <LoadingScreenContext.Provider
      value={{ message, setLoadingMessage, appendLoadingMessage }}
    >
      {children}
    </LoadingScreenContext.Provider>
  );
}

function LoadingScreen() {
  const { message } = React.useContext(LoadingScreenContext);
  return (
    <div className="progressWrapper">
      <CircularProgress />
      <br />
      {message.map((m, idx) => (
        <span key={idx}>{m}</span>
      ))}
    </div>
  );
}

export { LoadingScreenContext, LoadingScreenProvider, LoadingScreen };

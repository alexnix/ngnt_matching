import React from "react";
import Dashboard from "./Dashboard";
import ResultsTable from "./ResultsTable";
import { LoadingScreen, LoadingScreenProvider } from "./LoadingScreen";
import { AppContext, AppContextProvider } from "./AppContext";
import { DetailsPopUpProvider } from "./DetailsPopUpCtx";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

function MyRouter() {
  const { loading } = React.useContext(AppContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/results" component={ResultsTable} />
    </Router>
  );
}

function App() {
  return (
    <AppContextProvider>
      <DetailsPopUpProvider>
        <LoadingScreenProvider>
          <MyRouter />
        </LoadingScreenProvider>
      </DetailsPopUpProvider>
    </AppContextProvider>
  );
}

export default App;

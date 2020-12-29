import React from "react";
import "./Dashboard.scss";
import PropertyInput from "./PropertyInput";

function Dashboard() {
  const [currentTab, setCurrentTab] = React.useState("Apartamente");

  const pages = {
    Apartamente: <PropertyInput type="apartments" />,
    Case: <PropertyInput type="houses" />,
    Terenuri: <PropertyInput type="fields" />,
  };

  const lis = [];
  Object.keys(pages).forEach((p) => {
    lis.push(
      <li
        key={p}
        className={currentTab === p ? "active" : ""}
        onClick={() => setCurrentTab(p)}
      >
        {p}
      </li>
    );
  });

  return (
    <div className="dashboard">
      <div className="siteWrapper">
        <nav>
          <ul>{lis}</ul>
        </nav>
        <div className="pageWrapper">{pages[currentTab]}</div>
      </div>
    </div>
  );
}

export default Dashboard;

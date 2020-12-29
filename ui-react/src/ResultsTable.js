import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import GoogleMapReact from "google-map-react";
import apartmentsFieldsData, {
  keyToName,
  nameToKey,
} from "./apartmentsFieldsData";
import { AppContext } from "./AppContext";
import ls from "local-storage";
import DetailsPopUpModal from "./DetailsPopUpModal";
import { DetailsPopUpCtx } from "./DetailsPopUpCtx";
import "./Results.scss";

const formatNumber = (n) => {
  return Math.round(Number(n)).toLocaleString().replace(",", ".");
};

GoogleMapReact.defaultProps = {
  ...GoogleMapReact.defaultProps,
  distanceToMouse: function distanceToMouse(pt, mousePos /* , markerProps */) {
    return 0;
  },
};

const KEY = "AIzaSyBRz2EpSa_PgdLp4J7qutYSk62rSa9IKpM";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row({ row, initialOpen = false }) {
  console.log(initialOpen);
  const [open, setOpen] = React.useState(initialOpen);
  const { setData: setPopUpData, setOpen: setPopUpOpen } = React.useContext(
    DetailsPopUpCtx
  );
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <DetailsPopUpModal />
      <TableRow className={classes.root}>
        {" "}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {Object.keys(keyToName).map((k) => (
          <TableCell>{row[k]}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <div style={{ height: "300px", width: "100%" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: KEY,
                  }}
                  center={[row.lat, row.lng]}
                  defaultZoom={16}
                >
                  <div className="rowProperty" lat={row.lat} lng={row.lng}>
                    {formatNumber(row.price_predicted) + "€"}
                  </div>
                  {row.comparables.map((c) => (
                    <div
                      onClick={() => {
                        setPopUpData({
                          place: c,
                          nameToKey: { id: "_id", ...nameToKey },
                        });
                        setPopUpOpen(true);
                      }}
                      className="rowComparable"
                      lat={c.lat}
                      lng={c.lng}
                    >
                      {formatNumber(c.price) + "€"}
                    </div>
                  ))}
                </GoogleMapReact>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  let { data } = React.useContext(AppContext);
  if (data != null) {
    ls("dataTest", data);
  } else if (ls("dataTest") !== null) {
    data = ls("dataTest");
  }
  console.log("data: ", data);

  return (
    <div className="resultsWrapper">
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              {Object.keys(nameToKey).map((i) => (
                <TableCell>{i}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <Row key={idx} row={row} initialOpen={data.length === 1} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

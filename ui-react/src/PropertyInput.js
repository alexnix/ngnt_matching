import React from "react";
import axios from "axios";
import AddressInput from "./AddressInput";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Card,
  Grid,
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { AppContext } from "./AppContext";
import { useHistory } from "react-router-dom";
import apartmentFieldsData, { nameToKey } from "./apartmentsFieldsData";
import ls from "local-storage";

function UploadArea() {
  // const {
  //   setInputFile,
  //   setColumnMatchingData,
  //   setLoading,
  //   setInputFileType,
  // } = React.useContext(ServiceContext);
  // const { setLoadingMessage } = React.useContext(LoadingScreenContext);
  const { setLoading, setData } = React.useContext(AppContext);

  const onDrop = React.useCallback((acceptedFiles) => {
    setLoading(true);
    // setLoadingMessage("Matching columns...");
    const data = new FormData();
    // data.append("file", acceptedFiles[0]);
    // data.append("type", name);
    // data.append("filename", acceptedFiles[0].name.split(".")[0]);

    fetch("/api/titles", {
      method: "POST",
      body: data,
    })
      .then((response) => response.text())
      .then((body) => {
        // const json = JSON.parse(body.replace(/NaN/g, "null"));
        // setInputFile(json.filename);
        // setInputFileType(name);
        // setColumnMatchingData(json.data);
        // next();
        // setLoading(false);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card className="uploadRow">
      <div className="uploadArea" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </Card>
  );
}

export default function ProperyInput({
  type,
  defaultFieldsData = apartmentFieldsData,
}) {
  const { setLoading, setData } = React.useContext(AppContext);

  const typeState = `${type}State`;
  const typeLatLng = `${type}LatLng`;

  const [state, setState] = React.useState(
    ls(typeState) ? ls(typeState) : defaultFieldsData
  );
  const [latLng, setLatLng] = React.useState(
    ls(typeLatLng) ? ls(typeLatLng) : undefined
  );
  const history = useHistory();

  return (
    <div>
      <h2>Evalueaza proprietati dintr-un fisier Excel/CSV</h2>
      <UploadArea />
      <h2>Evalueaza o proprietate introdusa manual</h2>
      <AddressInput
        {...(ls(typeLatLng)
          ? {
              defaultLat: ls(typeLatLng).lat,
              defaultLng: ls(typeLatLng).lng,
            }
          : {})}
        onPositionUpdate={(lat, lng) => {
          setLatLng({ lat, lng });
          ls(typeLatLng, { lat, lng });
        }}
      />
      <div style={{ width: "100%", overflow: "auto" }}>
        {apartmentFieldsData.map((i, idx) => {
          switch (i.type) {
            case "select":
              return (
                <Grid item xs={3} className="featureInput">
                  <FormControl>
                    <InputLabel>{i.name}</InputLabel>
                    <Select
                      key={idx}
                      label={i.name}
                      value={state[idx].value}
                      onChange={(e) => {
                        console.log(e.target.value);
                        const newState = [...state];
                        newState[idx].value = e.target.value;
                        setState(newState);
                      }}
                    >
                      {i.options.map((o) => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );

            case "number":
              return (
                <Grid item xs={3} className="featureInput">
                  <TextField
                    key={idx}
                    label={i.name}
                    type="number"
                    value={state[idx].value}
                    onChange={(e) => {
                      const newState = [...state];
                      newState[idx].value = e.target.value;
                      setState(newState);
                    }}
                  />
                </Grid>
              );
            default:
              break;
          }
        })}
      </div>
      <br />
      <Button
        onClick={async () => {
          ls(typeState, state);
          const dataToServer = state.reduce(
            (acc, elem) => ({ ...acc, [nameToKey[elem.name]]: elem.value }),
            {}
          );

          setLoading(true);
          var instances = [
            {
              "locality": dataToServer["locality"],
              "district": dataToServer["district"],
              "rooms": dataToServer["rooms"],
              "usableArea": dataToServer["usableArea"],
              "partitioning": dataToServer["partitioning"],
              "lat": "lat",
              "lng": "lng",
              "constructionYearRange": dataToServer["constructionYearRange"]
            } 
          ]
          console.log(dataToServer)
          const res = await axios.post(
            `http://54.70.203.199:8080/predict`,
            { instances}
          );

          setData(res.data);
          history.push("/results");
          setLoading(false);
        }}
      >
        Evaluare
      </Button>
    </div>
  );
}

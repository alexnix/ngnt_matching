import React from "react";
import { TextField, Button } from "@material-ui/core";
import GoogleMapReact, { Coords } from "google-map-react";
import axios from "axios";

const BUCHAREST_LAT = 44.439663;
const BUCHAREST_LNG = 26.096306;
const KEY = "AIzaSyBRz2EpSa_PgdLp4J7qutYSk62rSa9IKpM";

export default function AddressInput({
  onPositionUpdate,
  defaultLng = BUCHAREST_LNG,
  defaultLat = BUCHAREST_LAT,
}) {
  const [marker, setMarker] = React.useState();

  const [mapState, setMapState] = React.useState();
  const [address, setAddress] = React.useState();

  function onMarkerDragedn() {
    setMapState({
      ...mapState,
      center: { lat: this.position.lat(), lng: this.position.lng() },
    });
  }

  async function reverseGeocode(lat, lng) {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`
    );
    console.log(res);
    setAddress(res.data.results[0].formatted_address);
  }

  async function geocode() {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          key: KEY,
          address,
        },
      }
    );
    console.log(res);
    setAddress(res.data.results[0].formatted_address);
    setMapState({
      ...mapState,
      center: {
        lat: res.data.results[0].geometry.location.lat,
        lng: res.data.results[0].geometry.location.lng,
      },
    });
  }

  React.useEffect(() => {
    if (mapState !== undefined) {
      onPositionUpdate(mapState.center.lat, mapState.center.lng);
      if (marker !== undefined) {
        marker.setPosition(mapState.center);
      } else {
        const m = new mapState.maps.Marker({
          position: mapState.center,
          map: mapState.map,
          draggable: true,
        });
        setMarker(m);
        m.addListener("dragend", onMarkerDragedn);
      }

      // Reverse geocode the
      reverseGeocode(mapState.center.lat, mapState.center.lng);
    }
  }, [mapState]);

  return (
    <div>
      <div style={{ height: "300px" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: KEY,
          }}
          center={mapState !== undefined ? mapState.center : { lat: 0, lng: 0 }}
          defaultZoom={16}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
            // could be null if no internet
            if (map != null && maps != null) {
              setMapState({
                maps,
                map,
                center: { lat: defaultLat, lng: defaultLng },
              });

              map.addListener("click", (e) => {
                setMapState({
                  maps,
                  map,
                  center: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                });
              });
            }
          }}
        ></GoogleMapReact>
      </div>
      <br />
      <div>
        <TextField
          style={{ width: "90%" }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button style={{ width: "10%" }} onClick={geocode}>
          Muta Pin
        </Button>
      </div>
    </div>
  );
}

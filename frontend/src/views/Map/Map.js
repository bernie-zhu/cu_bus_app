import React from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from "react-google-maps";
import * as busStopData from "../../data/busstops.json";

var json = JSON.parse(busStopData);

function Map() {
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat:40.1020, lng:-88.2272 }}
    >
      {json.map((busStop) => (
        <Marker
          key = {busStop.stop_id}
          position = {{
            lat:busStop.stop_points[0].stop_lat,
            lng:busStop.stop_points[0].stop_lon
          }}
        />
      ))}
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function Map1() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDuQvlLmYii3bbaMz-uPegXqnroKZmkNWA`}
        loadingElement = {<div style={{ height: "100%" }} />}
        containerElement = {<div style={{ height: "100%" }} />}
        mapElement = {<div style={{ height: "100%" }} />}
      />
    </div>
  );
}

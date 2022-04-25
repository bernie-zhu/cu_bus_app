import React, { useEffect, useState } from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import * as busStopData from "../../data/data.json";
import { Button } from 'antd';

import { getFavoriteStops, insertFavoriteStop } from '../../api.js';

var data = JSON.parse(JSON.stringify(busStopData));
const arr = [];
for (var i in data) {
  arr.push(data[i]);
}
arr.splice(arr.length - 1, 1);
arr.splice(arr.length - 1, 1);

function Map() {
  const [selectedStop, setSelectedStop] = useState(null);
  var [username, setUsername] = useState(null);
  var [favoriteStops, setfavoriteStops] = useState([]);

  useEffect(() => {
      var username = localStorage.getItem('username');
      if (username) {
          setUsername(username);
          getFavoriteStops(username).then(res => {
              setfavoriteStops(res);
          });
      }
  }, [])

  const onFavorite = (values) => {
      console.log(values);
      insertFavoriteStop(username, values).then(res => {
          getFavoriteStops(username).then(res => {
              setfavoriteStops(res);
          });
      });
  };

  return (

    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat:40.1020, lng:-88.2272 }}
    >
      {arr.map((busStop) => (
        <Marker
          key = {busStop.stop_id}
          position = {{
            //lat: 40.114512,
            //lng: -88.180673
            lat: busStop.stop_points[0].stop_lat,
            lng: busStop.stop_points[0].stop_lon
          }}
          onClick={() => {
            setSelectedStop(busStop);
          }}
        />
      ))}

      {selectedStop && (
        <InfoWindow
          position = {{
            //lat: 40.114512,
            //lng: -88.180673
            lat: selectedStop.stop_points[0].stop_lat,
            lng: selectedStop.stop_points[0].stop_lon
          }}
          onCloseClick={() => {
            setSelectedStop(null);
          }}
        >
          <div>
            <h2>{selectedStop.stop_name} - {selectedStop.stop_id}</h2>
            <Button onClick={() => onFavorite(selectedStop.stop_id)}>Favorite</Button>
          </div>
        </InfoWindow>
      )}
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

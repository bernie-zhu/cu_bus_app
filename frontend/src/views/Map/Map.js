import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import * as busStopData from "../../data/data.json";
import { Button } from 'antd';

import { getFavoriteStops, insertFavoriteStop, getColorCodedFavStops } from '../../api.js';

function Map() {
  const [selectedStop, setSelectedStop] = useState(null);
  var [username, setUsername] = useState(null);
  var [favoriteStops, setfavoriteStops] = useState([]);
  var [stopsColorInfo, setStopsColorInfo] = useState([]);
  const mapref = {}
  var [markedStops, setMarkedStops] = useState({});
  var [arr, setArr] = useState([]);


  useEffect(() => {   
    var data = JSON.parse(JSON.stringify(busStopData));
    const arr1 = [];
    for (var i in data) {
      arr1.push(data[i]);
    }
    arr1.splice(arr1.length - 1, 1);
    arr1.splice(arr1.length - 1, 1);
    setArr(arr1);

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

  const onMapMounted = (ref) => {
    mapref.map = ref;
  };  

  const updateStopData = (stops) => {
    var temp = {};
    for (let i = 0; i < stops.length; i++) {
      temp[stops[i]["stop_point_id"]] = stops[i];
    }
    setMarkedStops(temp)
    console.log(temp);
  };  

  return (

    <GoogleMap
      ref={onMapMounted}
      defaultZoom={15}
      defaultCenter={{ lat:40.1020, lng:-88.2272 }}
      onDragEnd={() => {
        // console.log(mapref.map.getCenter().lat(), mapref.map.getCenter().lng());
        getColorCodedFavStops(mapref.map.getCenter().lat(), mapref.map.getCenter().lng(), username).then(res => {
          setStopsColorInfo(res);
          updateStopData(res.data[0]);

          // setArr(arr);
        });
      }}
    >
      {arr.map((busStop) => (
        !markedStops[busStop.stop_id] ?
        <Marker
          key = {busStop.stop_id}
          position = {{
            lat: busStop.stop_points[0].stop_lat,
            lng: busStop.stop_points[0].stop_lon
          }}

          onClick={() => {
            setSelectedStop(busStop);
          }}
        /> : (markedStops[busStop.stop_id]['distance_status'] == 'Green' ? 
        <Marker
        key = {busStop.stop_id}
        position = {{
          lat: busStop.stop_points[0].stop_lat,
          lng: busStop.stop_points[0].stop_lon
        }}
        icon={{
          url: '/greenstop.png'
        }}
        onClick={() => {
          setSelectedStop(busStop);
        }}
      /> : (markedStops[busStop.stop_id]['distance_status'] == 'Yellow' ? 
      <Marker
        key = {busStop.stop_id}
        position = {{
          lat: busStop.stop_points[0].stop_lat,
          lng: busStop.stop_points[0].stop_lon
        }}
        icon={{
          url: '/yellowstop.png'
        }}
        onClick={() => {
          setSelectedStop(busStop);
        }}
      /> : (markedStops[busStop.stop_id]['distance_status'] == 'Red' ? 
      <Marker
        key = {busStop.stop_id}
        position = {{
          lat: busStop.stop_points[0].stop_lat,
          lng: busStop.stop_points[0].stop_lon
        }}
        icon={{
          url: '/redstop.png'
        }}
        onClick={() => {
          setSelectedStop(busStop);
        }}
      />
      : <></>)
      )
      )))}

      {selectedStop && (
        <InfoWindow
          position = {{
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

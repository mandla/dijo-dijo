import React, { useEffect, useRef } from "react";
import mapboxgl from "!mapbox-gl";
import Cookie from "js-cookie";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmlnZWUiLCJhIjoiY2syYTcyYnRsM242czNjbXZkdmtwcWRlMCJ9.817UiaB2N2ZXxL3q29zxIA";

const Map = ({ data }) => {
  const mapRef = useRef();
  const map = useRef();

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: map.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        JSON.parse(Cookie.get("foodsUser")).longitude,
        JSON.parse(Cookie.get("foodsUser")).latitude,
      ],
      zoom: 2,
    });
    var directions = new MapboxDirections({
      accessToken:
        "pk.eyJ1IjoiYmlnZWUiLCJhIjoiY2syYTcyYnRsM242czNjbXZkdmtwcWRlMCJ9.817UiaB2N2ZXxL3q29zxIA",
      unit: "metric",
      profile: "mapbox/driving",
      alternatives: false,
      geometries: "geojson",
      controls: { instructions: true },
    });
    directions.setOrigin([
      JSON.parse(Cookie.get("foodsUser")).longitude,
      JSON.parse(Cookie.get("foodsUser")).latitude,
    ]);

    directions.setDestination([Number(data.longitude), Number(data.latitude)]);
    map.current.addControl(directions, "bottom-right");
  }, []);

  return (
    <div style={{ height: "60vh" }} className="map" ref={map}>
      <div id="map"></div>
    </div>
  );
};

export default Map;

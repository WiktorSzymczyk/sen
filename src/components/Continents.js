import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// GeoJSON URL or local file path
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";

// Colors for each continent
const continentColors = {
  Africa: "#E57373",
  Asia: "#FFB74D",
  Europe: "#64B5F6",
  Oceania: "#81C784",
  "North America": "#FFD54F",
  "South America": "#4DB6AC",
};

const Continents = () => {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 200 }}
      style={{ width: "100%", height: "auto" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const { CONTINENT } = geo.properties;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: continentColors[CONTINENT] || "#EEE",
                    outline: "none",
                  },
                  hover: {
                    fill: "#FF5722",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#FFCCBC",
                    outline: "none",
                  },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default Continents;

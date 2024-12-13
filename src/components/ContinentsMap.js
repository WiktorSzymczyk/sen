import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_continentsLow from "@amcharts/amcharts5-geodata/continentsLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const ContinentsMap = () => {
  useEffect(() => {
    // Create root element
    let root = am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create map chart
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoNaturalEarth1(),
      })
    );

    // Create a color palette
    const colorSet = am5.ColorSet.new(root, {
      colors: [
        am5.color(0x095256), // Teal
        am5.color(0x087f8c), // Aqua
        am5.color(0x5aaa95), // Soft Green
        am5.color(0x86a873), // Olive Green
        am5.color(0xbb9f06), // Yellow
      ],
    });

    // Create polygon series for continents
    let continentSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_continentsLow.default,
      })
    );

    // Assign colors to each continent
    continentSeries.events.on("datavalidated", () => {
      continentSeries.dataItems.forEach((dataItem, index) => {
        const polygon = dataItem.get("mapPolygon");
        if (polygon) {
          polygon.set("fill", colorSet.getIndex(index));
        }
      });
    });

    continentSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
    });

    continentSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonActive"),
    });

    // Clean up on unmount
    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }} />;
};

export default ContinentsMap;

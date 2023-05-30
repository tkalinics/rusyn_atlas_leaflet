// import current data set
import { legend, pointdata } from "./LAZO 121.js";

// remove the portion irrelevant to the legend
function removeSuffix(item) {
  return item.replace("-mini", "");
}

// generate a legend-based description for a given point
function legendHandler(number) {
  const result = [];
  const value = pointdata[number].split(" ");
  value.forEach((item) => {
    item = removeSuffix(item);
    result.push(legend[item]);
  });
  return result.join("; ");
}

// generate an icon for a given point: to be completed
function iconHandler(number) {
  const value = pointdata[number].split(" ");
  return `<img src="./${value[0]}.png" alt="">`;
}

// import the main json
$.getJSON($('link[rel="points"]').attr("href"), function (data) {
  var geojson = L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      // generate popup text
      layer.bindPopup(
        `${feature.properties.number}. ${
          feature.properties.name
        }: ${legendHandler(feature.properties.number)}`
      );
    },
    pointToLayer: function (feature, latlng) {
      var dynIcon = new L.divIcon({
        html: `${iconHandler(feature.properties.number)}`,
        className: "map-icon",
      });

      return L.marker(latlng, {
        // set hover text
        title: `${feature.properties.number}. ${feature.properties.name}`,
        // set dynamic icon
        icon: dynIcon,
      });
    },
  });
  // assign to a new map with data-derived coordinates
  var map = L.map("map").fitBounds(geojson.getBounds());

  // load OSM tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  geojson.addTo(map);
});

// var map = L.map("map").setView([48.55, 23.4], 8);

// var geojsonLayer = new L.GeoJSON.AJAX("./LAZO.json");
// geojsonLayer.addTo(map);

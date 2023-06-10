// import current data set
import { legend, pointdata } from "./LAZO 121.js";

// marker .png files width in px
const markerWidth = 12;

// remove the portion irrelevant to the legend
function removeSuffix(item) {
  return item.replace("-mini", "");
}

// use legend to generate popup text for a given point
function popupHandler(number) {
  const result = [];
  const value = pointdata[number].split(" ");
  value.forEach((item) => {
    item = removeSuffix(item);
    result.push(legend[item]);
  });
  return result.join("; ");
}

// access the value in a given point
function valueHandler(number) {
  return pointdata[number].split(" ");
}

// generate an icon for a given point
function iconHandler(number) {
  const value = valueHandler(number);
  let iconHTML = "";
  value.forEach((item) => {
    iconHTML = iconHTML + `<img src="./${item}.png" alt="">`;
  });
  return iconHTML;
}

// centers the icon horizontally
function anchorHandler(number) {
  return valueHandler(number).length * (markerWidth / 2);
}

// import the main json
$.getJSON($('link[rel="points"]').attr("href"), function (data) {
  var geojson = L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      // generate popup text
      layer.bindPopup(
        `${feature.properties.number}. ${
          feature.properties.name
        }: ${popupHandler(feature.properties.number)}`
      );
    },
    pointToLayer: function (feature, latlng) {
      var dynIcon = new L.divIcon({
        html: `${iconHandler(feature.properties.number)}`,
        iconAnchor: [anchorHandler(feature.properties.number), 0],
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

//  id="map-id"

// Create the createMap function
function createMap(earthquakeLayer, faultLayer) {

  // Create the tile layers that will be the background of map
  var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightMap,
    "Satellite Map": satelliteMap,
    "Street Map": streetMap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Fault Lines": faultLayer,
    "Earthquakes": earthquakeLayer
  };
  // Create the map object with options
  var myMap = L.map("map-id", {
    center: [32.45, -96.50],
    zoom: 4,
    layers: [lightMap, faultLayer, earthquakeLayer]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  var legend = L.control({
    position: "bottomright"
  });

  // Create Legend with colors for each magnitude
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    var colors = ["#d32f2f", "#e64a19", "#ef6c00", "#ffa000", "#fbc02d", "#afb42b"];
  div.innerHTML = "<ul><h3>Magnitude</h3><hr>" + [
    "<li style=\"background-color: " +
       colors[5] + "\"></li>" + "<li>0-1</li>",
    "<li style=\"background-color: " +
       colors[4] + "\"></li>" + "<li>1-2</li>",
    "<li style=\"background-color: " +
       colors[3] + "\"></li>" + "<li>2-3</li>",
    "<li style=\"background-color: " +
       colors[2] + "\"></li>" + "<li>3-4</li>",
    "<li style=\"background-color: " +
       colors[1] + "\"></li>" + "<li>4-5</li>",
    "<li style=\"background-color: " +
       colors[0] + "\"></li>" + "<li>5+</li>"
  ].join("") + "</ul>";

  return div;
  };

  legend.addTo(myMap);
};

// Function to give each earthquake a different radius based on its magnitude
function circleSize(magnitude) {
  return magnitude * 30000;
}
// Function to create 
function createCircles(response) {

  // Pull the "earthQuake" property off of response.features
  earthquakeData = response.features;
  var quakeCircle = [];
  // Loop through the array
  for (var i = 0; i < earthquakeData.length; i++) {

    var color = "";
    if (earthquakeData[i].properties.mag > 5) {
      color = "#d32f2f";
    }
    else if (earthquakeData[i].properties.mag > 4) {
      color = "#e64a19";
    }
    else if (earthquakeData[i].properties.mag > 3) {
      color = "#ef6c00";
    }
    else if (earthquakeData[i].properties.mag > 2) {
      color = "#ffa000";
    }
    else if (earthquakeData[i].properties.mag > 1) {
      color = "#fbc02d";
    }
    else {
      color = "#afb42b";
    }
    
    quakeCircle.push(
      L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "grey",
        weight: 0.5,
        fillColor: color,
        // Setting our circle's radius equal to the output of circleSize function
        radius: circleSize(earthquakeData[i].properties.mag)
      }).bindPopup("<h1>" + earthquakeData[i].properties.title + "</h1>")
    );
}
  // Create a layer group made from the bike markers array, pass it into the createMap function
  var earthquakeLayer = L.layerGroup(quakeCircle);
  return earthquakeLayer;
}

function createPlates(response) {
  var plateStyle = {
    color: "orange",
    fillOpacity: 0,
    weight: 2
  };

  var tectonicplates = [];
  tectonicplates.push(
    L.geoJson(response, {
    style: plateStyle
  })
  );

  var faultLayer = L.layerGroup(tectonicplates);
  return faultLayer;
}

// URLs for earthquake data and techtonic plates

quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";


d3.json(plateUrl, function(platesData) {
    var faultLayer = createPlates(platesData.features);

  d3.json(quakeUrl, function(quakesData){
    var earthquakeLayer = createCircles(quakesData);

    createMap(earthquakeLayer, faultLayer);
  })
});






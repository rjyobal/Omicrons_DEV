function createMap(bikeStations) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "NFL Stadiums": bikeStations
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var stations = response;
  console.log(stations);
   // Initialize an array to hold bike markers
  var bikeMarkers = [];
   // Icon

  var Icon = L.icon({
    iconUrl: '../imgages/logo1.png',
    shadowUrl: '../imgages/logo2.png',

    iconSize:     [38, 70], // size of the icon
    shadowSize:   [35, 40], // size of the shadow
    iconAnchor:   [20, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  // Loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];
    //console.log(station);
    var sMarker=L.marker([station.GeoLat, station.GeoLong], {icon:Icon})
    .bindPopup("<h3>" + station.Name + "<h3><h3>Capacity: " + station.Capacity + "</h3><h3>Type: " + station.Type + "</h3>");
    //console.log(sMarker);    
    bikeMarkers.push(sMarker);
    // For each station, create a marker and bind a popup with the station's name
    
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function

 createMap(L.layerGroup(bikeMarkers)); 
}

let url="https://api.sportsdata.io/v3/nfl/scores/json/Stadiums?key=7c081c14b9824c5897e3c2325d3a3647";
// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json(url, createMarkers);

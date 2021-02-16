//Check if JS is properly connected
console.log('Ok connected 23 - app.js');
//Get jsonData
let jsonData = '/api/v1.0/teams'; //NEED TO FIX - TO GET FROM URL
let jsonStadiums='static/Data/stadiums_nfl.json';
var jsonPlotData = '/static/Data/plot.json';
// let jsonData = '../Data/nflData.json'; //NEED TO FIX - TO GET FROM URL
// let jsonData = '../Data/TeamsData.json'; // (ref 1)
// let jsonData = '../Data/nfl_teams.json'; // (ref 2)
// let jsonStadiums='../Data/stadiums_nfl.json';


granimInstance = new Granim({
    element: '#canvas-basic',
    name: 'granim',
    opacity: [1, 1],
    states : {
        "default-state": {
            gradients: [
                ['#34495E', '#F7F9F9'],
                ['#1B4F72', '#000080']
            ]
        }
    }
});

// Icon
let Icon = L.icon({
            iconUrl: 'static/images/logo1.png',
            shadowUrl: 'static/images/logo2.png',
            iconSize:     [30, 48], // size of the icon
            shadowSize:   [25, 20], // size of the shadow
            iconAnchor:   [16, 80], // point of the icon which will correspond to marker's location
            shadowAnchor: [12, 50],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

  // Create the tile layer that will be the background of our map
  let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  let baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  /* let overlayMaps = {
    "NFL Stadiums": Stadiums
  }; */
    
  // Create the map object with options
  let map = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap]
  });

let Markers= L.marker();
let Stadiums =L.marker();
/**
 * Execute init functions
 */
function init(){
    fillDropdown();
    createMarkers();
}

/**
 * Get Team Names from JSON to fillout dropdown
 */
function fillDropdown(){
    d3.json(jsonData).then((data) => {
        console.log(data)
        let teams = data.data[0]; // para /api/v1.0/teams
        // let teams = data.data; // Para leer directo del Json (ref 1)
        // let teams = data; // Para leer directo del Json completo (ref 2)

        //Dropdowns
        //Dropdown Selected by Team
        d3.select("#selectedTeam").append("option").text('-Select Team-')
        for(x in teams){
            d3.select("#selectedTeam").append("option").text(teams[x].FullName);
        }

        //Dropdown Selected by Coach
        // d3.select("#selectedCoach").append("option").text('-Select Coach-')
        // for(x in teams){
        //     d3.select("#selectedCoach").append("option").text(teams[x].HeadCoach);
        // }
    });
}

/**
 * Get URL from JSON and dispplay in dashboard
 * @param {string} selectedTeam Team selected in dropdown
 */
function optionChanged(selectedTeam){
    console.log(`Selected Team: ${selectedTeam}`)
    d3.json(jsonData).then((data) => {
        console.log(data)
        let teams = data.data[0]; // para /api/v1.0/teams
        // let teams = data.data; // Para leer directo del Json
        // let teams = data; // Para leer directo del Json completo (ref 2)

        //Display image
        for(x in teams){
            //console.log(teams[x].Logo)
            if(selectedTeam==teams[x].FullName){

                plotdata(selectedTeam,teams[x].PrimaryColor);
                //console.log(teams[x].Logo)
                d3.select('#teamLogo').attr('src',teams[x].WikipediaLogoUrl) // para /api/v1.0/teams
                d3.select('#teamLogoName').attr('src',teams[x].WikipediaWordMarkUrl) // para /api/v1.0/teams

                d3.select('#teamInfo').html(`
                    Official Name: ${teams[x].FullName} <br>
                    City: ${teams[x].City} <br> 
                    Conference: ${teams[x].Conference} <br>
                    Division: ${teams[x].Division} <br>  
                    Head Coach: ${teams[x].HeadCoach} <br> 
                `);

                d3.select('#stadiumInfo').html(`
                    Name: ${teams[x].StadiumDetails.Name} <br>
                    City: ${teams[x].StadiumDetails.City} <br>                    
                    Capacity: ${teams[x].StadiumDetails.Capacity} <br>
                    PlayingSurface: ${teams[x].StadiumDetails.PlayingSurface} <br>
                    Type: ${teams[x].StadiumDetails.Type} <br>
                `);

                Markers.remove()
                Stadiums.remove()
                Markers=L.marker([teams[x].StadiumDetails.GeoLat, teams[x].StadiumDetails.GeoLong],{icon:Icon})
                .bindPopup("<h3>" + teams[x].StadiumDetails.Name + "<h3><h3>Capacity: " + teams[x].StadiumDetails.Capacity + "</h3><h3>Type: " + teams[x].StadiumDetails.Type + "</h3>").addTo(map);
                
             
            }
        }
    });
}

//Map Base
function createMarkers() {
    d3.json(jsonStadiums).then((data) => {        
        //console.log(data)
        
        let stadiums = data;        
        console.log(stadiums);

        // Initialize an array to hold stadiums markers
        stadiumMarkers = []; 
    
        // Loop through the stadiums array
        for (var index = 0; index < stadiums.length; index++) {
            var stadium = stadiums[index];
            //console.log(stadium);
            // For each stadium, create a marker and bind a popup with the stadium's name
            let sMarker=L.marker([stadium.GeoLat, stadium.GeoLong], {icon:Icon})
            .bindPopup("<h3>" + stadium.Name + "<h3><h3>Capacity: " + stadium.Capacity + "</h3><h3>Type: " + stadium.Type + "</h3>");
            //console.log(sMarker);    
            stadiumMarkers.push(sMarker);
            //console.log(stadiumMarkers);        
        }

        Stadiums=L.layerGroup(stadiumMarkers).addTo(map);
        //console.log(Stadiums);



 });
} 

/**
 * Plot data based on 
 * @param {string} selectedTeam Team selected in dropdown
 */
function plotdata(selectedTeam, PrimaryColor){
    console.log(`Plot function:${selectedTeam} : ${PrimaryColor}`)
    d3.json(jsonPlotData).then((data) => {
        let teamsstats = data;
        for(x in teamsstats){
            if(selectedTeam==teamsstats[x].FullName){
                let x_values = ['Passing Yds Per Game','Passing Yds','Rushing Yards Per Game','Rush Yds','Total Yds','Yard Per Game']
                let y_values = [teamsstats[x].PYdsG,teamsstats[x].PassYds,teamsstats[x].RYdsG,teamsstats[x].RushYds,teamsstats[x].TotYds,teamsstats[x].YdsG]
                //console.log(PrimaryColor);
                let data = [
                    {
                      x: x_values,
                      y: y_values,
                      type: 'bar',
                      marker:{color: PrimaryColor}
                      //marker:{color: ['#4472C4','#ED7D31','#A5A5A5','#FFC000','#5B9BD5','#70AD47']}
                    }
                  ];
                let layout = {
                    yaxis: {range: [0, 7000]},
                    title: {
                        text:'2020 NFL Team Offense Statistics',
                        font: {size: 24}
                    },
                    images: [
                        {
                          "source": "https://upload.wikimedia.org/wikipedia/commons/2/2d/American_football_icon_simple_flat.svg",
                          "xref": "x",
                          "yref": "y",
                          "x": 0, //Start on x from chart
                          "y": 7000, //Start on y from chart
                          "sizex": 0.8,
                          "sizey": 2000, //Size based on the y scale
                          "sizing": "stretch",
                          "opacity": 0.5,
                          "layer": "below"
                        }
                      ]
                };
                Plotly.newPlot('plot', data, layout);
            }
        }
    });
}

//Execute init fuctions
init();


 
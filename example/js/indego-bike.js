/* =====================
  The point of this example is to show what it looks like to filter a live data stream
===================== */

/*jshint esversion: 6 */

// link to live json stream of indego data
var rideIndego = "https://www.rideindego.com/stations/json/";


// setting variables to persist outside of the ajax function calls
var popupText;
var bikeData;
var stations;
var cleanStations;

// async ajax call
var getBikeData = function() {
  $.ajax(rideIndego).done(function(ajaxResponseValue) {
      // a function that does some kind of transformation on the response
      bikeData = ajaxResponseValue;
      // Turn the ajax json return into a familiar object format
      stations = new Object(bikeData.features);
      // removing the `geometries` to make it easier to show off some underscore examples
      cleanStations = _.map(stations, (station) => {return station.properties });
      console.log(stations);
      // Plot the stations as markers
      _.forEach(stations, function(x){
        popupText = x.properties.name,
        L.marker([x.geometry.coordinates[1], x.geometry.coordinates[0]]).bindPopup(popupText).addTo(layerGroup);});
    });
};

// run the ajax function
getBikeData();

// create a feature group to provide additional controls over the markers
// read more about layer groups here: https://leafletjs.com/examples/layers-control/
// It makes it easier to control a group of markers
var layerGroup = L.featureGroup().addTo(map);


/*  ----  THIS IS HOW YOU CLEAR A LAYER GROUP   ----- */
// layerGroup.clearLayers();

var findElectricBikes = (e) => _.filter(e, function(num){ return num.properties.electricBikesAvailable !== 0;});

var countFunc = (stations, lowNum) => _.countBy(stations, function(num) {
  if (num.properties.bikesAvailable > lowNum) {
    return 'plenty';
  } else {
    return 'low';
  }
});

//   This is what the above predicate looks like with ther ternary operator
//   return num["properties"]["bikesAvailable"] > 2 ? 'plenty': 'low';

// Function to find bikes with low number of stations
var findLowStations = (stations, lowNum) => _.filter(stations, function(num){ return num.properties.bikesAvailable <= lowNum;});


// function to plot stations
plotStations = (station) =>  _.forEach(station, function(x){
        L.marker([x.geometry.coordinates[1], x.geometry.coordinates[0]]).bindPopup(x.properties.name).addTo(layerGroup);});


/* ------------------

// Try out some other underscore functions on this datasets

// Group by stations that have more than 5 bikes available
_.groupBy(cleanStations, (station) => {return station.bikesAvailable > 5});


// now try it after defining your own predicate
var greaterThanFive = (station) => {return station.bikesAvailable > 5});
_.groupBy(cleanStations, greaterThanFive)

_.pluck(cleanStations, 'name')

 ------------------- */

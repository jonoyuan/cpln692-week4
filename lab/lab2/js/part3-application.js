/* == THIS BRANCH IS ABANDONED
  For some reason, when calling map.removeLayer() inside an if statement, all
  layers are hidden while only some layers are removed. In the `map` object,
  some layers still exist, but none are displayed. Line 152
*/

/* =====================
  Lab 2, part3: a full application

  We're going to use the skills we've just been practicing to write a full application
  which is responsive to user input.
  At your disposal are a set of variables which we use to track user input (see
  part3-main.js and part3-setup.js for more details on how this is done — we'll
  cover this topic at a later date). Their values will be logged to console to
  aid in debugging.

  In this lab, which is very much open-ended, your task is to use the value of
  these variables to define the functions below. Try to come up with interesting
  uses of the provided user input.

  Some ideas:
    There are two numeric fields: can you write this application to filter
    using both minimum and maximum?
    There is a boolean (true/false) field: can you write your code to filter according
    to this boolean? (Try to think about how you could chop up this data to make this meaningful.)
    There is a string field: can you write your code to filter/search based on user
    input?

  Remember, this is open-ended. Open ended doesn't mean pointless: we're looking for
  filters that might actually be useful. Try to see what you can produce.
===================== */

/* =====================
  Define a resetMap function to remove markers from the map and clear the array of markers
===================== */
var resetMap = function() {
  map.eachLayer(function(layer) {
    if (layer != Stamen_TonerLite) {
      map.removeLayer(layer);
    }
  });
  //myMarkers = []; // I only want to do this once in getAndParseData(); to remove the bogus data

  _.each(myMarkers, mk => mk.addTo(map))

  console.log("Map reset");
};

/* =====================
  Define a getAndParseData function to grab our dataset through a jQuery.ajax call ($.ajax). It
  will be called as soon as the application starts. Be sure to parse your data once you've pulled
  it down!
===================== */
crash = L.CircleMarker.extend({
  options: {
    CRASH_YEAR:undefined,
    POLICE_AGC:undefined,
    ALCOHOL_RE:undefined,
    SHOW_MAP:1,
  }
});
var getAndParseData = function() {
  myMarkers = [];
  resetMap();
  $.ajax(
    "https://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/json/philadelphia-bike-crashes-snippet.json"
  ).done((data) => {

    popo = [];
    hour = [];

    let parsed = JSON.parse(data);
    parsed.forEach(pt => {
      let popup = `
        Hour of Day: ${pt.HOUR_OF_DA}<br>
        Police agency code: ${pt.POLICE_AGC}<br>
        Alcohol-related: ${pt.ALCOHOL_RE === 1}
      `;
      let mk = new crash([pt.LAT,pt.LNG], {
        color: 'red',
        radius: 1,
        HOUR_OF_DA: pt.HOUR_OF_DA,
        POLICE_AGC: pt.POLICE_AGC,
        ALCOHOL_RE: pt.ALCOHOL_RE
      }).bindPopup(popup);

      myMarkers.push(mk);
      popo.push(pt.POLICE_AGC);
      hour.push(pt.HOUR_OF_DA);

      mk.addTo(map);

    });

    $('#string,#num1,#num2').prop("value","");
    $('#my-button').html("Filter me!");
    $('#string,.num,#boolean,#my-button,option').prop("disabled",false);
    $('option').remove();

    popo = new Set(popo.sort());
    popo.forEach(function(value) {
      $('#string')
        .append($("<option></option>")
          .attr("value",value)
          .text(value)
        );
    });

    hour = new Set(_.each(hour,Number).sort(function(a, b){return a-b}));
    hour.forEach(function(value) {
      $('.num')
        .append($("<option></option>")
          .attr("value",value)
          .text(value)
        );
    });
  });

  console.log("Map ready");
};

/* =====================
  Call our plotData function. It should plot all the markers that meet our criteria (whatever that
  criteria happens to be — that's entirely up to you)
===================== */

var notbetween = function(num, a, b) {
  num = Number(num); a = Number(a); b = Number(b);
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  if (num !== undefined) {return num < min || num > max;}
  else {return true;}
};

var lyr;
var con = [];

var plotData = function() {
  lyr = 0;

  map.eachLayer(function(layer) {
    if (layer != Stamen_TonerLite) {
      let opt = layer.options;

      let num = notbetween(opt.HOUR_OF_DA,numericField1,numericField2);
      let str = opt.POLICE_AGC == stringField;

      let condition = str;

      if (condition) {
        lyr = lyr + 1;
        map.removeLayer(layer);
        // For some reason, all layers are not displayed even if only a few are removed
      }
    }
  });

  console.log(`Removed ${lyr} layers`);
};

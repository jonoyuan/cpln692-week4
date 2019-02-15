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
var resetMap = function(redraw = true) {
  map.eachLayer(function(layer) {
    if (layer != Stamen_TonerLite) {
      map.removeLayer(layer);
    }
  });
  //myMarkers = []; // I only want to do this once in getAndParseData(); to remove the bogus data
  if (redraw) {_.each(myMarkers, mk => mk.addTo(map))}

  $("div#crash-wrap").css("display","none")

  console.log("Map reset");
};

/* =====================
  Define a getAndParseData function to grab our dataset through a jQuery.ajax call ($.ajax). It
  will be called as soon as the application starts. Be sure to parse your data once you've pulled
  it down!
===================== */
crash = L.CircleMarker.extend({
  options: {
    CRN:undefined,
    CRASH_YEAR:undefined,
    POLICE_AGC:undefined,
    ALCOHOL_RE:undefined,
    SHOW_MAP:1,
  }
});

var getAndParseData = function() {
  $.ajax(
    "https://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/json/philadelphia-bike-crashes-snippet.json"
  ).done((data) => {

    myMarkers = [];
    var popo = [];
    var hour = [];

    let parsed = JSON.parse(data);
    parsed.forEach(pt => {
      let popup = `
        <strong>CRN: ${pt.CRN}</strong><br>
        Hour of Day: ${pt.HOUR_OF_DA}<br>
        Police agency code: ${pt.POLICE_AGC}<br>
        Alcohol-related: ${pt.ALCOHOL_RE === 1}
      `;
      let mk = new crash([pt.LAT,pt.LNG], {
        color: 'red',
        radius: 1,
        CRN: pt.CRN,
        HOUR_OF_DA: pt.HOUR_OF_DA,
        POLICE_AGC: pt.POLICE_AGC,
        ALCOHOL_RE: pt.ALCOHOL_RE
      }).bindPopup(popup);

      myMarkers.push(mk);

      popo.push(pt.POLICE_AGC);
      hour.push(pt.HOUR_OF_DA);

    });

    $('#string,#num1,#num2').prop("value","");
    $('#my-button').html("Filter me!");
    $('#string,.num,#boolean,#my-button,option').prop("disabled",false);
    $('option').html("");

    popo = new Set(popo.sort());
    popo.forEach(function(value) {
      $('#string')
        .append($("<option></option>")
          .attr("value",value)
          .text(value)
        );
    });

    hour = new Set(_.each(hour,parseFloat).sort(function(a, b){return a-b}));
    hour.forEach(function(value) {
      $('.num')
        .append($("<option></option>")
          .attr("value",value)
          .text(value)
        );
    });

    resetMap();
    console.log("Data ready");

  });

};

/* =====================
  Call our plotData function. It should plot all the markers that meet our criteria (whatever that
  criteria happens to be — that's entirely up to you)
===================== */

var fnum = function(num, a, b) {
  num = parseFloat(num); a = parseFloat(a); b = parseFloat(b);
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  if (Number.isNaN(a) && Number.isNaN(b))
                              {return true;}
  else if (Number.isNaN(a))   {return num == b;}
  else if (Number.isNaN(b))   {return num == a;}
  else if (num !== undefined) {return num >= min && num <= max;}
  else                        {return false;}
};

var fstr = function(txt, stringField) {
  if      (stringField == "none")      {return true;}
  else if (txt == stringField) {return true;}
  else                         {return false;}
};

var fboo = function(alc, booleanField) {
  alc = alc === 1;
  if      (booleanField && alc)  {return true;}
  else if (booleanField && !alc) {return false;}
  else                           {return true;}
};

var plotData = function() {

  resetMap(redraw = false);

  let counter = 0;
  let output = [];

  myMarkers.forEach(function(mk) {

    let opt = mk.options;

    let num = fnum(opt.HOUR_OF_DA,numericField1,numericField2);
    let str = fstr(opt.POLICE_AGC,stringField);
    let boo = fboo(opt.ALCOHOL_RE,booleanField);

    if (num && str && boo) {
      counter += 1;
      mk.addTo(map);

      let popup = `<p>
        <strong>CRN: ${opt.CRN}</strong><br>
        Hour of Day: ${opt.HOUR_OF_DA}<br>
        Police agency code: ${opt.POLICE_AGC}<br>
        Alcohol-related: ${opt.ALCOHOL_RE === 1}
      </p>`;

      output.push(popup);
    }

  });

  $("div#crash-wrap").css("display","initial")
  $("div#crash-wrap>p").html(`${counter} displayed`)
  $("div#crashes").html(output);

  console.log(`${counter} points drawn`)

};

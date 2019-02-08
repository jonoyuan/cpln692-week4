// This function will run the provided operation on the provided
//  argument after the provided delay.
var runAfter = function(run, runArg, runDelay, delayFunc) {
  delayFunc = delayFunc || function(x) { return x * 1000; };
  // This 'Deferred' thing is exactly what ajax calls use!
  var d = $.Deferred();
  d.promise()
    .done(function(a) { // A callback function
      console.log("Running provided function after", delayFunc(runDelay) / 1000, "seconds");
      run(a);
    });
    // apply the provided function after a specified number of milliseconds
    setTimeout(function() {
      d.resolve(runArg);
    }, delayFunc(runDelay) );
};

// We will use this make integers into seconds for delayFunc above
var seconds = function(x) { return x * 1000; };
var ms = function(x) { return x; };

// Logic related to button/counter
var addButton = $("#addButton");
var addCounter = $("#addCounter");
var count = 0; // this variable will be updated along with the visual count
var delay = 2; // play with this value to change the delay after clicking
var delayFunc = seconds; // this can be seconds or ms (or any function you write!)

// This function simply adds one to the provided number and then updates the count
var addOneToCounter = function(currentCount) {
  var newCount = currentCount + 1;
  count = newCount;
  addCounter.text(newCount);
};

// Initialize the page
addCounter.text(count); // Set initial value
addButton.click(function() {
  var oldCount = parseInt(addCounter.text(), 10);
  runAfter(addOneToCounter, oldCount, delay, delayFunc);
});



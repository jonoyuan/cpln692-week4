// The fibonnacci sequence (memoized means it saves already-computed results!)
var fibonacci = function(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

var fastfib = _.memoize(fibonacci)


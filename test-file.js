// Test file with various linting issues
var unusedVar = "this variable is not used";
var multipleSpaces    = "extra spaces";
var badNamingConvention = "should use camelCase";
console.log("Hello, world!"  ); // extra space
if(true){var x=1;} // missing spaces around keywords and operators

function badFunction( ){ // space in function parentheses
    var y = x + 2;; // double semicolon
    return y;
} // missing semicolon

// Multiple blank lines

var globalVar = "global variable";

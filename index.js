const square = require('banach-analysis');

console.log('should be 4: ', square(2,2));

module.exports = function(add) {
    console.log('Should be 6: ', square(2,2) + 2);
    return square(2,2) + 2;
}

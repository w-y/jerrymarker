var jerrymarker = require ('../dist/jerrymarker.min.js');
var template = jerrymarker.compile('Hello ${name}!');

console.log(template({
    name: 'Bob'
}));



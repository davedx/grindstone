var api = require('./api.js'),
	db = require('./db.js'),
	fs = require('fs');

var input = fs.readFileSync('api.json.txt');
var json = JSON.parse(input);
console.log("Generating API");
var server = api.generate(json);

server.invoices.create({company: "NASA", amount: 5000});

console.log(db.find("invoices"));
/*
console.log("Testing db");

console.log(db.find("Invoices"));

// test
var inv = db.findOne("Invoices", {id: "1"});
console.log(inv);
db.update("Invoices", {id: "1"}, {company: "Bob"});
var minv = db.findOne("Invoices", {id: "1"});
console.log(minv);
*/


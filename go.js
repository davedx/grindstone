var api = require('./api.js'),
	db = require('./db.js'),
	Decorator = require('./hateoas.js'),
	fs = require('fs');

var input = fs.readFileSync('api.json.txt');
var json = JSON.parse(input);
console.log("Generating API");
var server = api.generate(json);
server.decorator = new Decorator('v1');

var user = {
	id: "1",
	name: "Dave",
	roles: [ "user" ]
};
server.setUser(user);

console.log("==== create");
var result = server.invoices.create({data: {company: "NASA", amount: 5000}});
var id = result.id;
console.log(db.find("invoices"));

console.log("==== read");
var nasa = server.invoices.read({cond: {id: id}});
console.log(nasa);

console.log("==== update");
var r = server.invoices.update({cond: {id: id}, data: {amount: 6000}});
console.log(r);
var nasa = server.invoices.read({cond: {id: id}});
console.log(nasa);

console.log("==== delete");
server.invoices.delete({id: id});

console.log(db.find("invoices"));
//console.log(db.find("invoices"));
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


var api = require('./api.js'),
	db = require('./db.js'),
	Decorator = require('./hateoas.js'),
	fs = require('fs'),
	express = require('express');

var app = express();

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

console.log(server);
// add routes from API
//for(var k in server)
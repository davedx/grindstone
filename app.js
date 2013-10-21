var api = require('./api.js'),
	db = require('./db.js'),
	Decorator = require('./hateoas.js'),
	paths = require('./paths.js'),
	fs = require('fs'),
	express = require('express'),
	Router = require('reversable-router');

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
var routes = [];
var app = express();
//var router = new Router();
//router.extendExpress(app);
//router.registerAppHelpers(app);

var make_handler = function(fn) {
	return function(req, res) {
		//console.log("Invoking "+method+" on "+collection);
		var response = fn(req);
		res.setHeader('Content-Type', 'application/json');
		res.send(response);
	}
};

for(var collection in server.methods) {
	for(var method in server.methods[collection]) {
		var path = paths.getPath(collection, method);
		console.log("Adding route: " + path);
		routes.push(path);

		app.get(path, make_handler(server.methods[collection][method]));
	}
}
app.get('/', function(req, res) {
	res.setHeader('Content-Type: application/json');
	res.send(routes);
});

var port = 8888;
app.listen(port);
console.log("Listening on "+port);

var api = require('./api.js'),
	db = require('./db.js'),
	Decorator = require('./hateoas.js'),
	paths = require('./paths.js'),
	http = require('./http.js'),
	fs = require('fs'),
	express = require('express');

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
// for client examples
app.use(express.static(__dirname + '/static'));

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
		var verb = http.getVerb(method);
		console.log("Adding route: " + verb + " " + path);
		routes.push({verb: verb, path: path});

		app[verb](path, make_handler(server.methods[collection][method]));
	}
}
app.get('/', function(req, res) {
	res.setHeader('Content-Type: application/json');
	res.send(routes);
});

var port = 8888;
app.listen(port);
console.log("Listening on "+port);

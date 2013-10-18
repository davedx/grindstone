var db = require('./db.js');

var make_id = function() {
	return Date.now();
};

var make_fn = function(col, method) {
	return function(obj) {
		if(method === "create") {
			console.log("Inserting "+obj+" on "+col);
			db.insert(col, make_id(), obj);
		}
		console.log(col + " " + method + " " + obj);
	}
};

exports.generate = function (input) {
	var roles = input.roles;
	var methods = input.methods;
	var api = {};
	for(var collection in methods) {
		api[collection] = {};

		for(var method in methods[collection]) {

			api[collection][method] = make_fn(collection, method);
		}
	}
	return api;
};

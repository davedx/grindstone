var db = require('./db.js');

var make_id = function() {
	return ""+Date.now();
};

var make_fn = function(col, method) {
	return function() {
		if(method === "create") {
			var obj = arguments[0];
			console.log("[Insert] "+obj+" on "+col);
			var id = make_id();
			db.insert(col, id, obj);
			return id;
		} else if(method === "read") {
			var cond = arguments[0];
			console.log("[Read] "+col);//+" cond: "+JSON.stringify(cond));
			return db.find(col, cond);
		} else if(method === "update") {
			var cond = arguments[0];
			var obj = arguments[1];
			console.log("[Update] "+obj+" on "+col);
			return db.update(col, cond, obj);
		} else if(method === "delete") {
			var cond = arguments[0];
			console.log("[Delete] "+col);
			return db.delete(col, cond);
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

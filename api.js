var db = require('./db.js');

var make_id = function() {
	return ""+Date.now();
};

var check_owner = function(col, cond, userId) {
	var items = db.find(col, cond);
	for(var k in items) {
		if(items[k].owner !== userId)
			return false;
	}
	return true;
};

var make_fn = function(col, method, roles, hateoas) {
	return function(params) {
		// authorization
		var authed = false;
		var checkOwner = false;

		for(var i = 0; i < roles.length; i++) {
			if(roles[i] === "all") {
				authed = true;
				break;
			} else if(roles[i] === "owner") {
				checkOwner = true;
			} else if(this.userHasRole(roles[i])) {
				authed = true;
				break;
			}
		}

		var cond = params.cond;
		var obj = params.data;

		if(checkOwner && !authed) {
			authed = check_owner(col, cond, this.userId);
		}

		if(!authed)
			throw "Not allowed to access this resource: "+method+" on "+col;

		var result = {};
		// incantation
		if(method === "create") {
			if(this.userId)
				obj.owner = this.userId;
			var id = make_id();
			db.insert(col, id, obj);
			result = {id: id};
		} else if(method === "read") {
			result = {data: db.find(col, cond)};
		} else if(method === "update") {
			result = {affected: db.update(col, cond, obj)};
		} else if(method === "delete") {
			result = {affected: db.delete(col, cond)};
		}

		if(this.decorator)
			result = this.decorator.decorate(this, col, result);

		console.log("[" + method + "] " + col);
		return result;
	}
};

exports.generate = function (input) {
	var api = {};
	var methods = input.methods;
	for(var collection in methods) {
		api[collection] = {};

		for(var method in methods[collection]) {
			var roles = methods[collection][method].roles;
			api[collection][method] = make_fn(collection, method, roles).bind(api);
		}
	}
	api.meta = input;

	api.setUser = function(user) {
		this.userId = user.id;
		this.user = user;
	};
	api.userHasRole = function(role) {
		if(!this.user)
			throw "No user";
		for(var i = 0; i < this.user.roles.length; i++) {
			if(this.user.roles[i] === role)
				return true;
		}
		return false;
	}
	return api;
};

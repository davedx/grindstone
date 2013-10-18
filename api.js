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

var make_fn = function(col, method, roles) {
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

		// incantation
		if(method === "create") {
			if(this.userId)
				obj.owner = this.userId;
			console.log("[Insert] "+obj+" on "+col);
			var id = make_id();
			db.insert(col, id, obj);
			return id;
		} else if(method === "read") {
			console.log("[Read] "+col);//+" cond: "+JSON.stringify(cond));
			return db.find(col, cond);
		} else if(method === "update") {
			console.log("[Update] "+obj+" on "+col);
			return db.update(col, cond, obj);
		} else if(method === "delete") {
			console.log("[Delete] "+col);
			return db.delete(col, cond);
		}
		console.log(col + " " + method + " " + obj);
	}
};

exports.generate = function (input, hateoas) {
	var roles = input.roles;
	var methods = input.methods;
	var api = {};
	for(var collection in methods) {
		api[collection] = {};

		for(var method in methods[collection]) {
			var roles = methods[collection][method].roles;
			api[collection][method] = make_fn(collection, method, roles).bind(api);
		}
	}
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

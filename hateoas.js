var paths = require('./paths.js'),
		http = require('./http.js');

var baseUrl = 'v1';

module.exports = function(baseUrl) {
	console.log("Making HATEOAS decorator with: "+baseUrl);
	this.baseUrl = baseUrl;

	this.decorate = function(api, col, response) {
		// let's see what we can do
		var actions = {};
		var meta = api.meta;
		for(var method in meta.methods[col]) {
			var m = meta.methods[col][method];
			var hasRole = false;
			for(var i = 0; i < m.roles.length; i++) {
				if(m.roles[i] === 'owner' || m.roles[i] === 'all' || api.userHasRole(m.roles[i])) {
					hasRole = true;
					break;
				}
			}

			// HATEOAS means hypertext, so let's map collections and methods to HTTP here
			if(hasRole) {
				actions[method] = {verb: http.getVerb(method), path: paths.getPath(col, method)};
			}
			//TODO: if necessary: base (e.g. "http://localhost:8888/") and self (e.g. "/invoices/read")
		}
		response.actions = actions;
		return response;
	};
}

// ultra lightweight mongo mock
var fs = require('fs');

var data = fs.readFileSync('data_mock.json.txt');
var json = JSON.parse(data);

exports.find = function(col, cond) {
	var r = [];
	for(var id in json[col]) {
		var item = json[col][id];
		var match = true;
		for(var k in cond) {
			if(item[k] !== cond[k])
				match = false;
		}
		if(match)
			r.push(item)
	}
	return r;
}
exports.findOne = function(col, cond) {
	var id = cond.id;
	return json[col][id];
};

exports.update = function(col, cond, set) {
	var item = this.findOne(col, cond);
	if(item) {
		for(var k in set) {
			item[k] = set[k];
		}
		return true;
	}
	return false;
};

exports.insert = function(col, id, set) {
	json[col][id] = set;
};
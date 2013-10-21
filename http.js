exports.getVerb = function(method) {
	if(method === 'create')
		return 'post';
	else if(method === 'read')
		return 'get';
	else // update or delete
		return 'put';
};

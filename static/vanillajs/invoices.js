var ajax = (function() {
	var call = function(url, method, params, callback) {
		var r = new XMLHttpRequest();
		r.open(method, url, true);
		r.onreadystatechange = function () {
			if (r.readyState != 4 || r.status != 200) return;
			callback(r);
		};
		r.send(params);		
	}
	return {
		get: function(url, callback) {
			call(url, 'GET', '', callback);
		},
		post: function(url, params, callback) {
			call(url, 'POST', params, callback);
		},
		put: function(url, params, callback) {
			call(url, 'PUT', params, callback);
		}
	};
})();

var client = (function() {
	var showControls = function(type, actions) {
		var createVisible = actions.create;
		var updateVisible = type === 'item' ? actions.update : false;
		var deleteVisible = type === 'item' ? actions.delete : false;
		document.getElementById('create').style.display = createVisible ? 'block' : 'none';
		document.getElementById('update').style.display = updateVisible ? 'block' : 'none';
		document.getElementById('delete').style.display = deleteVisible ? 'block' : 'none';
		var list = document.getElementById('list');
		var item = document.getElementById('item');
		//list.style.display = type === 'list' ? 'block' : 'none';
		item.style.display = type === 'item' ? 'block' : 'none';
	};
	var getDataFromForm = function() {
		var itemForm = document.getElementById('item');
		var data = {};
		var id;
		for(var i = 0; i < itemForm.childNodes.length; i++) {
			var c = itemForm.childNodes[i];
			var input = c.getElementsByTagName('input')[0];
			var key = input.getAttribute('name');
			var value = input.getAttribute('value');
			if(key === 'id')
				id = value;
			else
				data[key] = value;
		}
		return {id: id, data: data};
	};
	return {
		bindEvents: function() {
			document.getElementById('create').addEventListener('click', client.showCreate, false);
			document.getElementById('update').addEventListener('click', client.update, false);
			document.getElementById('delete').addEventListener('click', client.delete, false);
		},
		showCreate: function() {
			//TODO: HMMMM. How do we know what the form should look like? This is the only place where
			//we need to know anything about the application.
			throw "Not implemented";
			//showControls('item', {});
		},
		create: function() {
			var item = getDataFromForm();
			console.log("Creating: "+item.data);
		},
		update: function() {
			var item = getDataFromForm();
			var form = document.getElementById('item');
			var collection = form.getAttribute('action');
			if(!item.id)
				throw "No ID";
			console.log("Updating: ", item.data);
			ajax.put('/' + collection + '/update', JSON.stringify({cond: {id: item.id}, data: item.data}), function(r) {
				console.log(r);
			});
		},
		delete: function() {
			console.log("delete");
		},
		list: function(collection) {
			ajax.get('/' + collection + '/read', function(r) {
				var json = JSON.parse(r.responseText);
				console.log("Loaded: ", json);
				// get and clear the list
				var list = document.getElementById('list');
				var fc = list.firstChild;
				while(fc) {
					list.removeChild(fc);
					fc = list.firstChild;
				}
				var makeHandler = function(collection, id) {
					return function(e) {
						e.preventDefault();
						client.item(collection, id);
					}
				};
				// add what's in here to list
				for(var id in json.data) {
					var a = document.createElement('a');
					a.setAttribute('href', '');
					a.addEventListener('click', makeHandler(collection, id));
					var textNode = document.createTextNode(id + ': ' + json.data[id].company);
					a.appendChild(textNode);
					var li = document.createElement('li');
					li.appendChild(a);
					list.appendChild(li);
				}

				// show/hide which controls are available to this user
				showControls('list', json.actions);
			});

		},
		item: function(collection, id) {
			console.log("ITEM "+collection + ", "+id);
			ajax.get('/' + collection + '/read', function(r) {
				var json = JSON.parse(r.responseText);
				var item = json.data[id];
				// get and clear the item form
				var itemForm = document.getElementById('item');
				var fc = itemForm.firstChild;
				while(fc) {
					itemForm.removeChild(fc);
					fc = itemForm.firstChild;
				}
				itemForm.setAttribute('action', collection);
				for(var k in item) {
					var div = document.createElement('div');
					var label = document.createElement('label');
					label.appendChild(document.createTextNode(k));
					var input = document.createElement('input');
					input.setAttribute('value', item[k]);
					input.setAttribute('name', k);

					div.appendChild(label);
					div.appendChild(input);
					itemForm.appendChild(div);
				}
				if(id) {
					var div = document.createElement('div');
					var idInput = document.createElement('input');
					idInput.setAttribute('name', 'id');
					idInput.setAttribute('value', id);
					idInput.setAttribute('type', 'hidden');
					div.appendChild(idInput);
					itemForm.appendChild(div);
				}
				console.log("Loaded: ", item);
				showControls('item', json.actions);
			});
		}
	}
})();

var init = function() {
	client.bindEvents();
	client.list('invoices');
};

window.onload = init();

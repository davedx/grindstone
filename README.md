Grindstone
==========

An API builder in progress.

The idea is to combine some things that have been done:

* Rails: scaffolding of API call handlers, resourceful routing
* Meteor: user ownership of data by default

With some new ideas:

* Declarative resources (at the moment resources are declared as JSON)
* Role-based access control by default, with roles part of the API declaration
* HATEOAS (Hypertext as the engine of application state), as a toggleable decorator, to facilitate dumb single page clients that are decoupled from the application's model schema

See API.json.txt for an example.

TODO:
=====

* Rewrite URLs to be more RESTful, e.g. GET /resource, POST /resource, PUT /resource/:id, DELETE /resource/:id

* Get POST/JSON data into params properly (AJAX on client side? Or param parsing? Or both)


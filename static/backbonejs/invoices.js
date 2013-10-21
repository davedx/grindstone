$(function(){

  // Model
  // -----

  var Invoice = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
      return {
        company: "My Company LLC",
        amount: 0
      };
    },

    // Toggle the `done` state of this todo item.
    set: function(options) {
      this.save(options); // e.g. {company: "Red Sky Forge"}
    }
  });

  // Collection
  var InvoiceList = Backbone.Collection.extend({

    model: Invoice,
    comparator: 'amount',
    url: 'http://localhost:8888/invoices/read'

  });

  // Create our global collection of **Todos**.
  var Invoices = new InvoiceList;

  // The DOM element for a todo item...
  var InvoiceView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .link"     : "followLink",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.edit');
      return this;
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({company: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#app"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-invoice":  "createOnEnter"
    },

    initialize: function() {

      this.input = this.$("#new-invoice");

      this.listenTo(Invoices, 'add', this.addOne);
      this.listenTo(Invoices, 'reset', this.addAll);
      this.listenTo(Invoices, 'all', this.render);

      this.main = $('#main');

      Invoices.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      this.main.show();
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(invoice) {
      var view = new InvoiceView({model: invoice});
      this.$("#invoice-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Invoices.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      console.log("Creating");
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Invoices.create({company: this.input.val()});
      this.input.val('');
    },

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});

"use strict";

var React = require("react");
var Router = require("react-router");
var AuthorForm = require("./authorForm");
var AuthorApi = require("../../api/authorApi");
var toastr = require("toastr");

var ManageAuthorPage = React.createClass({
  mixins: [
      Router.Navigation
  ],

  statics: {
    willTransitionFrom: function(transition, component) {
      if (component.state.dirty && !confirm("Are you sure you want to leave without saving")) {
        transition.abort();
      }
    }
  },

  getInitialState: function() {
    return {
      author: { id: "", firstName: "", lastName: ""},
      errors: {},
      dirty: false
    };
  },

  componentWillMount: function() {
    var authorId = this.props.params.id;
    if (authorId) {
      this.setState({author: AuthorApi.getAuthorById(authorId)});
    }
  },

  setAuthorState: function(event) {
    this.setState({dirty: true});
    var field = event.target.name;
    var value = event.target.value;
    this.state.author[field] = value;
    return this.setState({author: this.state.author});
  },

  authorFormIsValid: function() {
    var isValid = true;
    this.state.errors = {};

    if (this.state.author.firstName.length < 2) {
      this.state.errors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    if (this.state.author.lastName.length < 2) {
      this.state.errors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    this.setState({errors: this.state.errors});

    return isValid;

  },

  saveAuthor: function(event) {
    event.preventDefault();
    if (this.authorFormIsValid()) {
      AuthorApi.saveAuthor(this.state.author);
      this.setState({dirty: false});
      toastr.success("Author Saved");
      this.transitionTo("authors");
    }
  },

  render: function() {
    return (
      <AuthorForm
        author={this.state.author}
        onChange={this.setAuthorState}
        onSave={this.saveAuthor}
        errors={this.state.errors} />
    );
  }
});

module.exports = ManageAuthorPage;
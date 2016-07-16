$ = jQuery = require("jquery");

var React = require("react");
var Home = require("./components/homePage");
var About = require("./components/about/aboutPage");
var Header = require("./components/common/header");


// one way to route (best way is w/ react-router)
(function(win) {
  "use strict";
  var App = React.createClass({
    render: function() {
      var Child;
      switch (this.props.route) {
        case "about":
          Child = About;
          break;
        default:
          Child = Home;
          break;
      }

      return (
        <div>
          <Header/>
          <Child/>
        </div>
      );
    }
  });

  var render = function () {
    var route = win.location.hash.substr(1);
    React.render(<App route={route} />, document.getElementById("app"));
  };

  win.addEventListener("hashchange", render);
  render();
})(window);
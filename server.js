require("dotenv").config();
var keys = require("./keys.js");
var youtube = keys.youtube.key;

var express = require("express");

// var exphbs = require("express-handlebars");
var helmet = require("helmet");
var bearerToken = require("express-bearer-token");

var db = require("./models");

var app = express();

app.use(bearerToken());

app.use(helmet());

var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// // Handlebars
// app.engine(
//   "handlebars",
//   exphbs({
//     // eslint-disable-next-line prettier/prettier
//     defaultLayout: "main",
//   })
// );
// app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "development") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
return app;

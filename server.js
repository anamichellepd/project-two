const express = require("express");
const app = express();
// Data parsingapp.use(express.urlencoded({ extended: true }));app.use(express.json());
require("./routes/routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

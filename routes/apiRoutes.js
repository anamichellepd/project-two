var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/restaurants", function(req, res) {
    db.Restaurant.findAll({}).then(function(dbRestaurants) {
      res.json(dbRestaurants);
    });
  });

  // Create a new example
  app.post("/api/restaurants", function(req, res) {
    console.log(req.body);

    db.Restaurant.create(req.body).then(function(dbRestaurant) {
      res.json(dbRestaurant);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};

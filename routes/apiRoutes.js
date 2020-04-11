var db = require("../models");
var bcrypt = require("bcrypt");

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
  app.delete("/api/restaurants/:id", function(req, res) {
    db.Restaurant.destroy({ where: { id: req.params.id } }).then(function(
      dbRestaurant
    ) {
      res.json(dbRestaurant);
    });
  });

  app.post("/api/user", function(req, res) {

    db.Restaurant.create(req.body).then(function() {
      return res.send(true);
    }).catch(function(error) {
      return res.status(500).send("Something went wrong.");
    });
  });

  app.post("/api/signin", function(req, res) {
    const { email, password } = req.body;

    db.Restaurant.findOne({
      where: {
        email,
      },
    }).then(function(user) {
      if (!user) {
        return res.status(406).send("User not found.");
      }
      
      bcrypt.compare(myPlaintextPassword, has, function(err,result) {
if (err) {
  console.log(err);

  return res.status(500).send("Service unavailable");  
}

if (!result) {
  return res.status(401).send("Unauthorized");
}
res.send({
  jwt: "JWT GOES HERE",
});

      });

    });
    
  });
};

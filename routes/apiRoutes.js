var db = require("../models/");
var bcrypt = require("bcrypt");
var jwt = require("jwt-simple");

const checkJWT = (req, res, next) => {
  try {
    var decoded = jwt.decode(req.token, process.env.JWT_SECRET);
  } catch (error) {
    console.log("ERROR", error);

    next();
  }

  req.user = decoded;

  next();
};

module.exports = function(app) {
  // Get all restauarants
  //app.get("/api/restaurants", checkJWT, function(req, res) {
  app.get("/api/restaurants", function(req, res) {
    db.Restaurant.findAll({}).then(function(dbRestaurants) {
      res.json(dbRestaurants);
    });
  });

  // Create a new restauarant
  app.post("/api/restaurants", function(req, res) {
    console.log(req.body);

    db.Restaurant.create(req.body).then(function(dbRestaurant) {
      res.json(dbRestaurant);
    });
  });

  // Delete a restauarant by id
  app.delete("/api/restaurants/:id", function(req, res) {
    db.Restaurant.destroy({ where: { id: req.params.id } }).then(function(
      dbRestaurant
    ) {
      res.json(dbRestaurant);
    });
  });

  app.post("/api/user", function(req, res) {
    console.log(req.body);

    db.User.create(req.body)
      .then(function() {
        return res.send(true);
      })
      .catch(function(error) {
        return res.status(500).send("Something went wrong.");
      });
  });

  app.get("/api/user", function(req, res) {
    db.User.findOne({ where: { email }}).then(function(id) {
      return res.json(id);
    });
  });

  app.get("/api/user", function(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(406).send("Missing email or password");
    }

    db.User.findOne({
      where: {
        email
      }
    }).then(function(user) {
      if (!user) {
        return res.status(406).send("User not found.");
      }
    });

    bcrypt.compare(password, user.password, function(err, result) {
      if (err) {
        console.log(err);

        return res.status(500).send("Service unavailable");
      }

      if (!result) {
        return res.status(401).send("Unauthorized");
      }

      console.log(process.env.JWT_SECRET);
      return res.send({
        token: jwt.encode({ userId: user.id }, process.env.JWT_SECRET)
      });
    });
  });
};

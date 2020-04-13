var db = require("../models/");
var bcrypt = require("bcrypt");
// var jwt = require("jwt-simple");

// const checkJWT = (req, res, next) => {
//   try {
//     var decoded = jwt.decode(req.token, process.env.JWT_SECRET);
//   } catch (error) {
//     console.log("ERROR", error);

//     next();
//   }

//   req.user = decoded;

//   next();
// };

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

  // User Sign Up
  app.post("/api/users", function(req, res) {
    console.log(req.body);

    db.User.create(req.body)
      .then(function() {
        return res.send(true);
      })
      .catch(function() {
        return res.status(500).send("Something went wrong.");
      });
  });

  // Save ID of User
  // app.get("/api/user", function(req, res) {
  //   db.User.findOne({ where: { email }}).then(function(id) {
  //     return res.json(id);
  //   });
  // });

  // User Login
  app.get("/api/users", function(req, res) {
    const email = req.query.email;
    const password = req.query.password;

    db.User.findAll({
      where: {
        email,
        password
      }
    }).then(function(dbUser) {
      // res.json(dbUser);
      if (dbUser !== null) {
        res.json(dbUser);

        // db.User.findOne({
        //   where: {
        //     email
        //   }
        // }).then(function(dbUser) {
        //   res.json(dbUser);
        // });
      } else {
        // you'd maybe like to set response status to 404
        // also some user friendly error message could be good as response body
        return res.send(error);

        // return res.status(500).send("Something went wrong.");

        // console.log("Error: user not found");
      }
    });
  });

  // app.get("/api/user", function(req, res) {
  //   const { email, password } = req.body;

  //   if (!email || !password) {
  //     return res.status(406).send("Missing email or password");
  //   }

  //   db.User.findOne({
  //     where: {
  //       email
  //     }
  //   }).then(function(user) {
  //     if (!user) {
  //       return res.status(406).send("User not found.");
  //     }
  //   });

  //   bcrypt.compare(password, user.password, function(err, result) {
  //     if (err) {
  //       console.log(err);

  //       return res.status(500).send("Service unavailable");
  //     }

  //     if (!result) {
  //       return res.status(401).send("Unauthorized");
  //     }

  //     console.log(process.env.JWT_SECRET);
  //     return res.send({
  //       token: jwt.encode({ userId: user.id }, process.env.JWT_SECRET)
  //     });
  //   });
  // });
};

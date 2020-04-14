module.exports = function(sequelize, DataTypes) {
  var Restaurant = sequelize.define("Restaurant", {
    restaurantName: DataTypes.STRING,
    restaurantPhone: DataTypes.STRING,
    restaurantAddress: DataTypes.STRING,
    restaurantCity: DataTypes.STRING,
    restaurantState: DataTypes.STRING,
    restaurantZipCode: DataTypes.STRING,
    restaurantURL: DataTypes.STRING
    // userID: DataTypes.INTEGER
  });
  return Restaurant;
};

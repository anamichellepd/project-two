module.exports = function(sequelize, DataTypes) {
  var Restaurant = sequelize.define("Restaurant", {
    restaurantName: DataTypes.STRING,
  });
  return Restaurant;
};

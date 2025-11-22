module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("Log", {
    action: DataTypes.STRING,
    meta: DataTypes.JSON
  });

  Log.associate = (models) => {
    Log.belongsTo(models.Organisation, { foreignKey: "organisationId", as: "organisation" });
    Log.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Log;
};

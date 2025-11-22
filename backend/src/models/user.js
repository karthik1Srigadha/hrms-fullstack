module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    passwordHash: DataTypes.STRING
  });

  User.associate = (models) => {
    User.belongsTo(models.Organisation, { foreignKey: "organisationId", as: "organisation" });
  };

  return User;
};

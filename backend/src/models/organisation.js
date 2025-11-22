// src/models/organisation.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const Organisation = sequelize.define("Organisation", {
    name: { type: DataTypes.STRING, allowNull: false }
  });

  Organisation.associate = (models) => {
    Organisation.hasMany(models.User, { foreignKey: "organisationId", as: "users" });
    Organisation.hasMany(models.Employee, { foreignKey: "organisationId", as: "employees" });
    Organisation.hasMany(models.Team, { foreignKey: "organisationId", as: "teams" });
    Organisation.hasMany(models.Log, { foreignKey: "organisationId", as: "logs" });
  };

  return Organisation;
};


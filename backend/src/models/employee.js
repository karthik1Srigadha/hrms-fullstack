"use strict";

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING
    },
    {
      tableName: "employees",
      timestamps: true
    }
  );

  Employee.associate = (models) => {
    Employee.belongsTo(models.Organisation, {
      foreignKey: "organisationId",
      as: "organisation"
    });

    Employee.belongsToMany(models.Team, {
  through: models.EmployeeTeam,
  foreignKey: "employee_id",
  otherKey: "team_id",
  as: "teams"
});


  };

  return Employee;
};

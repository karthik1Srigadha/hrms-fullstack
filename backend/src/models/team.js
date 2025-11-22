module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("Team", {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  });

  Team.associate = (models) => {
    Team.belongsTo(models.Organisation, { foreignKey: "organisationId", as: "organisation" });
    Team.belongsToMany(models.Employee, {
  through: models.EmployeeTeam,
  foreignKey: "teamId",
  otherKey: "employeeId",
  as: "members"
});
  };

  return Team;
};

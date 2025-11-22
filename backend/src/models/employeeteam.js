module.exports = (sequelize, DataTypes) => {
  const EmployeeTeam = sequelize.define("EmployeeTeam", {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "employee_teams",   // FIXED
    underscored: true,             // FIXED
    timestamps: false
  });

  return EmployeeTeam;
};

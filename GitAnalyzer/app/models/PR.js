'use strict';
module.exports = (sequelize, DataTypes) => {
  var PR = sequelize.define('PR', {
    url: {
      type: DataTypes.STRING
    },
    body: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    }
  }, {});
  PR.associate = function(models) {
    // associations can be defined here
  };
  PR.tableName = 'pr';

  PR.sync({force: false});
  return PR;
};

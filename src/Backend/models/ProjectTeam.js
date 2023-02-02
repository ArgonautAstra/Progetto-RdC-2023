const { DataTypes } = require('sequelize');
const seq = require('../db/Db');
const user = require('./User')
const project = require('./Project')
const db = seq.getDB();

const projectTeam = db.define('ProjectTeam',
    {
        role: DataTypes.STRING
    }, 
    {
        freezeTableName: true,
        timestamps: false 
    }
);
user.belongsToMany(project, { through: projectTeam });
project.belongsToMany(user, { through: projectTeam });

module.exports = projectTeam;
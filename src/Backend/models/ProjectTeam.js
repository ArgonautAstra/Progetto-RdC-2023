const { DataTypes, Sequelize} = require('sequelize');

const user = require('./User')
const project = require('./Project')
const config = require("../db/config.json");

const db = new Sequelize(config.db, config.user, config.password, {
    host: config.host,
    dialect: "mysql",
    logging: false,
    define: { timestamps: false }
});

const projectTeam = db.define('ProjectTeam',
    {
        role: DataTypes.STRING
    }, 
    {
        freezeTableName: true,
        timestamps: false 
    }
);
user.belongsToMany(project, { through: projectTeam, foreignKey: "projectId" });
project.belongsToMany(user, { through: projectTeam, foreignKey: "userId" });
db.authenticate().then(()=> projectTeam.sync({alter: true}))
module.exports = projectTeam;
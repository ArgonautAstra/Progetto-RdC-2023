const { DataTypes, Sequelize} = require('sequelize');
const config = require("../db/config.json");

const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false,
	define: { timestamps: false }
});


const project = db.define("Project", {
		projectId:{
			type: DataTypes.INTEGER,
			primaryKey: true,
            autoIncrement: true
		},
		name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        visibility: {
            type: DataTypes.STRING,
            allowNull: false
        },

        descritipion: {
            type: DataTypes.TEXT
        }
	},

	{
		timestamps: false,
		freezeTableName: true
	}
)
db.authenticate().then(()=> project.sync())
module.exports = project;
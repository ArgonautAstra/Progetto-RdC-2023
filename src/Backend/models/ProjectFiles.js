
const { DataTypes, Sequelize} = require('sequelize');
const file = require('../models/Files')
const project = require('../models/Project')
const config = require("../db/config.json");

const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false,
	define: { timestamps: false }
});


const projectFiles = db.define("ProjectFiles", {
		projectId:{
			type: DataTypes.INTEGER,
			references:{
                model: project,
                key: 'projectId'
            }
		},
		fileId:{
			type: DataTypes.INTEGER,
			references: {
				model: file,
				key: 'fileId'
			}
		},
	},
	{
		timestamps: false,
		freezeTableName: true,

		indexes: [
			{
				unique: true,
				fields: ['projectId', 'fileId']
			}
		]
	}
)
db.authenticate().then(()=> projectFiles.sync())
module.exports = projectFiles;
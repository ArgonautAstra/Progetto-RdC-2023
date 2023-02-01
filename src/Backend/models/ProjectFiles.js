const seq = require('../db/Db');
const { DataTypes } = require('sequelize');


const db = seq.getDB();


const projectFiles = db.define("projectFiles", {
		projectId:{
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		fileId:{
			type: DataTypes.INTEGER,
			primaryKey: true
		},
	},
	{
		timestamps: false,
		freezeTableName: true
	}
)

module.exports = projectFiles;
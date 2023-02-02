const seq = require('../db/Db');
const { DataTypes } = require('sequelize');
const file = require('../models/Files')
const project = require('../models/Project')

const db = seq.getDB();


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

module.exports = projectFiles;
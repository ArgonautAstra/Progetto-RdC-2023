const seq = require('../db/Db');
const { DataTypes } = require('sequelize');
const project = require('./Project');
const user = require('./User');

const db = seq.getDB();

const projectTeam = db.define("ProjectTeam", {
		projectId:{
			type: DataTypes.INTEGER,
		},
		userId: {
			type: DataTypes.INTEGER,
		},
        role : {
            type: DataTypes.STRING
        }
	},
	{
		timestamps: false,
		freezeTableName: true,

		indexes: [
			{
				unique: true,
				fields: ['projectId', 'userId']
			}
		]
	}
)



module.exports = projectTeam;
const seq = require('../db/Db')
const { DataTypes } = require('sequelize');

const db = seq.getDB();


const project = db.define("Project", {
		projectId:{
			type: DataTypes.INTEGER,
			primaryKey: true,
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


module.exports = project;
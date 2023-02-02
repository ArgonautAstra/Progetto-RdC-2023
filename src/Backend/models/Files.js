const { DataTypes } = require('sequelize');
const user = require("../models/User")
const seq = require("../db/Db");


const db = seq.getDB();


const File = db.define("File", {
        fileId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fileName:{
            type: DataTypes.STRING,
            allowNull: false
        },
        filePath:{
            type: DataTypes.STRING,
            allowNull: false
        },
        uploadDate:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        uploadUser:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: user,
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
)




module.exports = File;
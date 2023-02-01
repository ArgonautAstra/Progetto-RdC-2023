const { Sequelize, DataTypes, Model } = require('sequelize');
const database = require("src/Backend/db/Db")



export default class File extends Model{}

File.init({
    field:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fileName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    path:{
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
            model: User,
            key: 'id'
        }
    }
    },
    {
        sequelize: database.getDB(),
        modelName: File,
        timestamps: false,
        freezeTableName: true
    })

module.exports = File;
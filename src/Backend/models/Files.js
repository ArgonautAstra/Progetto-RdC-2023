const { DataTypes, Sequelize} = require('sequelize');
const user = require("../models/User")
const config = require("../db/config.json");

const db = new Sequelize(config.db, config.user, config.password, {
    host: config.host,
    dialect: "mysql",
    logging: false,
    define: { timestamps: false }
});


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


db.authenticate().then(()=> File.sync())

module.exports = File;
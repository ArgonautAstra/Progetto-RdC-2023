const seq = require('../db/Db');
const { DataTypes } = require('sequelize');


const db = seq.getDB();

const user = db.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    
    name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },

    surname: {
        type: DataTypes.STRING(40),
        allowNull: false
    },

    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
    password: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
},
    {
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = user;
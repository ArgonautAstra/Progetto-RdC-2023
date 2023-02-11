const { DataTypes, Sequelize} = require('sequelize');
const config = require("../db/config.json");


const db = new Sequelize(config.db, config.user, config.password, {
    host: config.host,
    dialect: "mysql",
    logging: false,
    define: { timestamps: false }
});

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
db.authenticate().then(()=> user.sync())
module.exports = user;
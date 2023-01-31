const { Sequelize } = require('sequelize');
const config = require("./config.json")

class database {
    static db

    constructor() {
        this.connect().then(r => {
            console.log(r)
        })
    }

    static getDB(){
        if (!this.db){
            this.db = new Sequelize(config.db, config.user, config.password, {
                host: config.host,
                dialect: "mysql"
            });
        }

        return this.db

    }

    async connect() {
        try {
            await this.db.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    disconnect(){
        this.db.close();
    }
}

module.exports = database


const { Sequelize} = require('sequelize');
const config = require("./config.json")

class database {
    db
    
    constructor() {}
    
    getDB(){
        if (!this.db){
            console.log("Creato riferimento db")
            this.db = new Sequelize(config.db, config.user, config.password, {
                host: config.host,
                dialect: "mysql",
                logging: false
            });
            this.db.authenticate()
            return this.db
        }
        console.log("Restituendo il rifermento db")
        return this.db
    }
    
}


const db = new database();
module.exports = db


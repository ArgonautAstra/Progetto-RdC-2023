const { Sequelize} = require('sequelize');
const config = require('../config.json')

const express = require('express')

const port = 3000;
const app = express();


app.listen(port, async () => {
    db = new Sequelize(config.db, config.user, config.password, {
        host: config.host,
        dialect: "mysql",
        logging: false
    });
    req = {
        body: {
            name: "progettino",
            visibility: true,
            description: "descrizione"
        }
    }
    const query = await db.query("INSERT INTO Project(name, visibility, description) VALUES(\'" + req.body.name + "\'," + req.body.visibility + ",\'"+req.body.description +"\')");
    console.log(query);
})
const express = require('express');
const seq = require('./Db');
const user = require('../models/User');
const projectTeam = require('../models/ProjectTeam')
const project = require('../models/Project')
const port = 3000;
const app = express();


const db = seq.getDB();

//sequelize mette una colonna id che non esiste nella tabella ProjectFiles, usare attributes : ['a', 'b'] in find
//https://stackoverflow.com/questions/50456128/unknown-column-in-field-list-sequelize

//NON FUNZIONA NIENTE 
const initDb = async () => {

    console.log("Connessione al db");
    try {
        await db.authenticate()
            .then(() =>{
                projectTeam.sync();
            })
            .then(() => console.log("DIO OK"))
            .then(() => user.findAndCountAll({
                where: {
                    id: 15
                },
                include: project
            }))
            .then()

        console.log("Connessione ok");
    } catch(error) {
        console.log(error);
    }
}

initDb();

app.listen(port, () => {
    console.log("In ascolto")
});
const express = require('express');
const seq = require('../Db');
const userModel = require('../../models/User');
const file = require('../../models/Files')
const project = require('../../models/Project')
const projectFiles = require('../../models/ProjectFiles')
const projectTeam = require('../../models/ProjectTeam')

const port = 3000;
const app = express();

const db = seq.getDB();

//sequelize mette una colonna id che non esiste nella tabella ProjectFiles, usare attributes : ['a', 'b'] in find
//https://stackoverflow.com/questions/50456128/unknown-column-in-field-list-sequelize

const initDb = async () => {
    console.log("Connessione al db");
    try {
        await db.authenticate()
            .then(() => projectTeam.sync())
            .then(() => projectTeam.findAndCountAll({
                attributes: ['projectId', 'userId']
            }))
            .then(query => console.log(query));
        
        console.log("Connessione ok");
    } catch(error) {
        console.log(error);
    }
}

initDb();

app.listen(port, () => {
    console.log("In ascolto")
});
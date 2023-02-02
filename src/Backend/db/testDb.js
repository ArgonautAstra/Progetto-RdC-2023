const express = require('express');
const seq = require('./Db');
const userModel = require('../models/User');
const file = require('../models/Files')
const project = require('../models/Project')
const projectFiles = require('../models/ProjectFiles')

const port = 3000;
const app = express();

const db = seq.getDB();


const initDb = async () => {
    console.log("Connessione al db");
    try {
        await db.authenticate()
            .then(() => projectFiles.sync())
            .then(() => projectFiles.findAndCountAll({
                //sequelize mette una colonna id che non esiste
                //https://stackoverflow.com/questions/50456128/unknown-column-in-field-list-sequelize
                
                attributes: ['projectId', 'fileId']
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
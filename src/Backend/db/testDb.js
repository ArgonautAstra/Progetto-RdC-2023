const express = require('express');
const seq = require('./Db');
const userModel = require('../models/User');

const port = 3000;
const app = express();

const db = seq.getDB();


const initDb = async () => {
    console.log("Connessione al db");
    try {
        await db.authenticate();
        userModel.sync();
        console.log("Connessione ok");
    } catch(error) {
        console.log(error);
    }
}

initDb();

app.listen(port, () => {
    console.log("In ascolto")
});
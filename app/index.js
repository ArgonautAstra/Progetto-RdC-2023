const express = require('express')

const database = require("./db/Db")

const app = express();

//const { user: UserModel } = require('./db/sequelize');

const data = database.getDB()
const data2 = database.getDB()

app.route('/').get(async (req, res) => {
    res.send(data === data2)
});

const port = 3000;
app.listen(port, () => {
	console.log(`Worker: process ${process.pid} is up on port ${port}`);
});

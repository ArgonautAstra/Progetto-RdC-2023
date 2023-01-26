const express = require('express')
const database = require("./src/Backend/db/Db")
const path = require("path");
const app = express();
const data = database.getDB()
const port = 3000;

const indexRoute = require("./src/Backend/routers/indexRoute")
const homeRoute = require("./src/Backend/routers/homeRoute")
const loginRoute = require("./src/Backend/routers/loginRoute")



app.use(express.static('public'));
app.use("/js", express.static(path.join(__dirname,"bower_components/bootstrap/dist/js")))
app.use("/css", express.static(path.join(__dirname,"bower_components/bootstrap/dist/css")))

app.set('views', './src/views')
app.set("view engine", "ejs")


app.use("/",indexRoute)
app.use("/home", homeRoute)
app.use("/", loginRoute)
//app.use("/index", indexRoute)


//da sostiturire ancora con i router




app.listen(port, () => {
	console.log(`Worker: process ${process.pid} is up on port ${port}`);
});

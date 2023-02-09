const express = require('express')
const path = require("path");
const app = express();
const port = 3000;

const indexRoute = require("./src/Backend/routers/indexRoute")
const homeRoute = require("./src/Backend/routers/homeRoute")
const loginRoute = require("./src/Backend/routers/loginRoute")
const projectRoute = require("./src/Backend/routers/projectRoute")
const itemRoute = require("./src/Backend/routers/itemRoute")



app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
//app.use(multer.array()) // dovrebbe servire per i dati di tipo form-data, ma li gestisce anche express da solo
app.use("/js", express.static(path.join(__dirname,"bower_components/bootstrap/dist/js")))
app.use("/css", express.static(path.join(__dirname,"bower_components/bootstrap/dist/css")))
app.use("/img", express.static(path.join(__dirname,"./public/img/")))

app.set('views', './src/views')
app.set("view engine", "ejs")


app.use("/",indexRoute)
app.use("/", homeRoute)
app.use("/", loginRoute)
app.use("/project",projectRoute)
app.use("/item", itemRoute)
//app.use("/index", indexRoute)


//da sostiturire ancora con i router




app.listen(port, () => {
	console.log(`Worker: process ${process.pid} is up on port ${port}`);
})
// 	.close((err)=>{
// 	console.log(err)
// 	database.getDB().close();
// 	process.exit(err ? 1 : 0)
// })


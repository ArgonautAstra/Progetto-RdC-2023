const express = require("express")

const homeRouter = express.Router()
const controller = require('../Controller/homeController')


homeRouter.get("/",(req,res) =>{
    res.render("home")
})

homeRouter.post("/new", (req, res) => {
    controller.createProject(req, res, 1);
})



module.exports = homeRouter
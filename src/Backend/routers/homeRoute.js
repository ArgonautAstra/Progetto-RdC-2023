const express = require("express")

const homeRouter = express.Router()
const controller = require('../Controller/homeController')


homeRouter.get("/home", controller.renderHome)

homeRouter.post("/new", (req, res) => {
    controller.createProject(req, res, 1);
})



module.exports = homeRouter
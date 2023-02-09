const express = require("express")

const homeRouter = express.Router()
const controller = require('../Controller/homeController')


homeRouter.get("/home", controller.renderHome)

homeRouter.post("/new", (req, res) => {
    //console.log(req.body)
    controller.createProject(req, res, 1);
})

homeRouter.post("/invite", controller.inviteUser)



module.exports = homeRouter
const express = require("express")

const homeRouter = express.Router()
const controller = require('../Controller/homeController')


homeRouter.get("/home", controller.renderHome)

homeRouter.post("/new", controller.createProject)

homeRouter.post("/invite", controller.inviteUser)

homeRouter.post("/search", controller.searchProjects)

module.exports = homeRouter
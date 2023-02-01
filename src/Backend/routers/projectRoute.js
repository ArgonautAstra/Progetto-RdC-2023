const express = require("express")
const controller = require("../Controller/projectController")
const sequelize = require('../db/Db')
const projectRouter = express.Router()
const fileUpload = require("express-fileupload");
const filesPayloadExists = require("../middleware/filesPayloadExists")
const fileSizeLimiter = require("../middleware/fileSizeLimiter")
const fileExtLimiter = require("../middleware/fileExtLimiter")



projectRouter.get("/", (req, res) => {
	res.render("project.ejs")
})

projectRouter.post("/upload",
	fileUpload({createParentPath: true}),
	filesPayloadExists,
	fileExtLimiter(['.png', '.jpg', '.jpeg']),
	fileSizeLimiter,
	controller.uploadFile)

projectRouter.post("/:projectid/:fileid", controller.downloadFile)


module.exports = projectRouter
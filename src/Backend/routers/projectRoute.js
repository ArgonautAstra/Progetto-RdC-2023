const express = require("express")
const controller = require("../Controller/projectController")
const sequelize = require('../db/Db')
const projectRouter = express.Router()
const fileUpload = require("express-fileupload");
const filesPayloadExists = require("../middleware/filesPayloadExists")
const fileSizeLimiter = require("../middleware/fileSizeLimiter")
const fileExtLimiter = require("../middleware/fileExtLimiter")
const fileExtDB = require("../middleware/fileExtDB")



projectRouter.get("/", controller.getProject)

projectRouter.post("/upload",
	fileUpload({createParentPath: true}),
	filesPayloadExists,
	fileExtLimiter(['.png', '.jpg', '.jpeg']),
	fileSizeLimiter,
	controller.uploadFile)

projectRouter.get("/:projectid/:fileid",
	fileExtDB,
	controller.downloadFile)


module.exports = projectRouter
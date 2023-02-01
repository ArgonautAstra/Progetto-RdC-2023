const express = require("express")
const controller = require("../Controller/projectController")
const sequelize = require('../db/Db')
const userModel = require('../models/User')
const fileModel = require("../models/Files")
const projectRouter = express.Router()
const fileUpload = require("express-fileupload");
const filesPayloadExists = require("../middleware/filesPayloadExists")
const fileSizeLimiter = require("../middleware/fileSizeLimiter")
const fileExtLimiter = require("../middleware/fileExtLimiter")
const path = require("path");


projectRouter.get("/", (req, res) => {
	res.render("project.ejs")
})

projectRouter.post("/upload",
	fileUpload({createParentPath: true}),
	filesPayloadExists,
	fileExtLimiter(['.png', '.jpg', '.jpeg']),
	fileSizeLimiter,
	controller.uploadFile)


module.exports = projectRouter
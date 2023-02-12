const express = require("express")
const controller = require("../Controller/projectController")
const projectRouter = express.Router()
const fileUpload = require("express-fileupload");
const filesPayloadExists = require("../middleware/filesPayloadExists")
const fileSizeLimiter = require("../middleware/fileSizeLimiter")
const fileExtLimiter = require("../middleware/fileExtLimiter")
const fileExtDB = require("../middleware/fileExtDB")
const fileImportZip = require("../middleware/FileImportZip")



projectRouter.get("/:nameproject", controller.getProject)

projectRouter.post("/:nameproject",controller.downloadProject)

projectRouter.post("/upload/:nameproject",
	fileUpload({createParentPath: true}),
	filesPayloadExists,
	//fileExtLimiter(['.png', '.jpg', '.jpeg']),
	fileSizeLimiter,
	controller.uploadFile)

projectRouter.post("/import/:nameproject", fileUpload({createParentPath: true}),fileImportZip,controller.importProject)


module.exports = projectRouter
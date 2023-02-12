const path = require("path");
const fileModel = require("../models/Files")
const projectfilesModel = require("../models/ProjectFiles")
const projectModel = require("../models/Project")
const projectTeamModel = require("../models/ProjectTeam")
const {Op, Sequelize, QueryTypes} = require("sequelize");
const config = require("../db/config.json");
const {isBoolean} = require("validator");
const {errorFunc} = require("express-fileupload/lib/utilities");
const extract = require('extract-zip')
const fs = require("fs")
const moment = require("moment");

const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host, dialect: "mysql", logging: false, define: {timestamps: false}
});


exports.getProject = async (req, res) => {
	const name = req.params.nameproject

	const visibility = await db.query("select visibility from Project where binary name = $1", {
		bind: [name], type: QueryTypes.SELECT
	}).catch((err) => {
		console.log(err)
		return res.statusCode(500)
	})

	const files = await db.query("select fileName,F.fileId from ((ProjectFiles pf inner join File F on pf.fileId = F.fileId) inner join Project p on p.projectId = pf.projectId and binary p.name = $1  )", {
		bind: [name], type: QueryTypes.SELECT
	})
		.then((files) => {
			if (files.length < 1) {
				files = null
				return;
			}
			return files
		})
		.catch((err) => {
			console.log(err)
			return res.statusCode(500)
		})
	//console.log(files)
	res.render("project.ejs", {
		name: name, visibility: visibility[0].visibility == 1 ? "private" : "public", files: files == null ? [] : files,
	})
}


exports.uploadFile = async (req, res) => {
	const userInfo = JSON.parse(req.cookies.userInfo);
	const nameprog = req.params.nameproject
	const progId = await db.query("select p.projectId from Project p inner join ProjectTeam pt where binary p.name = $1 and pt.userId = $2 and p.projectId = pt.projectId", {
		bind: [nameprog, userInfo.userId], type: QueryTypes.SELECT
	}).catch(error => {
		console.log(error)
		return res.sendStatus(500)
	})
	const pathProject = path.join(process.cwd(), 'files', nameprog)
	const files = req.files

	for (const key of Object.keys(files)) {
		const filepath = path.join(pathProject, files[key].name)
		const date = new Date().toISOString()
		await db.authenticate().then(() => fileModel.sync())
			.then(() => fileModel.create({
				fileName: files[key].name, filePath: filepath, uploadDate: date, uploadUser: userInfo.userId
			})).catch(error => {
				console.log(error)
				return res.sendStatus(500)
			})

		const file_id = await db.authenticate().then(() => fileModel.sync())
			.then(() => fileModel.findOne({
				where: {
					fileName: files[key].name, uploadDate: date, uploadUser: userInfo.userId
				}
			}))
			.catch(error => {
				console.log(error)
				return res.statusCode(500)
			})
		await projectfilesModel.sync().then(() => {
			projectfilesModel.create({
				projectId: progId[0].projectId, fileId: file_id.dataValues.fileId
			})
		}).catch(error => {
			console.log(error)
			return res.statusCode(500)
		})
		await files[key].mv(filepath, (err) => {
			if (err) return res.status(500).json({status: "error", message: err})
		})
		console.log("record inserito con successo");
	}

	res.redirect("/project/" + nameprog)
}


exports.downloadProject = async (req, res) => {
	console.log(req.body.gridcheck)
	if (!req.body.gridcheck) {
		return res.redirect("/project/" + req.params.nameproject)
	}
	let filesId = Array.isArray(req.body.gridcheck) ? req.body.gridcheck.map((value) => parseInt(value, 10)) : [req.body.gridcheck].map((value) => parseInt(value, 10))


	const filesProject = await db.query("select F.fileId from ((ProjectFiles pf inner join File F on pf.fileId = F.fileId) inner join Project p on p.projectId = pf.projectId and binary p.name = $1  )", {
		bind: [req.params.nameproject], type: QueryTypes.SELECT
	}).then((arr) => {
		return arr.map((value) => value.fileId)
	})


	const check = filesProject.filter((value) => filesId.includes(value));
	if (check.length != filesId.length) return res.sendStatus(500)


	const files = await fileModel.findAll({
		where: {
			fileId: check
		}
	})
	const zip = []
	for (let file of files) {
		zip.push({
			path: file.dataValues.filePath, name: file.dataValues.fileName
		})
	}
	return res.zip(zip, req.params.nameproject + ".zip")

}


exports.importProject = async (req, res) => {
	const zippedfiles = res.locals.zippedfiles
	const nameprog = req.params.nameproject
	const userInfo = JSON.parse(req.cookies.userInfo);
	const pathProject = path.join(process.cwd(), 'files', nameprog)
	const pathTemp = path.join(process.cwd(), 'files', 'temp')
	
	//il middleware non cancella la cartella temp!
	fs.rmSync(pathTemp,{recursive:true})
	
	console.log(zippedfiles)
	const progId = await db.query("select p.projectId from Project p inner join ProjectTeam pt where binary p.name = $1 and pt.userId = $2 and p.projectId = pt.projectId", {
		bind: [nameprog, userInfo.userId], type: QueryTypes.SELECT
	}).catch(error => {
		console.log(error)
		return res.sendStatus(500)
	})
	console.log(progId)

	for (let item of zippedfiles) {
		const date = new Date().toISOString()
		await db.authenticate().then(() => fileModel.sync())
			.then(() => fileModel.create({
				fileName: item.name, filePath: item.path, uploadDate: date, uploadUser: userInfo.userId
			})).catch(error => {
				console.log(error)
				return res.sendStatus(500)
			})

		const file_id = await db.authenticate().then(() => fileModel.sync())
			.then(() => fileModel.findOne({
				where: {
					fileName: item.name, uploadDate: date, uploadUser: userInfo.userId
				}
			}))
			.catch(error => {
				console.log(error)
				return res.statusCode(500)
			})
		console.log(file_id.dataValues.fileId)
		await projectfilesModel.sync().then(() => {
			projectfilesModel.create({
				projectId: progId[0].projectId, fileId: file_id.dataValues.fileId
			})
		}).catch(error => {
			console.log(error)
			return res.statusCode(500)
		})
	}
	
	console.log("inserito progetto")
	return res.redirect("/project/" + nameprog)

}



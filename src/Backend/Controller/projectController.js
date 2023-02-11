const path = require("path");
const fileModel = require("../models/Files")
const projectfilesModel = require("../models/ProjectFiles")
const projectModel = require("../models/Project")
const projectTeamModel = require("../models/ProjectTeam")
const fs = require("fs")
const {Op, Sequelize, QueryTypes} = require("sequelize");
const config = require("../db/config.json");
const {isBoolean} = require("validator");
const {errorFunc} = require("express-fileupload/lib/utilities");

const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false,
	define: { timestamps: false }
});


exports.getProject = async (req, res) => {
	const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));
	const name = req.params.nameproject
	//TODO:controllo se è un progetto accessibili all'utente

	const visibility = await db.query("select visibility from Project where binary name = $1", {
		bind: [name],
		type: QueryTypes.SELECT
	}).catch((err) => {
		console.log(err)
		res.statusCode(500)
	})

	const files = await db.query("select fileName from ((ProjectFiles pf inner join File F on pf.fileId = F.fileId) inner join Project p on p.projectId = pf.projectId and binary p.name = $1  )",
		{
			bind:[name],
			type: QueryTypes.SELECT
		})
		.then((files) => {
			if (files.length < 1) {
				files = null
				return;
			}
			files[0].ext = path.extname(files[0].fileName)
			return files
		})
		.catch((err) => {
			console.log(err)
			res.statusCode(500)
		})


	res.render("project.ejs", {
		name: name,
		visibility: visibility[0].visibility == 1 ? "private" : "public",
		files: files == null ? [] : files
	})
}


exports.uploadFile = async (req, res) => {
	const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));
	const nameprog = req.params.nameproject
	const progId = await db.query("select p.projectId from Project p inner join ProjectTeam pt where binary p.name = $1 and pt.userId = $2 and p.projectId = pt.projectId", {
		bind: [nameprog, userInfo.userId],
		type: QueryTypes.SELECT
	}).catch(error => {
		console.log(error)
		res.sendStatus(500)
	})

	const files = req.files

	for (const key of Object.keys(files)) {
		const filepath = path.join(process.cwd(), 'files', files[key].name)
		const date = new Date().toISOString()
		await db.authenticate().then(() =>
			fileModel.sync())
			.then(() =>
				fileModel.create({
					fileName: files[key].name,
					filePath: filepath,
					uploadDate: date,
					uploadUser: userInfo.userId
				})
			).catch(error => {
				console.log(error)
				res.sendStatus(500)
			})

		const file_id = await db.authenticate().then(() => fileModel.sync())
			.then(() => fileModel.findOne({
				where: {
					fileName: files[key].name, uploadDate: date, uploadUser: userInfo.userId
				}
			}))
			.catch(error => {
				console.log(error)
				res.statusCode(500)
			})
		await projectfilesModel.sync().then(() => {
			projectfilesModel.create({
				projectId: progId[0].projectId,
				fileId: file_id.dataValues.fileId
			})
		}).catch(error => {
			console.log(error)
			res.statusCode(500)
		})
		await files[key].mv(filepath, (err) => {
			if (err) return res.status(500).json({status: "error", message: err})
		})
		console.log("record inserito con successo");
	}

	return res.json({status: 'success', message: Object.keys(files).toString()})
}

exports.downloadFile = async (req, res) => {
	const json = res.locals.dataValues

	await res.download(json.filePath, json.fileName, (err) => {
		if (err)
			res.statusCode(500)
	})
}
const path = require("path");
const fileModel = require("../models/Files")
const projectfilesModel = require("../models/ProjectFiles")
const projectModel = require("../models/Project")
const projectTeamModel = require("../models/ProjectTeam")
//const db = require("../db/Db").getDB()
const fs = require("fs")
const {Op, Sequelize, QueryTypes} = require("sequelize");
const config = require("../db/config.json");
const {isBoolean} = require("validator");
const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false
});


exports.getProject = async (req, res) => {
	const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));
	const name = req.params.nameproject
	//TODO:controllo se è un progetto accessibili all'utente
	
	const visibility = await db.query("select visibility from Project where binary name = $1",{
		bind: [name],
		type: QueryTypes.SELECT
	}).catch((err)=> {
		console.log(err)
		res.statusCode(500)
	})
	
	const files = await db.query("select fileName from ProjectFiles pf inner join File F on pf.fileId = F.fileId",{type: QueryTypes.SELECT})
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
	console.log(files)
	
		

	res.render("project.ejs",{
		name: name,
		visibility: visibility[0].visibility == 1 ? "private" : "public",
		files: files == null ? [] : files
	})
}


exports.uploadFile = async (req, res) => {
	//todo:inserire la correlazione su projectFiles: prendere il nome del progetto, trovare il suo id ed insieme al fileid aggiungere al projectfiles
	const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));
	const files = req.files
	
	for (const key of Object.keys(files)) {
		const filepath = path.join(process.cwd(), 'files', files[key].name)
		console.log(filepath)
		await db.authenticate()
			.then(() =>
				fileModel.sync()
			).then(() =>
				fileModel.create({
					fileName: files[key].name,
					filePath: filepath,
					uploadDate: new Date().toLocaleDateString().slice(0, 10),
					uploadUser: userInfo.userId
				})
			).then(() => {
				files[key].mv(filepath, (err) => {
					if (err) return res.status(500).json({status: "error", message: err})
				})
				
				console.log("record inserito con successo");
			})
			.catch(error => {
				console.log(error)
				res.sendStatus(500)
			})
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
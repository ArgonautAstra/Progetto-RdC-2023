const path = require("path");
const fileModel = require("../models/Files")
const projectfilesModel = require("../models/ProjectFiles")
const projectModel = require("../models/Project")
const projectTeamModel = require("../models/ProjectTeam")
//const db = require("../db/Db").getDB()
const fs = require("fs")
const {Op, Sequelize, QueryTypes} = require("sequelize");
const config = require("../db/config.json");
const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false
});


exports.getProject = async (req, res) => {
	const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));
	// const array = []
	// let result = await db.query("select name,visibility,description from ProjectTeam pt inner join Project pj on pt.projectId = pj.projectId where userId = " + userInfo.userId, 
	// 		{ type: QueryTypes.SELECT })
	// for (let item of result){
	// 	array.push(item)
	// }
	
		

	res.render("project.ejs",{
		name: undefined
	})
}


exports.uploadFile = async (req, res) => {
	const files = req.files

	for (const key of Object.keys(files)) {
		const filepath = path.join(process.cwd(), 'files', files[key].name)
		console.log(filepath)
		await files[key].mv(filepath, (err) => {
			if (err) return res.status(500).json({status: "error", message: err})
		})
		await db.authenticate()
			.then(() =>
				fileModel.sync()
			).then(() =>
				fileModel.create({
					fileName: files[key].name,
					filePath: filepath,
					uploadDate: new Date().toLocaleDateString().slice(0, 10),
					uploadUser: 20
				})
			).then(() => {
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
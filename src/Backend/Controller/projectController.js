const path = require("path");
const fileModel = require("../models/Files")
const projectfilesModel = require("../models/ProjectFiles")
const db = require("../db/Db").getDB()
const fs = require("fs")

exports.uploadFile = async (req,res)=>{
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
					uploadDate: new Date().toLocaleDateString().slice(0,10),
					uploadUser: 20
				})
			).then( () => {
				console.log("record inserito con successo");
			})
			.catch(error =>{
				console.log(error)
				res.sendStatus(500)
			})
		
	}

	return res.json({ status: 'success', message: Object.keys(files).toString() })
}

exports.downloadFile = async (req, res) =>{
	const json = res.locals.dataValues
	
	await res.download(json.filePath,json.fileName,(err)=>{
		if (err)
			res.statusCode(500)
	})
}
const path = require("path");
const fileModel = require("../models/Files")
const projectfilesModel = require("../models/ProjectFiles")
const db = require("../db/Db").getDB()

exports.uploadFile = async (req,res)=>{
	const files = req.files

	for (const key of Object.keys(files)) {
		const filepath = path.join(process.cwd(), 'files', files[key].name)
		console.log(filepath)
		files[key].mv(filepath, (err) => {
			if (err) return res.status(500).json({ status: "error", message: err })
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
	const projectid = req.params.projectid
	const fileid = req.params.fileid
	console.log(projectid,fileid)
	await db.authenticate()
		.then(() => projectfilesModel.sync())
		.then(() => projectfilesModel.findAndCountAll({
			where:{
				projectId: projectid,
				fileId: fileid
			}
		}))
		.then(query =>{
			if (query.count === 0) {
				console.log("nessun file o progetto trovato");
				res.status(400);
			} else {
				console.log(query.toJSON())
				res.status(200)
			}
		})
}
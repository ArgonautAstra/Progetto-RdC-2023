const projectfilesModel = require("../models/ProjectFiles");
const fileModel = require("../models/Files");
const {Sequelize} = require("sequelize");
const config = require("../db/config.json");

const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false,
	define: { timestamps: false }
});

const fileExtDB = async (req,res,next) =>{
	const projectid = req.params.projectid
	const fileid = req.params.fileid
	console.log(projectid,fileid)
	await db.authenticate()
		.then(() => projectfilesModel.sync())
		.then(() => projectfilesModel.findAndCountAll({
			where:{
				projectId: projectid,
				fileId: fileid,
			}
		}))
		.then(query =>{
			if (query.count === 0) {
				console.log("nessun file o progetto trovato");
				res.json({status: 400, message: "nessun file o progetto trovato"})
				return
			}
			db.authenticate()
				.then(() => fileModel.sync())
				.then(() => fileModel.findByPk(fileid))
				.then((query) =>{
					if (query !== null){
						res.locals.dataValues = query.dataValues
						next()
					}
					else {
						res.sendStatus(400)
					}
				})
		})
}

module.exports = fileExtDB
const express = require("express")
const controller = require("../Controller/projectController")
const sequelize = require('../db/Db')
const userModel = require('../models/User')
const fileModel = require("../models/Files")
const projectRouter = express.Router()

/* sign in page */
projectRouter.get("/sign_in",controller.renderSignIn)

projectRouter.post("/sign_in", (req,res)=>{
	const db = sequelize.getDB();

	const selectRecord = async () => {
		await db.authenticate()
			.then( () => userModel.sync())
			.then( () => userModel.findAndCountAll({
				where: {
					username: req.body.username,
					password: req.body.password
				}
			}))
			.then(query => {
				if(query.count === 0) {
					console.log("login fallito");

					res.status(400);
					controller.renderSignIn(req, res, false);
				} else {
					console.log("login effettuato");
					res.status(200);
					res.render("home.ejs");
				}
			})
			.catch(err => console.log(err))
	}

	selectRecord();
})



module.exports = projectRouter
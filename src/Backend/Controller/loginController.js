const sequelize = require("../db/Db");
const userModel = require("../models/User");

const db = sequelize.getDB();

exports.renderSignIn = (req, res, status) => {
	res.render("sign_in", {
		login_status: status
	})
}

exports.renderSignOut = (req, res) => {
	res.render("sign_up");
}

exports.verifyData = async (req, res) => {
	await db.authenticate()
		.then(() => userModel.sync())
		.then(() => userModel.findAndCountAll({
			where: {
				username: req.body.username,
				password: req.body.password
			}
		}))
		.then(query => {
			if (query.count === 0) {
				console.log("login fallito");
				res.status(400);
				this.renderSignIn(req, res, false);
			} else {
				console.log("login effettuato");
				res.status(200);
				res.render("home.ejs");
			}
		})
		.catch(err => console.log(err))

}

exports.insertData = async (req,res) => {
	await db.authenticate()
		.then(() =>
			userModel.sync()
		).then(() =>
			userModel.create({
				name: req.body.name,
				surname: req.body.surname,
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			})
		).then( () => {
			console.log("record inserito con successo");
			res.status(200);

			//TODO: renderizzare home.ejs con i dati corretti
			res.render("home.ejs");
		}).catch(error => console.log(error))
}




    
    
    
    
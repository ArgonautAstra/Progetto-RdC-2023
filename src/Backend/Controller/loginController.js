const { Sequelize } = require("sequelize");

const userModel = require("../models/User");
const fs = require('fs');
const path = require('path');
const config = require("../db/config.json");
const md5 = require('md5');

const db = new Sequelize(config.db, config.user, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false,
	define: { timestamps: false }
});


exports.renderSignIn = (req, res, status) => {
	res.render("sign_in", {
		login_status: status
	})
}

exports.renderSignOut = (req, res, status) => {
	res.render("sign_up", {
		register_status: status
	});
}

exports.verifyData = async (req, res) => {
	await db.authenticate()
		.then(() => userModel.sync())
		.then(() => userModel.findAndCountAll({
			where: {
				username: req.body.username,
				password: md5(req.body.password)
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
				
				let id = query.rows[0].dataValues.id;

				redirectToHome(res, id)
			}
		})
		.catch(err => console.log(err))

}

exports.insertData = async (req,res) => {


	if(req.body.password !== req.body.confirm_password) {
		this.renderSignOut(req, res, 3);
	}
	else {
		await db.authenticate()
			.then(() =>
				userModel.sync()
			).then(() =>
				userModel.create({
					name: req.body.name,
					surname: req.body.surname,
					username: req.body.username,
					email: req.body.email,
					password: md5(req.body.password)
				})
			).then( query => {
				console.log("record inserito con successo");
				res.status(200);

				let id = query.dataValues.id;
				redirectToHome(res, id);
				
			}).catch(err => {
				let status = 0;

				//gestione violazione dei vincoli di unicità della tabella User
				if(err instanceof Sequelize.UniqueConstraintError) {
					if(err.fields.email !== undefined) {
						status = 1;
					} else {
						status = 2;
					}
				}
				console.log(status);
				res.status(400);
				this.renderSignOut(req, res, status);
			})
	}
}

const redirectToHome = async (res, userId) => {
	const [projects, metadata] = await db.query("SELECT P.name FROM ProjectTeam PT INNER JOIN Project P ON PT.projectId = P.projectId WHERE userId="+userId)
									.catch(err => console.log(err));

    const arr = []

    for(project of projects)
        arr.push(project.name)

    //creazione di un file json da cui ricavare i dati per il resto delle operazion
    let userInfo = {
        userId: userId,
        projects: arr
    };

	res.cookie("userInfo", JSON.stringify(userInfo))


	res.redirect('/home');

}


    
    
    
    
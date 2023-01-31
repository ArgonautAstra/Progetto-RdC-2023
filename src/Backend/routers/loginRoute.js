const express = require("express")
const controller = require("../Controller/loginController")
const sequelize = require('../db/Db')
const userModel = require('../models/User')

const loginRouter = express.Router()

/* sign in page */
loginRouter.get("/sign_in",controller.renderSignIn)

loginRouter.post("/sign_in", (req,res)=>{
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
                if(query.count == 0) {
                    console.log("login fallito");
                    
                    res.status(400);
                    controller.renderSignIn(req, res, false);
                } else {
                    console.log("login effettuato");
                    res.status(200);
                    res.send("home.ejs!");
                }
            })
            .catch(err => console.log(err))
    }

    selectRecord();
})

/* sign up page */
loginRouter.get("/sign_up",controller.renderSignOut)

loginRouter.post("/sign_up", (req, res) => {
    //inserimento record in unihub.User
    const db = sequelize.getDB();

    const createRecord = async () => {
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
                res.send("home.ejs!");
            }).catch(error => console.log(error))
    }
    
    createRecord();
})


module.exports = loginRouter
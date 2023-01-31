const express = require("express")
const controller = require("../Controller/loginController")
const sequelize = require('../db/Db')
const userModel = require('../models/User')

const loginRouter = express.Router()

/* sign in page */
loginRouter.get("/sign_in",controller.renderSignIn)

loginRouter.post("/sign_in", (req,res)=>{
    console.log(req.body)   
    res.sendStatus(200)
    //select record in unihub.User e, se esiste,
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
            }).catch(error => console.log(error)).finally(() => db.close())
    }
    
    createRecord();
})


module.exports = loginRouter
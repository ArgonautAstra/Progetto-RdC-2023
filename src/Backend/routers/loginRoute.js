const express = require("express")
const controller = require("../Controller/loginController")
const loginRouter = express.Router()



loginRouter.get("/sign_in",controller.renderSignIn)

loginRouter.post("/sign_in", (req,res)=>{
    console.log(req.body)   
    res.sendStatus(200)
})

loginRouter.get("/sign_up",controller.renderSignOut)





module.exports = loginRouter
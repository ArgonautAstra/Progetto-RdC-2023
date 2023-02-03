const express = require("express")
const controller = require("../Controller/loginController")

const loginRouter = express.Router()

/* sign in page */
loginRouter.get("/sign_in",controller.renderSignIn)

loginRouter.post("/sign_in", controller.verifyData)

/* sign up page */

loginRouter.get("/sign_up",controller.renderSignOut)

loginRouter.post("/sign_up", controller.insertData)


module.exports = loginRouter
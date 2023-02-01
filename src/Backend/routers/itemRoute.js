const express = require("express")
const controller = require("../Controller/projectController")
const sequelize = require('../db/Db')
const userModel = require('../models/User')
const fileModel = require("../models/Files")
const itemRouter = express.Router()

itemRouter.get("/", (req,res) =>{
	res.render("item.ejs")
})


module.exports = itemRouter
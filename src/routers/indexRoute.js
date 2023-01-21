const express = require("express")

const indexRouter = express.Router()

indexRouter.get("/",(req,res) =>{
    res.render("index")
})





module.exports = indexRouter

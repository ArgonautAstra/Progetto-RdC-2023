const { body, validationResult } = require("express-validator");

exports.renderSignIn = (req,res) => {
    res.render("sign_in")
}

exports.renderSignOut = (req,res) => {
    res.render("sign_up")
}




    
    
    
    
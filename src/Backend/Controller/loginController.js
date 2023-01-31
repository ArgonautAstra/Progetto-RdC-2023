const { body, validationResult } = require("express-validator");

exports.renderSignIn = (req, res, status) => {
    
    res.render("sign_in", {
        login_status: status
    })
}

exports.renderSignOut = (req,res) => {
    res.render("sign_up");
}




    
    
    
    
const { Sequelize } = require("sequelize");
const seq = require("../db/Db");

const db = seq.getDB();

const user = require('../models/User')
const projectTeam = require('../models/ProjectTeam_backup')
const project = require('../models/Project')

const selectProjects = async (user_id) => {
    await db.authenticate()
        .then(() => {
            projectTeam.sync();
            project.sync();
        })
        .then(() => projectTeam.findAndCountAll({
            where: {
                userId: user_id
            }
        }))
}

exports.renderHome = (req, res, userId) => {
    res.render("home.ejs");
}


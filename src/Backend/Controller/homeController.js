const { Sequelize } = require("sequelize");
const config = require('../db/config.json')
const fs = require('fs')
const path = require('path');

const db = new Sequelize(config.db, config.user, config.password, {
    host: config.host,
    dialect: "mysql",
    logging: false
});

const selectProjects = async (user_id) => {
    const [userProjects, metadata] = await db.query("SELECT P.name FROM ProjectTeam PT INNER JOIN Project P ON PT.projectId = P.projectId WHERE userId="+user_id);
    return userProjects;
}

exports.renderHome = async (req, res) => {
    const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));

    res.render("home.ejs", {
        userProjects: userInfo.projects
    });

    console.log("OK REDIRECT");
}

exports.createProject = async(req, res)  => {
    //lettura id utente e inserimento in projectTeams
    const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));

    await db.query("INSERT INTO Project(name, visibility, description) VALUES(\'" + req.body.name + "\'," + req.body.visibility + ",\'"+req.body.description +"\')")
        .then(res => db.query("INSERT INTO ProjectTeam(projectId, userId, role) VALUES(" + res[0] +"," + userInfo.userId + ", \'Owner\' )"))
        .catch(err => console.log(err));

    userInfo.projects.push(req.body.name)
    
    //scrittura dei dati aggiornati nel json
    fs.writeFileSync(path.join(__dirname + "../../userInfo.json"), JSON.stringify(userInfo));
    res.redirect('/home');
}

exports.inviteUser = async(req, res) => {
    const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));
    const projectName = userInfo.projects[req.body.projectIndex];
    const userId = await db.query("SELECT id FROM User WHERE username =\'" + req.body.username + "\'").catch(err => console.log(err));
    const projectId = await db.query("SELECT P.projectId FROM ProjectTeam PT INNER JOIN  Project P WHERE userId = " + userId[0][0].id+ " AND name = \'" + projectName + "\'").catch(err => console.log(err));

    await db.query("INSERT INTO ProjectTeam(projectId, userId, role) VALUES(" + projectId[0][0].projectId +"," + userId[0][0].id + ",\'Collaborator\')")
        .catch(err => console.log(err));

    res.redirect('/home')

}
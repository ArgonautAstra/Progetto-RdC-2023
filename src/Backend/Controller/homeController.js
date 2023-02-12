const { Sequelize, QueryTypes } = require("sequelize");
const config = require('../db/config.json')
const fs = require('fs')
const path = require('path');

const db = new Sequelize(config.db, config.user, config.password, {
    host: config.host,
    dialect: "mysql",
    logging: false
});

const selectProjectUpdates = async (userId) => {
    const queryString = `SELECT p.name, u.username, f.fileName, f.uploadDate, u.username 
                        FROM ProjectFiles pf INNER JOIN File f ON pf.fileId = f.fileId
                        INNER JOIN User u ON u.id = f.uploadUser INNER JOIN Project p ON pf.projectId = p.projectId
                        WHERE p.projectId IN (
                            SELECT projectId
                            FROM ProjectTeam pt INNER JOIN User u2 ON pt.userId = u2.id 
                            WHERE u2.id = ${userId}
                        )
                        ORDER BY f.uploadDate DESC`

    const [projectsUpdates, metadata] = await db.query(queryString);
    return projectsUpdates;
}

exports.renderHome = async (req, res) => {
    const userInfo = JSON.parse(req.cookies.userInfo);

    const projectsUpdates = await selectProjectUpdates(userInfo.userId);

    const updatesStrings = [];

    for(update of projectsUpdates) {
        let date = String(update.uploadDate).replace("GMT+0100 (Ora standard dell’Europa centrale)", "")
        updatesStrings.push(`${update.username} uploaded ${update.fileName} in project ${update.name} at ${date} `)
    }

    res.render("home.ejs", {
        userProjects: userInfo.projects,
        updatesStrings: updatesStrings
    });

    console.log("OK REDIRECT");
}

exports.createProject = async(req, res)  => {
    //lettura id utente e inserimento in projectTeams
    const userInfo = JSON.parse(req.cookies.userInfo);

    await db.query("INSERT INTO Project(name, visibility, descritipion) VALUES(\'" + req.body.name + "\'," + req.body.visibility + ",\'"+req.body.description +"\')")
        .then(res => db.query("INSERT INTO ProjectTeam(projectId, userId, role) VALUES(" + res[0] +"," + userInfo.userId + ", \'Owner\' )"))
        .catch(err => console.log(err));

    userInfo.projects.push(req.body.name)
    
    //scrittura dei dati aggiornati nel json
	res.cookie("userInfo", JSON.stringify(userInfo))
    res.redirect('/home');
}

exports.inviteUser = async(req, res) => {
    const userInfo = JSON.parse(req.cookies.userInfo);
    const projectName = userInfo.projects[req.body.projectIndex];
    const changeVisibility = req.body.changeVisibility;
    
    const projectId = await db.query("SELECT P.projectId FROM ProjectTeam PT INNER JOIN  Project P WHERE userId = " + userInfo.userId + " AND name = \'" + projectName + "\'").catch(err => console.log(err));
    const userId = await db.query("SELECT id FROM User WHERE username =\'" + req.body.username + "\'").catch(err => console.log(err));
    
    if(userId[0][0]!== 'undefined' && (projectId[0][0] !== 'undefined')) {
        await db.query("INSERT INTO ProjectTeam(projectId, userId, role) VALUES(" + projectId[0][0].projectId +"," + userId[0][0].id + ",\'Collaborator\')")
            .catch(err => console.log(err));
    }

    if(changeVisibility && (projectId[0][0] !== 'undefined')) {
        await db.query(`UPDATE Project SET visibility = 0 WHERE projectId = ${projectId[0][0].projectId}`).catch(err => console.log(err));
    }

    res.redirect('/home')

}

exports.searchProjects = async (req, res) => {
    const [projectsQuery, metadata] = await db.query(`SELECT name FROM Project WHERE name LIKE \'${req.body.searchQuery}%\'
                                                            AND visibility = 0`)
    .catch(err => console.log(err));

    const result = [];

    projectsQuery.forEach(e => result.push(e.name))

    res.render("search.ejs", {
        result: result
    });
}
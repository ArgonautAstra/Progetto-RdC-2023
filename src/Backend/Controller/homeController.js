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

exports.renderHome = async (req, res, userId) => {
    let projects = await selectProjects(userId);
    const arr = []


    for(project of projects)
        arr.push(project.name)

    //creazione di un file json da cui ricavare i dati per il resto delle operazion
    let userInfo = {
        userId: userId,
        projects: arr
    };

    fs.writeFileSync(path.join(__dirname + "../../userInfo.json"), JSON.stringify(userInfo));

    //PASSANDO DIRETTAMENTE projects NON FUNZIONA IN EJS (DICE CHE NON È ITERABLE MA QUA LO È )
    res.render("home.ejs", {
        userProjects: arr
    });
}

exports.createProject = async(req, res, userId)  => {
    //lettura id utente e inserimento in projectTeams
    
    const userInfo = JSON.parse(fs.readFileSync(path.join(__dirname + "../../userInfo.json")));
    await db.query("INSERT INTO Project(name, visibility, description) VALUES(\'" + req.body.name + "\'," + req.body.visibility + ",\'"+req.body.description +"\')")
        .then(res => db.query("INSERT INTO ProjectTeams(projectId, userId) VALUES(" + res[0] +"," + userInfo.userId + ")"))
        .catch(err => console.log(err));

    res.render("home.ejs", {
        userProjects: userInfo.projects
    })

    

}

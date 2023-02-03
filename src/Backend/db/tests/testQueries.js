const { Sequelize} = require('sequelize');
const config = require('../config.json')

const express = require('express')

const port = 3000;
const app = express();


app.listen(port, async () => {
    db = new Sequelize(config.db, config.user, config.password, {
        host: config.host,
        dialect: "mysql",
        logging: false
    });
    const [userProjects, metadata] = await db.query("SELECT P.projectId, P.name FROM ProjectTeam PT INNER JOIN Project P ON PT.projectId = P.projectId WHERE userId =15");
    for(project of userProjects) {
        console.log(project.name)
    }
})
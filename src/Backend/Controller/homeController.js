const { Sequelize } = require("sequelize");
const config = require('../db/config.json')

const selectProjects = async (user_id) => {
    db = new Sequelize(config.db, config.user, config.password, {
        host: config.host,
        dialect: "mysql",
        logging: false
    });
    const [userProjects, metadata] = await db.query("SELECT P.name FROM ProjectTeam PT INNER JOIN Project P ON PT.projectId = P.projectId WHERE userId="+user_id);
    return userProjects;
}

exports.renderHome = async (req, res, userId) => {
    let projects = await selectProjects(userId);
    const arr = []

    for(project of projects)
        arr.push(project.name)

    //PASSANDO DIRETTAMENTE projects NON FUNZIONA IN EJS (DICE CHE NON È ITERABLE MA QUA LO È )
    res.render("home.ejs", {
        userProjects: arr
    });
}

const express = require('express')
const database = require("./src/Backend/db/Db")
const app = express();
const data = database.getDB()
const port = 3000;



app.use(express.static('public'));

app.set('views', './src/views')
app.set("view engine", "ejs")

app.route('/').get(async (req, res) => {
	res.render('index', {
		title: 'Web Application using Node.js',
		heading: 'Hello C# Corner, Welcome to Node.js Tutorial',
		foodItems: ['Pizza', 'Burger', 'Pasta']
	});
});

app.listen(port, () => {
	console.log(`Worker: process ${process.pid} is up on port ${port}`);
});

const path = require("path");
exports.uploadFile = (req,res)=>{
	const files = req.files

	Object.keys(files).forEach(key => {
		const filepath = path.join(process.cwd(), 'files', files[key].name)
		console.log(filepath)
		files[key].mv(filepath, (err) => {
			if (err) return res.status(500).json({ status: "error", message: err })
		})
	})

	return res.json({ status: 'success', message: Object.keys(files).toString() })
}
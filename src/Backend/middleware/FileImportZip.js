const path = require("path");
const extract = require("extract-zip");
const fs = require("fs");

const extractZip = async (source, target, zipped) => {
	try {
		await extract(source, {dir: target,onEntry:(entry,zipfile)=>{
				zipped.push({
					name: entry.fileName,
					path: path.join(target,entry.fileName)
				})
			}});
		console.log("Extraction complete");
	} catch (err) {
		console.log("Oops: extractZip failed", err);
	}
}
const unzip = async (dirPath) => {
	const files = fs.readdirSync(dirPath);
	const zippedFiles = []

	await Promise.all(
		files.map(async (file) => {
			if (fs.statSync(dirPath + "/" + file).isDirectory()) {
				await unzip(dirPath + "/" + file);
			} else {
				const fullFilePath = path.join(dirPath, "/", file);
				const folderName = file.replace(".zip", "");
				if (file.endsWith(".zip")) {
					await extractZip(fullFilePath, path.join(dirPath, "/", folderName),zippedFiles);
					await unzip(path.join(dirPath, "/", folderName));
				}
			}
		})
	);
	return zippedFiles
};

const Unzipping = async (req, res,next) =>{
	const file = req.files
	const keyfile = Object.keys(file)
	const pathTemp = path.join(process.cwd(), 'files', 'temp', file[keyfile].name)
	const pathProject = path.join(process.cwd(), 'files', req.params.nameproject)
	
	await file[keyfile].mv(pathTemp).then(()=>{
		const namefiles = unzip(path.join(process.cwd(), 'files', 'temp'))
		namefiles.then((data)=>{
			
			for (let item of data){
				console.log(item)
				fs.rename(item.path, path.join(pathProject,item.name),(err)=>{
					if (err) return console.log(err)
					console.log("moved")
					item.path = path.join(pathProject,item.name)
				})
			}

			res.locals.zippedfiles = data
			fs.rmSync(pathTemp,{recursive:true})
			next()
		})
	}).catch((err)=>{
		console.log(err)
		res.sendStatus(500)
	})
}

module.exports = Unzipping
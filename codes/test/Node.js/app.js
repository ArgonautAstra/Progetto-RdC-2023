const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

app.post("/uploads", function(req, res) {
    if(req.files && Object.keys(req.files).length !== 0) {
        const uploadedFile = req.files.uploadFile;

        console.log(uploadedFile);

        const uploadPath = __dirname + "/uploads/" + uploadedFile.name;

        uploadedFile.mv(uploadPath, function(err) {
            if(err) {
                console.log(err);
                res.send("Failed");
            } else res.sendFile(__dirname + "/index.html");
        });
    } else res.send("No file uploaded");
})


app.get("/downloads", function(req, res) {
    res.download(__dirname + "/text.txt", function(err) {
        if(err) {
            console.log(err);
        }
    });
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(3000, function(req, res) {
    console.log("Started listening to port 3000");
});
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express(); 

const dataLocation = path.join(`${__dirname}/../frontend/data/`);

// Igy sozlgaljuk ki az index.html-t
function getFunction(request, response){
    response.sendFile(path.join(`${__dirname}/../frontend/index.html`));
}
app.get("/", getFunction);

// Az alabbi sor kiszolgalja  a frontend/public konyvtarbol a fajlokat
app.use(fileUpload());
app.use("/pub", express.static(`${__dirname}/../frontend/public`));

// Minden ami az upload folderben van, azt teszi ez a sor elerhetove. De csak a pontos url-t megadva eri el a bongeszo
app.use("/upload", express.static(`${__dirname}/../frontend/upload`));



// If there is a data.json, read the data from the file, if not, use an empty Array
let jsonData = [];
try {
    let data = fs.readFileSync(`${dataLocation}data.json`, error => {
        if (error) {
            console.log(error);
        }``
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${dataLocation}data.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
}

const uploads = path.join(`${__dirname}/../frontend/upload/`);

//az első elemnek ugyanannak kell lennie mint a fetchnél a script.js-ben ("/")
//req jön a frontend oldalról, res a válasz a backendről
app.post("/", (req, res) => {
    // Upload image
    const picture = req.files.picture;
    const answer = {};
    if (picture) {
        picture.mv(uploads + picture.name, error => {
            return res.status(500).send(error);
        });
    }
    answer.pictureName  = picture.name;

    //network/response nál látszik ez
    res.send(answer)

    // Upload data from form
    const formData = req.body;
    formData.image_name = picture.name;
    jsonData.push(formData);

    fs.writeFile(`${dataLocation}data.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
});

const port = 9000;
const ipAddress = `http://127.0.0.1:${port}`;
app.listen(port, () => {
    console.log(ipAddress)
});
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const fs = require('fs');
const http = require('http');

const server = express();
server.use(bodyParser.json());

server.post('/', function (req, res) {
    console.log("incoming:", req.data);
    saveImages(req.data, () => { res.send("Images reannotated"); });
});

server.listen((process.env.PORT || 8000), function () {
    console.log('Server listening');
});

const saveImage = (reqBody, res) => {
    var class_ex_name = reqBody.newClass + "_positive_examples";
    var localpath = "./images/" + class_ex_name + ".jpg";
    var file = fs.createWriteStream(localpath);
    var request = http.get(reqBody.imageUrl, function (response) {
        response.pipe(file);
        file.on('finish', () => {
            file.close(() => {
                uploadImage(localpath, class_ex_name, res);
            });  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        console.log("save err:", err);
    });
}

const uploadImage = (localImagePath, class_ex_name, res) => {
    var visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        iam_apikey: 'NI127iWt-nSPDUZQ9y-6ShvLldGfLRrlCXXFLId3yhZ_'
    });


    var params = {
        classifier_id: 'DefaultCustomModel_917421811',
        class_ex_name: fs.createReadStream(localImagePath)
    };

    res();
    // visualRecognition.updateClassifier(params,
    //     function (err, response) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log(JSON.stringify(response, null, 2));
    //         }
    //     });
}
var express = require('express');
var app = express();
const fs = require('fs');

function startServer(){
    var level = 1; //1 - нормально; 0 - букв меньше чем подсказок
    app.get('/', function (req, res) {
    if (req.query.level==0){
        word = readWords("words.csv")[randomIndex(520)]
    } else {
        word = readWords("words.csv")[randomIndex(999-520)+520];
    }
    res.send("{\"randomWord\" : \"" + word +"\"}");
    })
    app.use('/hangman', express.static('game'));
    app.use('/memo', express.static('../../memo'));

    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
   
        console.log("Example app listening at http://%s:%s", host, port)
    })
}

function readWords(filePath){
    var fileContent = fs.readFileSync(filePath, "utf8");
    var words = fileContent.split("\n");
    return words;
}

function randomIndex(maxVal){
    var index = Math.floor(Math.random() * (maxVal + 1));
    return index;
}

startServer();

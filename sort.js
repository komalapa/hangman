const fs = require('fs');

function sortByLength(array){
    for (let i = 0; i<array.length -1; i++){
        let flag=false;
        for (let j = 0; j<array.length -1 - i; j++){
            if (array[j].length>array[j+1].length){
                let buf = array[j];
                array[j]=array[j+1];
                array[j+1]=buf;
                flag = true;
            }
        }
        if (!flag) {
            i = array.length;
        }
    }
    return array;
}


var filePath = "words.csv";
var fileContent = fs.readFileSync(filePath, "utf8");
var words = fileContent.split("\n");
words.splice(-1);
var sortedWords = sortByLength(words);
var sortedWordsStr = sortedWords.join("\n");
fs.writeFile("sorted.csv",sortedWordsStr, function(err){
    if (err) {
        return console.log(err);
    }
});
    


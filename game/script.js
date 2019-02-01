var attempts =6;
var answer = [];
var word = "";
var remainingLetters



function enterEvent(){
    var input = document.getElementById("letter");
    input.addEventListener("keydown", function(event) {
        
        if (event.code == "Enter" ) {
            event.preventDefault();
            game()
        }
        
    }, true);
}
document.addEventListener("DOMContentLoaded", enterEvent); 

function readInput() {
    
    var rawLetter = document.getElementById("letter").value;
    var letter = rawLetter.toLowerCase();
    var reg = /[а-я]/;
    if (letter.length !== 1) {
        $("#messages").text("нужна только одна буква");
    } else if (letter.match(reg)) {
        return letter;
    } else {
        $("#messages").text("нужна одна БУКВА");

    }
}

function addMisletter(letter) {
    $("#misletters").append("<a>"+letter+"</a>");
    
}

function addCorrectLetter(letter, i) {
    var name = "#letter" + i
    $(name).text(letter);
}

function refreshCanvas(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,200,300);
}

function drawMan(steps){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (steps == 6){
        ctx.arc(100,40,30,0,2*Math.PI,true);
        ctx.stroke();
    } else if (steps == 5) {
        ctx.moveTo(100,70);
        ctx.lineTo(100,170);
        ctx.stroke();
    } else if (steps == 4){
        ctx.moveTo(100,170);
        ctx.lineTo(150,220);
        ctx.stroke();
    } else if (steps ==3){
        ctx.moveTo(100,170);
        ctx.lineTo(50,220);
        ctx.stroke();
    } else if (steps == 2){
        ctx.moveTo(100,100);
        ctx.lineTo(50,70);
        ctx.stroke();
    } else {
        ctx.moveTo(100,100);
        ctx.lineTo(150,70);
        ctx.stroke();
    }
}

async function parseTheWord(){
    var theWord;
    var jsonString = await requestTheWord();
    console.log(jsonString);
    JSON.parse(jsonString, function(key, val) {
            if (key == 'randomWord') {
                theWord = val;
                
            }
    });
    return theWord;
}

function returner (val){
    return val;
}

function requestTheWord(){
    var level = $('input[name=level]:checked').val();
    var promiseNewWord = new Promise( function(resolve,reject){
        
        fetch(`http://127.0.0.1:8081?level=${level}`)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {  
                        var theWord = data['randomWord'];
                        resolve(theWord);
                })
            } else{
                reject("ошибка: не удалось получить слово")    
            }
        })
    })
    var requestNewWord = function() { 
                        promiseNewWord.then(function(fulfiled){
                        word = fulfiled;
                        start();
                        })
                       .catch (function(error){
                            console.log(error.message)
                        })
                      };
    requestNewWord();
                
}



function start(){
    remainingLetters=word.length;
    attempts =6;
    answer = [];
    refreshCanvas();
    $("#word").empty();
    $("#word").append("<p>Слово:</p>");
    
    $("#misletters").empty();
    $("#misletters").append("<p>Ошибки:</p>");
    $("#misletters").append("<a class= \"space\">_</a>");
    
    for (var i = 0; i < word.length; i++){
        answer.push("_");
        $("#word").append("<a id=\"letter"+i+"\">_</a>");
    }
    showFirstLetter();
    $("#messages").text("Начали!");
}

function changeLevel(){
    $("#messages").text("Изменения только в следующей игре!"); 
}

function showFirstLetter(){
    if ((attempts == 6)&&(remainingLetters == word.length)){
        if (document.getElementById("firstLetterCheckBox").checked == true){
            game(word[0]);
        
        }
    } else {
       $("#messages").text("Изменения только в следующей игре!"); 
    }
}

function game(letter) {

    var curIndex;
    if ((remainingLetters>0)&&(attempts>0)){
        if (letter === undefined) {
            letter = readInput(); 
        }
        if (letter){
            curIndex=word.indexOf(letter);
            if ((curIndex>=0)&&(answer[curIndex]==="_")){
                while (curIndex>=0){
                    answer[curIndex]=letter;
                    addCorrectLetter(letter,curIndex);
                    $("#messages").text("Ура!");
                    remainingLetters--;
                    curIndex=word.indexOf(letter, curIndex+1);
                    if (remainingLetters==0){
                        $("#messages").text("Победа!!!"); 
                    }
                }
            } else {
                drawMan(attempts);
                $("#messages").text("Не-а!");
                attempts--;
                addMisletter(letter);
                if (attempts<1){
                    $("#messages").text("Попытки закончились. Слово: "+word.toUpperCase());
                }
            } 
        }
      }
}
 
function helpMe(){
    if ((word.length>0)&&(attempts>0)&&(remainingLetters>0)){
        var i=0;
        while (answer[i] != "_"){
            i++
        }
        
        game(word[i]);
          if (remainingLetters==0){
            $("#messages").text("Победа!!!");
        } else {
            $("#messages").text("Помогли...");    
        }
        drawMan(attempts);
        attempts--;
        addMisletter(word[i]);
        if (attempts<1){
            if (remainingLetters == 0){
                $("#messages").text("Победа, помогли...");    
            } else {
                $("#messages").text("Попытки закончились. Слово: "+word.toUpperCase());
            }
        }
    }
}

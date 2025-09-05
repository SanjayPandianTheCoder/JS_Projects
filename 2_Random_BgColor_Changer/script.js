const changeColorButton = document.getElementById("changeColorButton");
const colorCodeCharacters = "1234567890ABCDEF";
const bodyElement = document.body;

function generateRandomColorCode(){
    var colorCode = "";
    for(let i=0; i<6; i++){
        let randomIndex = Math.floor(Math.random()*colorCodeCharacters.length);
        colorCode += colorCodeCharacters.charAt(randomIndex);
    }
    return '#'+colorCode;
}

document.addEventListener("DOMContentLoaded", ()=>{
    changeColorButton.addEventListener("click", ()=>{
        var colorCode = generateRandomColorCode();
        bodyElement.style.backgroundColor = colorCode;
    })
});
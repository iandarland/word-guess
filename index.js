
//Blank variables to be defined later with global access
var firstWord
var lowWord
var score
var blankWord
var timeInterval
var timeLeft

// Query selectors
var gameEl = document.querySelector(".game-container")
var homeEl = document.querySelector(".home-screen")
var winEl = document.querySelector(".win-page")
var loseEl = document.querySelector(".lose-page")
var wordEl = document.querySelector(".game-word")
var scoreEl = document.querySelector(".score")
var timerEl = document.querySelector('.time')
var messageEl = document.querySelector('.message')
var startButtons = document.querySelectorAll(".start-game")

//Score pulled from local storage OR set to zero if no local storage item has been set
var yourScore = JSON.parse(localStorage.getItem("word-score")) || 
{
    wins: 0,
    losses: 0
};

//function that takes in an array and a value that will return the number of times a value exists in an array and their indexes
function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}


//function that looks at wich key is being pressed and checks it against the letters in the current word
function checkMatch(e){
    var pressed = e.key.toLowerCase()
    //Checking if the pressed key matches any letters in current word set to lower case for consistancy
    var indexArray = getAllIndexes(lowWord, pressed)
    
    //if the index array does not equal zero the following will happen
    if(indexArray.length){
    //Message telling user the number of times that the pressed letter exists in the current word
    messageEl.textContent = indexArray.length > 1 ? `YES there are ${indexArray.length} ${pressed.toUpperCase()}'s in the word!` : `YES there is 1 ${pressed.toUpperCase()} in the word!`
    indexArray.forEach(item => {
        blankWord.splice(item, 1, firstWord[item])
        wordEl.textContent= blankWord.join("")
        console.log(blankWord.join(''))
        if(blankWord.join('') === firstWord){
            youWin()
        }
    })
}else {
    score--
    scoreEl.textContent = score
    messageEl.textContent = `${pressed} is not correct! ${score} guesses left`
    youLose()
}

}

function youWin(){
    gameEl.style.display = "none"
    winEl.style.display= "block"
    yourScore.wins++
    localStorage.setItem("word-score", JSON.stringify(yourScore))
    winEl.querySelector(".wins").textContent= yourScore.wins
    winEl.querySelector(".losses").textContent= yourScore.losses
}

function youLose(){
    var gameDispEl = document.querySelectorAll('.game')
    if(score === 0 || timeLeft === 0){
        timeLeft = 0
        clearInterval(timeInterval)
        gameDispEl.forEach(item => item.style.display='none')
        messageEl.classList.add('wrong')
        messageEl.textContent = `Sorry, you didnt guess the correct movie: ${firstWord}`
        yourScore.losses++
        localStorage.setItem("word-score", JSON.stringify(yourScore))
        loseEl.querySelector(".wins").textContent= yourScore.wins
        loseEl.querySelector(".losses").textContent= yourScore.losses
        var nextScreen = setInterval(function(){
            gameDispEl.forEach(item => item.style.display='block')
            gameEl.style.display = "none"
            loseEl.style.display = "block"
            messageEl.classList.remove('wrong')
            clearInterval(nextScreen)
        }, 3000)
}}

function countdown() {
    timerEl.style.display = "block"
    timeLeft = 20;
    timerEl.textContent= timeLeft
  
    timeInterval = setInterval(function () {
      timeLeft--
      timerEl.textContent = `${timeLeft} seconds`

      youLose()
      if(blankWord.join('') === firstWord){
        clearInterval(timeInterval)
    }
    },1000);
  }

  function startGame(e){
      e.preventDefault()
    firstWord = movies[Math.floor(Math.random()*movies.length)]
    console.log(firstWord)
    lowWord = firstWord.toLowerCase()
    blankWord = firstWord.split("").map(item => {
        if(item=== " " || item === ":" || !isNaN(item)){
            return item
        }else{
            return "_"
        }
    })
    score = 10
    scoreEl.textContent= score
    wordEl.textContent = blankWord.join('')
    firstWord.split("")
    countdown()
    homeEl.style.display = "none"
    winEl.style.display = "none"
    loseEl.style.display = "none"
    gameEl.style.display = "block"
    messageEl.textContent = null
  }


startButtons.forEach(item =>{
    item.addEventListener("click", startGame)
})

document.addEventListener("keydown", checkMatch)
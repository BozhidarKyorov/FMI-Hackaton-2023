import { openSlidingPuzzle } from './slidingPuzzles.js'
import { openMemoryGame, restartGame } from './MemoryGame.js'

var lives = 3;
const removeText = "remove";

var emotions = {
  anger: 0,
  loyalty: 0,
  kindness: 0,
  greed: 0,
  compassion: 0,
  default : 0
}

var container = document.getElementById('story')
document.getElementById("starting_button").addEventListener('click', start)

document.getElementById("giveup-btn").addEventListener('click', () => {
  document.body.classList.remove("active-popup");
  document.getElementById("hint-popup").classList.add(removeText);
 
  if(document.getElementById("memory").classList.contains(removeText)) {
    document.getElementById("sliding").classList.add(removeText);
    removeTilesSlidingPuzzle();
  }
  else {
    document.getElementById("memory").classList.add(removeText);
    restartGame();
  }
  lives--;
isGameOver();
})

document.getElementById("play-game-sliding").addEventListener("click", () => {
  document.getElementById("hint-popup").classList.remove(removeText);
  document.getElementById("sliding").classList.remove(removeText);
  document.body.classList.add("active-popup");
  loadSlidingPuzzle("couple");
});

document.getElementById("play-game-memory").addEventListener("click", () => {
  document.getElementById("hint-popup").classList.remove(removeText);
  document.getElementById("memory").classList.remove(removeText);
  document.body.classList.add("active-popup");
  loadMemoryGame();
});

async function start() {
  document.getElementById("starting_button").style.display = 'none'
  loadModule("texts/story1/gate/castle_gate.txt")
}

async function loadModule(module) {

  let data = await getContent(module)

  var arrayWithArguments = data.split("\r\n")

  if(arrayWithArguments[0] == "dialog") {
    deserializeDialog(arrayWithArguments)
  } else if (arrayWithArguments[0] == "sliding puzzle") {
    SlidingPuzzle(arrayWithArguments)
  } else if (arrayWithArguments[0] == "logic quiz") {
    openQuiz(arrayWithArguments)
  } else if (arrayWithArguments[0] == "boss fight") {
    loadBossFight(arrayWithArguments)
  } else if (arrayWithArguments[0] == 'end') {
    let ending = document.createElement('h3')
    ending.textContent = arrayWithArguments[1]
    container.appendChild(ending)
  }
}

async function getContent(file) {

  let response = await fetch(file)
  let responseText = await response.text()

  return responseText
}

function deserializeDialog(arrayWithArguments) {

  let text = arrayWithArguments[1]
  let imageCount = Number.parseInt(arrayWithArguments[2])
  let imageURLS = getImagesInfo(arrayWithArguments, imageCount)
  let buttonsCount = Number.parseInt(arrayWithArguments[3 + imageCount])
  let buttons = getButtonsInfo(arrayWithArguments, imageCount, buttonsCount)

  let div = document.createElement("div")
  let p = document.createElement("p")
  p.innerText = text
  div.appendChild(p)

  for(let i = 0; i < imageCount; i++) {
    let img = document.createElement("img")
    img.src = imageURLS[i]
    img.classList.add('img')
    div.appendChild(img)
  }
  
  let buttonDiv = document.createElement('div')

  for(let i = 0; i < buttonsCount; i++) {
    let butt = document.createElement("button")
    butt.innerHTML = buttons[i].content
    butt.classList.add("answer_button")
    butt.addEventListener('click', () => {
      emotions[buttons[i].emotion] += Number.parseInt(buttons[i].modifier)
      loadModule(buttons[i].link)
      buttonDiv.style.display = 'none'
      let buttonAnswer = document.createElement('p')
      buttonAnswer.textContent = butt.innerText
      div.appendChild(buttonAnswer)
    })
    buttonDiv.appendChild(butt)
  }
  div.appendChild(buttonDiv)
  div.classList.add("story-chapter")
  container.appendChild(div)
  div.scrollIntoView({ behavior: "smooth", block: "end" })
}

function getImagesInfo(arrayWithArguments, imageCount) {
  let imageURLS = []
  for(let i = 0; i < imageCount; i++) {
    imageURLS.push(arrayWithArguments[3+i])
  }
  return imageURLS
}

function getButtonsInfo(arrayWithArguments, imageCount, buttonsCount) {
  let buttons = [];

  for(let i = 0; i < buttonsCount * 4; i += 4) {
    
    let tempButton = {
      content: "default",
      link: "default_link",
      emotion: "default_emotion",
      modifier: 0
    }
    tempButton.content = arrayWithArguments[4 + imageCount + i]
    tempButton.link = arrayWithArguments[4 + imageCount + i + 1]
    tempButton.emotion = arrayWithArguments[4 + imageCount + i + 2]
    tempButton.modifier = arrayWithArguments[4 + imageCount + i + 3]
    buttons.push(tempButton)
  }
  return buttons
}


function SlidingPuzzle(arrayWithArguments) {
  openSlidingPuzzle(arrayWithArguments[1])
}

async function openQuiz(arrayWithArguments) {

  let quiztext = arrayWithArguments[2]
  let next_link = arrayWithArguments[3]

  let p = document.createElement('p')
  p.textContent = quiztext
  container.appendChild(p)

  let randLogicIndex = Math.floor(Math.random() * 15 + 1)
  let logicQuizArguments = await getContent('texts/story1/text_games/logical/' + randLogicIndex + '.txt')

  askLogicQuestion(logicQuizArguments.split("\r\n"), next_link)

  
}

function askLogicQuestion(logicQuizArguments, link_next) {
  let answerDiv = document.createElement('div')

  let logicText = logicQuizArguments[1]
  let logicTextP = document.createElement('p')
  logicTextP.textContent = logicText

  let answersCount = Number.parseInt(logicQuizArguments[2])

  let buttonDiv = document.createElement('div')
  for(let i = 0; i < answersCount * 2; i += 2) {

    let correct = Number.parseInt(logicQuizArguments[3 + i])
    let answerText = logicQuizArguments[3 + i + 1]
    let button = document.createElement('button')
    button.textContent = answerText
    button.classList.add('answer_button')

    button.addEventListener('click', () => {
      buttonDiv.style.display = 'none'
      let returning = document.createElement('p')
      returning.textContent = button.textContent
      if(correct == 0) {
        lives--
        returning.textContent += '\nWrong answer! -1 heart!'
      } else {
        returning.textContent += '\nCorrect answer!'
      }
      container.appendChild(returning)
      
      loadModule(link_next)
    })
    buttonDiv.appendChild(button)
    
  }

  answerDiv.appendChild(logicTextP)

  answerDiv.appendChild(buttonDiv)

  container.appendChild(answerDiv)
  answerDiv.scrollIntoView({ behavior: "smooth", block: "end" })
}

function loadSlidingPuzzle(theme) {

if(openSlidingPuzzle(theme)) {
  console.log("official win");
  removeTilesMemoryGame
  }
}

function loadMemoryGame() {

  if(openMemoryGame()) {
    console.log("official win");
    removeTilesSlidingPuzzle();
    }
  }

function isGameOver() {
  if(lives === 0) {
    // ekran gori
  }
  else return false;
}

function loadBossFight(args) { 
  
  console.log(args)

  let integral = args[1]
  let bossImage = args[3]
  let imgCount = Number.parseInt(args[2])
  let buttonCount = Number.parseInt(args[3 + imgCount])

  let div = document.createElement('div')
  let integralImg= document.createElement('img')
  integralImg.src = integral
  let bossImg = document.createElement('img')
  bossImg.src = bossImage
  div.appendChild(integralImg)
  div.appendChild(bossImg)

  let buttonDiv = document.createElement('div')
 
  for(let i = 0; i < buttonCount * 4; i += 4) {
    let button = document.createElement('button')
    button.textContent = args[4 + imgCount + i]
    button.classList.add('answer_button')
    button.addEventListener('click', () => {
      //console.log(args[5 + imgCount + i])
      loadModule(args[5 + imgCount + i])
      if(args[8+imgCount+i] == '0') {
          life--;
          isGameOver()
      }
      buttonDiv.style.display = 'none'
      emotions[args[6 + imgCount + i]] += Number.parseInt(args[7 + imgCount + i])
    })
    buttonDiv.appendChild(button)
  }
  div.appendChild(buttonDiv)
  container.appendChild(div)
}

function removeTilesSlidingPuzzle() {
  document.getElementById("tiles").innerHTML = "";
}


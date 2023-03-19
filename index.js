import { openSlidingPuzzle } from './slidingPuzzles.js'

var lives = 3;

var emotions = {
  anger: 0,
  loyalty: 0,
  kindness: 0,
  greed: 0,
  compassion: 0,
  default : 0
}

var hp = 2

var container = document.getElementById('story')
document.getElementById("starting_button").addEventListener('click', start)
document.getElementById("start-game").addEventListener('click', loadSlidingPuzzle("couple"))

document.getElementById("giveup-btn").addEventListener('click', () => {
  document.body.classList.remove("active-popup");
  document.getElementById("hint-popup").classList.add("remove");
  lives--;
isGameOver();
})

document.getElementById("play-game").addEventListener("click", () => {
  document.getElementById("hint-popup").classList.remove("remove");
   document.body.classList.add("active-popup");
});

async function start() {
  document.getElementById("starting_button").style.display = 'none'
  loadModule("pickstory.txt")
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
  console.log(buttonsCount)
  let buttons = [];

  for(let i = 0; i < buttonsCount * 4; i+=4) {
    
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
  }
}

function isGameOver() {
  if(lives === 0) {
    // ekran gori
  }
  else return false;
}

function loadBossFight(args) {

}
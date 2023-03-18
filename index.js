import { openSlidingPuzzle } from './slidingPuzzles.js'



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


async function start() {
  loadModule("begin.txt")
}

async function loadModule(module) {

  let data = await getContent(module)

  var arrayWithArguments = data.split("\r\n")

  console.log(arrayWithArguments)

  if(arrayWithArguments[0] == "dialog") {
    deserializeDialog(arrayWithArguments)
  } else if (arrayWithArguments[0] == "sliding puzzle") {
    openSlidingPuzzle(arrayWithArguments)
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
    div.appendChild(img)
  }

  for(let i = 0; i < buttonsCount; i++) {
    let butt = document.createElement("button")
    butt.innerHTML = buttons[i].content
    butt.onclick = function() {
      emotions[buttons[i].emotion] += Number.parseInt(buttons[i].modifier)
      loadModule(buttons[i].link)
    }
    div.appendChild(butt)
  }
  container.appendChild(div)
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

function loadSlidingPuzzle(arrayWithArguments) {
openSlidingPuzzle(arrayWithArguments[1])
}
/*
MOD
TEXT
IMAGE COUNT
IMAGES LINK
BUTTONS COUNT
{ BUTTONS TEXT
  BUTTON LINK }
*/


var container = document.getElementById('story')

async function start() {
  loadModule("begin.txt")
}

async function loadModule(module) {

  let data = await getContent(module)

  var arrayWithArguments = data.split("\r\n")

  console.log(arrayWithArguments)

  if(arrayWithArguments[0] == "dialog") {
    deserializeDialog(arrayWithArguments)
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
  buttons = getButtonsInfo(arrayWithArguments, imageCount, buttonsCount)

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
    butt.onclick = function() {loadModule(buttons[i].link)}
    div.appendChild(butt)
  }
  container.appendChild(div)
}

function getImagesInfo(arrayWithArguments, imageCount) {
  imageURLS = []
  for(let i = 0; i < imageCount; i++) {
    imageURLS.push(arrayWithArguments[3+i])
  }
  return imageURLS
}

function getButtonsInfo(arrayWithArguments, imageCount, buttonsCount) {
  console.log(buttonsCount)
  let buttons = [];

  for(let i = 0; i < buttonsCount * 2; i+=2) {
    
    let tempButton = {
      content: "default",
      link: "default_link"
    }
    tempButton.content = arrayWithArguments[4 + imageCount + i]
    tempButton.link = arrayWithArguments[4 + imageCount + i + 1]
    buttons.push(tempButton)
  }
  return buttons
}
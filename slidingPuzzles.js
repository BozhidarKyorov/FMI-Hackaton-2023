var theme;

var hasWon = false;
export function openSlidingPuzzle(arg) {
  theme = arg;
  start();
}

let numberOfTiles = 9;
let highlighted = 0;
let shuffled = false;
let size = 3;
let currentTile;
let currentTileText;
let buttonContainer = document.getElementById('tiles');

var newTile;
var currentTileIndex;
var currentTileValue;
let hasJustWon = false;

function start() {
  highlighted = numberOfTiles;
  document.getElementsByClassName("game-board")[0].classList.remove("remove");
  newGame();
}

function newGame() {
  loadTiles();
  setTimeout(() => {
      shuffle();
  }, 500);
}

function loadTiles() {
  for (let i = 1; i <= numberOfTiles; i++) {
      newTile = document.createElement('div');
      newTile.id = `tile${i}`;
      newTile.setAttribute('index', i);
      newTile.innerHTML = i;
      newTile.style.backgroundImage = `url(/resources/sliding-puzzle/${theme}/${i}.jpg)`;
      newTile.classList.add('tile');
      newTile.addEventListener('click', function () {
          swap(parseInt(this.getAttribute('index')));
      });
      buttonContainer.append(newTile);
  }
  let selectedTileId = 'tile' + highlighted;
  let selectedTile = document.getElementById(selectedTileId);
  selectedTile.classList.add("selected");
}

function shuffle() {
  let minShuffles = 100;
  let totalShuffles = minShuffles + Math.floor(Math.random() * (200 - 100) + 100);

  for (let i = minShuffles; i <= totalShuffles; i++) {
      setTimeout(function timer() {
          let x = Math.floor(Math.random() * 6);
          let direction = 0;
          if (x == 0) {
              direction = highlighted + 1;
          } else if (x == 1) {
              direction = highlighted - 1;
          } else if (x == 2) {
              direction = highlighted + size;
          } else if (x == 3) {
              direction = highlighted - size;
          }
          swap(direction);
          if (i >= totalShuffles - 1) {
              shuffled = true;
          }
      }, i * 10);
  }
      hasJustWon = false;
}

// Swap tiles 
function swap(clicked) {
  if (clicked < 1 || clicked > (numberOfTiles)) {
      return;
  }

  // Checking if we are trying to swap right
  if (clicked == highlighted + 1) {
      if (clicked % size != 1) {
          setSelected(clicked);
      }
      // Checking if we are trying to swap left
  } else if (clicked == highlighted - 1) {
      if (clicked % size != 0) {
          setSelected(clicked);
      }
      // Checking if we are trying to swap up
  } else if (clicked == highlighted + size) {
      setSelected(clicked);
      // Checking if we are trying to swap down 
  } else if (clicked == highlighted - size) {
      setSelected(clicked);
  }

   if (shuffled && !hasJustWon) {
       if (checkHasWon()) {console.log("win");
  //         document.body.classList.add("active-popup");
  //         timerElement.innerText = timeToDisplay;
  //         document.getElementById("player-time").innerHTML = timeToDisplay;
  //         hasJustWon = true;
  //         stop();
  //         shuffled = false;
      }
   }
}

function checkHasWon() {
  for (let i = 1; i <= numberOfTiles; i++) {
      currentTile = document.getElementById(`tile${i}`);
      currentTileIndex = currentTile.getAttribute('index');
      currentTileValue = currentTile.innerHTML;
      if (parseInt(currentTileIndex) != parseInt(currentTileValue)) {
          return false;
      }
  }
  return true;
}

export function hasWonGame() {
    return hasWon;
}

// Applies stylings to the selected tile
function setSelected(index) {
  currentTile = document.getElementById(`tile${highlighted}`);
  currentTileText = currentTile.innerHTML;
  currentTile.classList.remove('selected');
  newTile = document.getElementById(`tile${index}`);
  currentTile.innerHTML = newTile.innerHTML;
  currentTile.style.backgroundImage = `url(/resources/sliding-puzzle/${theme}/${newTile.innerHTML}.jpg)`;
  newTile.innerHTML = currentTileText;
  newTile.style.backgroundImage = `url(/resources/sliding-puzzle/${theme}/${currentTile}.jpg)`;
  newTile.classList.add("selected");
  highlighted = index;
}

let showNumbersButton = document.getElementById("show-nums");
let areShown = false;
showNumbersButton.addEventListener("click", showNumbers);

function showNumbers() {
  let text = "";
  let color = "";
  if (areShown) {
      text = "Show";
      color = "transparent";
      areShown = false;
  }
  else {
      text = "Hide";
      color = "white"
      areShown = true;
  }
  showNumbersButton.innerHTML = `<span class="btn">${text} tile numbers</span>`;
  for (let i = 1; i <= numberOfTiles; i++) {
      document.getElementById(`tile${i}`).style.color = color;
  }
}
/* ----------------------------------------- Get Canvas ----------------------------------------- */
// The Canvas
let theCanvs = document.getElementById("canvas");
// Canvas Context
let theContext = theCanvs.getContext("2d");

/* ----------------------------------------- Load Images ---------------------------------------- */

let imageBoard = new Image();
imageBoard.src = "../images/snake/board.png";
let imageFood = new Image();
imageFood.src = "../images/snake/food.png";

/* ----------------------------------------- Load Audio ----------------------------------------- */

let dead = new Audio();
let eat = new Audio();
dead.src = "../Sounds/Dead.mp3";
eat.src = "../Sounds/Eat.mp3";

/* -------------------------------------- Default Settings -------------------------------------- */

// Initialize Any Square is With 32
const box = 32;
// Object That Contain Two Value postion of The Snake  ( x, k);
let Snake = [];
// And Make the Snake Default in (288,320) px  Or  (9box, 10box)
Snake[0] = {
  x: 9 * box, // width=9*32 =288
  y: 10 * box, // heigth=10*23=320
};

// Object That Generat FruitX, And  Fruity Position Randomly
let food = {
  y: Math.floor(Math.random() * 15 + 3) * box,
  x: Math.floor(Math.random() * 17 + 1) * box,
};
// Initialize Score Variable To 0
let Score = 0;

/* ------------------------------------------- Events ------------------------------------------- */

// Direction of Snake
let d;

// Event On User Press Keyboard Key
document.addEventListener("keydown", direction);

function direction(event) {
  // The Clicked Keyboard Key Code
  let key = event.keyCode;
  // Check Key Value
  if (key == 65 && d != "RIGHT") {
    // 65 -> a, 37 -> Left Arrow
    // Make d Contains The Left Direction
    d = "LEFT";
  } else if (key == 87 && d != "DOWN") {
    // 87 -> w, 38 -> Up Arrow
    // Make d Contains The Up Direction
    d = "UP";
  } else if (key == 68 && d != "LEFT") {
    // 68 -> d, 39 -> Right Arrow
    // Make d Contains The Right Direction
    d = "RIGHT";
  } else if (key == 83 && d != "UP") {
    // 83 -> s, 40 -> Down Arrow
    // Make d Contains The Down Direction
    d = "DOWN";
  }
}

/* ---------------------------------- Check Collision Function ---------------------------------- */

// Check If Snake Eat Self
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      // Yes Snake Eat Self
      return true;
    }
  }
  // No Snake Does Not Eat Self
  return false;
}

/* -------------------------------------- Score Table [OOP] ------------------------------------- */

// Max Score Position In HTML
let gameScoreOutput = document.getElementById("gameScore");
// Player Name Position In HTML
let gamePlayerName = document.getElementById("playerName");
// Get Reset Score Button
let resetGameScore = document.getElementById("resetGameScore");
// Get Edit Player Name Button
let editPlayerName = document.getElementById("editPlayerName");
// Set New Name Button
let setName = document.getElementById("setName");
// New Name Input Field
let newPlayerName = document.getElementById("newPlayerName");
// New Result object
let newResults;

// Default Values Of Score And Name
if (localStorage.getItem("snakeMaxScore") === null) {
  gameScoreOutput.innerHTML = 0;
} else {
  gameScoreOutput.innerHTML = localStorage.getItem("snakeMaxScore");
}
if (localStorage.getItem("snakePlayerName") === null) {
  var playerName = "User";
  gamePlayerName.innerHTML = "User";
} else {
  var playerName = localStorage.getItem("snakePlayerName");
  gamePlayerName.innerHTML = localStorage.getItem("snakePlayerName");
}

// Storage Array
var results = [];

// Object Of Name And Score
var gameResults = function (nameResult, scoreResult) {
  this.nameResult = nameResult;
  this.scoreResult = scoreResult;
};

// Get Name And Score Function
function getResults() {
  // If Current Score > Max Score
  if (Score > localStorage.getItem("snakeMaxScore")) {
    // Save Score To Local Storage
    localStorage.setItem("snakeMaxScore", results[0].scoreResult);
  }
  // Set Player Name To Local Storage
  localStorage.setItem("snakePlayerName", results[0].nameResult);
  // Save Results In HTML From Local Storage
  gameScoreOutput.innerHTML = localStorage.getItem("snakeMaxScore");
  gamePlayerName.innerHTML = localStorage.getItem("snakePlayerName");
}

// Remove Event Listener On Input Focus
newPlayerName.onfocus = function () {
  document.removeEventListener("keydown", direction);
};

newPlayerName.onblur = function () {
  document.addEventListener("keydown", direction);
  playerName = newPlayerName.value;
};

// Reset Functionality
resetGameScore.onclick = function () {
  localStorage.setItem("snakeMaxScore", 0);
  gameScoreOutput.innerHTML = localStorage.getItem("snakeMaxScore");
};

// Edit Player Name Button
editPlayerName.onclick = function () {
  // Show New Name Section
  $(".newName").slideToggle();
};

// Set New Name
setName.onclick = function () {
  localStorage.setItem("snakePlayerName", newPlayerName.value);
  gamePlayerName.innerHTML = localStorage.getItem("snakePlayerName");
  $(".newName").slideUp();
};

/* ---------------------------------- Draw All Things In Canvas --------------------------------- */

function Draw() {
  // Draw Game Board
  theContext.drawImage(imageBoard, 0, 0);

  for (let i = 0; i < Snake.length; i++) {
    // Fill Colors Of Head And Tail
    theContext.fillStyle = i == 0 ? "#009800" : "#00bc00";
    // Draw The Square of Snake on Canvs
    theContext.fillRect(Snake[i].x, Snake[i].y, box, box);
    // Border Snake Color
    theContext.strokeStyle = "#ff2b2b";
    theContext.strokeRect(Snake[i].x, Snake[i].y, box, box);
  }

  // Draw Apple (Food)
  theContext.drawImage(imageFood, food.x, food.y);

  // Starting Head Position Of Snake
  let SnakeX = Snake[0].x;
  let SnakeY = Snake[0].y;

  // Direction The Snake When You Take From Event And Store It In A Variable d
  if (d == "LEFT") SnakeX -= box;
  if (d == "UP") SnakeY -= box;
  if (d == "RIGHT") SnakeX += box;
  if (d == "DOWN") SnakeY += box;

  // Check If Snake Eat Food
  if (SnakeX == food.x && SnakeY == food.y) {
    // Increase The Length Of The Snake
    Score++;
    // Make Sound To Know That The Snake Eat The Food
    eat.play();
    // Regenerate Food Position Randomly
    food = {
      y: Math.floor(Math.random() * 15 + 3) * box,
      x: Math.floor(Math.random() * 17 + 1) * box,
    };
  } else {
    // Delete The Tail If Snake position Is Not The Same Of Food Position
    Snake.pop();
  }

  // Object To Add New Head to The Snake
  let newHead = {
    x: SnakeX,
    y: SnakeY,
  };

  // The Game Over When The Snake Skip the width And The Height OF The Board
  if (
    SnakeX < box ||
    SnakeX > 17 * box ||
    SnakeY < 3 * box ||
    SnakeY > 17 * box ||
    collision(newHead, Snake)
  ) {
    // Stop Draw Function And Play Dead Sound
    clearInterval(game);
    dead.play();
    // New Results object And Functions
    newResults = new gameResults(playerName, Score);
    results.push(newResults);
    getResults();
  }

  // Add the New Head to Snake From The Begin Array
  Snake.unshift(newHead);

  // The Score Pictue And Setting it of properited
  theContext.fillStyle = "white";
  theContext.font = "45px Changa one";
  theContext.fillText(Score, 2 * box, 1.6 * box);
}

/* ------------------------------- Call Draw Function Every 120ms ------------------------------- */

let game = setInterval(Draw, 120);

/* ------------------------- Reload At Current Position To Get New Game ------------------------- */

document.getElementById("newgame").onclick = function () {
  document.location.reload();
};

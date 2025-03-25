const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
let score = localStorage.getItem("storedScore") ?? 0;
let string = localStorage.getItem("storedMode") ?? false;
let humanMode;
if (string === "false") {
  humanMode = false;
} else {
  humanMode = true;
}
let displayedScore = document.getElementById("displayedScore");
displayedScore.textContent = score;
let firstPlayerButtonId;

let modal = document.getElementById("modal-background");
let rulesButton = document.getElementById("rules-button");
let close = document.getElementById("close");
let modeButton = document.getElementById("mode-button");
let turnTextBox = document.getElementById("turn-text-box");
let opponent = "HOUSE";

rulesButton.onclick = function () {
  modal.style.display = "block";
};
close.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

modeButton.onclick = function () {
  humanMode = !humanMode;
  if (humanMode) {
    turnTextBox.style.display = "block";
  } else {
    turnTextBox.style.display = "none";
  }
  localStorage.setItem("storedMode", humanMode);
};

modeButton.addEventListener("click", function () {
  this.classList.toggle("robot-mode");
});
if (humanMode === true) {
  turnTextBox.style.display = "block";
  modeButton.classList.toggle("robot-mode");
}
async function pickButtonClick(button) {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  modeButton.disabled = true;

  let playerButtonNumber;
  let opponentButtonNumber;
  let playerButtonId;
  let opponentButtonId;

  let buttonId = button.id;

  const keyToValue = [
    "button-scissors",
    "button-paper",
    "button-rock",
    "button-lizard",
    "button-spock",
  ];
  const valueToKey = Object.fromEntries(keyToValue.map((v, k) => [v, k]));
  let turnText = document.getElementById("turn-text");
  if (humanMode) {
    if (!firstPlayerButtonId) {
      firstPlayerButtonId = buttonId;
      turnText.textContent = "OPPONENT'S TURN";
      return;
    } else {
      opponent = "OPPONENT";
      turnTextBox.style.display = "none";
      playerButtonId = firstPlayerButtonId;
      playerButtonNumber = valueToKey[playerButtonId];
      opponentButtonNumber = valueToKey[buttonId];
      opponentButtonId = buttonId;

      firstPlayerButtonNumber = undefined;
    }
  } else {
    playerButtonNumber = valueToKey[buttonId];
    opponentButtonNumber = Math.floor(Math.random() * 5);
    playerButtonId = buttonId;
    opponentButtonId = keyToValue[opponentButtonNumber];
  }

  let difference = playerButtonNumber - opponentButtonNumber;
  const win = [2, 4, -1, -3];
  const lose = [1, 3, -2, -4];
  let gameResult = 0;
  let gameResultText = "";
  if (win.includes(difference)) {
    gameResult = 7;
    gameResultText = "YOU WIN";
    score++;
  } else if (lose.includes(difference)) {
    gameResult = 8;
    gameResultText = "YOU LOSE";
    score--;
  } else {
    gameResult = 3;
    gameResultText = "TIE";
  }
  localStorage.setItem("storedScore", score);
  const dynamicSection = document.getElementById("dynamic-section");
  dynamicSection.innerHTML = `
  <div id="dynamic-box">
    <div class="chosenItemBox" id="chosenItemUserBox">
    <div class="picked-text-box">
      <p class="white-barlow-text spaced-text font-size-big">YOU PICKED</p>
    </div>
      <button class="user chosenItem ${playerButtonId}-big-color big-button-edge">
      <div class="${
        gameResult == 7 ? "winner" : ""
      } white-inside big-inside-size inside-image" id="${playerButtonId}-inside"></div>
      </button>
    </div>
    <div id="game-result-box"></div>
    <div class="chosenItemBox" id="chosenItemRandomBox">
    <div class="picked-text-box">
    <p class="white-barlow-text spaced-text font-size-big">THE ${opponent} PICKED</p>
    </div>
      <div id="dark-circle-box">
        <div class="circle" id="dark-circle">
      </div>
    </div>
  </div>
  `;

  await sleep(700);
  let playButtonWidth = Math.min(0.6 * screenWidth, 0.3 * screenHeight);
  const chosenItemRandomBox = document.getElementById("chosenItemRandomBox");
  chosenItemRandomBox.innerHTML = `
  <div class="picked-text-box">
      <p class="white-barlow-text spaced-text font-size-big">THE ${opponent} PICKED</p>
  </div>
      <button class="house chosenItem ${opponentButtonId}-big-color big-button-edge">
      <div class="${
        gameResult == 8 ? "winner" : ""
      } white-inside big-inside-size inside-image" id="${opponentButtonId}-inside"></div>
      </button>`;

  await sleep(300);
  let gameResultBox = document.getElementById("game-result-box");
  gameResultBox.innerHTML = `
    <p class="white-barlow-text spaced-text" id="game-result-text">${gameResultText}</p>
      <button class="spaced-text barlow-text dark-blue-text" id="play-button">PLAY AGAIN</button>
    `;

  document.getElementById("play-button").onclick = function () {
    location.reload();
  };

  document.querySelector(".winner").style.setProperty("--pseudo-opacity", "1");
  displayedScore.textContent = score;
}

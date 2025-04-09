const targets = document.querySelectorAll(".target");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const gameOverPanel = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let timeLeft = 30;
let gameInterval;
let isGameActive = false;
let shotsFired = 0;

document.addEventListener("click", (e) => {
  const isUI = e.target.closest("#start-btn") ||
               e.target.closest("#restart-btn") ||
               e.target.closest(".overlay") ||
               e.target.closest("#game-over");

  if (!isUI && isGameActive) {
    shotsFired++;
    const shot = new Audio("assets/pistol-shot.mp3");
    shot.play();
  }
});

startBtn.addEventListener("click", startGame);

function startGame() {
    isGameActive = true;
    gameOverPanel.style.display = "none";
    score = 0;
    shotsFired = 0; // resetuj liczenie strzałów
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    startBtn.disabled = true;
  
    targets.forEach((target) => {
      target.style.display = "block";
      target.addEventListener("click", handleHit);
    });
  
    gameInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }
  

function handleHit(e) {
  e.target.style.display = "none";
  score++;
  scoreDisplay.textContent = score;

  setTimeout(() => {
    e.target.style.display = "block";
  }, 1000 + Math.random() * 1500);
}

function endGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    targets.forEach((target) => target.removeEventListener("click", handleHit));
    startBtn.disabled = false;

    finalScoreDisplay.textContent = score;
    gameOverPanel.style.display = "block";
    finalScoreDisplay.textContent = score;

    const acc = shotsFired > 0 ? Math.round((score / shotsFired) * 100) : 0;
    document.getElementById("shots-fired").textContent = shotsFired;
    document.getElementById("accuracy").textContent = acc;

}

restartBtn.addEventListener("click", () => {
  gameOverPanel.style.display = "none";
  startGame();
});

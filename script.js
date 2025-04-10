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

const shotSound = new Audio("assets/pistol-shot.mp3");
shotSound.load();

document.body.addEventListener("click", (e) => {
  const isUI = e.target.closest("#start-btn") ||
               e.target.closest("#restart-btn") ||
               e.target.closest(".overlay") ||
               e.target.closest("#game-over");

  if (!isUI && isGameActive) {
    shotsFired++;
    playSound();
  }
});

function playSound() {
  const shot = shotSound.cloneNode();
  shot.play().catch(() => {
    console.warn("Sound blocked by browser on first interaction");
  });
}

startBtn.addEventListener("click", startGame);

function startGame() {
  isGameActive = true;
  gameOverPanel.style.display = "none";
  score = 0;
  shotsFired = 0;
  timeLeft = 25;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  startBtn.disabled = true;

  targets.forEach((target, i) => {
    target.style.left = "0px";
    target.style.display = "block";
    target.addEventListener("click", handleHit);

    let speed;
    if (i === 0) speed = 250;     // górna - średnia
    else if (i === 1) speed = 350; // środkowa - szybka
    else speed = 180;              // dolna - wolna

    target.dataset.speed = speed;
    moveTarget(target, speed);
  });

  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function moveTarget(target, speedPerSecond) {
  const container = target.parentElement;
  const max = container.clientWidth - target.offsetWidth;

  let direction = Math.random() < 0.5 ? 1 : -1;
  let position = direction === 1 ? 0 : max;

  let lastTime = performance.now();

  function animate(now) {
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    const distance = speedPerSecond * deltaTime;
    position += distance * direction;

    if (position >= max) {
      position = max;
      direction = -1;
    } else if (position <= 0) {
      position = 0;
      direction = 1;
    }

    target.style.transform = `translateX(${position}px)`;

    if (isGameActive && target.style.display !== "none") {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function handleHit(e) {
  const target = e.currentTarget;
  const inner = target.querySelector(".target-inner");

  inner.classList.add("hit");

  setTimeout(() => {
    inner.classList.remove("hit");
    target.style.display = "none";
    score++;
    scoreDisplay.textContent = score;

    setTimeout(() => {
      target.style.display = "block";
      const savedSpeed = parseFloat(target.dataset.speed) || 200;
      moveTarget(target, savedSpeed);
    }, 1000 + Math.random() * 1500);
  }, 300);
}

function endGame() {
  isGameActive = false;
  clearInterval(gameInterval);
  targets.forEach((target) => target.removeEventListener("click", handleHit));
  startBtn.disabled = false;

  finalScoreDisplay.textContent = score;
  gameOverPanel.style.display = "block";

  const acc = shotsFired > 0 ? Math.round((score / shotsFired) * 100) : 0;
  document.getElementById("shots-fired").textContent = shotsFired;
  document.getElementById("accuracy").textContent = acc;
}

restartBtn.addEventListener("click", () => {
  gameOverPanel.style.display = "none";
  startGame();
});

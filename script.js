let score = 0;
const scoreDisplay = document.getElementById('score');

const music = document.getElementById('bg-music');
const mainPage = document.getElementById('main-page');
const gamePage = document.getElementById('game');
const startBtn = document.getElementById('start-btn');
const playerDiv = document.getElementById('player');
const playerImg = playerDiv.querySelector('img');

const runSprites = ['./images/Run1.png', './images/Run2.png'];
const jumpSprite = './images/Jump.png';
const deadSprite = './images/Dead.png';

let currentRunFrame = 0;
let runInterval;
let moveInterval;
let backgroundInterval;
let obstacleInterval;
let obstacleIntervals = [];
let playerPos = 20;
let backgroundPos = 0;
let isJumping = false;
let isGameOver = false;

function startMusicOnce() {
  music.play();
  document.removeEventListener('keydown', startMusicOnce);
  document.removeEventListener('click', startMusicOnce);
}

function startRunning() {
  runInterval = setInterval(() => {
    if (!isJumping && !isGameOver) {
      currentRunFrame = (currentRunFrame + 1) % runSprites.length;
      playerImg.src = runSprites[currentRunFrame];
    }
  }, 200);
}

function movePlayerForward() {
  moveInterval = setInterval(() => {
    const centerStop = gamePage.offsetWidth * 0.4;
    if (playerPos < centerStop) {
      playerPos += 2;
      playerDiv.style.left = playerPos + 'px';
    }
  }, 20);
}

function scrollBackground() {
  backgroundInterval = setInterval(() => {
    backgroundPos -= 1;
    gamePage.style.backgroundPositionX = backgroundPos + 'px';
  }, 20);
}

function jumpPlayer() {
  if (isJumping || isGameOver) return;
  isJumping = true;
  playerImg.src = jumpSprite;
  playerDiv.classList.add('jump');

  setTimeout(() => {
    playerDiv.classList.remove('jump');
    isJumping = false;
  }, 800);
}


function isColliding(player, obstacle) {
  const p = player.getBoundingClientRect();
  const o = obstacle.getBoundingClientRect();

  if (isJumping) return false;

  return (
    p.left < o.right &&
    p.right > o.left &&
    p.top < o.bottom &&
    p.bottom > o.top
  );
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  gamePage.appendChild(obstacle);
  let pos = gamePage.offsetWidth;
  obstacle.style.left = pos + 'px';

  const moveObs = setInterval(() => {
    if (isGameOver) return;
    pos -= 5;
    obstacle.style.left = pos + 'px';

    if (isColliding(playerDiv, obstacle)) {
      clearInterval(moveObs);
      setTimeout(() => gameOver(obstacle), 100);
    }

   if (pos < -50) {
  clearInterval(moveObs);
  if (obstacle.parentElement) {
    gamePage.removeChild(obstacle);
  }
  if (!isGameOver) {
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
  }
}
  }, 20);

  obstacleIntervals.push(moveObs);
}

function startObstacleGeneration() {
  obstacleInterval = setInterval(() => {
    if (!isGameOver) {
      createObstacle();
    }
  }, 2000);
}

function gameOver(obstacle) {
  isGameOver = true;

  clearInterval(runInterval);
  clearInterval(moveInterval);
  clearInterval(backgroundInterval);
  clearInterval(obstacleInterval);
  obstacleIntervals.forEach(clearInterval);

  playerImg.src = deadSprite;
  playerImg.style.width = '150px';
  playerDiv.style.bottom = '20px';
  const playerLeft = playerDiv.offsetLeft;

  playerPos = 20; 
  obstacle.style.left = (playerLeft + 50) + 'px';

  const popup = document.getElementById('game-over-popup');
  popup.style.display = 'flex';
  gamePage.style.pointerEvents = 'none';
}

document.getElementById('btn-yes').addEventListener('click', () => {
  
  const popup = document.getElementById('game-over-popup');
  popup.style.display = 'none';

  
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = 'Score: 0';

  playerPos = 20; 
  playerDiv.style.left = playerPos + 'px'; 

  playerImg.style.width = '100%';
  playerImg.src = runSprites[0];
  playerDiv.style.bottom = '20px';

  
  document.querySelectorAll('.obstacle').forEach(o => o.remove());
  obstacleIntervals.forEach(clearInterval);
  obstacleIntervals = [];

  
  gamePage.style.pointerEvents = 'auto';

  
  clearInterval(moveInterval);

  
  startRunning();
  movePlayerForward();
  scrollBackground();
  startObstacleGeneration();
});


document.getElementById('btn-no').addEventListener('click', () => {
  window.location.reload();
});


startBtn.addEventListener('click', () => {
  mainPage.style.display = 'none';
  gamePage.style.display = 'block';
  startRunning();
  movePlayerForward();
  scrollBackground();
  startObstacleGeneration();
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jumpPlayer();
});

const musicBtnOn = document.getElementById('music-toggle-on');
const musicBtnOff = document.getElementById('music-toggle-off');

musicBtnOn.addEventListener('click', () => {
  music.pause();
  musicBtnOn.style.display = 'none';
  musicBtnOff.style.display = 'block';
});

musicBtnOff.addEventListener('click', () => {
  music.play();
  musicBtnOff.style.display = 'none';
  musicBtnOn.style.display = 'block';
});

document.addEventListener('keydown', startMusicOnce);
document.addEventListener('click', startMusicOnce);





let holes = [];
let currentHole = -1;
let moleVisible = true;
let score = 0;
let moleTimer;
let startTime;
let gameDuration = 30;
let gameActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createHoles();

  // Bind HTML button
  let startButton = select('#startButton');
  startButton.mousePressed(startGame);
}

function startGame() {
  score = 0;
  gameActive = true;
  createHoles();
  moveMole();
  moleTimer = setInterval(moveMole, 1000);
  startTime = millis();
  updateScoreDisplay();
  updateTimerDisplay();
  loop();
}

function draw() {
  background(180, 220, 150);
  drawHoles();
  if (moleVisible && gameActive) drawMole();

  if (gameActive) {
    updateTimerDisplay();

    if (millis() - startTime > gameDuration * 1000) {
      gameActive = false;
      moleVisible = false;
      clearInterval(moleTimer);
      noLoop();
      select('#timerDisplay').html('0');
    }
  }
}

function mousePressed() {
  if (!gameActive || !moleVisible) return;

  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;
  let d = dist(mouseX, mouseY, hole.x, hole.y - moleSize / 4);
  if (d < moleSize / 2) {
    score++;
    moleVisible = false;
    updateScoreDisplay();
  }
}

function moveMole() {
  currentHole = floor(random(holes.length));
  moleVisible = true;
}

function updateScoreDisplay() {
  select('#scoreDisplay').html(score);
}

function updateTimerDisplay() {
  let timeLeft = max(0, gameDuration - floor((millis() - startTime) / 1000));
  select('#timerDisplay').html(timeLeft);
}

function createHoles() {
  holes = [];
  let rows = 2;
  let cols = 3;

  let gapX = width / (cols + 1);
  let gapY = height / (rows + 1);

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      holes.push({ x: col * gapX, y: row * gapY });
    }
  }
}

function drawHoles() {
  fill(60);
  for (let hole of holes) {
    ellipse(hole.x, hole.y, width / 8, height / 12);
  }
}

function drawMole() {
  let hole = holes[currentHole];
  let moleSize = min(width, height) / 9;

  fill(139, 69, 19);
  ellipse(hole.x, hole.y - moleSize / 4, moleSize, moleSize);

  fill(0);
  ellipse(hole.x - moleSize / 5, hole.y - moleSize / 4 - moleSize / 10, moleSize / 8, moleSize / 8);
  ellipse(hole.x + moleSize / 5, hole.y - moleSize / 4 - moleSize / 10, moleSize / 8, moleSize / 8);

  ellipse(hole.x, hole.y - moleSize / 4 + moleSize / 8, moleSize / 4, moleSize / 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createHoles();
}
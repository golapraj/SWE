let holes = [];
let currentHole = -1;
let moleVisible = true;
let score = 0;
let moleTimer;
let startTime;
let gameDuration = 30; // seconds
let gameActive = false;
let startButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  createHoles();

  startButton = createButton('Start / Restart');
  startButton.position(20, 20);
  startButton.mousePressed(startGame);
}

function startGame() {
  score = 0;
  gameActive = true;
  createHoles();
  moveMole();
  moleTimer = setInterval(moveMole, 1000);
  startTime = millis();
  loop(); // ensure draw loop runs
}

function draw() {
  background(180, 220, 150);
  drawHoles();
  if (moleVisible && gameActive) drawMole();
  displayScore();
  displayTimer();

  // End game after time runs out
  if (gameActive && millis() - startTime > gameDuration * 1000) {
    gameActive = false;
    moleVisible = false;
    clearInterval(moleTimer);
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text("Time's up!", width / 2, height / 2);
    noLoop(); // stop draw loop
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
  }
}

function moveMole() {
  currentHole = floor(random(holes.length));
  moleVisible = true;
}

function displayScore() {
  fill(0);
  textSize(min(width, height) / 25);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10 + min(width, height) / 20);
}

function displayTimer() {
  if (gameActive) {
    fill(0);
    textSize(min(width, height) / 30);
    textAlign(LEFT, TOP);
    let timeLeft = max(0, gameDuration - floor((millis() - startTime) / 1000));
    text('Time left: ' + timeLeft, 10, 10 + min(width, height) / 10);
  }
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

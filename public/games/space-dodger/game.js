var GAME_TITLE = "Space Dodger";
var ACCENT_COLOR = "#8b5cf6";
var ENEMY_COLOR = "#f472b6";
var STAR_COLOR = "#38bdf8";
var PLAYER_SPEED = 8;
var PLAYER_RADIUS = 18;

var player;
var scoreLabel;
var infoLabel;
var stars = [];
var enemies = [];
var keys = {};
var ticks = 0;

function start() {
  setSize(800, 600);
  setupScene();
  createPlayer();
  seedStars();
  keyDownMethod(handleKeyDown);
  keyUpMethod(handleKeyUp);
  setTimer(updateFrame, 20);
}

function setupScene() {
  var bg = new Rectangle(getWidth(), getHeight());
  bg.setPosition(0, 0);
  bg.setColor("#050816");
  add(bg);

  scoreLabel = new Text("Score: 0", "18pt 'Courier New'");
  scoreLabel.setPosition(16, 32);
  scoreLabel.setColor("#e5e7eb");
  add(scoreLabel);

  infoLabel = new Text(GAME_TITLE + " - dodge everything", "14pt Arial");
  infoLabel.setPosition(16, 58);
  infoLabel.setColor(ACCENT_COLOR);
  add(infoLabel);
}

function createPlayer() {
  player = new Circle(PLAYER_RADIUS);
  player.setColor(ACCENT_COLOR);
  player.setPosition(getWidth() / 2, getHeight() - 80);
  add(player);
}

function seedStars() {
  for (var i = 0; i < 80; i++) {
    var star = new Circle(Randomizer.nextInt(1, 2));
    star.setColor(STAR_COLOR);
    resetStar(star, true);
    stars.push(star);
    add(star);
  }
}

function resetStar(star, initial) {
  var yPos = initial ? Randomizer.nextInt(0, getHeight()) : 0;
  star.setPosition(Randomizer.nextInt(0, getWidth()), yPos);
  star.speed = Randomizer.nextInt(2, 5);
}

function handleKeyDown(e) {
  keys[e.keyCode] = true;
}

function handleKeyUp(e) {
  keys[e.keyCode] = false;
}

function movePlayer() {
  var dx = 0;
  if (keys[LEFT] || keys[65]) {
    dx -= PLAYER_SPEED;
  }
  if (keys[RIGHT] || keys[68]) {
    dx += PLAYER_SPEED;
  }

  var nextX = player.getX() + dx;
  nextX = Math.max(PLAYER_RADIUS + 6, Math.min(getWidth() - PLAYER_RADIUS - 6, nextX));
  player.setPosition(nextX, player.getY());
}

function updateFrame() {
  ticks++;
  movePlayer();
  animateStars();
  maybeSpawnEnemy();
  moveEnemies();
  cleanEnemies();
}

function animateStars() {
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i];
    star.move(0, star.speed);
    if (star.getY() > getHeight()) {
      resetStar(star, false);
    }
  }
}

function maybeSpawnEnemy() {
  if (ticks % 22 !== 0) {
    return;
  }

  var enemy = new Rectangle(Randomizer.nextInt(20, 50), Randomizer.nextInt(20, 60));
  enemy.setColor(ENEMY_COLOR);
  var startX = Randomizer.nextInt(0, getWidth());
  enemy.setPosition(startX, -80);
  enemy.speed = Randomizer.nextInt(4, 8);
  enemies.push(enemy);
  add(enemy);
}

function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    enemy.move(0, enemy.speed);

    if (intersects(enemy, player)) {
      endGame();
      return;
    }
  }

  if (ticks % 5 === 0) {
    var newScore = Math.floor(ticks / 5);
    scoreLabel.setText("Score: " + newScore);
  }
}

function cleanEnemies() {
  var remaining = [];
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if (enemy.getY() < getHeight() + 100) {
      remaining.push(enemy);
    }
  }
  enemies = remaining;
}

function intersects(rect, circle) {
  var rectCenterX = rect.getX() + rect.getWidth() / 2;
  var rectCenterY = rect.getY() + rect.getHeight() / 2;
  var dx = Math.abs(circle.getX() - rectCenterX);
  var dy = Math.abs(circle.getY() - rectCenterY);
  return dx < rect.getWidth() / 2 + PLAYER_RADIUS && dy < rect.getHeight() / 2 + PLAYER_RADIUS;
}

function endGame() {
  stopTimer(updateFrame);

  var overlay = new Rectangle(getWidth(), getHeight());
  overlay.setPosition(0, 0);
  overlay.setColor("rgba(5, 8, 22, 0.75)");
  add(overlay);

  var title = new Text("Game Over", "28pt 'Courier New'");
  title.setColor("#e5e7eb");
  title.setPosition(getWidth() / 2 - title.getWidth() / 2, getHeight() / 2 - 30);
  add(title);

  var message = new Text("Press R to restart", "16pt Arial");
  message.setColor("#c084fc");
  message.setPosition(getWidth() / 2 - message.getWidth() / 2, getHeight() / 2 + 10);
  add(message);

  keyDownMethod(function (e) {
    if (e.keyCode === 82) {
      location.reload();
    }
  });
}

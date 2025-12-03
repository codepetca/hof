var WELL_COLOR = "#facc15";
var SAT_COLOR = "#38bdf8";
var ASTEROID_COLOR = "#f97316";
var CENTER_X = 400;
var CENTER_Y = 300;

var satellites = [];
var asteroids = [];
var scoreLabel;
var infoLabel;
var ticks = 0;
var score = 0;

function start() {
  setSize(800, 600);
  drawBackdrop();
  placeWell();

  scoreLabel = new Text("Score: 0", "18pt 'Courier New'");
  scoreLabel.setPosition(16, 32);
  scoreLabel.setColor("#e2e8f0");
  add(scoreLabel);

  infoLabel = new Text("Click to launch a satellite", "15pt Arial");
  infoLabel.setColor("#cbd5e1");
  infoLabel.setPosition(16, 58);
  add(infoLabel);

  mouseDownMethod(launchSatellite);
  setTimer(updateFrame, 20);
}

function drawBackdrop() {
  var bg = new Rectangle(getWidth(), getHeight());
  bg.setColor("#0b1222");
  add(bg);

  for (var i = 0; i < 80; i++) {
    var star = new Circle(1);
    star.setColor("#94a3b8");
    star.setPosition(Randomizer.nextInt(0, getWidth()), Randomizer.nextInt(0, getHeight()));
    add(star);
  }
}

function placeWell() {
  var glow = new Circle(32);
  glow.setColor("rgba(250, 204, 21, 0.25)");
  glow.setPosition(CENTER_X, CENTER_Y);
  add(glow);

  var well = new Circle(18);
  well.setColor(WELL_COLOR);
  well.setPosition(CENTER_X, CENTER_Y);
  add(well);
}

function launchSatellite(e) {
  var sat = new Circle(8);
  sat.setColor(SAT_COLOR);
  sat.setPosition(getWidth() / 2, getHeight() - 60);
  sat.vx = (e.getX() - sat.getX()) / 80;
  sat.vy = (e.getY() - sat.getY()) / 80;
  satellites.push(sat);
  add(sat);
}

function updateFrame() {
  ticks++;
  moveSatellites();
  spawnAsteroids();
  moveAsteroids();
  if (ticks % 5 === 0) {
    score += 1;
    updateScoreLabel();
  }
}

function moveSatellites() {
  var remaining = [];
  for (var i = 0; i < satellites.length; i++) {
    var sat = satellites[i];

    var dx = CENTER_X - sat.getX();
    var dy = CENTER_Y - sat.getY();
    var distance = Math.sqrt(dx * dx + dy * dy) + 0.001;
    var pull = 5500 / (distance * distance);
    sat.vx += (dx / distance) * pull * 0.02;
    sat.vy += (dy / distance) * pull * 0.02;

    sat.move(sat.vx, sat.vy);

    if (distance < 18 || outOfBounds(sat)) {
      remove(sat);
    } else if (hitsAsteroid(sat)) {
      endGame();
      return;
    } else {
      remaining.push(sat);
    }
  }
  satellites = remaining;
}

function spawnAsteroids() {
  if (ticks % 90 !== 0) {
    return;
  }

  var asteroid = new Circle(Randomizer.nextInt(10, 20));
  asteroid.setColor(ASTEROID_COLOR);
  asteroid.edge = Randomizer.nextInt(0, 3);

  if (asteroid.edge === 0) {
    asteroid.setPosition(-20, Randomizer.nextInt(0, getHeight()));
    asteroid.vx = Randomizer.nextInt(3, 6);
    asteroid.vy = Randomizer.nextInt(-2, 2);
  } else if (asteroid.edge === 1) {
    asteroid.setPosition(getWidth() + 20, Randomizer.nextInt(0, getHeight()));
    asteroid.vx = -Randomizer.nextInt(3, 6);
    asteroid.vy = Randomizer.nextInt(-2, 2);
  } else if (asteroid.edge === 2) {
    asteroid.setPosition(Randomizer.nextInt(0, getWidth()), -20);
    asteroid.vx = Randomizer.nextInt(-2, 2);
    asteroid.vy = Randomizer.nextInt(3, 6);
  } else {
    asteroid.setPosition(Randomizer.nextInt(0, getWidth()), getHeight() + 20);
    asteroid.vx = Randomizer.nextInt(-2, 2);
    asteroid.vy = -Randomizer.nextInt(3, 6);
  }

  asteroids.push(asteroid);
  add(asteroid);
}

function moveAsteroids() {
  var survivors = [];
  for (var i = 0; i < asteroids.length; i++) {
    var asteroid = asteroids[i];
    asteroid.move(asteroid.vx, asteroid.vy);

    if (distanceToCenter(asteroid) < 24) {
      endGame();
      return;
    }

    if (!outOfBounds(asteroid)) {
      survivors.push(asteroid);
    } else {
      remove(asteroid);
    }
  }
  asteroids = survivors;
}

function hitsAsteroid(circle) {
  for (var i = 0; i < asteroids.length; i++) {
    var asteroid = asteroids[i];
    var dx = circle.getX() - asteroid.getX();
    var dy = circle.getY() - asteroid.getY();
    var minDist = circle.getRadius() + asteroid.getRadius();
    if (dx * dx + dy * dy < minDist * minDist) {
      return true;
    }
  }
  return false;
}

function outOfBounds(shape) {
  return shape.getX() < -80 || shape.getX() > getWidth() + 80 || shape.getY() < -80 || shape.getY() > getHeight() + 80;
}

function distanceToCenter(shape) {
  var dx = CENTER_X - shape.getX();
  var dy = CENTER_Y - shape.getY();
  return Math.sqrt(dx * dx + dy * dy);
}

function endGame() {
  stopTimer(updateFrame);

  var overlay = new Rectangle(getWidth(), getHeight());
  overlay.setColor("rgba(0, 0, 0, 0.7)");
  add(overlay);

  var title = new Text("Lost in orbit", "28pt 'Courier New'");
  title.setColor("#e2e8f0");
  title.setPosition(getWidth() / 2 - title.getWidth() / 2, getHeight() / 2 - 30);
  add(title);

  var message = new Text("Press R to restart", "16pt Arial");
  message.setColor(SAT_COLOR);
  message.setPosition(getWidth() / 2 - message.getWidth() / 2, getHeight() / 2 + 6);
  add(message);

  keyDownMethod(function (e) {
    if (e.keyCode === 82) {
      location.reload();
    }
  });
}

function updateScoreLabel() {
  scoreLabel.setText("Score: " + score);
}

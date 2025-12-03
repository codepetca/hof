var ROAD_COLOR = "#0b1021";
var LANE_COLOR = "#1e293b";
var CAR_COLOR = "#38bdf8";
var ENEMY_COLOR = "#ec4899";
var ORB_COLOR = "#a3e635";
var PLAYER_WIDTH = 40;
var PLAYER_HEIGHT = 70;
var ROAD_PADDING = 120;

var player;
var scoreLabel;
var lanes = [];
var traffic = [];
var orbs = [];
var keys = {};
var ticks = 0;
var score = 0;

function start() {
  setSize(800, 600);
  drawRoad();
  createPlayer();
  createLaneLines();

  scoreLabel = new Text("Score: 0", "18pt 'Courier New'");
  scoreLabel.setPosition(16, 32);
  scoreLabel.setColor("#e2e8f0");
  add(scoreLabel);

  keyDownMethod(handleDown);
  keyUpMethod(handleUp);
  setTimer(loop, 20);
}

function drawRoad() {
  var road = new Rectangle(getWidth() - ROAD_PADDING * 2, getHeight());
  road.setPosition(ROAD_PADDING, 0);
  road.setColor(ROAD_COLOR);
  add(road);
}

function createPlayer() {
  player = new Rectangle(PLAYER_WIDTH, PLAYER_HEIGHT);
  player.setColor(CAR_COLOR);
  player.setPosition(getWidth() / 2 - PLAYER_WIDTH / 2, getHeight() - PLAYER_HEIGHT - 30);
  add(player);
}

function createLaneLines() {
  var laneCount = 10;
  var laneWidth = 8;
  for (var i = 0; i < laneCount; i++) {
    var lane = new Rectangle(laneWidth, 60);
    lane.setColor(LANE_COLOR);
    lane.setPosition(getWidth() / 2 - laneWidth / 2, i * 80);
    lane.speed = 5;
    lanes.push(lane);
    add(lane);
  }
}

function handleDown(e) {
  keys[e.keyCode] = true;
}

function handleUp(e) {
  keys[e.keyCode] = false;
}

function loop() {
  ticks++;
  moveLaneLines();
  movePlayer();
  spawnTraffic();
  spawnOrbs();
  moveTraffic();
  moveOrbs();
  updateScore();
}

function moveLaneLines() {
  for (var i = 0; i < lanes.length; i++) {
    var lane = lanes[i];
    lane.move(0, lane.speed);
    if (lane.getY() > getHeight()) {
      lane.setPosition(lane.getX(), -80);
    }
  }
}

function movePlayer() {
  var dx = 0;
  if (keys[LEFT] || keys[65]) {
    dx -= 8;
  }
  if (keys[RIGHT] || keys[68]) {
    dx += 8;
  }

  var minX = ROAD_PADDING + 16;
  var maxX = getWidth() - ROAD_PADDING - PLAYER_WIDTH - 16;
  var nextX = Math.max(minX, Math.min(maxX, player.getX() + dx));
  player.setPosition(nextX, player.getY());
}

function spawnTraffic() {
  if (ticks % 35 !== 0) {
    return;
  }

  var car = new Rectangle(Randomizer.nextInt(30, 60), Randomizer.nextInt(60, 90));
  car.setColor(ENEMY_COLOR);
  car.setPosition(Randomizer.nextInt(ROAD_PADDING + 10, getWidth() - ROAD_PADDING - 70), -120);
  car.speed = Randomizer.nextInt(4, 7);
  traffic.push(car);
  add(car);
}

function spawnOrbs() {
  if (ticks % 80 !== 0) {
    return;
  }

  var orb = new Circle(12);
  orb.setColor(ORB_COLOR);
  orb.setPosition(Randomizer.nextInt(ROAD_PADDING + 20, getWidth() - ROAD_PADDING - 20), -40);
  orb.speed = 5;
  orb.radius = 12;
  orbs.push(orb);
  add(orb);
}

function moveTraffic() {
  var remaining = [];
  for (var i = 0; i < traffic.length; i++) {
    var car = traffic[i];
    car.move(0, car.speed);
    if (intersectsRect(car, player)) {
      endGame();
      return;
    }
    if (car.getY() < getHeight() + 140) {
      remaining.push(car);
    } else {
      remove(car);
    }
  }
  traffic = remaining;
}

function moveOrbs() {
  var kept = [];
  for (var i = 0; i < orbs.length; i++) {
    var orb = orbs[i];
    orb.move(0, orb.speed);
    if (hitCircleRect(orb, player)) {
      score += 50;
      updateScoreLabel();
      remove(orb);
    } else if (orb.getY() < getHeight() + 50) {
      kept.push(orb);
    } else {
      remove(orb);
    }
  }
  orbs = kept;
}

function updateScore() {
  if (ticks % 10 === 0) {
    score += 1;
    updateScoreLabel();
  }
}

function intersectsRect(rect1, rect2) {
  var aLeft = rect1.getX();
  var aRight = rect1.getX() + rect1.getWidth();
  var aTop = rect1.getY();
  var aBottom = rect1.getY() + rect1.getHeight();

  var bLeft = rect2.getX();
  var bRight = rect2.getX() + rect2.getWidth();
  var bTop = rect2.getY();
  var bBottom = rect2.getY() + rect2.getHeight();

  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

function hitCircleRect(circle, rect) {
  var closestX = Math.max(rect.getX(), Math.min(circle.getX(), rect.getX() + rect.getWidth()));
  var closestY = Math.max(rect.getY(), Math.min(circle.getY(), rect.getY() + rect.getHeight()));
  var dx = circle.getX() - closestX;
  var dy = circle.getY() - closestY;
  var radius = circle.radius || (circle.getRadius ? circle.getRadius() : 12);
  return dx * dx + dy * dy < radius * radius;
}

function endGame() {
  stopTimer(loop);

  var overlay = new Rectangle(getWidth(), getHeight());
  overlay.setColor("rgba(2, 6, 23, 0.8)");
  add(overlay);

  var title = new Text("Crash!", "28pt 'Courier New'");
  title.setColor("#e2e8f0");
  title.setPosition(getWidth() / 2 - title.getWidth() / 2, getHeight() / 2 - 30);
  add(title);

  var message = new Text("Press R to restart", "16pt Arial");
  message.setColor(ENEMY_COLOR);
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

setSize(400, 480);
// Constants
const rule = "CLICK THE RAT!!!";
const rule2 = "BROWN RAT = +1 point";
const rule3 = "GRAY RAT = -1 point"
const start = "PRESS 'S' TO START!";

const EAR_RADIUS = 15;
const BODY_LENGTH = 50;
const EYE_LENGTH = 10;
const SOIL_HEIGHT = 30;
const GAME_TIME = 60;
const START_DELAY = 2000;
const MIN_DELAY = 600;
let DELAY = START_DELAY;
const BODY_OFFSET = 5.5;

// Game state
let score = 0;
let moleParts = [];
let scoreText;
let timerText;
let playing = false;
let startScreen;
let gameTimeLeft = GAME_TIME;
let moleTimer;
let isBadMole = false;
let moleColor;
let cloudsArray = [];

function main() {
    drawStartScreen();
    keyDownMethod(startGame);
    mouseDownMethod(clickMole);
}

function drawStartScreen() {
    startScreen = new Rectangle(getWidth(), getHeight());
    startScreen.setPosition(0, 0);
    startScreen.setColor("#ebdfc3");
    add(startScreen);

    let ruleText = new Text(rule, "25pt Times New Roman");
    ruleText.setPosition(55, 120);
    ruleText.setColor("black");
    add(ruleText);
    
    let rule2Text = new Text(rule2, "17pt Comic Sans MS");
    rule2Text.setPosition(70, 190);
    rule2Text.setColor("black");
    add(rule2Text);
    
    let rule3Text = new Text(rule3, "17pt Comic Sans MS");
    rule3Text.setPosition(70, 240);
    rule3Text.setColor("black");
    add(rule3Text);

    let startText = new Text(start, "25pt Times New Roman");
    startText.setPosition(55, 320);
    startText.setColor("black");
    add(startText);
    
    let teamLetterText = new Text("Team C", "20pt Times New Roman");
    teamLetterText.setPosition(300, 400);
    teamLetterText.setColor("black");
    add(teamLetterText);
}

function startGame(e) {
    if (e.key == "s" && !playing) {
        playing = true;
        removeAll();
        drawScreen2Background();
        drawScore();
        drawTimer();
        setTimer(updateTimer, 1000);
        moleTimer = setInterval(drawMole, DELAY);
    }
}

function drawScore() {
    scoreText = new Text("SCORE: 0", "20pt Times New Roman");
    scoreText.setPosition(10, 30);
    scoreText.setColor("black");
    add(scoreText);
}

function drawTimer() {
    timerText = new Text("TIME: " + gameTimeLeft, "20pt Times New Roman");
    timerText.setPosition(250, 30);
    timerText.setColor("black");
    add(timerText);
}

function updateTimer() {
    gameTimeLeft--;
    timerText.setText("Time: " + gameTimeLeft);
    if (gameTimeLeft <= 0) {
        clearInterval(moleTimer);
        stopTimer(updateTimer);
        removeAll();
        let gameOverText = new Text("Game Over! Final Score: " + score, "20pt Arial");
        gameOverText.setPosition(40, getHeight()/2);
        add(gameOverText);
    }
}

function drawMole() {
    if (!playing) return;

    removeMole();

    let x = Randomizer.nextInt(20, getWidth() - 100);
    let y = Randomizer.nextInt(100, getHeight() - 100);

    isBadMole = Randomizer.nextInt(1, 5) == 1;
    
    if (isBadMole) {
    moleColor = "gray";
    } else {
        moleColor = "#a68c72";
    }

    let ear = new Circle(EAR_RADIUS);
    ear.setPosition(x+ 25,y+ 35);
    ear.setColor(moleColor);
    add(ear);
        
    let ear1 = new Circle(EAR_RADIUS);
    ear1.setPosition(x+ 65,y+ 35);
    ear1.setColor(moleColor);
    add(ear1);
        
    let body = new Rectangle(BODY_LENGTH,BODY_LENGTH);
    body.setColor(moleColor);
    body.setPosition(x+ 25 - BODY_OFFSET,y+ 30);
    add(body);
        
    let eye1 = new Rectangle(EYE_LENGTH,EYE_LENGTH);
    eye1.setPosition(x+ 30,y+ 50);
    eye1.setColor("black");
    add(eye1);
    
    let eye2 = new Rectangle(EYE_LENGTH,EYE_LENGTH);
    eye2.setPosition(x+ 50,y+ 50);
    eye2.setColor("black");
    add(eye2);
        
    let soil1 = new Rectangle(BODY_LENGTH,SOIL_HEIGHT);
    soil1.setPosition(x+ 20,y+ 80);
    soil1.setColor("brown");
    add(soil1);
        
    let soil2 = new Rectangle(BODY_LENGTH+40,SOIL_HEIGHT-10);
    soil2.setPosition(x+ 0,y+ 90);
    soil2.setColor("brown");
    add(soil2);
        
    let hand1 = new Rectangle(15,10);
    hand1.setColor("#e69885");
    hand1.setPosition(x+ 20-15/2,y+ 80);
    add(hand1);
    
    let hand2 = new Rectangle(15,10);
    hand2.setColor("#e69885");
    hand2.setPosition(x+ 70-15/2,y+ 80);
    add(hand2);


    moleParts = [ear, ear1, body, eye1, eye2, soil1, soil2, hand1, hand2];


    if (DELAY > MIN_DELAY) {
        DELAY -= 50;
        clearInterval(moleTimer);
        moleTimer = setInterval(drawMole, DELAY);
    }
}

function removeMole() {
    for (let i = 0; i < moleParts.length; i++) {
        remove(moleParts[i]);
    }
    moleParts = [];
}

function clickMole(e) {
    let obj = getElementAt(e.getX(), e.getY());
    if (obj != null && moleParts.includes(obj)) {
        removeMole();
        if (isBadMole) {
            score -= 1;
        } else {
            score += 1;
        }
        scoreText.setText("Score: " + score);
    }
}

function clouds(){
    // Constants for Clouds
    let CLOUD_RADIUS = 25;

    // Draw three fluffy clouds in different positions
    drawRealFluffyCloud(50, 30);
    drawRealFluffyCloud(300, 100);
    drawRealFluffyCloud(200, 50);

    function drawRealFluffyCloud(startX, startY){
        let cloudCircles = [];

        // Top layer (white)
        for(let i = 0; i < 7; i++){
            let circle = new Circle(CLOUD_RADIUS);
            circle.setColor(Color.WHITE);
            let x = startX + i * (CLOUD_RADIUS * 0.9);
            let y = startY + Randomizer.nextInt(-5, 5);
            circle.setPosition(x, y);
            add(circle);
            cloudCircles.push(circle);
        }

        // Middle layer (very light blue)
        for(let i = 0; i < 8; i++){
            let circle = new Circle(CLOUD_RADIUS);
            circle.setColor("#e6f7ff");
            let x = startX - (CLOUD_RADIUS / 2) + i * (CLOUD_RADIUS * 0.9);
            let y = startY + CLOUD_RADIUS * 0.6 + Randomizer.nextInt(-3, 3);
            circle.setPosition(x, y);
            add(circle);
            cloudCircles.push(circle);
        }

        // Bottom layer (light blue)
        for(let i = 0; i < 6; i++){
            let circle = new Circle(CLOUD_RADIUS);
            circle.setColor("#cceeff");
            let x = startX + (CLOUD_RADIUS / 2) + i * (CLOUD_RADIUS * 0.9);
            let y = startY + CLOUD_RADIUS * 1.2 + Randomizer.nextInt(-3, 3);
            circle.setPosition(x, y);
            add(circle);
            cloudCircles.push(circle);
        }

        // Assign a random dx for this cloud
        let dx = Randomizer.nextInt(1, 3);

        // Add this cloud group to the cloudsArray
        cloudsArray.push({circles: cloudCircles, dx: dx});
    }
}

function moveClouds(){
    for(let i = 0; i < cloudsArray.length; i++){
        let cloud = cloudsArray[i];

        // Move each circle in the cloud group
        for(let j = 0; j < cloud.circles.length; j++){
            cloud.circles[j].move(cloud.dx, 0);
        }

        // Check for wall collisions for this cloud group
        if(cloud.circles[0].getX() + 25 >= getWidth() || cloud.circles[0].getX() - 25 <= 0){
            cloud.dx = -cloud.dx;
        }
    }
}

function drawSky() {
const BOX_COUNT = 10;
const SKY_HEIGHT = getHeight() / BOX_COUNT;
const SKY_WIDTH = getWidth();

    let colors = ["#7FAFDB", "#8BB8E0", "#97C1E5", "#A3CAEA", "#AFD3EF",  
                  "#BBDBF4", "#C7E4F9", "#D3EDFE", "#DFF6FF", "#EBFFFF"];
    for (let i = 0; i < BOX_COUNT; i++) {
        let skyBox = new Rectangle(SKY_WIDTH, SKY_HEIGHT);
        skyBox.setPosition(0, i * SKY_HEIGHT);
        skyBox.setColor(colors[i]);
        add(skyBox);
    }
}

function drawMountain(){
    let mountain2Bottom = new Polygon();
    mountain2Bottom.addPoint(2,280);
    mountain2Bottom.addPoint(15,273);
    mountain2Bottom.addPoint(22,267);
    mountain2Bottom.addPoint(33,258);
    mountain2Bottom.addPoint(44,255);
    mountain2Bottom.addPoint(56,250);
    mountain2Bottom.addPoint(64,242);
    mountain2Bottom.addPoint(82,227);
    mountain2Bottom.addPoint(113,226);
    mountain2Bottom.addPoint(125,219);
    mountain2Bottom.addPoint(136,211);
    mountain2Bottom.addPoint(150,201);
    mountain2Bottom.addPoint(156,197);
    mountain2Bottom.addPoint(155,191);
    mountain2Bottom.addPoint(169,183);
    mountain2Bottom.addPoint(181,173);
    mountain2Bottom.addPoint(211,145);
    mountain2Bottom.addPoint(231,128);
    mountain2Bottom.addPoint(240,126);
    mountain2Bottom.addPoint(252,129);
    mountain2Bottom.addPoint(263,136);
    mountain2Bottom.addPoint(276,142);
    mountain2Bottom.addPoint(309,147);
    mountain2Bottom.addPoint(329,162);
    mountain2Bottom.addPoint(344,167);
    mountain2Bottom.addPoint(359,179);
    mountain2Bottom.addPoint(368,185);
    mountain2Bottom.addPoint(388,191);
    mountain2Bottom.addPoint(399,195,);
    mountain2Bottom.addPoint(401,285);
    mountain2Bottom.addPoint(0,293);
    mountain2Bottom.addPoint(0,280);
    mountain2Bottom.setColor("#006400");
    add(mountain2Bottom); 
    
let mountain2Base = new Polygon();
    mountain2Base.addPoint(31,297);
    mountain2Base.addPoint(93,272);
    mountain2Base.addPoint(106,253);
    mountain2Base.addPoint(114,252);
    mountain2Base.addPoint(128,239);
    mountain2Base.addPoint(131,240);
    mountain2Base.addPoint(132,245);
    mountain2Base.addPoint(130,251);
    mountain2Base.addPoint(139,246);
    mountain2Base.addPoint(154,232);
    mountain2Base.addPoint(196,200);
    mountain2Base.addPoint(182,218);
    mountain2Base.addPoint(177,232);
    mountain2Base.addPoint(188,224);
    mountain2Base.addPoint(194,215);
    mountain2Base.addPoint(209,206);
    mountain2Base.addPoint(196,230,);
    mountain2Base.addPoint(197,234);
    mountain2Base.addPoint(162,256);
    mountain2Base.addPoint(161,266);
    mountain2Base.addPoint(183,252);
    mountain2Base.addPoint(172,266);
    mountain2Base.addPoint(160,275);
    mountain2Base.addPoint(93,301);
    mountain2Base.addPoint(78,300);
    mountain2Base.addPoint(144,258);
    mountain2Base.addPoint(113,258);
    mountain2Base.addPoint(61,298);
    mountain2Base.addPoint(30,297);
    mountain2Base.setColor("#7a7372");
    add(mountain2Base);
    
let mountain3Base = new Polygon();
    mountain3Base.addPoint(143,300);
    mountain3Base.addPoint(182,285);
    mountain3Base.addPoint(202,264);
    mountain3Base.addPoint(182,278);
    mountain3Base.addPoint(181,269);
    mountain3Base.addPoint(244,217);
    mountain3Base.addPoint(255,218);
    mountain3Base.addPoint(257,223);
    mountain3Base.addPoint(257,234);
    mountain3Base.addPoint(309,193);
    mountain3Base.addPoint(317,205);
    mountain3Base.addPoint(327,205);
    mountain3Base.addPoint(329,206);
    mountain3Base.addPoint(328,214);
    mountain3Base.addPoint(330,214);
    mountain3Base.addPoint(343,208);
    mountain3Base.addPoint(346,210);
    mountain3Base.addPoint(347,217);
    mountain3Base.addPoint(335,226);
    mountain3Base.addPoint(306,205);
    mountain3Base.addPoint(306,254);
    mountain3Base.addPoint(348,220);
    mountain3Base.addPoint(358,221);
    mountain3Base.addPoint(307,265);
    mountain3Base.addPoint(331,260);
    mountain3Base.addPoint(361,231);
    mountain3Base.addPoint(381,231);
    mountain3Base.addPoint(367,254);
    mountain3Base.addPoint(339,282);
    mountain3Base.addPoint(296,297);
    mountain3Base.addPoint(188,302);
    mountain3Base.addPoint(142,302);
    mountain3Base.setColor("#7a7372");
    add(mountain3Base);
}

function drawGrass(){
    let greenMountains = new Polygon();
    greenMountains.addPoint(0,283);
    greenMountains.addPoint(0,297);
    greenMountains.addPoint(87,304);
    greenMountains.addPoint(170,304);
    greenMountains.addPoint(253,300);
    greenMountains.addPoint(333,295);
    greenMountains.addPoint(360,296);
    greenMountains.addPoint(401,287);
    greenMountains.addPoint(402,293);
    greenMountains.addPoint(402,293);
    greenMountains.addPoint(402,289);
    greenMountains.addPoint(402,282);
    greenMountains.addPoint(327,286);
    greenMountains.addPoint(306,292);
    greenMountains.setColor("#74af39");
    add(greenMountains);
    
    let grass1Bottom = new Polygon();
    grass1Bottom.addPoint(402,297);
    grass1Bottom.addPoint(-1,306);
    grass1Bottom.addPoint(-1,333);
    grass1Bottom.addPoint(402,332);
    grass1Bottom.setColor("#74af39");
    add(grass1Bottom);
    
    let grassTop = new Polygon();
    grassTop.addPoint(400,286);
    grassTop.addPoint(389,287);
    grassTop.addPoint(368,292);
    grassTop.addPoint(346,293);
    grassTop.addPoint(309,298);
    grassTop.addPoint(288,298);
    grassTop.addPoint(262,298);
    grassTop.addPoint(239,300);
    grassTop.addPoint(212,300);
    grassTop.addPoint(183,300);
    grassTop.addPoint(139,303);
    grassTop.addPoint(94,302);
    grassTop.addPoint(57,301);
    grassTop.addPoint(18,298);
    grassTop.addPoint(0,298);
    grassTop.addPoint(1,322);
    grassTop.addPoint(29,322);
    grassTop.addPoint(50,328);
    grassTop.addPoint(61,321);
    grassTop.addPoint(74,329);
    grassTop.addPoint(92,323);
    grassTop.addPoint(118,323);
    grassTop.addPoint(156,329);
    grassTop.addPoint(166,321);
    grassTop.addPoint(188,329);
    grassTop.addPoint(214,324);
    grassTop.addPoint(248,326);
    grassTop.addPoint(297,323);
    grassTop.addPoint(339,324);
    grassTop.addPoint(355,329);
    grassTop.addPoint(395,326);
    grassTop.addPoint(402,326);
    grassTop.addPoint(400,286);
    grassTop.setColor("#74af39");
    add(grassTop); 
    
    let grass2Top = new Polygon();
    grass2Top.addPoint(1,295);
    grass2Top.addPoint(61,300);
    grass2Top.addPoint(111,301);
    grass2Top.addPoint(150,301);
    grass2Top.addPoint(311,296);
    grass2Top.addPoint(355,292);
    grass2Top.addPoint(384,287);
    grass2Top.addPoint(401,281);
    grass2Top.addPoint(377,299);
    grass2Top.addPoint(130,311);
    grass2Top.addPoint(43,305);
    grass2Top.addPoint(1,303);
    grass2Top.addPoint(0,303);
    grass2Top.setColor("#74af39");
    add(grass2Top);
    
    let grassMid = new Polygon();
    grassMid.addPoint(401,300);
    grassMid.addPoint(373,303);
    grassMid.addPoint(345,301);
    grassMid.addPoint(322,305);
    grassMid.addPoint(292,305);
    grassMid.addPoint(262,308);
    grassMid.addPoint(237,308);
    grassMid.addPoint(212,308);
    grassMid.addPoint(169,311);
    grassMid.addPoint(133,312);
    grassMid.addPoint(100,315);
    grassMid.addPoint(86,316);
    grassMid.addPoint(105,318);
    grassMid.addPoint(143,318);
    grassMid.addPoint(188,319);
    grassMid.addPoint(224,319);
    grassMid.addPoint(249,320);
    grassMid.addPoint(294,320);
    grassMid.addPoint(327,323);
    grassMid.addPoint(351,322);
    grassMid.addPoint(390,320);
    grassMid.addPoint(402,320);
    grassMid.setColor("#80bb45");
    add(grassMid);
    
    let grassBottom = new Polygon();
    grassBottom.addPoint(401,320);
    grassBottom.addPoint(365,323);
    grassBottom.addPoint(337,324);
    grassBottom.addPoint(327,325);
    grassBottom.addPoint(300,323);
    grassBottom.addPoint(270,321);
    grassBottom.addPoint(140,328);
    grassBottom.addPoint(149,323);
    grassBottom.addPoint(0,321);
    grassBottom.addPoint(0,341);
    grassBottom.addPoint(70,350);
    grassBottom.addPoint(96,342);
    grassBottom.addPoint(128,351);
    grassBottom.addPoint(162,349);
    grassBottom.addPoint(188,340);
    grassBottom.addPoint(218,350);
    grassBottom.addPoint(233,344);
    grassBottom.addPoint(249,357);
    grassBottom.addPoint(302,346);
    grassBottom.addPoint(330,340);
    grassBottom.addPoint(362,350);
    grassBottom.addPoint(370,346);
    grassBottom.addPoint(401,345);
    grassBottom.setColor("#74af39");
    add(grassBottom);
    
    let baseCut = new Polygon();
    baseCut.addPoint(-1 - 70, 300 + 10);
    baseCut.addPoint(27 - 70, 303 + 10);  
    baseCut.addPoint(55 - 70, 301 + 10);  
    baseCut.addPoint(78 - 70, 305 + 10);  
    baseCut.addPoint(108 - 70, 305 + 10); 
    baseCut.addPoint(138 - 70, 308 + 10); 
    baseCut.addPoint(163 - 70,308 + 10);  
    baseCut.addPoint(188 - 70,308 + 10); 
    baseCut.addPoint(231 - 70,311 + 10); 
    baseCut.addPoint(267 - 70,312 + 10);  
    baseCut.addPoint(300 - 70,315 + 10); 
    baseCut.addPoint(314 - 70,316 + 10); 
    baseCut.addPoint(295 - 70,318 + 10); 
    baseCut.addPoint(257 - 70,318 + 10); 
    baseCut.addPoint(212 - 70,319 + 10);  
    baseCut.addPoint(176 - 70,319 + 10);  
    baseCut.addPoint(151 - 70,320 + 10); 
    baseCut.addPoint(106 - 70,320 + 10); 
    baseCut.addPoint(73 - 70,323 + 10);
    baseCut.addPoint(49 - 70,322 + 10);
    baseCut.addPoint(10 - 70,320 + 10);
    baseCut.addPoint(-2 - 70,320 + 10);
    baseCut.setColor("#80bb45");
    add(baseCut);
    
    let flowerBottomGround = new Polygon();
    flowerBottomGround.addPoint(0,341);
    flowerBottomGround.addPoint(0,480);
    flowerBottomGround.addPoint(402,480);
    flowerBottomGround.addPoint(402,346);
    flowerBottomGround.addPoint(374,342);
    flowerBottomGround.addPoint(364,349);
    flowerBottomGround.addPoint(331,338);
    flowerBottomGround.addPoint(252,355);
    flowerBottomGround.addPoint(234,343);
    flowerBottomGround.addPoint(221,349);
    flowerBottomGround.addPoint(189,339);
    flowerBottomGround.addPoint(166,347);
    flowerBottomGround.addPoint(129,350);
    flowerBottomGround.addPoint(99,341);
    flowerBottomGround.addPoint(71,349);
    flowerBottomGround.addPoint(0,340);
    flowerBottomGround.setColor("#74af39");
    add(flowerBottomGround);
}

function flowersBase(){
    for (let i = 0; i < 50; i++) {
        let x = Randomizer.nextInt(0, 400);
        let y = Randomizer.nextInt(341, 480);
        addFlower(x, y);
    }
}

function addFlower(x, y){
    for (let angle = 0; angle < 360; angle += 72) {
        let rad = angle * Math.PI / 180;
        let petal = new Circle(2);
        petal.setColor("white");
        petal.setPosition(x + 4 * Math.cos(rad), y + 4 * Math.sin(rad));
        add(petal);
    }
    let center = new Circle(1.5);
    center.setColor("yellow");
    center.setPosition(x, y);
    add(center);
}

function drawScreen2Background(){
    drawSky();
    clouds();
    setTimer(moveClouds, 40);
    drawMountain();
    drawGrass();
    flowersBase();
}

main();
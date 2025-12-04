//Kevin, Kelton, Max, Larkin

//pipes global variable
const OBSTACLE_MOVE=2;
const OBSTACLE_FN=5;
const PIPE_GAP=10;
let pipeSize=200;
let pipeDown;
let pipeUp;
let pipeY;
let array=[];
const PIPE_FREQUENCY=1800;
//----------------------

//bird variables
let timer = 0;
let rect;
let circ;
let beak;
let jump;
let gravity = 0;
let dy = 5;
let over = false;
//----------------------

//background variables
let counter = 0;
let period = 0;
let sky;
let sun;
//----------------------
//score variables
let num;
let score;

//This program lets the user control a duck that needs to jump through pipes the increase their score
function main() {
    makeMenu();
    controlBirdStuff();
    
    background();
    setTimer(background, 400);
}

//gets called after the menu disappears
function gameStart() {
    setTimer(initPipes,PIPE_FREQUENCY);
    setTimer(movePipes,OBSTACLE_FN);
    
    initScore();
    
    keyDownMethod(jumpp);
    setTimer(moveGravity, 10);
    setTimer(startTimer,1);
    
    //mouseMoveMethod(test);
    setTimer(checkPipeCollision, 10);
}

//controls the menu
function makeMenu() {
    let halfx = getWidth() / 2;
    let halfy = getHeight() / 2;
    
    let menuObjects = [];
    
    let isStart = false;
    
    tap();
    initMouse();
    
    mouseClickMethod(getMouseClick);
    
    //the function that controls most of the menu
    function tap() {
        let color = "orange";
        let w = 1;
        let num = 10;
        
        let offx1 = -60;
        let offy1 = 30;
        let offx2 = -30;
        let offy2 = 35;
        let offx3 = -20;
        let offy3 = 40;
        
        let tColor = "white";
        
        let readyColor = "#5DD85D";
        let roffy = -80;
        
        let movementColor = "white";
        let moffy = 60;
        
        tapBackground();
        tapText();
        readyText();
        movementText();
        
        //initializes the background of the tap text
        function tapBackground() {
            drawLine(halfx + offx1, halfy + offy1, halfx + offx2, halfy + offy1, halfx + offx1, halfy + offy2, halfx + offx3, halfy + offy2, color, color, w, num);
            drawLine(halfx + offx1, halfy + offy2, halfx + offx3, halfy + offy2, halfx + offx1, halfy + offy3, halfx + offx2, halfy + offy3, color, color, w, num);
            drawLine(halfx - offx1, halfy + offy1, halfx - offx2, halfy + offy1, halfx - offx1, halfy + offy2, halfx - offx3, halfy + offy2, color, color, w, num);
            drawLine(halfx - offx1, halfy + offy2, halfx - offx3, halfy + offy2, halfx - offx1, halfy + offy3, halfx - offx2, halfy + offy3, color, color, w, num);
        }
        
        //initializes the tap text
        function tapText() {
            let text1 = new Text("tap", "20px calibri");
            text1.setColor(tColor);
            text1.setPosition(halfx + offx1, halfy + offy3);
            addObject(text1);
            
            let text2 = new Text("tap", "20px calibri");
            text2.setColor(tColor);
            text2.setPosition(halfx - offx2, halfy + offy3);
            addObject(text2);
        }
        
        //initializes the ready text
        function readyText() {
            let ready = new Text("Get Ready", "50px calibri");
            ready.setColor(readyColor);
            ready.setPosition(halfx - (ready.getWidth() / 2), halfy + (ready.getHeight() / 2) + roffy);
            addObject(ready);
        }
        
        //initializes the text that tells the user the movement controls
        function movementText() {
            let movement = new Text("Press W or Up Arrow Keys to Jump", "20px calibri");
            movement.setColor(movementColor);
            movement.setPosition(halfx - (movement.getWidth() / 2), halfy + (movement.getHeight() / 2 + moffy));
            addObject(movement);
        }
    }
    
    //initializes the mouse image
    function initMouse() {
        let mouseImage = "https://codehs.com/uploads/2ed7844d5b531f3477f99678ab766db7";
        let mouseSize = 35;
        let offy = 30;
        
        let mouse = new WebImage(mouseImage);
        mouse.setSize(mouseSize, mouseSize);
        mouse.setPosition(halfx - (mouseSize / 2), halfy - (mouseSize / 2) + offy);
        addObject(mouse);
    }
    
    //This function draws lines in between two lines
    function drawLine(x1, y1, x2, y2, x3, y3, x4, y4, icolor, ocolor, width, n) {
        //Draw the lines in between the two lines
        for (let i = 0; i < n; i++) {
            let ln = new Line(x1 + ((x3 - x1) / n * i), y1 + ((y3 - y1) / n * i), x2 + ((x4 - x2) / n * i), y2 + ((y4 - y2) / n * i));
            ln.setColor(icolor);
            ln.setLineWidth(width);
            addObject(ln);
        }
        
        //Draw the first line
        let ln1 = new Line(x1, y1, x2, y2);
        ln1.setColor(ocolor);
        ln1.setLineWidth(width);
        addObject(ln1);
        
        //Draw the second line
        let ln2 = new Line(x3, y3, x4, y4);
        ln2.setColor(ocolor);
        ln2.setLineWidth(width);
        addObject(ln2);
    }
    
    //adds the menu objects into an array to be deleted after
    function addObject(object) {
        object.layer = 50;
        add(object);
        menuObjects.push(object);
    }
    
    //starts the game when the user clicks their mouse
    function getMouseClick(e) {
        if (!isStart) {
            removeMenu();
            gameStart();
            
            isStart = true;
        }
    }
    
    //removes all the menu elements
    function removeMenu() {
        for (let i = 0; i < menuObjects.length; i++) {
            remove(menuObjects[i]);
        }
    }
}

//----------------------
//start of pipe code
//below are the functions for pipes
function initPipes(){
    let pipeDown;
    let pipeUp;
    pipeDown=new Rectangle(80,500);
    pipeUp=new Rectangle(80,500);
    
    //pipeDown, Y range -> -110,-450
    pipeY=Randomizer.nextInt(-160,-450);
    pipeDown.setPosition(getWidth(),pipeY);
    pipeDown.setColor("#73BF2F");
    pipeDown.layer = 100;
    add(pipeDown);
    
    pipeUp.setPosition(getWidth(),pipeY+pipeDown.getHeight()+140);
    pipeUp.setColor("#73BF2F");

    pipeUp.layer = 100;
    add(pipeUp);
    
    //create a hitbox to interact with the duck and read for scores
    let checkBox = new Rectangle(3,140);
    checkBox.setPosition(getWidth()+40,pipeY+pipeDown.getHeight());
    checkBox.setColor("rgba(0, 0, 0, 0)");    
    checkBox.layer=99;
    add(checkBox);
    
    let pipes=[];
    pipes.push(pipeUp);
    pipes.push(pipeDown);
    pipes.push(checkBox);
    array.push(pipes);
    
    

}

//moves all the pipes
function movePipes(){
   
    for (let i=0; i<array.length;i++){
        array[i][0].move(-3,0);
        array[i][1].move(-3,0);
        array[i][2].move(-3,0);
        if (array[i][0].getX() + array[i][0].getWidth() < 0) {
            // Remove the pipes from the screen
            remove(array[i][0]);
            remove(array[i][1]);
            remove(array[i][2]);

            array.splice(i, 1);

            i--;
        }
    }

}

//end of pipe code
//----------------------
//start of bird code

// controls the createBird function
function controlBirdStuff(){
    createBird();
}

//creates the bird and sets the layers
function createBird(){
    rect = new Circle(25);
    rect.setPosition(getWidth()/3 - 50, getHeight()/2);
    rect.setColor("yellow");
    rect.layer = 50
    
    beak = new Rectangle(15,7);
    beak.setPosition(rect.getX() + rect.getRadius() - 5, getHeight()/2 - beak.getWidth() / 2);
    beak.setColor("orange");
    beak.layer = 49;
    add(beak);
    add(rect);
    
    circ = new Circle(5);
    circ.setPosition(getWidth() / 3 - 43, getHeight()/2 -7);
    circ.setColor("black");
    add(circ);
    circ.layer = 51;
}

//sets the timer of gravity; you fall faster as time progresses
//checks collision f or hitting ground
function startTimer(){
    timer += 0.01;
    gravity = 20 * timer;
    checkHitGround();
}

//function for jumping: when you jump, you stop and reset gravity
// you also change color for everytime you jump
function jumpp(e){
    if (!over){
        if (e.key == "ArrowUp" || e.key == "w"){
            rect.setColor(Randomizer.nextColor());
            stopTimer(startTimer);
            resetTimer();
            
            setTimer(startTimer,1);
        }
    }
}

//resets the timer ; timer becomes -0.2 so it goes up then as time progresses, it falls faster
function resetTimer(){
    timer = -0.2;
    gravity = 20 * timer;
}


//check collision for hitting ground
function checkHitGround(){
    if (rect.getY() + rect.getRadius() >= getHeight()){
        stopTimer(startTimer);
        timer = 0;
        gravity = 0;
    }
    
    if (rect.getY() - rect.getRadius() <= 0){
        gameOver();
    }
}

//moves all the graphics
function moveGravity(){
    rect.move(0, gravity);
    beak.move(0, gravity);
    circ.move(0, gravity);
}


//create a score counter at the top
function initScore(){
    num=0;

    score=new Text(num, "30pt Arial");
    score.setPosition(getWidth()/2-15,50);
    score.setColor("White");
    score.layer = 200;
    add(score);
}

 
//creates a 2d array with 4 coordinates that are located on the bird;
//if any of these points come in contact with the pipe, then it stops the game
function checkPipeCollision(){
    //in order of north, east, south, west
    
    let collisionPoints = 
                            [ 
                            [rect.getX(), rect.getY() + rect.getRadius()], 
                            [rect.getX() + rect.getRadius(), rect.getY()],
                            [rect.getX(), rect.getY() - rect.getRadius()],
                            [rect.getX() - rect.getRadius(), rect.getY()]
                            ];
    
    
    //loops through the array
    for (let i = 0; i < collisionPoints.length; i++){
        //current elment equals to the element at the current coordiante
        let currentElement = getElementAt(collisionPoints[i][0], collisionPoints[i][1]);
        if (currentElement != null){
            if (currentElement.layer == 100){
                if (!over){
                    gameOver();
                    over == true;
                }
                
            } 
            
            if (i == 1) {
                if(currentElement.layer==99) {
                    //console.log("hit");
                    num++;
                    score.setText(num);
                    
                }
            }
            //add a win screen to the game
            if(num==50){
                over = true;
                stopTimer(movePipes);
                stopTimer(startTimer);
                gravity = 0;
                dy = 0;
                
                let text = new Text("You win!!!", "50px calibri");
                text.setPosition(getWidth() / 2 - text.getWidth() / 2, getHeight() / 2);
                text.setColor("Blue");
                text.layer = 200;
                add(text);
                break;
            }
        }
        if(collisionPoints[0][1]>=getHeight()){
            gameOver();
        }
    }
    
}

//end of bird code
//----------------------


//function for game over code
function gameOver(){
    over = true;
    stopTimer(movePipes);
    stopTimer(startTimer);
    gravity = 0;
    dy = 0;
    
    let text = new Text("GAME OVER", "50px calibri");
    text.setPosition(getWidth() / 2 - text.getWidth() / 2, getHeight() / 2);
    text.setColor("red");
    text.layer = 200;
    add(text);
}

//----------------------
//start of background code

//creates a day/night of the background
function background() {
    if (counter %  80 == 0 || counter == 0) {
        //creates the daytime background
        if (period % 2 == 0 || period == 0) {
            sky = new Rectangle(getWidth(), getHeight());
            sky.setPosition(0,0);
            sky.setColor("#90E4C1");
            add(sky);
            sunChange("#FDFD96");
            period = period + 1;
        }
    //creates the nighttime background
    } else if (counter % 40 == 0 && period % 2 == 1) {
        sky = new Rectangle(getWidth(), getHeight());
        sky.setPosition(0,0);
        sky.setColor("#020035");
        add(sky);
        moon();
        period = period + 1;
    }
    sunset();
    sunrise();
    counter = counter + 1;
    
}

//adds transition a period between the dayttime and nighttime background
function sunset() {
    if (counter % 40 == 35 && period % 2 == 1) {
        sky.setColor("#2596BE");
        remove(sun);
        sunChange("#fdfdab", 135, 85);
    }
    if (counter % 40 == 36 && period % 2 == 1) {
        sky.setColor("#3D8B8E");
        remove(sun);
        sunChange("#fefec0", 195, 125);
    }
    if (counter % 40 == 37 && period % 2 == 1) {
        sky.setColor("#3D778E");
        remove(sun);
        sunChange("#fefed5", 255, 165);
    }
    if (counter % 40 == 38 && period % 2 == 1) {
        sky.setColor("#3D588E");
        remove(sun);
        sunChange("#ffffea", 315, 205);
    }
    if (counter % 40 == 39 && period % 2 == 1) {
        sky.setColor("#293273");
        remove(sun);
        sunChange("#fffff5", 475, 245);
    }
}

//adds transition a period between the nighttime and daytime background
function sunrise() {
    if (counter % 80 == 75 && period % 2 == 0) {
        sky.setColor("#293273");
    }
    if (counter % 80 == 76 && period % 2 == 0) {
        sky.setColor("#3D588E");
    }
    if (counter % 80 == 77 && period % 2 == 0) {
        sky.setColor("#3D778E");
    }
    if (counter % 80 == 78 && period % 2 == 0) {
        sky.setColor("#3D8B8E");
    }
    if (counter % 80 == 79 && period % 2 == 0) {
        sky.setColor("#2596BE");
    }
}

//adds a sun
function sunChange(color, X = 75, Y = 75) {
    sun = new Circle(50);
    sun.setPosition(X,Y);
    sun.setColor(color);
    add(sun);
}

//adds a moon
function moon() {
    let circ = new Circle(50);
    circ.setPosition(75,75);
    circ.setColor("white");
    add(circ);
}


//end of background code
//-------------------------

main();
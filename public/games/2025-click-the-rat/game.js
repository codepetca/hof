setSize(400, 480);
var numSpikes = 10;
var spike;
var length = getWidth()/numSpikes;
var bird1, beak, eye;
var endMeasage;

// GAME SETTINGS ------------------------------
const dxSpeed = 7;
const birdRad = 20;
const accelG = -9.8/20;
const jumpPower = 10/1.5;
//----------------------------------------------

var dx1 = dxSpeed, dy1 = 0;
const cx = getWidth()/2, cy = getHeight()/2;
var physicsStopped = false;
var beakDirect = 30;
var countdown = 5+1;
var disableCollisions = false;
var canPause = false;
var step = 0;

var addPoints = 0;

var txt1, txt2, txt3, txt4, txt5, txt6, txt7, txt8, txt9, txtPoints;

//bird
function makeBird(){
    bird1 = new Circle(birdRad);
    bird1.setPosition(cx, cy);
    bird1.setColor(Color.red);
    add(bird1);
}
function makeEye(offset){
    eye = new Circle(birdRad - 15);
    eye.setPosition(bird1.getX() - offset, bird1.getY() - 5);
    eye.setColor(Color.black);
    add(eye);
}
function makeBeak(Direct){
    beak = new Polygon;
    beak.addPoint(bird1.getX()+ Direct, bird1.getY() );
    beak.addPoint(bird1.getX() , bird1.getY() + bird1.getRadius()/2);
    beak.addPoint(bird1.getX() , bird1.getY() - bird1.getRadius()/2);
    beak.setColor(Color.orange);
    add(beak);
}

//needs a timer, gives gravity to the bird
function physics(){
        bird1.move(dx1,-dy1);
        beak.move(dx1,-dy1);
        eye.move(dx1,-dy1);
        dy1+=accelG;
        wallBounce();
        checkCollide();
}

//if the bird touches the wall change its direction
//also executes code related to switching direction such as adding points
function wallBounce(){
    if(disableCollisions) return 0; //skips the function if collision is disabled
    var numBounces = addPoints;
    if(bird1.getX()+bird1.getRadius()>=getWidth()){
        remove(beak);
        makeBeak(-bird1.getRadius()*1.5);
        remove(eye);
        makeEye(-5);
        dx1=-Math.abs(dx1);
        
        resetLeft(Math.ceil(1+(numBounces+3)/5));
        
        addPoints++;
        updatePoints();
        
    }
    if(bird1.getX()-bird1.getRadius()<=0){
        remove(beak);
        makeBeak(bird1.getRadius()*1.5);
        remove(eye);
        makeEye(5);
        dx1=Math.abs(dx1);
        
        resetRight(Math.ceil(1+(numBounces+3)/5));
        
        addPoints++;
        updatePoints();

    }
}

//when pressing the SPACE button, jump
function keyJump(e){
    if(e.keyCode == Keyboard.SPACE){
        if(!disableCollisions) dy1=jumpPower;
    }
    
    //below is a secret cheat code
    if(e.keyCode == Keyboard.letter('U'))
        if(step==0) step++;
        else step = 0;
    if(e.keyCode == Keyboard.letter('P'))
        if(step==1) step++;
        else step = 0;
    if(e.keyCode == Keyboard.letter('G'))
        if(step==2) step++;
        else step = 0;
    if(e.keyCode == Keyboard.letter('R'))
        if(step==3) step++;
        else step = 0;
    if(e.keyCode == Keyboard.letter('A'))
        if(step==4) step++;
        else step = 0;
    if(e.keyCode == Keyboard.letter('D'))
        if(step==5) step++;
        else step = 0;
    if(e.keyCode == Keyboard.letter('E'))
        if(step==6) step++;
        else step = 0;
    if(e.keyCode == Keyboard.letter('Q')&&step!=7) step = 0;
    if(e.keyCode == Keyboard.letter('Q')&&step==7){
        remove(beak);
        remove(bird1);
        bird1.setColor(Color.GREEN);
        bird1.setRadius(10);
        add(bird1);
        makeBeak(bird1.getRadius()*1.5);
    }
}


//creates the spikes on screen
function createSpikes(){
    createSpikesBottom();
    createSpikesTop();
}    
//creates a row of 10 spikes on the top
function createSpikesTop(){
    var spikeLength = 0;
    for (var i = 0; i < 11; i++){
        var spike = new Polygon();
        //bottom
        spike.addPoint(spikeLength + length/2, 0 + 40);
        //left
        spike.addPoint(spikeLength + length, 0);
        //right
        spike.addPoint(spikeLength, 0);
        add(spike);
        spikeLength = spikeLength + length;
    }
}
//creates a row of 10 spikes on the bottom
function createSpikesBottom(){
    var spikeLength = 0;
    for (var i = 0; i < 11; i++){
        var spike = new Polygon();
        //top
        spike.addPoint(spikeLength - length/2, getHeight()- 40);
        //left
        spike.addPoint(spikeLength - length, getHeight());
        //right
        spike.addPoint(spikeLength, getHeight());
        add(spike);
        spikeLength = spikeLength + length;
    }
}
//makes new random spikes on the right side
function resetRight(spikes){
    for(var y=40; y<getHeight()-40; y++){
        var elem = getElementAt(getWidth()-5, y);
        if(elem!=null&&elem!=bird1){
            remove(elem);
        }
    }
    
    for (var i = 0; i < spikes; i++){
        var pos = Randomizer.nextInt(40, getHeight() - 40);
        putSpike(pos, getWidth(), -30);
    }
    
}
//makes new random spikes on the left side
function resetLeft(spikes){
    for(var y=40; y<getHeight()-40; y++){
        var elem = getElementAt(5, y);
        if(elem!=null&&elem!=bird1){
            remove(elem);
        }
    }    
    
    for (var i = 0; i < spikes; i++){
        var pos = Randomizer.nextInt(40, getHeight() - 40);
        putSpike(pos, 0, 30);
    }
    
}
// creates on spike based on posidtion, the side and the offset
function putSpike(pos, side, offset){
    var spike = new Polygon();
        //bottom
        spike.addPoint(side , pos -10);
        //top
        spike.addPoint(side , pos +10);
        //right
        spike.addPoint(side + offset , pos);
        add(spike);
}

//checks if the bird collides with the spikes
function checkCollide(){
    var left = bird1.getX() - bird1.getRadius();
    var right = bird1.getX() + bird1.getRadius();
	var top = bird1.getY() - bird1.getRadius();
	var bottom = bird1.getY() + bird1.getRadius();

    var centerTop = getElementAt(bird1.getX(), top-1); 
    var centerBottom = getElementAt(bird1.getX(), bottom+1);
    var centerRight = getElementAt(right + 11, bird1.getY());
    var centerLeft = getElementAt(left - 11, bird1.getY());
    var topRight = getElementAt(right, top);
    var topLeft = getElementAt(left, top);
    var bottomRight = getElementAt(right, bottom);
    var bottomLeft = getElementAt(left, bottom);
    
    if((topRight != null && topRight.getColor() != Color.GREY) 
    || (topLeft != null && topLeft.getColor() != Color.GREY) 
    || (bottomRight != null && bottomRight.getColor() != Color.GREY)
    || (bottomLeft != null && bottomLeft.getColor() != Color.GREY)
    || (centerTop != null && centerTop.getColor() != Color.GREY) 
    || (centerBottom != null && centerBottom.getColor() != Color.GREY)
    || (centerRight != null && centerRight.getColor() != Color.GREY)
    || (centerLeft != null && centerLeft.getColor() != Color.GREY)){
        dx1 = 0;
        if(!disableCollisions) dy1 = 10; //make the bird bounce if there is still collsion (used only on death)
        disableCollisions = true;
        if(bird1.getY()+birdRad>getHeight()){
            stopTimer(physics);
            dy1 = 0;
            setTimer(reset, 1000);
        }
    }

}

//pauses the game
function keyPause(){
        if(physicsStopped&&canPause){
            setTimer(physics, 10);
            physicsStopped = !physicsStopped;
        } else {
            stopTimer(physics);
            physicsStopped = !physicsStopped;
        }
}

//describes the rules of the game
function menu(){
    stopTimer(reset);
    remove(txtPoints);
    addPoints = 0;
    
    txt1 = new Text("Rules:", "30pt Arial");
    txt1.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt1.setPosition(cx, 50);
    add(txt1);
    txt2 = new Text("Press SPACE to start", "15pt Arial");
    txt2.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt2.setPosition(cx, 100);
    add(txt2);
    txt3 = new Text("Press SPACE to jump", "15pt Arial");
    txt3.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt3.setPosition(cx, 125);
    add(txt3);
    txt4 = new Text("Don't touch the spikes", "15pt Arial");
    txt4.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt4.setPosition(cx, 150);
    add(txt4);
    txt5 = new Text("Get a high score!", "15pt Arial");
    txt5.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt5.setPosition(cx, 175);
    add(txt5);
    txt6 = new Text("", "30pt Arial")
    txt6.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt6.setPosition(cx, cy);
    txt7 = new Text("You can pause the game by clicking...", "15pt Arial")
    txt7.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt7.setPosition(cx, 200);
    add(txt7);
    txt8 = new Text("...but why would you?", "15pt Arial")
    txt8.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt8.setPosition(cx, 225);
    add(txt8);
    txt9 = new Text("There *might* be a secret code...", "15pt Arial")
    txt9.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt9.setPosition(cx, 250);
    add(txt9);
    
    keyDownMethod(game);
}

//resets the game
function reset(){
    step=0;
    results();
    countdown--;
    txt6.setText(countdown);
    add(txt6);
    canPause = false;
    if(countdown==0){
        removeAll();
        dx1 = dxSpeed;
        disableCollisions = false;
        remove(txt6);
        menu();
        countdown=5+1;
    }
}

//results
function results(){
    if (addPoints == 1){
        putMeasage("Hey, have you tried typing...");
        putMeasageUnder("\"upgradeq?\"");
    }
    if (addPoints == 2){
        putMeasage("WOW only two");
    }
    if (addPoints > 2 && addPoints < 6){
        putMeasage("At least youre getting better...");
    }
    if (addPoints >= 6 && addPoints < 12){
        putMeasage("the aszure skies of my home");
        putMeasageUnder("are a distant memory");
    }
    if (addPoints >= 12 && addPoints   < 15){
        putMeasage("I have a family you know");
    }
    if (addPoints >= 15 && addPoints <= 19){
        putMeasage("Im so close");
    }
    if (addPoints >= 20){
        putMeasage("The bird got home a new one is imprisoned in its place");
    }
    if (addPoints >= 9999){
        putMeasage("Hi mr Chan");
    }
    
}

//displays a message (measage)
function putMeasage(measage){
    endMeasage = new Text(measage, "11pt Arial");
    endMeasage.setAnchor({horizontal:0.5, vertical:0.5});
    endMeasage.setPosition(cx, cy - 50);
    add(endMeasage);
}
function putMeasageUnder(measage){
    endMeasage = new Text(measage, "11pt Arial");
    endMeasage.setAnchor({horizontal:0.5, vertical:0.5});
    endMeasage.setPosition(cx, cy - 25);
    add(endMeasage);
}
//when the game starts, right after the menu
function game(e){
    if(e.keyCode == Keyboard.SPACE){
        remove(txt1);
        remove(txt2);
        remove(txt3);
        remove(txt4);
        remove(txt5);
        remove(txt7);
        remove(txt8);
        remove(txt9);

        canPause = true;
        points();        
        makeBird();
        makeBeak(bird1.getRadius()*1.5);
        makeEye(5);
        setTimer(physics, 10);
        keyDownMethod(keyJump);
        mouseClickMethod(keyPause);
        createSpikes();
    }
}

//shows the score
function points(){
    txtPoints = new Text("" + addPoints, "150pt Arial");
    txtPoints.setAnchor({horizontal: 0.5, vertical: 0.5});
    txtPoints.setPosition(cx, cy);
    txtPoints.setColor(Color.GREY);
    add(txtPoints);
}
function updatePoints(){
    txtPoints.setText(addPoints);
}

//start
function start(){
    menu();
}
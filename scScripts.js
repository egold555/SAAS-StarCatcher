// StarCatcher Scripts for the game made by Soft Dev 2015
    // when the web page window loads up, the game scripts will be read
function plzwork1() {

    var gameOn = false;
    var end = false;
    var inBonusLevel = false;
    var flip = false;

    var starCount;
    var starArray;
    var goodStars;
    var badStars;
    var speedMultiplier;
    var sv;
    var p1x;
    var p1y;
    var p2x;
    var p2y;
    var playerSpeed;
    var keysDown;

    //level display = level+1;
    level = 0; //0-5

    ////////////////////modify//////////////////////
    var debug = false;

    var gameTitle = "A Ripple In Time";
    var gameTitleDebug = gameTitle + " (Debug)";
    var maxLevels = 5; //0--6
    var levelArrayBGSpeed = [0.065, 0.1519333333333339, 0.2388666666666677, 0.3258000000000016, 0.4127333333333354, 0.49966666666666937, 0.49966666666666937];
    if(debug){
        //to make the level easyer when testing by making only one star
        var levelArrayGoodStars = [1, 1, 1, 1, 1, 1, 100];
        var levelArrayBadStars = [1, 1, 1, 1, 1, 1, 0];
    }else{
        var levelArrayGoodStars = [5, 10, 25, 35, 45, 55, 100];
        var levelArrayBadStars = [1, 2, 5, 7, 20, 25, 0];
    }
    
    var levelArrayMusic = ["1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3", "6.mp3", "Bonus.mp3"];
    var levelArrayPlayerSpeed = [5, 5, 5, 5, 5, 5, 7];
    var levelArrayStarSpeedMultiplier = [1, 2, 3, 4, 5, 6, 6];

    var startValueGood = 1; //plus
    var startValueBad = 2; //minus
    ////////////////////////////////////////////////

   //ships: 50x50
    //stars: 40x40
    document.getElementById("game").style.cursor = "none"; //no curser so the mouse doesnt distract the user durring gameplay
    resetBackground();
    function resetBackground(){
        bgspeed =  levelArrayBGSpeed[level]; //background speed
    }//end
   
    var star = { //make a star
        _x: null,
        _y: null,
        _xSpeed: null,
        _ySpeed: null,
        _width: 40,
        _height: 40,
        _bad: null,
        _visable: null,

        //Create new star object with given starting position and speed
        //class functions exist to set other private variables
        //All inputs are double and function returns a new star
        create: function (x, y, xSpeed, ySpeed, isBad) {
            var obj = Object.create(this);
            obj._x = x;
            obj._y = y;
            obj._xSpeed=xSpeed;
            obj._ySpeed=ySpeed;
            obj._bad=isBad;
            obj._visable=true;
            obj._img = new Image();
            if(isBad){
                obj._img.src=glichedStarImg();
            }
            else
            {
                obj._img.src="images/stars/star.png";
            }
            
            return obj;
        },

        setImage: function(img){
            this._img.src=img;
        },

        //Update the new x and y of the star based on the speed.
        //drawing functionality is left for calling class
        //no input or return
        update: function () {
            this._x+=this._xSpeed;
            this._y+=this._ySpeed;
        },

        setSize: function (width, height) {
            this._width=width;
            this._height=height;
        },


    };//close object

    var glichedStarImg = function(){
        //pick random glitched star image
        var num =  Math.floor(Math.random() * 8);
        var path = "images/stars/bad/" + num + ".png";
        //console.log(path);
        return path;
    }//close glitchedStarImg

    var coloredStarImage = function(){
         //pick random colored star image
        var num =  Math.floor(Math.random() * 6);
        var path = "images/stars/color/" + num + ".png";
        //console.log(path);
        return path;
    }//end

    //load canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d"),
    w = canvas.width = 800,
    h = canvas.height = 500;

    //load images
    var ship1 = new Image();
    ship1.src="images/ships/spaceship1.png"
    var ship2 = new Image();
    ship2.src="images/ships/spaceship2.png"

    //load sound & music
    var music;
    playMusic();
    function playMusic(){
        if(music){
            music.pause();
        }
        
        if(gameOn){
             music = new Audio("audio/music/" + levelArrayMusic[level]); // buffers automatically when created
        }else{
            music = new Audio("audio/music/TitleScreen.mp3"); // buffers automatically when created
            //console.log("I want my title screeen music now!");
        }
        
        music.volume=1.0;
        music.loop = true;
        music.play();
    }
     

    //sfx
    var blip;
    blip = new Audio("audio/sfx/tap.mp3"); // buffers automatically when created
    //blip.play();

    var putMoreStarsOnScreenForBonusLevelFrame = 0;
    function moreBonusStars(){
        //console.log("More stars");
        if(putMoreStarsOnScreenForBonusLevelFrame == 100){
            if(debug){console.log("I AM MAKING MORE STARS");};
            putMoreStarsOnScreenForBonusLevel();
            putMoreStarsOnScreenForBonusLevelFrame = 0;
        }
        putMoreStarsOnScreenForBonusLevelFrame++;
    }//end

    function putMoreStarsOnScreenForBonusLevel(){
        for(var i = 0; i<100; i++){
            starCount++;
            if(flip){
                flip = false;
                starArray.push(star.create(20, i+50*(Math.random()*10), Math.random()*speedMultiplier, Math.random()*speedMultiplier, false));
            }else{
                flip = true;
                starArray.push(star.create(780, i+50*(Math.random()*10), Math.random()*speedMultiplier, Math.random()*speedMultiplier, false));
            }
            
        }

        for (var i = 0; i < starCount; i++) {
            if(starArray[i]._visable){
                var randomStarImage = new Image();
                randomStarImage.src=coloredStarImage();
                starArray[i]._img = randomStarImage;

            }
        }
        
    }//end

    resetStars();
    function resetStars(){
        // our stars are created using a single array with a class of information
         starCount=levelArrayGoodStars[level] + levelArrayBadStars[level]; 
         starArray=[];
         goodStars = levelArrayGoodStars[level];
         badStars = levelArrayBadStars[level];
         speedMultiplier = levelArrayStarSpeedMultiplier[level];
        // Create an array of stars good stars
        
        for (var i = 0; i < goodStars; i++) {
            // this assigns each element in the array all the information for the star by 
            // using the 'star' class, pass the starting x,y locations 
            //  and speeds into the array.

            //makes the stars //x, y, xd, yd, isBad
            if(flip){
                flip = false;
                starArray.push(star.create(20, i+50*(Math.random()*10), Math.random()*speedMultiplier, Math.random()*speedMultiplier, false));
            }else{
                flip = true
                starArray.push(star.create(780, i+50*(Math.random()*10), Math.random()*speedMultiplier, Math.random()*speedMultiplier, false));
            }
            

        }//close for



        //bad staers
        for (var i = 0; i < badStars; i++) {
            // this assigns each element in the array all the information for the star by 
            // using the 'star' class, pass the starting x,y locations 
            //  and speeds into the array.

            //makes the stars //x, y, xd, yd, isBad
            if(flip){
                flip = false;
                starArray.push(star.create(20, i+50*(Math.random()*10), Math.random()*speedMultiplier, Math.random()*speedMultiplier, true));
            }else{
                flip = true
                starArray.push(star.create(780, i+50*(Math.random()*10), Math.random()*speedMultiplier, Math.random()*speedMultiplier, true));
            }
            

        }//close for
        
        //debug  good stars + bad stars
        if(debug) {console.log("Good Stars: " + goodStars + " Bad Stars: " + badStars);}     
        
        // Setup players start position
         p1x=w/2+100;
         p1y=h/2;
         p2x=w/2-100;
         p2y=h/2;
    }//end
    
    function getRandomColor() { //just idea i had, never used
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
     for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
        }//close for
        return color;
    }//close function


    //load up splash intro screen
    var splash = new Image();
    var frame = 1;
    function updateTitleScreen(){
        
        if(frame == 81){
            frame = 1;
        }
        //console.log(frame);
        splash.src="images/splash/" + frame + ".png";
        splash.onload = function() {ctx.drawImage(splash,0,0,w,h);}
        frame++;

        ctx.font = "50px Comic Sans MS";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";

        ctx.fillText(gameTitle, canvas.width/2, canvas.height/4); 
        ctx.fillText("By Eric Golde", canvas.width/2, canvas.height/4 + 100); 

        //this add the s to the end if there are more points then one
        var putSGood = "s";
        var putSBad = "s";
        if(startValueGood> 1){
            putSGood = "s";
        }else{
            putSGood = "";
        }

        if(startValueBad> 1){
            putSBad = "s";
        }else{
            putSBad = "";
        }

        ctx.font = "20px Comic Sans MS";
        ctx.fillText("Goal: Get the most points.", canvas.width/2, canvas.height/4 + 200); 
        ctx.fillText("Good Stars: +"+ startValueGood +" point" + putSGood, canvas.width/2, canvas.height/4 + 250);
        ctx.fillText("Bad Stars: -" + startValueBad +" point" + putSBad, canvas.width/2, canvas.height/4 + 300);

        ctx.fillStyle = "white";
        ctx.fillText("(Press space to start)", canvas.width/2, canvas.height/4 + 350); 

        ctx.fillStyle = "Chartreuse";
        ctx.fillText("P2 Controls: WASD", canvas.width/10 + 20, canvas.height/4 + 370); 
        ctx.fillText("P1 Controls: ↑←↓→", canvas.width-100, canvas.height/4 + 370); 
    }//end
    
    
    function drawSquareBoundingBox(x1, y1, x2, y2){ //draw bounding box
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff0000'; 
        ctx.strokeRect(x1,y1,x2,y2);
    }//end

    function drawCircleBoundingBox(x1, y1, x2, y2){
        ctx.beginPath();
        ctx.ellipse(x1+x2/2, y1+y2/2, x2/2, y2/2, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff00'; 
        ctx.stroke();
    }//end

    resetLevelArray();
    function resetLevelArray(){
         sv = levelArrayGoodStars[level];
    }//end

    function starsUpdate() {
        // to move the stars around
        
       //draws all the stars and makes them bouce off of the walls
        for (var i = 0; i < starCount; i++) {
            if(starArray[i]._visable){
                starArray[i].update();
                ctx.drawImage(starArray[i]._img, starArray[i]._x-starArray[i]._width/2, starArray[i]._y-starArray[i]._height/2,  starArray[i]._width,  starArray[i]._height);

                //stars bouncing off walls
                if (starArray[i]._x>w-20 || starArray[i]._x<20) {
                    starArray[i]._xSpeed = -starArray[i]._xSpeed;

                }
                if (starArray[i]._y>h-20) {
                    starArray[i]._ySpeed = -starArray[i]._ySpeed;
                    starArray[i]._y = h-25;
                }

                if(starArray[i]._y<20){
                    starArray[i]._ySpeed = -starArray[i]._ySpeed;
                    starArray[i]._y = 25;
                }

                //draw bounding box
                if(debug){
                    //p1
                    //drawSquareBoundingBox(p1x-25, p1y-25, 50, 50);
                    drawCircleBoundingBox(p1x-25, p1y-25, 50, 50);
                    //p2
                    //drawSquareBoundingBox(p2x-25, p2y-25, 50, 50);
                    drawCircleBoundingBox(p2x-25, p2y-25, 50, 50);
                    //stars
                    //drawSquareBoundingBox(starArray[i]._x-20, starArray[i]._y-20, starArray[i]._width, starArray[i]._height);

                    drawCircleBoundingBox(starArray[i]._x-20, starArray[i]._y-20, starArray[i]._width, starArray[i]._height);
                }//close if
                

                //COLLISION FOR PLAYER #1
                if (Math.sqrt(Math.pow(p1x-starArray[i]._x,2) + Math.pow(p1y-starArray[i]._y,2))<50) {
                    
                    if(starArray[i]._bad && starArray[i]._visable){
                        //bad star collision
                        addScore(1, true);
                    }
                    else{
                        //it is just a normal star collision
                        addScore(1, false);
                        sv--;
                    }
                    starArray[i]._visable=false;
                    blip.play();
                }//close if

                //COLLISION FOR PLAYER #2
                if (Math.sqrt(Math.pow(p2x-starArray[i]._x,2) + Math.pow(p2y-starArray[i]._y,2))<50) {
                    if(starArray[i]._bad && starArray[i]._visable){
                        //bad star collision
                        addScore(2, true);
                        if(starArray[i]._bad == false && starArray[i]._visable){
                            sv--;
                            
                        }
                    }
                    else{
                        //it is just a normal star collision
                        addScore(2, false);
                        if(starArray[i]._bad == false && starArray[i]._visable){
                            sv--;
                            
                        }
                    }
                    starArray[i]._visable=false;
                    blip.play();
                }//close if

            }//close if
            
        }//endFor  
        //set the side bar for visuals on diplaying score
        if(inBonusLevel){
            $("#starsTotal").text("∞");
        }else{
            $("#starsTotal").text(levelArrayGoodStars[level]);
        }
        
        $("#starsCollected").text(levelArrayGoodStars[level]-sv);
       //$("#starsTotal").text(levelArrayGoodStars[level]);
        if(sv == 0 && !inBonusLevel){
            //next level
            sv = 0;
            
            nextLevel();
        }//end if
    }//close function

    $("#levelCounter").text(1); //set default level too one
    function nextLevel(){
        gameOn = 0;
        if(level >= maxLevels && !inBonusLevel){
            //alert("You have reached the end of the levels.");
            if(debug){console.log("End of levels");}
            endGame(); 
        }else{
            level++;
            sv = levelArrayGoodStars[level];
            $("#levelCounter").text(level+1);
            if(!inBonusLevel){
                 //alert("Press 'OK' to begine the next level: " + (level+1));
                 tts("Starting level " + (level+1));
             }else{
                music.volume = 0.2;
                tts("I see you did not follow my directions. Guess you earned a bonus level! Its impossible to win lol. Have fun!");

             }
           
            if(debug){console.log("Level: " + level);}
            resetGame();
            gameOn = 1;
            playMusic();
        }
    }//end

    function resetGame(){
        resetLevelArray();
        resetBackground();
        resetStars();
        resetPlayerSpeed();
        resetKeyDown();
        
        if(debug){console.log("Finish reset");}
    }

    resetPlayerSpeed();
    function resetPlayerSpeed(){
     playerSpeed = levelArrayPlayerSpeed[level];
    }
    function playerUpdate(){
        //player two hodling down a key using the array keysDown
        if (87 in keysDown) {// P2 holding down the w key
            if(65 in keysDown || 68 in keysDown){
                p2y -= playerSpeed / 1.4;
            }else{
                p2y -= playerSpeed;
            }
        }
        if (83 in keysDown) { // P2 holding down (key: s)
            if(65 in keysDown || 68 in keysDown){
                p2y += playerSpeed / 1.4;
            }else{
                p2y += playerSpeed;
            }
        }
        if (65 in keysDown) { // P2 holding down (key: a)
            if(87 in keysDown || 83 in keysDown){
                p2x -= playerSpeed / 1.4;
            }else{
                p2x -= playerSpeed;
            }
        }
        if (68 in keysDown) { // P2 holding down (key: d)
            if(87 in keysDown || 83 in keysDown){
                p2x += playerSpeed / 1.4;
            }else{
                p2x += playerSpeed;
            }
        }

        // player one hodling key down
        if (37 in keysDown) { // P1 holding down (key: left arrow)
            if(38 in keysDown || 40 in keysDown){
                p1x -= playerSpeed / 1.4;
            }else{
                p1x -= playerSpeed;
            }  
        }
        if (38 in keysDown) { // P1 holding down (key: up arrow)
            if(37 in keysDown || 39 in keysDown){
                p1y -= playerSpeed / 1.4;
            }else{
                p1y -= playerSpeed;
            } 
        }
        if (39 in keysDown) { // P1 holding down (key: right arrow)
            if(38 in keysDown || 40 in keysDown){
                p1x += playerSpeed / 1.4;
            }else{
                p1x += playerSpeed;
            }  
        }
        if (40 in keysDown) { // P1 holding down (key: down arrow)
            if(37 in keysDown || 39 in keysDown){
                p1y += playerSpeed / 1.4;
            }else{
                p1y += playerSpeed;
            } 
        }

        //draw the ships
        ctx.drawImage(ship1, p1x-25, p1y-25, 50, 50);

        ctx.drawImage(ship1, p1x+w-25, p1y-25, 50, 50);
        ctx.drawImage(ship1, p1x-w-25, p1y-25, 50, 50);
        ctx.drawImage(ship1, p1x-25, p1y+h-25, 50, 50);
        ctx.drawImage(ship1, p1x-25, p1y-h-25, 50, 50);


        ctx.drawImage(ship2, p2x-25, p2y-25, 50, 50);

        ctx.drawImage(ship2, p2x+w-25, p2y-25, 50, 50);
        ctx.drawImage(ship2, p2x-w-25, p2y-25, 50, 50);
        ctx.drawImage(ship2, p2x-25, p2y+h-25, 50, 50);
        ctx.drawImage(ship2, p2x-25, p2y-h-25, 50, 50);

        //screen wrap for player 1
        if(p1x > w){p1x = p1x=0;}
        if(p1x < 0){p1x = p1x=w;}

        if(p1y > h-0){p1y = p1y=0;}
        if(p1y < 0){p1y = p1y=h;}

        //screen wrap for player 2
        if(p2x > w){p2x = p2x=0;}
        if(p2x < 0){p2x = p2x=w;}

        if(p2y > h){p2y = p2y=0;}
        if(p2y < 0){p2y = p2y=h;}
    }//close function

    resetKeyDown();
    function resetKeyDown(){
        // a new array is made to keep track of a button being held down
     keysDown = [];
    }

    var finishedSpeaking = 0;
    function speakWon(won){
        if(!finishedSpeaking){
            if(won == 1){
                tts("Congratulations player 1. You won with a score of " + p1Score + " points.");
            }else if(won == 2){
                tts("Congratulations player 2. You won with a score of " + p2Score + " points.");
            }
            else{
                tts("Congratulations to the both of you. You tied with a score of " + p1Score + " points.");
            }
            tts("Push refresh to play again. Also, what ever you do, do not press the space bar.");
        }
        finishedSpeaking = 1;
    }

    function tts(text){
        responsiveVoice.speak(text, "UK English Female", {volume: 1});
    }
    

    function endGame(){
        end = true;
        gameOn = 1;
        //start clearing everything
        starCount=0; 
        starArray=[];
        goodStars = 0
        badStars = 0;
        ctx.clearRect(0,0,w,h);
        //cfinish clearing everything
        gameOn = 0;

        
        ctx.clearRect(0,0,w,h);
        music.volume=0.5;
    }//end

    function drawEndingText(){ //draw the title screen

        ctx.font = "50px Comic Sans MS";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";

        if(p1Score > p2Score){
            //player 1 won
            ctx.fillText("Player 1 Won!", canvas.width/2, canvas.height/4);
            speakWon(1);
        }else if(p2Score > p1Score){
            //player 2 won
            ctx.fillText("Player 2 Won!", canvas.width/2, canvas.height/4);
            speakWon(2);
        }else{
            //tie
            ctx.fillText("Tie Game!", canvas.width/2, canvas.height/4);
            speakWon(3);
        }
        ctx.font = "20px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.fillText("Scores:", canvas.width/2, canvas.height/4 + 100); 
        ctx.fillText("Player 1: " + p1Score, canvas.width/2, canvas.height/4 + 150); 
        ctx.fillText("Player 2: " + p2Score, canvas.width/2, canvas.height/4 + 200); 

        ctx.fillText("(Refresh page to play again)", canvas.width/2, canvas.height/4 + 300); 

    }

    // if the key is held down, the keycode is placed in array
    // then it is deleted upon keyup command.  
    // playerUpdate will now control player movements and use the keysDown array

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;

       

        // pause botton P BUTTON
        if (e.keyCode == 80 && gameOn==true) { // (key: p to pause the game)  //TODO: Make a pause button that actully works 
            //if(debug){console.log("Paused...");}
            //gameOn = 0;
        }//end if

    }, false); //close event

    //  player 2 movement keyboard commands
    addEventListener("keyup", function (e) {
       

         // start the game with keyboard command
        if (e.keyCode == 32 && gameOn==false) {

            if(end){
                //bonus level!
                if(debug){console.log("Bonus Level Time");}
                inBonusLevel = 1;
                nextLevel();

            }

            gameOn = 1;
             
            //main();// (key: space bar to start game)
           
        }//end if

        //take keycode out of array (not being held down anymore)
        delete keysDown[e.keyCode];
    }, false); //close event

    //player scores
    var p1Score = 0;
    var p2Score = 0;

    //add scores to the player
    function addScore(player, bad){
        if(player == 1){

            if(bad){
                p1Score-=startValueBad;
            }else{
                p1Score+=startValueGood;
            }

            $("#p1ScoreDisp").text(p1Score);

        }else{

            if(bad){
                p2Score-=startValueBad;
            }else{
                p2Score+=startValueGood;
            }

            $("#p2ScoreDisp").text(p2Score);

        }
    }//end 

    var lastCalledTime;
    var fps;
    var fpsRounded; 

    function getFPS() {
        fpsRounded = Math.round(fps);
      $("#fpsCounter").text(fpsRounded);
      if(!lastCalledTime) {
         lastCalledTime = Date.now();
         fps = 0;
         return;
      }
      delta = (Date.now() - lastCalledTime)/1000;
      lastCalledTime = Date.now();
      fps = 1/delta;
    } //end

    var called = 0;
    function callOnce(){
        //this will be called once on page refresh or open to get everything in order
        if(called == 0){
            plzwork2();
            playMusic();
        }
        called = 1;
    }//end

    //Our main function which clears the screens 
    //  and redraws it all again through function updates,
    //  then calls itself out again
    console.log("Game loaded!");
    $("#title").text(gameTitle);
    if(debug){
        //tts("Warning! Debugging is enabled. Gameplay might not function correctly!");
        console.log("Debugging Enabled!");
        //$("#title").text(gameTitleDebug);
        $("#title").text(gameTitleDebug);
    }
    console.log("Started Main.");
    main();
    function main(){
        if(gameOn==1){
            ctx.clearRect(0,0,w,h);
            starsUpdate();
            playerUpdate();
            callOnce();
            if(inBonusLevel){moreBonusStars();} // more stars on bonus level
        }else{
            if(end == false){
                updateTitleScreen();
            }else{
                //drawEndingScreen (Once)
                drawEndingText();
            }
            
        }
        getFPS();
        requestAnimationFrame(main);
    }//close main

}   //close window on load              
/* 
 * Coder: Angela Pang
 * 
 * Assignment: CIS4500 Week 3 - Shooting (Plant Invasion)
 * Date: 2015/01/14
 * Modified: 2015/02/02
 * 
 * Filename: gameTimer.js
 * 
 * Description:
 * This files contains the function that keeps track of the gameplay time.
 * 
 */

var gameTimer;
var startClock;
var countPauseTime = 0; //Temporarily count the time paused
var pauseTime = 0; //Records how long the game has been paused for
var endGameFlag = true; //Game isn't running is true
var pauseGame = false;  //Pause the game
var numGamePlay = 0;
var milSec = 1000;

var degrees = 0;

var endingSet = 0;

function menuScreen() {
   backgroundImg.introScreen();
}

/*Start the game when the start button is clicked*/
function startTimer() { 
   var oneSec = 10;
   
   clearInterval(gameTimer);   
   startClock = new Date().getTime();   
   endGameFlag = false;
   pauseGame = false;
   backgroundImg.gameRef.winner = "";
   
   /*Set and Add Background Music*/
   changeBgdMusic("mp3/NPC_Ffion.mp3", 0.0);
   
   gameTimer = setInterval(function(){updateGame();}, oneSec);  
}


/*Update the game every few milseconds*/
function updateGame() {
    var i;  //Loop counter
    var curColour, curWidth;
    
    /*Determine if the game has been paused*/
    if (pauseGame == true) {
      if (countPauseTime == 0) {
         countPauseTime = new Date().getTime();
      }
      
      backgroundImg.hideButton("pauseButton");
      backgroundImg.showButton("resumeButton");
      return 0;
    }
    else {
      if (countPauseTime != 0) {
         var totalPauseTime = Math.round((new Date().getTime() - countPauseTime) / milSec);
         pauseTime += totalPauseTime;
      }
      countPauseTime = 0;
    }
    
    /*Calculate time lapse*/
    var timeElapse = Math.round((new Date().getTime() - startClock) / milSec) - pauseTime;
    if (timeElapse < 0) {
      timeElapse = 0;
    }

    /*Clear the canvas*/
    backgroundImg.clearCanvas();
    
    /*Draw the background*/
    backgroundImg.redraw(backgroundImg.xPos, backgroundImg.yPos);
    
    /*Draw the grid*/
    
    /*Redraw Character path*/    
    
    /*Redraw Enemy path*/
        
    /*Draw the character*/
    //character.redraw(character.xPos, character.yPos);
    
    /*Update Enemy position*/
    //moveEnemies();
     
    /*Draw the Die*/
    
    /*Draw any cards*/
        
    /*Show traps*/
    
    /*Check if the image intersects with anything on the canvas*/
    
    /*Draw buttons*/
    if (pauseGame == false) {
      backgroundImg.showButton("pauseButton");
      backgroundImg.hideButton("resumeButton");
    }
        
    /*Gameplay information style*/
    backgroundImg.canvasCtx.fillStyle = "Blue";
    backgroundImg.canvasCtx.font = "bold 16px Arial";
       
    /*Determine if the game over flag as been set*/
    if (endGameFlag == true) { 
        clearInterval(gameTimer);
                
        /*Disable all enemies*/
        for (i = 0; i< enemy.length; i++) {                        
            enemy[i].dx = 0;
            enemy[i].dy = 0;
        }
        
        /*Clear all paths*/
        pathCCount = 0;
        pathC = [];
        pathECount = 0;
        pathE = [];
        lastKey = 37;
        
        /*Reveal Enemy Location*/
        moveEnemies();
    
        /*Stop the character from moving*/
        character.dx = 0;
        character.dy = 0;
        
        /*Display apporpriate message of whom is the winner*/
        if (backgroundImg.gameRef.winner == "player") {
         backgroundImg.setGameOverMsg("You caught the assassin!", 40, 150, "bold 35px Arial", "blue");
        }
        else if (backgroundImg.gameRef.winner == "enemy") {
         backgroundImg.setGameOverMsg("Sorry the assassin got away...", 25, 150, "bold 32px Arial", "red");
        }
        
        /*Displayed Elapse time*/     
        backgroundImg.canvasCtx.fillText("Elapse Time: " + timeElapse + "s", backgroundImg.canvas.width / 2 - 60, 225);

         /*Set up the option for user to start a new game*/
         screenDisplayed = "gameOver";
         backgroundImg.gameOverScreen();
   }
   else {
      /*Draw gameplay information*/
       backgroundImg.canvasCtx.fillText("Elapse Time: " + timeElapse + "s", backgroundImg.canvas.width / 2 - 50, 16);
   }
}

/*Update the enemy position on the screen by pixels*/
function moveEnemies() {
    var i;  //Loop Counter
    var found;    
    
    /*Modify every alien image*/
    for (i = 0; i< enemy.length; i++) {               
      if (backgroundImg.gameRef.winner == "player") {
         enemy[i].image = gameImage.loadedImg["enemy3"];
         character.image = gameImage.loadedImg["character2"];
      }
      else if (backgroundImg.gameRef.winner == "enemy") {
         enemy[i].image = gameImage.loadedImg["enemy2"];
         character.image = gameImage.loadedImg["character3"];         
      }
      //character.redraw(enemy[i].xPos + enemy[i].width, enemy[i].yPos);
      character.redraw(220, 150);
      enemy[i].redraw(enemy[i].xPos , enemy[i].yPos );   
    }
}

function moveAliens(speed) {
    var i;  //Loop counter
    
    /*Modify every alien image*/
    for (i = 0; i< aliens.length; i++) {            
        aliens[i].canvasCtx.globalAlpha = alienVisibility;    
        aliens[i].redraw(aliens[i].xPos - speed, aliens[i].yPos);
        
        /*Determine if the alien is off screen*/
        if ((aliens[i].xPos + aliens[i].width) < 0) {
            newAlien(aliens[i]);
        }        
        
        /*Modify the alien's visibility*/
        if (visible == true) {
            alienVisibility -= 0.001;
        }
        else if (visible == false) { 
            alienVisibility += 0.001;
        }
        
        if (alienVisibility >= 1.0) {
            alienVisibility = 1.0;
            visible = true;
        }
        else if (alienVisibility <= 0.0) {
            alienVisibility = 0.0;
            visible = false;
        }
        aliens[i].canvasCtx.globalAlpha = 1;  
    }
}

function addTime() {
    var countDownTime = 60;
    var sec30 = 30 * milSec; 
    
    /*Add 30 seconds of game play*/
    startClock += sec30;
    
    /*Calculate time lapse*/
    var timeRemaining = Math.round(countDownTime - (new Date().getTime() - startClock) / milSec);
    
    if (timeRemaining > 60) {
        startClock = new Date().getTime(); 
    }
}

/*Fill area*/
function fillArea() {
    backgroundImg.grid[1] = "blue";
}

/*Convert Second to millisecond*/
function convertSecToMilSec(sec) {
    var milSec = 1000;
    
    return sec * milSec;
}

/*Convert millisecond to second*/
function convertMilSecToSec(milSec) {
    var sec = 1000;
    
    return milSec / sec;
}

/*Draw object paths*/
function redrawPaths() {
    var i = 0, numPaths;
    
    numPaths = path.length;
    for (i = 0; i < numPaths; i++) {
        path[i].drawLine();
    }
}

/*Draw Character path*/
function redrawPaths(character, path, curColour, curWidth) {
    var i = 0, numPaths;
    var pX1, pY1, pX2, pY2; //points
    
    numPaths = path.length; //Get the number of paths
    
    if (numPaths > 0) {
       /*Draw all previous paths*/
       for (i = 0; i < numPaths - 1; i++) {
           pX1 = path[i].x;
           pY1 = path[i].y;
           
           pX2 = path[i+1].x;
           pY2 = path[i+1].y;
           
           backgroundImg.strokeStyle = path[i+1].rbg;   //Update the line background
           backgroundImg.lineWidth = path[i+1].width;
           backgroundImg.drawLine(pX1, pY1, pX2, pY2);
       }
       
       /*Draw the current path getting built*/
       pX1 = path[numPaths - 1].x;
       pY1 = path[numPaths - 1].y;

       pX2 = centPathX(character.xPos);
       pY2 = centPathY(character.yPos);
       
       backgroundImg.strokeStyle = curColour; //Update the line background
       backgroundImg.lineWidth = curWidth;
       backgroundImg.drawLine(pX1, pY1, pX2, pY2);
       
       /*Revert the colour back to the original colour*/
       backgroundImg.strokeStyle = "black";
    }
}

/*Clear the canvas of items*/
function clearBoard() {
    var i = 0;
    
    /*Remove all Enemies*/
    for (i = 0; i < enemy.length; i++) {
        enemy.pop();
    }
    
    /*Remove all projectiles*/
    for (i = 0; i < projectile.length; i++) {
        projectile.pop();
    }    
}

/*Determine the current player's turn*/
function turnBase() {
   var game = backgroundImg.gameRef;
   
   /*Determine game action*/
   if (game.action == "waitRoll") {   
      /*Determine who's turn it is*/
      if (game.turn == "character" && game.move == 0) {// && game.preTurn != "character") {  //Player's turn do nothing if the dice hasn't been rolled
         return game.turn;
      }
      else if (game.turn == "wolf" && game.move == 0) {  //Opponent's turn - roll the dice for them
         /*Roll the dice*/
         backgroundImg.gameRef.move = genNumRange(1, 6);
         
         /*Show Roll dice animation*/
         game.action = "rollDie";
      }  
   }

   /*Show rolling die animation*/
   if (game.action == "rollDie") {
      /*Show animation*/
      dice.animateTimer = setInterval("dice.animateImg(\"die\");", 10);  
      dice.redraw(dice.xPos, dice.yPos);
      
      /*Stop animation after 1 seconds*/
      window.setTimeout(function() {
         /*Stop the dice animation*/
         dice.clearAnimateTimer();
         
         /*Show the dice number rolled*/
         dice.image = gameImage.loadedImg["die"+game.move]; //"die"+game.move;
         
         /*Set the flag for next game step*/
         game.action = "pauseDie";
         console.log("Done - roll animation");
      }, 1000);
      
      game.action = "rolling";
      return game.turn;
   }
   else if (game.action == "rolling") {
      /*Show animation*/      
      dice.redraw(dice.xPos, dice.yPos);
   }
   else if (game.action == "pauseDie") {     
      /*Stop animation after 1 seconds*/
      window.setTimeout(function() {
         /*Start moving the game piece*/
         game.action = "move";
      }, 1000);
   }
   
   /*Update character piece*/
   if (game.action == "move") {
      if (game.turn == "character" && game.move > 0) {
         moveCurChar(character);
      }
      else if (game.turn == "wolf" && game.move > 0) {
         moveCurChar(enemy[0]);
      }
   }
   
   /*Reveal card*/
   if (game.action == "showCard") {      
      card.redraw(card.xPos, card.yPos);
      
      /*Start the animation*/      
      card.animateTimer = setInterval("card.animateImg(\"card\");", 10); 
      
      /*Stop animation after 1 second*/
      window.setTimeout(function() {
            /*Stop the card spinning animation*/
            card.clearAnimateTimer();
            
            /*Determine which choice is made*/
            genStory();
            
            /*Show text*/
            game.action = "waitDecision";
            
         }, 1000);
      
      /*If it's the wolf's turn then wait 3 seconds before making a choice*/
      if (game.turn == "wolf") {
         /*Wolf make a choice after 3 seconds*/
         window.setTimeout(function() {               
               /*Determine which choice is made*/
               //wolfSelectChoice();
            }, 3000);
            
         /*Highlight Wolf's choice 2 seconds after selection (5 seconds)*/
         window.setTimeout(function() {               
               /*Revert button colours back to default black*/
               backgroundImg.button["yesButton"].defaultClr = "black";
               backgroundImg.button["noButton"].defaultClr = "black";
               
               /*Show text*/
               game.action = "end";
            }, 5000);
      }
      
      game.action = "cardSpinning";
      console.log("cardSpinning");
   }
   else if (game.action == "waitDecision") {
      /*Show animation*/      
      card.redraw(card.xPos, card.yPos);
      
      /*Show buttons*/
      backgroundImg.showButton("yesButton");
      backgroundImg.showButton("noButton");
   }   
   
   /*Reveal Trap*/
   if (game.action == "showTrap") {     
      /*Generate the trap information*/
      game.move = genNumRange(1, 3);
      
      /*Show Trap information*/     
      trap.image = gameImage.loadedImg["trap"+game.move];
      trap.redraw(trap.xPos, trap.yPos);
      
      /*Stop animation after 2 second*/
      window.setTimeout(function() {
            /*Show text*/
            game.action = "moveBack";
            
         }, 2000);
         
      game.action = "pauseTrap";
      console.log("showing trap");
   }
   else if (game.action == "moveBack") {
      if (game.turn == "character" && game.move > 0) {
         moveCurCharBack(character);
      }
      else if (game.turn == "wolf" && game.move > 0) {
         moveCurCharBack(enemy[0]);
      }
   }   
   
   /*Determine if character is on a special square*/
   if (game.action == "end" && game.move == 0) {
      backgroundImg.nextPlayerTurn();  //Update whom the next player is going to be
      game.action = "waitRoll";
   }   
}

/*Changes the music to something else*/
function changeBgdMusic(music, volume) {
   backgroundMusic.volume = 0.0;
   backgroundMusic.pause();
   backgroundMusic = new Audio(music); 
   backgroundMusic.play(); 
   backgroundMusic.volume = volume;
   backgroundMusic.loop = 1; //Set the music looping to be true
}

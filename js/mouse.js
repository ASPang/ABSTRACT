/* 
 * Coder: Angela Pang
 * 
 * Assignment: CIS4500 Week 4 - Element Race
 * Date: 2015/02/08
 * Modified: 2015/02/14
 * 
 * Filename: mouse.js
 * 
 * Description:
 * This files contains the function for the mouse.
 * 
 */

/*Mouse Listeners*/
//window.addEventListener("mousemove", on_mousemove, false);   //Modify text when mouse is hovered over
//window.addEventListener("click", mouseClick, false);

function mouseClick(e) {
   var button;
   
   button = mouseLoc(e);
   console.log("buttoncomeback = " + button);
   /*Determine the action for the appropriate button*/
   if (button == "startButton" || button == "newGame") { //Start game button
      if (button == "newGame") {  //Reset up the canvas for a new game
         setupCanvas();
      }
      
      /*Stop the music*/
      backgroundMusic.volume = 0;
      backgroundMusic.pause();
      
      /*Update the game screen flag*/
      screenDisplayed = "gameScreen";
      
      /*Start the game*/
      startTimer();
   }
   else if (button == "pauseButton" && screenDisplayed == "gameScreen") {
      pauseGame = true;
   }
   else if (button == "resumeButton" && screenDisplayed == "gameScreen") {
      pauseGame = false;
   }
   else if (button == "yesButton" && screenDisplayed == "gameScreen") {
      if (backgroundImg.gameRef.turn == "character") {
         storyChar += 1;
      }
      backgroundImg.gameRef.action = "end";
      console.log("clicked - yes");
   }
   else if (button == "noButton" && screenDisplayed == "gameScreen") {
      if (backgroundImg.gameRef.turn == "character") {
         storyChar += 0;
      }
      backgroundImg.gameRef.action = "end";
      console.log("clicked - no");
   }
}
 
/*Determine the current location of the mouse*/
function mouseLoc(e) {
   var x, y;   //Mouse coordinates
   var bX, bY, bHeight, bWidth;  //button variables
   var numButton, i, buttonName, selected = "null"; //Button loop
   
   /*Get the mouse coordinate*/
   x = e.layerX;
   y = e.layerY;
   
   /*Update values to be relative to the canvas*/
   x -= backgroundImg.canvas.offsetLeft;
   y -= backgroundImg.canvas.offsetTop;
  
  //console.log(backgroundImg.buttonName.length + backgroundImg.buttonName[backgroundImg.buttonName.length - 1]);
  /*Determine a button is selected*/
  numButton = backgroundImg.buttonName.length;
  
   for (i = 0; i < numButton; i++) {  
     buttonName = backgroundImg.button[backgroundImg.buttonName[i]]; //backgroundImg.buttonName[i];
     bX = buttonName.x;
     bY = buttonName.y;
     bWidth = buttonName.width;
     bHeight = buttonName.height;
     //console.log("total number of buttons = " + numButton);
     //console.log(x + " " + y + " " + bX + " " + bY);  //TESTING!!!!!!!!!!!
     /*Determine if the button is selected*/
     if(x >= bX  && x <= (bX + bWidth) && y <= bY && y >= (bY-bHeight)){
         //document.body.style.cursor = "pointer";
         
         if (screenDisplayed == "intro") {
            backgroundImg.canvasCtx.fillStyle = "blue";
            backgroundImg.showStartButton(); 
            console.log("HERE " + backgroundImg.buttonName[i]);
            selected = backgroundImg.buttonName[i];
            break;
         }
         else if (screenDisplayed == "gameOver") {
            //backgroundImg.canvasCtx.fillStyle = "blue";
            backgroundImg.showHoverButton("newGame"); 
            selected = backgroundImg.buttonName[i];
            break;
         }
         else if (screenDisplayed == "gameScreen" && backgroundImg.buttonName[i] != "startButton" && backgroundImg.buttonName[i] != "newGame") {
            console.log(backgroundImg.buttonName[i]);
            backgroundImg.showHoverButton(backgroundImg.buttonName[i]); 
            selected = backgroundImg.buttonName[i];
         }
     }
     else{
         backgroundImg.canvasCtx.fillStyle = "black";
         //backgroundImg.showStartButton(); 
         if (screenDisplayed == "intro") {
            backgroundImg.introScreen();
         }
         else if (screenDisplayed == "gameOver") {
            backgroundImg.gameOverScreen();
         }
     }
  }
  /*Reset canvas font to default*/
   backgroundImg.canvasCtx.font = backgroundImg.fontDefault;
   
   /*Return the button that was hovered over*/
   return selected;
}

/*Determine if the player's mouse is near the enemy*/
function mouseNearEnemy(e) {
   var i, a;  //Loop Counter
   var found;    
   var mx, my; //mouse coordinate
   var ex, ey; //Enemy coordinate
   var eWidth, eHeight; //Enemy size
   var spaceBuffer = [100,150,200,250];   //Pixel away from the enemy
   
   /*Determine if the game is running*/
   if (endGameFlag == true || pauseGame == true) { 
      return 0;
   }
   
   /*Get the mouse current location*/
   mx = e.layerX;
   my = e.layerY;
   
   backgroundMusic.volume = 0;
   
   /*Go through all the enemies to determine how near the player is to the mouse*/
   for (i = 0; i < enemy.length; i++) { 
      ex = enemy[i].xPos;
      ey = enemy[i].yPos;
      eWidth = enemy[i].width + ex;
      eHeight = enemy[i].height + ey;
      
      /*Determine if the mouse is right over the enemy*/
      if ((mx >= ex && mx <= eWidth) && (my >= ey && my <= eHeight)) {
         console.log("FOUND ENEMY");
         backgroundMusic.volume = 1.0;
         break;
      }
   
      /*Determine if the mouse is near the enemy*/
      for (a = 0; a < spaceBuffer.length; a++) {
         ex = enemy[i].xPos;
         ey = enemy[i].yPos;
         
         eWidth = enemy[i].width + ex + spaceBuffer[a];
         eHeight = enemy[i].height + ey + spaceBuffer[a];;
         
         ex = enemy[i].xPos - spaceBuffer[a];
         ey = enemy[i].yPos - spaceBuffer[a];
         
         //console.log("finding  enemy " + eWidth + " " + eHeight);
         console.log(a + " " + spaceBuffer[a]);
         /*modify the music volume based on distance*/
         if ((mx >= ex && mx <= eWidth) && (my >= ey && my <= eHeight)) {
            console.log("Near Enemy with buffer = " + spaceBuffer[a] + " " + a + " " +spaceBuffer.length );
            if (a == 0) {
               backgroundMusic.volume = 0.5;
            }
            else {
               backgroundMusic.volume = 0.5 - (a/10);  
            }
            break;
         }
      }
      
      console.log(mx + "," + my + " .... " + ex + "," + ey + "...." + eWidth + "," + eHeight);   
   }
}


/*Determine if the enemy has been found*/
function foundEnemy(e) {
   var i;  //Loop Counter
   var found;    
   var mx, my; //mouse coordinate
   var ex, ey; //Enemy coordinate
   var eWidth, eHeight; //Enemy size
   
   /*Determine if the game is running*/
   if (endGameFlag == true || pauseGame == true) { 
      return 0;     
   }
   
   /*Get the mouse current location*/
   mx = e.layerX;
   my = e.layerY;
   
   /*Go through all the enemies to determine how near the player is to the mouse*/
   for (i = 0; i < enemy.length; i++) { 
      ex = enemy[i].xPos;
      ey = enemy[i].yPos;
      eWidth = enemy[i].width + ex;
      eHeight = enemy[i].height + ey;
      
      /*Determine if the mouse is right over the enemy*/
      if ((mx >= ex && mx <= eWidth) && (my >= ey && my <= eHeight)) {
         console.log("FOUND ENEMY");
         endGameFlag = true;
         backgroundMusic.pause();
         backgroundMusic = new Audio("mp3/NPC_Tin.mp3"); 
         backgroundMusic.play(); 
         backgroundMusic.volume = 1.0;
         break;
      }
   }
}
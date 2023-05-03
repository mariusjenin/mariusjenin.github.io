var arene = [];
var casex;
var tB= 10;
var tV = 5;
var tpB = 10;
var persoT = [];
var dep1 = 8.32;
var dep2 = 707.38;
var bomb = [];
var animations = [];
// var songBomb;
//
// function preload() {
//   songBomb = loadSound('bomb.mp3');
// }

function setup(){
  createCanvas(751,751);
  for(let i = 0; i < 15; i++){
     for(let j = 0; j < 15; j++){
       casex = new Case(750/15 * i, 750/15 * j,tV,tB,tpB);
       arene.push(casex);
     }
  }
      persoT.push(new Perso(dep1,dep1,30,1));
      persoT.push(new Perso(dep2,dep1,30,2));
      persoT.push(new Perso(dep2,dep2,30,3));
      persoT.push(new Perso(dep1,dep2,30,4));

}

function draw(){
  background(200);
  direction();

  for(let i = 0; i < 225; i++){
    arene[i].show();
  }
  for(let i = 0; i < persoT.length; i++){
    persoT[i].show();
    persoT[i].update(arene);
  }

  for(let i = bomb.length-1; i >= 0; i--){
       bomb[i].show();
       bomb[i].timer++;
       if(bomb[i].timer > 50){
         for(let j = 0; j < 4; j++){
           if(bomb[i].hits(persoT[j])){
               persoT[j].dir(0,0);
           }
         }
       }
       if(bomb[i].timer == 160){
          //songBomb.play();
          explose(bomb[i]);
          bomb.splice(i,1);
       }
  }

  for(let i = animations.length - 1; i >= 0; i--){
     if(animations[i].duree < 20){
        animations[i].show();
        animations[i].duree += 1;
     } else {
       animations.splice(i,1);
     }

  }

  for(let i = 0; i < 225; i++){
    for(let j = 0; j < 4; j++){
      if(i == trouverCase(persoT[j].x + 15,persoT[j].y + 15)){
            if(arene[i].bonus == 1){
               persoT[j].acc += 1;
               arene[i].bonus = 0;
            }
            if(arene[i].bonus == 2){
               persoT[j].nbBomb += 1;
               arene[i].bonus = 0;
            }
            if(arene[i].bonus == 3){
               persoT[j].pBomb += 2;
               arene[i].bonus = 0;
            }
      }
    }
  }
}

function explose(bombe) {
    var aVerif = bombe.pBomb;
    var posBomb = trouverCase(bombe.x,bombe.y);

    for(let j = 0; j < 4 ; j++){
      if(posBomb == trouverCase(persoT[j].x+15,persoT[j].y+15)){
           persoT[j].vivant = false;
      }
    }
    for(let j = 1; j < bomb.length; j++){
      if(posBomb == trouverCase((bomb[j].x),(bomb[j].y))){
        bomb[j].timer = 159;
      }
    }
    persoT[bombe.owner - 1].nbBomb += 1;

    //Gauche
    for(let i = 0; i<aVerif; i++){
      if(posBomb - 15 *(i+1) >= 0){

       var posProchaine = posBomb-15*(i+1);

       if(arene[posProchaine].mur == 1){
           arene[posProchaine].mur = 0;
           break;
       }
       if(arene[posProchaine].mur == 2){
           break;
       }

       animations.push(new Animation(bombe.x - 11 - 50 * (i+1), bombe.y - 11, 50, 22,bombe.x, bombe.y));

       for(let j = 0; j < 4; j++){
          if(posProchaine == trouverCase((persoT[j].x +15),(persoT[j].y +15))){
            persoT[j].vivant = false;
          }
       }
       for(let j = 1; j < bomb.length; j++){
         if(posProchaine == trouverCase((bomb[j].x),(bomb[j].y))){
           bomb[j].timer = 159;
         }
       }
     }
    }

    //Droite
    for(let i = 0; i<aVerif; i++){
      if(posBomb + 15 *(i+1) < 225){

       var posProchaine = posBomb + 15 *(i+1);

       if(arene[posProchaine].mur == 1){
           arene[posProchaine].mur = 0;
           break;
         }
         if(arene[posProchaine].mur == 2){
             break;
           }

        animations.push(new Animation(bombe.x + 11 + 50 * (i), bombe.y - 11, 50, 22, bombe.x, bombe.y));

         for(let j = 0; j < 4; j++){
            if(posProchaine == trouverCase((persoT[j].x +15),(persoT[j].y +15))){
              persoT[j].vivant = false;
            }
         }
         for(let j = 1; j < bomb.length; j++){
           if(posProchaine == trouverCase((bomb[j].x),(bomb[j].y))){
             bomb[j].timer = 159;
           }
         }

       }
    }

    //Haut
    for(let i = 0; i<aVerif; i++){
      if(arene[posBomb].y -50*(i+1) > -20){

        var posProchaine = posBomb-(i+1);

       if(arene[posProchaine].mur == 1){
           arene[posProchaine].mur = 0;
           break;
       }
       if(arene[posProchaine].mur == 2){
           break;
       }

       animations.push(new Animation(bombe.x - 11, bombe.y - 11 - 50 * (i+1), 22, 50,bombe.x, bombe.y));

       for(let j = 0; j < 4; j++){
          if(posProchaine == trouverCase((persoT[j].x +15),(persoT[j].y +15))){
            persoT[j].vivant = false;
          }
       }
       for(let j = 1; j < bomb.length; j++){
         if(posProchaine == trouverCase((bomb[j].x),(bomb[j].y))){
           bomb[j].timer = 159;
         }
       }
     }
    }

    //Bas
    for(let i = 0; i<aVerif; i++){
      if(arene[posBomb].y +50*(i+1) < 750){

        var posProchaine = posBomb+(i+1);

       if(arene[posProchaine].mur == 1){
           arene[posProchaine].mur = 0;
           break;
       }
       if(arene[posProchaine].mur == 2){
           break;
       }

       animations.push(new Animation(bombe.x - 11, bombe.y + 11 + 50 * (i), 22, 50,bombe.x, bombe.y));

       for(let j = 0; j < 4; j++){
          if(posProchaine == trouverCase((persoT[j].x +15),(persoT[j].y +15))){
            persoT[j].vivant = false;
          }
       }
       for(let j = 1; j < bomb.length; j++){
         if(posProchaine == trouverCase((bomb[j].x),(bomb[j].y))){
           bomb[j].timer = 159;
         }
       }
     }
    }
}

function mousePressed(){
   console.log(trouverCase(arene,mouseX,mouseY));
}

function direction() {
  var depX = 0;
  var depY = 0;
  if (keyIsDown(UP_ARROW)){
    depY--;
  }
  if (keyIsDown(DOWN_ARROW)) {
    depY++;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    depX++;
  }
  if(keyIsDown(LEFT_ARROW)) {
    depX--;
  }
  persoT[1].dir(depX,depY);

  depX = 0;
  depY = 0;
  if (keyIsDown(90)){
    depY--;
  }
  if (keyIsDown(83)) {
    depY++;
  }
  if(keyIsDown(68)) {
    depX++;
  }
  if(keyIsDown(81)) {
    depX--;
  }
  persoT[0].dir(depX,depY);

  depX = 0;
  depY = 0;
  if (keyIsDown(101)){
    depY--;
  }
  if (keyIsDown(98)) {
    depY++;
  }
  if(keyIsDown(99)) {
    depX++;
  }
  if(keyIsDown(97)) {
    depX--;
  }
  persoT[3].dir(depX,depY);

  depX = 0;
  depY = 0;
  if (keyIsDown(73)){
    depY--;
  }
  if (keyIsDown(75)) {
    depY++;
  }
  if(keyIsDown(76)) {
    depX++;
  }
  if(keyIsDown(74)) {
    depX--;
  }
  persoT[2].dir(depX,depY);
}

//85  73  gauche bas droite 74 75 76
//13    101  97 98 99
function keyPressed() {
  if(keyCode == 46){
     if(persoT[1].nbBomb != 0 && persoT[1].vivant){
      bomb.push(new Bombe(persoT[1]));
      persoT[1].nbBomb -= 1;
    }
  }
  if(keyCode == 65){
     if(persoT[0].nbBomb != 0 && persoT[0].vivant){
      bomb.push(new Bombe(persoT[0]));
      persoT[0].nbBomb -= 1;
    }
  }
  if(keyCode == 85){
     if(persoT[2].nbBomb != 0 && persoT[2].vivant){
      bomb.push(new Bombe(persoT[2]));
      persoT[2].nbBomb -= 1;
    }
  }
  if(keyCode == 13){
     if(persoT[3].nbBomb != 0 && persoT[3].vivant){
      bomb.push(new Bombe(persoT[3]));
      persoT[3].nbBomb -= 1;
    }
  }
}


function trouverCase(x,y){
     for(var i = 0; i < arene.length; i++){
       if(arene[i].x < x && arene[i].x + 50 > x &&
          arene[i].y < y && arene[i].y + 50 > y){
            return i;
          }
        }
}

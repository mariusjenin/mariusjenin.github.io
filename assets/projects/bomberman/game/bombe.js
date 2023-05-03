class Bombe {

  constructor(perso) {
       this.x = perso.x+15;
       this.y = perso.y+15;
       this.pBomb = perso.pBomb;
       this.owner = perso.id;
       this.timer = 0;
  }

  show() {
    push();
    stroke(0);
    strokeWeight(5);
    fill(255,0,0);
    ellipseMode(CENTER);
    ellipse(this.x,this.y,22,22);
    pop();
  }

  hits(player) {
       if(player.vx < 0){
         if(this.mur != 0){
           var infy = 11;
           if(player.y - this.y < 0){
              infy = 31;
           }
           if((player.x - this.x) < 11 && (player.x - this.x) > 0  &&  Math.abs(player.y - this.y) < infy){
                 player.x+= player.acc;
                 return true;
         }
       }
     }

            if(player.vx > 0){
              if(this.mur != 0){
                var infy = 22;
                if(player.y - this.y < 0){
                   infy = 31;
                }
                if((player.x - this.x > -42) && player.x - this.x < 0 &&
                (Math.abs(player.y - this.y) < infy )){
                   player.x -= player.acc;
                   return true;
              }
            }
          }

          if(player.vy > 0){
            if(this.mur != 0){
              var infx = 22;
              if(player.x - this.x < 0){
                 infx = 31;
              }
              if((player.y - this.y > -42) && player.y - this.y < 0 &&
              (Math.abs(player.x - this.x) < infx )){
                 player.y -= player.acc;
                 return true;
            }
          }
        }

        if(player.vy < 0){
          if(this.mur != 0){
            var infx = 11;
            if(player.x - this.x < 0){
               infx = 31;
            }
            if((player.y - this.y) < 12 && (player.y - this.y) > 0  &&  Math.abs(player.x - this.x) < infx){
                  player.y+= player.acc;
                  return true;
          }
        }
      }

}
}

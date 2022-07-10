class Case {

  constructor(x,y,tV,tB,tpB) {
    this.x = x;
    this.y = y;
    this.bonus = 0;
    // 0 : libre, 1 : cassable, 2 : gros mur
    var px = this.x/50;
    var py = this.y/50;
    if((x == 0 && py == 0)||
    (px == 0 && py == 1)||
    (px == 0 && py == 13)||
    (px == 0 && py == 14)||
    (px == 1 && py == 0)||
    (px == 1 && py == 14)||
    (px == 13 && py == 0)||
    (px == 13 && py == 14)||
    (px == 14 && py == 0)||
    (px == 14 && py == 1)||
    (px == 14 && py == 13)||
    (px == 14 && py == 14)){
        this.mur = 0;
    } else {
        this.mur = 1;
        this.casse = false;
        for(let i = 1; i <= 14; i+=2){
          for(let j = 1; j <= 14; j+=2){
            if( px==i && py==j){
            this.mur = 2;
            this.casse = true;
            }
          }
        }
    }



    //bonus = 1 : bonus Vitesse
    //bonus = 2 : bonus Nbre Bombe
    //bonus = 3 : bonus Puissance Bombe     164
      var randTV=floor(random(163/tV));
      var randTB=floor(random(163/tB));
      var randTpB=floor(random(163/tpB));
    if(this.mur == 1){
      if(randTV==0){
        this.bonus=1;
      } else {
        if(randTB==0){
          this.bonus=2;
        } else {
          if(randTpB==0){
          this.bonus=3;
          }
        }
      }
    }
}

    show() {
      ellipseMode(CORNER);
      if(this.mur == 0){
       fill(253, 241, 184);
       rect(this.x,this.y,50,50,4);

       push();
       strokeWeight(3);
       stroke(230);
       if(this.bonus != 0){
         if(this.bonus == 1){
           fill(121, 248, 248);
           ellipse(this.x + 14,this.y+ 14,22,22);
         } else if (this.bonus == 2){
           fill(58, 2, 13);
           ellipse(this.x+ 14,this.y+ 14,22,22);
         } else if(this.bonus == 3){
           fill(255, 127, 0);
           ellipse(this.x+ 14,this.y+ 14,22,22);
         }
       }
       pop();
     }
     else {
       if(this.mur == 1){
       fill(150);
       rect(this.x,this.y,50,50,4)
     } else {
       fill(50);
       rect(this.x,this.y,50,50,4);
     }
     }
    }

    hit(player) {
         if(player.vx < 0){
           if(this.mur != 0){
             var infy = 51;
             if(player.y - this.y < 0){
                infy = 31;
             }
             if((player.x - this.x) < 51 && (player.x - this.x) > 0  &&  Math.abs(player.y - this.y) < infy){
                   return true;
           }
         }
       }

              if(player.vx > 0){
                if(this.mur != 0){
                  var infy = 51;
                  if(player.y - this.y < 0){
                     infy = 31;
                  }
                  if((player.x - this.x > -31) && player.x - this.x < 0 &&
                  (Math.abs(player.y - this.y) < infy )){
                     return true;
                }
              }
            }

            if(player.vy > 0){
              if(this.mur != 0){
                var infx = 51;
                if(player.x - this.x < 0){
                   infx = 31;
                }
                if((player.y - this.y > -31) && player.y - this.y < 0 &&
                (Math.abs(player.x - this.x) < infx )){
                   return true;
              }
            }
          }

          if(player.vy < 0){
            if(this.mur != 0){
              var infx = 51;
              if(player.x - this.x < 0){
                 infx = 31;
              }
              if((player.y - this.y) < 51 && (player.y - this.y) > 0  &&  Math.abs(player.x - this.x) < infx){
                    return true;
            }
          }
        }
        return false;
  }

}

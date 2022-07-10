class Perso {
  constructor(x,y,w,id){
    this.x = x;
    this.y = y;
    this.w = w;
    this.nbBomb = 1;
    this.pBomb = 2;
    this.vx = 0;
    this.vy = 0;
    this.acc = 3;
    this.id = id;
    this.vivant = true;
  }

  show(){
    push();
    strokeWeight(2);
    if(this.vivant){
        if(this.id==1){

           fill(0,0,255);
           rect(this.x,this.y,this.w,this.w,5);

        } else if (this.id ==2){

            fill(255,0,0);
            rect(this.x,this.y,this.w,this.w,5);

        } else if (this.id == 3){

            fill(0,255,0);
            rect(this.x,this.y,this.w,this.w,5);

        } else if (this.id == 4){

            fill(255,255,0);
            rect(this.x,this.y,this.w,this.w,5);
        }
      } else {
        noStroke();
        textSize(25);
        if(this.id==1){

           fill(137,137,137);
           rect(this.x,this.y,this.w-5,this.w + 5 ,5);
           fill(0,0,240);
           text("B", this.x + 4, this.y + 26);

        } else if (this.id ==2){

            fill(187, 174, 152);
            rect(this.x,this.y,this.w-5,this.w + 5 ,5);
            fill(240,0,0);
            text("R", this.x + 3, this.y + 26);

        } else if (this.id == 3){

            textSize(24);
            fill(137,137,137);
            rect(this.x,this.y,this.w-5,this.w + 5 ,5);
            fill(0,240,0);
            text("V", this.x + 4, this.y + 26);

        } else if (this.id == 4){

            textSize(25);
            fill(137,137,137);
            rect(this.x,this.y,this.w-5,this.w + 5 ,5);
            fill(240,240,0);
            text("J", this.x + 6, this.y + 26);
        }
      }
      pop();
    }

  update(arene){
    if(this.vivant){
        var mx = this.vx * this.acc;
        var my = this.vy * this.acc;
        if((this.x + mx < width - this.w -1) && this.x + mx > 0 && this.y + my > 0 && (this.y + my < height - this.w - 1)){
          this.x += mx;
          this.y += my;
          for(let i = 0; i < arene.length;i++){
            if(arene[i].hit(this)){
              this.x -= mx;
              this.y -= my;
            }
          }

        }
    }
  }

  dir(x,y){

      this.vx = x;
      this.vy = y;

}
}

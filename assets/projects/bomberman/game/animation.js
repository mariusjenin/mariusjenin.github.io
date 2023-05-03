class Animation {

   constructor(x,y,w1,w2,xB,yB){
      this.duree = 0;
      this.x = x;
      this.y = y;
      this.w1 = w1;
      this.w2 = w2;
      this.bombX = xB;
      this.bombY = yB;

   }

   show(){
       push();
       fill(255, 127, 0);
       stroke(255, 127, 0);
       rect(this.bombX - 11, this.bombY - 11, 21,21,1);
       noStroke();
       if(this.w1 > this.w2){
         fill(255,0,0);
         rect(this.x, this.y, this.w1, this.w2);
         fill(255, 127, 0);
         rect(this.x, this.y + 5, this.w1, this.w2-10)
       } else {
         fill(255,0,0);
         rect(this.x, this.y, this.w1, this.w2);
         fill(255, 127, 0);
         rect(this.x+5, this.y, this.w1-10, this.w2)
       }
       pop();
   }
}

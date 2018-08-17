class PerlinForces {
  int draw;
  int width;
  int height;
  int tileSize;
  float[] off;
  float noiseScale;
  float noiseScaleZ=0.01;

  PerlinForces(int width, int height, int tileSize) {
    this.draw = 2;
    this.noiseScale = 0.01;
    this.setParameters(width, height, tileSize);   
    noiseDetail(4);

    this.off = new float[3];
    for (int i=0; i<off.length; i++) {
      this.off[i] = 0;
    }
    this.tileSize = 20;
  }

  void setDraw() {
    this.draw++;
    if (this.draw>3) this.draw = 1;
  }

  void setParameters(int width, int height, int tileSize) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
  }

  void draw() {
    if (this.draw == 1) {
      loadPixels();
      off[1] = 0;
      for (int row = 0; row<this.height; row++) {
        off[0] = 0;
        for (int column = 0; column<this.width; column++) {
          int index = (column + (row * this.width));
          int noiseValue = floor(noise(off[0], off[1], off[2]) * 255);
          color clr = color(noiseValue, noiseValue, noiseValue);
          pixels[index + 0] = clr;
          off[0] += this.noiseScale;
        }
        off[1] += this.noiseScale;
      }
      updatePixels();
      off[2]+=this.noiseScaleZ;
    } else if (this.draw == 2 || this.draw==3) {
      int rows = this.height / this.tileSize;
      int cols = this.width / this.tileSize;
      off[1] = 0;

        for (int y=0; y<rows; y++) {
        off[0] = 0;
      for (int x=0; x<cols; x++) {
          pushMatrix();
          translate(x*tileSize + tileSize/2, y*tileSize + tileSize/2);
          stroke(0);

          int noiseValue = floor(noise(off[0]*tileSize, off[1]*tileSize, off[2]) * 255);
          color clr = color(noiseValue, noiseValue, noiseValue);
          fill(clr);
          if(this.draw==2){
          rect(0, 0, tileSize, tileSize);}
          //translate(tileSize/2, tileSize/2);
          rectMode(CENTER);
          noStroke();
          fill(color(noiseValue,noiseValue,0,130));
          float angle = map(noiseValue, 0, 255, 0, 2*PI);
          rotate(angle);
          if(this.draw==3){
          rect(0,0,4,this.tileSize*2/3);}
          
          popMatrix();
          off[0] += this.noiseScale;
        }
        off[1] += this.noiseScale;
      }
      off[2]+=this.noiseScaleZ;
    }
  }
}
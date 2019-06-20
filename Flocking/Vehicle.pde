class Vehicle {
  PVector pos;
  PVector acc;
  PVector vel;
  float startingAccMag = 3;
  float maxSteeringSpeed = 1.4;
  float maxVelocity = 5;
  color vehicleColor;

  int displaySize = 30;

  Vehicle() {
    float value = random(100, 255);
    vehicleColor = color(value, value, value, 120);
    this.pos = new PVector(random(0, windowSizeX), random(0, windowSizeY));
    this.acc = PVector.random2D().setMag(startingAccMag);
    this.vel = new PVector();
  }

  void applyForce(PVector force) {
    this.acc = this.acc.add(force);
  }

  void update() {
    this.vel = this.vel.add(this.acc);
    this.vel.limit(maxVelocity);
    
    float vv = this.vel.heading();
    float value = sin(vv);
    if(value<0) value *= -1;
    value = map(value, 0, 1, 100, 255);
    float r = random(value);
    float g = random(value);
    float b = random(value);
    vehicleColor = color(255, 255, 255, 100);

    this.pos = this.pos.add(this.vel);
    this.acc = this.acc.setMag(0);

    wrapAround();
  }

  void wrapAround() {
    if (pos.x<0) {
      pos.x=windowSizeX;
    } else if (pos.x>windowSizeX) {
      pos.x=0;
    }
    if (pos.y<0) {
      pos.y=windowSizeY;
    } else if (pos.y>windowSizeY) {
      pos.y=0;
    }
  }

  PVector seek(PVector target) {
    PVector trgt = target.copy();
    return trgt.sub(pos).normalize().mult(this.maxSteeringSpeed).add(this.vel);
  }

  PVector avoid(PVector target) {
    return seek(target).mult(-1);
  }

  void draw() {
    drawVehicle();
    //drawCircle(awarenessRadius, color(0, 255, 0, 50));
    //drawCircle(repulsionRadius, color(255, 0, 0, 50));
  }

  void drawCircle(int radius, color clr) {
    pushMatrix();
    translate(pos.x, pos.y);
    noFill();
    stroke(clr);
    ellipse(0, 0, radius, radius);
    popMatrix();
  }

  void drawVehicle() {
    pushMatrix();
    translate(pos.x, pos.y);
    fill(vehicleColor);
    noStroke();
    //float ds = random(displaySize-20, displaySize+50);
    float ds = displaySize;
    ellipse(0, 0, ds, ds);
    popMatrix();
  }
}
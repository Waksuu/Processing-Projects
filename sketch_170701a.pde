Vehicle vehicle;
boolean repel;

void setup() {
  size(800, 600);
  background(77);
  vehicle = new Vehicle();
  this.repel = false;
}

void draw() {
  background(77);

  vehicle.applyForce(new PVector(0, 0.05));
  vehicle.applyForce(mouseForce(vehicle));
  vehicle.update();
  vehicle.draw();
}

void mouseClicked() {
  this.repel = !this.repel;
}

PVector mouseForce(Vehicle v) {
  PVector pos = v.pos;

  float dst = dist(pos.x, pos.y, mouseX, mouseY);
  if (dst>5) {
    float forceX = 0;
    float forceY = 0;
    if (!repel) {
      forceX = map(pos.x-mouseX, -500, 500, 10, -10);
      forceY = map(pos.y-mouseY, -500, 500, 10, -10);
      drawMouseForce(color(0, 200, 0));
    } else if (repel) {
      forceX = map(pos.x-mouseX, -500, 100, -10, 10);
      forceY = map(pos.y-mouseY, -500, 500, -10, 10);
      drawMouseForce(color(200, 0, 0));
    }

    return new PVector(forceX, forceY).mult(0.5);
  }
  drawMouseForce(color(200, 200, 200));
  return new PVector(0, 0);
}

void drawMouseForce(color clr) {
  pushMatrix();
  noFill();
  stroke(clr);
  ellipse(mouseX, mouseY, 500, 500);
  popMatrix();
}

float sigmoid(float value){
  float e = Double.valueOf(Math.E).floatValue();
  float exp = Double.valueOf(Math.pow(e, value)).floatValue();
  
  return 1/(1+exp);
}

class Vehicle {
  PVector pos;
  PVector acc;
  PVector vel;

  Vehicle() {
    pos = new PVector(width/2, 0);
    acc = new PVector();
    vel = new PVector();
  }

  //void setPositionToCenter() {
  //  pos = new PVector(800/2, 600/2);
  //  if (this.vel !=null) {
  //    this.vel = this.vel.mult(0);
  //  }
  //}

  void wrapAround() {
    if (pos.x < 0) {
      pos.x=800;
    } else if (pos.x > 800) { 
      pos.x=0;
    } else if (pos.y < 0) { 
      pos.y = 600;
    } else if (pos.y > 600) {
      pos.y = 0;
    }
  }

  void applyForce(PVector force) {
    this.acc = this.acc.add(force);
  }

  void update() {
    this.vel = this.vel.add(this.acc);
    
    this.vel.limit(5);
    
    this.pos = this.pos.add(this.vel);

    this.acc = this.acc.mult(0);

    wrapAround();
  }

  void draw() {
    pushMatrix();
    ellipseMode(CENTER);
    translate(pos.x, pos.y);
    fill(255);
    noStroke();
    ellipse(0, 0, 16, 16);
    stroke(color(0, 255, 0));
    line(0, 0, vel.x*10, vel.y*10);
    popMatrix();
  }
}
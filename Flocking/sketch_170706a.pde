Population pop;
int windowSizeX = 1400;
int windowSizeY = 900;
int populationSize = 100;

float avoidForceMult = 0.3;
float seekForceMult = 0.8;
float seekMouseForceMult = 10;
int awarenessRadius = 300;
int repulsionRadius = 150;

boolean followMouse = false;

void setup() {
  size(1, 1);
  surface.setResizable(true);
  surface.setSize(windowSizeX, windowSizeY);

  pop = new Population();
  fillBackground();
}

void fillBackground() {
  background(10);
}

void fillBackground2() {
  pushMatrix();
  noStroke();
  fill(color(10, 10, 10, 2));
  rect(0, 0, windowSizeX, windowSizeY);
  popMatrix();
}

void mousePressed() {
  followMouse = !followMouse;
}

void draw() {
  fillBackground();

  pop.applyRandomForce();
  pop.avoidOthers();
  pop.seekOthers();
  if (followMouse) {
    pop.seekMouse();
  }
  pop.update();
  pop.draw();
}
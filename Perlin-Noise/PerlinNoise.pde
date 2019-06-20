int width=800;
int height=600;
int backgroundColor = 70;

int tileSize = 20;

PerlinForces forces;

void setup() {
  size(1, 1); 
  surface.setSize(width, height);
  background(backgroundColor);

  this.forces = new PerlinForces(width, height, tileSize);
}

void draw() {
  background(backgroundColor);
  this.forces.draw();
}

void mouseClicked() {
  this.forces.setDraw();
}
class Population {
  ArrayList<Vehicle> vehicles;

  Population() {
    vehicles = new ArrayList();

    for (int i=0; i<populationSize; i++) {
      vehicles.add(new Vehicle());
    }
  }

  void update() {
    for ( Vehicle v : vehicles) {
      v.update();
    }
  }

  void draw() {
    for ( Vehicle v : vehicles) {
      v.draw();
    }
  }

  void applyRandomForce() {
    for ( Vehicle v : vehicles) {
      v.applyForce(PVector.random2D().setMag(0.3));
    }
  }

  void seekMouse() {
    for ( Vehicle v : vehicles) {
      PVector seekForce = v.seek(new PVector(mouseX, mouseY));
      seekForce.setMag(seekMouseForceMult);
      v.applyForce(seekForce);
    }
  }

  void avoidOthers() {
    for ( Vehicle v : vehicles) {
      for ( Vehicle o : vehicles) {
        if (v.equals(o)) {
          continue;
        }

        if (dist(v.pos.x, v.pos.y, o.pos.x, o.pos.y)<repulsionRadius) {
          PVector avoidForce = v.avoid(o.pos);
          avoidForce.setMag(avoidForceMult);
          v.applyForce(avoidForce);
        }
      }
    }
  }

  void seekOthers() {
    for ( Vehicle v : vehicles) {
      for ( Vehicle o : vehicles) {
        if (v.equals(o)) {
          continue;
        }

        if (dist(v.pos.x, v.pos.y, o.pos.x, o.pos.y)<awarenessRadius) {
          PVector seekForce = v.seek(o.pos);
          seekForce.setMag(seekForceMult);
          v.applyForce(seekForce);
        }
      }
    }
  }
}
var POPULATION;
var LIFESPAN = 100;
var POPSIZE = 100;
var CURRENT_TICK = 0;
var LIFE_P;
var MAX_FITNESS_P;
var MAX_FITNESS = 0;
var AVG_FITNESS = 0;
var AVG_FITNESS_P = 0;
var TARGET;
var ELITE;
var GENERATION = 0;
var GENERATION_P = 0;

function setup() {
    createCanvas(400, 450);
    POPULATION = new Population();
    LIFE_P = createP()
    MAX_FITNESS_P = createP()
    AVG_FITNESS_P = createP()
    GENERATION_P = createP()
    TARGET = new createVector(width / 2, height / 4)
}

function draw() {
    LIFE_P.html("Tick: " + CURRENT_TICK)
    MAX_FITNESS_P.html("Max fitness: " + MAX_FITNESS)
    AVG_FITNESS_P.html("Average fitness: " + AVG_FITNESS)
    GENERATION_P.html("Generation: " + GENERATION)

    POPULATION.update()

    if (!mouseIsPressed) {
        background(51);
        POPULATION.show()
        noFill()
        stroke(255, 0, 0);
        ellipse(TARGET.x, TARGET.y, 16, 16)
        fill(100, 100, 100, 120)
        stroke(255, 255, 255);
    }

    CURRENT_TICK++;

    if (POPULATION.allRocetsAreFinished()) {
        CURRENT_TICK = 0;
        POPULATION.evaluate()
        POPULATION.selection();
        GENERATION++;
    }
}

function mousePressed() {
    console.log(TARGET.x, TARGET.y, mouseX, mouseY)
    console.log(dist(TARGET.x, TARGET.y, mouseX, mouseY))
}

class Population {
    matingpool = [];
    rockets = [];

    constructor() {
        for (var i = 0; i < POPSIZE; i++) {
            this.rockets[i] = new Rocket();
        }
    }

    update() {
        for (var i = 0; i < POPSIZE; i++) {
            this.rockets[i].update();
        }
    };

    show() {
        for (var i = 0; i < POPSIZE; i++) {
            this.rockets[i].show();
        }
    };

    evaluate() {
        for (var currentRocket = 0; currentRocket < POPSIZE; currentRocket++) {
            this.rockets[currentRocket].calculateFitness();

            // Reduce elite rocket
            if (this.rockets[currentRocket].fitness > MAX_FITNESS) {
                MAX_FITNESS = this.rockets[currentRocket].fitness;
                ELITE = this.rockets[currentRocket];
            }

            AVG_FITNESS += this.rockets[currentRocket].fitness;
        }

        AVG_FITNESS /= POPSIZE;

        // Normalize fitness
        for (var currentRocket = 0; currentRocket < POPSIZE; currentRocket++) {
            this.rockets[currentRocket].fitness /= MAX_FITNESS;
        }

        this.matingpool = [];
        for (var currentRocket = 0; currentRocket < POPSIZE; currentRocket++) {
            var thisRocketFitness = floor(this.rockets[currentRocket].fitness * 100);
            // Add as many rockets to mating pool as their normalized fitness score
            for (var j = 0; j < thisRocketFitness; j++) {
                this.matingpool.push(this.rockets[currentRocket]);
            }
        }

        this.validateMatingPool()
    };

    selection() {
        this.validateMatingPool()

        var newRockets = [];

        for (var i = 0; i < POPSIZE; i++) {
            var parentA = random(this.matingpool);
            var parentB = random(this.matingpool);
            var childDna = parentA.crossover(parentB);
            newRockets[i] = new Rocket(childDna);
        }

        newRockets[0] = new Rocket(ELITE.dna);
        newRockets[0].elite = true;

        newRockets[1] = new Rocket();
        this.rockets = newRockets;
    };

    validateMatingPool() {
        if (this.matingpool.length === 0) {
            console.error("Rebooting population!");
            POPULATION = new Population();
            return;
        }
    }

    allRocetsAreFinished() {
        for (var i = 0; i < this.rockets.length; i++) {
            if (!this.rockets[i].isFinished()) {
                return false;
            }
        }
        return true;
    }
}

class DNA {
    constructor(genes) {
        if (genes) {
            this.genes = genes;
        }
        else {
            this.genes = [];
            for (var i = 0; i < LIFESPAN; i++) {
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(0.5);
            }
        }
    }

    crossover(firstParent, secondParent) {
        var newgenes = [];
        var mid = floor(random(this.genes.length));
        for (var i = 0; i < LIFESPAN; i++) {
            newgenes[i] = (i > mid) ? firstParent.dna.genes[i] : secondParent.dna.genes[i];
        }
        newgenes = this.mutate(newgenes);
        return new DNA(newgenes);
    };

    mutate(oldGenes) {
        var newgenes = [];
        for (var i = 0; i < oldGenes.length; i++) {
            newgenes[i] = (random(1) < 0.01) ? p5.Vector.random2D() : oldGenes[i];
        }
        return newgenes;
    };
}


class Rocket {
    constructor(dna) {
        this.pos = createVector(width / 2, height - 4);
        this.vel = createVector();
        this.acc = createVector();
        this.dna = (dna) ? dna : new DNA();
        this.fitness = 0;
        this.arrivedAt = LIFESPAN;
        this.crashed = false;
        this.arrivedAtTarget = false;
        this.crashedAtBarrier = false;
        this.elite = false;
    }

    calculateFitness() {
        var distanceToTarget = dist(this.pos.x, this.pos.y, TARGET.x, TARGET.y);
        this.fitness = floor((1 / (1 + distanceToTarget)) * 100)
        if (this.crashed || this.crashedAtBarrier) {
            this.fitness = 10;
        } else {
            this.fitness *= 10;
        }
        if (this.arrivedAtTarget) {
            this.fitness *= 10;
            this.fitness *= (LIFESPAN / this.arrivedAt) * LIFESPAN
        }
        return this.fitness;
    };

    applyForce(force) {
        this.acc.add(force);
    };

    update() {
        if (this.crashed === true || this.arrivedAtTarget === true) {
            return;
        }
        this.applyForce(this.dna.genes[CURRENT_TICK]);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        var d = dist(this.pos.x, this.pos.y, TARGET.x, TARGET.y);
        if (d < 6 && !this.arrivedAtTarget) {
            this.arrivedAtTarget = true;
            this.arrivedAt = CURRENT_TICK;
            this.pos.x = TARGET.x;
            this.pos.y = TARGET.y;
        }
        if (this.pos.x < 0 || this.pos.x > width) {
            this.crashed = true;
            return;
        }
        if (this.pos.y < 0) {
            this.crashed = true;
            return;
        }
        if (this.pos.y > height) {
            this.crashedAtBarrier = true;
            this.crashed = true;
            return;
        }
    };

    isFinished() {
        return this.crashedAtBarrier || this.arrivedAtTarget || this.crashed;
    }
    
    crossover(partner) {
        return this.dna.crossover(this, partner)
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        noStroke();
        if (this.elite === true) {
            fill(255, 0, 0, 100);
        } else {
            fill(255, 255, 255, 100);
        }
        rectMode(CENTER);
        rect(0, 0, 20, 5);
        pop();
    };
}

var POPULATION;
var LIFESPAN = 300;
var POPSIZE = 800;
var CURRENT_TICK = 0;
var LIFE_P;
var MAX_FITNESS_P;
var MAX_FITNESS = 0;
var AVG_FITNESS = 0;
var AVG_FITNESS_P = 0;
var TARGET;
var ELITE;

function setup() {
    createCanvas(400, 450);
    POPULATION = new Population();
    LIFE_P = createP()
    MAX_FITNESS_P = createP()
    AVG_FITNESS_P = createP()
    TARGET = new createVector(width / 2, height / 4)
}

function draw() {
    LIFE_P.html(CURRENT_TICK)
    MAX_FITNESS_P.html(MAX_FITNESS)
    AVG_FITNESS_P.html(AVG_FITNESS)

    background(51);
    POPULATION.run()
    CURRENT_TICK++;

    if (CURRENT_TICK > LIFESPAN) {
        CURRENT_TICK = 0;
        POPULATION.evaluate()
        POPULATION.selection();
    }

    noFill()
    stroke(255, 0, 0);
    ellipse(TARGET.x, TARGET.y, 16, 16)
    fill(100, 100, 100, 120)
    stroke(255, 255, 255);
    //rect(width / 3, height / 1.7, width / 6, height / 40)
}

function mousePressed() {
    console.log(TARGET.x, TARGET.y, mouseX, mouseY)
    console.log(dist(TARGET.x, TARGET.y, mouseX, mouseY))
}

function Population() {
    this.rockets = []
    this.matingpool = []

    for (var i = 0; i < POPSIZE; i++) {
        this.rockets[i] = new Rocket()
    }

    this.run = function () {
        for (var i = 0; i < POPSIZE; i++) {
            this.rockets[i].update();
            this.rockets[i].show();
        }

    }

    this.evaluate = function () {
        this.matingpool = [];

        for (var i = 0; i < POPSIZE; i++) {
            this.rockets[i].calcFitness()

            if (this.rockets[i].fitness > MAX_FITNESS) {
                MAX_FITNESS = this.rockets[i].fitness
				ELITE = this.rockets[i]
            }
            AVG_FITNESS += this.rockets[i].fitness
        }
        AVG_FITNESS /= POPSIZE

        for (var i = 0; i < POPSIZE; i++) {
            this.rockets[i].fitness /= MAX_FITNESS
        }

        for (var i = 0; i < POPSIZE; i++) {
            var n = floor(this.rockets[i]*100);
            for (var j = 0; j < n; j++) {
                this.matingpool.push(this.rockets[i])
            }
        }
        
        if(this.matingpool.length===0) {
            debugger;
        }
    }

    this.selection = function () {
        var newRockets = []
        if(this.matingpool.length===0) {
            console.log("Dupa error. Rebooting population")
            POPULATION = new Population();
            return
        }
        for (var i = 0; i < POPSIZE; i++) {
            var parentA = random(this.matingpool).dna
            var parentB = random(this.matingpool).dna

            var childDna = parentA.crossover(parentB)
            newRockets[i] = new Rocket(childDna);
        }
		this.newRockets[0] = ELITE
        this.rockets = newRockets
    }
}

function DNA(genes) {
    if (genes) {
        this.genes = genes
    } else {
        this.genes = []
        for (var i = 0; i < LIFESPAN; i++) {
            this.genes[i] = p5.Vector.random2D()
            this.genes[i].setMag(0.5);
        }
    }
    this.crossover = function (partnerDna) {
        var newgenes = [];

        var mid = floor(random(partnerDna.genes.length));
        //for (var i = 0; i < LIFESPAN; i++) {
        //    var gene = createVector()
        //    gene.x = (this.genes[i].x + partnerDna.x)/2
        //    gene.y = (this.genes[i].y + partnerDna.y)/2
        //    gene.z = (this.genes[i].z + partnerDna.z)/2
        //    newgenes[i] = gene
        //}
        
        var mid = floor(random(partnerDna.genes.length));
        for (var i = 0; i < LIFESPAN; i++) {
            newgenes[i] = (i > mid) ? this.genes[i] : partnerDna[i]
        }
        newgenes = this.mutate(newgenes)
        return new DNA(newgenes)
    }

    this.mutate = function (oldGenes) {
        var newgenes = []
        for (var i = 0; i < oldGenes.length; i++) {
            if (random(1) < 0.005) {
                newgenes[i] = p5.Vector.random2D();
            } else {
                newgenes[i] = oldGenes[i]
            }
        }
        return newgenes
    }
}

function Rocket(dna) {
    this.pos = createVector(width / 2, height)
    this.vel = createVector()
    this.acc = createVector()
    this.dna = (dna) ? dna : new DNA();
    this.fitness = 0;

    this.arrivedAt = LIFESPAN
    this.crashed = false
    this.arrivedAtTarget = false
    this.crashedAtBarrier = false

    this.calcFitness = function () {
        //var ta = 1 - sqrt((this.arrivedAt / (LIFESPAN + 1)^2))
        //var t = 1 / (1 + ta)
        //if (!this.arrivedAtTarget) {
        //    t /= 10;
        //}

        var d = dist(this.pos.x, this.pos.y, TARGET.x, TARGET.y)
        var c = 1 / (1 + d)

        //this.fitness = (t + c) / 2
        this.fitness = c

        if (this.crashed) {
            this.fitness /= 5
        }
        if (this.arrivedAtTarget) {
            this.fitness *= 200
        }
		
        if(this.crashedAtBarrier){
            this.fitness /= 20
        }

        return this.fitness
    }

    this.applyForce = function (force) {
        this.acc.add(force)
    }

    this.update = function () {
        if (this.crashed === true || this.arrivedAtTarget === true) {
            return;
        }

        this.applyForce(this.dna.genes[CURRENT_TICK])

        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.mult(0)

        var d = dist(this.pos.x, this.pos.y, TARGET.x, TARGET.y)
        if (d < 6 && !this.arrivedAtTarget) {
            this.arrivedAtTarget = true
            this.arrivedAt = CURRENT_TICK
            this.pos.x = TARGET.x
            this.pos.y = TARGET.y
        }

        if (this.pos.x < 0 || this.pos.x > width) {
            this.crashed = true
            return;
        }
        if (this.pos.y < 0) {
            this.crashed = true
            return;
        }

        if (this.pos.y > height) {
            this.crashedAtBarrier = true
            this.crashed = true
            return;
        }

       ////rect(width/3, height/1.7,width/3, height/40)
       //if (this.pos.x > width/3 && this.pos.x < (width/3)+(width/6) && this.pos.y > height/1.7 && this.pos.y < (height/1.7)+height/40) {
       //    this.crashed = true
       //    this.crashedAtBarrier = true
       //    return;
       //}
    }

    this.show = function () {
        push();

        translate(this.pos.x, this.pos.y)
        rotate(this.vel.heading())

        noStroke()
        fill(255, 255, 255, 100)

        rectMode(CENTER)
        rect(0, 0, 20, 5);

        pop();
    }

}
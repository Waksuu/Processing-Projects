let imageContainer = document.getElementById("imageContainer");
let trainSetButton, stepOnceButton, currentTrainingSet, loadTrainingSetButton;
let images;

class Dataset {
    static get Testing() {
        return "testing";
    }

    static get Training() {
        return "training";
    }
}

class ImageData {
    constructor(path) {
        let splitPath = path.split("/");
        this.file = splitPath[3];
        this.label = splitPath[2];
        this.set = splitPath[1];
        this.path = path;
    }

    loadImage() {
        this.image = loadImage(this.path);
    }
}

function preload() {
    loadJSON("./dataset.json", prepareImages);
}

function prepareImages(jsonDatafile) {
    let allImagesPaths = Object.values(jsonDatafile);
    let allImages = [];
    for (let image of allImagesPaths) {
        let img = new ImageData(image);
        allImages.push(img);
    }

    images = allImages;
}

function setup() {
    createCanvas(400, 300);
    background(0, 0, 0);
    currentTrainingSet = trainingSet(images, Dataset.Training, 10);

    trainSetButton = createButton("Train set");
    stepOnceButton = createButton("Step");
    loadTrainingSetButton = createButton("Load new set");
}

function trainingSet(images, set, numberOfImagesToLoad) {
    let filteredImages = _.filter(images, image => image.set === set);
    let result = [];
    for (let i = 0; i < numberOfImagesToLoad; i++) {
        let image = random(filteredImages);
        image.loadImage();
        result.push(image);
    }

    return result;
}

function draw() {
    let brain = new Brain();
    brain.draw();
}

function mouseClick() {
    brain.train(currentTrainingSet);
}

class Node {
    constructor(weight, bias, value, name) {
        this.weight = weight;
        this.bias = bias;
        this.name = name;
        this.value = value;
    }
}

class Brain {

    constructor(inputNodes, intermediateNodes, resultNodes) {
        this.inputNodes = this.setInputNodes();
        this.intermediateNodes = this.setIntermediateNodes();
        this.resultNodes = this.setOutputNodes();
        this.currentItem = undefined;
    }

    setInputNodes() {
        let result = [];
        result.push(new Node(1, 1));
        return result;
    }

    setIntermediateNodes() {
        let result = [];
        result.push(new Node(1, 1));
        result.push(new Node(1, 1));
        return [result]
    }

    setOutputNodes() {
        let result = [];
        result.push(new Node(1, 1, undefined, "result"));
        return result;
    }

    train(set) {
        console.log(set);
    }

    draw() {
        imageContainer.appendChild(this);
    }
}
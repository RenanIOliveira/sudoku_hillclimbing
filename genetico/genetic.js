var individual = require("./individual.js");
function generateInitialPopulation(){
    population = []
    for(let i=0;i<populationSize;i++){
        population.push(new individual());
    }
    return population;
}

var crossoverProbability = 0.8;
var mutationProbability = 0.01;
var populationSize = 200;
var maxGenerations = 300;
var elitism = true;

function randomValue(min, max) {

    return Math.floor(Math.random() * (max - min + 1) + min);
}

function fitnessSum(population) {

    var totalFitness = 0;

    for (individual in population) {
        totalFitness += individual.fitness();
    }

    return totalFitness;
}

// Stochastic Universal Sampling (SUS)
function selection(population) {

    population.sort(function(a, b){return a.fitness() - b.fitness()});

    var totalFitness = fitnessSum(population);

    var numberOfParents = populationSize / 2;
    var distance = totalFitness / numberOfParents;
    points = [];
    startPoint = randomValue(0, distance);
    
    for (var i = 0; i < numberOfParents; i++) {
        points.push(startPoint + i * distance);
        
    }   

    parents = [];

    for (var p in points) {

        for (var i = 0; fitnessSum(population.slice(0,i)) < p; i++) {
            parents.push(population[i]);
        }
    }

    return parents;
}

genetic()

function genetic(){

    var population = generateInitialPopulation();

    var parents = selection(population);
    
}





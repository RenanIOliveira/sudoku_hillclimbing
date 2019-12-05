var individual = require("./individual");

function generateInitialPopulation(){
    population = []
    for(let i=0;i<populationSize;i++){
        population.push(new individual());
    }
    return population;
}

var crossoverProbability = 0.8;
var mutationProbability = 0.01;
var populationSize = 100;
var maxGenerations = 300;
var elitism = true;

function randomValue(min, max) {

    return Math.random() * (max - min) + min;
}

function calcFitness(population) {

    fitness = []
    // population.sort(function(a, b){return b.fitness() - a.fitness()});

    for(individual of population) {
        fitness.push(individual.fitness())
    }

    return fitness
}

function fitnessSum(population) {

    var totalFitness = 0;

    for (individual of population)
        totalFitness += individual.fitness();

    return totalFitness;
}

// Roulette Wheel Selection
function rouletteWheel(population) {

    population.sort(function(a, b){return b.fitness() - a.fitness()});
    var totalFitness = fitnessSum(population);

    relativeFitness = [];

    for (individual of population)
        relativeFitness.push(individual.fitness()/totalFitness);

    var probabilities = [];

    relativeFitness.reduce(function(a,b,i) { return probabilities[i] = a+b; },0);

    // console.log(calcFitness(population))

    // console.log(relativeFitness)

    // console.log(probabilities)

    var parents = [];

    while (parents.length < populationSize) {

        var pick = randomValue(0, probabilities[populationSize-1]);
        var current = 0;

        for (individual in population) {

            current += probabilities[individual];

            if (pick <= current) {
                parents.push(population[individual]);
                break;
            }
        }
    }

    parents.sort(function(a, b){return b.fitness() - a.fitness()});
    return parents;
}

// Stochastic Universal Sampling (SUS)
function selection(population) {

    population.sort(function(a, b){return b.fitness() - a.fitness()});

    var totalFitness = fitnessSum(population);

    var numberOfParents = populationSize;
    var distance = totalFitness / numberOfParents;
    points = [];
    startPoint = randomValue(0, distance);
    // console.log(distance)
    // console.log(startPoint)
    
    for (var i = 0; i < numberOfParents; i++) {
        points.push(startPoint + i * distance);
        
    }

    // console.log(points.length);

    parents = [];
    var i;

    for (p of points) {

        i = 0;
        while ( fitnessSum(population.slice(0,i)) < p) {
            i++;
        }

        if(population[i])
            parents.push(population[i]);
        
    }

    console.log("length: ", parents.length)
    
    return parents;
}

genetic()

function genetic(){

    var population = generateInitialPopulation();
    var parents;

    var generations = 0;

    parents = rouletteWheel(population);

    console.log(calcFitness(parents))

    // while (generations < maxGenerations) {


    // }
}





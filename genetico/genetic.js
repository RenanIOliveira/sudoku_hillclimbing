var individual = require("./individual");

function generateInitialPopulation(){
    population = []
    for(let i=0;i<populationSize;i++){
        population.push(new individual());
    }
    return population;
}

// Melhor resultado: 10 (com crossover = 0.75, mutation = 0.45, populationsize = 300 e elitism = true)
var crossoverProbability = 0.75;
var mutationProbability = 0.45;
var populationSize = 300;
var maxGenerations = 1000;
var stability = 100;
var elitism = true;
var useStability = true;

function randomValue(min, max) {

    return Math.random() * (max - min) + min;
}

function calcFitness(population) {

    fitness = []

    for(individual of population) {
        fitness.push(individual.fitness())
    }

    return fitness
}

function calcNumberOfCollisions(population) {

    numberOfCollisions = []

    for(individual of population) {
        numberOfCollisions.push(individual.numberOfCollisions())
    }

    return numberOfCollisions
}

function fitnessSum(population) {

    var totalFitness = 0;

    for (individual of population)
        totalFitness += individual.fitness();

    return totalFitness;
}

function sortByFitness(population) {

    population.sort(function(a, b){return b.fitness() - a.fitness()});
}

// Roulette Wheel Selection
function selection(population) {

    sortByFitness(population);

    var totalFitness = fitnessSum(population);

    relativeFitness = [];

    for (individual of population)
        relativeFitness.push(individual.fitness()/totalFitness);

    var probabilities = [];

    relativeFitness.reduce(function(a,b,i) { return probabilities[i] = a+b; },0);

    var matingPool = [];

    if (elitism)
        matingPool.push(population[0]);

    while (matingPool.length < populationSize) {

        var pick = randomValue(0, probabilities[populationSize-1]);
        var current = 0;

        for (individual in population) {

            current += probabilities[individual];

            if (pick <= current) {
                matingPool.push(population[individual]);
                break;
            }
        }
    }

    sortByFitness(matingPool);
    return matingPool;
}

// Stochastic Universal Sampling (SUS)
// Nao utilizada
function sus(population) {

    sortByFitness(population);

    var totalFitness = fitnessSum(population);

    var numberOfParents = populationSize;
    var distance = totalFitness / numberOfParents;
    points = [];
    startPoint = randomValue(0, distance);
    
    for (var i = 0; i < numberOfParents; i++)
        points.push(startPoint + i * distance);

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
    
    return parents;
}

function pickRandomIndividual(population) {

    return population[Math.floor(Math.random() * population.length)];
}

function probability(probability) {

    return !!probability && Math.random() <= probability;
}

function doCrossOver(matingPool) {

    newPopulation = [];

    while (newPopulation.length < populationSize) {

        firstPick = pickRandomIndividual(matingPool);
        matingPool.splice(matingPool.indexOf(firstPick), 1);

        secondPick = pickRandomIndividual(matingPool);
        matingPool.splice(matingPool.indexOf(secondPick), 1);

        if(probability(crossoverProbability)) {
            
            [firstOffspring, secondOffspring]  = firstPick.crossOver(secondPick);

            newPopulation.push(firstOffspring);
            newPopulation.push(secondOffspring);
        }
        else {

            newPopulation.push(firstPick);
            newPopulation.push(secondPick);
        }
    }
    
    sortByFitness(newPopulation);
    return newPopulation;
}

function doMutation(population) {

    for(individual of population)
        if(probability(mutationProbability)) 
            individual.mutate();

    sortByFitness(population);
    return population;
}

genetic()

function genetic(){

    var population = generateInitialPopulation();
    var matingPool;

    var generations = 0;

    var lastBest = 0;
    var currentBest = 0;
    var stabilityCounter = 0;
    
    while (generations < maxGenerations) {

        matingPool = selection(population);
        // console.log(calcFitness(matingPool)[0]);

        population = doCrossOver(matingPool);
        // console.log(calcFitness(population)[0]);

        population = doMutation(population);
        // console.log(calcFitness(population)[0]);

        // console.log("last: " + lastBest);
        currentBest = population[0].numberOfCollisions();
        console.log("current best: ", population[0].numberOfCollisions());
        

        if (useStability) {

            if(generations == 0)
                lastBest = population[0].numberOfCollisions();

            if(currentBest == lastBest)
                stabilityCounter++;

            else
                stabilityCounter = 0;

            if (stabilityCounter == stability) {
                console.log("convergiu para " + currentBest + " !");
                break;
            }

            if(currentBest < lastBest)
                lastBest = currentBest;
        }

        generations++;
    }

    console.log(population[0]);
    return population[0]; // Melhor membro da população final
}





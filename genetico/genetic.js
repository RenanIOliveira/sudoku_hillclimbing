var individual = require("./individual");

function generateInitialPopulation(){
    population = []
    for(let i=0;i<populationSize;i++){
        population.push(new individual());
    }
    return population;
}

// Melhores resultados: 
// 8 (com crossover = 0.85, mutation = 0.45, populationsize = 300, stability = 100 e elitism = true)
// 10 (com crossover = 0.85, mutation = 0.45, populationsize = 300, stability = 150 e elitism = true)

var crossoverProbability = 0.85;
var mutationProbability = 0.45;
var populationSize = 300;
var maxGenerations = 10000;
var stability = 300;
var elitism = true;
var useStability = true;

function randomValue(min, max) {

    return Math.random() * (max - min) + min;
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

    var lastBest = Infinity;
    var currentBest = 0;
    var stabilityCounter = 0;
    
    for (var generation = 1; generation <= maxGenerations; generation++) {

        matingPool = selection(population);
        // console.log(matingPool[0].fitness());

        population = doCrossOver(matingPool);
        // console.log(population[0].fitness());

        population = doMutation(population);
        // console.log(population[0].fitness());

        currentBest = population[0].numberOfCollisions();
        console.log("gen: ", generation, " current best: ", population[0].numberOfCollisions());

        if(generation == 200 && currentBest > 16) // Se chegar a 200 geracoes e ainda nao tiver atingido minimo de 16
            break;

        if(currentBest == 0) // Se for zero (minimo global)
            break;
        
        if (useStability) {

            if(currentBest == lastBest)
                stabilityCounter++;
            else
                stabilityCounter = 0;
            
            // console.log("gen: ", generation, " current best: ", population[0].numberOfCollisions(), 
            // " last best: " + lastBest + " stability: " + stabilityCounter);
            
            if (stabilityCounter == stability) {
                console.log("Convergiu para " + currentBest + "!");
                break;
            }

            if(currentBest != lastBest)
                lastBest = currentBest;
        }
    }

    console.log(population[0]);
    return population[0]; // Melhor membro da população final
}




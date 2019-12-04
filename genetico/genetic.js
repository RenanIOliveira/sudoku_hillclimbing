var individual = require("./individual");
function generateInitialPopulation(){
    population = []
    for(let i=0;i<100;i++){
        population.push(new individual());
    }
    return population;
}

genetic()

function genetic(){
    population = generateInitialPopulation();
}





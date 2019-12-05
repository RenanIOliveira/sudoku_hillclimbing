
const fixedValues = [
	0, 0, 0, 7, 0, 0, 0, 0, 0,
	1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 4, 3, 0, 2, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 6,
	0, 0, 0, 5, 0, 9, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 4, 1, 8,
	0, 0, 0, 0, 8, 1, 0, 0, 0,
	0, 0, 2, 0, 0, 0, 0, 5, 0,
	0, 4, 0, 0, 0, 0, 3, 0, 0
];
const fixedPositions = [3,  9,  21, 22, 24, 35, 39, 41, 51, 52, 53, 58, 59, 65, 70, 73, 78]


module.exports = class individual {
    /**
     * if an array is given it forces only the fixed ones to be 
     * equal to the fixed values.
     * if no array is given generate with random number except by the fixed values
     * @param {number[]} array 
     */
    
	constructor(array) {
        this.values = []

        if(array != null && array.length!=81){
            throw new Error("invalid array size");
        }

        if(array == null){
            array = []
            for(let i=0;i<81;i++){
                array.push(Math.floor(Math.random()*9)+1)
            }
        }
        
         for(let i=0;i<81;i++){
             if(fixedPositions.includes(i)){
                this.values[i]= fixedValues[i];
             }else{
                this.values[i] = array[i];
             }
         }
    }

    toString(){
        return this.values.join("");
    }

    fitness() {
        return 1/(1+this.numberOfCollisions());
    }

    mutate(){
        //calculate random index from 0 to 80
        do{
            var random_index = Math.floor(Math.random()*81);
        }while(fixedPositions.includes(random_index))
        
        //calculate random number from 1 to 9 diferent from the current in the index
        do{
            var random_number = Math.floor(Math.random()*9)+1;
        }while(random_number=== this.values[random_index] );
        
    
        this.values[random_index] = random_number;
    }

    /**
     * returns an array with two new individuals the crossOver between this and the passed one
     * @param {individual} otherIndividual 
     */
    crossOver(otherIndividual){
        
        let crossPosition =  Math.floor(Math.random()*81);
        
        let first_part_this = this.values.slice(0,crossPosition+1);
        let second_part_this = this.values.slice(crossPosition+1,81);

        let first_part_that = otherIndividual.values.slice(0,crossPosition+1);
        let second_part_that = otherIndividual.values.slice(crossPosition+1,81);
        
        return [
            new individual(first_part_this.concat(second_part_that)),
            new individual(first_part_that.concat(second_part_this))
        ]
    }

    numberOfCollisions(){
        let SquareCollisions = countSquareCollisions(this.values);
        let lineCollisions = countLineCollisions(this.values);
        let columnCollisions = countColumnCollisions(this.values);

        return SquareCollisions + lineCollisions + columnCollisions;
    }
}

function countSquareCollisions(values){
    let repetitions = 0;
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            let array = getBiggerSquareValues(values,i,j);
            repetitions+=countRepetitions(array);
        }
    }
    return repetitions;
}

function countLineCollisions(values){
    let repetitions = 0;
    for(let i=0; i<9; i++){
        let line = getLine(values,i);
        repetitions+= countRepetitions(line);
    }
    return repetitions;
}

function countColumnCollisions(values){
    let repetitions = 0;
    for(let j=0;j<9;j++){
        let column = getColumn(values,j);
        repetitions+= countRepetitions(column);
    }
    return repetitions;
}

function getBiggerSquareValues(values,i,j){
    let i_index = 3*9*i+3*j;
    let j_index = i_index+3;
    return [...values.slice(i_index,j_index),...values.slice(i_index+9,j_index+9),...values.slice(i_index+18,j_index+18)]
}

function getLine(values,i){
    let index = i*9
    return values.slice(i*9,i*9+9)
}

function getColumn(values,j){
    let column = [];
    for(let i=0; i<9;i++){
        column.push(values.get(i,j));
    }
    return column;
}

function countRepetitions(array){
    let set = new Set(array);
    return array.length-set.size
}

Array.prototype.get = function(i,j){
    return this[9*i+j];
}

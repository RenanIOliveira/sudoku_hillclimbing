

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


class individual {
    
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

    mutate(){
        //calculate random index from 0 to 80
        do{
            var random_index = Math.floor(Math.random()*81);
        }while(fixedPositions.includes(random_index))
        
        //calculate random number from 1 to 9 diferent from the current in the index
        do{
            var random_number = Math.floor(Math.random()*9)+1;
        }while(random_number=== this.values[random_index] );
        
        console.log(random_index)
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

}

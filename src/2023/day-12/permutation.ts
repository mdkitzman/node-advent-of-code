import { zip } from 'lodash';


function permutationScope(domain:string, variable:string) {
  const fixedDomain = domain.split("");
  if (variable.length !== 1) {
    throw new Error("Can only handle one variable");
  }

  function *combinationIterative(pattern:string) {
    //Create a stack
    const stack:string[] = [];
    
    //Push the pattern in the stack
    stack.push(pattern);
    
    //To track the index of wildcard
    let index: number;
    
    while(stack.length){
      //Get the pattern
      let curr = stack.pop();
      
      //Find the index of the wildcard pattern and store in the index 
      //and simultaneously check if it is present or not
      if(curr && (index = curr.indexOf(variable)) !== -1){
          //Replace the '?' with '0' and '1' and store it back in the stack
          for(const c of fixedDomain){
            curr = curr.substring(0, index) + c + curr.substring(index+1);
            stack.push(curr);
          }
      }else{
        //If there is no wildcard present then print the string
        yield curr;
      }
    }
  }

  return (inputStr: string) => combinationIterative(inputStr);
}

export default permutationScope;
import { intersection } from "lodash";
import { min } from './arrayUtils.ts';

/**
 * Scopes the generation of permutations of a set possibilites with wild replacements
 * For Example, given a set of face card values "AKQJT987654321" with "2" being wild,
 * generate all of the possible permutations with this combination "KK255".
 * This will generate all of the possible permutations with the "2" replaced with one
 * of the face cards.
 * ```ts
 * const permutator = wildPermutations("01", "*");
 * const permutations = [...permutator("01*")]; // ["011", "010"];
 * ```
 * @param domain : The set of possible values (may include the variables)
 * @param variable : The charachters that are variable in the domain
 * @returns : a generator function that returns all possible variations with the variables replaced
 */
function wildPermutations(domain: string, variable: string | null) {
  const wilds = variable?.split("");
  const variableIndex = (str:string) => {
    return wilds?.map(v => str.indexOf(v)).reduce(min, Number.MAX_VALUE) || -1;
  } 

  const fixedDomain = domain.split("").filter(d => variable?.includes(d) || true);
  
  function* combinationIterative(pattern: string) {
    //Create a stack
    const stack: string[] = [];

    //Push the pattern in the stack
    stack.push(pattern);

    //To track the index of wildcard
    let index: number;

    while (stack.length) {
      //Get the pattern
      let curr = stack.pop();

      //Find the index of the wildcard pattern and store in the index
      if (curr && (index = variableIndex(curr)) !== -1) {
        //Replace the variable character with all of the options in the domain and store them back in the stack
        for (const c of fixedDomain) {
          curr = curr.substring(0, index) + c + curr.substring(index + 1);
          stack.push(curr);
        }
      } else {
        //If there is no wildcard present then return the string
        yield curr;
      }
    }
  }

  return (inputStr: string) => combinationIterative(inputStr);
}

export default wildPermutations;

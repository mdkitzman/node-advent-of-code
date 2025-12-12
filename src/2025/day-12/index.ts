import { getPuzzleInput } from '../../aocClient.ts';
import { sum } from '../../util/arrayUtils.ts';
import { parseAllNumbers } from '../../util/stringUtils.ts';
import timeFn from '../../util/timeFn.ts';

const timedPart1 = timeFn(doPart1)
const timedPart2 = timeFn(doPart2);

const main = async () => {
  const allInput = await getPuzzleInput(12, 2025);
  const part1Expected = 414;
  const part2Expected = 0;
  
  const part1 = timedPart1(allInput);
  console.log('Part 1', part1 === part1Expected ? '✅' : '❌', part1);
  
  const part2 = timedPart2(allInput);
  console.log('Part 2', part2 === part2Expected ? '✅' : '❌', part2);
};

function doPart1(input: string) {
  const [treeData] = input.split('\n\n').reverse();
  const trees = treeData.split('\n').map(line => {
    const [[x, y], requiredShapes] = line.split(': ').map(parseAllNumbers);
    return {
      x, y, requiredShapes
    };
  });

  return trees.filter(tree => {
    // remove trees where the theoretical minimum area of required shapes is larger than the tree area
    const minAreaRequred = tree.requiredShapes
      .map((amount) => 9 * amount)
      .reduce(sum, 0);
    return minAreaRequred <= tree. x * tree.y;
  }).length;  
};

function doPart2(input: string) {
  return 0;
};

main();
const main = async () => {
  const input = "768071";
  doPart1(input); // 6548103910
  doPart2(input); // 20198090
};

function doPart1(input: string) {
  const positions: [number, number] = [0,1];
  const recipies: number[] = [3,7];
  const limit = parseInt(input, 10);
  do {
    // add
    const [p0, p1] = positions;
    const [val0, val1] = [recipies[p0], recipies[p1]];
    const sumDigits = (val0 + val1).toString(10).split('').map(c => parseInt(c, 10));
    // append
    recipies.push(...sumDigits);
    // move

    positions[0] = (p0 + (val0 + 1) % recipies.length) % recipies.length;
    positions[1] = (p1 + (val1 + 1) % recipies.length) % recipies.length;
  } while (recipies.length < limit + 10)

  const score = recipies.slice(limit, limit+10).map(c => c.toString(10)).join('');
  console.log(score);
};

function doPart2(input: string) {
  const numLen = input.length;
  const positions: [number, number] = [0,1];
  const recipies: number[] = [3,7];
  
  let count = 0;
  do {
    // add
    const [p0, p1] = positions;
    const [val0, val1] = [recipies[p0], recipies[p1]];
    const sumDigits = (val0 + val1).toString(10).split('').map(c => parseInt(c, 10));

    // append
    recipies.push(...sumDigits);
    
    // move
    positions[0] = (p0 + (val0 + 1) % recipies.length) % recipies.length;
    positions[1] = (p1 + (val1 + 1) % recipies.length) % recipies.length;

    // search
    let add = 0;
    const foundIndex = sumDigits
      .map((_,i) => recipies.slice(-numLen-i, recipies.length-i).join(''))
      .map(str => str === input)
      .indexOf(true);
      
    if(foundIndex > -1) {
      count = recipies.length - numLen - foundIndex;
    }
    
  } while (!count)
  console.log(count);
};

main();
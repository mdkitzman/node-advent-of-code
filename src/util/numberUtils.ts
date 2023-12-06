import { leftpad } from "./stringUtils";

export const inRange = (min:number, max:number) => (val:number):boolean => min <= val && val <= max;
export const dec2bin = (dec:number, byteSize = 8):string => leftpad((dec >>> 0).toString(2), byteSize);
export const hex2bin = (hex:string):string => hex.split('').map(ltr => (parseInt(ltr, 16).toString(2)).padStart(4, '0')).join('');

// https://mathjs.org/docs/reference/functions/lcm.html
export const lcm = (x:number, y:number):number => {
  if (y === 0) return 0;
  return Math.abs(x * y) / gcd(x, y);
}

// https://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations
// Nota Bene:
// if negative inputs are allowed, or if the mod function may return negative values, the instruction "return a" must be changed into "return max(a, −a)"
export const gcd = (x:number, y:number):number => {
  if (y === 0) return Math.max(x, -x);
	return gcd(y, x % y);
}

// % is not a modulo function, but rather a remainder function, which will allow
// for negative values to be returned, i.e. -1 % 4 => -1.
export const absoluteModulo = (a:number, b:number):number => ((a % b) + b) % b;

export function* generateRange(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

export const quadratic = (a:number, b:number): number => {
  // d(x) := x * (a - x) > b, (inverted parabola)
  const x1 = (a - Math.sqrt(a ** 2 - 4 * b)) / 2;
  const x2 = (a + Math.sqrt(a ** 2 - 4 * b)) / 2;
  return Math.floor(x2) - Math.ceil(x1) + 1;
}

export const findFactorPairs = (n: number): number[][] => {
  const pairs: number[][] = [];
  for (var i = 1; i < n; i++){
    if (n % i === 0) {
      const [a, b] = [i, n / i];
      pairs.push([a,b]);
      if (a >= b){
        break;
      } 
    }
  }
  return pairs;
}
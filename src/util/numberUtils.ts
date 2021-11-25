import { leftpad } from "./stringUtils";

export const inRange = (min:number, max:number) => (val:number):boolean => min <= val && val <= max;
export const dec2bin = (dec:number, byteSize = 8):string => leftpad((dec >>> 0).toString(2), byteSize);

export const lcmRecurse = (input:number[]):number => {
  if (input.length === 1){
    return input[0];
  }
  return lcm(input[0], lcmRecurse(input.slice(1)));
}

export const lcm = (x:number, y:number):number => {
 return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

export const gcd = (x:number, y:number):number => {
 x = Math.abs(x);
 y = Math.abs(y);
 while(y) {
   var t = y;
   y = x % y;
   x = t;
 }
 return x;
}

// % is not a modulo function, but rather a remainder function, which will allow
// for negative values to be returned, i.e. -1 % 4 => -1.
export const absoluteModulo = (a:number, b:number):number => ((a % b) + b) % b;
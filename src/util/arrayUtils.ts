export const bitAnd = (prev: number, cur: number) => prev & cur;
export const sum = (prev: number, cur: number) => prev + cur;
export const diff = (prev: number, cur: number) => prev - cur;
export const multiply = (prev: number, cur: number) => prev * cur;
export const allTrue = (prev: boolean, cur:boolean) => prev && cur;
export const anyTrue = (prev: boolean, cur:boolean) => prev || cur;

export const max = (prev: number, cur: number) => Math.max(prev, cur)
export const min = (prev: number, cur: number) => Math.min(prev, cur)

export const toCharCodes = (input:string):number[] => input.split('').map(c => c.charCodeAt(0));
export const chunk = <T>(arr: T[], n: number): T[][] => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];

export const minMax = (arr: number[]): [number, number] => [
  Math.min(...arr),
  Math.max(...arr)
];

/**
 * Creates an array of k sized windows over the provided array
 * i.e.
 * windowed(2, [1,2,3,4,5])
 * 
 * returns [
 *  [1,2],
 *  [2,3],
 *  [3,4],
 *  [4,5]
 * ]
 * 
 * @param k - Desired window size over the array
 * @param arr - The array to create the window over
 * @returns 
 */
export const windowed = <T>(k: number, arr: T[]): T[][]=>
  arr.flatMap((_, i) =>
    i <= arr.length - k
      ? [arr.slice(i, i + k)]
      : []);

/**
 * A generator function that will infinitely loop over a finite array of data.
 * @param input Any kind of array
 */
export const infiniteLoop = function*<T>(input: T[]) {
  let i = 0;
  while (input.length) {
    yield input[i];
    i = i + 1 === input.length ? 0 : i+1;
  }
};

/**
 * Used in combination with discriminated union types and filtering arrays which allows
 * the subsequent methods to know the reduced type.
 * 
 * ```ts
 * type Foo = { type: "Foo" };
 * type Goo = { type: "Goo" };
 * type Union = Foo | Goo;
 *  
 * const arr: Union[] = [];
 *  
 * const foo = arr.find(discriminate("type", "Foo")); // Foo | undefined 
 * const goos = arr.filter(discriminate("type", "Goo"));  // Goo[]
 * ```
 * Source: https://stackoverflow.com/a/59054248
 * 
 * @param discriminantKey: The name of the parameter to discriminate on
 * @param discriminantValue: The value to discriminate with
 * @returns 
 */
export function discriminate<K extends PropertyKey, V extends string | number | boolean>(
  discriminantKey: K, discriminantValue: V
) {
  return <T extends Record<K, any>>(
      obj: T & Record<K, V extends T[K] ? T[K] : V>
  ): obj is Extract<T, Record<K, V>> =>
      obj[discriminantKey] === discriminantValue;
}
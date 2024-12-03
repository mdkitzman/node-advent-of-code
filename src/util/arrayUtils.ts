export const bitAnd = (prev: number, cur: number) => prev & cur;
export const sum = (prev: number, cur: number) => prev + cur;
export const diff = (prev: number, cur: number) => prev - cur;
export const multiply = (prev: number, cur: number) => prev * cur;
export const allTrue = (prev: boolean, cur: boolean) => prev && cur;
export const anyTrue = (prev: boolean, cur: boolean) => prev || cur;

export const max = (prev: number, cur: number) => Math.max(prev, cur)
export const min = (prev: number, cur: number) => Math.min(prev, cur)

export const toCharCodes = (input: string): number[] => input.split('').map(c => c.charCodeAt(0));
export const chunk = <T>(arr: T[], n: number): T[][] => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : [];

export const minMax = (arr: number[]): [number, number] => [
  Math.min(...arr),
  Math.max(...arr)
];

/**
 * Used to create a Proxy handler for arrays so that accessing
 * values in the array will not access anything out of bounds.
 */
export const SafeArray = <T>(defaultVal: T) => {
  const autoExpander: ProxyHandler<T[]> = {
    get: function(target: T[], prop: string | Symbol, receiver) {
      const index = Number(prop);
      if (index >= target.length)
        target.push(...new Array(index - target.length + 1).fill(defaultVal));
      return target[index];
    },
    set: function(target: T[], prop: string | Symbol, value:T) {
      const index = Number(prop);
      if (index >= target.length)
        target.push(...new Array(index - target.length + 1).fill(defaultVal));
      target[index] = value;
      return true;
    }
  };
  return autoExpander;
}

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
export const windowed = <T>(k: number, arr: T[]): T[][] =>
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
    i = i + 1 === input.length ? 0 : i + 1;
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

const chooseRecurse = <T>(arr: T[], k: number, prefix:T[] = []):T[][] => {
  if (k == 0) return [prefix];
  return arr.flatMap((v, i) =>
    chooseRecurse(arr.slice(i+1), k-1, [...prefix, v])
  );
}

/**
 * Will generate an array of arrays of size `k` of combinations of the elements
 * in the provided array.
 * 
 * ```ts
 * console.log(choose([1,2,3,4], 2))
 * // [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
 * console.log(choose([1,2,3,4], 3))
 * // [[1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4]]
 * ```
 * @param arr: The Array to generate combinations of
 * @param k: How many to choose for each combination
 * @returns Combination array
 * @author https://stackoverflow.com/a/74115113
 */
export const choose = <T>(arr: T[], k:number): T[][] => chooseRecurse(arr, k);
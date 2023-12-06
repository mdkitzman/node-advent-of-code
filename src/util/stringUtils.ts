export const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHABET = alphabet.toUpperCase();
export const digits = '0123456789';

export const leftpad = (str:string, num:number) => ("0".repeat(num) + str).slice(-num);
export const cut = (str:string, pos: number): [string, string] => ([str.slice(0, pos), str.slice(pos)]);

/**
 * This will parse out each group of numbers that are separated by non-number characters
 * 
 * For example
 * ```
 * const str = "1 and bob22 2 3 45";
 * const numbers = parseAllNumbers(str);
 * ```
 * numbers will be `[1, 22, 2, 3, 45]`
 * @param str The string to parse
 * @returns: number[]
 */
export const parseAllNumbers = (str: string) => str.split(/\D/g).map(v => parseInt(v, 10)).filter(n => !isNaN(n));

/**
 * This will extract any number from a string as a single value
 * 
 * ```
 * "bob123" => 123
 * "12bob3" => 123
 * "hey there 12.  I'm another number 54" => 1254
 * "my name is bob" => null
 * ```
 * @param str 
 * @returns: number|null
 */
export const parseNumber = (str: string): number|null => parseInt(str.replaceAll(/\D/g, ""), 10) || null;
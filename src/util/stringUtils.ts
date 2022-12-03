export const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHABET = alphabet.toUpperCase();
export const digits = '0123456789';

export const leftpad = (str:string, num:number) => ("0".repeat(num) + str).slice(-num);
export const cut = (str:string, pos: number): [string, string] => ([str.slice(0, pos), str.slice(pos)]);
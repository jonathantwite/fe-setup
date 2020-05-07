import {add, subtract} from '../modules/maths.mjs';

/**
 * Do a calculation on three numbers.
 * @param {Number} a - The first number.
 * @param {Number} b - The number to add.
 * @param {Number} c - The number to subtract.
 */
export const doCalculation = (a,b,c)=>subtract(add(a,b),c);

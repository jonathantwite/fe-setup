import {add, subtract} from '../modules/maths.mjs';

/**
 * Do a calculation on three numbers.
 * @param {Number} a - The first number.
 * @param {Number} b - The number to add.
 * @param {Number} c - The number to subtract.
 */
export const doCalculation = (a,b,c)=>subtract(add(a,b),c);

export const doCalculation2 = (a,b,c)=>{
    let arr1 = [a, b];
    let arr2 = [c];
    let arr = [...arr1, ...arr2];
    return arr.reduce((total, val )=> total + (val.toString().includes('1') ? val : 0), 0);
}
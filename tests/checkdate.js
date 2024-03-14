import { compareDate, returnDategap } from "../src/utils/comparedate.js";

const day1Str = "31/12/2023";
const day2Str = "10/1/2024";

console.log(compareDate(day1Str, day2Str));
console.log(returnDategap(day1Str, day2Str));

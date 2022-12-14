const data = require('../fixtures/01/input')

const input = input => input.split('\n\n').map(n => n.split('\n').map(n => parseInt(n)))
const makeElf = (calorieList, elf) => ({ elf, calorieList })
const sum = (prev, cur) => cur + prev

const answer = input(data).map(makeElf).map(({elf, calorieList}) => ({elf, calorieList, totalCalories: calorieList.reduce(sum) }))

const sorted = answer.sort((a, b) => a.totalCalories > b.totalCalories ? -1 : 1)

// 1
console.log(sorted[0].totalCalories)

// 2
console.log(sorted.slice(0,3).map(({totalCalories}) => totalCalories).reduce(sum))

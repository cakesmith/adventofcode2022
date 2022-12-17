import input_demo from './input_demo.js'
import input_real from './input_real.js'

import chalk from 'chalk'

const height = n => {
    const code = n.charCodeAt(0);
    if(code === 83) { // S
        return 0
    }
    if(code === 69) { // E
        return 27
    }
    return code - 96;
}

const letter = k => {
    if(!Number.isInteger(k)) {
        return k;
    }
    if(k === 0) {
        return String.fromCharCode(83);  // S
    }
    if(k === 27) {
        return String.fromCharCode(69);  // E
    }
    return String.fromCharCode(k + 96);
}

const model = input => input
    .split('\n')
    .map(n => n
        .split('')
        .map(height)
    )

const value = ([a, b], grid) => grid[a][b] = grid[a][b];

const findCoordinate = (value, grid) => {
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] === value) {
                return [i,j]
            }
        }
    }
}

const validMoveIn = grid => (from, direction) => {
    let nextCoords = [];
    switch(direction) {
        case "up": {
            if(from[0] - 1 < 0) {
                return false;
            }
            nextCoords = [from[0] - 1, from[1]]
            break;
        }
        case "down": {
            if(from[0] + 1 >= grid.length) {
                return false;
            }
            nextCoords = [from[0] + 1, from[1]];
            break;
        }
        case "left": {
            if(from[1] - 1 < 0) {
                return false;
            }
            nextCoords = [from[0], from[1] - 1];
            break;
        }
        case "right": {
            if(from[1] + 1 >= grid[from[0]].length) {
                return false;
            }
            nextCoords = [from[0], from[1] + 1]
            break;
        }
        default: {
            throw new Error(`[ ${direction} ] is an invalid direction.`)
        }
    }

    return nextCoords;
}

const search = (start, goal, grid) => {
    // Breadth first search
    const move = validMoveIn(grid);
    const queue = [{ location: start }];
    const visited = {};
    visited[start] = true;
    let iterations = 0;

    while(queue.length > 0) {
        iterations++;
        const node = queue.shift();
        const currentValue = value(node.location, grid);

        for(const direction of ["up", "down", "left", "right"]) {
            const nextCoords = move(node.location, direction);
            if(nextCoords && !visited[nextCoords]) {
                    const nextValue = value(nextCoords, grid);
                // Don't go downhill more than 1  (we're starting from the goal)
                if (currentValue - nextValue > 1) {
                    continue;
                }
                    const next = {
                        location: nextCoords,
                        parent: node
                    };
                    if (goal(nextCoords)) {
                        return getPath(next)
                    } else {
                        visited[nextCoords] = true
                        queue.push(next);
                    }
                }
        }
    }
    return false;
}

const getPath = (node, path = []) => {
    if(!node.parent) {
        return path;
    }
    return getPath(node.parent, [...path, node.location])
}

const grid = (model(input_real))

// const start = findCoordinate(0, grid);
// const goal = findCoordinate(27, grid);
// grid[start[0]][start[1]] = 1;
// grid[goal[0]][goal[1]] = 26;
const start = findCoordinate(27, grid);
const goal = findCoordinate(0, grid);
grid[start[0]][start[1]] = 26;
grid[goal[0]][goal[1]] = 1;

const atLocation = location => coords => coords[0] === location[0] && coords[1] === location[1];
const atValue = val => coords => value(coords, grid) === val;

// const solution = search(start, atValue(1), grid);
const solution = search(start, atLocation(goal), grid);

if (!solution) {
    throw new Error("No solution found")
}

console.log(solution.length)

const onPath = (coords, path) => {
    return path.map(p => JSON.stringify(p)).includes(JSON.stringify([coords[0],coords[1]]))
}

const colorized = (grid, path) => grid.map(
    (line, y) => line
        .map(c => letter(c))
        .map((c, x) => onPath([y,x], path) ? chalk.green(c) : c)
        .map((c,x) => c === 'a' && !onPath([y,x], path) ? chalk.blue(c) : c)
.join('')).join('\n')

console.log(colorized(grid, solution))


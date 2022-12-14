input_demo = require('./input_demo');
input_real = require('./input_real');

weight = n => {
    const code = n.charCodeAt(0);
    if(code === 83) { // S
        return 0
    }
    if(code === 69) { // E
        return 27
    }
    return code - 96;
}

letter = k => {
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

model = input => input
    .split('\n')
    .map(n => n
        .split('')
        .map(weight)
    )

value = ([a, b], data) => data[a][b] = data[a][b];

findCoordinate = (value, data) => {
    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].length; j++) {
            if(data[i][j] === value) {
                return [i,j]
            }
        }
    }
}

validMove = data => (from, direction) => {
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
            if(from[0] + 1 >= data.length) {
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
            if(from[1] + 1 >= data[from[0]].length) {
                return false;
            }
            nextCoords = [from[0], from[1] + 1]
            break;
        }
        default: {
            throw new Error(`[ ${direction} ] is an invalid direction.`)
        }
    }

    const nextValue = value(nextCoords, data);
    const currentValue = value(from, data);

    // Don't go uphill more than 1
    if(nextValue - currentValue > 1) {
        return false;
    }

    return nextCoords;
}

// manhattan = (x,y) => Math.abs(x[0] - x[1]) + Math.abs(y[0] - y[1])

search = grid => {
    // Breadth first search
    const move = validMove(grid);

    const home = findCoordinate(0, grid)

    const queue = [{
        location: home,
        path: []
    }];

    const visited = {};

    let iterations = 0;

    while(queue.length > 0) {
        iterations++;

        const {
            location,
            path,
        } = queue.shift();

        if (value(location, grid) === 27) {
            console.log(`iterations: ${iterations}`);
            return path;
        }

        const priority = [];

        for(const direction of ["up", "down", "left", "right"]) {
            const nextCoords = move(location, direction);
            if(nextCoords && !visited[nextCoords]) {
                visited[nextCoords] = true;
                priority.push({
                    location: nextCoords,
                    path: [...path, direction]
                });
            }
        }

        priority
            .sort((a, b) => value(b.location, grid) - value(a.location, grid))
            .forEach(p => queue.push(p));

    }
    return false;
}

function overlayPathFromStartingCoordinate (coord, path, grid) {
    const move = validMove(grid);
    if(path.length === 0) {
        return grid;
    }
    const direction = path.shift();
    let symbol = '>';
    switch(direction) {
        case "up":
            symbol = '^';
            break;
        case "down":
            symbol = 'v';
            break;
        case "left":
            symbol = "<";
            break;
        default:
    }

    grid[coord[0]][coord[1]] = symbol;
    coord = move(coord, direction);

    if(!coord) {
        throw new Error("Invalid move")
    }

    return overlayPathFromStartingCoordinate(coord, path, grid)
}

data = (model(input_real))

solution = search(data);

console.log(solution, solution.length)

overlay = overlayPathFromStartingCoordinate(findCoordinate(0, data), solution, data);
console.log(overlay.map(o => o.map(c => letter(c)).join('')).join('\n'));



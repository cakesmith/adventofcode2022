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

search = grid => {
    // Breadth first search
    const move = validMove(grid);
    const home = findCoordinate(0, grid)
    const queue = [{
        location: home,
        path: [],
        visited: {}
    }];

    while(queue.length > 0) {

        const {
            location,
            path,
            visited
        } = queue.shift();

        for(const direction of ["up", "down", "left", "right"]) {

            const nextCoords = move(location, direction);

            if(nextCoords) {

                if (value(nextCoords, grid) === 27) {
                    return [...path, direction];
                }

                if (!visited[nextCoords]) {
                    visited[nextCoords] = true;
                    queue.push({
                        visited,
                        location: nextCoords,
                        path: [...path, direction]
                    });
                }
            }
        }
    }
    return false;
}

solution_real = search(model(input_real));
// solution_demo = search(model(input_demo));

console.log(solution_real, solution_real.length)
// console.log(solution_demo, solution_demo.length)



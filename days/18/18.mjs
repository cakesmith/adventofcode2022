// const input = "1,1,1\n2,1,1"
// import input from './input_demo.js'
import input from './input_real.js'

const model = input.split('\n').map(n => n.split(',').map(x => parseInt(x)));

const largest = i => arr => arr.sort((a, b) => b[i] - a[i])[0][i]

const neighbors = (a,b) => Math.abs(a-b) === 1

const adjacent = (a,b) => {
    let adj = 0;
    let eq  = 0;
    for(let i = 0; i < a.length; i++) {
        if(neighbors(a[i], b[i])) {
            adj++;
        }
        if(a[i] === b[i]) {
            eq++;
        }
    }
    return adj === 1 && eq === a.length - 1;
}

const eq = (a,b) => {
    for(let i = 0; i < a.length; i++) {
        if(b[i] !== a[i]) {
            return false;
        }
    }
    return true;
}

const add = (a, b) => a.map((v,i) => v + b[i])

{
    console.log('Part A');
    let surfaceArea = 0;
    for (let x = 0; x <= largest(0)(model); x++) {
        for (let y = 0; y <= largest(1)(model); y++) {
            for (let z = 0; z <= largest(2)(model); z++) {
                for (const point of model) {
                    if (eq(point, [x, y, z])) {
                        surfaceArea += 6;
                        for (const other of model) {
                            if (adjacent(point, other)) {
                                surfaceArea -= 1;
                            }
                        }
                    }
                }

            }
        }
    }
    console.log(surfaceArea);
}

{
    console.log('Part B');
    let surfaceArea = 0;

    let queue = [[0,0,0]];

    const visited = {};

    while(queue.length > 0) {
        const point = queue.shift();
        if(visited[point]) {
            continue;
        }
        visited[point] = true;

        direction:
        for(const direction of [
            [-1, 0, 0], [1, 0, 0],
            [0, -1, 0], [0, 1, 0],
            [0, 0, -1], [0, 0, 1]
        ]) {
            const neighbor = add(point, direction);

            for(let i = 0; i < neighbor.length; i++) {
                if(neighbor[i] < -1 || neighbor[i] > largest(i)(model) + 1) {
                    continue direction;
                }
            }

            if(model.some(m => eq(m,neighbor))) {
                surfaceArea++;
            } else {
                queue.push(neighbor);
            }
        }
    }

    console.log(surfaceArea);
}


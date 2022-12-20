import input from "./input_demo.js";
// import input from "./input_real.js";

const blueprints = input.split('\n').map(blueprint => {
    const matches = blueprint.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./)
    const [_,
        id,
        oreRobotCost,
        clayRobotCost,
        obsidianRobotCostOre,
        obsidianRobotCostClay,
        geodeRobotCostOre,
        geodeRobotCostObsidian
    ] = matches.map(m => parseInt(m));
    return {
        id,
        oreRobotCost,
        clayRobotCost,
        obsidianRobotCostOre,
        obsidianRobotCostClay,
        geodeRobotCostOre,
        geodeRobotCostObsidian
    }
});

const winner = {
    id: 0,
    geodesCracked: 0
}

for(const {
    id,
    oreRobotCost,
    clayRobotCost,
    obsidianRobotCostOre,
    obsidianRobotCostClay,
    geodeRobotCostOre,
    geodeRobotCostObsidian
} of blueprints) {

    const queue = [{
        oreRobots: 1,
        oreCollected: 0,
        clayRobots: 0,
        clayCollected: 0,
        obsidianRobots: 0,
        obsidianCollected: 0,
        geodeRobots: 0,
        geodesCracked: 0
    }]

    let minute = 0;

    while(queue > 0) {
        minute++;
        if(minute > 24) {
            break;
        }

        const now = queue.shift();

        const next = {
            parent: now,
            oreCollected: now.oreCollected + now.oreRobots,
            clayCollected: now.clayCollected + now.clayRobots,
            obsidianCollected: now.obsidianCollected + now.obsidianRobots,
            geodesCracked: now.geodesCracked + now.geodeRobots
        }

    }




}

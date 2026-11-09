const { spawn } = require('child_process');

function direction(bx, by, tx, ty) {
    let s = '';
    if (ty < by) s += 'U';
    else if (ty > by) s += 'D';
    if (tx > bx) s += 'R';
    else if (tx < bx) s += 'L';
    return s;
}

function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function play(solution, W, H, N, x0, y0, tx, ty, timeoutMs) {
    return new Promise((resolve) => {
        const child = spawn(process.execPath, ['runner.js', solution], {
            stdio: ['pipe', 'pipe', 'ignore'],
            cwd: __dirname,
        });
        let buffer = '';
        let turn = 0;
        let x = x0, y = y0;
        let finished = false;

        const finish = (result) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            try { child.kill('SIGKILL'); } catch (e) { /* already gone */ }
            resolve(result);
        };

        const timer = setTimeout(
            () => finish({ win: false, turns: turn, reason: 'timeout' }),
            timeoutMs
        );

        const nextTurn = () => {
            if (x === tx && y === ty) return finish({ win: true, turns: turn, reason: 'found' });
            if (turn >= N) return finish({ win: false, turns: turn, reason: 'out of jumps' });
            child.stdin.write(direction(x, y, tx, ty) + '\n');
        };

        child.stdout.on('data', (chunk) => {
            buffer += chunk.toString();
            let nl;
            while ((nl = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, nl).trim();
                buffer = buffer.slice(nl + 1);
                if (!line || finished) continue;

                const parts = line.split(/\s+/).map(Number);
                if (parts.length !== 2 || parts.some((n) => !Number.isInteger(n))) {
                    return finish({ win: false, turns: turn, reason: `bad output "${line}"` });
                }

                const [nx, ny] = parts;
                if (nx < 0 || nx >= W || ny < 0 || ny >= H) {
                    return finish({ win: false, turns: turn, reason: `out of bounds ${nx} ${ny}` });
                }

                x = nx;
                y = ny;
                turn++;
                nextTurn();
            }
        });

        child.on('exit', () => {
            if (!finished) finish({ win: false, turns: turn, reason: 'process exited early' });
        });

        child.stdin.write(`${W} ${H}\n${N}\n${x0} ${y0}\n`);
        nextTurn();
    });
}

async function main() {
    const [solution, W, H, N, games, seedArg] = process.argv.slice(2);
    if (!solution || !W || !H || !N || !games) {
        console.error('usage: node sim.js <solution.js> <W> <H> <N> <games> [seed]');
        process.exit(2);
    }

    const width = Number(W);
    const height = Number(H);
    const jumps = Number(N);
    const total = Number(games);
    const seed = Number(seedArg || 1);
    const rand = mulberry32(seed);

    let wins = 0;
    let worst = 0;
    const failures = [];

    for (let g = 0; g < total; g++) {
        const x0 = Math.floor(rand() * width);
        const y0 = Math.floor(rand() * height);
        const tx = Math.floor(rand() * width);
        const ty = Math.floor(rand() * height);

        const result = await play(solution, width, height, jumps, x0, y0, tx, ty, 3000);

        if (result.win) {
            wins++;
            worst = Math.max(worst, result.turns);
        } else {
            failures.push(
                `  game ${g}: ${width}x${height} N=${jumps} start=(${x0},${y0}) target=(${tx},${ty}) ` +
                `-> ${result.reason} after ${result.turns} jumps`
            );
        }
    }

    if (failures.length) {
        console.log(failures.slice(0, 10).join('\n'));
        if (failures.length > 10) console.log(`  ... ${failures.length - 10} more`);
    }

    console.log(`${wins}/${total} wins, worst case ${worst} jumps (budget ${jumps})`);
    process.exit(wins === total ? 0 : 1);
}

main();

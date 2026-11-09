const fs = require('fs');

const code = fs.readFileSync(process.argv[2], 'utf8');

process.stdout.write = function (chunk, encoding, callback) {
    fs.writeSync(1, chunk);
    if (typeof encoding === 'function') encoding();
    else if (typeof callback === 'function') callback();
    return true;
};

let buffer = '';
let cursor = 0;

global.readline = function () {
    for (;;) {
        const nl = buffer.indexOf('\n', cursor);
        if (nl !== -1) {
            const line = buffer.slice(cursor, nl);
            cursor = nl + 1;
            return line.replace(/\r$/, '');
        }

        const chunk = Buffer.allocUnsafe(65536);
        let n;
        try {
            n = fs.readSync(0, chunk, 0, chunk.length, null);
        } catch (e) {
            n = 0;
        }

        if (n === 0) {
            if (cursor >= buffer.length) return null;
            const rest = buffer.slice(cursor);
            cursor = buffer.length;
            return rest.replace(/\r$/, '');
        }

        buffer += chunk.toString('utf8', 0, n);
    }
};

eval(code);

var inputs = readline().split(' ');
const W = parseInt(inputs[0]);
const H = parseInt(inputs[1]);
const N = parseInt(readline());

var inputs = readline().split(' ');
let X0 = parseInt(inputs[0]);
let Y0 = parseInt(inputs[1]);

let minX = 0;
let maxX = W - 1;
let minY = 0;
let maxY = H - 1;

while (true) {
    const bombDir = readline();

    if (bombDir.includes('U')) {
        maxY = Y0 - 1;
    } else if (bombDir.includes('D')) {
        minY = Y0 + 1;
    }

    if (bombDir.includes('L')) {
        maxX = X0 - 1;
    } else if (bombDir.includes('R')) {
        minX = X0 + 1;
    }

    X0 = Math.floor((minX + maxX) / 2);
    Y0 = Math.floor((minY + maxY) / 2);

    console.log(X0 + ' ' + Y0);
}

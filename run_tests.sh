#!/bin/bash
cd "$(dirname "$0")"
echo "--- small building (10x10, 6 jumps)"
node sim.js solution.js 10 10 6 200 1
echo "--- large building (10000x10000, 100 jumps)"
node sim.js solution.js 10000 10000 100 200 2
echo "--- tower (1x10000, 100 jumps)"
node sim.js solution.js 1 10000 100 100 3
echo "--- narrow corridor (10000x1, 100 jumps)"
node sim.js solution.js 10000 1 100 100 4
echo "--- tight budget (100x100, 8 jumps)"
node sim.js solution.js 100 100 8 200 5

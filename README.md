# Shadows of the Knight — Episode 1

[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A514-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Status](https://img.shields.io/badge/status-in%20progress-orange)]()

Batman has to reach the hostages by grappling from window to window, with a limited
number of jumps. Each turn a heat-signature device tells him which **direction** the
bomb is in — the program must decide where to jump next.

This repository holds the solution plus a local judge that plays the game against it,
so the algorithm can be tested without the CodinGame IDE.

---

## The game

A building is a `W × H` grid of windows, `(0,0)` being the top-left corner.

Each turn the program receives one of eight directions:

```
U  UR  R  DR  D  DL  L  UL
```

and must print the next window to jump to:

```
X Y
```

The jump budget `N` is fixed at the start. The run is won when a jump lands exactly
on the hostages' window.

The hostages' position is not given — it is only revealed through the directions.
With `W, H ≤ 10000` and `N ≤ 100`, a linear walk cannot succeed: the search has to
cut the remaining area aggressively every turn.

---

## Local judge — `sim.js`

`sim.js` is the opponent. It picks a random target, starts Batman at a random window,
feeds the direction for the current turn, validates every answer and stops when the
target is reached, the budget is exhausted, or the program crashes.

```bash
node sim.js solution.js <W> <H> <N> <games> [seed]
```

| argument | meaning |
|:--------:|---------|
| `solution.js` | the program under test |
| `W H` | building size |
| `N` | jump budget |
| `games` | how many random games to play |
| `seed` | optional, makes the random targets reproducible |

The seed is fixed in `run_tests.sh`, so a failure is always reproducible.

`runner.js` is a small shim that provides CodinGame's synchronous `readline()` and
an unbuffered `stdout`, which is what makes the interactive protocol work locally.

### Run everything

```bash
./run_tests.sh
```

Five scenarios: a small building, the full `10000 × 10000` building, a one-column
tower, a one-row corridor, and a tight budget.

---

## Plan

- [x] project scaffold — puzzle statement, local judge, runner shim
- [ ] step 1 — read the direction and jump one window towards the target
- [ ] step 2 — track the remaining search area instead of the whole building
- [ ] step 3 — bisect the search area every turn
- [ ] step 4 — handle the exact-row / exact-column cases
- [ ] step 5 — validate on all five scenarios

Each step is its own commit, so the history shows how the algorithm grew.

---

## Author

**Abdelhakim Baalla**

- GitHub: [https://github.com/Abdelhakim-Baalla](https://github.com/Abdelhakim-Baalla)

## License

Released under the [MIT License](./LICENSE).

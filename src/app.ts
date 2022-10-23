import color from 'chalk';
import { readFile } from 'fs';
import { performance } from 'perf_hooks';
import { argv } from 'process';

export default function calculateWaterAmount(landscape: number[]): number {
  if (!Array.isArray(landscape) || landscape.length <= 2) return 0;

  let _it = 1;
  let _result = 0;
  let lastHighestPeek: { position: number; value: number } = { position: 0, value: landscape[0] };
  let nextHighestPeek: number | undefined = undefined;

  // two or Less points cannot make a basin.

  while (_it !== landscape.length) {
    if (!nextHighestPeek) {
      // move to the highest peek (initial peek or next iterations) until we go into first basin/decent
      if (landscape[_it] > lastHighestPeek.value) {
        lastHighestPeek = { position: _it, value: landscape[_it] };
        _it++;
        continue;
      }

      // find next closest peek to previous one
      nextHighestPeek = findClosestMax(
        landscape.slice(_it, landscape.length).sort((a, b) => a - b),
        lastHighestPeek.value
      );
    }

    if (landscape[_it] >= nextHighestPeek) {
      const _maybeBasin = landscape.slice(lastHighestPeek.position, _it + 1);

      //in case we are in decent from top peek  we skip downward steps until we reach edge of next basin
      if (_maybeBasin.length > 2) {
        _result += calculatesWaterFill(_maybeBasin, Math.min(lastHighestPeek.value, landscape[_it]));
      }

      lastHighestPeek = { position: _it, value: landscape[_it] };
      nextHighestPeek = undefined;
    }

    _it++;
  }

  return _result;
}

/**
 *  Returns the closest maximum number to comparer if lower
 *
 * @param arr - sorted array of numbers
 * @param comparer - value to compare
 * @returns closest max value
 */
function findClosestMax(arr: number[], comparer: number): number {
  if (arr.length === 1) return arr[0];
  if (comparer <= arr[Math.floor(arr.length / 2)]) return comparer;

  return findClosestMax(
    comparer > arr[Math.floor(arr.length / 2)]
      ? arr.slice(Math.floor(arr.length / 2), arr.length)
      : arr.slice(0, Math.floor(arr.length / 2)),
    comparer
  );
}

/**
 *  Calculates water fill of the reservoir
 *
 * @param arr -  array of inner reservoir peeks
 * @param height - height of reservoir
 * @returns amount of water
 */
function calculatesWaterFill(arr: number[], height: number): number {
  return height * arr.length - arr.reduce((a, num, idx) => a + (idx === 0 || idx === arr.length - 1 ? height : num), 0);
}

(async function process() {
  if (argv[2] === '-f') {
    readFile(argv[3], (err, data) => {
      if (err) {
        console.log(`${color.red('Error: ' + err)}`);
      }

      const tasks = data.toString().split(/\r?\n/);

      tasks.forEach((task, idx) => {
        const load = task.split(',').map(i => +i.trim());
        //  console.time(`Task: ${idx + 1}`);
        const startTime = performance.now();
        const result = calculateWaterAmount(load);
        const endTime = performance.now();

        console.log(color.green(`Task: ${idx + 1} done, Result: ${result} cubes of water, Performed in ${endTime - startTime}ms`));
      });
    });
  } else if (argv[2] === '-arr') {
    const load = argv[3].split(',').map(i => +i.trim());
    const startTime = performance.now();
    const result = calculateWaterAmount(load);
    const endTime = performance.now();

    console.log(color.green(`Task done, Result: ${result} cubes of water, Performed in ${endTime - startTime}ms`));
  } else {
    console.log(`${color.yellow('Please use either -f or -arr flags to provide task load')}`);
  }
})();

// console.log(`Expected 9. Received: ${color.green(calculateWaterAmount([5, 2, 3, 4, 5, 4, 0, 3, 1]))}`);
// console.log(`Expected 0. Received: ${color.green(calculateWaterAmount([2, 3, 4, 5, 4, 3, 1]))}`);
// console.log(`Expected 1. Received: ${color.green(calculateWaterAmount([2, 3, 4, 5, 4, 5, 1]))}`);
// console.log(`Expected 11. Received: ${color.green(calculateWaterAmount([5, 2, 3, 4, 6, 5, 0, 3, 4]))}`);

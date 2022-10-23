import { describe, expect, test } from '@jest/globals';
import calculateWaterAmount from './app';

describe('WaterPools', () => {
  test('should return 0 when erroneous data provided', () => {
    expect(calculateWaterAmount((undefined as unknown) as number[])).toEqual(0);
  });

  test('should return 0 when only 2 points provided', () => {
    expect(calculateWaterAmount([1, 2])).toEqual(0);
  });

  test('should return 0 when there is a mountain peek but no pockets ie changes of heights', () => {
    expect(calculateWaterAmount([2, 3, 4, 5, 4, 3, 1])).toEqual(0);
  });

  test('original task of normal complexity from the paper', () => {
    expect(calculateWaterAmount([5, 2, 3, 4, 5, 4, 0, 3, 1])).toEqual(9);
  });

  test('downhill from highest peak until u reach edge of the basin ', () => {
    expect(calculateWaterAmount([5, 2, 3, 4, 6, 5, 0, 3, 4])).toEqual(11);
  });
});

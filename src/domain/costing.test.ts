import { describe, expect, it } from 'vitest';
import { orderVariance, quoteFromMargin, sumCostBuckets } from './costing';

describe('costing calculations', () => {
  it('sums all model cost buckets into a complete unit cost', () => {
    expect(sumCostBuckets({ material: 6840.65, labor: 1452, outsource: 1023.5, overhead: 1836.35 })).toBe(11152.5);
  });

  it('calculates suggested quote from target margin', () => {
    expect(quoteFromMargin(11152.5, 0.18)).toBeCloseTo(13600.61, 2);
  });

  it('calculates order actual-versus-standard variance', () => {
    expect(orderVariance(120000, 126000)).toEqual({ amount: 6000, rate: 0.05 });
  });
});

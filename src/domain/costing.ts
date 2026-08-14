export type CostBuckets = {
  material: number;
  labor: number;
  outsource: number;
  overhead: number;
};

export const sumCostBuckets = (buckets: CostBuckets) =>
  buckets.material + buckets.labor + buckets.outsource + buckets.overhead;

export const quoteFromMargin = (cost: number, margin: number) => {
  if (margin < 0 || margin >= 1) return null;
  return cost / (1 - margin);
};

export const orderVariance = (standard: number, actual: number) => ({
  amount: actual - standard,
  rate: standard === 0 ? 0 : (actual - standard) / standard,
});

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

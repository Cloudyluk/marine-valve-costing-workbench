import type { CostBuckets } from '../domain/costing';
import { formatCurrency, sumCostBuckets } from '../domain/costing';

const parts = [{ key: 'material', label: '材料成本', color: '#0969da' }, { key: 'labor', label: '直接人工', color: '#0f766e' }, { key: 'outsource', label: '外协与质量', color: '#0789a6' }, { key: 'overhead', label: '制造费用', color: '#153e66' }] as const;

export function CostBar({ buckets }: { buckets: CostBuckets }) {
  const total = sumCostBuckets(buckets);
  return <section className="cost-composition"><div className="section-title">成本构成（RMB）</div><div className="cost-bar">{parts.map((part) => <div key={part.key} style={{ width: `${(buckets[part.key] / total) * 100}%`, background: part.color }}><strong>{part.label}</strong><span>{formatCurrency(buckets[part.key])}（{((buckets[part.key] / total) * 100).toFixed(2)}%）</span></div>)}</div><div className="bar-total"><span>总成本</span><strong>{formatCurrency(total)}</strong></div></section>;
}

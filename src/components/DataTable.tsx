import type { CostLine } from '../data/sampleData';
import { formatCurrency } from '../domain/costing';

export function DataTable({ title, lines, kind }: { title: string; lines: CostLine[]; kind: 'material' | 'labor' | 'outsource' | 'overhead' }) {
  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  const first = kind === 'material' ? '物料编码' : kind === 'labor' ? '工序编码' : '序号';
  return <section className="data-panel"><h3>{title}</h3><div className="table-wrap"><table><thead><tr><th>序号</th><th>{first}</th><th>{kind === 'labor' ? '工序名称' : '项目名称'}</th><th>{kind === 'outsource' ? '供应商' : '规格/说明'}</th><th>单位</th><th>数量</th><th>金额（RMB）</th></tr></thead><tbody>{lines.map((line, index) => <tr key={`${line.code}-${index}`}><td>{index + 1}</td><td>{line.code}</td><td>{line.name}</td><td>{line.supplier ?? line.detail}</td><td>{line.unit ?? '项'}</td><td>{line.qty ?? '-'}</td><td>{formatCurrency(line.amount)}</td></tr>)}</tbody><tfoot><tr><td colSpan={6}>小计</td><td>{formatCurrency(total)}</td></tr></tfoot></table></div><footer>共 {lines.length} 行 <button>查看全部</button></footer></section>;
}

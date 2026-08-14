export type ImportedModel = {
  id: string;
  model: string;
  version: string;
  status: string;
  material: number;
  labor: number;
  outsource: number;
  overhead: number;
  margin: number;
};

export const MODEL_CSV_HEADERS = ['产品型号', '成本版本', '状态', '材料成本', '直接人工', '外协与质量', '制造费用', '目标毛利率'];

const numberOf = (value: string) => Number(value.replace(/[,%]/g, '').trim()) / (value.includes('%') ? 100 : 1);

export const parseModelCsv = (text: string): { ok: true; records: ImportedModel[] } | { ok: false; error: string } => {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const headers = lines[0]?.split(',').map((item) => item.trim()) ?? [];
  const missing = MODEL_CSV_HEADERS.filter((header) => !headers.includes(header));
  if (missing.length) return { ok: false, error: `缺少必填列：${missing.join('、')}` };
  const positions = Object.fromEntries(headers.map((header, index) => [header, index]));
  try {
    const records = lines.slice(1).map((line, rowIndex) => {
      const values = line.split(',').map((item) => item.trim());
      const value = (header: string) => values[positions[header]] ?? '';
      const numeric = ['材料成本', '直接人工', '外协与质量', '制造费用', '目标毛利率'].map((header) => numberOf(value(header)));
      if (numeric.some((item) => Number.isNaN(item)) || numeric[4] < 0 || numeric[4] >= 1) throw new Error(`第 ${rowIndex + 2} 行数值或毛利率无效`);
      return { id: `${value('产品型号')}-${value('成本版本')}`, model: value('产品型号'), version: value('成本版本'), status: value('状态'), material: numeric[0], labor: numeric[1], outsource: numeric[2], overhead: numeric[3], margin: numeric[4] };
    });
    return records.length ? { ok: true, records } : { ok: false, error: '未发现可导入的数据行' };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : '导入失败' }; }
};

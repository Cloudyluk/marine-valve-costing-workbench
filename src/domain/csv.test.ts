import { describe, expect, it } from 'vitest';
import { parseModelCsv } from './csv';

const validHeaderAndRow = '产品型号,成本版本,状态,材料成本,直接人工,外协与质量,制造费用,目标毛利率\nLNG-DN50-PN40,V2026.08,已审核,6840.65,1452,1023.5,1836.35,18%';

describe('model cost CSV import', () => {
  it('rejects files missing required fields', () => {
    expect(parseModelCsv('产品型号,成本版本,材料成本\nLNG-DN50-PN40,V2026.08,6840.65').ok).toBe(false);
  });

  it('parses a valid Chinese-header cost row', () => {
    const result = parseModelCsv(validHeaderAndRow);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.records[0]).toMatchObject({ model: 'LNG-DN50-PN40', version: 'V2026.08', material: 6840.65, margin: 0.18 });
  });

  it('keeps current data safe when a CSV row contains an invalid margin', () => {
    expect(parseModelCsv(validHeaderAndRow.replace('18%', '120%'))).toEqual({ ok: false, error: '第 2 行数值或毛利率无效' });
  });
});

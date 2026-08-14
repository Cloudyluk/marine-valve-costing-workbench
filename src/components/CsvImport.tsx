import { useRef, useState } from 'react';
import { parseModelCsv } from '../domain/csv';

export function CsvImport({ onImport }: { onImport: (records: ReturnType<typeof parseModelCsv> extends { records: infer T } ? T : never) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  return <><button className="import-button" onClick={() => input.current?.click()}>⇧ 导入 CSV</button><input ref={input} className="visually-hidden" type="file" accept=".csv,text/csv" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const result = parseModelCsv(await file.text()); if (result.ok) { onImport(result.records as never); setMessage(`已导入 ${result.records.length} 个成本版本（仅当前浏览会话）`); } else setMessage(result.error); event.target.value = ''; }} />{message && <div className="toast" role="status">{message}</div>}</>;
}

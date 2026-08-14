# 船用低温阀门成本核算工作台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub Pages-ready static workbench that compares approved product-version costs with actual order execution costs and preserves order version changes.

**Architecture:** A Vite + React single-page app keeps model-version and order-execution datasets separate, with pure calculation and CSV parsing helpers. The app shell provides a shared header, a two-mode side navigation, and responsive detail pages that recalculate all displayed totals from data.

**Tech Stack:** React, TypeScript, Vite, Vitest, CSS, GitHub Actions Pages.

## Global Constraints

- UI copy is Simplified Chinese and currency is RMB.
- Site must be client-only and deploy under any GitHub Pages base path.
- CSV import is local-only and must not overwrite data after a validation failure.
- Model-version and order-execution costs are separate views; orders retain initial and current version references.
- The visual system follows the accepted reference: white canvas, navy and engineering-blue typography, thin borders, restrained square-cornered data tables.

---

### Task 1: Scaffold and calculation domain

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/domain/costing.ts`
- Create: `src/domain/costing.test.ts`

**Interfaces:**
- Produces `sumCostBuckets`, `quoteFromMargin`, `orderVariance`, and `formatCurrency` helpers.

- [ ] **Step 1: Write the failing calculation tests**

```ts
expect(sumCostBuckets({ material: 6840.65, labor: 1452, outsource: 1023.5, overhead: 1836.35 })).toBe(11152.5);
expect(quoteFromMargin(11152.5, 0.18)).toBeCloseTo(13600.61, 2);
expect(orderVariance(120000, 126000)).toEqual({ amount: 6000, rate: 0.05 });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/domain/costing.test.ts`
Expected: FAIL because the costing module does not exist.

- [ ] **Step 3: Implement the calculation helpers**

```ts
export const sumCostBuckets = (buckets: CostBuckets) => buckets.material + buckets.labor + buckets.outsource + buckets.overhead;
export const quoteFromMargin = (cost: number, margin: number) => cost / (1 - margin);
export const orderVariance = (standard: number, actual: number) => ({ amount: actual - standard, rate: standard ? (actual - standard) / standard : 0 });
```

- [ ] **Step 4: Re-run the test**

Run: `npm test -- --run src/domain/costing.test.ts`
Expected: PASS.

### Task 2: Data model and CSV import validation

**Files:**
- Create: `src/data/sampleData.ts`
- Create: `src/domain/csv.ts`
- Create: `src/domain/csv.test.ts`

**Interfaces:**
- Consumes calculation helpers.
- Produces typed sample model versions, production orders, version changes, and `parseModelCsv(text)`.

- [ ] **Step 1: Write failing CSV tests**

```ts
expect(parseModelCsv('产品型号,成本版本,材料成本\nLNG-DN50-PN40,V2026.08,6840.65').ok).toBe(false);
expect(parseModelCsv(validHeaderAndRow).ok).toBe(true);
```

- [ ] **Step 2: Run the CSV test to verify it fails**

Run: `npm test -- --run src/domain/csv.test.ts`
Expected: FAIL because the CSV parser does not exist.

- [ ] **Step 3: Implement fixed-header CSV validation and seed data**

```ts
export const MODEL_CSV_HEADERS = ['产品型号', '成本版本', '状态', '材料成本', '直接人工', '外协与质量', '制造费用', '目标毛利率'];
```

- [ ] **Step 4: Re-run the CSV test**

Run: `npm test -- --run src/domain/csv.test.ts`
Expected: PASS.

### Task 3: Build the interactive workbench

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/components/CostBar.tsx`
- Create: `src/components/DataTable.tsx`
- Create: `src/components/ModelView.tsx`
- Create: `src/components/OrderView.tsx`
- Create: `src/components/CsvImport.tsx`

**Interfaces:**
- Consumes typed sample data, CSV parser, and calculation helpers.
- Produces a responsive two-mode app: model cost and order execution.

- [ ] **Step 1: Write a failing app interaction test**

```tsx
render(<App />);
await user.click(screen.getByRole('button', { name: '订单执行' }));
expect(screen.getByText('订单执行成本')).toBeInTheDocument();
```

- [ ] **Step 2: Run the interaction test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL because the app has not been implemented.

- [ ] **Step 3: Implement the app shell, both modes, filters, model/ordering selection, CSV import and version-change timeline**

```tsx
const [mode, setMode] = useState<'model' | 'order'>('model');
return mode === 'model' ? <ModelView /> : <OrderView />;
```

- [ ] **Step 4: Re-run the interaction test**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS.

### Task 4: GitHub Pages deployment and operating guide

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Create: `README.md`
- Create: `public/产品成本版本导入模板.csv`

**Interfaces:**
- Consumes the Vite build output.
- Produces a GitHub Pages deployment workflow and field-level Feishu Bitable setup guidance.

- [ ] **Step 1: Configure Pages build and deployment**

```yaml
on:
  push:
    branches: [main]
permissions:
  pages: write
  id-token: write
```

- [ ] **Step 2: Write operating documentation**

Document local run, GitHub repository creation, Pages enablement, CSV columns, and the nine linked Feishu tables.

- [ ] **Step 3: Build the production site**

Run: `npm run build`
Expected: PASS and generate `dist/`.

### Task 5: Visual and functional verification

**Files:**
- Modify: `src/styles.css` only if visual QA finds a concrete mismatch.

- [ ] **Step 1: Run all unit tests and production build**

Run: `npm test -- --run && npm run build`
Expected: PASS with no failing tests and a generated production bundle.

- [ ] **Step 2: Verify in a browser**

Check the model view, switch to order view, select an order, toggle standard baseline, upload valid and invalid CSVs, then inspect desktop and mobile layouts.

- [ ] **Step 3: Compare screenshots against the accepted concept**

Inspect the accepted concept and fresh implementation screenshot with `view_image`; check copy, data density, true-white background, navy/blue palette, table borders, tabs and mobile behavior.

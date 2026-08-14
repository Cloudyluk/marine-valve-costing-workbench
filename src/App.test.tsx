import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

describe('costing workbench', () => {
  afterEach(cleanup);
  it('switches from model costs to order execution', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '订单执行' }));
    expect(screen.getByRole('heading', { name: /订单执行成本/ })).toBeInTheDocument();
    expect(screen.getByText('SO-202608-001')).toBeInTheDocument();
  });

  it('calculates a USD quotation from the RMB cost base and selected exchange inputs', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '美元报价' }));
    expect(screen.getByText(/USD 建议报价/)).toBeInTheDocument();
    expect(screen.getByLabelText('报价汇率')).toHaveValue(7.25);
  });
});

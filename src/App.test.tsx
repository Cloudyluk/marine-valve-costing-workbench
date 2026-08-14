import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('costing workbench', () => {
  it('switches from model costs to order execution', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '订单执行' }));
    expect(screen.getByRole('heading', { name: /订单执行成本/ })).toBeInTheDocument();
    expect(screen.getByText('SO-202608-001')).toBeInTheDocument();
  });
});

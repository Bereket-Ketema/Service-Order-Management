import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderProvider } from '../context/OrderContext';
import OrdersPage from '../pages/OrdersPage';

describe('OrdersPage', () => {
  it('renders order list headers', () => {
    render(
      <OrderProvider>
        <OrdersPage />
      </OrderProvider>
    );
    expect(screen.getByText('Service Orders')).toBeInTheDocument();
  });
});
// @ts-expect-error - @testing-library/react can be resolved by the test runner in this project setup
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { OrdersPage } from '../pages/OrdersPage';

describe('OrdersPage', () => {
  it('renders order list and allows selecting rows', async () => {
    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    // Initial loading state
    expect(screen.getByText(/loading service orders/i)).toBeInTheDocument();

    // Wait for mock data
    await waitFor(() => {
      expect(screen.getByText('SO-2024-001')).toBeInTheDocument();
    });

    // Select single row
    const checkbox = screen.getByLabelText('Select order SO-2024-001');
    fireEvent.click(checkbox);

    expect(screen.getByText('1 Selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark completed/i })).toBeInTheDocument();
  });

  it('filters orders by search term', async () => {
    render(
      <MemoryRouter>
        <OrdersPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('SO-2024-001')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by order/i);
    fireEvent.change(searchInput, { target: { value: 'Starlight' } });

    await waitFor(() => {
      expect(screen.queryByText('SO-2024-001')).not.toBeInTheDocument();
      expect(screen.getByText('SO-2024-002')).toBeInTheDocument();
    });
  });
});
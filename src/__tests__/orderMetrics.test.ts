import { describe, it, expect } from 'vitest';
import { computeOrderAnalytics } from '../lib/orderMetrics';
import { ServiceOrder } from '../types/order';

const MOCK_DATA: ServiceOrder[] = [
  {
    id: '1',
    orderNumber: 'SO-1',
    customerName: 'Customer A',
    customerEmail: 'a@test.com',
    status: 'completed',
    priority: 'high',
    createdAt: '2024-01-01',
    dueDate: '2024-01-10',
    items: [{ id: 'i1', description: 'Item 1', hours: 2, rate: 100 }],
  },
  {
    id: '2',
    orderNumber: 'SO-2',
    customerName: 'Customer B',
    customerEmail: 'b@test.com',
    status: 'pending',
    priority: 'low',
    createdAt: '2024-01-02',
    dueDate: '2024-01-12',
    items: [{ id: 'i2', description: 'Item 2', hours: 5, rate: 80 }],
  },
];

describe('computeOrderAnalytics', () => {
  it('correctly tallies counts and financial totals', () => {
    const metrics = computeOrderAnalytics(MOCK_DATA);
    expect(metrics.totalOrders).toBe(2);
    expect(metrics.completedCount).toBe(1);
    expect(metrics.pendingCount).toBe(1);
    expect(metrics.totalRevenue).toBe(600);
    expect(metrics.averageOrderValue).toBe(300);
  });

  it('returns zeroes for empty collections', () => {
    const emptyMetrics = computeOrderAnalytics([]);
    expect(emptyMetrics.totalOrders).toBe(0);
    expect(emptyMetrics.totalRevenue).toBe(0);
  });
});

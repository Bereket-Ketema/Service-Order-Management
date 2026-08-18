import { ServiceOrder } from '../types/order';

export interface OrderAnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  averageOrderValue: number;
}

export function computeOrderAnalytics(orders: ServiceOrder[]): OrderAnalyticsSummary {
  const totalOrders = orders.length;
  if (totalOrders === 0) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      cancelledCount: 0,
      averageOrderValue: 0,
    };
  }

  let totalRevenue = 0;
  let pendingCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;
  let cancelledCount = 0;

  for (const order of orders) {
    const orderCost = order.items.reduce((sum, item) => sum + item.hours * item.rate, 0);
    totalRevenue += orderCost;

    if (order.status === 'pending') pendingCount++;
    else if (order.status === 'in_progress') inProgressCount++;
    else if (order.status === 'completed') completedCount++;
    else if (order.status === 'cancelled') cancelledCount++;
  }

  return {
    totalOrders,
    totalRevenue,
    pendingCount,
    inProgressCount,
    completedCount,
    cancelledCount,
    averageOrderValue: Math.round(totalRevenue / totalOrders),
  };
}

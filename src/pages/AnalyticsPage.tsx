import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { computeOrderAnalytics, OrderAnalyticsSummary } from '../lib/orderMetrics';
import { formatCurrency } from '../lib/formatters';
import { DollarSign, ClipboardList, CheckCircle, Clock } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<OrderAnalyticsSummary | null>(null);

  useEffect(() => {
    orderService.getOrders().then((orders) => {
      setMetrics(computeOrderAnalytics(orders));
    });
  }, []);

  if (!metrics) {
    return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;
  }

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(metrics.totalRevenue), icon: DollarSign },
    { label: 'Total Orders', value: metrics.totalOrders, icon: ClipboardList },
    { label: 'In Progress', value: metrics.inProgressCount, icon: Clock },
    { label: 'Completed', value: metrics.completedCount, icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-sm text-muted-foreground">High-level financial summaries and operational volume.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="p-6 bg-card border rounded-lg shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">{card.label}</span>
                <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

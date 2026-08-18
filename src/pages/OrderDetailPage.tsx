import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { ServiceOrder } from '../types/order';
import { formatCurrency, formatDate, formatHours } from '../lib/formatters';
import { PriorityBadge } from '../components/PriorityBadge';
import { Button } from '../components/ui/button';
import { ArrowLeft, User, Calendar, FileText } from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    orderService.getOrderById(id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link to="/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const grandTotal = order.items.reduce((acc, itm) => acc + itm.hours * itm.rate, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-lg border shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <PriorityBadge priority={order.priority} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">Created on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border bg-card space-y-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" aria-hidden="true" /> Customer Information
          </h2>
          <div className="text-sm space-y-1">
            <p className="font-medium">{order.customerName}</p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
          </div>
        </div>

        <div className="p-6 rounded-lg border bg-card space-y-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" aria-hidden="true" /> Schedule & Deadline
          </h2>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">Due Date: <span className="font-medium text-foreground">{formatDate(order.dueDate)}</span></p>
            <p className="text-muted-foreground capitalize">Status: <span className="font-medium text-foreground">{order.status.replace('_', ' ')}</span></p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" aria-hidden="true" /> Service Line Items
        </h2>
        <div className="divide-y text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-xs text-muted-foreground">{formatHours(item.hours)} @ {formatCurrency(item.rate)}/hr</p>
              </div>
              <p className="font-semibold">{formatCurrency(item.hours * item.rate)}</p>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t flex justify-between items-center font-bold text-base">
          <span>Estimated Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};

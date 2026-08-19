import React, { useState, useMemo, useCallback } from 'react';
import { useOrders } from '../context/OrderContext';
import type { OrderStatus, ServiceOrder } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

const ITEMS_PER_PAGE = 8;

export const OrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, loading } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Ensure pagination clamps cleanly when list shrinks after a status change or filter
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, safeCurrentPage]);

  const handleStatusTransition = useCallback(
    async (orderId: string, nextStatus: OrderStatus) => {
      setIsUpdating((prev) => ({ ...prev, [orderId]: true }));
      try {
        await updateOrderStatus(orderId, nextStatus);
      } finally {
        setIsUpdating((prev) => {
          const next = { ...prev };
          delete next[orderId];
          return next;
        });
      }
    },
    [updateOrderStatus]
  );

  const metrics = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      inProgress: orders.filter((o) => o.status === 'IN_PROGRESS').length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
    };
  }, [orders]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track customer service workflows</p>
        </div>
      </div>

      {/* Synchronized Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">Total Orders</p>
          <p className="text-2xl font-bold">{metrics.total}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-xs text-amber-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{metrics.pending}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-xs text-blue-600 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{metrics.inProgress}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-xs text-emerald-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{metrics.completed}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-lg border">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by order ID, customer, or service..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-72"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | 'ALL');
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-md border text-sm bg-background"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {paginatedOrders.length} of {filteredOrders.length} filtered orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading service orders...
                </TableCell>
              </TableRow>
            ) : paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No orders match the active filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order: ServiceOrder) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell>{order.serviceType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'COMPLETED'
                          ? 'default'
                          : order.status === 'IN_PROGRESS'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {order.status === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating[order.id]}
                        onClick={() => handleStatusTransition(order.id, 'IN_PROGRESS')}
                      >
                        Start Service
                      </Button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={isUpdating[order.id]}
                        onClick={() => handleStatusTransition(order.id, 'COMPLETED')}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Page {safeCurrentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
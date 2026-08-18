import React, { useState, useEffect, useMemo, useId } from 'react';
import { orderService } from '../services/orderService';
import { ServiceOrder, OrderStatus, PriorityLevel } from '../types/order';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Plus, RefreshCw, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" aria-hidden="true" />,
  in_progress: <RefreshCw className="w-3.5 h-3.5 mr-1 text-blue-500 animate-spin" aria-hidden="true" />,
  completed: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" aria-hidden="true" />,
  cancelled: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-500" aria-hidden="true" />
};

export const OrdersPage: React.FC = () => {
  const searchInputId = useId();
  const statusFilterId = useId();

  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({
        search,
        status: statusFilter,
        priority: priorityFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, priorityFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(new Set(orders.map((o) => o.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBatchStatusUpdate = async (status: OrderStatus) => {
    if (selectedRowIds.size === 0) return;
    await orderService.updateStatus(Array.from(selectedRowIds), status);
    setSelectedRowIds(new Set());
    loadData();
  };

  const calculateTotal = (order: ServiceOrder) => {
    return order.items.reduce((sum, itm) => sum + itm.hours * itm.rate, 0);
  };

  const allSelected = orders.length > 0 && selectedRowIds.size === orders.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track active maintenance requests and work orders.</p>
        </div>
        <Link to="/orders/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Create Order</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-card border">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <label htmlFor={searchInputId} className="sr-only">Search orders</label>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id={searchInputId}
              placeholder="Search by order # or client..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor={statusFilterId} className="sr-only">Filter by status</label>
            <select
              id={statusFilterId}
              className="h-10 px-3 py-2 text-sm rounded-md border bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {selectedRowIds.size > 0 && (
          <div className="flex items-center gap-2" role="region" aria-label="Batch Actions">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              {selectedRowIds.size} Selected
            </span>
            <Button size="sm" variant="outline" onClick={() => handleBatchStatusUpdate('in_progress')}>
              Mark In Progress
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBatchStatusUpdate('completed')}>
              Mark Completed
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all orders"
                />
              </TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Total Est.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Loading service orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No service orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} data-state={selectedRowIds.has(order.id) ? 'selected' : undefined}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedRowIds.has(order.id)}
                      onCheckedChange={() => handleToggleRow(order.id)}
                      aria-label={`Select order ${order.orderNumber}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link to={`/orders/${order.id}`} className="hover:underline text-primary">
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center w-fit capitalize font-normal">
                      {STATUS_ICONS[order.status]}
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${
                      order.priority === 'urgent' ? 'bg-destructive/10 text-destructive' :
                      order.priority === 'high' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'
                    }`}>
                      {order.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${calculateTotal(order).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
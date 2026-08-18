import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { PriorityLevel, OrderStatus, ServiceItem } from '../types/order';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ServiceItem[]>([
    { id: '1', description: '', hours: 1, rate: 100 }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), description: '', hours: 1, rate: 100 }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ServiceItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Customer name is required.';
    if (!customerEmail.trim() || !customerEmail.includes('@')) errs.customerEmail = 'Valid email is required.';
    if (!dueDate) errs.dueDate = 'Due date is required.';
    if (items.some((itm) => !itm.description.trim())) {
      errs.items = 'All service item descriptions must be filled.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const autoOrderNum = `SO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      await orderService.createOrder({
        orderNumber: autoOrderNum,
        customerName,
        customerEmail,
        status: 'pending' as OrderStatus,
        priority,
        dueDate: new Date(dueDate).toISOString(),
        notes,
        items
      });
      navigate('/orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEstimate = items.reduce((sum, itm) => sum + (itm.hours || 0) * (itm.rate || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/orders" className="flex items-center hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Back to Orders
        </Link>
      </div>

      <div className="border rounded-lg bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-6">Create New Service Order</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="customerName" className="text-sm font-medium">Customer Name</label>
              <Input
                id="customerName"
                placeholder="e.g. Acme Industrial"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                aria-invalid={!!errors.customerName}
              />
              {errors.customerName && <p className="text-xs text-destructive">{errors.customerName}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customerEmail" className="text-sm font-medium">Customer Email</label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="contact@acme.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                aria-invalid={!!errors.customerEmail}
              />
              {errors.customerEmail && <p className="text-xs text-destructive">{errors.customerEmail}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <select
                id="priority"
                className="w-full h-10 px-3 py-2 text-sm rounded-md border bg-background"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-invalid={!!errors.dueDate}
              />
              {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-medium">Service Line Items</h2>
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Item
              </Button>
            </div>

            {errors.items && <p className="text-xs text-destructive">{errors.items}</p>}

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Task description"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="Hrs"
                    value={item.hours}
                    onChange={(e) => updateItem(idx, 'hours', parseFloat(e.target.value) || 0)}
                    className="w-20"
                    aria-label="Hours"
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="$/hr"
                    value={item.rate}
                    onChange={(e) => updateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-24"
                    aria-label="Rate per hour"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={items.length <= 1}
                    onClick={() => removeItem(idx)}
                    aria-label={`Remove item ${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-right text-sm font-medium text-muted-foreground pt-2">
              Total Estimate: <span className="text-foreground font-semibold">${totalEstimate.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium">Internal Notes</label>
            <Textarea
              id="notes"
              placeholder="Additional requirements or customer instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/orders')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
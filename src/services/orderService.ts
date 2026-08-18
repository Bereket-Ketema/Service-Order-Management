import { ServiceOrder, OrderFilterOptions } from '../types/order';

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'SO-2024-001',
    customerName: 'Acme Corp (Jane Doe)',
    customerEmail: 'jane@acme.com',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-03-01T09:00:00.000Z',
    dueDate: '2024-03-15T18:00:00.000Z',
    items: [
      { id: 'itm-1', description: 'HVAC Compressor Diagnostics', hours: 4, rate: 120 },
      { id: 'itm-2', description: 'Refrigerant Line Replacement', hours: 6, rate: 95 },
    ],
    notes: 'Urgent cooling issue in Server Room B.'
  },
  {
    id: 'ord-102',
    orderNumber: 'SO-2024-002',
    customerName: 'Starlight Retail',
    customerEmail: 'facilities@starlight.com',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-02T11:30:00.000Z',
    dueDate: '2024-03-18T18:00:00.000Z',
    items: [
      { id: 'itm-3', description: 'Annual Electrical Safety Audit', hours: 8, rate: 110 }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'SO-2024-003',
    customerName: 'Apex Logistics',
    customerEmail: 'ops@apexlogistics.io',
    status: 'completed',
    priority: 'urgent',
    createdAt: '2024-02-28T08:15:00.000Z',
    dueDate: '2024-03-05T12:00:00.000Z',
    items: [
      { id: 'itm-4', description: 'Dock Door Sensor Repair', hours: 3, rate: 140 }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: 'SO-2024-004',
    customerName: 'GreenTree Health',
    customerEmail: 'maintenance@greentree.org',
    status: 'cancelled',
    priority: 'low',
    createdAt: '2024-02-20T14:00:00.000Z',
    dueDate: '2024-03-01T17:00:00.000Z',
    items: [
      { id: 'itm-5', description: 'Air Filter Replacements', hours: 2, rate: 80 }
    ]
  }
];

class OrderService {
  private orders: ServiceOrder[] = [...INITIAL_ORDERS];

  async getOrders(filter: OrderFilterOptions = {}): Promise<ServiceOrder[]> {
    await new Promise((r) => setTimeout(r, 120)); // Simulate async latency
    let result = [...this.orders];

    if (filter.status && filter.status !== 'all') {
      result = result.filter((o) => o.status === filter.status);
    }
    if (filter.priority && filter.priority !== 'all') {
      result = result.filter((o) => o.priority === filter.priority);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    if (filter.sortBy) {
      const { sortBy, sortOrder = 'asc' } = filter;
      result.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  async getOrderById(id: string): Promise<ServiceOrder | null> {
    await new Promise((r) => setTimeout(r, 80));
    return this.orders.find((o) => o.id === id) || null;
  }

  async createOrder(order: Omit<ServiceOrder, 'id' | 'createdAt'>): Promise<ServiceOrder> {
    await new Promise((r) => setTimeout(r, 150));
    const newOrder: ServiceOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async updateStatus(ids: string[], status: ServiceOrder['status']): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    this.orders = this.orders.map((o) =>
      ids.includes(o.id) ? { ...o, status } : o
    );
  }
}

export const orderService = new OrderService();
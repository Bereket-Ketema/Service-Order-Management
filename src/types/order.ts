export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface ServiceItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  priority: PriorityLevel;
  createdAt: string;
  dueDate: string;
  items: ServiceItem[];
  notes?: string;
}

export interface OrderFilterOptions {
  status?: OrderStatus | 'all';
  search?: string;
  priority?: PriorityLevel | 'all';
  sortBy?: 'createdAt' | 'dueDate' | 'customerName';
  sortOrder?: 'asc' | 'desc';
}
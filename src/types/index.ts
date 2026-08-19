export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type OrderPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ServiceOrder {
  id: string;
  customerName: string;
  serviceType: string;
  status: OrderStatus;
  priority: OrderPriority;
  totalAmount: number;
  createdAt: string;
  notes?: string;
}

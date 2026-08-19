import React, { createContext, useContext, useState } from 'react';
import type { ServiceOrder, OrderStatus } from '../types';

interface OrderContextType {
  orders: ServiceOrder[];
  loading: boolean;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  addOrder: (order: Omit<ServiceOrder, 'id' | 'createdAt'>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'ORD-1001',
    customerName: 'Alice Johnson',
    serviceType: 'HVAC Repair',
    status: 'PENDING',
    priority: 'HIGH',
    totalAmount: 250.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-1002',
    customerName: 'Bob Smith',
    serviceType: 'Plumbing Inspection',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    totalAmount: 180.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-1003',
    customerName: 'Charlie Davis',
    serviceType: 'Electrical Maintenance',
    status: 'COMPLETED',
    priority: 'LOW',
    totalAmount: 320.0,
    createdAt: new Date().toISOString(),
  },
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setLoading(true);
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
    setLoading(false);
  };

  const addOrder = async (orderData: Omit<ServiceOrder, 'id' | 'createdAt'>) => {
    setLoading(true);
    const newOrder: ServiceOrder = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setLoading(false);
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setLoading(false);
  };

  return (
    <OrderContext.Provider
      value={{ orders, loading, updateOrderStatus, addOrder, deleteOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

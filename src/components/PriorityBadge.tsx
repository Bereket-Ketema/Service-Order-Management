import React from 'react';
import { PriorityLevel } from '../types/order';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

const PRIORITY_STYLES: Record<PriorityLevel, { label: string; style: string }> = {
  low: { label: 'Low', style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  medium: { label: 'Medium', style: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  high: { label: 'High', style: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  urgent: { label: 'Urgent', style: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const config = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide ${config.style} ${className}`}
      role="status"
    >
      {config.label}
    </span>
  );
};

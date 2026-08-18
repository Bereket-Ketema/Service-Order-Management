import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatHours } from '../lib/formatters';

describe('Formatters', () => {
  it('formats numeric values into USD currency', () => {
    expect(formatCurrency(1250)).toBe('$1,250');
    expect(formatCurrency(99.5)).toBe('$99.50');
  });

  it('formats ISO date strings into readable format', () => {
    expect(formatDate('2024-05-10T12:00:00Z')).toBe('May 10, 2024');
    expect(formatDate('')).toBe('—');
  });

  it('formats hour quantities with correct pluralization', () => {
    expect(formatHours(1)).toBe('1 hr');
    expect(formatHours(3.5)).toBe('3.5 hrs');
  });
});

import { describe, it, expect } from 'vitest';
import {
  getTargetHours,
  calculateWeekOvertime,
  calculateTotalOvertime,
  getCurrentWeekNumber,
  getCurrentYear,
} from '../utils/overtime';

describe('getTargetHours', () => {
  it('returns 41 for normal weeks', () => {
    expect(getTargetHours(false)).toBe(41);
  });

  it('returns 40 for holiday weeks', () => {
    expect(getTargetHours(true)).toBe(40);
  });
});

describe('calculateWeekOvertime', () => {
  it('calculates positive overtime', () => {
    const entry = { hoursWorked: 45, isHoliday: false, reduction: 0 };
    expect(calculateWeekOvertime(entry)).toBe(4);
  });

  it('calculates negative overtime', () => {
    const entry = { hoursWorked: 38, isHoliday: false, reduction: 0 };
    expect(calculateWeekOvertime(entry)).toBe(-3);
  });

  it('accounts for holiday week target', () => {
    const entry = { hoursWorked: 42, isHoliday: true, reduction: 0 };
    expect(calculateWeekOvertime(entry)).toBe(2);
  });

  it('accounts for reduction', () => {
    const entry = { hoursWorked: 45, isHoliday: false, reduction: 2 };
    expect(calculateWeekOvertime(entry)).toBe(2);
  });

  it('handles missing reduction', () => {
    const entry = { hoursWorked: 41, isHoliday: false };
    expect(calculateWeekOvertime(entry)).toBe(0);
  });
});

describe('calculateTotalOvertime', () => {
  it('sums overtime across multiple weeks', () => {
    const weeks = [
      { hoursWorked: 45, isHoliday: false, reduction: 0 },
      { hoursWorked: 38, isHoliday: false, reduction: 0 },
      { hoursWorked: 42, isHoliday: true, reduction: 0 },
    ];
    // 4 + (-3) + 2 = 3
    expect(calculateTotalOvertime(weeks)).toBe(3);
  });

  it('returns 0 for empty array', () => {
    expect(calculateTotalOvertime([])).toBe(0);
  });
});

describe('getCurrentWeekNumber', () => {
  it('returns a valid week number', () => {
    const week = getCurrentWeekNumber(new Date());
    expect(week).toBeGreaterThanOrEqual(1);
    expect(week).toBeLessThanOrEqual(53);
  });

  it('returns correct week for a known date', () => {
    // 2024-01-01 is Monday of ISO week 1
    const week = getCurrentWeekNumber(new Date(2024, 0, 1));
    expect(week).toBe(1);
  });
});

describe('getCurrentYear', () => {
  it('returns current year', () => {
    const year = getCurrentYear(new Date());
    expect(year).toBe(new Date().getFullYear());
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadWeeks, saveWeeks } from '../utils/storage';

describe('storage', () => {
  let store;

  beforeEach(() => {
    store = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => store[key] ?? null),
      setItem: vi.fn((key, value) => { store[key] = value; }),
      removeItem: vi.fn((key) => { delete store[key]; }),
    });
  });

  it('loadWeeks returns empty array when no data', () => {
    expect(loadWeeks()).toEqual([]);
  });

  it('saveWeeks stores data and loadWeeks retrieves it', () => {
    const weeks = [
      { year: 2024, week: 10, hoursWorked: 43, isHoliday: false, reduction: 0 },
    ];
    saveWeeks(weeks);
    expect(loadWeeks()).toEqual(weeks);
  });

  it('loadWeeks returns empty array on invalid JSON', () => {
    store['timetracker_weeks'] = 'invalid json{{{';
    expect(loadWeeks()).toEqual([]);
  });
});

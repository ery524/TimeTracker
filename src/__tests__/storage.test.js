import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadWeeks, saveWeeks, exportWeeks, importWeeks } from '../utils/storage';

describe('storage', () => {
  let store;

  beforeEach(() => {
    store = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => store[key] ?? null),
      setItem: vi.fn((key, value) => { store[key] = value; }),
      removeItem: vi.fn((key) => { delete store[key]; }),
    });

    vi.stubGlobal('indexedDB', undefined);
    
    vi.stubGlobal('navigator', {
      storage: {
        persist: vi.fn(() => Promise.resolve(false)),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loadWeeks returns empty array when no data', async () => {
    const result = await loadWeeks();
    expect(result).toEqual([]);
  });

  it('saveWeeks stores data and loadWeeks retrieves it', async () => {
    const weeks = [
      { year: 2024, week: 10, hoursWorked: 43, isHoliday: false, reduction: 0 },
    ];
    await saveWeeks(weeks);
    const result = await loadWeeks();
    expect(result).toEqual(weeks);
  });

  it('loadWeeks returns empty array on invalid JSON', async () => {
    store['timetracker_weeks'] = 'invalid json{{{';
    const result = await loadWeeks();
    expect(result).toEqual([]);
  });

  it('exportWeeks creates a download link', () => {
    const weeks = [
      { year: 2024, week: 10, hoursWorked: 43, isHoliday: false, reduction: 0 },
    ];
    
    const mockClick = vi.fn();
    const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: '',
    });
    const mockCreateObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const mockRevokeObjectURL = vi.spyOn(URL, 'revokeObjectURL');

    exportWeeks(weeks);

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();

    mockCreateElement.mockRestore();
    mockCreateObjectURL.mockRestore();
    mockRevokeObjectURL.mockRestore();
  });

  it('importWeeks parses JSON file', async () => {
    const weeks = [
      { year: 2024, week: 10, hoursWorked: 43, isHoliday: false, reduction: 0 },
    ];
    const file = new File([JSON.stringify(weeks)], 'test.json', { type: 'application/json' });

    const result = await importWeeks(file);
    expect(result).toEqual(weeks);
  });

  it('importWeeks rejects invalid JSON', async () => {
    const file = new File(['invalid json'], 'test.json', { type: 'application/json' });

    await expect(importWeeks(file)).rejects.toThrow();
  });

  it('importWeeks rejects non-array data', async () => {
    const file = new File(['{"key": "value"}'], 'test.json', { type: 'application/json' });

    await expect(importWeeks(file)).rejects.toThrow('Invalid data format');
  });
});

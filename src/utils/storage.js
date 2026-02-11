const STORAGE_KEY = 'timetracker_weeks';

export function loadWeeks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWeeks(weeks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
}

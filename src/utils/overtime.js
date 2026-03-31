export function decimalToHHMM(decimal) {
  const totalMinutes = Math.round(decimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function hhmmToDecimal(hhmm) {
  const parts = hhmm.split(':');
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours + minutes / 60;
}

export function getTargetHours(isHoliday) {
  return isHoliday ? 40 : 41;
}

export function calculateWeekOvertime(entry) {
  const target = getTargetHours(entry.isHoliday);
  const reduction = entry.reduction || 0;
  return entry.hoursWorked - target - reduction;
}

export function calculateTotalOvertime(weeks) {
  return weeks.reduce((sum, week) => sum + calculateWeekOvertime(week), 0);
}

export function getCurrentWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

export function getCurrentYear(date = new Date()) {
  return date.getFullYear();
}

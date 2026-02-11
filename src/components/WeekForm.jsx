import { useState } from 'react';
import { getCurrentWeekNumber, getCurrentYear, getTargetHours } from '../utils/overtime';

export default function WeekForm({ onAdd }) {
  const [year, setYear] = useState(getCurrentYear());
  const [week, setWeek] = useState(getCurrentWeekNumber());
  const [hoursWorked, setHoursWorked] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);
  const [reduction, setReduction] = useState(0);

  const targetHours = getTargetHours(isHoliday);

  function handleSubmit(e) {
    e.preventDefault();
    if (!hoursWorked && hoursWorked !== 0) return;
    onAdd({
      year: Number(year),
      week: Number(week),
      hoursWorked: Number(hoursWorked),
      isHoliday,
      reduction: Number(reduction) || 0,
    });
    setHoursWorked('');
    setReduction(0);
    setIsHoliday(false);
  }

  return (
    <section className="card">
      <h2>Woche erfassen</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Jahr
            <input type="number" value={year} onChange={e => setYear(e.target.value)} required />
          </label>
          <label>
            Kalenderwoche
            <input type="number" min="1" max="53" value={week} onChange={e => setWeek(e.target.value)} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Stunden gearbeitet
            <input type="number" step="0.5" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} required />
          </label>
          <label>
            Stundenabbau
            <input type="number" step="0.5" min="0" value={reduction} onChange={e => setReduction(e.target.value)} />
          </label>
        </div>
        <div className="form-row checkbox-row">
          <label className="checkbox-label">
            <input type="checkbox" checked={isHoliday} onChange={e => setIsHoliday(e.target.checked)} />
            Ferienwoche (Sollstunden: {targetHours}h)
          </label>
        </div>
        <button type="submit">Woche hinzufügen</button>
      </form>
    </section>
  );
}

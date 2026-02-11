import { useState, useEffect } from 'react';
import { getCurrentWeekNumber, getCurrentYear, getTargetHours } from '../utils/overtime';

function getNextWeek(weeks) {
  if (!weeks || weeks.length === 0) {
    return { year: getCurrentYear(), week: getCurrentWeekNumber() };
  }

  const sorted = [...weeks].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.week - a.week;
  });

  const lastEntry = sorted[0];
  let nextWeek = lastEntry.week + 1;
  let nextYear = lastEntry.year;

  if (nextWeek > 52) {
    nextWeek = 1;
    nextYear = lastEntry.year + 1;
  }

  return { year: nextYear, week: nextWeek };
}

export default function WeekForm({ onAdd, weeks }) {
  const [year, setYear] = useState(getCurrentYear());
  const [week, setWeek] = useState(getCurrentWeekNumber());
  const [hoursWorked, setHoursWorked] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);
  const [reduction, setReduction] = useState(0);

  useEffect(() => {
    const { year: nextYear, week: nextWeek } = getNextWeek(weeks);
    setYear(nextYear);
    setWeek(nextWeek);
  }, [weeks]);

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
    
    const { year: nextYear, week: nextWeek } = getNextWeek([...weeks, {
      year: Number(year),
      week: Number(week),
      hoursWorked: Number(hoursWorked),
      isHoliday,
      reduction: Number(reduction) || 0,
    }]);
    setYear(nextYear);
    setWeek(nextWeek);
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

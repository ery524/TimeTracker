import { getTargetHours, calculateWeekOvertime } from '../utils/overtime';

export default function WeekList({ weeks, onDelete }) {
  const sorted = [...weeks].sort((a, b) => b.year - a.year || b.week - a.week);

  if (sorted.length === 0) {
    return (
      <section className="card">
        <h2>Einträge</h2>
        <p className="empty">Noch keine Wochen erfasst.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Einträge</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Jahr</th>
              <th>KW</th>
              <th>Soll</th>
              <th>Gearbeitet</th>
              <th>Abbau</th>
              <th>Überstunden</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, i) => {
              const overtime = calculateWeekOvertime(entry);
              const target = getTargetHours(entry.isHoliday);
              return (
                <tr key={`${entry.year}-${entry.week}-${i}`}>
                  <td>{entry.year}</td>
                  <td>{entry.week}</td>
                  <td>{target}h</td>
                  <td>{entry.hoursWorked}h</td>
                  <td>{entry.reduction || 0}h</td>
                  <td className={overtime >= 0 ? 'positive' : 'negative'}>
                    {overtime >= 0 ? '+' : ''}{overtime}h
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => onDelete(entry)}>Löschen</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

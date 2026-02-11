import { calculateTotalOvertime } from '../utils/overtime';

export default function OvertimeSummary({ weeks }) {
  const total = calculateTotalOvertime(weeks);
  const colorClass = total >= 0 ? 'positive' : 'negative';

  return (
    <section className="card summary">
      <h2>Überstunden-Saldo</h2>
      <p className={`total ${colorClass}`}>
        {total >= 0 ? '+' : ''}{total}h
      </p>
    </section>
  );
}

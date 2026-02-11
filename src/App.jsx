import { useState, useEffect } from 'react';
import { loadWeeks, saveWeeks } from './utils/storage';
import OvertimeSummary from './components/OvertimeSummary';
import WeekForm from './components/WeekForm';
import WeekList from './components/WeekList';
import './App.css';

function App() {
  const [weeks, setWeeks] = useState(() => loadWeeks());

  useEffect(() => {
    saveWeeks(weeks);
  }, [weeks]);

  function handleAdd(entry) {
    setWeeks(prev => [...prev, entry]);
  }

  function handleDelete(entry) {
    setWeeks(prev => prev.filter(w =>
      !(w.year === entry.year && w.week === entry.week && w.hoursWorked === entry.hoursWorked &&
        w.isHoliday === entry.isHoliday && w.reduction === entry.reduction)
    ));
  }

  return (
    <div className="app">
      <h1>TimeTracker – Überstunden Tracker</h1>
      <OvertimeSummary weeks={weeks} />
      <WeekForm onAdd={handleAdd} />
      <WeekList weeks={weeks} onDelete={handleDelete} />
    </div>
  );
}

export default App;

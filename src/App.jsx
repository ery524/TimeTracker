import { useState, useEffect, useRef } from 'react';
import { loadWeeks, saveWeeks, exportWeeks, importWeeks } from './utils/storage';
import OvertimeSummary from './components/OvertimeSummary';
import WeekForm from './components/WeekForm';
import WeekList from './components/WeekList';
import './App.css';

function App() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadWeeks().then((data) => {
      setWeeks(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      saveWeeks(weeks);
    }
  }, [weeks, loading]);

  function handleAdd(entry) {
    setWeeks(prev => [...prev, entry]);
  }

  function handleDelete(entry) {
    setWeeks(prev => prev.filter(w =>
      !(w.year === entry.year && w.week === entry.week && w.hoursWorked === entry.hoursWorked &&
        w.isHoliday === entry.isHoliday && w.reduction === entry.reduction)
    ));
  }

  function handleExport() {
    exportWeeks(weeks);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importWeeks(file);
      if (window.confirm(`Import ${data.length} Einträge? Dies ersetzt alle aktuellen Daten.`)) {
        setWeeks(data);
      }
    } catch (error) {
      alert('Import fehlgeschlagen: ' + error.message);
    }
    e.target.value = '';
  }

  if (loading) {
    return (
      <div className="app">
        <h1>TimeTracker – Überstunden Tracker</h1>
        <p style={{ textAlign: 'center' }}>Lädt...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>TimeTracker – Überstunden Tracker</h1>
      <div className="backup-controls">
        <button onClick={handleExport} className="backup-btn">
          📥 Daten exportieren
        </button>
        <button onClick={handleImportClick} className="backup-btn">
          📤 Daten importieren
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          style={{ display: 'none' }}
        />
      </div>
      <OvertimeSummary weeks={weeks} />
      <WeekForm onAdd={handleAdd} weeks={weeks} />
      <WeekList weeks={weeks} onDelete={handleDelete} />
    </div>
  );
}

export default App;

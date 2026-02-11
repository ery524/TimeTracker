# TimeTracker

Eine Anwendung zur Verwaltung von Überstunden pro Kalenderwoche mit permanenter Datenspeicherung.

## Beschreibung

TimeTracker ist eine einfache Python-Anwendung, die es ermöglicht:
- Überstunden pro Kalenderwoche zu erfassen
- Überstunden mit Beschreibungen zu versehen
- Die Gesamtüberstunden pro Woche anzuzeigen
- Eine Übersicht über alle erfassten Wochen zu erhalten
- Daten werden permanent in einer JSON-Datei gespeichert

## Voraussetzungen

- Python 3.7 oder höher

## Installation

1. Repository klonen:
```bash
git clone https://github.com/ery524/TimeTracker.git
cd TimeTracker
```

2. Die Anwendung ist sofort einsatzbereit, keine zusätzlichen Abhängigkeiten erforderlich.

## Verwendung

### Überstunden hinzufügen

```bash
python overtime_tracker.py add <stunden> [beschreibung]
```

Beispiel:
```bash
python overtime_tracker.py add 2.5 "Projektarbeit am Abend"
```

### Aktuelle Woche anzeigen

```bash
python overtime_tracker.py show
```

### Bestimmte Woche anzeigen

```bash
python overtime_tracker.py show <jahr> <kalenderwoche>
```

Beispiel:
```bash
python overtime_tracker.py show 2024 10
```

### Alle Wochen auflisten

```bash
python overtime_tracker.py list
```

## Datenformat

Die Daten werden in der Datei `overtime_data.json` gespeichert. Diese Datei wird automatisch beim ersten Hinzufügen von Überstunden erstellt.

Beispiel der Datenstruktur:
```json
{
  "2024-W10": {
    "total_hours": 5.5,
    "entries": [
      {
        "date": "2024-03-04",
        "hours": 2.5,
        "description": "Projektarbeit"
      },
      {
        "date": "2024-03-05",
        "hours": 3.0,
        "description": "Meeting"
      }
    ]
  }
}
```

## Funktionen

- ✅ Erfassung von Überstunden mit Datum und Beschreibung
- ✅ Automatische Zuordnung zur korrekten Kalenderwoche
- ✅ Persistente Speicherung in JSON-Format
- ✅ Anzeige der Gesamtüberstunden pro Woche
- ✅ Übersicht über alle erfassten Wochen
- ✅ Einfache Kommandozeilen-Schnittstelle

## Lizenz

MIT License
# TimeTracker

Eine Anwendung zur Verwaltung von Überstunden pro Kalenderwoche mit permanenter Datenspeicherung.

## Beschreibung

TimeTracker ist eine benutzerfreundliche Python-Anwendung mit grafischer Oberfläche, die es ermöglicht:
- Überstunden pro Kalenderwoche zu erfassen
- Überstunden mit Beschreibungen zu versehen
- Die Gesamtüberstunden pro Woche anzuzeigen
- Eine Übersicht über alle erfassten Wochen zu erhalten
- Daten werden permanent in einer JSON-Datei gespeichert
- **Moderne grafische Benutzeroberfläche (GUI)** für einfache Bedienung
- Kommandozeilen-Schnittstelle (CLI) für erweiterte Nutzung

## Voraussetzungen

- Python 3.7 oder höher
- Tkinter (für GUI, normalerweise bereits in Python enthalten)

## Installation

1. Repository klonen:
```bash
git clone https://github.com/ery524/TimeTracker.git
cd TimeTracker
```

2. Die Anwendung ist sofort einsatzbereit, keine zusätzlichen Abhängigkeiten erforderlich.

## Verwendung - GUI (Empfohlen)

### Grafische Oberfläche starten

```bash
python overtime_tracker_gui.py
```

Die GUI bietet drei Tabs:

1. **➕ Überstunden hinzufügen**: Erfassen Sie neue Überstunden mit Stundenzahl und Beschreibung
2. **📊 Aktuelle Woche**: Übersicht über die Überstunden der aktuellen Kalenderwoche
3. **📅 Alle Wochen**: Komplette Historie aller erfassten Überstunden

### Screenshots

**Überstunden hinzufügen:**

![Add Overtime](https://github.com/user-attachments/assets/756996ee-967e-4602-948c-6a672eb6eb0e)

**Aktuelle Woche mit Daten:**

![Current Week](https://github.com/user-attachments/assets/a05bd879-1e04-4090-81de-260a66fb0347)

**Alle Wochen Historie:**

![History](https://github.com/user-attachments/assets/910e55e3-9c22-4331-8237-b0903540ed49)

## Verwendung - CLI (Kommandozeile)

Die Kommandozeilenschnittstelle ist weiterhin verfügbar für Skripte und erweiterte Nutzung:

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

- ✅ **Moderne grafische Benutzeroberfläche (GUI)** mit drei übersichtlichen Tabs
- ✅ **Benutzerfreundliches Design** mit klarer Struktur und schönen Farben
- ✅ Erfassung von Überstunden mit Datum und Beschreibung
- ✅ Automatische Zuordnung zur korrekten Kalenderwoche
- ✅ Persistente Speicherung in JSON-Format
- ✅ Anzeige der Gesamtüberstunden pro Woche
- ✅ Übersicht über alle erfassten Wochen
- ✅ Einfache Kommandozeilen-Schnittstelle für erweiterte Nutzung
- ✅ Keine externen Abhängigkeiten erforderlich (nur Python Standard-Bibliothek)

## Lizenz

MIT License
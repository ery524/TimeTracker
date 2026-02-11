#!/usr/bin/env python3
"""
TimeTracker - Overtime Hours Tracker
Track overtime hours worked per calendar week with persistent storage
"""

import json
import os
from datetime import datetime, date
from typing import Dict, List, Optional, Any, Tuple


class OvertimeTracker:
    """Main class for tracking overtime hours per calendar week"""
    
    def __init__(self, data_file: str = "overtime_data.json"):
        """
        Initialize the overtime tracker
        
        Args:
            data_file: Path to the JSON file for persistent storage
        """
        self.data_file = data_file
        self.data: Dict[str, Dict[str, Any]] = {}
        self.load_data()
    
    def load_data(self) -> None:
        """Load data from JSON file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
            except json.JSONDecodeError:
                print(f"Warning: Could not read {self.data_file}. Starting with empty data.")
                self.data = {}
        else:
            self.data = {}
    
    def save_data(self) -> None:
        """Save data to JSON file"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
    
    @staticmethod
    def get_calendar_week(target_date: Optional[date] = None) -> Tuple[int, int]:
        """
        Get the calendar week and year for a given date
        
        Args:
            target_date: Date to get calendar week for (default: today)
            
        Returns:
            Tuple of (year, calendar_week)
        """
        if target_date is None:
            target_date = date.today()
        
        iso_calendar = target_date.isocalendar()
        return (iso_calendar[0], iso_calendar[1])
    
    @staticmethod
    def format_week_key(year: int, week: int) -> str:
        """
        Format a week key for storage
        
        Args:
            year: Year
            week: Calendar week number
            
        Returns:
            Formatted week key (e.g., "2024-W01")
        """
        return f"{year}-W{week:02d}"
    
    def add_overtime(self, hours: float, target_date: Optional[date] = None, 
                     description: str = "") -> None:
        """
        Add overtime hours for a specific date
        
        Args:
            hours: Number of overtime hours to add
            target_date: Date for the overtime (default: today)
            description: Optional description of the overtime
        """
        year, week = self.get_calendar_week(target_date)
        week_key = self.format_week_key(year, week)
        
        if week_key not in self.data:
            self.data[week_key] = {
                "total_hours": 0.0,
                "entries": []
            }
        
        self.data[week_key]["total_hours"] += hours
        
        entry = {
            "date": (target_date or date.today()).isoformat(),
            "hours": hours,
            "description": description
        }
        self.data[week_key]["entries"].append(entry)
        
        self.save_data()
    
    def get_week_overtime(self, year: int, week: int) -> Dict:
        """
        Get overtime data for a specific week
        
        Args:
            year: Year
            week: Calendar week number
            
        Returns:
            Dictionary with overtime data for the week
        """
        week_key = self.format_week_key(year, week)
        return self.data.get(week_key, {"total_hours": 0.0, "entries": []})
    
    def get_current_week_overtime(self) -> Dict:
        """
        Get overtime data for the current week
        
        Returns:
            Dictionary with overtime data for the current week
        """
        year, week = self.get_calendar_week()
        return self.get_week_overtime(year, week)
    
    def get_all_weeks(self) -> List[str]:
        """
        Get a sorted list of all weeks with overtime data
        
        Returns:
            Sorted list of week keys
        """
        return sorted(self.data.keys())
    
    def display_week_summary(self, year: int, week: int) -> None:
        """
        Display a summary of overtime for a specific week
        
        Args:
            year: Year
            week: Calendar week number
        """
        week_data = self.get_week_overtime(year, week)
        week_key = self.format_week_key(year, week)
        
        print(f"\n=== Überstunden für {week_key} ===")
        print(f"Gesamt: {week_data['total_hours']:.2f} Stunden")
        
        if week_data['entries']:
            print("\nEinträge:")
            for entry in week_data['entries']:
                desc = f" - {entry['description']}" if entry['description'] else ""
                print(f"  {entry['date']}: {entry['hours']:.2f}h{desc}")
        else:
            print("Keine Einträge vorhanden")
    
    def display_all_weeks(self) -> None:
        """Display summary of all weeks with overtime data"""
        weeks = self.get_all_weeks()
        
        if not weeks:
            print("\nKeine Überstunden-Daten vorhanden.")
            return
        
        print("\n=== Alle Überstunden-Einträge ===")
        total_all = 0.0
        
        for week_key in weeks:
            week_data = self.data[week_key]
            total_all += week_data['total_hours']
            print(f"{week_key}: {week_data['total_hours']:.2f} Stunden")
        
        print(f"\nGesamt (alle Wochen): {total_all:.2f} Stunden")


def main():
    """Main function for CLI interface"""
    import sys
    
    tracker = OvertimeTracker()
    
    if len(sys.argv) < 2:
        print("TimeTracker - Überstunden-Tracker")
        print("\nVerwendung:")
        print("  python overtime_tracker.py add <stunden> [beschreibung]")
        print("  python overtime_tracker.py show [jahr] [woche]")
        print("  python overtime_tracker.py list")
        print("\nBeispiele:")
        print("  python overtime_tracker.py add 2.5 'Projektarbeit'")
        print("  python overtime_tracker.py show")
        print("  python overtime_tracker.py show 2024 10")
        print("  python overtime_tracker.py list")
        return
    
    command = sys.argv[1].lower()
    
    if command == "add":
        if len(sys.argv) < 3:
            print("Fehler: Bitte Stundenzahl angeben")
            print("Verwendung: python overtime_tracker.py add <stunden> [beschreibung]")
            return
        
        try:
            hours = float(sys.argv[2])
            description = " ".join(sys.argv[3:]) if len(sys.argv) > 3 else ""
            tracker.add_overtime(hours, description=description)
            
            year, week = tracker.get_calendar_week()
            print(f"✓ {hours:.2f} Überstunden für KW {week}/{year} hinzugefügt")
            
            current_data = tracker.get_current_week_overtime()
            print(f"Gesamt diese Woche: {current_data['total_hours']:.2f} Stunden")
        except ValueError:
            print("Fehler: Ungültige Stundenzahl")
    
    elif command == "show":
        if len(sys.argv) >= 4:
            try:
                year = int(sys.argv[2])
                week = int(sys.argv[3])
                tracker.display_week_summary(year, week)
            except ValueError:
                print("Fehler: Ungültiges Jahr oder Woche")
        else:
            year, week = tracker.get_calendar_week()
            tracker.display_week_summary(year, week)
    
    elif command == "list":
        tracker.display_all_weeks()
    
    else:
        print(f"Unbekannter Befehl: {command}")
        print("Verwenden Sie 'add', 'show', oder 'list'")


if __name__ == "__main__":
    main()

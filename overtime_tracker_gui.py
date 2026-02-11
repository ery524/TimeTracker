#!/usr/bin/env python3
"""
TimeTracker GUI - Graphical User Interface for Overtime Tracker
A nice and user-friendly interface for tracking overtime hours
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
from datetime import date
from overtime_tracker import OvertimeTracker


class OvertimeTrackerGUI:
    """Graphical User Interface for the Overtime Tracker"""
    
    def __init__(self, root):
        """Initialize the GUI"""
        self.root = root
        self.root.title("TimeTracker - Überstunden-Verwaltung")
        self.root.geometry("800x600")
        self.root.resizable(True, True)
        
        # Initialize the tracker
        self.tracker = OvertimeTracker()
        
        # Color scheme - modern and professional
        self.bg_color = "#f0f0f0"
        self.primary_color = "#2196F3"
        self.secondary_color = "#4CAF50"
        self.danger_color = "#f44336"
        self.text_color = "#333333"
        
        # Configure root window
        self.root.configure(bg=self.bg_color)
        
        # Setup styles
        self.setup_styles()
        
        # Create the UI
        self.create_widgets()
        
        # Load and display current week data
        self.refresh_display()
    
    def setup_styles(self):
        """Setup custom styles for ttk widgets"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Configure button styles
        style.configure('Primary.TButton', 
                       background=self.primary_color,
                       foreground='white',
                       borderwidth=0,
                       focuscolor='none',
                       padding=10,
                       font=('Segoe UI', 10, 'bold'))
        
        style.map('Primary.TButton',
                 background=[('active', '#1976D2')])
        
        style.configure('Success.TButton',
                       background=self.secondary_color,
                       foreground='white',
                       borderwidth=0,
                       focuscolor='none',
                       padding=10,
                       font=('Segoe UI', 10, 'bold'))
        
        style.map('Success.TButton',
                 background=[('active', '#45a049')])
        
        # Configure frame style
        style.configure('Card.TFrame',
                       background='white',
                       borderwidth=1,
                       relief='solid')
        
        # Configure label styles
        style.configure('Title.TLabel',
                       background='white',
                       foreground=self.text_color,
                       font=('Segoe UI', 16, 'bold'))
        
        style.configure('Subtitle.TLabel',
                       background='white',
                       foreground=self.text_color,
                       font=('Segoe UI', 12, 'bold'))
        
        style.configure('Normal.TLabel',
                       background='white',
                       foreground=self.text_color,
                       font=('Segoe UI', 10))
        
        style.configure('Hours.TLabel',
                       background='white',
                       foreground=self.primary_color,
                       font=('Segoe UI', 24, 'bold'))
    
    def create_widgets(self):
        """Create all GUI widgets"""
        # Main container with padding
        main_container = ttk.Frame(self.root, padding="20")
        main_container.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_frame = ttk.Frame(main_container, style='Card.TFrame', padding="20")
        title_frame.pack(fill=tk.X, pady=(0, 20))
        
        title_label = ttk.Label(title_frame, 
                               text="⏰ TimeTracker - Überstunden-Verwaltung",
                               style='Title.TLabel')
        title_label.pack()
        
        # Create notebook (tabs)
        self.notebook = ttk.Notebook(main_container)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Tab 1: Add overtime
        self.add_tab = ttk.Frame(self.notebook, padding="20")
        self.notebook.add(self.add_tab, text="➕ Überstunden hinzufügen")
        self.create_add_tab()
        
        # Tab 2: Current week
        self.current_tab = ttk.Frame(self.notebook, padding="20")
        self.notebook.add(self.current_tab, text="📊 Aktuelle Woche")
        self.create_current_week_tab()
        
        # Tab 3: All weeks
        self.history_tab = ttk.Frame(self.notebook, padding="20")
        self.notebook.add(self.history_tab, text="📅 Alle Wochen")
        self.create_history_tab()
    
    def create_add_tab(self):
        """Create the add overtime tab"""
        # Card frame
        card = ttk.Frame(self.add_tab, style='Card.TFrame', padding="30")
        card.pack(fill=tk.BOTH, expand=True)
        
        # Title
        ttk.Label(card, 
                 text="Neue Überstunden erfassen",
                 style='Subtitle.TLabel').pack(pady=(0, 20))
        
        # Hours input
        hours_frame = ttk.Frame(card, style='Card.TFrame')
        hours_frame.pack(fill=tk.X, pady=10)
        
        ttk.Label(hours_frame, 
                 text="Stunden:",
                 style='Normal.TLabel').pack(side=tk.LEFT, padx=(0, 10))
        
        self.hours_var = tk.StringVar()
        hours_entry = ttk.Entry(hours_frame, 
                               textvariable=self.hours_var,
                               font=('Segoe UI', 11),
                               width=20)
        hours_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Description input
        desc_frame = ttk.Frame(card, style='Card.TFrame')
        desc_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        ttk.Label(desc_frame,
                 text="Beschreibung:",
                 style='Normal.TLabel').pack(anchor=tk.W, pady=(0, 5))
        
        self.desc_text = tk.Text(desc_frame,
                                height=4,
                                font=('Segoe UI', 10),
                                wrap=tk.WORD,
                                borderwidth=1,
                                relief='solid')
        self.desc_text.pack(fill=tk.BOTH, expand=True)
        
        # Current date display
        year, week = self.tracker.get_calendar_week()
        date_label = ttk.Label(card,
                              text=f"📅 Datum: {date.today().strftime('%d.%m.%Y')} (KW {week}/{year})",
                              style='Normal.TLabel')
        date_label.pack(pady=20)
        
        # Add button
        add_button = ttk.Button(card,
                               text="✓ Überstunden hinzufügen",
                               style='Success.TButton',
                               command=self.add_overtime)
        add_button.pack(pady=10)
        
        # Status label
        self.add_status_label = ttk.Label(card,
                                         text="",
                                         style='Normal.TLabel')
        self.add_status_label.pack(pady=10)
    
    def create_current_week_tab(self):
        """Create the current week overview tab"""
        # Card frame
        card = ttk.Frame(self.current_tab, style='Card.TFrame', padding="30")
        card.pack(fill=tk.BOTH, expand=True)
        
        # Title
        year, week = self.tracker.get_calendar_week()
        self.current_week_title = ttk.Label(card,
                                           text=f"Kalenderwoche {week}/{year}",
                                           style='Subtitle.TLabel')
        self.current_week_title.pack(pady=(0, 20))
        
        # Total hours display
        hours_frame = ttk.Frame(card, style='Card.TFrame')
        hours_frame.pack(fill=tk.X, pady=20)
        
        ttk.Label(hours_frame,
                 text="Gesamt Überstunden:",
                 style='Normal.TLabel').pack()
        
        self.total_hours_label = ttk.Label(hours_frame,
                                          text="0.00",
                                          style='Hours.TLabel')
        self.total_hours_label.pack(pady=10)
        
        ttk.Label(hours_frame,
                 text="Stunden",
                 style='Normal.TLabel').pack()
        
        # Separator
        ttk.Separator(card, orient='horizontal').pack(fill=tk.X, pady=20)
        
        # Entries list
        ttk.Label(card,
                 text="Einträge:",
                 style='Subtitle.TLabel').pack(anchor=tk.W, pady=(0, 10))
        
        # Scrolled text for entries
        self.current_entries_text = scrolledtext.ScrolledText(card,
                                                             height=10,
                                                             font=('Consolas', 10),
                                                             wrap=tk.WORD,
                                                             borderwidth=1,
                                                             relief='solid')
        self.current_entries_text.pack(fill=tk.BOTH, expand=True)
        
        # Refresh button
        refresh_button = ttk.Button(card,
                                   text="🔄 Aktualisieren",
                                   style='Primary.TButton',
                                   command=self.refresh_current_week)
        refresh_button.pack(pady=(20, 0))
    
    def create_history_tab(self):
        """Create the all weeks history tab"""
        # Card frame
        card = ttk.Frame(self.history_tab, style='Card.TFrame', padding="30")
        card.pack(fill=tk.BOTH, expand=True)
        
        # Title
        ttk.Label(card,
                 text="Alle Überstunden-Einträge",
                 style='Subtitle.TLabel').pack(pady=(0, 20))
        
        # Scrolled text for all weeks
        self.history_text = scrolledtext.ScrolledText(card,
                                                     height=15,
                                                     font=('Consolas', 10),
                                                     wrap=tk.WORD,
                                                     borderwidth=1,
                                                     relief='solid')
        self.history_text.pack(fill=tk.BOTH, expand=True, pady=(0, 20))
        
        # Total hours summary
        self.total_all_label = ttk.Label(card,
                                        text="",
                                        style='Subtitle.TLabel')
        self.total_all_label.pack(pady=10)
        
        # Refresh button
        refresh_button = ttk.Button(card,
                                   text="🔄 Aktualisieren",
                                   style='Primary.TButton',
                                   command=self.refresh_history)
        refresh_button.pack()
    
    def add_overtime(self):
        """Add overtime hours"""
        try:
            # Get values
            hours_str = self.hours_var.get().strip()
            description = self.desc_text.get("1.0", tk.END).strip()
            
            # Validate
            if not hours_str:
                messagebox.showwarning("Eingabefehler", "Bitte Stundenzahl eingeben!")
                return
            
            hours = float(hours_str)
            
            if hours <= 0:
                messagebox.showwarning("Eingabefehler", "Stundenzahl muss größer als 0 sein!")
                return
            
            # Add to tracker
            self.tracker.add_overtime(hours, description=description)
            
            # Show success message
            year, week = self.tracker.get_calendar_week()
            self.add_status_label.config(
                text=f"✓ {hours:.2f} Stunden erfolgreich hinzugefügt!",
                foreground=self.secondary_color
            )
            
            # Clear inputs
            self.hours_var.set("")
            self.desc_text.delete("1.0", tk.END)
            
            # Refresh displays
            self.refresh_display()
            
            # Show success popup
            messagebox.showinfo("Erfolg", 
                              f"✓ {hours:.2f} Überstunden für KW {week}/{year} hinzugefügt!")
            
        except ValueError:
            messagebox.showerror("Eingabefehler", "Ungültige Stundenzahl!")
        except Exception as e:
            messagebox.showerror("Fehler", f"Fehler beim Hinzufügen: {str(e)}")
    
    def refresh_current_week(self):
        """Refresh current week display"""
        year, week = self.tracker.get_calendar_week()
        week_data = self.tracker.get_week_overtime(year, week)
        
        # Update title
        self.current_week_title.config(text=f"Kalenderwoche {week}/{year}")
        
        # Update total hours
        total_hours = week_data.get('total_hours', 0.0)
        self.total_hours_label.config(text=f"{total_hours:.2f}")
        
        # Update entries
        self.current_entries_text.delete("1.0", tk.END)
        
        entries = week_data.get('entries', [])
        if entries:
            for entry in entries:
                date_str = entry.get('date', 'N/A')
                hours = entry.get('hours', 0.0)
                desc = entry.get('description', '')
                
                entry_text = f"📅 {date_str}  |  {hours:.2f}h"
                if desc:
                    entry_text += f"  |  {desc}"
                entry_text += "\n"
                
                self.current_entries_text.insert(tk.END, entry_text)
        else:
            self.current_entries_text.insert(tk.END, "Keine Einträge für diese Woche vorhanden.")
    
    def refresh_history(self):
        """Refresh history display"""
        self.history_text.delete("1.0", tk.END)
        
        weeks = self.tracker.get_all_weeks()
        
        if not weeks:
            self.history_text.insert(tk.END, "Keine Überstunden-Daten vorhanden.")
            self.total_all_label.config(text="")
            return
        
        total_all = 0.0
        
        for week_key in weeks:
            week_data = self.tracker.data[week_key]
            total_hours = week_data.get('total_hours', 0.0)
            total_all += total_hours
            
            # Add week summary
            self.history_text.insert(tk.END, f"\n{'='*60}\n")
            self.history_text.insert(tk.END, f"📅 {week_key}  |  {total_hours:.2f} Stunden\n")
            self.history_text.insert(tk.END, f"{'='*60}\n")
            
            # Add entries
            entries = week_data.get('entries', [])
            for entry in entries:
                date_str = entry.get('date', 'N/A')
                hours = entry.get('hours', 0.0)
                desc = entry.get('description', '')
                
                entry_text = f"  • {date_str}  |  {hours:.2f}h"
                if desc:
                    entry_text += f"  |  {desc}"
                entry_text += "\n"
                
                self.history_text.insert(tk.END, entry_text)
        
        # Update total
        self.total_all_label.config(text=f"📊 Gesamt (alle Wochen): {total_all:.2f} Stunden")
    
    def refresh_display(self):
        """Refresh all displays"""
        self.refresh_current_week()
        self.refresh_history()


def main():
    """Main function to start the GUI"""
    root = tk.Tk()
    app = OvertimeTrackerGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()

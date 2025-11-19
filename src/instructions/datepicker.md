import React, { useState, useRef, useEffect } from 'react';

const ImprovedDateRangePicker = () => {
  const [open, setOpen] = useState(false);
  const [dates, setDates] = useState({ checkin: '', checkout: '' });
  const [hoverDate, setHoverDate] = useState(null);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const triggerRef = useRef(null);

  // Beispiel-Verfügbarkeit
  const availabilityMap = {
    '2025-11-21': true,
    '2025-11-22': true,
    '2025-11-23': true,
    '2025-12-04': true,
    '2025-12-05': true,
    '2025-12-13': true,
    '2025-12-14': true,
    '2025-12-20': true,
    '2025-12-21': true,
    '2025-12-22': true,
  };

  // Verhindere Body-Scroll wenn Modal offen
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('de-DE');
    } catch {
      return dateStr;
    }
  };

  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const nextMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  };

  const monthYear = (date) => {
    return new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(date);
  };

  const generateCalendar = (monthStart) => {
    const firstDay = new Date(monthStart);
    const startDow = (firstDay.getDay() + 6) % 7; // Mo=0, So=6
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < startDow; i++) {
      cells.push({ empty: true, key: `pad-${i}` });
    }

    const today = new Date().toISOString().slice(0, 10);

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
      const dateStr = d.toISOString().slice(0, 10);
      const isAvailable = availabilityMap[dateStr] === true;
      const isPast = dateStr < today;

      cells.push({
        day,
        dateStr,
        key: dateStr,
        disabled: isPast || !isAvailable,
        isToday: dateStr === today
      });
    }

    return cells;
  };

  const getDayClass = (cell) => {
    if (cell.empty) return 'h-11';

    const { checkin, checkout } = dates;
    const isSelected = cell.dateStr === checkin || cell.dateStr === checkout;
    const isInRange = checkin && checkout && cell.dateStr > checkin && cell.dateStr < checkout;
    const isHoverRange = checkin && !checkout && hoverDate && cell.dateStr > checkin && cell.dateStr <= hoverDate;

    let classes = 'flex items-center justify-center h-11 rounded-lg transition-all cursor-pointer select-none';

    if (cell.disabled) {
      classes += ' bg-gray-100 text-gray-400 cursor-not-allowed line-through';
    } else if (isSelected) {
      classes += ' bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold shadow-lg scale-105';
    } else if (isInRange || isHoverRange) {
      classes += ' bg-blue-100 text-blue-900 font-semibold';
    } else {
      classes += ' bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105 text-gray-800';
    }

    if (cell.isToday && !isSelected) {
      classes += ' ring-2 ring-orange-400';
    }

    return classes;
  };

  const handleDateClick = (cell) => {
    if (cell.empty || cell.disabled) return;

    const { dateStr } = cell;

    if (!dates.checkin || (dates.checkin && dates.checkout)) {
      setDates({ checkin: dateStr, checkout: '' });
    } else if (dateStr <= dates.checkin) {
      setDates({ checkin: dateStr, checkout: '' });
    } else {
      setDates({ ...dates, checkout: dateStr });
      setTimeout(() => setOpen(false), 300);
    }
  };

  const nights = () => {
    if (!dates.checkin || !dates.checkout) return 0;
    const diff = new Date(dates.checkout) - new Date(dates.checkin);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Verbesserter DateRangePicker</h1>

        {/* Trigger Buttons */}
        <div ref={triggerRef} className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-2 border-transparent hover:border-blue-400 transition-all">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Check-in</label>
            <button
              onClick={() => setOpen(true)}
              className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {dates.checkin ? (
                <span className="text-gray-900 font-medium">{formatDate(dates.checkin)}</span>
              ) : (
                <span className="text-gray-400">Datum wählen</span>
              )}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-2 border-transparent hover:border-blue-400 transition-all">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Check-out</label>
            <button
              onClick={() => setOpen(true)}
              className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {dates.checkout ? (
                <span className="text-gray-900 font-medium">{formatDate(dates.checkout)}</span>
              ) : (
                <span className="text-gray-400">Datum wählen</span>
              )}
            </button>
          </div>
        </div>

        {/* Summary */}
        {dates.checkin && dates.checkout && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div className="text-gray-800">
                <span className="font-semibold">Auswahl:</span>
                <span className="ml-2">{formatDate(dates.checkin)} → {formatDate(dates.checkout)}</span>
              </div>
              <div className="text-blue-700 font-bold text-lg">
                {nights()} {nights() === 1 ? 'Nacht' : 'Nächte'}
              </div>
            </div>
          </div>
        )}

        {/* MODAL OVERLAY - AirBnB Style */}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reisedaten auswählen</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Schließen"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ‹
                </button>
                <div className="flex gap-8 text-lg font-semibold text-gray-700">
                  <span>{monthYear(displayMonth)}</span>
                  <span>{monthYear(nextMonth(displayMonth))}</span>
                </div>
                <button
                  onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ›
                </button>
              </div>

              {/* Calendars */}
              <div className="grid md:grid-cols-2 gap-8">
                {[displayMonth, nextMonth(displayMonth)].map((month, idx) => (
                  <div key={idx}>
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {generateCalendar(month).map(cell => (
                        <div
                          key={cell.key}
                          className={getDayClass(cell)}
                          onClick={() => handleDateClick(cell)}
                          onMouseEnter={() => !cell.empty && !cell.disabled && setHoverDate(cell.dateStr)}
                          onMouseLeave={() => setHoverDate(null)}
                        >
                          {!cell.empty && <span className="text-sm">{cell.day}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                  <span className="text-gray-600">Verfügbar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-gray-600">Nicht verfügbar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-gray-600">Ausgewählt</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDates({ checkin: '', checkout: '' });
                    setOpen(false);
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Zurücksetzen
                </button>
                <button
                  onClick={() => setOpen(false)}
                  disabled={!dates.checkin || !dates.checkout}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md"
                >
                  Übernehmen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ImprovedDateRangePicker;
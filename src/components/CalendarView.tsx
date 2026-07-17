import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Shirt, Check, Sparkles, Clock } from 'lucide-react';
import { WearLogEntry, GarmentItem, SavedOutfit, Language } from '../types';

interface CalendarViewProps {
  wearLogs: WearLogEntry[];
  garments: GarmentItem[];
  savedOutfits: SavedOutfit[];
  onLogCustomDate: (date: string, outfit?: SavedOutfit, garmentIds?: string[], notes?: string) => void;
  language: Language;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  wearLogs,
  garments,
  savedOutfits,
  onLogCustomDate,
  language
}) => {
  // Let's use July 2026 as default base month since our metadata says 2026-07
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // 6 is July (0-indexed)
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('');
  const [dayNotes, setDayNotes] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesEs = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = language === 'es' ? monthNamesEs[month] : monthNamesEn[month];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateString = (day: number) => {
    const d = String(day).padStart(2, '0');
    const m = String(month + 1).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleSaveDayLog = () => {
    if (!selectedDay) return;
    const outfit = savedOutfits.find(o => o.id === selectedOutfitId);
    onLogCustomDate(selectedDay, outfit, undefined, dayNotes);
    setSelectedDay(null);
    setSelectedOutfitId('');
    setDayNotes('');
  };

  const t = {
    title: language === 'es' ? 'Calendario & Registro Consciente' : 'Mindful Wear Log & Calendar',
    subtitle: language === 'es' ? 'Planifica rotaciones y audita tu historial real de uso diario.' : 'Plan capsule rotations and audit your true daily wear history.',
    sun: language === 'es' ? 'Dom' : 'Sun',
    mon: language === 'es' ? 'Lun' : 'Mon',
    tue: language === 'es' ? 'Mar' : 'Tue',
    wed: language === 'es' ? 'Mié' : 'Wed',
    thu: language === 'es' ? 'Jue' : 'Thu',
    fri: language === 'es' ? 'Vie' : 'Fri',
    sat: language === 'es' ? 'Sáb' : 'Sat',
    logTitle: language === 'es' ? 'Registrar Uso para el ' : 'Log Wear for ',
    selectOutfit: language === 'es' ? 'Asignar Atuendo Guardado:' : 'Assign Saved Outfit:',
    notes: language === 'es' ? 'Notas / Ocasión' : 'Notes / Occasion',
    cancel: language === 'es' ? 'Cancelar' : 'Cancel',
    save: language === 'es' ? 'Guardar Registro' : 'Save Log Entry',
    recentLogs: language === 'es' ? 'Historial de Registro Reciente' : 'Recent Wear History'
  };

  const dayHeaders = [t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#1b1c1b] tracking-tight">{t.title}</h2>
          <p className="font-sans text-sm text-[#43474c] mt-1">{t.subtitle}</p>
        </div>
        
        {/* Month Controls */}
        <div className="flex items-center gap-3 bg-[#ffffff] px-4 py-2 rounded-xl border border-[#c4c6cc] shadow-fabric">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-[#efedec] rounded text-[#455565] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-serif text-lg font-bold text-[#1b1c1b] min-w-[160px] text-center">
            {monthName} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-[#efedec] rounded text-[#455565] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Calendar Grid Canvas */}
      <section className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl shadow-fabric overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-[#f5f3f1] border-b border-[#c4c6cc]">
          {dayHeaders.map((dh, idx) => (
            <div key={idx} className="py-3 px-2 text-center font-mono text-xs font-semibold text-[#455565] uppercase tracking-wider">
              {dh}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#efedec]">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[110px] bg-[#fbf9f7]/60" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = formatDateString(dayNum);
            const logsForDay = wearLogs.filter(l => l.date === dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0] || (dayNum === 3 && month === 6 && year === 2026);

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dateStr)}
                className={`min-h-[110px] p-2.5 transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isToday ? 'bg-[#fed33e]/10 font-bold' : 'hover:bg-[#f5f3f1]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-mono text-sm inline-flex items-center justify-center w-7 h-7 rounded-full ${
                    isToday ? 'bg-[#455565] text-white shadow-sm font-bold' : 'text-[#1b1c1b]'
                  }`}>
                    {dayNum}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-[#455565] hover:bg-[#e4e2e0] rounded transition-all">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Logged items or outfits pill list */}
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[65px] scrollbar-hide">
                  {logsForDay.map(log => {
                    const outfit = savedOutfits.find(o => o.id === log.outfitId);
                    const label = log.outfitName || (outfit ? outfit.name : `${log.garmentIds.length} items logged`);
                    return (
                      <div 
                        key={log.id} 
                        className="bg-[#edf2f7] border border-[#c4c6cc] text-[#455565] px-2 py-1 rounded text-[11px] font-mono font-medium truncate shadow-sm flex items-center gap-1"
                        title={label}
                      >
                        <Shirt className="w-3 h-3 flex-shrink-0 text-[#735c00]" />
                        <span className="truncate">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Day Log Drawer / Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-[#1b1c1b]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="fabric-grain bg-[#ffffff] w-full max-w-md rounded-xl border border-[#c4c6cc] shadow-2xl p-6">
            <h3 className="font-serif text-xl font-bold text-[#1b1c1b] mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#455565]" />
              <span>{t.logTitle} {selectedDay}</span>
            </h3>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block font-mono text-xs text-[#43474c] uppercase mb-1 font-medium">{t.selectOutfit}</label>
                <select
                  value={selectedOutfitId}
                  onChange={e => setSelectedOutfitId(e.target.value)}
                  className="w-full bg-[#fbf9f7] border border-[#c4c6cc] focus:border-[#d4ac0d] rounded px-3 py-2 text-sm text-[#1b1c1b] focus:outline-none"
                >
                  <option value="">-- {language === 'es' ? 'Selecciona Atuendo Guardado' : 'Select Saved Outfit'} --</option>
                  {savedOutfits.map(o => (
                    <option key={o.id} value={o.id}>
                      {language === 'es' && o.nameEs ? o.nameEs : o.name} ({o.items.length} items)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#43474c] uppercase mb-1 font-medium">{t.notes}</label>
                <textarea
                  value={dayNotes}
                  onChange={e => setDayNotes(e.target.value)}
                  placeholder={language === 'es' ? 'ej. Reunión en la oficina o paseo dominical' : 'e.g. Office presentation or Sunday walk'}
                  rows={2}
                  className="w-full bg-[#fbf9f7] border border-[#c4c6cc] focus:border-[#d4ac0d] rounded px-3 py-2 text-sm text-[#1b1c1b] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#c4c6cc]">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-4 py-2 border border-[#c4c6cc] rounded-lg font-mono text-xs font-semibold text-[#43474c] hover:bg-[#efedec]"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveDayLog}
                  className="px-5 py-2 bg-[#455565] text-white rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#394858]"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent History Stream */}
      <section className="pt-8 border-t border-[#c4c6cc]">
        <h3 className="font-serif text-2xl font-bold text-[#1b1c1b] mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#735c00]" />
          <span>{t.recentLogs}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wearLogs.map(log => {
            const outfit = savedOutfits.find(o => o.id === log.outfitId);
            const title = log.outfitName || (outfit ? outfit.name : `${log.garmentIds.length} Garments Logged`);
            const loggedGarments = garments.filter(g => log.garmentIds.includes(g.id));

            return (
              <div 
                key={log.id} 
                className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-4 shadow-fabric flex items-start gap-4"
              >
                <div className="bg-[#edf2f7] p-3 rounded-lg border border-[#c4c6cc] text-center min-w-[70px]">
                  <span className="font-mono text-[10px] text-[#74777c] uppercase block">
                    {new Date(log.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short' })}
                  </span>
                  <span className="font-serif text-xl font-bold text-[#455565]">
                    {log.date.split('-')[2]}
                  </span>
                </div>

                <div className="flex-1">
                  <span className="font-mono text-xs text-[#735c00] font-semibold">{log.date}</span>
                  <h4 className="font-serif text-lg font-bold text-[#1b1c1b] mt-0.5">{title}</h4>
                  
                  {log.notes && (
                    <p className="font-sans text-xs text-[#43474c] mt-1 italic">"{log.notes}"</p>
                  )}

                  {/* Tiny swatches of worn items */}
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#f5f3f1]">
                    {loggedGarments.map((g, idx) => (
                      <div key={idx} className="w-7 h-7 rounded overflow-hidden border border-[#c4c6cc]" title={g.name}>
                        <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <span className="font-mono text-[11px] text-[#74777c] ml-1">
                      ({loggedGarments.length} {language === 'es' ? 'piezas' : 'items'})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Shirt, Check, Sparkles, Clock } from 'lucide-react';
import { WearLogEntry, GarmentItem, SavedOutfit, Language } from '../types';
import { useAccessibleModal } from '../hooks/useAccessibleModal';

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
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('');
  const [dayNotes, setDayNotes] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const todayStr = new Date().toISOString().split('T')[0];

  const monthNamesEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = language === 'es' ? monthNamesEs[month] : monthNamesEn[month];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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

  const { modalRef, closeOnBackdrop } = useAccessibleModal({
    isOpen: !!selectedDay,
    onClose: () => setSelectedDay(null),
    initialFocusRef: { current: null },
  });

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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">{t.title}</h2>
          <p className="font-sans text-sm text-[#A89B8C] mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1B1814] px-4 py-2 rounded-xl border border-[#2A2622] shadow-2xl">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-[#161210] rounded text-[#A89B8C] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-display text-lg font-bold text-[#F7F3EC] min-w-[160px] text-center">{monthName} {year}</span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-[#161210] rounded text-[#A89B8C] transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </header>

      <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-7 bg-[#161210] border-b border-[#2A2622]">
          {dayHeaders.map((dh, idx) => <div key={idx} className="py-3 px-2 text-center font-mono text-xs font-semibold text-[#A89B8C] uppercase tracking-wider">{dh}</div>)}
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-[#2A2622]">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="min-h-[110px] bg-[#0E0C0A]/60" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = formatDateString(dayNum);
            const logsForDay = wearLogs.filter(l => l.date === dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div key={`day-${dayNum}`} onClick={() => setSelectedDay(dateStr)} className={`min-h-[110px] p-2.5 transition-all cursor-pointer flex flex-col justify-between relative group ${isToday ? 'bg-[#C76B3F]/10 font-bold' : 'hover:bg-[#1B1814]'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-mono text-sm inline-flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-[#C76B3F] text-white shadow-sm font-bold' : 'text-[#F7F3EC]'}`}>{dayNum}</span>
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-[#A89B8C] hover:bg-[#161210] rounded transition-all"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[65px] scrollbar-hide">
                  {logsForDay.map(log => {
                    const outfit = savedOutfits.find(o => o.id === log.outfitId);
                    const label = log.outfitName || (outfit ? outfit.name : `${log.garmentIds.length} items logged`);
                    return (
                      <div key={log.id} className="bg-[#1B1814] border border-[#2A2622] text-[#A89B8C] px-2 py-1 rounded text-[11px] font-mono font-medium truncate shadow-sm flex items-center gap-1" title={label}>
                        <Shirt className="w-3 h-3 flex-shrink-0 text-[#C76B3F]" />
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

      {selectedDay && (
        <div
          className="fixed inset-0 z-50 bg-[#0E0C0A]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) {
              setSelectedDay(null);
            }
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-log-title"
            className="fabric-grain bg-[#1B1814] w-full max-w-md rounded-xl border border-[#2A2622] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="calendar-log-title" className="font-display text-xl font-bold text-[#F7F3EC] mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#C76B3F]" />
              <span>{t.logTitle} {selectedDay}</span>
            </h3>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.selectOutfit}</label>
                <select value={selectedOutfitId} onChange={e => setSelectedOutfitId(e.target.value)} className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none">
                  <option value="">-- {language === 'es' ? 'Selecciona Atuendo Guardado' : 'Select Saved Outfit'} --</option>
                  {savedOutfits.map(o => <option key={o.id} value={o.id}>{language === 'es' && o.nameEs ? o.nameEs : o.name} ({o.garmentIds.length} items)</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.notes}</label>
                <textarea value={dayNotes} onChange={e => setDayNotes(e.target.value)} placeholder={language === 'es' ? 'ej. Reunión en la oficina o paseo dominical' : 'e.g. Office presentation or Sunday walk'} rows={2} className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2622]">
                <button onClick={() => setSelectedDay(null)} className="px-4 py-2 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#161210] transition-colors">{t.cancel}</button>
                <button onClick={handleSaveDayLog} className="px-5 py-2 bg-[#C76B3F] text-white rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#A85A32]">{t.save}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="pt-8 border-t border-[#2A2622]">
        <h3 className="font-display text-2xl font-bold text-[#F7F3EC] mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#C76B3F]" />
          <span>{t.recentLogs}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wearLogs.map(log => {
            const outfit = savedOutfits.find(o => o.id === log.outfitId);
            const title = log.outfitName || (outfit ? outfit.name : `${log.garmentIds.length} Garments Logged`);
            const loggedGarments = garments.filter(g => log.garmentIds.includes(g.id));

            return (
              <div key={log.id} className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-4 shadow-2xl flex items-start gap-4">
                <div className="bg-[#161210] p-3 rounded-lg border border-[#2A2622] text-center min-w-[70px]">
                  <span className="font-mono text-[10px] text-[#A89B8C] uppercase block">{new Date(log.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short' })}</span>
                  <span className="font-display text-xl font-bold text-[#C76B3F]">{log.date.split('-')[2]}</span>
                </div>

                <div className="flex-1">
                  <span className="font-mono text-xs text-[#C76B3F] font-semibold">{log.date}</span>
                  <h4 className="font-display text-lg font-bold text-[#F7F3EC] mt-0.5">{title}</h4>

                  {log.notes && <p className="font-sans text-xs text-[#A89B8C] mt-1 italic">"{log.notes}"</p>}

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#2A2622]">
                    {loggedGarments.map((g, idx) => <div key={idx} className="w-7 h-7 rounded overflow-hidden border border-[#2A2622]" title={g.name}><img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" /></div>)}
                    <span className="font-mono text-[11px] text-[#A89B8C] ml-1">({loggedGarments.length} {language === 'es' ? 'piezas' : 'items'})</span>
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
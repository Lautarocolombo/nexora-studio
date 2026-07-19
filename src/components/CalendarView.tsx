import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Shirt, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('');
  const [dayNotes, setDayNotes] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const todayStr = new Date().toISOString().split('T')[0];

  const logsByDate = useMemo(() => {
    const map = new Map<string, WearLogEntry[]>();
    for (const log of wearLogs) {
      const existing = map.get(log.date);
      if (existing) existing.push(log);
      else map.set(log.date, [log]);
    }
    return map;
  }, [wearLogs]);

  const outfitIndex = useMemo(() => {
    const map = new Map<string, SavedOutfit>();
    for (const o of savedOutfits) map.set(o.id, o);
    return map;
  }, [savedOutfits]);

  const garmentIndex = useMemo(() => {
    const map = new Map<string, GarmentItem>();
    for (const g of garments) map.set(g.id, g);
    return map;
  }, [garments]);

  const monthNames = t('calendar.monthNames', { returnObjects: true }) as string[];
  const monthName = monthNames[month];

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
    const outfit = selectedOutfitId ? outfitIndex.get(selectedOutfitId) : undefined;
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

  const dayHeaders = [t('calendar.sun'), t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat')];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">{t('calendar.title')}</h2>
          <p className="font-sans text-sm text-[#A89B8C] mt-1">{t('calendar.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1B1814] px-4 py-2 rounded-xl border border-[#2A2622] shadow-2xl">
          <button onClick={handlePrevMonth} aria-label={t('calendar.prevMonth')} className="p-1 hover:bg-[#161210] rounded text-[#A89B8C] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-display text-lg font-bold text-[#F7F3EC] min-w-[160px] text-center">{monthName} {year}</span>
          <button onClick={handleNextMonth} aria-label={t('calendar.nextMonth')} className="p-1 hover:bg-[#161210] rounded text-[#A89B8C] transition-colors"><ChevronRight className="w-5 h-5" /></button>
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
            const logsForDay = logsByDate.get(dateStr) || [];
            const isToday = dateStr === todayStr;

            return (
              <button
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dateStr)}
                className={`min-h-[110px] w-full p-2.5 transition-all text-left flex flex-col justify-between relative group ${isToday ? 'bg-[#C76B3F]/10 font-bold' : 'hover:bg-[#1B1814]'}`}
                aria-label={language === 'es' ? `Día ${dayNum}, ${new Date(year, month, dayNum).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}` : `Day ${dayNum}, ${new Date(year, month, dayNum).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-mono text-sm inline-flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-[#C76B3F] text-white shadow-sm font-bold' : 'text-[#F7F3EC]'}`}>{dayNum}</span>
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-[#A89B8C] hover:bg-[#161210] rounded transition-all" aria-label={language === 'es' ? 'Registrar uso' : 'Log wear'}><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[65px] scrollbar-hide">
                  {logsForDay.map(log => {
                    const outfit = log.outfitId ? outfitIndex.get(log.outfitId) : undefined;
                    const label = log.outfitName || (outfit ? outfit.name : t('calendar.itemsLogged', { count: log.garmentIds.length }));
                    return (
                      <div key={log.id} className="bg-[#1B1814] border border-[#2A2622] text-[#A89B8C] px-2 py-1 rounded text-xs font-mono font-medium truncate shadow-sm flex items-center gap-1" title={label}>
                        <Shirt className="w-3 h-3 flex-shrink-0 text-[#C76B3F]" />
                        <span className="truncate">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </button>
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
              <span>{t('calendar.logTitle')} {selectedDay}</span>
            </h3>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('calendar.selectOutfit')}</label>
                <select value={selectedOutfitId} onChange={e => setSelectedOutfitId(e.target.value)} className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none">
                  <option value="">-- {t('calendar.selectOutfitOption')} --</option>
                  {savedOutfits.map(o => <option key={o.id} value={o.id}>{language === 'es' && o.nameEs ? o.nameEs : o.name} ({o.garmentIds.length} items)</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('calendar.notes')}</label>
                <textarea value={dayNotes} onChange={e => setDayNotes(e.target.value)} placeholder={t('calendar.placeholder')} rows={2} className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2622]">
                <button onClick={() => setSelectedDay(null)} className="px-4 py-2 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#161210] transition-colors">{t('calendar.cancel')}</button>
                <button onClick={handleSaveDayLog} className="px-5 py-2 bg-[#C76B3F] text-white rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#A85A32]">{t('calendar.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="pt-8 border-t border-[#2A2622]">
        <h3 className="font-display text-2xl font-bold text-[#F7F3EC] mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#C76B3F]" />
          <span>{t('calendar.recentLogs')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wearLogs.map(log => {
            const outfit = log.outfitId ? outfitIndex.get(log.outfitId) : undefined;
            const title = log.outfitName || (outfit ? outfit.name : t('calendar.itemsLogged', { count: log.garmentIds.length }));
            const loggedGarments = log.garmentIds.map(id => garmentIndex.get(id)).filter((g): g is GarmentItem => !!g);

            return (
              <div key={log.id} className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-4 shadow-2xl flex items-start gap-4">
                <div className="bg-[#161210] p-3 rounded-lg border border-[#2A2622] text-center min-w-[70px]">
                  <span className="font-mono text-xs text-[#A89B8C] uppercase block">{new Date(log.date).toLocaleDateString(t('calendar.locale'), { month: 'short' })}</span>
                  <span className="font-display text-xl font-bold text-[#C76B3F]">{log.date.split('-')[2]}</span>
                </div>

                <div className="flex-1">
                  <span className="font-mono text-xs text-[#C76B3F] font-semibold">{log.date}</span>
                  <h4 className="font-display text-lg font-bold text-[#F7F3EC] mt-0.5">{title}</h4>

                  {log.notes && <p className="font-sans text-xs text-[#A89B8C] mt-1 italic">"{log.notes}"</p>}

                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#2A2622]">
                    {loggedGarments.map((g, idx) => <div key={idx} className="w-7 h-7 rounded overflow-hidden border border-[#2A2622]" title={g.name}><img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" /></div>)}
                    <span className="font-mono text-xs text-[#A89B8C] ml-1">({loggedGarments.length} {t('calendar.itemsCount')})</span>
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

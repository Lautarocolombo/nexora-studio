type AnalyticsEvent = {
  name: string;
  timestamp: number;
  tab?: string;
  metadata?: Record<string, string | number | boolean>;
};

const MAX_EVENTS = 200;

export function trackEvent(name: string, metadata?: Record<string, string | number | boolean>) {
  try {
    const raw = localStorage.getItem('outfitmatic_analytics');
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.push({
      name,
      timestamp: Date.now(),
      metadata,
    });
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
    localStorage.setItem('outfitmatic_analytics', JSON.stringify(events));
  } catch {
    // ignore storage errors
  }
}

export function useAnalytics() {
  return {
    trackEvent,
  };
}

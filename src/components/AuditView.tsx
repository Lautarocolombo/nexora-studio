import React, { useMemo } from 'react';
import {
  ShieldCheck,
  Gauge,
  Palette,
  Users,
  Globe,
  Zap,
  BookOpen,
  Search,
  Brain,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type AuditStatus = 'excellent' | 'improvable' | 'critical';

function statusToDot(status: AuditStatus, t: (key: string) => string) {
  if (status === 'excellent') return { bg: '#1EBD76', text: '#052010', label: t('audit.excellent') };
  if (status === 'improvable') return { bg: '#F5B301', text: '#201503', label: t('audit.improvable') };
  return { bg: '#FF3B30', text: '#2B0000', label: t('audit.critical') };
}

function MetricBar({ label, value, tone }: { label: string; value: number; tone: 'primary' | 'warn' | 'danger' }) {
  const color = tone === 'primary' ? '#C76B3F' : tone === 'warn' ? '#F5B301' : '#FF3B30';
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-[#A89B8C]">{label}</span>
        <span className="font-mono text-xs font-bold text-[#F7F3EC]">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#161210] border border-[#2A2622] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function StatusCard({
  title,
  status,
  description,
  icon,
  t,
}: {
  title: string;
  status: AuditStatus;
  description: string;
  icon: React.ReactNode;
  t: (key: string) => string;
}) {
  const dot = statusToDot(status, t);
  return (
    <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="text-[#C76B3F]">{icon}</div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#F7F3EC]">{title}</h3>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2A2622]" style={{ backgroundColor: dot.bg, color: dot.text }}>
              <span className="text-xs font-mono font-bold">{dot.label}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 font-sans text-sm text-[#A89B8C] leading-relaxed">{description}</p>
    </div>
  );
}

const now = new Date();

export function AuditView() {
  const { t, i18n } = useTranslation();
  const scores = useMemo(
    () => ({
      general: 78,
      frontend: 92,
      backend: 78,
      ui: 95,
      ux: 91,
      seo: 70,
      performance: 96,
      accessibility: 68,
      documentation: 60,
      testing: 40,
      deployment: 90,
      optimization: 82,
    }),
    []
  );

  const completion = 80;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#F7F3EC] tracking-tight">
            {t('audit.title')}
          </h2>
          <p className="font-sans text-sm text-[#A89B8C] mt-1">
            {t('audit.subtitle')}
          </p>
        </div>
        <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-4 shadow-2xl w-full md:w-[360px]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A89B8C]">{t('audit.generalProgress')}</span>
            <span className="font-display text-xl font-bold text-[#C76B3F]">{completion}%</span>
          </div>
          <div className="h-3 mt-3 rounded-full bg-[#161210] border border-[#2A2622] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${completion}%`, backgroundColor: '#C76B3F' }}
            />
          </div>
          <p className="mt-3 font-mono text-xs text-[#A89B8C]">
            {t('audit.lastUpdate')} {now.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US')}
          </p>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <MetricBar label={t('audit.frontend')} value={scores.frontend} tone="primary" />
        <MetricBar label={t('audit.backend')} value={scores.backend} tone="warn" />
        <MetricBar label={t('audit.ui')} value={scores.ui} tone="primary" />
        <MetricBar label={t('audit.ux')} value={scores.ux} tone="primary" />
        <MetricBar label={t('audit.seo')} value={scores.seo} tone="warn" />
        <MetricBar label={t('audit.performance')} value={scores.performance} tone="primary" />
        <MetricBar label={t('audit.accessibility')} value={scores.accessibility} tone="danger" />
        <MetricBar label={t('audit.documentation')} value={scores.documentation} tone="warn" />
        <MetricBar label={t('audit.testing')} value={scores.testing} tone="danger" />
      </section>

      {/* Estado por dominios */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatusCard
          title={t('audit.statusBackend')}
          status="improvable"
          description={t('audit.descBackend')}
          icon={<ShieldCheck className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusFrontend')}
          status="excellent"
          description={t('audit.descFrontend')}
          icon={<Gauge className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusDatabase')}
          status="improvable"
          description={t('audit.descDatabase')}
          icon={<BookOpen className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusResponsive')}
          status="excellent"
          description={t('audit.descResponsive')}
          icon={<Palette className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusSecurity')}
          status="critical"
          description={t('audit.descSecurity')}
          icon={<AlertTriangle className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusArchitecture')}
          status="improvable"
          description={t('audit.descArchitecture')}
          icon={<Brain className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusScalability')}
          status="improvable"
          description={t('audit.descScalability')}
          icon={<Users className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusDocumentation')}
          status="improvable"
          description={t('audit.descDocumentation')}
          icon={<BookOpen className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusOptimization')}
          status="excellent"
          description={t('audit.descOptimization')}
          icon={<Zap className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusConversion')}
          status="improvable"
          description={t('audit.descConversion')}
          icon={<TrendingUp className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusUX')}
          status="excellent"
          description={t('audit.descUX')}
          icon={<Users className="w-5 h-5" />}
          t={t}
        />
        <StatusCard
          title={t('audit.statusSEO')}
          status="critical"
          description={t('audit.descSEO')}
          icon={<Globe className="w-5 h-5" />}
          t={t}
        />
      </section>

      {/* Roadmap, dashboards y plan de tareas se agregan en iteraciones siguientes */}

      <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl">
        <h3 className="font-display text-xl font-bold text-[#F7F3EC]">{t('audit.modules')}</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">{t('audit.moduleAccessibility')}</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              {t('audit.moduleAccessibilityDesc')}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">{t('audit.moduleSecurity')}</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              {t('audit.moduleSecurityDesc')}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">{t('audit.moduleSEOPerformance')}</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              {t('audit.moduleSEOPerformanceDesc')}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">{t('audit.moduleTesting')}</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              {t('audit.moduleTestingDesc')}
            </p>
          </div>
        </div>
      </section>

      <section className="text-[#A89B8C] text-xs font-mono">
        {t('audit.note')}
      </section>

      <div className="h-2" aria-hidden="true" />
    </div>
  );
}


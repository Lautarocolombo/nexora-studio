import React, { useMemo } from 'react';
import {
  ShieldCheck,
  Gauge,
  Palette,
  Users,
  Globe,
  Accessibility,
  Zap,
  BookOpen,
  Search,
  Brain,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { TabType } from '../types';

type AuditStatus = 'excellent' | 'improvable' | 'critical';

function statusToDot(status: AuditStatus) {
  if (status === 'excellent') return { bg: '#1EBD76', text: '#052010', label: '🟢 Excelente' };
  if (status === 'improvable') return { bg: '#F5B301', text: '#201503', label: '🟡 Mejorable' };
  return { bg: '#FF3B30', text: '#2B0000', label: '🔴 Crítico' };
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
}: {
  title: string;
  status: AuditStatus;
  description: string;
  icon: React.ReactNode;
}) {
  const dot = statusToDot(status);
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
const weekLabel = `Semana ${Math.ceil((now.getDate() + 1) / 7)}`;

export function AuditView() {
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
            Panel de Auditoría
          </h2>
          <p className="font-sans text-sm text-[#A89B8C] mt-1">
            Estado del producto enterprise: calidad, UX/UI, SEO, accesibilidad, performance, seguridad y escalabilidad.
          </p>
        </div>
        <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-4 shadow-2xl w-full md:w-[360px]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A89B8C]">Progreso General</span>
            <span className="font-display text-xl font-bold text-[#C76B3F]">{completion}%</span>
          </div>
          <div className="h-3 mt-3 rounded-full bg-[#161210] border border-[#2A2622] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${completion}%`, backgroundColor: '#C76B3F' }}
            />
          </div>
          <p className="mt-3 font-mono text-[11px] text-[#A89B8C]">
            Última actualización: {now.toLocaleDateString('es-ES')}
          </p>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <MetricBar label="Frontend" value={scores.frontend} tone="primary" />
        <MetricBar label="Backend" value={scores.backend} tone="warn" />
        <MetricBar label="UI" value={scores.ui} tone="primary" />
        <MetricBar label="UX" value={scores.ux} tone="primary" />
        <MetricBar label="SEO" value={scores.seo} tone="warn" />
        <MetricBar label="Performance" value={scores.performance} tone="primary" />
        <MetricBar label="Accesibilidad" value={scores.accessibility} tone="danger" />
        <MetricBar label="Documentación" value={scores.documentation} tone="warn" />
        <MetricBar label="Testing" value={scores.testing} tone="danger" />
      </section>

      {/* Estado por dominios */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatusCard
          title="Backend"
          status="improvable"
          description="Persistencia local via IndexedDB funciona, pero falta capa de validación, normalización, versionado de esquema y contratos de datos para producción."
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatusCard
          title="Frontend"
          status="excellent"
          description="Buen uso de code-splitting (lazy/Suspense) y componentes reutilizables. Principal gap: accesibilidad modal/semántica y manejo de errores."
          icon={<Gauge className="w-5 h-5" />}
        />
        <StatusCard
          title="Base de datos"
          status="improvable"
          description="IndexedDB correcto, pero faltan estrategias de migración por versión, índices, y un patrón unificado de lecturas/escrituras."
          icon={<BookOpen className="w-5 h-5" />}
        />
        <StatusCard
          title="Responsive"
          status="excellent"
          description="Navbar superior/bottom y grids adaptativos. Para WCAG/UX falta consistencia en estados de foco y targets táctiles mínimos."
          icon={<Palette className="w-5 h-5" />}
        />
        <StatusCard
          title="Seguridad"
          status="critical"
          description="Auth es demo (hash local) y admin es controlado por UI. En producción se requiere backend real, roles/permisos y mitigación de XSS/CSRF."
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatusCard
          title="Arquitectura"
          status="improvable"
          description="Lógica y estado centralizados en App.tsx sin capa de servicios/validación. Falta modularización de UI-state (modals/toasts/errors)."
          icon={<Brain className="w-5 h-5" />}
        />
        <StatusCard
          title="Escalabilidad"
          status="improvable"
          description="Sin caching, sin estrategia de paginación para listas grandes y sin modelo de datos formal. Para enterprise se necesita capa de repository y selectores memoizados."
          icon={<Users className="w-5 h-5" />}
        />
        <StatusCard
          title="Documentación"
          status="improvable"
          description="Existe README pero falta documentación técnica: decisiones de diseño, guía de accesibilidad, contratos de datos y checklist de releases."
          icon={<BookOpen className="w-5 h-5" />}
        />
        <StatusCard
          title="Optimización"
          status="excellent"
          description="Lazy-loading de vistas y animaciones controladas. Se requiere una auditoría extra: imágenes (sizes/srcset), charts memoization y manejo de Reduce Motion."
          icon={<Zap className="w-5 h-5" />}
        />
        <StatusCard
          title="Conversión"
          status="improvable"
          description="La UX está orientada a valor (guardarropa/armado). Para CRO se necesitan microcopy, CTAs medibles, onboarding y medición de eventos."
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatusCard
          title="Experiencia de usuario"
          status="excellent"
          description="Flujo claro por secciones, jerarquía visual consistente. Para enterprise: accesibilidad completa (teclado/ARIA) y mejoras en feedback de formularios."
          icon={<Users className="w-5 h-5" />}
        />
        <StatusCard
          title="SEO"
          status="critical"
          description="SPA sin SSR: indexabilidad y metadata por ruta insuficiente para un plan enterprise. Se requiere pre-render/SSR y estructura semántica por vista."
          icon={<Globe className="w-5 h-5" />}
        />
      </section>

      {/* Roadmap, dashboards y plan de tareas se agregan en iteraciones siguientes */}

      <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl">
        <h3 className="font-display text-xl font-bold text-[#F7F3EC]">Módulos — Próximos pasos inmediatos</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">Accesibilidad</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              Corregir modales y semántica de controles, añadir trap de foco, aria-modal y soporte de teclado.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">Seguridad</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              Sustituir auth demo por backend real, roles/permisos y protección de endpoints. Eliminar confirm() por modales accesibles.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">SEO & Performance</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              Implementar SSR/pre-render + optimizar imágenes (srcset/sizes) y reducir coste de render en charts.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#161210] border border-[#2A2622]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C76B3F]" />
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase">Testing & Release</span>
            </div>
            <p className="mt-2 font-sans text-sm text-[#A89B8C]">
              Añadir suite de tests (unit + e2e), pipeline CI/CD y checklist de performance para garantizar Lighthouse objetivo.
            </p>
          </div>
        </div>
      </section>

      <section className="text-[#A89B8C] text-xs font-mono">
        Nota: este panel está diseñado para actuar como “single source of truth” de auditoría. La siguiente iteración llenará Roadmap + dashboards semanal/mensual + gestión de tareas.
      </section>

      <div className="h-2" aria-hidden="true" />
    </div>
  );
}


# TODO - Producto empresarial (outfitmatic)

## Fase 0 — Preparación (Audit & Planning)
- [x] Recopilar estructura del repo.
- [x] Leer archivos clave: App, estilos, Navbar.
- [x] Leer vistas y componentes: WardrobeView, OutfitBuilder, CalendarView, StatsView, ProfileView, HelpView, AdminPanel.
- [x] Leer componentes base: GarmentCard, GarmentDetailModal, AddGarmentModal, AuthGuard.
- [x] Leer librerías: lib/auth, lib/db, types, imageStorage.
- [ ] Generar y actualizar `AUDITORIA.md` con puntuaciones 1-10 por elemento.
- [x] Crear Panel de Auditoría en la app (tab `audit`) + métricas.

- [ ] Agregar KPIs semanal/mensual y gestión de tareas (modelos + UI).

## Fase 1 — Accesibilidad (WCAG)
- [ ] Implementar patrón de modal accesible (role/aria, trap de foco, Esc).
- [ ] Mejorar semántica y navegación por teclado (especialmente elementos clickables tipo div).
- [ ] Normalizar focus-visible y estados de error.

## Fase 2 — Performance
- [ ] Auditoría de imágenes (sizes, decoding async, lazy donde aplique).
- [ ] Reducir trabajo de render (memoización en charts y filtros grandes).

## Fase 3 — Seguridad
- [ ] Validación/normalización de `imageUrl` y sanitización de texto.
- [ ] Sustituir `confirm()` por modales accesibles reutilizables.

## Fase 4 — SEO empresarial
- [ ] Mejorar metadatos dinámicos por vista (title/description).
- [ ] Preparar ruta para SSR/pre-render (si aplica) o ajustar semántica.

## Fase 5 — Producción
- [ ] `npm run lint` / `npm run typecheck` / `npm run build`.
- [ ] Validar Lighthouse objetivo (>=95) con checklist de performance.


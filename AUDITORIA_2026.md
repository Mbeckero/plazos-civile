# Auditoría técnica y plan de modernización (estándares 2026)

## Resumen ejecutivo

Este repositorio es una SPA de React + Vite + TypeScript para cálculo de plazos judiciales chilenos. La base es sólida para un MVP, pero hoy tiene riesgos claros de **exactitud legal**, **mantenibilidad** y **calidad de entrega**.

Prioridades:
1. Corregir exactitud de cálculo de plazos y feriados por año.
2. Subir calidad TypeScript/ESLint y estabilizar toolchain.
3. Estandarizar arquitectura de dominio y pruebas automáticas.
4. Endurecer seguridad, observabilidad y compliance legal.

## Hallazgos críticos

### 1) Riesgo legal por feriados hardcodeados a 2024
- `src/lib/legal-utils.ts` define `chileanHolidays2024` fijo.
- En 2026, cualquier cálculo para años distintos de 2024 puede ser incorrecto.
- Impacto: potencial error en fechas límite judiciales.

### 2) Tipado débil en configuración TypeScript
- `strict: false`, `noImplicitAny: false`, `noUnusedLocals: false` en `tsconfig.app.json`.
- Esto permite errores silenciosos y deuda técnica creciente.

### 3) Linting y cadena de instalación frágiles
- Dependencias con conflicto de peer (`react-day-picker` vs `date-fns@4`) bloquean instalación estándar.
- Sin pipeline de validación reproducible, aumenta riesgo de “works on my machine”.

### 4) Señales de higiene de código mejorables
- Imports no usados en `LegalDeadlineCalculator`.
- Import de `cn` al final del archivo en `DeadlineResult.tsx` (válido, pero no convencional y afecta legibilidad).

### 5) Arquitectura aún monolítica en capa de UI/dominio
- Lógica de reglas de negocio centralizada en un único módulo sin separación de:
  - fuentes de calendario legal,
  - motor de cómputo de plazo,
  - validaciones normativas versionadas.

## Plan recomendado (2026)

## Fase 1 (1-2 semanas): “Confiabilidad mínima de producción”

1. **Motor de feriados por año**
   - Reemplazar lista estática por proveedor anual:
     - API oficial o dataset versionado;
     - fallback offline cacheado;
     - tests por año judicial.

2. **Normalización temporal robusta**
   - Definir timezone legal explícita (`America/Santiago`).
   - Convertir todas las operaciones a utilidades puras de fecha.

3. **Toolchain consistente**
   - Resolver conflicto `date-fns` / `react-day-picker`.
   - Congelar versión de Node (por ejemplo `.nvmrc` y engines en `package.json`).
   - Añadir scripts: `typecheck`, `test`, `lint:strict`, `format:check`.

4. **TypeScript estricto incremental**
   - Activar `strict: true` por etapas con baseline de errores.
   - Activar `noUnusedLocals` y `noUnusedParameters`.

## Fase 2 (2-4 semanas): “Arquitectura escalable”

1. **Separación por dominio**
   - `src/domain/deadlines/*` para reglas.
   - `src/infrastructure/holidays/*` para proveedores externos.
   - `src/features/calculator/*` para UI específica.

2. **Modelado de tipos legales fuerte**
   - `LegalDeadlineType` como unión discriminada (`business_days | calendar_days | months`).
   - Catálogo legal tipado con metadata de vigencia (`validFrom`, `validTo`).

3. **Pruebas**
   - Unitarias de cálculo con casos frontera (feriados móviles, cambio de mes/año, DST).
   - Contract tests del proveedor de feriados.
   - E2E de flujo principal (Playwright/Cypress).

## Fase 3 (4-8 semanas): “Producto 2026-ready”

1. **Cumplimiento y trazabilidad**
   - Registrar versión de reglas legales aplicada en cada cálculo.
   - Mostrar disclaimer legal y bitácora auditable.

2. **Observabilidad**
   - Logging estructurado de errores de cálculo.
   - Métricas de uso por tipo de trámite.

3. **Experiencia de usuario**
   - Guardado de casos en backend (no sólo estado local).
   - Integración real con calendarios (Google, iCal, Outlook).

4. **Accesibilidad y rendimiento**
   - Auditoría WCAG 2.2 AA.
   - Presupuesto de performance y code splitting por rutas.

## Métricas objetivo sugeridas

- Cobertura dominio de cálculo: >= 90%.
- Errores de producción P1 por cálculo: 0.
- Tiempo de build CI: < 5 min.
- Lighthouse (mobile): >= 90 en Performance/Accessibility/Best Practices.

## Backlog técnico corto (acciones inmediatas)

1. Limpiar imports no usados y estandarizar orden de imports.
2. Documentar reglas legales asumidas y alcance del MVP.
3. Agregar `CONTRIBUTING.md` con flujo de calidad local.
4. Introducir `vitest` + primera batería de tests de `calculateLegalDeadline`.
5. Evaluar migración a catálogo legal externo versionado.

---

Este plan prioriza primero la **correctitud jurídica** (riesgo principal del producto), luego calidad de ingeniería y finalmente escalamiento de producto.

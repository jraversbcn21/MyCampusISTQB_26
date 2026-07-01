# Diseño — Expansión de contenido y banco de preguntas (ISTQB CTFL v4.0)

**Fecha:** 2026-07-01
**Autor:** Jorge + Claude
**Estado:** Aprobado (pendiente revisión de spec por usuario)

## Objetivo

Elevar la fidelidad y profundidad del contenido de MyCampus ISTQB frente al syllabus
oficial **ISTQB Certified Tester Foundation Level (CTFL) v4.0**, en tres frentes:
banco de preguntas, lecciones y glosario. **Regla transversal e innegociable:** todo
dato (pregunta, corrección de contenido, término de glosario) debe llevar una `source`
citada y corroborable contra material oficial. Nada se inventa; si un dato no puede
corroborarse en las fuentes, no entra.

## Principio de trazabilidad (aplica a las 3 fases)

Fuentes oficiales aceptadas, en orden de prioridad:

1. **ISTQB CTFL Syllabus v4.0** — `ISTQB_CTFL_Syllabus.pdf` (EN) e `ISTQB sillabus ES.pdf` (ES).
   Texto ya extraído a `scratchpad/syllabus_en.txt` y `scratchpad/syllabus_es.txt`.
2. **Exámenes de muestra oficiales** — `ISTQB_CTFL 4.0_Sample-ExamA-v1.0-Questions_es_.pdf`
   y `Ejemplo preguntas test ISTQB.pdf`.
3. **Libro** *Foundations of software testing – ISTQB Certification*.
4. **Glosario oficial** — `glossary.istqb.org/es_ES` (solo definiciones; ver Fase 3 sobre
   la fragilidad de esta fuente).

Cada elemento de datos gana un campo `source` (string legible) que apunta a la sección o
documento concreto. Formato: `"Syllabus v4.0 §4.2.1"`, `"Sample Exam A Q12"`, etc.

## Datos oficiales de referencia (extraídos del syllabus)

Objetivos de aprendizaje (LOs) por capítulo y su nivel cognitivo (K), extraídos de
`syllabus_en.txt`:

| Cap | Título | LOs | Niveles K | Peso examen (40) |
|-----|--------|:---:|-----------|:---:|
| 1 | Fundamentos del Testing | 15 | K1×3, K2×12 | 8 |
| 2 | Testing a lo largo del SDLC | 11 | K1×2, K2×9 | 6 |
| 3 | Testing Estático | 10 | K1×4, K2×6 | 4 |
| 4 | Análisis y Diseño de Pruebas | 15 | K2×7, K3×8 | 12 |
| 5 | Gestión de las Actividades de Prueba | 17 | K1×4, K2×10, K3×3 | 8 |
| 6 | Herramientas de Soporte | 2 | K1×1, K2×1 | 2 |
| | **Total** | **70** | K1×14, K2×45, K3×11 | **40** |

Distribución oficial del examen (40 preguntas) tomada de las "Exam Structure Tables" v4.0.

---

## Fase 1 — Banco de preguntas (50 → 120+)

### Alcance
Ampliar `js/questions.js` de 50 a **~120 preguntas**, corrigiendo la distribución para
que refleje la ponderación oficial del examen.

### Distribución objetivo (escalado 3× del examen oficial)

| Cap (index) | Tema | Oficial (40) | Objetivo (120) | Actual | Δ a añadir |
|:---:|------|:---:|:---:|:---:|:---:|
| 0 | Fundamentos | 8 | 24 | 10 | +14 |
| 1 | SDLC | 6 | 18 | 9 | +9 |
| 2 | Testing Estático | 4 | 12 | 6 | +6 |
| 3 | Análisis y Diseño | 12 | 36 | 11 | +25 |
| 4 | Gestión | 8 | 24 | 8 | +16 |
| 5 | Herramientas | 2 | 6 | 6 | 0 |
| | **Total** | **40** | **120** | **50** | **+70** |

Nota: el banco actual infra-representa el Cap.4 (el más pesado del examen real) y
sobre-representa el Cap.6. Esta corrección mejora la fidelidad al examen.

### Cambio de schema (retrocompatible)
Cada pregunta gana 3 campos opcionales. El código actual (`startExam`, `startChapterExam`,
`renderExamQuestion`) **no requiere cambios** porque solo lee `q`, `options`, `correct`,
`explanation`, `chapter`:

```js
{
  id: 51, chapter: 3,
  lo: "FL-4.2.1",                              // objetivo de aprendizaje oficial
  k: 3,                                         // nivel cognitivo (1|2|3)
  source: "Syllabus v4.0 §4.2.1 / Sample Exam A Q12",
  q:           { es: "...", en: "..." },
  options:     { es: [...], en: [...] },
  correct:     1,
  explanation: { es: "...", en: "..." }
}
```

### Reglas de calidad por pregunta
- Bilingüe (es/en), 4 opciones, una correcta, explicación que justifique la correcta y
  (cuando aporte) por qué las otras no.
- Cada pregunta mapea a un LO real (`lo`) y respeta su nivel K (las K3 del Cap.4/5 deben
  ser preguntas de *aplicación*: calcular particiones, valores límite, cobertura, etc., no
  de memoria).
- Las preguntas derivadas de exámenes de muestra oficiales citan el ítem exacto en `source`.
- No duplicar preguntas ya existentes; revisar el pool actual antes de añadir.

### Verificación de Fase 1
- Conteo por capítulo coincide con la tabla objetivo (script de conteo).
- `node -e` o carga en navegador sin errores de sintaxis; `App.startExam('full')` toma 40
  del pool de 120 sin repetir.
- Cada nueva pregunta tiene `lo` + `source` no vacíos.

---

## Fase 2 — Auditoría de contenido (28 lecciones)

### Alcance
Revisar las lecciones existentes en `js/content.js` contra el syllabus. **No reescribir
prosa que ya es correcta.** Corregir imprecisiones, cubrir conceptos examinables faltantes,
citar fuente.

### Método por lección
1. Mapear la lección a su(s) LO(s) oficial(es) (ej. "1.3 Los 7 Principios" → `FL-1.3.1`).
2. Verificar contra `syllabus_es.txt`/`syllabus_en.txt`: terminología, cobertura del LO,
   ausencia de afirmaciones imprecisas.
3. Corregir solo lo incorrecto o incompleto.
4. Añadir pie de fuente a la lección.

### Cambio de schema (contenido)
Cada tema en `CHAPTERS` gana trazabilidad:
```js
{ id: "1.3", title: {...}, xp: 50,
  lo: ["FL-1.3.1"],
  source: "Syllabus v4.0 §1.3" }
```
Y el HTML de cada lección lleva un pie discreto (nueva clase CSS `.lesson-source`):
```html
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §1.3 · Glosario ISTQB</p>
```

### Detección de gaps a verificar explícitamente
Confirmar cobertura de secciones densas del syllabus v4.0:
- §3.2.3 roles y responsabilidades en revisiones
- §5.1.4–5.1.5 estimación y priorización de casos de prueba
- §5.5 gestión de defectos (defect management)
- §4.x niveles de cobertura por técnica (EP, BVA, tabla de decisión, transición de estados)

Si alguno falta, se añade como contenido nuevo citado.

### Entregable
Informe `docs/content-audit-report.md`: por lección → LO mapeado, veredicto
(✅ correcta / ⚠️ corregida / ➕ ampliada) y resumen del cambio.

### Verificación de Fase 2
- Toda lección tiene `lo` + `source`.
- El informe de auditoría cubre las 28 lecciones.
- Revisión manual en navegador de una muestra: pie de fuente visible, sin roto de layout.

---

## Fase 3 — Glosario

### Alcance
Ampliar `GLOSSARY` en `js/content.js` con los términos oficiales marcados como *keywords*
examinables (K1) en el syllabus.

### Fuente
- **Primaria:** los *keywords* listados bajo cada encabezado de capítulo en el syllabus
  (ya presentes en el texto extraído) — lista canónica de términos examinables. Definiciones
  desde el propio syllabus / libro.
- **Complementaria (fallback):** `glossary.istqb.org/es_ES` para definiciones faltantes vía
  `WebFetch`. Es una SPA con JS pesado; si `WebFetch` no basta, `npx playwright install
  chromium` + script puntual. **No es el camino principal** por fragilidad de red.

### Cambio de schema (glosario)
```js
{ term: "Partición de equivalencia", def: { es: "...", en: "..." }, chapter: "4",
  source: "Syllabus v4.0 keywords §4 · Glosario ISTQB" }
```

### Verificación de Fase 3
- Todos los keywords del syllabus están representados en `GLOSSARY`.
- Cada término tiene `def` (es/en) + `source`.
- Búsqueda de glosario en la app sigue funcionando (filtro por letra y por texto).

---

## Fuera de alcance (YAGNI)
- No se cambia el motor de examen, gamificación, auth ni sync.
- No se añade UI nueva salvo el pie de fuente en lecciones.
- No se toca la carpeta de referencia `ISTQB 2026/` (material oficial de solo lectura).
- Monetización / Stripe: fuera de este trabajo.

## Riesgos
- **Deriva de contenido inventado:** mitigado por la regla de `source` obligatoria y
  verificación de conteo/campos.
- **Fuente web frágil (glosario):** mitigado usando el syllabus como fuente primaria.
- **Tamaño del diff en `questions.js`:** +70 preguntas es un archivo grande; se hace por
  capítulo en tandas verificables.

## Orden de ejecución
Fase 1 → verificar → Fase 2 → verificar → Fase 3 → verificar. Cada fase tendrá su propio
plan de implementación (writing-plans) si su tamaño lo justifica.

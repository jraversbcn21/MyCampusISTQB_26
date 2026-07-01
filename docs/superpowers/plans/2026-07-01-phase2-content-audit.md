# Fase 2 — Auditoría de Contenido (22 lecciones) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auditar las 22 lecciones de `js/content.js` contra el ISTQB CTFL Syllabus v4.0 oficial, corrigiendo solo lo incorrecto/incompleto, y añadir trazabilidad (`lo`, `source`) a cada tema más un pie de fuente visible en cada lección.

**Architecture:** `CHAPTERS` (array de capítulos con `topics`) gana campos `lo`/`source` por tema — puramente aditivo, sin tocar el motor de render (`App.renderLesson()` en `js/app.js` ya lee `topic.xp`, `topic.title`; añadir `lo`/`source` no rompe nada). El contenido HTML en `LESSONS[id].es/en.content` se corrige donde el syllabus lo requiera y gana un párrafo `<p class="lesson-source">` al final (mismo patrón que las cajas `.highlight-box`/`.example-box`/`.warning-box` ya existentes). Un nuevo script Node `scripts/validate-content.js` (hermano de `scripts/validate-questions.js`, mismo patrón, no se fusiona con él porque valida una forma de datos distinta) actúa como arnés de test. Un informe `docs/content-audit-report.md` registra el veredicto por lección.

**Tech Stack:** Vanilla JS (dato en `js/content.js`, estilos en `css/styles.css`), Node 18 (solo para el validador de desarrollo).

## Global Constraints

- **Fuente obligatoria:** cada tema (`topic`) en `CHAPTERS.*.topics[]` debe tener `lo` (array no vacío de códigos `FL-x.y.z`) y `source` (string no vacío citando el syllabus). Nada se inventa; toda corrección debe basarse en `ISTQB_CTFL_Syllabus.pdf` / `ISTQB sillabus ES.pdf` (ya extraídos como texto plano — ver "Fuentes" en cada task).
- **No reescribir prosa correcta:** solo corregir imprecisiones o completar conceptos examinables que falten. Si una lección ya es correcta, se documenta como ✅ y solo se le añaden `lo`/`source` + el pie de fuente — no se reescribe su contenido.
- **Retrocompatibilidad:** no cambiar `js/app.js` (motor de render), `js/gamification.js`, `js/questions.js`, ni el schema de `topic.id`/`topic.title`/`topic.xp` ya existentes. Los campos `lo`/`source` son aditivos.
- **Bilingüe:** el pie de fuente se añade tanto en `LESSONS[id].es.content` como en `LESSONS[id].en.content`.
- **Mapeo LO↔lección:** el id de cada tema (p.ej. `"4.2"`) corresponde directamente a la sección del syllabus §4.2, que agrupa uno o más objetivos de aprendizaje `FL-4.2.x`. El mapeo completo tema→LOs está fijado en la tabla de la sección "Mapeo de referencia" más abajo — úsalo tal cual, no lo re-derives.
- **Total de lecciones:** 22 (Cap.1=5, Cap.2=4, Cap.3=2, Cap.4=5, Cap.5=5, Cap.6=1). Esta cifra es la real verificada en código — el spec original decía "28" por una estimación incorrecta; **22 es la cifra correcta a usar en todo el trabajo de esta fase.**

## Mapeo de referencia (tema → objetivos de aprendizaje oficiales)

| Tema (`topic.id`) | Título | LOs (`lo`) |
|---|---|---|
| 1.1 | ¿Qué es el testing? | FL-1.1.1, FL-1.1.2 |
| 1.2 | ¿Por qué es necesario el testing? | FL-1.2.1, FL-1.2.2, FL-1.2.3 |
| 1.3 | Los 7 Principios del Testing | FL-1.3.1 |
| 1.4 | Actividades, testware y roles | FL-1.4.1, FL-1.4.2, FL-1.4.3, FL-1.4.4, FL-1.4.5 |
| 1.5 | Habilidades esenciales en testing | FL-1.5.1, FL-1.5.2, FL-1.5.3 |
| 2.1 | Testing en el contexto del SDLC | FL-2.1.1, FL-2.1.2, FL-2.1.3, FL-2.1.4, FL-2.1.5, FL-2.1.6 |
| 2.2 | Niveles de prueba | FL-2.2.1 |
| 2.3 | Tipos de prueba | FL-2.2.2, FL-2.2.3 |
| 2.4 | Pruebas de mantenimiento | FL-2.3.1 |
| 3.1 | Conceptos básicos del testing estático | FL-3.1.1, FL-3.1.2, FL-3.1.3 |
| 3.2 | El proceso de revisión | FL-3.2.1, FL-3.2.2, FL-3.2.3, FL-3.2.4, FL-3.2.5 |
| 4.1 | Panorama de las técnicas | FL-4.1.1 |
| 4.2 | Técnicas de caja negra | FL-4.2.1, FL-4.2.2, FL-4.2.3, FL-4.2.4 |
| 4.3 | Técnicas de caja blanca | FL-4.3.1, FL-4.3.2, FL-4.3.3 |
| 4.4 | Técnicas basadas en experiencia | FL-4.4.1, FL-4.4.2, FL-4.4.3 |
| 4.5 | Técnicas basadas en colaboración | FL-4.5.1, FL-4.5.2, FL-4.5.3 |
| 5.1 | Planificación de pruebas | FL-5.1.1, FL-5.1.2, FL-5.1.3, FL-5.1.4, FL-5.1.5, FL-5.1.6, FL-5.1.7 |
| 5.2 | Gestión de riesgos | FL-5.2.1, FL-5.2.2, FL-5.2.3, FL-5.2.4 |
| 5.3 | Monitoreo, control y completitud | FL-5.3.1, FL-5.3.2, FL-5.3.3 |
| 5.4 | Gestión de la configuración | FL-5.4.1 |
| 5.5 | Gestión de defectos | FL-5.5.1 |
| 6.1 | Soporte de herramientas al testing | FL-6.1.1, FL-6.2.1 |

**`source` format:** `"Syllabus v4.0 §X.Y"` (la sección completa del tema, no un sub-LO individual, ya que una lección suele cubrir varios LOs de la misma sección).

## Fuentes de verificación (ya extraídas como texto plano, en disco)

- `C:\Users\JORGE~1.CAR\AppData\Local\Temp\claude\C--repositorio-MyCampusISTQB-26\d8257abd-445a-4d32-96d1-5c4f259ad16b\scratchpad\syllabus_es.txt` — syllabus completo en español
- `...\scratchpad\syllabus_en.txt` — syllabus completo en inglés
- Si estos archivos no existen en una sesión futura, re-extraer con: `pdftotext -layout "ISTQB_CTFL_Syllabus.pdf" syllabus_en.txt` y `pdftotext -layout "ISTQB sillabus ES.pdf" syllabus_es.txt` (rutas de los PDF en `C:\Users\jorge.carreno_amaris\Desktop\ISTQB26\`)

---

### Task 1: Arnés de validación + CSS del pie de fuente

**Files:**
- Create: `scripts/validate-content.js`
- Modify: `css/styles.css` (añadir regla `.lesson-content .lesson-source`)
- Create: `docs/content-audit-report.md` (esqueleto inicial, cada task siguiente le añade su sección)

**Interfaces:**
- Produces: comando `node scripts/validate-content.js` — imprime resultado por capítulo, sale con código `0` si todo pasa, `1` si falla. Consumido como gate por las tasks 2-7.
- Produces: clase CSS `.lesson-source` reutilizable por todas las lecciones.

- [ ] **Step 1: Escribir el validador**

Crear `scripts/validate-content.js` con este contenido exacto:

```js
/* Validador de auditoría de contenido — arnés de desarrollo (no se sirve al navegador). */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'js', 'content.js');
const src = fs.readFileSync(SRC, 'utf8');

let CHAPTERS, LESSONS;
try {
  const result = new Function(src + '\n; return {CHAPTERS, LESSONS};')();
  CHAPTERS = result.CHAPTERS;
  LESSONS = result.LESSONS;
} catch (e) {
  console.error('❌ content.js no parsea:', e.message);
  process.exit(1);
}

const TARGET_TOPIC_COUNT = { 0: 5, 1: 4, 2: 2, 3: 5, 4: 5, 5: 1 };
let errors = [];

console.log('Conteo de temas por capítulo:');
CHAPTERS.forEach((ch, i) => {
  const have = ch.topics.length;
  const want = TARGET_TOPIC_COUNT[i];
  const ok = have === want;
  console.log(`  Cap ${i}: ${have}/${want} ${ok ? '✅' : '❌'}`);
  if (!ok) errors.push(`Cap ${i}: ${have} temas, se esperaban ${want}`);
});

// Trazabilidad y pie de fuente por tema
CHAPTERS.forEach((ch, chIdx) => {
  ch.topics.forEach(topic => {
    const tag = `topic ${topic.id}`;
    if (!Array.isArray(topic.lo) || topic.lo.length === 0) {
      errors.push(`${tag}: falta lo (array de códigos FL-x.y.z)`);
    } else {
      topic.lo.forEach(code => {
        if (!/^FL-\d+\.\d+\.\d+$/.test(code)) errors.push(`${tag}: código lo inválido "${code}"`);
      });
    }
    if (!topic.source || !topic.source.trim()) errors.push(`${tag}: source vacío`);

    const lesson = LESSONS[topic.id];
    if (!lesson) {
      errors.push(`${tag}: sin entrada en LESSONS`);
      return;
    }
    for (const lang of ['es', 'en']) {
      if (!lesson[lang] || !lesson[lang].content) {
        errors.push(`${tag}: falta LESSONS.${topic.id}.${lang}.content`);
        continue;
      }
      if (!lesson[lang].content.includes('class="lesson-source"')) {
        errors.push(`${tag}: falta pie de fuente (.lesson-source) en LESSONS.${topic.id}.${lang}.content`);
      }
    }
  });
});

if (errors.length) {
  console.error(`\n❌ ${errors.length} problema(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('\n✅ Todas las validaciones pasan.');
```

- [ ] **Step 2: Correr el validador para ver que FALLA (estado inicial: sin lo/source/pie de fuente)**

Run: `node scripts/validate-content.js`
Expected: FAIL. Imprime `Cap 0: 5/5 ✅` ... `Cap 5: 1/1 ✅` (los conteos de temas ya son correctos, no cambian en esta fase) pero luego reporta un error por cada uno de los 22 temas por falta de `lo`, `source`, y el pie de fuente en `es`/`en` (~66+ errores), y sale con código 1.

- [ ] **Step 3: Añadir la clase CSS del pie de fuente**

En `css/styles.css`, justo después de la regla `.lesson-content code` (línea 679 en el estado actual del archivo — busca `code { font-family: var(--mono)` para ubicarla), añade:

```css
.lesson-content .lesson-source {
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
  font-size: 0.75rem;
  color: var(--text2);
}
```

- [ ] **Step 4: Crear el esqueleto del informe de auditoría**

Crear `docs/content-audit-report.md` con este contenido exacto:

```markdown
# Informe de Auditoría de Contenido — Fase 2

Auditoría de las 22 lecciones de `js/content.js` contra el ISTQB CTFL Syllabus v4.0
oficial. Veredictos: ✅ correcta (sin cambios de contenido, solo trazabilidad añadida) ·
⚠️ corregida (imprecisión o término corregido) · ➕ ampliada (concepto examinable que
faltaba, añadido).

| Tema | LOs | Veredicto | Resumen del cambio |
|------|-----|-----------|---------------------|
```

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-content.js css/styles.css docs/content-audit-report.md
git commit -m "test: add content audit validation harness and lesson-source styling"
```

---

### Task 2: Auditoría Capítulo 1 — Fundamentos del Testing (5 lecciones)

**Files:**
- Modify: `js/content.js` (temas `1.1`-`1.5` en `CHAPTERS[0].topics`, y `LESSONS["1.1"]`...`LESSONS["1.5"]`)
- Modify: `docs/content-audit-report.md` (añadir 5 filas)

**Interfaces:**
- Consumes: validador de Task 1, mapeo LO de la tabla de referencia arriba (temas 1.1-1.5).
- Produces: 5 temas con `lo`/`source`, 5 lecciones con pie de fuente en es/en.

**Método (aplica a cada uno de los 5 temas):**
1. Abrir `js/content.js`, localizar el objeto `topic` con ese `id` dentro de `CHAPTERS[0].topics` y el objeto `LESSONS[id]`.
2. Leer el contenido actual de la lección (es y en).
3. Buscar en `scratchpad/syllabus_es.txt` (o `syllabus_en.txt`) la sección correspondiente (ej. para el tema `1.3`, buscar "1.3" o "FL-1.3.1") y comparar: terminología correcta, ¿falta algún concepto que el LO exige?, ¿hay alguna afirmación imprecisa?
4. Si todo es correcto → no tocar el `content`, veredicto ✅.
5. Si hay una imprecisión o falta un concepto → corregir/ampliar solo esa parte puntual del HTML (mismo estilo que el resto: usa `<h3>`, `<p>`, `<ul>`, `<div class="highlight-box">` etc. como ya hace el archivo), veredicto ⚠️ o ➕.
6. Añadir al final del `content` (antes del backtick de cierre, tanto en `es` como en `en`) el pie de fuente:
   ```html
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §1.X</p>
   ```
   (en inglés usar el mismo formato, solo cambia "Fuente:" por "Source:" en la versión `en`)
7. En el objeto `topic` correspondiente dentro de `CHAPTERS[0].topics`, añadir los campos `lo` y `source`, por ejemplo para el tema `1.3`:
   ```js
   { id: "1.3", title: { es: "Los 7 Principios del Testing", en: "The 7 Testing Principles" }, xp: 50, lo: ["FL-1.3.1"], source: "Syllabus v4.0 §1.3" },
   ```

Repetir para los 5 temas: `1.1` (lo: `["FL-1.1.1","FL-1.1.2"]`), `1.2` (lo: `["FL-1.2.1","FL-1.2.2","FL-1.2.3"]`), `1.3` (lo: `["FL-1.3.1"]`), `1.4` (lo: `["FL-1.4.1","FL-1.4.2","FL-1.4.3","FL-1.4.4","FL-1.4.5"]`), `1.5` (lo: `["FL-1.5.1","FL-1.5.2","FL-1.5.3"]`). Todos con `source: "Syllabus v4.0 §1.X"`.

- [ ] **Step 1: Correr el validador para confirmar que Cap.1 falla por trazabilidad**

Run: `node scripts/validate-content.js`
Expected: errores para topics `1.1` a `1.5` (falta lo/source/pie de fuente); Cap.0-5 counts ya en ✅ (no cambian en esta fase).

- [ ] **Step 2: Auditar y editar los 5 temas de Cap.1 según el método arriba**

- [ ] **Step 3: Añadir las 5 filas correspondientes a `docs/content-audit-report.md`**

Ejemplo de fila:
```markdown
| 1.3 Los 7 Principios del Testing | FL-1.3.1 | ✅ | Contenido ya correcto y completo frente a §1.3; solo se añadió trazabilidad y pie de fuente. |
```

- [ ] **Step 4: Correr el validador — Cap.1 debe quedar sin errores para topics 1.1-1.5**

Run: `node scripts/validate-content.js`
Expected: ningún error mencionando `topic 1.1` a `topic 1.5` (los temas 2.x-6.x seguirán fallando, eso es esperado — fuera de alcance de esta task).

- [ ] **Step 5: Commit**

```bash
git add js/content.js docs/content-audit-report.md
git commit -m "docs(content): audit Chapter 1 (Fundamentals) lessons against syllabus"
```

---

### Task 3: Auditoría Capítulo 2 — Testing a lo largo del SDLC (4 lecciones)

**Files:**
- Modify: `js/content.js` (temas `2.1`-`2.4`)
- Modify: `docs/content-audit-report.md`

**Interfaces:**
- Consumes: validador de Task 1, mapeo LO (temas 2.1-2.4).

Mismo método que Task 2, aplicado a: `2.1` (lo: `["FL-2.1.1","FL-2.1.2","FL-2.1.3","FL-2.1.4","FL-2.1.5","FL-2.1.6"]`), `2.2` (lo: `["FL-2.2.1"]`), `2.3` (lo: `["FL-2.2.2","FL-2.2.3"]`), `2.4` (lo: `["FL-2.3.1"]`). `source: "Syllabus v4.0 §2.X"`.

**Atención especial:** el tema `2.3` (Tipos de prueba) debe cubrir explícitamente la distinción entre prueba de confirmación y prueba de regresión (`FL-2.2.3`) — verificar que el contenido actual la explica, no solo los 4 tipos de prueba (funcional, no funcional, caja blanca, relacionada con cambios).

- [ ] **Step 1: Correr el validador para confirmar que Cap.2 falla por trazabilidad**

Run: `node scripts/validate-content.js`
Expected: errores para topics `2.1` a `2.4`.

- [ ] **Step 2: Auditar y editar los 4 temas de Cap.2**

- [ ] **Step 3: Añadir las 4 filas a `docs/content-audit-report.md`**

- [ ] **Step 4: Correr el validador — Cap.2 sin errores para topics 2.1-2.4**

Run: `node scripts/validate-content.js`
Expected: ningún error mencionando `topic 2.1` a `topic 2.4`.

- [ ] **Step 5: Commit**

```bash
git add js/content.js docs/content-audit-report.md
git commit -m "docs(content): audit Chapter 2 (SDLC) lessons against syllabus"
```

---

### Task 4: Auditoría Capítulo 3 — Testing Estático (2 lecciones)

**Files:**
- Modify: `js/content.js` (temas `3.1`-`3.2`)
- Modify: `docs/content-audit-report.md`

**Interfaces:**
- Consumes: validador de Task 1, mapeo LO (temas 3.1-3.2).

Mismo método, aplicado a: `3.1` (lo: `["FL-3.1.1","FL-3.1.2","FL-3.1.3"]`), `3.2` (lo: `["FL-3.2.1","FL-3.2.2","FL-3.2.3","FL-3.2.4","FL-3.2.5"]`). `source: "Syllabus v4.0 §3.X"`.

**Atención especial (gap conocido del spec original):** el tema `3.2` (proceso de revisión) debe cubrir explícitamente `FL-3.2.3` — qué responsabilidades corresponden a cada rol principal en una revisión (autor, moderador/facilitador, revisores, escriba/secretario, líder de revisión). Verificar que el contenido actual detalla roles y responsabilidades, no solo los tipos de revisión.

- [ ] **Step 1: Correr el validador para confirmar que Cap.3 falla por trazabilidad**

Run: `node scripts/validate-content.js`
Expected: errores para topics `3.1` y `3.2`.

- [ ] **Step 2: Auditar y editar los 2 temas de Cap.3**

- [ ] **Step 3: Añadir las 2 filas a `docs/content-audit-report.md`**

- [ ] **Step 4: Correr el validador — Cap.3 sin errores para topics 3.1-3.2**

Run: `node scripts/validate-content.js`
Expected: ningún error mencionando `topic 3.1` o `topic 3.2`.

- [ ] **Step 5: Commit**

```bash
git add js/content.js docs/content-audit-report.md
git commit -m "docs(content): audit Chapter 3 (Static Testing) lessons against syllabus"
```

---

### Task 5: Auditoría Capítulo 4 — Análisis y Diseño de Pruebas (5 lecciones)

**Files:**
- Modify: `js/content.js` (temas `4.1`-`4.5`)
- Modify: `docs/content-audit-report.md`

**Interfaces:**
- Consumes: validador de Task 1, mapeo LO (temas 4.1-4.5).

Mismo método, aplicado a: `4.1` (lo: `["FL-4.1.1"]`), `4.2` (lo: `["FL-4.2.1","FL-4.2.2","FL-4.2.3","FL-4.2.4"]`), `4.3` (lo: `["FL-4.3.1","FL-4.3.2","FL-4.3.3"]`), `4.4` (lo: `["FL-4.4.1","FL-4.4.2","FL-4.4.3"]`), `4.5` (lo: `["FL-4.5.1","FL-4.5.2","FL-4.5.3"]`). `source: "Syllabus v4.0 §4.X"`.

**Atención especial:** este capítulo ya tiene una cobertura fuerte en el banco de preguntas (Fase 1, 36 preguntas con ejemplos de aplicación de EP/BVA/tablas de decisión/transición de estados). Al auditar `4.2`, verificar que la lección explica el MECANISMO de cada técnica (cómo derivar particiones/valores límite/reglas/transiciones), no solo la definición — para que la lección prepare al estudiante para las preguntas de aplicación del simulador.

- [ ] **Step 1: Correr el validador para confirmar que Cap.4 falla por trazabilidad**

Run: `node scripts/validate-content.js`
Expected: errores para topics `4.1` a `4.5`.

- [ ] **Step 2: Auditar y editar los 5 temas de Cap.4**

- [ ] **Step 3: Añadir las 5 filas a `docs/content-audit-report.md`**

- [ ] **Step 4: Correr el validador — Cap.4 sin errores para topics 4.1-4.5**

Run: `node scripts/validate-content.js`
Expected: ningún error mencionando `topic 4.1` a `topic 4.5`.

- [ ] **Step 5: Commit**

```bash
git add js/content.js docs/content-audit-report.md
git commit -m "docs(content): audit Chapter 4 (Test Analysis & Design) lessons against syllabus"
```

---

### Task 6: Auditoría Capítulo 5 — Gestión de las Actividades de Prueba (5 lecciones)

**Files:**
- Modify: `js/content.js` (temas `5.1`-`5.5`)
- Modify: `docs/content-audit-report.md`

**Interfaces:**
- Consumes: validador de Task 1, mapeo LO (temas 5.1-5.5).

Mismo método, aplicado a: `5.1` (lo: `["FL-5.1.1","FL-5.1.2","FL-5.1.3","FL-5.1.4","FL-5.1.5","FL-5.1.6","FL-5.1.7"]`), `5.2` (lo: `["FL-5.2.1","FL-5.2.2","FL-5.2.3","FL-5.2.4"]`), `5.3` (lo: `["FL-5.3.1","FL-5.3.2","FL-5.3.3"]`), `5.4` (lo: `["FL-5.4.1"]`), `5.5` (lo: `["FL-5.5.1"]`). `source: "Syllabus v4.0 §5.X"`.

**Atención especial (gaps conocidos del spec original):**
- Tema `5.1`: verificar que cubre `FL-5.1.4` (técnicas de estimación, ej. estimación de 3 puntos) y `FL-5.1.5` (priorización de casos de prueba, incluyendo dependencias) — no solo el contenido de un plan de pruebas.
- Tema `5.5`: verificar que explica `FL-5.5.1` (cómo preparar un informe de defecto: campos típicos — ID único, título, descripción del fallo, resultado esperado/actual, severidad, prioridad, estado), no solo el concepto general de gestión de defectos.

- [ ] **Step 1: Correr el validador para confirmar que Cap.5 falla por trazabilidad**

Run: `node scripts/validate-content.js`
Expected: errores para topics `5.1` a `5.5`.

- [ ] **Step 2: Auditar y editar los 5 temas de Cap.5**

- [ ] **Step 3: Añadir las 5 filas a `docs/content-audit-report.md`**

- [ ] **Step 4: Correr el validador — Cap.5 sin errores para topics 5.1-5.5**

Run: `node scripts/validate-content.js`
Expected: ningún error mencionando `topic 5.1` a `topic 5.5`.

- [ ] **Step 5: Commit**

```bash
git add js/content.js docs/content-audit-report.md
git commit -m "docs(content): audit Chapter 5 (Managing Test Activities) lessons against syllabus"
```

---

### Task 7: Auditoría Capítulo 6 — Soporte de Herramientas (1 lección) + cierre del validador

**Files:**
- Modify: `js/content.js` (tema `6.1`)
- Modify: `docs/content-audit-report.md`

**Interfaces:**
- Consumes: validador de Task 1, mapeo LO (tema 6.1).
- Produces: validador en verde total (22/22 temas con trazabilidad completa).

Mismo método, aplicado a: `6.1` (lo: `["FL-6.1.1","FL-6.2.1"]`), `source: "Syllabus v4.0 §6.1 / §6.2"`.

**Atención especial:** el tema `6.1` agrupa dos secciones del syllabus (§6.1 tipos de herramientas de soporte, §6.2 beneficios/riesgos de la automatización) — verificar que la lección cubre ambas, no solo una.

- [ ] **Step 1: Correr el validador para confirmar que Cap.6 falla por trazabilidad**

Run: `node scripts/validate-content.js`
Expected: errores para topic `6.1` únicamente (el resto de capítulos ya deben estar en verde tras las Tasks 2-6).

- [ ] **Step 2: Auditar y editar el tema de Cap.6**

- [ ] **Step 3: Añadir la fila a `docs/content-audit-report.md`**

- [ ] **Step 4: Correr el validador — debe quedar TOTALMENTE en verde**

Run: `node scripts/validate-content.js`
Expected: `Cap 0: 5/5 ✅` ... `Cap 5: 1/1 ✅`, cero errores de trazabilidad/pie de fuente para los 22 temas, y `✅ Todas las validaciones pasan.` con exit code 0.

- [ ] **Step 5: Commit**

```bash
git add js/content.js docs/content-audit-report.md
git commit -m "docs(content): audit Chapter 6 (Tool Support) lesson against syllabus"
```

---

### Task 8: Verificación de integración en navegador

**Files:**
- Reference: `index.html`, `js/app.js`, `css/styles.css`

**Interfaces:**
- Consumes: las 22 lecciones auditadas y con pie de fuente.

- [ ] **Step 1: Servir la app**

Run: `python -m http.server 8000` y abrir `http://localhost:8000` (o usar `playwright-cli`/la skill `run` para automatizarlo, igual que en la Fase 1).

- [ ] **Step 2: Verificar una lección de cada capítulo (mínimo 3, incluyendo una con contenido corregido/ampliado si hubo alguna)**

Navegar a Curriculum → abrir una lección. Confirmar que:
- El pie de fuente (`.lesson-source`) se ve al final del contenido, con estilo discreto (borde punteado, texto pequeño, no rompe el layout).
- El contenido sigue siendo legible y coherente (sin HTML roto por las ediciones).
- Cambiar idioma ES/EN y confirmar que el pie de fuente también cambia ("Fuente:" ↔ "Source:").

Expected: pie de fuente visible y correcto en ambos idiomas, sin errores de consola, sin regresión visual.

- [ ] **Step 3: Confirmar que el progreso de currículum (barra de completado) sigue funcionando**

Completar una lección (botón "Marcar como completada") y confirmar que la barra de progreso del capítulo se actualiza — esto usa `topic.xp` sin cambios, solo para confirmar que añadir `lo`/`source` al objeto `topic` no rompió nada que dependa de su forma.

Expected: XP y progreso funcionan igual que antes de la Fase 2.

- [ ] **Step 4: Commit final (si hubo ajustes menores tras la verificación)**

```bash
git add -A
git commit -m "test: verify Phase 2 lesson audit renders correctly in browser"
```

---

## Notas para el ejecutor

- **Autoría de correcciones:** este plan fija la estructura, el mapeo tema→LO, el schema del pie de fuente, y los gaps conocidos a revisar con atención. El contenido real de cada corrección se autora durante la ejecución, leyendo la sección del syllabus citada (`scratchpad/syllabus_es.txt` / `syllabus_en.txt`). Si una lección ya es correcta, no se reescribe — solo se le añade trazabilidad.
- **No convertir esto en una reescritura general:** el objetivo es auditar y corregir, no rehacer las lecciones. La mayoría de temas probablemente queden en veredicto ✅ dado que el contenido actual ya es denso y preciso (confirmado en la exploración previa de `js/content.js`).
- **Fase 3 (glosario)** tendrá su propio plan tras completar y verificar esta Fase 2.

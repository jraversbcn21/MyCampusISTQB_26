# Fase 1 — Banco de Preguntas (50 → 120) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ampliar `js/questions.js` de 50 a 120 preguntas ISTQB CTFL v4.0, con distribución fiel al examen oficial y cada pregunta nueva trazable a su fuente.

**Architecture:** Se añaden preguntas al array global `QUESTIONS` (sin cambiar el motor de examen, que solo lee `q`/`options`/`correct`/`explanation`/`chapter`). Un script Node de validación (`scripts/validate-questions.js`) actúa como arnés de test: verifica conteo por capítulo, integridad estructural y presencia de campos de trazabilidad. No hay build ni framework; el validador se corre con `node`.

**Tech Stack:** Vanilla JS (dato en `js/questions.js`), Node 18 (solo para el validador de desarrollo).

## Global Constraints

- **Fuente obligatoria:** cada pregunta con `id > 50` debe tener `lo` (código `FL-x.y.z`), `k` (1|2|3) y `source` (string no vacío). Nada se inventa; todo corroborable contra Syllabus v4.0, exámenes de muestra oficiales o el libro *Foundations of software testing*.
- **Bilingüe:** todo `q`, `options` (4 opciones) y `explanation` en `es` y `en`.
- **Retrocompatibilidad:** no cambiar el schema de las 50 preguntas existentes ni el motor de examen. Los campos nuevos son aditivos.
- **Índice de capítulo:** `chapter` es 0-indexado (0=Cap.1 Fundamentos … 5=Cap.6 Herramientas), como en el código actual.
- **Distribución objetivo:** Cap0=24, Cap1=18, Cap2=12, Cap3=36, Cap4=24, Cap5=6. Total 120.
- **IDs:** las preguntas nuevas continúan la numeración desde `id: 51` sin huecos ni duplicados.

---

### Task 1: Arnés de validación

**Files:**
- Create: `scripts/validate-questions.js`
- Reference (read-only): `js/questions.js`

**Interfaces:**
- Produces: comando `node scripts/validate-questions.js` que imprime conteo por capítulo y sale con código `0` si todo pasa, `1` si falla. Consumido como gate por todas las tareas siguientes.

- [ ] **Step 1: Escribir el validador**

Crear `scripts/validate-questions.js` con este contenido exacto:

```js
/* Validador de banco de preguntas — arnés de desarrollo (no se sirve al navegador). */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'js', 'questions.js');
const src = fs.readFileSync(SRC, 'utf8');

// questions.js define `const QUESTIONS = [...]` como global de navegador.
// Lo evaluamos y devolvemos el array.
let QUESTIONS;
try {
  QUESTIONS = eval(src + '\n; QUESTIONS');
} catch (e) {
  console.error('❌ questions.js no parsea:', e.message);
  process.exit(1);
}

const TARGET = { 0: 24, 1: 18, 2: 12, 3: 36, 4: 24, 5: 6 };
let errors = [];

// Conteo por capítulo
const counts = {};
for (const q of QUESTIONS) counts[q.chapter] = (counts[q.chapter] || 0) + 1;
console.log('Conteo por capítulo:');
for (const ch of Object.keys(TARGET)) {
  const have = counts[ch] || 0;
  const want = TARGET[ch];
  const ok = have === want;
  console.log(`  Cap ${ch}: ${have}/${want} ${ok ? '✅' : '❌'}`);
  if (!ok) errors.push(`Cap ${ch}: ${have} preguntas, se esperaban ${want}`);
}

// Integridad estructural (TODAS las preguntas)
const seenIds = new Set();
for (const q of QUESTIONS) {
  const tag = `id ${q.id}`;
  if (seenIds.has(q.id)) errors.push(`${tag}: id duplicado`);
  seenIds.add(q.id);
  for (const lang of ['es', 'en']) {
    if (!q.q || !q.q[lang]) errors.push(`${tag}: falta q.${lang}`);
    if (!q.options || !Array.isArray(q.options[lang]) || q.options[lang].length !== 4)
      errors.push(`${tag}: options.${lang} debe tener 4 opciones`);
    if (!q.explanation || !q.explanation[lang]) errors.push(`${tag}: falta explanation.${lang}`);
  }
  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3)
    errors.push(`${tag}: correct fuera de rango`);
}

// Trazabilidad (solo preguntas nuevas: id > 50)
for (const q of QUESTIONS) {
  if (q.id <= 50) continue;
  const tag = `id ${q.id}`;
  if (!/^FL-\d+\.\d+\.\d+$/.test(q.lo || '')) errors.push(`${tag}: lo inválido o ausente (${q.lo})`);
  if (![1, 2, 3].includes(q.k)) errors.push(`${tag}: k debe ser 1, 2 o 3 (${q.k})`);
  if (!q.source || !q.source.trim()) errors.push(`${tag}: source vacío`);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} problema(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('\n✅ Todas las validaciones pasan.');
```

- [ ] **Step 2: Correr el validador para ver que FALLA (estado inicial: 50 preguntas)**

Run: `node scripts/validate-questions.js`
Expected: FAIL. Imprime conteos actuales (Cap 0: 10/24 ❌, Cap 1: 9/18 ❌, Cap 2: 6/12 ❌, Cap 3: 11/36 ❌, Cap 4: 8/24 ❌, Cap 5: 6/6 ✅) y sale con código 1.

- [ ] **Step 3: Commit del arnés**

```bash
git add scripts/validate-questions.js
git commit -m "test: add question bank validation harness"
```

---

### Task 2: Capítulo 0 — Fundamentos (10 → 24, añadir 14)

**Files:**
- Modify: `js/questions.js` (añadir 14 preguntas al final del bloque del Cap.0 o antes del cierre `]` del array, con `chapter: 0`)

**Interfaces:**
- Consumes: schema y validador de Task 1.
- Produces: 14 preguntas nuevas con `id` 51–64.

**LOs a cubrir (14 LOs del Cap.1, ~1 pregunta c/u):**
`FL-1.1.1` objetivos del testing · `FL-1.1.2` testing vs debugging · `FL-1.2.1` por qué es necesario · `FL-1.2.2` testing y QA · `FL-1.2.3` error/defecto/fallo/causa raíz · `FL-1.3.1` los 7 principios · `FL-1.4.1` actividades de prueba · `FL-1.4.2` contexto · `FL-1.4.3` testware · `FL-1.4.4` trazabilidad · `FL-1.4.5` roles · `FL-1.5.1` habilidades genéricas · `FL-1.5.2` whole-team approach · `FL-1.5.3` independencia.

**Fuentes:** `ISTQB sillabus ES.pdf` §1.1–1.5; `ISTQB_CTFL 4.0_Sample-ExamA-v1.0-Questions_es_.pdf`.

- [ ] **Step 1: Correr validador para confirmar que Cap 0 está corto**

Run: `node scripts/validate-questions.js`
Expected: `Cap 0: 10/24 ❌`.

- [ ] **Step 2: Añadir las 14 preguntas del Cap.0**

Insertar en `js/questions.js` dentro del array `QUESTIONS`. Schema exacto (ejemplo completo y correcto para `FL-1.4.4`; replicar el patrón para los 14 LOs listados):

```js
  {
    id: 51, chapter: 0, lo: "FL-1.4.4", k: 2,
    source: "Syllabus v4.0 §1.4.4",
    q: {
      es: "¿Cuál es el principal beneficio de mantener la trazabilidad entre las bases de prueba y los productos de trabajo de prueba?",
      en: "What is the main benefit of maintaining traceability between the test basis and test work products?"
    },
    options: {
      es: [
        "Permite evaluar la cobertura, analizar el impacto de los cambios y facilitar auditorías",
        "Reduce el número de casos de prueba necesarios",
        "Garantiza que el software no tenga defectos",
        "Elimina la necesidad de la gestión de la configuración"
      ],
      en: [
        "It enables coverage assessment, change impact analysis and facilitates audits",
        "It reduces the number of test cases needed",
        "It guarantees the software has no defects",
        "It removes the need for configuration management"
      ]
    },
    correct: 0,
    explanation: {
      es: "La trazabilidad permite evaluar la cobertura, analizar el impacto de los cambios, facilitar auditorías y hacer el progreso del testing comprensible. No elimina otros procesos ni garantiza ausencia de defectos.",
      en: "Traceability enables coverage assessment, change impact analysis, audit support and makes testing progress understandable. It does not remove other processes nor guarantee absence of defects."
    }
  },
```

Autorar las 13 restantes (ids 52–64) siguiendo el mismo schema, una por cada LO restante de la lista, tomando el contenido del syllabus §1.x citado en `source` (formato `"Syllabus v4.0 §1.x.y"`; si se deriva de un ítem del examen de muestra, añadir `" / Sample Exam A Qn"`). Nivel `k` = el nivel del LO (ver lista de LOs en el spec).

- [ ] **Step 3: Correr validador para confirmar Cap 0 en verde**

Run: `node scripts/validate-questions.js`
Expected: `Cap 0: 24/24 ✅`, sin errores de trazabilidad en ids 51–64.

- [ ] **Step 4: Commit**

```bash
git add js/questions.js
git commit -m "feat(questions): add 14 Chapter 1 (Fundamentals) questions with sources"
```

---

### Task 3: Capítulo 1 — Testing a lo largo del SDLC (9 → 18, añadir 9)

**Files:**
- Modify: `js/questions.js` (9 preguntas nuevas, `chapter: 1`, ids 65–73)

**Interfaces:**
- Consumes: schema/validador de Task 1.
- Produces: preguntas ids 65–73.

**LOs a cubrir (10 LOs, ~1 c/u):**
`FL-2.1.1` impacto del SDLC · `FL-2.1.2` buenas prácticas en todo SDLC · `FL-2.1.3` enfoques test-first · `FL-2.1.4` DevOps · `FL-2.1.5` shift-left · `FL-2.1.6` retrospectivas · `FL-2.2.1` niveles de prueba · `FL-2.2.2` tipos de prueba · `FL-2.2.3` confirmación vs regresión · `FL-2.3.1` pruebas de mantenimiento.

**Fuentes:** Syllabus §2.1–2.3; Sample Exam A.

- [ ] **Step 1: Correr validador**

Run: `node scripts/validate-questions.js`
Expected: `Cap 1: 9/18 ❌`.

- [ ] **Step 2: Añadir las 9 preguntas del Cap.1**

Ejemplo completo y correcto (`FL-2.2.3`):

```js
  {
    id: 65, chapter: 1, lo: "FL-2.2.3", k: 2,
    source: "Syllabus v4.0 §2.2.3",
    q: {
      es: "Tras corregir un defecto, se vuelve a ejecutar el mismo caso de prueba que lo detectó para comprobar que ha quedado solucionado. ¿Qué tipo de prueba es?",
      en: "After a defect is fixed, the same test case that detected it is re-executed to check the fix worked. What type of testing is this?"
    },
    options: {
      es: ["Prueba de confirmación", "Prueba de regresión", "Prueba de humo", "Prueba de mantenimiento"],
      en: ["Confirmation testing", "Regression testing", "Smoke testing", "Maintenance testing"]
    },
    correct: 0,
    explanation: {
      es: "La prueba de confirmación (re-test) vuelve a ejecutar el caso que falló, tras la corrección, para confirmar que el defecto se resolvió. La regresión busca efectos secundarios no deseados en otras partes.",
      en: "Confirmation testing (re-testing) re-runs the failed test after the fix to confirm the defect is resolved. Regression testing looks for unintended side effects elsewhere."
    }
  },
```

Autorar las 8 restantes (ids 66–73), una por LO restante, con `source` citado.

- [ ] **Step 3: Correr validador**

Run: `node scripts/validate-questions.js`
Expected: `Cap 1: 18/18 ✅`.

- [ ] **Step 4: Commit**

```bash
git add js/questions.js
git commit -m "feat(questions): add 9 Chapter 2 (SDLC) questions with sources"
```

---

### Task 4: Capítulo 2 — Testing Estático (6 → 12, añadir 6)

**Files:**
- Modify: `js/questions.js` (6 preguntas nuevas, `chapter: 2`, ids 74–79)

**Interfaces:**
- Produces: preguntas ids 74–79.

**LOs a cubrir (8 LOs, priorizar 6):**
`FL-3.1.1` productos examinables · `FL-3.1.2` valor del testing estático · `FL-3.1.3` estático vs dinámico · `FL-3.2.2` actividades del proceso de revisión · `FL-3.2.4` tipos de revisión · `FL-3.2.5` factores de éxito. (Opcional cubrir 3.2.1/3.2.3 si se prefiere.)

**Fuentes:** Syllabus §3.1–3.2; Sample Exam A.

- [ ] **Step 1: Correr validador**

Run: `node scripts/validate-questions.js`
Expected: `Cap 2: 6/12 ❌`.

- [ ] **Step 2: Añadir las 6 preguntas del Cap.2**

Ejemplo completo y correcto (`FL-3.2.4`):

```js
  {
    id: 74, chapter: 2, lo: "FL-3.2.4", k: 2,
    source: "Syllabus v4.0 §3.2.4",
    q: {
      es: "¿Cuál de los siguientes tipos de revisión es el MÁS formal, sigue un proceso definido y suele incluir métricas y roles asignados?",
      en: "Which of the following review types is the MOST formal, follows a defined process and usually includes metrics and assigned roles?"
    },
    options: {
      es: ["Inspección", "Revisión informal", "Walkthrough (recorrido)", "Revisión técnica"],
      en: ["Inspection", "Informal review", "Walkthrough", "Technical review"]
    },
    correct: 0,
    explanation: {
      es: "La inspección es el tipo de revisión más formal: sigue un proceso definido, con roles, reglas de entrada/salida y recolección de métricas. La revisión informal es la menos formal.",
      en: "The inspection is the most formal review type: it follows a defined process with roles, entry/exit rules and metrics collection. The informal review is the least formal."
    }
  },
```

Autorar las 5 restantes (ids 75–79) con `source` citado.

- [ ] **Step 3: Correr validador**

Run: `node scripts/validate-questions.js`
Expected: `Cap 2: 12/12 ✅`.

- [ ] **Step 4: Commit**

```bash
git add js/questions.js
git commit -m "feat(questions): add 6 Chapter 3 (Static Testing) questions with sources"
```

---

### Task 5: Capítulo 3 — Análisis y Diseño (11 → 36, añadir 25)

**Files:**
- Modify: `js/questions.js` (25 preguntas nuevas, `chapter: 3`, ids 80–104)

**Interfaces:**
- Produces: preguntas ids 80–104.

**LOs a cubrir (15 LOs). Este es el capítulo más pesado y con mayor nivel K3.**
Distribución sugerida de las 25 preguntas:
- `FL-4.1.1` (K2) categorías de técnicas — 2
- `FL-4.2.1` (K3) partición de equivalencia — 3 (de aplicación: derivar casos)
- `FL-4.2.2` (K3) análisis de valores límite — 3 (de aplicación)
- `FL-4.2.3` (K3) tabla de decisión — 3 (de aplicación)
- `FL-4.2.4` (K3) transición de estados — 3 (de aplicación)
- `FL-4.3.1` (K2) prueba de sentencias — 1
- `FL-4.3.2` (K2) prueba de ramas — 1
- `FL-4.3.3` (K2) valor de caja blanca — 1
- `FL-4.4.1` (K2) adivinación de errores — 1
- `FL-4.4.2` (K2) pruebas exploratorias — 2
- `FL-4.4.3` (K2) basadas en lista de comprobación — 1
- `FL-4.5.1` (K2) historias de usuario — 1
- `FL-4.5.2` (K2) criterios de aceptación — 1
- `FL-4.5.3` (K3) ATDD — 2 (de aplicación)

**Nota crítica de calidad:** las preguntas de LOs K3 (`4.2.x`, `4.5.3`) deben ser de **aplicación** (calcular particiones/valores límite, rellenar una tabla de decisión, derivar casos de transición), no de definición.

**Fuentes:** Syllabus §4.1–4.5; Sample Exam A (varias preguntas K3).

- [ ] **Step 1: Correr validador**

Run: `node scripts/validate-questions.js`
Expected: `Cap 3: 11/36 ❌`.

- [ ] **Step 2: Añadir las 25 preguntas del Cap.3**

Ejemplo completo y correcto de pregunta K3 de aplicación (`FL-4.2.2`, BVA de 2 valores):

```js
  {
    id: 80, chapter: 3, lo: "FL-4.2.2", k: 3,
    source: "Syllabus v4.0 §4.2.2",
    q: {
      es: "Un campo de entrada acepta números enteros válidos de 1 a 100. Aplicando el análisis de valores límite de 2 valores, ¿qué conjunto de valores límite debería probarse?",
      en: "An input field accepts valid integers from 1 to 100. Applying 2-value boundary value analysis, which set of boundary values should be tested?"
    },
    options: {
      es: ["0, 1, 100, 101", "1, 100", "1, 50, 100", "0, 50, 101"],
      en: ["0, 1, 100, 101", "1, 100", "1, 50, 100", "0, 50, 101"]
    },
    correct: 0,
    explanation: {
      es: "El BVA de 2 valores prueba cada valor límite y su valor adyacente. Para los límites 1 y 100, los valores a probar son 0 y 1 (en torno al límite inferior) y 100 y 101 (en torno al superior).",
      en: "2-value BVA tests each boundary and its adjacent value. For boundaries 1 and 100, the values to test are 0 and 1 (around the lower boundary) and 100 and 101 (around the upper one)."
    }
  },
```

Autorar las 24 restantes (ids 81–104) según la distribución de LOs anterior, con `source` citado en cada una.

- [ ] **Step 3: Correr validador**

Run: `node scripts/validate-questions.js`
Expected: `Cap 3: 36/36 ✅`.

- [ ] **Step 4: Commit**

```bash
git add js/questions.js
git commit -m "feat(questions): add 25 Chapter 4 (Test Analysis & Design) questions with sources"
```

---

### Task 6: Capítulo 4 — Gestión de las Actividades de Prueba (8 → 24, añadir 16)

**Files:**
- Modify: `js/questions.js` (16 preguntas nuevas, `chapter: 4`, ids 105–120)

**Interfaces:**
- Produces: preguntas ids 105–120.

**LOs a cubrir (17 LOs, ~1 c/u):**
`FL-5.1.1` plan de pruebas · `FL-5.1.2` valor del tester en planificación · `FL-5.1.3` criterios de entrada/salida · `FL-5.1.4` (K3) técnicas de estimación · `FL-5.1.5` (K3) priorización de casos · `FL-5.1.6` pirámide de pruebas · `FL-5.1.7` cuadrantes de prueba · `FL-5.2.1` nivel de riesgo · `FL-5.2.2` riesgos de proyecto vs producto · `FL-5.2.3` análisis de riesgo de producto · `FL-5.2.4` medidas ante riesgos · `FL-5.3.1` métricas · `FL-5.3.2` informes de prueba · `FL-5.3.3` comunicar estado · `FL-5.4.1` gestión de la configuración · `FL-5.5.1` (K3) informe de defectos.

**Fuentes:** Syllabus §5.1–5.5; Sample Exam A.

- [ ] **Step 1: Correr validador**

Run: `node scripts/validate-questions.js`
Expected: `Cap 4: 8/24 ❌`.

- [ ] **Step 2: Añadir las 16 preguntas del Cap.4**

Ejemplo completo y correcto (`FL-5.2.2` riesgo de proyecto vs producto):

```js
  {
    id: 105, chapter: 4, lo: "FL-5.2.2", k: 2,
    source: "Syllabus v4.0 §5.2.2",
    q: {
      es: "El riesgo de que un proveedor externo no entregue a tiempo el entorno de pruebas necesario para el proyecto es un ejemplo de:",
      en: "The risk that an external supplier fails to deliver the required test environment on time is an example of:"
    },
    options: {
      es: ["Riesgo de proyecto", "Riesgo de producto", "Riesgo de calidad del producto", "Riesgo técnico del producto"],
      en: ["Project risk", "Product risk", "Product quality risk", "Technical product risk"]
    },
    correct: 0,
    explanation: {
      es: "Los riesgos de proyecto se relacionan con la gestión y el control del proyecto (retrasos, recursos, proveedores, entornos). Los riesgos de producto se relacionan con las características de calidad del producto (fallos del software).",
      en: "Project risks relate to project management and control (delays, resources, suppliers, environments). Product risks relate to the product's quality characteristics (software failures)."
    }
  },
```

Autorar las 15 restantes (ids 106–120), una por LO restante, con `source` citado. Las de `FL-5.1.4`, `FL-5.1.5` y `FL-5.5.1` (K3) deben ser de aplicación.

- [ ] **Step 3: Correr validador (verde total esperado)**

Run: `node scripts/validate-questions.js`
Expected: TODOS los capítulos ✅ (Cap 0:24, Cap 1:18, Cap 2:12, Cap 3:36, Cap 4:24, Cap 5:6 = 120) y `✅ Todas las validaciones pasan.` con exit code 0.

- [ ] **Step 4: Commit**

```bash
git add js/questions.js
git commit -m "feat(questions): add 16 Chapter 5 (Managing Test Activities) questions with sources"
```

---

### Task 7: Verificación de integración en navegador

**Files:**
- Reference: `index.html`, `js/app.js`

**Interfaces:**
- Consumes: banco de 120 preguntas completo.

- [ ] **Step 1: Servir la app**

Run: `python -m http.server 8000` y abrir `http://localhost:8000`.

- [ ] **Step 2: Verificar el Examen Completo**

Navegar a Simulador → (desbloquear/forzar) Examen Completo. Confirmar que:
- Carga 40 preguntas sin errores en consola.
- No aparecen preguntas repetidas dentro de un mismo examen.
- Las opciones y explicaciones se muestran en el idioma activo (probar ES y EN con el selector).

Expected: examen funcional, sin errores de consola, 40 preguntas distintas del pool de 120.

- [ ] **Step 3: Verificar Quiz por Capítulo**

Abrir el Quiz por Capítulo del Cap.4 (Análisis y Diseño). Confirmar que ahora hay variedad (10 preguntas de un pool de 36) y que las preguntas K3 de aplicación se renderizan correctamente.

Expected: variedad de preguntas, sin repetición forzada.

- [ ] **Step 4: Commit final (si hubo ajustes menores)**

```bash
git add -A
git commit -m "test: verify 120-question bank in browser (full exam + chapter quiz)"
```

---

## Notas para el ejecutor

- **Autoría de contenido:** este plan fija la estructura, distribución, schema y un ejemplo verificado por capítulo. El texto de las preguntas restantes se autora durante la ejecución **leyendo la sección del syllabus citada** (`scratchpad/syllabus_es.txt` / `syllabus_en.txt`) y los exámenes de muestra (`scratchpad/sampleA_es.txt`, `scratchpad/ejemplo_preg.txt`). Cada pregunta debe poder rastrearse a su `source`. No inventar datos que no estén en las fuentes.
- **Evitar duplicados:** revisar las preguntas existentes del capítulo antes de autorar, para no repetir enunciados ya presentes.
- **Fases 2 (auditoría de contenido) y 3 (glosario)** tendrán sus propios planes tras completar y verificar la Fase 1.

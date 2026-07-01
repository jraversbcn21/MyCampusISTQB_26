# Fase 3 — Expansión del Glosario Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ampliar `GLOSSARY` en `js/content.js` para cubrir los 97 *keywords* oficiales únicos del ISTQB CTFL Syllabus v4.0 (hoy hay 48 términos, ~30 mapean a keywords), añadir `source` a todos los términos, y barrer `FLASHCARDS` de contenido no-v4.0 (ids 9, 14, 27, 28 conocidos).

**Architecture:** `GLOSSARY` es un array de datos puro (`{ term, def: {es,en}, chapter, source }`); el campo `source` es aditivo y la UI (`App.renderGlossary()` en `js/app.js:849`, búsqueda global en `js/app.js:1108`) solo lee `term`, `def[lang]`, `chapter` — no requiere cambios. El arnés `scripts/validate-content.js` (Fase 2) se extiende con validación de `GLOSSARY` (schema + completitud de keywords contra lista canónica embebida) y `FLASHCARDS` (estructural). Sin UI nueva (YAGNI, per spec).

**Tech Stack:** Vanilla JS (datos en `js/content.js`), Node 18 (solo validador de desarrollo).

## Global Constraints

- **Fuente obligatoria (regla innegociable):** cada término debe tener `source` no vacío citando material oficial. Definiciones derivadas del texto del syllabus (archivos extraídos, ver "Fuentes"), del libro *Foundations of software testing* (`Foundations of software testing - ISTQB Certification.pdf` en la raíz del repo, extraíble con `pdftotext`), o del Glosario ISTQB. **Nada se inventa**; si un término no puede corroborarse, se elimina y se documenta.
- **Formato de término:** `"<ES oficial> / <EN oficial>"` — el segmento ES y el EN separados por `/`; siglas o sinónimos van entre paréntesis (ej. `"Partición de equivalencia / Equivalence partitioning (EP)"`). El validador exige que algún segmento (tras quitar paréntesis y normalizar guiones) sea **exactamente igual** al keyword EN oficial. Los nombres ES oficiales salen de las tablas "Palabras Clave" del syllabus ES (fijadas más abajo — úsalas tal cual, no las re-derives).
- **Formato de `source`:** términos que son keywords → `"Syllabus v4.0 keywords §N"`, opcionalmente `" · §X.Y.Z"` si la definición se apoya en una sección del cuerpo. Términos extra (no keyword) → `"Syllabus v4.0 §X.Y.Z"` o `"Foundations of software testing (ISTQB) — glosario"`.
- **Retrocompatibilidad:** no tocar `js/app.js`, `js/questions.js`, `css/styles.css` ni el schema existente (`term`/`def`/`chapter` se conservan; `source` es aditivo). `chapter` es string `"1"`–`"6"`.
- **Keywords duplicados entre capítulos** (coverage, test object, test control, test monitoring, test planning): UNA sola entrada, asignada al primer capítulo donde aparecen (todos → `chapter: "1"`).
- **Bilingüe:** toda `def` tiene `es` y `en`, una-dos frases, estilo de las entradas existentes.
- **No reescribir lo correcto:** en la auditoría de los 48 existentes, solo se corrige la definición si contradice el syllabus v4.0; renombrar `term` al nombre oficial no cuenta como reescritura.

## Fuentes de verificación (texto plano, en disco)

- `C:\Users\JORGE~1.CAR\AppData\Local\Temp\claude\C--repositorio-MyCampusISTQB-26\e8f38f91-75ae-403f-991d-bc84c3a6cc48\scratchpad\syllabus_en.txt` — syllabus v4.0.1 completo (EN)
- `C:\Users\JORGE~1.CAR\AppData\Local\Temp\claude\C--repositorio-MyCampusISTQB-26\e8f38f91-75ae-403f-991d-bc84c3a6cc48\scratchpad\syllabus_es.txt` — syllabus completo (ES)
- Si no existen, re-extraer: `pdftotext -layout "ISTQB 2026/ISTQB_CTFL_Syllabus_v4.0.1.pdf" syllabus_en.txt` y `pdftotext -layout "ISTQB 2026/ISTQB sillabus ES.pdf" syllabus_es.txt` (PDFs en `ISTQB 2026/` en la raíz del repo).
- Libro (fallback para definiciones no desarrolladas en el syllabus): `pdftotext -layout "Foundations of software testing - ISTQB Certification.pdf" book.txt` (raíz del repo).

## Lista canónica de keywords (extraída de syllabus_en.txt, secciones "Keywords" — verificada 2026-07-01)

Ubicación en `syllabus_en.txt`: cap.1 línea ~512, cap.2 ~981, cap.3 ~1364, cap.4 ~1622, cap.5 ~2077, cap.6 ~2621. Total 102 instancias, **97 únicos** (5 duplicados entre capítulos).

**Cap.1 (30):** coverage, debugging, defect, error, failure, quality, quality assurance, root cause, test analysis, test basis, test case, test completion, test condition, test control, test data, test design, test execution, test implementation, test monitoring, test object, test objective, test planning, test procedure, test process, test result, testing, testware, traceability, validation, verification

**Cap.2 (17):** acceptance testing, black-box testing, component integration testing, component testing, confirmation testing, functional testing, integration testing, maintenance testing, non-functional testing, regression testing, shift left, system integration testing, system testing, test level, test object*, test type, white-box testing

**Cap.3 (10):** anomaly, dynamic testing, formal review, informal review, inspection, review, static analysis, static testing, technical review, walkthrough

**Cap.4 (18):** acceptance criteria, acceptance test-driven development, black-box test technique, boundary value analysis, branch coverage, checklist-based testing, collaboration-based test approach, coverage*, coverage item, decision table testing, equivalence partitioning, error guessing, experience-based test technique, exploratory testing, state transition testing, statement coverage, test technique, white-box test technique

**Cap.5 (26):** defect management, defect report, entry criteria, exit criteria, product risk, project risk, risk, risk analysis, risk assessment, risk control, risk identification, risk level, risk management, risk mitigation, risk monitoring, risk-based testing, test approach, test completion report, test control*, test monitoring*, test plan, test planning*, test progress report, test pyramid, test strategy, testing quadrants

**Cap.6 (1):** test automation

(\* = duplicado, la entrada vive en cap.1)

## Nombres ES oficiales (tablas "Palabras Clave" del syllabus ES — usar verbatim)

| EN | ES oficial |
|---|---|
| coverage | cobertura |
| debugging | depuración (la tabla ES dice "depurar"; usar "Depuración" como sustantivo, verificado en cuerpo §1.1.2) |
| defect | defecto |
| error | error |
| failure | fallo |
| quality | calidad |
| quality assurance | aseguramiento de la calidad |
| root cause | causa raíz |
| test analysis | análisis de prueba |
| test basis | base de prueba |
| test case | caso de prueba |
| test completion | compleción de la prueba |
| test condition | condición de prueba |
| test control | control de la prueba |
| test data | datos de prueba |
| test design | diseño de la prueba |
| test execution | ejecución de prueba |
| test implementation | implementación de prueba |
| test monitoring | monitorización de la prueba |
| test object | objeto de prueba |
| test objective | objetivo de prueba |
| test planning | planificación de prueba |
| test procedure | procedimiento de prueba |
| test process | proceso de prueba (†) |
| test result | resultado de prueba |
| testing | prueba |
| testware | producto de prueba |
| traceability | trazabilidad (†) |
| validation | validación (†) |
| verification | verificación (†) |
| acceptance testing | prueba de aceptación |
| black-box testing | prueba de caja negra |
| component integration testing | prueba de integración de componentes |
| component testing | prueba de componentes |
| confirmation testing | prueba de confirmación |
| functional testing | prueba funcional |
| integration testing | prueba de integración |
| maintenance testing | prueba de mantenimiento |
| non-functional testing | prueba no funcional |
| regression testing | prueba de regresión (†) |
| shift left | desplazamiento a la izquierda |
| system integration testing | prueba de integración de sistemas |
| system testing | prueba de sistema |
| test level | nivel de prueba |
| test type | tipo de prueba |
| white-box testing | prueba de caja blanca |
| anomaly | anomalía |
| dynamic testing | prueba dinámica |
| formal review | revisión formal |
| informal review | revisión informal |
| inspection | inspección |
| review | revisión |
| static analysis | análisis estático |
| static testing | prueba estática |
| technical review | revisión técnica |
| walkthrough | revisión guiada |
| acceptance criteria | criterios de aceptación |
| acceptance test-driven development | desarrollo guiado por prueba de aceptación |
| black-box test technique | técnica de prueba de caja negra |
| boundary value analysis | análisis del valor frontera |
| branch coverage | cobertura de rama |
| checklist-based testing | prueba basada en lista de comprobación |
| collaboration-based test approach | enfoque de prueba basado en la colaboración |
| coverage item | elemento de cobertura |
| decision table testing | prueba de tabla de decisión |
| equivalence partitioning | partición de equivalencia |
| error guessing | predicción de errores |
| experience-based test technique | técnica de prueba basada en la experiencia |
| exploratory testing | prueba exploratoria |
| state transition testing | prueba de transición de estado |
| statement coverage | cobertura de sentencia |
| test technique | técnica de prueba |
| white-box test technique | técnica de prueba de caja blanca |
| defect management | gestión de defectos |
| defect report | informe de defecto |
| entry criteria | criterios de entrada |
| exit criteria | criterios de salida |
| product risk | riesgo de producto |
| project risk | riesgo de proyecto |
| risk | riesgo |
| risk analysis | análisis del riesgo |
| risk assessment | evaluación del riesgo |
| risk control | control del riesgo |
| risk identification | identificación del riesgo |
| risk level | nivel de riesgo |
| risk management | gestión del riesgo |
| risk mitigation | mitigación del riesgo |
| risk monitoring | monitorización del riesgo |
| risk-based testing | prueba basada en el riesgo |
| test approach | enfoque de prueba |
| test completion report | informe de compleción de la prueba |
| test plan | plan de prueba |
| test progress report | informe del avance de la prueba |
| test pyramid | pirámide de prueba |
| test strategy | estrategia de prueba (†) |
| testing quadrants | cuadrantes de prueba |
| test automation | automatización de la prueba |

(†) = ausente de la tabla ES extraída (corte de extracción del PDF); nombre ES estándar del Glosario ISTQB — **verificar con grep en `syllabus_es.txt`** antes de usar (todos aparecen en el cuerpo del texto ES).

---

### Task 1: Validador de glosario y flashcards

**Files:**
- Modify: `scripts/validate-content.js`

**Interfaces:**
- Consumes: `GLOSSARY`, `FLASHCARDS` de `js/content.js` (ya expuestos como `const` globales).
- Produces: `node scripts/validate-content.js` valida además: schema de GLOSSARY (term/def.es/def.en/chapter/source), unicidad de términos, completitud de los 97 keywords (comparación por segmento exacto), y estructura de FLASHCARDS (ids únicos, q/a bilingües). Exit 0 solo si todo pasa. Gate de las Tasks 2–7.

- [ ] **Step 1: Extender el validador**

En `scripts/validate-content.js`, cambiar la línea del `new Function` para devolver también los otros arrays:

```js
const result = new Function(src + '\n; return {CHAPTERS, LESSONS, GLOSSARY, FLASHCARDS};')();
CHAPTERS = result.CHAPTERS;
LESSONS = result.LESSONS;
GLOSSARY = result.GLOSSARY;
FLASHCARDS = result.FLASHCARDS;
```

(y declarar `let CHAPTERS, LESSONS, GLOSSARY, FLASHCARDS;` arriba). Antes del bloque final `if (errors.length)`, añadir:

```js
/* ===== GLOSSARY ===== */
// Lista canónica: keywords oficiales por capítulo, syllabus v4.0 (secciones "Keywords").
// Duplicados entre capítulos asignados al primer capítulo donde aparecen.
const KEYWORDS = {
  '1': ['coverage','debugging','defect','error','failure','quality','quality assurance','root cause',
        'test analysis','test basis','test case','test completion','test condition','test control',
        'test data','test design','test execution','test implementation','test monitoring','test object',
        'test objective','test planning','test procedure','test process','test result','testing',
        'testware','traceability','validation','verification'],
  '2': ['acceptance testing','black-box testing','component integration testing','component testing',
        'confirmation testing','functional testing','integration testing','maintenance testing',
        'non-functional testing','regression testing','shift left','system integration testing',
        'system testing','test level','test type','white-box testing'],
  '3': ['anomaly','dynamic testing','formal review','informal review','inspection','review',
        'static analysis','static testing','technical review','walkthrough'],
  '4': ['acceptance criteria','acceptance test-driven development','black-box test technique',
        'boundary value analysis','branch coverage','checklist-based testing',
        'collaboration-based test approach','coverage item','decision table testing',
        'equivalence partitioning','error guessing','experience-based test technique',
        'exploratory testing','state transition testing','statement coverage','test technique',
        'white-box test technique'],
  '5': ['defect management','defect report','entry criteria','exit criteria','product risk',
        'project risk','risk','risk analysis','risk assessment','risk control','risk identification',
        'risk level','risk management','risk mitigation','risk monitoring','risk-based testing',
        'test approach','test completion report','test plan','test progress report','test pyramid',
        'test strategy','testing quadrants'],
  '6': ['test automation']
};

const norm = s => s.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
const segsOf = term => term.split('/').map(norm).filter(Boolean);

const seenTerms = new Set();
GLOSSARY.forEach((g, i) => {
  const tag = `glossary[${i}] "${(g.term || '(sin term)').slice(0, 45)}"`;
  if (!g.term || !g.term.trim()) errors.push(`${tag}: term vacío`);
  for (const lang of ['es', 'en']) {
    if (!g.def || !g.def[lang] || !g.def[lang].trim()) errors.push(`${tag}: falta def.${lang}`);
  }
  if (!['1','2','3','4','5','6'].includes(g.chapter)) errors.push(`${tag}: chapter inválido "${g.chapter}"`);
  if (!g.source || !g.source.trim()) errors.push(`${tag}: source vacío`);
  const key = (g.term || '').toLowerCase().trim();
  if (seenTerms.has(key)) errors.push(`${tag}: término duplicado`);
  seenTerms.add(key);
});

const allSegs = new Set();
GLOSSARY.forEach(g => segsOf(g.term || '').forEach(s => allSegs.add(s)));
let totalKw = 0, missingKw = [];
for (const [ch, list] of Object.entries(KEYWORDS)) {
  for (const kw of list) {
    totalKw++;
    if (!allSegs.has(norm(kw))) missingKw.push(`keyword faltante (cap.${ch}): "${kw}"`);
  }
}
console.log(`\nKeywords oficiales cubiertos: ${totalKw - missingKw.length}/${totalKw}`);
missingKw.forEach(m => errors.push(m));

/* ===== FLASHCARDS (estructural) ===== */
const fcIds = new Set();
FLASHCARDS.forEach(f => {
  const tag = `flashcard id ${f.id}`;
  if (fcIds.has(f.id)) errors.push(`${tag}: id duplicado`);
  fcIds.add(f.id);
  for (const lang of ['es', 'en']) {
    if (!f.q || !f.q[lang] || !f.q[lang].trim()) errors.push(`${tag}: falta q.${lang}`);
    if (!f.a || !f.a[lang] || !f.a[lang].trim()) errors.push(`${tag}: falta a.${lang}`);
  }
});
```

- [ ] **Step 2: Ejecutar y verificar que falla como se espera**

Run: `node scripts/validate-content.js`
Expected: exit 1. Las validaciones de Fase 2 (CHAPTERS/LESSONS) siguen ✅. Errores nuevos: 48 × `source vacío` (todo el GLOSSARY actual) y ~60–70 `keyword faltante` (la cifra exacta antes del renombrado no es gate; la lista debe ser un subconjunto de los 97). Sin errores de FLASHCARDS (estructura ya válida).

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-content.js
git commit -m "test(content): extend validator with GLOSSARY keyword-completeness and FLASHCARDS checks"
```

---

### Task 2: Auditoría de los 48 términos existentes (source + nombres oficiales)

**Files:**
- Modify: `js/content.js` (solo el array `GLOSSARY`, líneas ~2372–2421)

**Interfaces:**
- Consumes: validador de Task 1.
- Produces: los 48 términos existentes con `source` y nombres oficiales; los errores `source vacío` desaparecen; quedan exactamente 59 `keyword faltante` (los de las Tasks 3–6).

- [ ] **Step 1: Renombrar términos al nombre oficial y añadir `source`**

Aplicar esta tabla (verificar cada definición contra el syllabus al pasar; corregir solo si contradice v4.0). Los no listados conservan su `term` actual y solo ganan `source`:

| term actual | term nuevo | source |
|---|---|---|
| Testing / Prueba | (igual — ya contiene los segmentos oficiales "testing" y "prueba") | Syllabus v4.0 keywords §1 · §1.1 |
| Defecto / Bug / Fault | Defecto / Defect | Syllabus v4.0 keywords §1 · §1.2.3 |
| Error / Mistake | (igual — el segmento "error" ya es el keyword oficial) | Syllabus v4.0 keywords §1 · §1.2.3 |
| Fallo / Failure | (igual) | Syllabus v4.0 keywords §1 · §1.2.3 |
| Causa raíz / Root cause | (igual) | Syllabus v4.0 keywords §1 · §1.2.4 |
| Calidad / Quality | (igual) | Syllabus v4.0 keywords §1 |
| Aseguramiento de calidad / QA | Aseguramiento de la calidad / Quality assurance (QA) | Syllabus v4.0 keywords §1 · §1.2.2 |
| Verificación / Verification | (igual) | Syllabus v4.0 keywords §1 · §1.1 |
| Validación / Validation | (igual) | Syllabus v4.0 keywords §1 · §1.1 |
| Testware | Producto de prueba / Testware | Syllabus v4.0 keywords §1 · §1.4.3 |
| Trazabilidad / Traceability | (igual) | Syllabus v4.0 keywords §1 · §1.4.4 |
| Prueba de componente / Unit test | Prueba de componentes / Component testing | Syllabus v4.0 keywords §2 · §2.2.1 |
| Prueba de integración / Integration test | Prueba de integración / Integration testing | Syllabus v4.0 keywords §2 · §2.2.1 |
| Prueba de sistema / System test | Prueba de sistema / System testing | Syllabus v4.0 keywords §2 · §2.2.1 |
| Prueba de aceptación / UAT | Prueba de aceptación / Acceptance testing | Syllabus v4.0 keywords §2 · §2.2.1 |
| Testing funcional | Prueba funcional / Functional testing | Syllabus v4.0 keywords §2 · §2.2.2 |
| Testing no funcional | Prueba no funcional / Non-functional testing | Syllabus v4.0 keywords §2 · §2.2.2 |
| Testing de regresión | Prueba de regresión / Regression testing | Syllabus v4.0 keywords §2 · §2.2.3 |
| Testing de humo / Smoke test | (igual) | Syllabus v4.0 §5.1.3 (ejemplo de criterios de salida) |
| Alpha testing | Prueba alfa / Alpha testing | Syllabus v4.0 §2.2.1 |
| Beta testing | Prueba beta / Beta testing | Syllabus v4.0 §2.2.1 |
| Revisión / Review | (igual) | Syllabus v4.0 keywords §3 · §3.2 |
| Inspección / Inspection | (igual) | Syllabus v4.0 keywords §3 · §3.2.4 |
| Walkthrough | Revisión guiada / Walkthrough | Syllabus v4.0 keywords §3 · §3.2.4 |
| Análisis estático / Static analysis | (igual) | Syllabus v4.0 keywords §3 · §3.1 |
| Partición de equivalencia / EP | Partición de equivalencia / Equivalence partitioning (EP) | Syllabus v4.0 keywords §4 · §4.2.1 |
| Análisis de valor límite / BVA | Análisis del valor frontera / Boundary value analysis (BVA) | Syllabus v4.0 keywords §4 · §4.2.2 |
| Tabla de decisión / Decision table | Prueba de tabla de decisión / Decision table testing | Syllabus v4.0 keywords §4 · §4.2.3 |
| Transición de estado / State transition | Prueba de transición de estado / State transition testing | Syllabus v4.0 keywords §4 · §4.2.4 |
| Prueba de sentencia / Statement coverage | Cobertura de sentencia / Statement coverage | Syllabus v4.0 keywords §4 · §4.3.1 |
| Prueba de rama / Branch coverage | Cobertura de rama / Branch coverage | Syllabus v4.0 keywords §4 · §4.3.2 |
| Testing exploratorio | Prueba exploratoria / Exploratory testing | Syllabus v4.0 keywords §4 · §4.4.2 |
| Error guessing / Adivinanza de errores | Predicción de errores / Error guessing | Syllabus v4.0 keywords §4 · §4.4.1 |
| ATDD | Desarrollo guiado por prueba de aceptación (ATDD) / Acceptance test-driven development | Syllabus v4.0 keywords §4 · §4.5.3 |
| Plan de pruebas / Test plan | Plan de prueba / Test plan | Syllabus v4.0 keywords §5 · §5.1.1 |
| Riesgo de producto / Product risk | (igual) | Syllabus v4.0 keywords §5 · §5.2.1 |
| Riesgo de proyecto / Project risk | (igual) | Syllabus v4.0 keywords §5 · §5.2.1 |
| Criterios de entrada / Entry criteria | (igual) | Syllabus v4.0 keywords §5 · §5.1.3 |
| Criterios de salida / Exit criteria | (igual) | Syllabus v4.0 keywords §5 · §5.1.3 |
| Métricas de prueba / Test metrics | (igual) | Syllabus v4.0 §5.3.1 |
| Gestión de configuración / Config management | Gestión de la configuración / Configuration management | Syllabus v4.0 §5.4 |
| Severidad / Severity | (igual) | Foundations of software testing (ISTQB) — glosario (verificar con pdftotext; si el libro no lo define, citar "Glosario ISTQB") |
| Prioridad / Priority | (igual) | Foundations of software testing (ISTQB) — glosario (ídem) |
| Gestión de defectos / Defect management | (igual) | Syllabus v4.0 keywords §5 · §5.5 |
| Testing de rendimiento / Performance testing | Prueba de rendimiento / Performance testing | Syllabus v4.0 §2.2.2 (eficiencia de desempeño, ISO/IEC 25010) |
| Shift-left testing | Desplazamiento a la izquierda / Shift left | Syllabus v4.0 keywords §2 · §2.1.5 |
| DevOps | (igual) | Syllabus v4.0 §2.1.4 |
| CI/CD | (igual) | Syllabus v4.0 §2.1.4 |

Notas:
- "Testing de humo / Smoke test": corroborado — `syllabus_en.txt` línea ~2174 lo menciona como ejemplo de criterio de salida. Se mantiene.
- Severidad/Prioridad: verificar en el libro (`pdftotext` + grep "severity"/"priority"). Si ninguna fuente oficial lo define, **eliminar la entrada** y anotarlo en el informe (Task 7). No inventar cita.
- Al renombrar, verificar el nombre ES nuevo con grep en `syllabus_es.txt` (ej. "análisis del valor frontera", "revisión guiada", "predicción de errores" — todos aparecen).

- [ ] **Step 2: Validar**

Run: `node scripts/validate-content.js`
Expected: exit 1, **cero** errores de `source vacío`/`def`/`chapter`/duplicados; exactamente **59** `keyword faltante`: 19 de cap.1, 8 de cap.2, 6 de cap.3, 8 de cap.4, 17 de cap.5, 1 de cap.6 (las listas de Tasks 3–6).

- [ ] **Step 3: Commit**

```bash
git add js/content.js
git commit -m "docs(content): audit existing 49 glossary terms — official v4.0 names + source citations"
```

---

### Task 3: Añadir los 19 keywords faltantes del Cap.1

**Files:**
- Modify: `js/content.js` (array `GLOSSARY` — insertar tras el último término de chapter "1")

**Interfaces:**
- Consumes: validador (Task 1), términos existentes auditados (Task 2).
- Produces: entradas para: coverage, debugging, test analysis, test basis, test case, test completion, test condition, test control, test data, test design, test execution, test implementation, test monitoring, test object, test objective, test planning, test procedure, test process, test result. Todas `chapter: "1"`.

- [ ] **Step 1: Redactar y añadir las 19 entradas**

Método por término: (1) nombre ES/EN de la tabla canónica de arriba; (2) grep del término en `syllabus_en.txt` y `syllabus_es.txt` (la mayoría se definen en §1.4.1 "Test Activities and Tasks" y §1.1); (3) `def` es/en de 1–2 frases parafraseando el syllabus; (4) `source: "Syllabus v4.0 keywords §1 · §X.Y.Z"`. Si el syllabus no desarrolla el término (p.ej. `test result`), usar el glosario del libro y citarlo. Formato — ejemplo completo (usar exactamente este estilo):

```js
{ term: "Base de prueba / Test basis", def: { es: "Conjunto de información (requisitos, historias de usuario, diseño, código, riesgos...) que se usa como base para el análisis y el diseño de las pruebas.", en: "The body of information (requirements, user stories, design, code, risks...) used as the basis for test analysis and design." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
{ term: "Depuración / Debugging", def: { es: "Proceso de encontrar, analizar y eliminar las causas de los fallos en el software. Es una actividad de desarrollo, distinta del testing, que identifica los fallos.", en: "The process of finding, analyzing and removing the causes of failures in software. It is a development activity, distinct from testing, which identifies the failures." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.1.2" },
```

- [ ] **Step 2: Validar**

Run: `node scripts/validate-content.js`
Expected: exit 1, `Keywords oficiales cubiertos: 57/97`; quedan 40 faltantes, **ninguno de cap.1**.

- [ ] **Step 3: Commit**

```bash
git add js/content.js
git commit -m "feat(content): add 19 Chapter 1 official keyword terms to glossary"
```

---

### Task 4: Añadir los 14 keywords faltantes de Cap.2 y Cap.3

**Files:**
- Modify: `js/content.js` (array `GLOSSARY`)

**Interfaces:**
- Consumes: validador; entradas previas.
- Produces: Cap.2 (`chapter: "2"`): black-box testing, component integration testing, confirmation testing, maintenance testing, system integration testing, test level, test type, white-box testing. Cap.3 (`chapter: "3"`): anomaly, dynamic testing, formal review, informal review, static testing, technical review.

- [ ] **Step 1: Redactar y añadir las 14 entradas**

Mismo método y formato que Task 3. Secciones de apoyo: cap.2 → §2.2.1 (niveles, incluida prueba de integración de sistemas), §2.2.2 (tipos, caja negra/blanca), §2.2.3 (confirmación/regresión), §2.3 (mantenimiento). Cap.3 → §3.1 (prueba estática/dinámica), §3.2.2 (anomalía), §3.2.4 (tipos de revisión: revisión informal, revisión guiada, revisión técnica, inspección; "formal review" se define en §3.2 como revisión que sigue un proceso definido). Ejemplo:

```js
{ term: "Anomalía / Anomaly", def: { es: "Condición que se desvía de lo esperado; en revisiones, los defectos potenciales detectados en el producto de trabajo se registran como anomalías.", en: "A condition that deviates from expectation; in reviews, potential defects found in the work product are logged as anomalies." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2.2" },
```

- [ ] **Step 2: Validar**

Run: `node scripts/validate-content.js`
Expected: exit 1, `Keywords oficiales cubiertos: 71/97`; quedan 26 faltantes, ninguno de cap.1–3.

- [ ] **Step 3: Commit**

```bash
git add js/content.js
git commit -m "feat(content): add 14 Chapter 2-3 official keyword terms to glossary"
```

---

### Task 5: Añadir los 8 keywords faltantes del Cap.4

**Files:**
- Modify: `js/content.js` (array `GLOSSARY`)

**Interfaces:**
- Consumes: validador; entradas previas.
- Produces: Cap.4 (`chapter: "4"`): acceptance criteria, black-box test technique, checklist-based testing, collaboration-based test approach, coverage item, experience-based test technique, test technique, white-box test technique.

- [ ] **Step 1: Redactar y añadir las 8 entradas**

Mismo método. Secciones: §4.1 (técnicas y elemento de cobertura), §4.4.3 (lista de comprobación), §4.5 (colaboración), §4.5.2 (criterios de aceptación). Ejemplo:

```js
{ term: "Elemento de cobertura / Coverage item", def: { es: "Atributo o combinación de atributos derivado de la base de prueba que una técnica usa como objetivo de cobertura (p. ej. particiones, ramas, transiciones).", en: "An attribute or combination of attributes derived from the test basis that a test technique uses as a coverage target (e.g., partitions, branches, transitions)." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.1" },
```

- [ ] **Step 2: Validar**

Run: `node scripts/validate-content.js`
Expected: exit 1, `Keywords oficiales cubiertos: 79/97`; quedan 18 faltantes, todos de cap.5–6.

- [ ] **Step 3: Commit**

```bash
git add js/content.js
git commit -m "feat(content): add 8 Chapter 4 official keyword terms to glossary"
```

---

### Task 6: Añadir los 18 keywords faltantes de Cap.5 y Cap.6 — validador en verde

**Files:**
- Modify: `js/content.js` (array `GLOSSARY`)

**Interfaces:**
- Consumes: validador; entradas previas.
- Produces: Cap.5 (`chapter: "5"`): defect report, risk, risk analysis, risk assessment, risk control, risk identification, risk level, risk management, risk mitigation, risk monitoring, risk-based testing, test approach, test completion report, test progress report, test pyramid, test strategy, testing quadrants. Cap.6 (`chapter: "6"`): test automation. **Al terminar, `node scripts/validate-content.js` sale con exit 0.**

- [ ] **Step 1: Redactar y añadir las 18 entradas**

Mismo método. Secciones: §5.2.1 (riesgo, nivel de riesgo), §5.2.2 (gestión del riesgo, prueba basada en el riesgo), §5.2.3 (identificación, evaluación → el análisis del riesgo = identificación + evaluación), §5.2.4 (control = mitigación + monitorización), §5.1.1 (plan/estrategia/enfoque), §5.3.2 (informes de avance y compleción), §5.1.6 (pirámide), §5.1.7 (cuadrantes), §5.5 (informe de defecto), §6.2 (automatización). Ejemplo:

```js
{ term: "Prueba basada en el riesgo / Risk-based testing", def: { es: "Enfoque en el que las actividades de prueba se seleccionan, priorizan y gestionan según el análisis y el nivel de los riesgos de producto.", en: "An approach where test activities are selected, prioritized and managed based on the analysis and level of product risks." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.2" },
```

- [ ] **Step 2: Validar — TODO en verde**

Run: `node scripts/validate-content.js`
Expected: **exit 0**, `Keywords oficiales cubiertos: 97/97`, "✅ Todas las validaciones pasan."

- [ ] **Step 3: Smoke de la UI del glosario (sin navegador)**

Run:
```bash
node -e "const fs=require('fs');const src=fs.readFileSync('js/content.js','utf8');const {GLOSSARY}=new Function(src+';return {GLOSSARY}')();const letters=[...new Set(GLOSSARY.map(g=>g.term[0].toUpperCase()))].sort();const hits=GLOSSARY.filter(g=>g.term.toLowerCase().includes('riesgo')||g.def.es.toLowerCase().includes('riesgo'));console.log('terms:',GLOSSARY.length,'letters:',letters.join(''),'busqueda riesgo:',hits.length);"
```
Expected: ~107 terms (48±bajas + 59), letras sin errores, búsqueda "riesgo" ≥ 10 resultados. (Emula `App.renderGlossary()` de `js/app.js:849-863`.)

- [ ] **Step 4: Commit**

```bash
git add js/content.js
git commit -m "feat(content): add Chapter 5-6 keyword terms — glossary covers all 97 official v4.0 keywords"
```

---

### Task 7: Barrido de FLASHCARDS (v4.0) + informe + docs

**Files:**
- Modify: `js/content.js` (array `FLASHCARDS`, líneas ~2248–2367)
- Modify: `docs/content-audit-report.md` (añadir sección "Fase 3")
- Modify: `CLAUDE.md` y `AGENTS.md` (tabla de fases: Fase 3 ✅)

**Interfaces:**
- Consumes: syllabus extraído; validador (debe seguir exit 0 al terminar).
- Produces: FLASHCARDS alineadas con v4.0; informe de Fase 3; docs actualizados.

- [ ] **Step 1: Corregir las flashcards con errores conocidos**

Correcciones obligatorias (verificadas contra el syllabus durante la planificación):

1. **id 9** — dice "4 niveles de prueba"; v4.0 §2.2.1 define **5**: prueba de componentes, prueba de integración de componentes, prueba de sistema, prueba de integración de sistemas, prueba de aceptación. Reescribir q/a (es/en) con los 5.
2. **id 14** — llama "revisiones formales" a la lista que incluye la revisión informal. v4.0 §3.2.4: los tipos de revisión son revisión informal, revisión guiada (walkthrough), revisión técnica e inspección. Reformular la pregunta a "¿Cuáles son los tipos de revisión...?" y usar "revisión guiada (walkthrough)".
3. **id 27** — beneficios de automatización: "disponibilidad 24/7" y "liberación de testers" no están en v4.0 §6.2. Sustituir por los beneficios oficiales: ahorro de tiempo en trabajo manual repetitivo, prevención de errores humanos simples (consistencia y repetibilidad), evaluación más objetiva (p. ej. cobertura), acceso más fácil a información para la gestión y el informe de pruebas, y reducción del tiempo de ejecución (detección más temprana, retroalimentación más rápida).
4. **id 28** — "falsa sensación de seguridad" no es un riesgo v4.0 §6.2 (gap conocido de Fase 2). Sustituir por riesgos oficiales: expectativas poco realistas sobre los beneficios de la herramienta, estimaciones imprecisas de tiempo/coste/esfuerzo (introducción, mantenimiento de scripts, cambio del proceso manual), usar la herramienta cuando la prueba manual es más apropiada, depender demasiado de la herramienta (ignorar el pensamiento crítico humano), dependencia del proveedor, y incompatibilidad con la plataforma de desarrollo.

- [ ] **Step 2: Barrer las 24 flashcards restantes contra el syllabus**

Para cada una: grep de su afirmación central en `syllabus_es.txt`/`syllabus_en.txt`; corregir solo si contradice v4.0 (mismo criterio que la auditoría de Fase 2). Puntos de atención: id 8 (roles: v4.0 §1.4.5 habla de rol de gestión de pruebas y rol de prueba), id 18 (2^n solo para tablas de decisión completas), id 21/22 (definiciones exploratoria/ATDD).

- [ ] **Step 3: Validar**

Run: `node scripts/validate-content.js`
Expected: exit 0 (estructura de flashcards intacta).

- [ ] **Step 4: Informe y docs**

En `docs/content-audit-report.md`, añadir sección `## Fase 3 — Glosario y flashcards (2026-07-01)` con: total de términos final, 97/97 keywords, tabla de renombrados/bajas de Task 2 (con motivo y fuente), correcciones de flashcards (id → qué se corrigió → fuente). En `CLAUDE.md` y `AGENTS.md`: marcar Fase 3 como ✅ Done en la tabla de fases (mencionar validador extendido y barrido de flashcards), eliminar el aviso "Not yet fixed" sobre FLASHCARDS id 28, y actualizar la línea "To resume this effort".

- [ ] **Step 5: Commit**

```bash
git add js/content.js docs/content-audit-report.md CLAUDE.md AGENTS.md
git commit -m "docs(content): sweep flashcards for v4.0 fidelity; Phase 3 report and docs"
```

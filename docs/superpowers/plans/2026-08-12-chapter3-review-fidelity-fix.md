# Fidelidad del capítulo 3 (Prueba Estática) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir las lecciones 3.1 y 3.2 de `js/content.js` según el syllabus ISTQB CTFL v4.0/v4.0.1: proceso de revisión de 6→5 actividades, tabla de tipos de revisión con características clave (sin "moderador certificado"), 9.º factor de éxito, restricción del autor en inspección, y dos beneficios del testing estático.

**Architecture:** Solo se editan strings de contenido HTML dentro de `LESSONS["3.1"]` y `LESSONS["3.2"]` (ES+EN) en `js/content.js`. No se toca `CHAPTERS`, `QUESTIONS`, `GLOSSARY`, `FLASHCARDS`, CSS ni JS de la app. Los gates existentes (`validate-content.js`, `verify-runtime.js`) hacen de suite de regresión.

**Tech Stack:** Vanilla JS (objetos de datos globales), validadores Node sin dependencias.

**Spec:** `docs/superpowers/specs/2026-08-12-chapter3-review-fidelity-fix-design.md` — leerla ante cualquier duda; los textos de este plan son los definitivos.

## Global Constraints

- **Nunca inventar contenido ISTQB**: todo texto nuevo sale de la spec, que a su vez es literal del syllabus EN v4.0.1 (§3.1.2/§3.2) o de la traducción oficial ES v4.0.
- **Decisión de Jorge (2026-08-12):** en §3.2.4 manda el ORIGINAL INGLÉS: el autor no puede actuar como "líder de la revisión ni escriba" ("review leader or scribe"). La traducción oficial ES dice "revisor" por un defecto de traducción — NO usarla.
- **Sin em-dashes (—) en el contenido nuevo** de `js/content.js` (convención del repo, commit `15c5c61`): usar paréntesis, coma o dos puntos.
- ES y EN deben quedar semánticamente equivalentes (paridad bilingüe, la valida `validate-content.js`).
- Los footers `<p class="lesson-source">` NO se tocan (siguen citando §3.1 y §3.2).
- Después de CADA edición a `js/content.js`: ejecutar `node scripts/validate-content.js` y `node scripts/verify-runtime.js` desde la raíz del repo. Un fallo es bloqueante.
- Commits directos a `master`, mensajes en español sin tildes (convención del repo), formato `fix(content): ...`.
- El pre-commit hook valida la copia staged; si bloquea el commit, investigar, no saltárselo con `--no-verify`.

---

### Task 1: Lección 3.1 — dos beneficios del testing estático (§3.1.2)

**Files:**
- Modify: `js/content.js` (lección `"3.1"`, listas de beneficios ES ~línea 910 y EN ~línea 961)

**Interfaces:**
- Consumes: nada (primera task).
- Produces: nada que consuman otras tasks (cada task edita bloques disjuntos).

- [ ] **Step 1: Editar la lista ES de beneficios**

En `js/content.js`, dentro de `LESSONS["3.1"].es.content`, reemplazar exactamente:

```html
  <li>Facilita la comunicación entre el equipo</li>
  <li>Reduce el tiempo de testing dinámico posterior</li>
</ul>
```

por:

```html
  <li>Facilita la comunicación entre el equipo</li>
  <li>Reduce el tiempo de testing dinámico posterior</li>
  <li>Permite a los implicados verificar que los requisitos documentados describen sus <strong>necesidades reales</strong></li>
  <li>Crea un <strong>entendimiento compartido</strong> entre los implicados, al poder realizarse en fases tempranas del ciclo de vida</li>
</ul>
```

- [ ] **Step 2: Editar la lista EN de beneficios**

En `LESSONS["3.1"].en.content`, reemplazar exactamente:

```html
  <li>Facilitates communication within the team</li>
  <li>Reduces the time needed for later dynamic testing</li>
</ul>
```

por:

```html
  <li>Facilitates communication within the team</li>
  <li>Reduces the time needed for later dynamic testing</li>
  <li>Lets stakeholders verify that the documented requirements describe their <strong>actual needs</strong></li>
  <li>Creates a <strong>shared understanding</strong> among stakeholders, since it can be performed early in the SDLC</li>
</ul>
```

- [ ] **Step 3: Ejecutar los gates**

Run: `node scripts/validate-content.js && node scripts/verify-runtime.js`
Expected: ambos terminan con exit 0 (mensaje de éxito, sin errores listados).

- [ ] **Step 4: Verificación puntual**

Run: `grep -c "necesidades reales" js/content.js && grep -c "actual needs" js/content.js`
Expected: al menos `1` en cada grep (el conteo exacto puede ser mayor si el término ya existe en otras lecciones; lo que importa es que no sea 0).

- [ ] **Step 5: Commit**

```bash
git add js/content.js
git commit -m "fix(content): beneficios del testing estatico segun 3.1.2 (necesidades reales y entendimiento compartido)"
```

---

### Task 2: Lección 3.2 — proceso de revisión con las 5 actividades oficiales

**Files:**
- Modify: `js/content.js` (lección `"3.2"`, `<ol>` del proceso ES ~línea 1010 y EN ~línea 1058)

**Interfaces:**
- Consumes: nada.
- Produces: nada que consuman otras tasks.

**Por qué:** la lección lista 6 pasos con "Seguimiento/Follow-up" como paso propio; el syllabus §3.2.2 define exactamente 5 actividades y sitúa el follow-up DENTRO de "Comunicación y análisis". Es el error más grave del feedback (y contradice la explicación de la pregunta id 78, que ya enumera 5).

- [ ] **Step 1: Editar el `<ol>` ES**

En `LESSONS["3.2"].es.content`, reemplazar exactamente:

```html
<ol>
  <li><strong>Planificación:</strong> Definir alcance, criterios de entrada/salida, asignar roles</li>
  <li><strong>Inicio:</strong> Distribuir materiales, verificar criterios de entrada</li>
  <li><strong>Revisión individual:</strong> Cada revisor examina el producto de trabajo</li>
  <li><strong>Comunicación y análisis:</strong> Reunión para discutir los hallazgos</li>
  <li><strong>Corrección y reporte:</strong> El autor corrige; se genera el informe</li>
  <li><strong>Seguimiento:</strong> Verificar que los defectos fueron corregidos</li>
</ol>
```

por:

```html
<ol>
  <li><strong>Planificación:</strong> Definir el alcance de la revisión: propósito, producto de trabajo, características de calidad a evaluar, áreas de foco, criterios de salida, esfuerzo y plazos</li>
  <li><strong>Inicio de la revisión:</strong> Asegurar que cada participante tiene acceso al producto de trabajo, entiende su rol y recibe todo lo necesario</li>
  <li><strong>Revisión individual:</strong> Cada revisor evalúa el producto de trabajo aplicando técnicas de revisión y registra anomalías, recomendaciones y preguntas</li>
  <li><strong>Comunicación y análisis:</strong> Las anomalías identificadas no son necesariamente defectos: se analizan y discuten, decidiendo su estado, propiedad y acciones (normalmente en una reunión de revisión). Puede ser necesaria una <strong>revisión de seguimiento</strong> para completar las acciones</li>
  <li><strong>Corrección y suministro de información:</strong> Se crea un informe de defecto por cada defecto para seguir las acciones correctivas; alcanzados los criterios de salida, el producto se acepta y se informa de los resultados</li>
</ol>
<div class="example-box">
📌 <strong>Ojo:</strong> el proceso de revisión tiene exactamente <strong>5 actividades</strong>. El seguimiento (follow-up) NO es una actividad propia: forma parte de «Comunicación y análisis».
</div>
```

- [ ] **Step 2: Editar el `<ol>` EN**

En `LESSONS["3.2"].en.content`, reemplazar exactamente:

```html
<ol>
  <li><strong>Planning:</strong> Define scope, entry/exit criteria, assign roles</li>
  <li><strong>Kick-off:</strong> Distribute materials, check entry criteria</li>
  <li><strong>Individual review:</strong> Each reviewer examines the work product</li>
  <li><strong>Communication and analysis:</strong> Meeting to discuss findings</li>
  <li><strong>Fixing and reporting:</strong> The author fixes issues; a report is produced</li>
  <li><strong>Follow-up:</strong> Verify that defects were fixed</li>
</ol>
```

por:

```html
<ol>
  <li><strong>Planning:</strong> Define the review scope: purpose, work product, quality characteristics to evaluate, areas to focus on, exit criteria, effort and timeframes</li>
  <li><strong>Review initiation:</strong> Make sure every participant has access to the work product, understands their role and receives everything needed</li>
  <li><strong>Individual review:</strong> Each reviewer assesses the work product applying review techniques and logs anomalies, recommendations and questions</li>
  <li><strong>Communication and analysis:</strong> Identified anomalies are not necessarily defects: they are analyzed and discussed, deciding their status, ownership and required actions (typically in a review meeting). A <strong>follow-up review</strong> may be required to complete actions</li>
  <li><strong>Fixing and reporting:</strong> A defect report is created for every defect so corrective actions can be followed up; once exit criteria are reached, the work product is accepted and results are reported</li>
</ol>
<div class="example-box">
📌 <strong>Watch out:</strong> the review process has exactly <strong>5 activities</strong>. Follow-up is NOT a separate activity: it is part of "Communication and analysis".
</div>
```

- [ ] **Step 3: Ejecutar los gates**

Run: `node scripts/validate-content.js && node scripts/verify-runtime.js`
Expected: ambos con exit 0.

- [ ] **Step 4: Verificación puntual (el error no puede seguir presente)**

Run: `grep -c "<strong>Seguimiento:</strong>" js/content.js; grep -c "<strong>Follow-up:</strong>" js/content.js`
Expected: `0` y `0` (grep -c devuelve 0 coincidencias; el comando sale con código 1, es lo esperado).

Run: `grep -c "revisión de seguimiento" js/content.js`
Expected: al menos `1` (el follow-up ahora vive dentro del paso 4).

- [ ] **Step 5: Commit**

```bash
git add js/content.js
git commit -m "fix(content): proceso de revision con las 5 actividades oficiales, el seguimiento deja de ser paso propio (3.2.2)"
```

---

### Task 3: Lección 3.2 — tabla de tipos de revisión con características clave

**Files:**
- Modify: `js/content.js` (lección `"3.2"`, `<table>` ES ~línea 993 y EN ~línea 1041)

**Interfaces:**
- Consumes: nada.
- Produces: nada que consuman otras tasks.

**Por qué:** el feedback pide una columna de características clave; además la tabla actual tiene dos errores propios: "Moderador certificado" (no existe en v4.0) y el objetivo de la informal ("encontrar defectos rápidamente" cuando el syllabus dice "detectar anomalías"). La columna "Guiado por" desaparece: el syllabus no afirma quién guía la informal ni la inspección, y donde sí lo dice (walkthrough/técnica) pasa a la columna de características.

- [ ] **Step 1: Editar la tabla ES**

En `LESSONS["3.2"].es.content`, reemplazar exactamente:

```html
<table>
  <tr><th>Tipo</th><th>Formalidad</th><th>Guiado por</th><th>Objetivo</th></tr>
  <tr><td>Informal</td><td>Muy baja</td><td>Cualquiera</td><td>Encontrar defectos rápidamente</td></tr>
  <tr><td>Walkthrough</td><td>Baja-Media</td><td>Autor</td><td>Aprendizaje del equipo</td></tr>
  <tr><td>Revisión técnica</td><td>Media</td><td>Moderador</td><td>Consenso técnico</td></tr>
  <tr><td>Inspección</td><td>Alta</td><td>Moderador certificado</td><td>Máxima detección de defectos</td></tr>
</table>
```

por:

```html
<table>
  <tr><th>Tipo</th><th>Formalidad</th><th>Objetivo principal</th><th>Características clave</th></tr>
  <tr><td>Informal</td><td>Muy baja</td><td>Detectar anomalías</td><td>Sin proceso definido; no requiere salida formal documentada</td></tr>
  <tr><td>Walkthrough</td><td>Baja-Media</td><td>Evaluar calidad, educar a los revisores, obtener consenso, generar ideas, detectar anomalías</td><td>Guiada por el <strong>autor</strong>; la revisión individual previa NO es obligatoria</td></tr>
  <tr><td>Revisión técnica</td><td>Media</td><td>Obtener consenso y tomar decisiones sobre un problema técnico; detectar anomalías</td><td>Revisores <strong>técnicamente cualificados</strong>, dirigida por un moderador</td></tr>
  <tr><td>Inspección</td><td>Alta (la más formal)</td><td>Encontrar el máximo número de anomalías</td><td>Sigue el proceso genérico completo; se recopilan <strong>métricas</strong> para mejorar el SDLC; el autor NO puede ser líder de la revisión ni escriba</td></tr>
</table>
```

- [ ] **Step 2: Editar la tabla EN**

En `LESSONS["3.2"].en.content`, reemplazar exactamente:

```html
<table>
  <tr><th>Type</th><th>Formality</th><th>Led by</th><th>Objective</th></tr>
  <tr><td>Informal</td><td>Very low</td><td>Anyone</td><td>Find defects quickly</td></tr>
  <tr><td>Walkthrough</td><td>Low-Medium</td><td>Author</td><td>Team learning</td></tr>
  <tr><td>Technical review</td><td>Medium</td><td>Moderator</td><td>Technical consensus</td></tr>
  <tr><td>Inspection</td><td>High</td><td>Certified moderator</td><td>Maximum defect detection</td></tr>
</table>
```

por:

```html
<table>
  <tr><th>Type</th><th>Formality</th><th>Main objective</th><th>Key characteristics</th></tr>
  <tr><td>Informal</td><td>Very low</td><td>Detecting anomalies</td><td>No defined process; no formal documented output required</td></tr>
  <tr><td>Walkthrough</td><td>Low-Medium</td><td>Evaluate quality, educate reviewers, gain consensus, generate ideas, detect anomalies</td><td>Led by the <strong>author</strong>; individual review beforehand is NOT required</td></tr>
  <tr><td>Technical review</td><td>Medium</td><td>Gain consensus and make decisions on a technical problem; detect anomalies</td><td><strong>Technically qualified</strong> reviewers, led by a moderator</td></tr>
  <tr><td>Inspection</td><td>High (most formal)</td><td>Find the maximum number of anomalies</td><td>Follows the complete generic process; <strong>metrics</strong> are collected to improve the SDLC; the author canNOT act as review leader or scribe</td></tr>
</table>
```

- [ ] **Step 3: Ejecutar los gates**

Run: `node scripts/validate-content.js && node scripts/verify-runtime.js`
Expected: ambos con exit 0.

- [ ] **Step 4: Verificación puntual**

Run: `grep -ci "moderador certificado" js/content.js; grep -ci "certified moderator" js/content.js`
Expected: `0` y `0` (exit 1 de grep es lo esperado).

Run: `grep -c "líder de la revisión ni escriba" js/content.js && grep -c "review leader or scribe" js/content.js`
Expected: al menos `1` en cada uno.

- [ ] **Step 5: Commit**

```bash
git add js/content.js
git commit -m "fix(content): tabla de tipos de revision con caracteristicas clave segun 3.2.4, fuera el moderador certificado"
```

---

### Task 4: Lección 3.2 — noveno factor de éxito + tip de examen ampliado

**Files:**
- Modify: `js/content.js` (lección `"3.2"`, lista de factores ES ~línea 1019 / EN ~línea 1067 y `highlight-box` ES ~línea 1029 / EN ~línea 1077)

**Interfaces:**
- Consumes: nada.
- Produces: nada que consuman otras tasks.

- [ ] **Step 1: Añadir el factor 9 en ES**

En `LESSONS["3.2"].es.content`, reemplazar exactamente:

```html
  <li>Formación adecuada para todos los participantes</li>
</ul>
```

por:

```html
  <li>Formación adecuada para todos los participantes</li>
  <li>Facilitar las reuniones</li>
</ul>
```

- [ ] **Step 2: Añadir el factor 9 en EN**

En `LESSONS["3.2"].en.content`, reemplazar exactamente:

```html
  <li>Adequate training for all participants</li>
</ul>
```

por:

```html
  <li>Adequate training for all participants</li>
  <li>Facilitating meetings</li>
</ul>
```

- [ ] **Step 3: Ampliar el highlight-box ES**

Reemplazar exactamente:

```html
<div class="highlight-box">
💡 <strong>Para el examen:</strong> La INSPECCIÓN es la revisión más formal. El WALKTHROUGH es guiado por el autor. La revisión INFORMAL no tiene proceso definido. El GESTOR y el MODERADOR son roles distintos: el Gestor decide qué se revisa y aporta recursos; el Moderador facilita la reunión.
</div>
```

por:

```html
<div class="highlight-box">
💡 <strong>Para el examen:</strong> Memoriza el orden de formalidad (Informal &lt; Walkthrough &lt; Revisión técnica &lt; Inspección): las preguntas suelen plantear un escenario y pedir el tipo de revisión adecuado. La INSPECCIÓN es la más formal y en ella el autor NO puede actuar como líder de la revisión ni como escriba. El WALKTHROUGH es guiado por el autor. La revisión INFORMAL no tiene proceso definido. El GESTOR y el MODERADOR son roles distintos: el Gestor decide qué se revisa y aporta recursos; el Moderador facilita la reunión.
</div>
```

- [ ] **Step 4: Ampliar el highlight-box EN**

Reemplazar exactamente:

```html
<div class="highlight-box">
💡 <strong>For the exam:</strong> INSPECTION is the most formal review. WALKTHROUGH is led by the author. INFORMAL review has no defined process. MANAGER and MODERATOR are distinct roles: the Manager decides what is reviewed and provides resources; the Moderator facilitates the meeting.
</div>
```

por:

```html
<div class="highlight-box">
💡 <strong>For the exam:</strong> Memorize the formality order (Informal &lt; Walkthrough &lt; Technical review &lt; Inspection): questions often present a scenario and ask which review type fits. INSPECTION is the most formal and in it the author canNOT act as review leader or scribe. WALKTHROUGH is led by the author. INFORMAL review has no defined process. MANAGER and MODERATOR are distinct roles: the Manager decides what is reviewed and provides resources; the Moderator facilitates the meeting.
</div>
```

- [ ] **Step 5: Ejecutar los gates**

Run: `node scripts/validate-content.js && node scripts/verify-runtime.js`
Expected: ambos con exit 0.

- [ ] **Step 6: Verificación puntual**

Run: `grep -c "Facilitar las reuniones" js/content.js && grep -c "Facilitating meetings" js/content.js && grep -c "orden de formalidad" js/content.js`
Expected: al menos `1` en cada uno.

Run: `git diff HEAD~3 -- js/content.js | grep "^+" | grep -c "—"`
Expected: `0` (exit 1 de grep es lo esperado). Nota: en este punto hay 3 commits hechos (Tasks 1-3) y los cambios de esta task aún están sin commitear, así que `git diff HEAD~3` cubre las adiciones de las 4 tasks; ninguna línea añadida puede contener un em-dash.

- [ ] **Step 7: Commit**

```bash
git add js/content.js
git commit -m "fix(content): noveno factor de exito de las revisiones (facilitar reuniones) y tip de examen ampliado (3.2.5)"
```

---

### Task 5: Sincronizar CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (sección "ISTQB Content Fidelity Effort", tras el párrafo del gap de Reddit del 2026-08-10)

**Interfaces:**
- Consumes: los 4 commits anteriores (los referencia narrativamente, sin SHAs).
- Produces: nada.

- [ ] **Step 1: Añadir el párrafo de cierre a CLAUDE.md**

En `CLAUDE.md`, localizar el final del párrafo que empieza por `**User-reported gap, CLOSED (2026-08-10).**` (termina en `...question (id 72, white-box) is untouched.`) e insertar inmediatamente después, como párrafo nuevo:

```markdown
**Second user-reported gap, CLOSED (2026-08-12).** A user reported 6 issues in chapter 3
(static testing). Verified against the official EN syllabus v4.0.1 (§3.1.2/§3.2, pp. 33-37) and
the official ES v4.0 translation: 4 were real gaps/errors, 1 a correct fidelity improvement, 1 a
pedagogical extra. Fixed in lessons 3.1/3.2 only (`LESSONS` in `js/content.js`; `CHAPTERS`,
questions, glossary and flashcards were verified correct and untouched): (a) the review process
now lists the official **5 activities** of §3.2.2 (it taught 6, with "Seguimiento/Follow-up" as
its own step; follow-up belongs INSIDE "Communication and analysis") — this also removed a
contradiction with question id 78, whose explanation already enumerated the 5 correctly; (b) the
review-types table gained a key-characteristics column and lost two errors of its own: "Certified
moderator" (does not exist in v4.0) and the informal review's objective now reads "detecting
anomalies" (not "find defects quickly"); (c) 9th review success factor added ("Facilitar las
reuniones"/"Facilitating meetings", §3.2.5); (d) inspection now states the author cannot act as
review leader or scribe (§3.2.4); (e) lesson 3.1 gained the two §3.1.2 benefits (requirements
match real needs; shared understanding); (f) exam tip extended with the formality order, framed
as a study aid (the syllabus only asserts the extremes). **Known EN/ES translation defect in
§3.2.4, decision: follow the ENGLISH.** The official ES translation says the author cannot act as
"revisor" (reviewer) where the EN original says "review leader" — not the same role. Same
precedent as safety = "seguridad funcional": the exam is built from the EN LOs, so both languages
say "líder de la revisión ni escriba" / "review leader or scribe". Spec:
`docs/superpowers/specs/2026-08-12-chapter3-review-fidelity-fix-design.md`.
```

- [ ] **Step 2: Ejecutar los gates (sanidad, CLAUDE.md no está gateado pero el hook corre igual)**

Run: `node scripts/validate-content.js && node scripts/verify-runtime.js`
Expected: ambos con exit 0.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: sincroniza CLAUDE.md, fix de fidelidad del capitulo 3 (proceso de revision, tipos y factores)"
```

---

## Cierre (sesión principal, no subagente)

Tras las 5 tasks: review final de la rama completa, `git push`, commitear spec+plan si no están
ya versionados, y deploy manual (`vercel deploy --prod --yes`, con `NODE_EXTRA_CA_CERTS` si se
está en la red corporativa). Verificar en producción que la lección 3.2 muestra 5 actividades.

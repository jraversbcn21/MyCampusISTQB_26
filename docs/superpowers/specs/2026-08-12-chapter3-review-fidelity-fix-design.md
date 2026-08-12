# Fidelidad del capítulo 3 (Prueba Estática) — proceso de revisión, tipos y factores de éxito

**Fecha:** 2026-08-12
**Origen:** feedback de un usuario real (segundo reporte externo tras el de ISO 25010 del 2026-08-10).
**Alcance:** solo `LESSONS["3.1"]` y `LESSONS["3.2"]` en `js/content.js` (ES+EN). No se toca
`CHAPTERS`, ni el banco de preguntas, ni el glosario, ni las flashcards, ni CSS/JS de la app.

## Contexto y veredicto del feedback

Un usuario reportó 6 puntos sobre el capítulo 3. Contrastados uno a uno contra el syllabus
oficial **EN v4.0.1** (`ISTQB 2026/ISTQB_CTFL_Syllabus_v4.0.1.pdf`, §3.1.2 y §3.2, págs. 33–37)
y la traducción oficial **ES v4.0 / V01.01** (SSTQB, §3.1–3.2, págs. 38–43):

| # | Punto | Veredicto |
|---|-------|-----------|
| 1 | Valor del testing estático: verificar que los requisitos describen las necesidades reales + entendimiento compartido | ✅ Hueco real (§3.1.2, ambas frases literales) |
| 2 | Añadir columna de características clave a la tabla de tipos de revisión | ✅ Correcto; además la tabla actual tiene 2 errores propios (ver abajo) |
| 3 | Exam tip: memorizar el orden de formalidad | ⚠️ Válido como ayuda de estudio; el orden intermedio NO lo afirma el syllabus |
| 4 | "Follow-up/Seguimiento" no es un paso propio del proceso de revisión | ✅ **Error real** — §3.2.2 define exactamente **5** actividades; la lección lista 6 |
| 5 | En la inspección el autor no puede actuar como líder de la revisión ni escriba | ✅ Hueco real (§3.2.4, frase literal del EN) |
| 6 | Falta "Facilitar las reuniones" en los factores de éxito | ✅ Hueco real — §3.2.5 lista **9** factores; la lección tiene 8 |

**Errores adicionales encontrados durante la verificación (no reportados por el usuario):**

- La tabla de tipos de revisión dice que la inspección la guía un **"Moderador certificado" /
  "Certified moderator"**. Ese concepto **no existe en v4.0** (residuo de versiones antiguas del
  syllabus). v4.0 solo dice que la inspección sigue el proceso genérico completo y que el autor
  no puede actuar como líder de la revisión ni como escriba.
- El objetivo de la revisión informal en la tabla es "Encontrar defectos rápidamente". El
  syllabus dice *"The main objective is detecting **anomalies**"* — y la distinción
  anomalía/defecto es central en §3.2.2 ("las anomalías identificadas no son necesariamente
  defectos"), así que no es un matiz cosmético.
- **Contradicción interna de la app:** la explicación de la pregunta id 78
  (`js/questions.js`) ya enumera correctamente las 5 actividades; la lección 3.2 enseña 6.
  Este fix elimina la contradicción **sin tocar la pregunta** (la pregunta está bien).

## Decisión de fuente — discrepancia EN/ES en §3.2.4 (DECISIÓN DE JORGE, 2026-08-12)

La traducción oficial ES v4.0 dice *"el autor no puede actuar como **revisor** o escriba"*
donde el original EN v4.0.1 dice *"the author cannot act as the **review leader** or scribe"*.
No son el mismo rol y cambia la respuesta de una pregunta de examen.

**Se sigue el inglés en ambos idiomas:** "líder de la revisión o escriba" / "review leader or
scribe". Mismo criterio-precedente que "safety = seguridad funcional" (2026-08-10): ante un
defecto de la traducción ES, manda el original EN porque los LOs y el examen se construyen
desde él. Documentar la desviación en CLAUDE.md al cerrar.

## Cambios — Lección 3.1 (`LESSONS["3.1"]`)

Un solo cambio: en la lista `<h3>Beneficios del Testing Estático</h3>` /
`<h3>Benefits of Static Testing</h3>`, añadir **dos** `<li>` al final de la lista existente
(los 5 ítems actuales se conservan tal cual):

ES:
```html
<li>Permite a los implicados verificar que los requisitos documentados describen sus <strong>necesidades reales</strong></li>
<li>Crea un <strong>entendimiento compartido</strong> entre los implicados, al poder realizarse en fases tempranas del ciclo de vida</li>
```

EN:
```html
<li>Lets stakeholders verify that the documented requirements describe their <strong>actual needs</strong></li>
<li>Creates a <strong>shared understanding</strong> among stakeholders, since it can be performed early in the SDLC</li>
```

Fuente: §3.1.2 (EN pág. 33 / ES pág. 38-39). El footer `§3.1` no cambia.

## Cambios — Lección 3.2 (`LESSONS["3.2"]`)

### A) Proceso de revisión: de 6 pasos a 5 (corrección de error — el punto crítico)

Sustituir el `<ol>` completo. Los nombres ES son los de la traducción oficial (págs. 41-42):
Planificación · Inicio de la Revisión · Revisión Individual · Comunicación y Análisis ·
Corrección y Suministro de Información. El seguimiento pasa a vivir DENTRO del paso 4, que es
donde el syllabus lo sitúa (*"A follow-up review may be required to complete actions"* /
*"Puede ser necesaria una revisión de seguimiento para completar las acciones"*).

ES:
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

EN (nombres oficiales EN: Planning · Review initiation · Individual review · Communication
and analysis · Fixing and reporting):
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

### B) Tabla de tipos de revisión: reestructurar con características clave (punto 2 + 2 errores propios)

Sustituir la tabla actual (`Tipo | Formalidad | Guiado por | Objetivo`) por
`Tipo | Formalidad | Objetivo principal | Características clave` — la columna "Guiado por" se
funde en las características (evita afirmar quién guía la informal y la inspección, cosa que el
syllabus no dice). Elimina "Moderador certificado" y corrige el objetivo de la informal.
Todo el contenido de las celdas es literal de §3.2.4:

ES:
```html
<table>
  <tr><th>Tipo</th><th>Formalidad</th><th>Objetivo principal</th><th>Características clave</th></tr>
  <tr><td>Informal</td><td>Muy baja</td><td>Detectar anomalías</td><td>Sin proceso definido; no requiere salida formal documentada</td></tr>
  <tr><td>Walkthrough</td><td>Baja-Media</td><td>Evaluar calidad, educar a los revisores, obtener consenso, generar ideas, detectar anomalías</td><td>Guiada por el <strong>autor</strong>; la revisión individual previa NO es obligatoria</td></tr>
  <tr><td>Revisión técnica</td><td>Media</td><td>Obtener consenso y tomar decisiones sobre un problema técnico; detectar anomalías</td><td>Revisores <strong>técnicamente cualificados</strong>, dirigida por un moderador</td></tr>
  <tr><td>Inspección</td><td>Alta (la más formal)</td><td>Encontrar el máximo número de anomalías</td><td>Sigue el proceso genérico completo; se recopilan <strong>métricas</strong> para mejorar el SDLC; el autor NO puede ser líder de la revisión ni escriba</td></tr>
</table>
```

EN:
```html
<table>
  <tr><th>Type</th><th>Formality</th><th>Main objective</th><th>Key characteristics</th></tr>
  <tr><td>Informal</td><td>Very low</td><td>Detecting anomalies</td><td>No defined process; no formal documented output required</td></tr>
  <tr><td>Walkthrough</td><td>Low-Medium</td><td>Evaluate quality, educate reviewers, gain consensus, generate ideas, detect anomalies</td><td>Led by the <strong>author</strong>; individual review beforehand is NOT required</td></tr>
  <tr><td>Technical review</td><td>Medium</td><td>Gain consensus and make decisions on a technical problem; detect anomalies</td><td><strong>Technically qualified</strong> reviewers, led by a moderator</td></tr>
  <tr><td>Inspection</td><td>High (most formal)</td><td>Find the maximum number of anomalies</td><td>Follows the complete generic process; <strong>metrics</strong> are collected to improve the SDLC; the author canNOT act as review leader or scribe</td></tr>
</table>
```

(La tabla se envuelve sola en `.table-scroll` en móvil vía `App._wrapLessonTables()` — nada
que hacer ahí.)

### C) Factores de éxito: añadir el 9.º (punto 6)

Añadir al final de la lista de factores de éxito existente (los 8 actuales se conservan):

- ES: `<li>Facilitar las reuniones</li>`
- EN: `<li>Facilitating meetings</li>`

### D) Highlight-box "Para el examen": ampliar (puntos 3 y 5)

Sustituir el `highlight-box` final por (conserva todo lo actual y añade dos frases):

ES:
```html
<div class="highlight-box">
💡 <strong>Para el examen:</strong> Memoriza el orden de formalidad (Informal &lt; Walkthrough &lt; Revisión técnica &lt; Inspección): las preguntas suelen plantear un escenario y pedir el tipo de revisión adecuado. La INSPECCIÓN es la más formal y en ella el autor NO puede actuar como líder de la revisión ni como escriba. El WALKTHROUGH es guiado por el autor. La revisión INFORMAL no tiene proceso definido. El GESTOR y el MODERADOR son roles distintos: el Gestor decide qué se revisa y aporta recursos; el Moderador facilita la reunión.
</div>
```

EN:
```html
<div class="highlight-box">
💡 <strong>For the exam:</strong> Memorize the formality order (Informal &lt; Walkthrough &lt; Technical review &lt; Inspection): questions often present a scenario and ask which review type fits. INSPECTION is the most formal and in it the author canNOT act as review leader or scribe. WALKTHROUGH is led by the author. INFORMAL review has no defined process. MANAGER and MODERATOR are distinct roles: the Manager decides what is reviewed and provides resources; the Moderator facilitates the meeting.
</div>
```

Nota de redacción: el orden completo de formalidad se presenta como **ayuda de estudio**, no
como cita del syllabus (el syllabus solo afirma los extremos: informal la menos formal,
inspección la más formal). Por eso vive en el tip de examen y no en la tabla.

## Fuera de alcance (deliberado)

- **`js/questions.js`:** la pregunta id 78 ya es correcta (5 actividades); ids 74/79 correctas.
  Nada que tocar.
- **Glosario y flashcards:** verificados — las entradas de revisión/inspección/walkthrough del
  glosario y la flashcard de tipos de revisión son fieles a v4.0. Nada que tocar.
- **`CHAPTERS`:** `lo`/`source` de los topics 3.1/3.2 ya son correctos.
- **Ningún gate nuevo:** los errores de contenido corregidos por la auditoría de fase 2
  tampoco añadieron checks de redacción; el gate de citas (`checkSyllabusRefs`) ya cubre lo
  gateable. Los footers siguen citando `§3.1`/`§3.2` (secciones reales).

## Verificación

1. `node scripts/validate-content.js` — footers y citas (debe pasar sin cambios).
2. `node scripts/verify-runtime.js` — i18n/regresiones (ningún check ancla a lecciones 3.x;
   debe pasar sin cambios).
3. Revisión manual del render de la lección 3.2 en navegador (la tabla de 4 columnas con
   celdas largas es el único riesgo visual; en móvil la envuelve `.table-scroll`).
4. Cotejo final ES/EN contra §3.1.2/§3.2.2/§3.2.4/§3.2.5 de ambos PDFs antes de commitear.

## Cierre

- Commit(s) a `master` + sincronizar CLAUDE.md (nuevo párrafo en la sección de contenido:
  fix del capítulo 3, la discrepancia EN/ES de §3.2.4 y la decisión de seguir el inglés).
- Deploy manual a Vercel (`vercel deploy --prod --yes`) — es contenido que ven los usuarios.

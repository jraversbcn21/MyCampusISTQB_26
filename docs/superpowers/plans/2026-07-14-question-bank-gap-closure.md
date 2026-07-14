# Question Bank Gap Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the two Phase 1 question-bank gaps (no 3-value BVA coverage in Ch.4, no dedicated FL-2.1.2 question) by replacing 3 redundant/flawed questions, keeping the bank at exactly 120 questions.

**Architecture:** Pure data change in `js/questions.js` — three question object literals are replaced in place (ids 43→121, 17→122, 31→123). New ids are > 50 so the existing validator rule automatically enforces `lo`/`k`/`source` on them. No app code, validator, or i18n changes. Docs (`AGENTS.md`, `CLAUDE.md`) updated to mark the gaps closed.

**Tech Stack:** Vanilla JS data file; Node validator scripts (`scripts/validate-questions.js`, `scripts/verify-runtime.js`) as the test gate; pre-commit hook re-validates staged copies.

**Spec:** `docs/superpowers/specs/2026-07-14-question-bank-gap-closure-design.md` — the new question content below is copied verbatim from the approved spec.

## Global Constraints

- Total questions stay at **120**; per-chapter counts stay `{0:24, 1:18, 2:12, 3:36, 4:24, 5:6}` (enforced by `scripts/validate-questions.js` — a failing run is a blocker, not a warning).
- Every new question cites official material: `source: "Syllabus v4.0 §2.1.2"` or `"Syllabus v4.0 §4.2.2"` — verified against the local `ISTQB 2026/ISTQB_CTFL_Syllabus_v4.0.1.pdf` during design. Never invent content.
- New questions are bilingual (`q`, `options` ×4, `explanation` all with `es`/`en`).
- Each replacement object is inserted **at the exact array position of the object it replaces** (keeps per-chapter grouping readable; array order has no functional meaning).
- File is UTF-8; keep the existing 2-space indentation style of `js/questions.js`.
- The pre-commit hook runs `validate-questions.js` on the staged copy and `verify-runtime.js` whenever `js/` is staged — commits will be blocked on failure; do not bypass with `--no-verify`.

---

### Task 1: Replace duplicate id 43 with dedicated FL-2.1.2 question (id 121)

**Files:**
- Modify: `js/questions.js` (the object literal for `id: 43`, chapter 1)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: question object `id: 121` in the `QUESTIONS` array. Nothing else references question ids (verified during design: no `App.state` or exam-history persistence of ids).

- [ ] **Step 1: Verify the current failing condition (validator is green but the gap exists)**

Run:
```bash
node scripts/validate-questions.js
grep -c "FL-2.1.2" js/questions.js
```
Expected: validator passes; `grep -c` prints `0` (no question tagged FL-2.1.2 — this is the gap; grep exits 1 when count is 0, that's expected).

- [ ] **Step 2: Replace the id 43 object with the new id 121 object**

In `js/questions.js`, find this exact block (chapter 1 section):

```js
  {
    id: 43, chapter: 1,
    q: {
      es: "¿Cuál de los siguientes es un tipo de prueba NO FUNCIONAL?",
      en: "Which of the following is a NON-FUNCTIONAL test type?"
    },
    options: {
      es: [
        "Prueba de regresión",
        "Prueba de rendimiento",
        "Prueba de humo (smoke testing)",
        "Prueba de integración"
      ],
      en: [
        "Regression testing",
        "Performance testing",
        "Smoke testing",
        "Integration testing"
      ]
    },
    correct: 1,
    explanation: {
      es: "Las pruebas de rendimiento (performance testing) son pruebas no funcionales que evalúan características como velocidad, escalabilidad y estabilidad bajo carga. Las otras opciones son tipos de pruebas funcionales o de niveles de prueba.",
      en: "Performance testing is a non-functional test type that evaluates characteristics like speed, scalability, and stability under load. The other options are functional test types or test levels."
    }
  },
```

Replace it entirely with:

```js
  {
    id: 121, chapter: 1, lo: "FL-2.1.2", k: 1,
    source: "Syllabus v4.0 §2.1.2",
    q: {
      es: "Según el syllabus, ¿cuál de las siguientes es una buena práctica de prueba aplicable a TODOS los ciclos de vida de desarrollo de software (CVDS)?",
      en: "According to the syllabus, which of the following is a good testing practice that applies to ALL software development lifecycles (SDLC)?"
    },
    options: {
      es: [
        "La prueba dinámica debe comenzar únicamente cuando todo el código del sistema está completo",
        "Para cada actividad de desarrollo de software existe una actividad de prueba correspondiente",
        "Todos los niveles de prueba deben compartir exactamente los mismos objetivos de prueba",
        "Los probadores deben esperar a la versión final de los productos de trabajo antes de revisarlos"
      ],
      en: [
        "Dynamic testing should start only once all the system's code is complete",
        "For every software development activity, there is a corresponding test activity",
        "All test levels should share exactly the same test objectives",
        "Testers should wait for the final version of work products before reviewing them"
      ]
    },
    correct: 1,
    explanation: {
      es: "El syllabus (§2.1.2) enumera cuatro buenas prácticas de prueba independientes del CVDS elegido: (1) para cada actividad de desarrollo hay una actividad de prueba correspondiente, de modo que todas las actividades de desarrollo quedan sujetas a control de calidad; (2) cada nivel de prueba tiene objetivos específicos y diferentes, lo que permite una cobertura adecuada sin redundancia; (3) el análisis y diseño de prueba de un nivel comienza durante la fase de desarrollo correspondiente (prueba temprana); y (4) los probadores participan en la revisión de los productos de trabajo en cuanto hay borradores disponibles (shift left). Las otras tres opciones contradicen directamente las prácticas 3, 2 y 4 respectivamente.",
      en: "The syllabus (§2.1.2) lists four good testing practices independent of the chosen SDLC: (1) for every software development activity there is a corresponding test activity, so all development activities are subject to quality control; (2) different test levels have specific and different test objectives, allowing appropriate coverage while avoiding redundancy; (3) test analysis and design for a given test level begins during the corresponding development phase (early testing); and (4) testers are involved in reviewing work products as soon as drafts are available (shift left). The other three options directly contradict practices 3, 2 and 4 respectively."
    }
  },
```

Context for why id 43 is the victim: it is a literal duplicate of id 11 (same stem "¿Cuál de los siguientes es un tipo de prueba NO FUNCIONAL?", same essential answer — performance/load testing). Do NOT touch id 11.

- [ ] **Step 3: Run the validator to verify the swap**

Run:
```bash
node scripts/validate-questions.js
grep -c "FL-2.1.2" js/questions.js
```
Expected: validator passes (`Cap 1: 18/18 ✅`, all green — count unchanged because it's a replacement); grep prints `1`.

- [ ] **Step 4: Commit**

```bash
git add js/questions.js
git commit -m "feat(questions): dedicated FL-2.1.2 question replacing the id 11/43 duplicate"
```
(The pre-commit hook re-validates the staged copy and runs `verify-runtime.js`; both must pass.)

---

### Task 2: Replace ids 17 and 31 with 3-value BVA questions (ids 122, 123)

**Files:**
- Modify: `js/questions.js` (the object literals for `id: 17` and `id: 31`, chapter 3)

**Interfaces:**
- Consumes: nothing from Task 1 (independent blocks in the same file).
- Produces: question objects `id: 122` and `id: 123` in the `QUESTIONS` array.

- [ ] **Step 1: Replace the id 17 object with the new id 122 object**

In `js/questions.js`, find this exact block (chapter 3/4 section):

```js
  {
    id: 17, chapter: 3,
    q: {
      es: "¿Cuántas reglas tiene una tabla de decisión con 3 condiciones independientes?",
      en: "How many rules does a decision table have with 3 independent conditions?"
    },
    options: {
      es: ["3", "6", "8", "9"],
      en: ["3", "6", "8", "9"]
    },
    correct: 2,
    explanation: {
      es: "Con n condiciones binarias (Sí/No), el número máximo de reglas es 2^n. Con 3 condiciones: 2^3 = 8 reglas. En la práctica, las reglas con el mismo resultado pueden combinarse.",
      en: "With n binary conditions (Yes/No), the maximum number of rules is 2^n. With 3 conditions: 2^3 = 8 rules. In practice, rules with the same outcome can be combined."
    }
  },
```

Replace it entirely with:

```js
  {
    id: 122, chapter: 3, lo: "FL-4.2.2", k: 3,
    source: "Syllabus v4.0 §4.2.2",
    q: {
      es: "Un campo acepta enteros válidos de 10 a 50 (los enteros fuera de ese rango son inválidos). Según el BVA (análisis de valores límite) de 3 valores, ¿qué elementos de cobertura corresponden al valor límite 10?",
      en: "A field accepts valid integers from 10 to 50 (integers outside that range are invalid). According to 3-value BVA (boundary value analysis), which coverage items correspond to the boundary value 10?"
    },
    options: {
      es: ["10 y 11", "9 y 10", "9, 10 y 11", "8, 9, 10 y 11"],
      en: ["10 and 11", "9 and 10", "9, 10 and 11", "8, 9, 10 and 11"]
    },
    correct: 2,
    explanation: {
      es: "En el BVA de 3 valores, cada valor límite tiene tres elementos de cobertura: el propio valor límite y sus dos vecinos. Para el valor límite 10, son 9 (su vecino en la partición inválida), 10 y 11 (su vecino dentro de la partición válida). Obsérvese que en el BVA de 3 valores algunos elementos de cobertura pueden no ser valores límite (aquí, el 11). En el BVA de 2 valores serían solo 10 y su vecino más próximo de la partición adyacente (9).",
      en: "In 3-value BVA, each boundary value has three coverage items: the boundary value itself and both its neighbors. For the boundary value 10, these are 9 (its neighbor in the invalid partition), 10, and 11 (its neighbor inside the valid partition). Note that in 3-value BVA some coverage items may not be boundary values (here, 11). In 2-value BVA, the items would be just 10 and its closest neighbor in the adjacent partition (9)."
    }
  },
```

Context for why id 17 is a victim: decision tables are over-represented in chapter 3 (6 questions: 16, 17, 87–90), and id 17 states "2^n rules" without the full-table (unminimized) qualification — the same imprecision Phase 3 fixed in FLASHCARDS id 18. Do NOT touch id 16 or ids 87–90.

- [ ] **Step 2: Replace the id 31 object with the new id 123 object**

In `js/questions.js`, find this exact block:

```js
  {
    id: 31, chapter: 3,
    q: {
      es: "Un sistema de cajero automático (ATM) tiene los estados: Inactivo, Leyendo Tarjeta, Validando PIN, Menú Principal. ¿Qué técnica es más apropiada para probar este sistema?",
      en: "An ATM system has states: Idle, Reading Card, Validating PIN, Main Menu. Which technique is most appropriate to test this system?"
    },
    options: {
      es: ["Partición de equivalencia", "Análisis de valor límite", "Prueba de transición de estado", "Tabla de decisión"],
      en: ["Equivalence partitioning", "Boundary value analysis", "State transition testing", "Decision table"]
    },
    correct: 2,
    explanation: {
      es: "La prueba de transición de estado es ideal para sistemas donde el comportamiento depende del estado actual. El ATM cambia de comportamiento según el estado en que se encuentre (Inactivo, Leyendo tarjeta, etc.).",
      en: "State transition testing is ideal for systems where behavior depends on current state. The ATM changes behavior based on the state it's in (Idle, Reading card, etc.)."
    }
  },
```

Replace it entirely with:

```js
  {
    id: 123, chapter: 3, lo: "FL-4.2.2", k: 3,
    source: "Syllabus v4.0 §4.2.2",
    q: {
      es: "La condición «if (x ≤ 10)» se implementó por error como «if (x = 10)». Con el BVA de 2 valores se prueban x = 10 y x = 11, y ninguno de los dos detecta el defecto. ¿Qué valor de prueba derivado del BVA de 3 valores probablemente SÍ detectaría el defecto?",
      en: "The condition \"if (x ≤ 10)\" was implemented by mistake as \"if (x = 10)\". With 2-value BVA, x = 10 and x = 11 are tested, and neither detects the defect. Which test value derived from 3-value BVA would likely detect the defect?"
    },
    options: {
      es: ["x = 9", "x = 10", "x = 11", "x = 12"],
      en: ["x = 9", "x = 10", "x = 11", "x = 12"]
    },
    correct: 0,
    explanation: {
      es: "Es el ejemplo del propio syllabus (§4.2.2) de por qué el BVA de 3 valores es más riguroso que el de 2 valores. Con x = 10, tanto el código correcto (10 ≤ 10) como el defectuoso (10 = 10) ejecutan la rama; con x = 11 y x = 12, ninguno de los dos la ejecuta: resultados idénticos, el defecto pasa inadvertido. Con x = 9 el comportamiento difiere: el código correcto entra en la rama (9 ≤ 10) pero el defectuoso no (9 = 10 es falso). x = 9 es precisamente un elemento de cobertura del BVA de 3 valores (vecino del valor límite 10) que el BVA de 2 valores no incluye.",
      en: "This is the syllabus's own example (§4.2.2) of why 3-value BVA is more rigorous than 2-value BVA. With x = 10, both the correct code (10 ≤ 10) and the defective one (10 = 10) execute the branch; with x = 11 and x = 12, neither does — identical results, so the defect goes unnoticed. With x = 9 the behavior differs: the correct code takes the branch (9 ≤ 10) while the defective one does not (9 = 10 is false). x = 9 is precisely a 3-value BVA coverage item (a neighbor of the boundary value 10) that 2-value BVA does not include."
    }
  },
```

Context for why id 31 is a victim: near-duplicate of id 20 (both ask "which technique for a system whose behavior depends on current state" → state transition). State transition keeps 4 questions (20, 91–93). Do NOT touch id 20.

- [ ] **Step 3: Run the validator and verify the new BVA coverage**

Run:
```bash
node scripts/validate-questions.js
grep -c "FL-4.2.2" js/questions.js
```
Expected: validator all green (`Cap 3: 36/36 ✅` — counts unchanged); grep prints `3` (ids 80, 122, 123).

- [ ] **Step 4: Run the runtime harness as a safety net**

Run:
```bash
node scripts/verify-runtime.js
```
Expected: all checks pass (no runtime behavior touched; this guards against an accidental syntax error in the data file breaking module load).

- [ ] **Step 5: Commit**

```bash
git add js/questions.js
git commit -m "feat(questions): 3-value BVA coverage in Ch.4 replacing redundant ids 17/31"
```

---

### Task 3: Update AGENTS.md and CLAUDE.md to mark the gaps closed

**Files:**
- Modify: `AGENTS.md` (the "Known minor gaps from Phase 1" block and the "Remaining optional follow-up work" sentence above it)
- Modify: `CLAUDE.md` (the "Known non-blocking gaps" line in the ISTQB Content Fidelity section)

**Interfaces:**
- Consumes: the replacements from Tasks 1–2 being committed (docs must describe reality).
- Produces: nothing downstream.

- [ ] **Step 1: Update AGENTS.md — the follow-up sentence**

Find (in the "ISTQB Content Fidelity Effort — Status & Next Session" section):

```markdown
Remaining optional follow-up work is the Phase 1
minor gaps below (light BVA question coverage, missing FL-2.1.2 dedicated question) — not
blocking, just noted for a future content pass.
```

Replace with:

```markdown
The Phase 1
minor gaps (light BVA question coverage, missing FL-2.1.2 dedicated question) were closed
on 2026-07-14 — see below. No follow-up content work is currently pending.
```

- [ ] **Step 2: Update AGENTS.md — the gaps block**

Find:

```markdown
**Known minor gaps from Phase 1** (non-blocking, optional future cleanup):
- Chapter 4 (Test Analysis & Design) is light on boundary-value-analysis questions (only
  id 80, reusing the "1–100" domain already used by pre-existing id 15).
- Learning objective FL-2.1.2 has no dedicated question (folded into id 66's explanation).
```

Replace with:

```markdown
**Phase 1 minor gaps — CLOSED (2026-07-14).** Both gaps were resolved by **replacing three
redundant/flawed questions** (bank stays at 120, per-chapter distribution intact, validator
unchanged — new ids are > 50 so the `lo`/`k`/`source` rule covers them automatically).
Design: `docs/superpowers/specs/2026-07-14-question-bank-gap-closure-design.md`.
- **BVA in Ch.4:** the original gap note undercounted — ids 15, 80 *and* 38 were all BVA,
  but all three were 2-value BVA (two on the same 1–100 domain). Replaced id 17 (decision
  tables were over-represented at 6 questions, and it carried the same unqualified
  "2^n rules" imprecision Phase 3 fixed in FLASHCARDS id 18) with id 122 (3-value BVA
  applied, fresh 10–50 domain), and id 31 (near-duplicate of id 20) with id 123 (the
  syllabus's own "x ≤ 10 miscoded as x = 10" defect-detection example). Both FL-4.2.2/K3,
  source "Syllabus v4.0 §4.2.2". BVA now has 5 questions; state transition keeps 4.
- **FL-2.1.2:** replaced id 43 (a literal duplicate of id 11 — same stem, same essential
  answer) with id 121 (FL-2.1.2/K1, the four good testing practices of §2.1.2; the three
  distractors are direct negations of the other three official practices).
  Source "Syllabus v4.0 §2.1.2".
```

- [ ] **Step 3: Update CLAUDE.md — the gaps line**

Find (end of the "ISTQB Content Fidelity Effort" section):

```markdown
Known non-blocking gaps (light BVA question coverage in Ch.4, no dedicated question for FL-2.1.2) are tracked in AGENTS.md, not repeated here.
```

Replace with:

```markdown
The two known minor gaps from Phase 1 (light BVA question coverage in Ch.4, no dedicated question for FL-2.1.2) were closed on 2026-07-14 by replacing three redundant questions (ids 43/17/31 → 121/122/123, all with official `lo`/`k`/`source`) — detail in `AGENTS.md`.
```

- [ ] **Step 4: Sanity-check docs consistency**

Run:
```bash
grep -n "FL-2.1.2" AGENTS.md CLAUDE.md
grep -n "no dedicated question" AGENTS.md CLAUDE.md
```
Expected: first grep shows only the new "closed" wording in both files; second grep shows no stale "has no dedicated question" claims (the CLAUDE.md match is inside the new "were closed" sentence).

- [ ] **Step 5: Commit**

```bash
git add AGENTS.md CLAUDE.md
git commit -m "docs: mark the Phase 1 question-bank gaps as closed (BVA Ch.4, FL-2.1.2)"
```

---

## Final Verification (after all tasks)

```bash
node scripts/validate-questions.js   # all counts green, ids unique, 121-123 traceable
node scripts/verify-runtime.js      # all runtime checks green
git log --oneline -4                 # the 3 commits above + spec commit
```

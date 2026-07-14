# Cierre de gaps del banco de preguntas: BVA Cap.4 + FL-2.1.2 (2026-07-14)

## Objetivo

Cerrar los dos gaps menores no bloqueantes que la Fase 1 dejó anotados en `AGENTS.md`:

1. **Cobertura BVA ligera en el Cap. 4** — en realidad hay 3 preguntas BVA (ids 15, 80 y 38;
   la nota original de AGENTS.md no contaba la 38), pero **las tres son BVA de 2 valores** y
   dos comparten el mismo dominio 1–100. Cero cobertura del BVA de 3 valores, que el syllabus
   v4.0 §4.2.2 trata con el mismo peso que el de 2 valores.
2. **FL-2.1.2 sin pregunta dedicada** — el LO "(K1) Recall good testing practices that apply
   to all software development lifecycles" (§2.1.2) solo aparecía mencionado en la explicación
   de id 66 (que es FL-2.1.1).

Regla vigente del proyecto: todo contenido nuevo cita `source` oficial verificado — las dos
secciones citadas aquí se verificaron contra el PDF local `ISTQB_CTFL_Syllabus_v4.0.1.pdf`
(págs. 24–26 para §2.1.2, pág. 40 para §4.2.2) durante el diseño.

## Enfoque elegido: reemplazo, no adición

El validador (`scripts/validate-questions.js`) exige conteos exactos por capítulo
(24/18/12/36/24/6 = 120) que replican ×3 la distribución oficial del examen, y el examen
completo del simulador muestrea 40 preguntas **uniformemente** del pool — la proporción del
pool es lo que sostiene la fidelidad al peso oficial. Por eso se descartó añadir preguntas
(desviaría la proporción u obligaría a escalar todo el banco) y se eligió **reemplazar 3
preguntas redundantes o defectuosas**, manteniendo 120 y el validador intacto.

### Víctimas (sale → motivo)

| Sale | Cap. (0-idx) | Motivo |
|------|--------------|--------|
| id 43 | 1 | **Duplicado literal de id 11**: mismo enunciado ("¿Cuál es un tipo de prueba NO FUNCIONAL?") y misma respuesta esencial (rendimiento/carga). |
| id 17 | 3 | Doble motivo: tablas de decisión sobre-representada (6 preguntas: 16, 17, 87–90) **y** arrastra la imprecisión "2^n reglas" sin el matiz de tabla completa/no minimizada — el mismo error que la Fase 3 corrigió en FLASHCARDS id 18. |
| id 31 | 3 | Casi-duplicado de id 20 (ambas: "¿qué técnica para sistemas cuyo comportamiento depende del estado?" → transición de estado). Quedan 4 preguntas de la técnica (20, 91–93). |

Seguridad del borrado verificada: nada en `App.state` ni en el historial de exámenes persiste
ids de preguntas (`wrongOnes` se calcula en memoria por sesión) — eliminar ids no rompe datos
de usuarios existentes.

### Mecanismo de ids

Las 3 preguntas nuevas usan **ids nuevos 121–123** en lugar de reutilizar 43/17/31: la regla
del validador `id > 50 ⇒ lo/k/source obligatorios` las cubre automáticamente sin tocar el
validador (que exige unicidad de ids, no contigüidad). Cada una se inserta en el lugar del
array que ocupaba su víctima (el orden del array no tiene significado funcional, pero mantiene
la agrupación por capítulo legible).

## Las 3 preguntas nuevas (contenido definitivo)

### id 121 — FL-2.1.2 (K1), chapter: 1, source: "Syllabus v4.0 §2.1.2"

Reemplaza a id 43. Enunciado (es/en):

> **es:** Según el syllabus, ¿cuál de las siguientes es una buena práctica de prueba aplicable
> a TODOS los ciclos de vida de desarrollo de software (CVDS)?
> **en:** According to the syllabus, which of the following is a good testing practice that
> applies to ALL software development lifecycles (SDLC)?

Opciones (correcta = índice 1):

| # | es | en |
|---|----|----|
| 0 | La prueba dinámica debe comenzar únicamente cuando todo el código del sistema está completo | Dynamic testing should start only once all the system's code is complete |
| **1** | **Para cada actividad de desarrollo de software existe una actividad de prueba correspondiente** | **For every software development activity, there is a corresponding test activity** |
| 2 | Todos los niveles de prueba deben compartir exactamente los mismos objetivos de prueba | All test levels should share exactly the same test objectives |
| 3 | Los probadores deben esperar a la versión final de los productos de trabajo antes de revisarlos | Testers should wait for the final version of work products before reviewing them |

Los 3 distractores son negaciones directas de las otras 3 prácticas oficiales de §2.1.2.
La explicación enumera las 4 prácticas oficiales: (1) por cada actividad de desarrollo, una
actividad de prueba correspondiente (todo bajo control de calidad); (2) cada nivel de prueba
tiene objetivos específicos y diferentes (cobertura sin redundancia); (3) el análisis y diseño
de prueba de un nivel comienza durante la fase de desarrollo correspondiente (prueba
temprana); (4) los probadores participan en las revisiones de los productos de trabajo en
cuanto hay borradores disponibles (shift left) — y señala qué práctica contradice cada
distractor.

### id 122 — FL-4.2.2 (K3), chapter: 3, source: "Syllabus v4.0 §4.2.2"

Reemplaza a id 17. BVA de 3 valores aplicado, dominio distinto del gastado 1–100:

> **es:** Un campo acepta enteros válidos de 10 a 50 (los enteros fuera de ese rango son
> inválidos). Según el BVA de 3 valores, ¿qué elementos de cobertura corresponden al valor
> límite 10?
> **en:** A field accepts valid integers from 10 to 50 (integers outside that range are
> invalid). According to 3-value BVA, which coverage items correspond to the boundary
> value 10?

Opciones (correcta = índice 2): `["10 y 11", "9 y 10", "9, 10 y 11", "8, 9, 10 y 11"]`
(en: `["10 and 11", "9 and 10", "9, 10 and 11", "8, 9, 10 and 11"]`).

Preguntar por «el valor límite 10» (no por «el límite inferior» en general) hace la pregunta
inequívoca: es literalmente la definición del syllabus — *"for each boundary value there are
three coverage items: this boundary value and both its neighbors"* → 9, 10 y 11. La
explicación contrasta con el BVA de 2 valores (10 y su vecino de la partición adyacente, 9) y
señala que en el de 3 valores algunos elementos de cobertura pueden no ser valores límite
(aquí, el 11).

### id 123 — FL-4.2.2 (K3), chapter: 3, source: "Syllabus v4.0 §4.2.2"

Reemplaza a id 31. El ejemplo del propio syllabus de por qué 3 valores > 2 valores:

> **es:** La condición «if (x ≤ 10)» se implementó por error como «if (x = 10)». Con el BVA
> de 2 valores se prueban x = 10 y x = 11, y ninguno de los dos detecta el defecto. ¿Qué valor
> de prueba derivado del BVA de 3 valores probablemente SÍ lo detectaría?
> **en:** The condition "if (x ≤ 10)" was implemented by mistake as "if (x = 10)". With
> 2-value BVA, x = 10 and x = 11 are tested, and neither detects the defect. Which test value
> derived from 3-value BVA would likely detect it?

Opciones (correcta = índice 0): `["x = 9", "x = 10", "x = 11", "x = 12"]` (idénticas en en).
Las cuatro opciones son exactamente el conjunto de cobertura del BVA de 3 valores en torno a
esta frontera ({9,10,11} ∪ {10,11,12}), lo que hace la pregunta discriminante y no
contestable: solo x = 9 produce comportamiento distinto entre el código correcto (9 ≤ 10 →
entra en la rama) y el defectuoso (9 = 10 es falso → no entra). Con 10 ambos entran; con 11 y
12 ninguno. La explicación lo desarrolla y cita que es el ejemplo textual de §4.2.2.

Ambas preguntas BVA se etiquetan **k: 3** — FL-4.2.2 es oficialmente K3 y ambas son
aplicación, no recuerdo; no se inventa una pregunta K2 para un LO K3.

Resultado neto en el Cap. 4: BVA pasa de 3 preguntas (todas 2 valores, dos con el mismo
dominio) a **5** (2 valores × 3 dominios distintos, 3 valores aplicado, y detección de
defectos 3-valores-vs-2-valores), a costa de una tabla de decisión sobrante y un duplicado de
transición de estado.

## Qué NO cambia

- `scripts/validate-questions.js` (TARGET intacto, la regla id>50 ya cubre los ids nuevos).
- `js/app.js`, i18n, CSS, `index.html` — las preguntas son datos bilingües por esquema.
- El total del banco (120) y la distribución por capítulo (24/18/12/36/24/6).

## Docs a actualizar en el mismo cambio

- `AGENTS.md` → sección "Known minor gaps from Phase 1": marcar ambos gaps como cerrados
  (2026-07-14) con el resumen del reemplazo, y corregir de paso que la nota original no
  contaba id 38 como pregunta BVA existente.
- `CLAUDE.md` → la línea "Known non-blocking gaps … are tracked in AGENTS.md" del resumen del
  esfuerzo de fidelidad: actualizar a cerrados, remitiendo a AGENTS.md.

## Verificación

1. `node scripts/validate-questions.js` en verde (conteos exactos, unicidad de ids,
   estructura bilingüe, lo/k/source de los ids 121–123).
2. `node scripts/verify-runtime.js` en verde (sin cambios esperados — red de seguridad).
3. Revisión manual de las 3 preguntas contra las citas del syllabus extraídas durante el
   diseño (§2.1.2 y §4.2.2).
4. El hook de pre-commit repite 1–2 sobre la copia staged.

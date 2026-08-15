# Plan — Fidelidad del capítulo 4 (Técnicas de Prueba)

**Spec:** `docs/superpowers/specs/2026-08-15-chapter4-techniques-fidelity-fix-design.md`
**Fecha:** 2026-08-15
**Ejecución:** subagent-driven-development, **secuencial**.

> **Por qué secuencial y no en paralelo:** los 19 cambios viven todos en `js/content.js`, un
> único archivo de ~2.500 líneas. Lanzar cuatro subagentes en paralelo sobre el mismo archivo
> garantiza conflictos de edición. Cada tarea toca una clave distinta de `LESSONS`, así que
> ejecutadas en orden son independientes entre sí y cada una es revisable por separado.

## Reglas para todos los ejecutores

1. **Copiar el HTML del spec literalmente.** El texto ES y EN ya está redactado, verificado
   contra el syllabus y con las decisiones de traducción resueltas. No reescribir, no
   "mejorar", no parafrasear.
2. **No tocar** `CHAPTERS`, `QUESTIONS`, `GLOSSARY`, `FLASHCARDS`, ningún otro capítulo, ni
   CSS/JS de la app.
3. **No tocar los pies `<p class="lesson-source">`** — las citas §4.2–§4.5 ya son correctas.
4. **Conservar** los bloques que el spec marca explícitamente como "se conserva sin cambios".
5. Al terminar la tarea, ejecutar `node scripts/validate-content.js` y pegar la salida.

## Tarea 1 — Lección 4.2 (caja negra), ES + EN

**Cambios:** C1, C2, C3, C4, C5, C6, C7, C8, C9 del spec.

Es la tarea más grande (9 cambios sobre EP, BVA, tablas de decisión y transición de estado).

Trampas específicas:
- **C6:** «X» significa que la acción **debe** ocurrir. El comentario de Reddit decía lo
  contrario; es un error suyo, no copiarlo.
- **C7:** eliminar del párrafo introductorio de tablas de decisión la frase «El elemento de
  cobertura es la columna/regla; para 100% de cobertura hay que practicar todas las reglas
  factibles», que el nuevo recuadro sustituye — si no, queda duplicada.
- **Las dos tablas de decisión de ejemplo no se tocan.** La ES usa V/F/X (correcto según el
  examen oficial ES) y la EN usa T/F/X (correcto según el syllabus EN).
- **C4** sustituye el párrafo de BVA; los dos `example-box` de BVA de 2 y 3 valores se conservan.

**Verificación:** `node scripts/validate-content.js`.

## Tarea 2 — Lección 4.3 (caja blanca), ES + EN

**Cambios:** C10, C11, C12 del spec.

Trampas específicas:
- **C11:** el hueco central del capítulo son las **ramas incondicionales**. Hoy la lección solo
  describe la mitad condicional («para cada IF/SWITCH, camino verdadero y falso»). El párrafo
  nuevo debe dejar clarísimas las dos clases.
- **El recuadro «Branch Coverage ⊃ Statement Coverage» se conserva íntegro** — ya es correcto
  y coincide con la pregunta id 95.
- **C12** solo traduce a EN bloques que ya existen en ES; no inventar contenido nuevo.

**Verificación:** `node scripts/validate-content.js`.

## Tarea 3 — Lección 4.4 (basadas en experiencia), ES + EN

**Cambios:** C13, C14, C15 del spec.

Trampas específicas:
- **C13 corrige un error real en EN:** hoy la lección dice «**Defect** attacks»; el término
  oficial de §4.4.1 es «**fault** attacks», que es además lo que ya usa correctamente nuestra
  pregunta id 97 en EN. En ES el término es «**ataques de defecto (fault attacks)**», también
  tomado de la id 97.
- **C14 elimina una imprecisión nuestra:** la lección ES afirma que «listas muy detalladas dan
  más repetibilidad». El syllabus no lo dice — solo afirma el caso de las listas de alto nivel.
  Esa media frase desaparece.
- El `example-box` ES «Errores típicos a adivinar» **se conserva**.

**Verificación:** `node scripts/validate-content.js`.

## Tarea 4 — Lección 4.5 (basadas en colaboración), ES + EN

**Cambios:** C16, C17, C18, C19 del spec.

Trampas específicas:
- **C18** convierte prosa en una lista de **cinco** usos. El quinto («permitir una planificación
  y una estimación precisas») es el que falta hoy; los otros cuatro ya estaban y no deben
  perderse en la conversión.
- **C19** añade un `<li>` al final de la lista de ATDD **sin romper el orden** de los pasos
  existentes (taller de especificación primero, creación de casos después) — ese orden ya es
  correcto y el comentario lo confirmaba.
- Los ejemplos concretos (restablecer contraseña, Given/When/Then) **se conservan**.

**Verificación:** `node scripts/validate-content.js`.

## Tarea 5 — Revisión de rama completa y cierre

No es una tarea de edición: es la revisión que en los dos fixes anteriores (capítulo 3, ISO
25010) encontró defectos reales que las tareas individuales no podían ver.

1. **Releer las cuatro lecciones enteras**, ES y EN, de principio a fin. Buscar:
   - duplicaciones introducidas por las inserciones (especialmente C7, que sustituye una frase
     preexistente, y C18, que convierte prosa en lista),
   - etiquetas `<p>`/`<div>`/`<ul>` mal cerradas,
   - coherencia ES↔EN: que cada bloque nuevo exista en los dos idiomas y diga lo mismo,
   - que no haya quedado ningún `i18n.lang === 'es' ? … : …` ni cadena en el idioma equivocado.
2. **Contrastar contra el syllabus** las afirmaciones nuevas de mayor riesgo: notación de tabla
   de decisión, ramas incondicionales, cadena de garantías de transición de estado, los cinco
   usos de los criterios de aceptación.
3. **Gates completos:**
   ```bash
   node scripts/validate-content.js
   node scripts/validate-questions.js
   node scripts/verify-runtime.js
   ```
4. **Sincronizar `CLAUDE.md`**: ampliar la sección "ISTQB Content Fidelity Effort" con un
   párrafo "Tercer gap reportado por usuario, CERRADO (2026-08-15)" que recoja:
   - el alcance (solo lecciones 4.2–4.5, ES+EN),
   - **la anomalía del §4.2.1** (frase anunciada en las notas de versión de v4.0.1 y ausente
     del cuerpo) y la decisión de citarla honestamente — es exactamente el tipo de trampa que
     un agente futuro redescubriría,
   - el error de transcripción del comentario sobre la «X» de las acciones,
   - la corrección de «Defect attacks» → «fault attacks» en EN,
   - los cuatro desajustes enseñanza/examen cerrados (id 85, 88, 89, 93),
   - la terminología unificada pendiente («Análisis del valor frontera» / «Predicción de
     errores») como candidata futura.
5. **Commits** siguiendo el estilo del repo (mensajes en español, sin em-dash, `fix(content):`
   por bloque temático + un `docs:` final).
6. **Deploy**: `vercel deploy --prod --yes` desde árbol limpio, con
   `NODE_EXTRA_CA_CERTS` si se ejecuta desde la red corporativa.

# Fidelidad del capítulo 4 (Técnicas de Prueba) — cobertura, notación y límites

**Fecha:** 2026-08-15
**Origen:** comentario de un usuario en Reddit (tercer reporte externo, tras ISO 25010 del
2026-08-10 y el proceso de revisión del capítulo 3 del 2026-08-12).
**Alcance:** solo `LESSONS["4.2"]`, `LESSONS["4.3"]`, `LESSONS["4.4"]` y `LESSONS["4.5"]` en
`js/content.js` (ES+EN). **No se toca** `CHAPTERS` (sus `lo`/`source` están verificados y son
correctos), ni el banco de preguntas, ni el glosario, ni las flashcards, ni CSS/JS de la app,
ni ningún otro capítulo.

## Verificación realizada

Los 27 puntos del comentario se contrastaron uno a uno contra el syllabus oficial **EN v4.0.1**
(`ISTQB 2026/ISTQB_CTFL_Syllabus_v4.0.1.pdf`, §4.1–4.5, págs. 38–46), contra las lecciones
4.1–4.5 en ambos idiomas, y contra las **36 preguntas del capítulo 4** del banco.

| Bloque | Puntos | Huecos reales | Parciales | Ya presentes |
|--------|--------|---------------|-----------|--------------|
| EP §4.2.1 | 5 | 5 | 0 | 0 |
| BVA §4.2.2 | 1 | 1 | 0 | 0 |
| Tabla de decisión §4.2.3 | 4 | 3 | 1 | 0 |
| Transición de estado §4.2.4 | 2 | 1 | 1 | 0 |
| Caja blanca §4.3 | 6 | 3 | 2 | 1 |
| Experiencia §4.4 | 3 | 1 (+1 error nuestro) | 2 | 0 |
| Colaboración §4.5 | 6 | 4 | 1 | 1 |
| **Total** | **27** | **18 + 1 error** | **7** | **2** |

Los 2 ya presentes (no requieren cambio): *branch coverage subsume statement coverage* y el
orden de pasos de ATDD (taller de especificación → crear casos de prueba).

## Dos hallazgos que condicionan el fix

### 1. El comentario contiene un error de transcripción — NO copiarlo

El comentario escribe, sobre las acciones de una tabla de decisión:

> `-For actions: "X" means that the actions should not occur. -Blank means that the actions should not occur.`

El syllabus §4.2.3 (p. 41) dice: *«"X" means that the action **should** occur. Blank means that
the action should **not** occur.»* Las dos líneas del comentario afirman lo mismo; **la primera
está mal**. Se implementa la versión oficial.

### 2. El tip de EP existe en las notas de versión pero no en el cuerpo del §4.2.1 (DECISIÓN DE JORGE, 2026-08-15)

Las **notas de versión de v4.0.1** (p. 73) dicen literalmente:
*«in 4.2.1 added that invalid equivalence partitions should be tested in isolation to avoid
defect masking»*. Sin embargo, una búsqueda de `isolation` y `masking` sobre las 78 páginas
confirma que **esa frase no aparece en §4.2.1**; solo está en §4.2.4 (transiciones inválidas)
y en la propia nota de versión. ISTQB anunció el cambio y no lo aplicó al texto.

**Decisión: se incluye el tip con cita honesta** — la lección lo atribuye a las notas de versión
de v4.0.1 (cambio anunciado para §4.2.1) y remite al principio de enmascaramiento definido en
§4.2.4. No se afirma que el §4.2.1 lo diga.

> Nota sobre el gate: `checkSyllabusRefs()` solo valida las citas de `topic.source`, del pie
> `.lesson-source` y de `GLOSSARY.source`; **no escanea el cuerpo de la lección**. Aun así todas
> las citas en línea de este fix (§4.2.1, §4.2.4) son secciones reales, así que el gate pasaría
> igualmente si en el futuro se ampliara su alcance.

## Desajustes propios encontrados durante la verificación (no reportados por el usuario)

Mismo patrón que el fix del capítulo 3 con la pregunta id 78 — **el banco examina cosas que la
lección no enseña**. Los cuatro entran en el alcance:

- **Pregunta id 88** examina la notación `N/A` («inviable») y la **id 89** las tablas de
  **entrada ampliada** (extended entry) frente a **entrada limitada** — la lección 4.2 **no
  introduce ninguno de los dos conceptos**.
- **Pregunta id 93** examina transiciones inválidas; la lección no explica que la **tabla de
  estados muestra las transiciones inválidas como celdas vacías** (el contraste con el diagrama).
- **Pregunta id 85** examina particiones **discretas y desordenadas**; la lección no menciona
  las propiedades de las particiones — y sin ese vocabulario el punto del comentario sobre
  «BVA solo con particiones ordenadas» queda sin apoyo.
- **Asimetría ES/EN**: las lecciones 4.3 y 4.4 en inglés son sensiblemente más pobres que en
  español (4.3 EN no tiene el ejemplo de branch coverage ni el recuadro de examen; 4.4 EN no
  tiene el recuadro «cuándo usar cada técnica»). Se equilibran replicando los recuadros que ya
  existen en ES — **sin inventar contenido nuevo**.

**La pregunta id 94** ya examina que el 100% de cobertura de sentencia no garantiza toda la
lógica de decisión, y la **id 95** usa el término «subsume»: ambas quedan reforzadas por este
fix, no contradichas. Ninguna pregunta se modifica.

## Un error real en nuestro contenido EN

`LESSONS["4.4"].en` dice **«Defect attacks»**. El término oficial (§4.4.1) es **«fault
attacks»**, y nuestra **propia pregunta id 97 en EN ya lo escribe correctamente** («According to
the ISTQB syllabus, 'fault attacks' are…»). Es una contradicción interna de la app. Se corrige
en la lección; la pregunta no se toca.

## Decisiones de traducción — ninguna palabra inventada

Todos los términos ES provienen de material oficial en español o de precedente ya establecido
en el repo:

| Concepto EN | ES a usar | Procedencia |
|---|---|---|
| fault attacks | **ataques de defecto (fault attacks)** | pregunta id 97 (`js/questions.js`) |
| notación T / F / – / N/A / X / blanco | **V / F / – / N/A / X / casilla en blanco** | **Sample Exam A ES, pregunta #22** usa V/F/X en su tabla de decisión; la id 88 usa «N/A (inviable)» |
| coverage item | **elemento de cobertura** | `GLOSSARY` + lección 4.2 |
| subsumes | **subsume** | pregunta id 95 |
| guard condition | **condición de guarda** | lección 4.2 ES |
| defect masking | **enmascaramiento de defectos** | lección 4.2 ES + pregunta id 93 |
| limited-entry / extended-entry | **entrada limitada / entrada ampliada** | pregunta id 89 |
| unconditional / conditional branch | **rama incondicional / rama condicional** | castellano llano |
| resulting business value | **valor de negocio resultante** | castellano llano |

La tabla de decisión de ejemplo de la lección ES ya usa **V/F/X** (correcto según el examen
oficial ES) y la EN usa **T/F/X** (correcto según el syllabus EN). **Ninguna de las dos tablas
se modifica.**

---

# Cambios — Lección 4.2 (`LESSONS["4.2"]`)

## C1 · EP: definición de partición válida/inválida y propiedades de las particiones

Insertar **después** del párrafo actual que empieza «Divide los datos en particiones…» /
«Divide data into partitions…».

ES:
```html
<p>Una partición que contiene valores válidos se llama <strong>partición válida</strong>; una que contiene valores inválidos, <strong>partición inválida</strong>. Las definiciones de válido e inválido pueden variar entre equipos y organizaciones: los valores válidos suelen entenderse como aquellos que el objeto de prueba <strong>debe procesar</strong>, o para los que la especificación define un procesamiento; los inválidos, como aquellos que <strong>debe rechazar o ignorar</strong>, o para los que la especificación no define ningún procesamiento.</p>
<p>Pueden identificarse particiones para cualquier elemento de datos relacionado con el objeto de prueba: entradas, salidas, elementos de configuración, valores internos, valores temporales y parámetros de interfaz. Las particiones pueden ser continuas o discretas, <strong>ordenadas o desordenadas</strong>, finitas o infinitas.</p>
```

EN:
```html
<p>A partition containing valid values is called a <strong>valid partition</strong>; one containing invalid values is an <strong>invalid partition</strong>. The definitions of valid and invalid may vary between teams and organizations: valid values are usually those the test item <strong>should process</strong>, or for which the specification defines processing; invalid values are those it <strong>should reject or ignore</strong>, or for which no processing is specified.</p>
<p>Partitions can be identified for any data element related to the test object: inputs, outputs, configuration items, internal values, time-related values and interface parameters. Partitions may be continuous or discrete, <strong>ordered or unordered</strong>, finite or infinite.</p>
```

## C2 · EP: elementos de cobertura, criterio del 100% y fórmula

Insertar **después** del `example-box` actual de EP (el de edades 18-65), **antes** del `<h3>`
de BVA.

ES:
```html
<div class="highlight-box">
💡 <strong>Cobertura de la partición de equivalencia:</strong>
<br>• Los <strong>elementos de cobertura</strong> son las propias particiones de equivalencia
<br>• Para alcanzar el <strong>100% de cobertura</strong> los casos de prueba deben ejercitar todas las particiones identificadas —<strong>incluidas las inválidas</strong>—, cubriendo cada una al menos una vez
<br>• La cobertura se mide como el <strong>número de particiones ejercitadas por al menos un caso de prueba, dividido entre el número total de particiones identificadas</strong>, y se expresa en porcentaje
</div>
```

EN:
```html
<div class="highlight-box">
💡 <strong>Equivalence partitioning coverage:</strong>
<br>• The <strong>coverage items</strong> are the equivalence partitions themselves
<br>• To achieve <strong>100% coverage</strong>, test cases must exercise all identified partitions —<strong>including the invalid ones</strong>— by covering each partition at least once
<br>• Coverage is measured as the <strong>number of partitions exercised by at least one test case, divided by the total number of identified partitions</strong>, expressed as a percentage
</div>
```

## C3 · EP: tip de examen — particiones inválidas en aislamiento

Insertar inmediatamente después de C2.

ES:
```html
<div class="warning-box">
⚠️ <strong>Para el examen:</strong> las particiones <strong>inválidas</strong> deberían probarse <strong>en aislamiento</strong> —una sola por caso de prueba— para evitar el <strong>enmascaramiento de defectos</strong>, la situación en la que un defecto impide detectar otro. Es el mismo principio que se aplica a las transiciones inválidas en §4.2.4. <em>(Añadido por ISTQB en las notas de versión de v4.0.1 como cambio para §4.2.1.)</em>
</div>
```

EN:
```html
<div class="warning-box">
⚠️ <strong>For the exam:</strong> <strong>invalid partitions</strong> should be tested <strong>in isolation</strong> —one per test case— to avoid <strong>defect masking</strong>, the situation in which one defect prevents the detection of another. It is the same principle applied to invalid transitions in §4.2.4. <em>(Added by ISTQB in the v4.0.1 release notes as a change to §4.2.1.)</em>
</div>
```

## C4 · BVA: solo particiones ordenadas

Sustituir el párrafo actual de BVA («Practica las fronteras…» / «Practices the boundaries…»).

ES:
```html
<p>El BVA se basa en ejercitar las <strong>fronteras</strong> de las particiones de equivalencia; por tanto, <strong>solo puede usarse con particiones ordenadas</strong>. Los valores mínimo y máximo de una partición son sus valores frontera. En el BVA, si dos elementos pertenecen a la misma partición, todos los elementos intermedios deben pertenecer también a ella.</p>
<p>Se centra en los valores frontera porque es donde los desarrolladores cometen más errores. Los defectos típicos que detecta están donde las fronteras implementadas se han desplazado por encima o por debajo de su posición prevista, o se han omitido por completo.</p>
```

EN:
```html
<p>BVA is based on exercising the <strong>boundaries</strong> of equivalence partitions; therefore, it <strong>can only be used for ordered partitions</strong>. The minimum and maximum values of a partition are its boundary values. In BVA, if two elements belong to the same partition, all elements between them must also belong to that partition.</p>
<p>It focuses on boundary values because developers are more likely to make errors there. Typical defects it finds are located where implemented boundaries are misplaced above or below their intended positions, or are omitted altogether.</p>
```

## C5 · Tabla de decisión: entrada limitada vs. ampliada, tabla completa/simplificada/minimizada

Insertar **después** del párrafo introductorio actual de tablas de decisión, **antes** del
`example-box` de la tienda online.

ES:
```html
<p>En las tablas de <strong>entrada limitada</strong> (limited-entry) todos los valores de las condiciones y las acciones se muestran como valores booleanos —salvo los irrelevantes o inviables—. En las de <strong>entrada ampliada</strong> (extended-entry), algunas condiciones o acciones pueden tomar varios valores: rangos numéricos, particiones de equivalencia o valores discretos.</p>
<p>Una tabla <strong>completa</strong> tiene tantas columnas como combinaciones de condiciones existan. Puede <strong>simplificarse</strong> eliminando las columnas con combinaciones inviables, y <strong>minimizarse</strong> fusionando en una sola columna aquellas en las que algunas condiciones no afectan al resultado. Los algoritmos de minimización quedan fuera del alcance del syllabus.</p>
```

EN:
```html
<p>In <strong>limited-entry</strong> decision tables, all condition and action values are shown as Boolean values —except irrelevant or infeasible ones—. In <strong>extended-entry</strong> tables, some conditions or actions may take multiple values: number ranges, equivalence partitions or discrete values.</p>
<p>A <strong>full</strong> decision table has enough columns to cover every combination of conditions. It can be <strong>simplified</strong> by deleting columns with infeasible combinations, and <strong>minimized</strong> by merging columns in which some conditions do not affect the outcome. Minimization algorithms are out of scope of the syllabus.</p>
```

## C6 · Tabla de decisión: notación completa

Insertar **después** del `example-box` de la tienda online.

ES:
```html
<div class="highlight-box">
💡 <strong>Notación de una tabla de decisión:</strong>
<br><strong>En las condiciones:</strong>
<br>• <strong>«V»</strong> (verdadera): la condición se cumple
<br>• <strong>«F»</strong> (falsa): la condición no se cumple
<br>• <strong>«–»</strong>: el valor de la condición es <strong>irrelevante</strong> para el resultado de la acción
<br>• <strong>«N/A»</strong>: la condición es <strong>inviable</strong> para esa regla
<br><strong>En las acciones:</strong>
<br>• <strong>«X»</strong>: la acción <u>debe</u> ocurrir
<br>• <strong>casilla en blanco</strong>: la acción <u>no</u> debe ocurrir
<br><em>Pueden usarse otras notaciones. En el syllabus en inglés, la «V» aparece como «T» (true).</em>
</div>
```

EN:
```html
<div class="highlight-box">
💡 <strong>Decision table notation:</strong>
<br><strong>For conditions:</strong>
<br>• <strong>"T"</strong> (true): the condition is satisfied
<br>• <strong>"F"</strong> (false): the condition is not satisfied
<br>• <strong>"–"</strong>: the value of the condition is <strong>irrelevant</strong> for the action outcome
<br>• <strong>"N/A"</strong>: the condition is <strong>infeasible</strong> for that rule
<br><strong>For actions:</strong>
<br>• <strong>"X"</strong>: the action <u>should</u> occur
<br>• <strong>blank</strong>: the action should <u>not</u> occur
<br><em>Other notations may also be used.</em>
</div>
```

> ⚠️ Ejecutor: «X» = la acción **debe** ocurrir. El comentario de origen decía lo contrario;
> es un error suyo.

## C7 · Tabla de decisión: cobertura en %, fortaleza y debilidad

Insertar inmediatamente después de C6. Sustituye la frase suelta actual «El elemento de
cobertura es la columna/regla; para 100% de cobertura hay que practicar todas las reglas
factibles» — esa frase se **elimina** del párrafo introductorio para no duplicar.

ES:
```html
<div class="highlight-box">
💡 <strong>Cobertura, fortaleza y debilidad:</strong>
<br>• Los <strong>elementos de cobertura</strong> son las columnas con combinaciones de condiciones <strong>factibles</strong>. La cobertura se mide como el <strong>número de columnas ejercitadas dividido entre el total de columnas factibles</strong>, expresado en porcentaje
<br>✅ <strong>Fortaleza:</strong> aporta un enfoque <strong>sistemático</strong> para identificar todas las combinaciones de condiciones, algunas de las cuales podrían pasarse por alto de otro modo; además ayuda a encontrar <strong>huecos y contradicciones en los requisitos</strong>
<br>❌ <strong>Debilidad:</strong> el número de reglas crece <strong>exponencialmente</strong> con el número de condiciones, así que con muchas condiciones ejercitarlas todas puede ser muy costoso. Para reducirlas puede usarse una tabla minimizada o un enfoque basado en riesgos
</div>
```

EN:
```html
<div class="highlight-box">
💡 <strong>Coverage, strength and weakness:</strong>
<br>• The <strong>coverage items</strong> are the columns containing <strong>feasible</strong> combinations of conditions. Coverage is measured as the <strong>number of exercised columns divided by the total number of feasible columns</strong>, expressed as a percentage
<br>✅ <strong>Strength:</strong> it provides a <strong>systematic</strong> approach to identify all combinations of conditions, some of which might otherwise be overlooked; it also helps find <strong>gaps and contradictions in the requirements</strong>
<br>❌ <strong>Weakness:</strong> the number of rules grows <strong>exponentially</strong> with the number of conditions, so with many conditions exercising them all can be time consuming. A minimized decision table or a risk-based approach can reduce them
</div>
```

## C8 · Transición de estado: notación y tabla de estados

Sustituir el párrafo actual («Se usa cuando el comportamiento del sistema depende…» /
«Used when behavior depends on…»).

ES:
```html
<p>Un <strong>diagrama de estados</strong> modela el comportamiento del sistema mostrando sus posibles <strong>estados</strong> y las <strong>transiciones válidas</strong> entre ellos. Una transición la inicia un <strong>evento</strong>, que además puede estar cualificado por una <strong>condición de guarda</strong>; se asume instantánea y a veces provoca que el software ejecute una <strong>acción</strong>.</p>
<div class="example-box">
📌 <strong>Notación de una transición:</strong> <code>evento [condición de guarda] / acción</code>
<br>La condición de guarda y la acción pueden omitirse si no existen o si son irrelevantes para el probador.
</div>
<p>La <strong>tabla de estados</strong> es un modelo equivalente al diagrama: sus filas representan los estados y sus columnas los eventos (junto con sus condiciones de guarda, si las hay); cada celda representa una transición y contiene el estado destino y las acciones resultantes. A diferencia del diagrama, la tabla <strong>muestra explícitamente las transiciones inválidas</strong>, representadas como <strong>celdas vacías</strong>. Un caso de prueba se construye como una <strong>secuencia de eventos</strong> que produce una secuencia de cambios de estado, y normalmente cubre varias transiciones.</p>
```

EN:
```html
<p>A <strong>state diagram</strong> models the behavior of a system by showing its possible <strong>states</strong> and the <strong>valid transitions</strong> between them. A transition is initiated by an <strong>event</strong>, which may additionally be qualified by a <strong>guard condition</strong>; transitions are assumed to be instantaneous and may sometimes result in the software taking an <strong>action</strong>.</p>
<div class="example-box">
📌 <strong>Transition labeling syntax:</strong> <code>event [guard condition] / action</code>
<br>Guard conditions and actions can be omitted if they do not exist or are irrelevant for the tester.
</div>
<p>A <strong>state table</strong> is a model equivalent to the state diagram: its rows represent states and its columns represent events (together with guard conditions, if any); each cell represents a transition and contains the target state and the resulting actions. In contrast to the diagram, the state table <strong>explicitly shows invalid transitions</strong>, represented by <strong>empty cells</strong>. A test case is built as a <strong>sequence of events</strong> producing a sequence of state changes, and usually covers several transitions.</p>
```

## C9 · Transición de estado: cadena completa de garantías

Insertar **después** de la lista `<ul>` de los tres criterios de cobertura, **antes** del
`example-box` del cajero ATM.

ES:
```html
<div class="highlight-box">
💡 <strong>Orden de fuerza de los criterios:</strong> todos los estados &lt; transiciones válidas &lt; todas las transiciones.
<br>La cobertura de <strong>todos los estados</strong> es la más débil, porque suele alcanzarse sin ejercitar todas las transiciones. Alcanzar el 100% de <strong>transiciones válidas garantiza</strong> el 100% de todos los estados, y alcanzar el 100% de <strong>todas las transiciones garantiza las dos anteriores</strong>.
</div>
```

EN:
```html
<div class="highlight-box">
💡 <strong>Coverage strength order:</strong> all states &lt; valid transitions &lt; all transitions.
<br><strong>All states</strong> coverage is the weakest, since it can typically be achieved without exercising all transitions. Achieving 100% <strong>valid transitions</strong> coverage <strong>guarantees</strong> 100% all states coverage, and achieving 100% <strong>all transitions</strong> coverage <strong>guarantees both of the previous ones</strong>.
</div>
```

---

# Cambios — Lección 4.3 (`LESSONS["4.3"]`)

## C10 · Sentencia: elementos de cobertura, fórmula y límites

Sustituir el párrafo actual de cobertura de sentencia e insertar el recuadro de límites
**después** del `example-box` del `if (x > 0)`.

ES — párrafo:
```html
<p>En la prueba de sentencia los <strong>elementos de cobertura</strong> son las <strong>sentencias ejecutables</strong>. La cobertura se mide como el <strong>número de sentencias ejercitadas por los casos de prueba dividido entre el número total de sentencias ejecutables</strong> del código, y se expresa en porcentaje.</p>
```

ES — recuadro:
```html
<div class="warning-box">
⚠️ <strong>Límites del 100% de cobertura de sentencia:</strong> asegura que todas las sentencias ejecutables se han ejercitado al menos una vez —y por tanto que toda sentencia con un defecto se ejecutará, lo que puede provocar un fallo que revele su presencia—. Pero ejercitar una sentencia no detecta defectos en todos los casos:
<br>• <strong>No garantiza que se haya probado toda la lógica de decisión</strong>, porque puede no ejercitar todas las ramas del código
<br>• <strong>No detecta defectos dependientes de los datos</strong>, como una división por cero que solo falla cuando el denominador vale cero
</div>
```

EN — párrafo:
```html
<p>In statement testing the <strong>coverage items</strong> are the <strong>executable statements</strong>. Coverage is measured as the <strong>number of statements exercised by the test cases divided by the total number of executable statements</strong> in the code, expressed as a percentage.</p>
```

EN — recuadro:
```html
<div class="warning-box">
⚠️ <strong>Limits of 100% statement coverage:</strong> it ensures all executable statements have been exercised at least once —so every statement containing a defect will be executed, which may cause a failure revealing it—. But exercising a statement will not detect defects in all cases:
<br>• It <strong>does not ensure that all the decision logic has been tested</strong>, as it may not exercise all the branches in the code
<br>• It <strong>does not detect data-dependent defects</strong>, such as a division by zero that only fails when the denominator is set to zero
</div>
```

## C11 · Rama: definición completa (incondicional y condicional)

Sustituir el párrafo actual de cobertura de rama. **El recuadro existente
«Branch Coverage ⊃ Statement Coverage» se conserva sin cambios** (ya es correcto).

ES:
```html
<p>Una <strong>rama</strong> es una transferencia de control entre dos nodos del <strong>grafo de flujo de control</strong>, que muestra las posibles secuencias en las que se ejecutan las sentencias del código. Cada transferencia de control puede ser:</p>
<ul>
  <li><strong>Incondicional:</strong> código en línea recta (<em>straight-line code</em>)</li>
  <li><strong>Condicional:</strong> el resultado de una decisión</li>
</ul>
<p>Los <strong>elementos de cobertura</strong> son las ramas. La cobertura se mide como el <strong>número de ramas ejercitadas dividido entre el número total de ramas</strong>, expresado en porcentaje. Con el <strong>100% de cobertura de rama</strong> se ejercitan todas las ramas del código, <strong>tanto las incondicionales como las condicionales</strong>. Las ramas condicionales suelen corresponder al resultado verdadero o falso de un «if…then», a una salida de una sentencia «switch/case», o a la decisión de salir o continuar en un bucle.</p>
<p>Ejercitar una rama tampoco detecta defectos en todos los casos: por ejemplo, puede no detectar los que requieren ejecutar un camino concreto del código.</p>
```

EN:
```html
<p>A <strong>branch</strong> is a transfer of control between two nodes in the <strong>control flow graph</strong>, which shows the possible sequences in which source code statements are executed. Each transfer of control can be:</p>
<ul>
  <li><strong>Unconditional:</strong> straight-line code</li>
  <li><strong>Conditional:</strong> a decision outcome</li>
</ul>
<p>The <strong>coverage items</strong> are branches. Coverage is measured as the <strong>number of branches exercised by the test cases divided by the total number of branches</strong>, expressed as a percentage. With <strong>100% branch coverage</strong>, all branches in the code are exercised, <strong>both unconditional and conditional</strong>. Conditional branches typically correspond to a true or false outcome from an "if…then" decision, an outcome from a switch/case statement, or a decision to exit or continue in a loop.</p>
<p>Exercising a branch will not detect defects in all cases either: for example, it may not detect defects requiring the execution of a specific path in the code.</p>
```

## C12 · Equilibrar 4.3 EN con ES

Replicar en EN los dos bloques que hoy solo existen en ES, **traduciendo el contenido ya
existente, sin añadir material nuevo**:
- el `example-box` de branch coverage con el `if (x > 0)` aplicado a ramas,
- el `warning-box` «Para el examen» con los tres puntos (statement, branch, implicación).

---

# Cambios — Lección 4.4 (`LESSONS["4.4"]`)

## C13 · Error guessing: base de conocimiento, categorías y ataques de defecto

Sustituir el párrafo actual de error guessing en ES, y en EN sustituir el párrafo que contiene
el término erróneo **«Defect attacks»**.

ES:
```html
<p>El probador anticipa la aparición de errores, defectos y fallos basándose en su conocimiento: cómo ha funcionado la aplicación en el pasado, qué tipos de errores tienden a cometer los desarrolladores y qué defectos resultan de ellos, y qué tipos de fallos se han producido en otras aplicaciones similares.</p>
<p>En general, los errores, defectos y fallos pueden estar relacionados con: <strong>entrada</strong> (una entrada correcta no se acepta, parámetros erróneos o ausentes), <strong>salida</strong> (formato o resultado erróneo), <strong>lógica</strong> (casos ausentes, operador equivocado), <strong>cálculo</strong> (operando incorrecto, cálculo erróneo), <strong>interfaces</strong> (parámetros que no encajan, tipos incompatibles) o <strong>datos</strong> (inicialización incorrecta, tipo equivocado).</p>
<div class="highlight-box">
💡 <strong>Ataques de defecto (fault attacks):</strong> son la forma de implementar la predicción de errores. Exigen que el probador <strong>cree o adquiera una lista</strong> de posibles errores, defectos y fallos, y diseñe pruebas que identifiquen los defectos asociados, los expongan o provoquen los fallos. Las listas pueden construirse a partir de la <strong>experiencia</strong>, de <strong>datos de defectos y fallos</strong>, o del <strong>conocimiento común sobre por qué falla el software</strong>.
</div>
```

EN:
```html
<p>The tester anticipates the occurrence of errors, defects and failures based on their knowledge: how the application has worked in the past, the types of errors developers tend to make and the defects that result from them, and the types of failures that have occurred in other, similar applications.</p>
<p>In general, errors, defects and failures may be related to: <strong>input</strong> (correct input not accepted, parameters wrong or missing), <strong>output</strong> (wrong format, wrong result), <strong>logic</strong> (missing cases, wrong operator), <strong>computation</strong> (incorrect operand, wrong computation), <strong>interfaces</strong> (parameter mismatch, incompatible types) or <strong>data</strong> (incorrect initialization, wrong type).</p>
<div class="highlight-box">
💡 <strong>Fault attacks:</strong> a way to implement error guessing. They require the tester to <strong>create or acquire a list</strong> of possible errors, defects and failures, and to design tests that will identify the defects associated with those errors, expose them, or cause the failures. These lists can be built from <strong>experience</strong>, from <strong>defect and failure data</strong>, or from <strong>common knowledge about why software fails</strong>.
</div>
```

> ⚠️ Ejecutor: el término es **fault attacks**, no «defect attacks». En ES, **ataques de
> defecto**, que es lo que ya usa la pregunta id 97.

El `example-box` ES «Errores típicos a adivinar» **se conserva** (es un ejemplo ilustrativo
válido, no una afirmación de fidelidad).

## C14 · Checklist: actualización por análisis de defectos y consistencia/variabilidad

Sustituir en ES el tercer `<li>` actual («Debe actualizarse periódicamente…») por los dos
siguientes, y añadir los equivalentes a la lista EN.

ES:
```html
<li>Debe actualizarse periódicamente <strong>a partir del análisis de defectos</strong>: algunas entradas pierden eficacia con el tiempo, porque los desarrolladores aprenden a no cometer esos errores, y hay que añadir otras nuevas que reflejen defectos de alta severidad recién encontrados — cuidando siempre que la lista no se vuelva demasiado larga</li>
<li>A falta de casos de prueba detallados aporta <strong>guías y cierto grado de consistencia</strong> a las pruebas. Si la lista es de alto nivel, es probable que aparezca <strong>variabilidad</strong> en las pruebas reales: potencialmente <strong>más cobertura, pero menos repetibilidad</strong></li>
```

EN:
```html
<li>Should be regularly updated <strong>based on defect analysis</strong>: some entries gradually become less effective as developers learn to avoid those errors, and new entries need to be added to reflect newly found high severity defects — always taking care that the checklist does not become too long</li>
<li>In the absence of detailed test cases it provides <strong>guidelines and some degree of consistency</strong> for the testing. If the checklist is high-level, some <strong>variability</strong> in the actual testing is likely: potentially <strong>greater coverage, but less repeatability</strong></li>
```

> ⚠️ Ejecutor: **eliminar** la afirmación actual de la lección ES «listas muy detalladas dan
> más repetibilidad». Es una inferencia nuestra; el syllabus solo afirma el caso de las listas
> de alto nivel.

## C15 · Equilibrar 4.4 EN con ES

Replicar en EN el `highlight-box` «Cuándo usar cada técnica» que ya existe en ES (error
guessing / exploratorio / checklist), traduciendo el contenido existente sin añadir material
nuevo.

---

# Cambios — Lección 4.5 (`LESSONS["4.5"]`)

## C16 · Formato de historia de usuario: valor de negocio

ES — dentro del `example-box` de formato, sustituir la línea del formato:
```html
<br><em>Como [rol], quiero [objetivo a lograr], para poder [valor de negocio resultante para el rol]</em>, seguido de los criterios de aceptación.
```

EN — en el párrafo de la historia de usuario, sustituir la cita del formato por:
```html
"As a [role], I want [goal to be accomplished], so that I can [resulting business value for the role]", followed by the acceptance criteria.
```

El ejemplo concreto que sigue («Como cliente registrado, quiero restablecer mi contraseña…»)
**se conserva sin cambios**.

## C17 · INVEST: los tres motivos si un implicado no sabe probar la historia

Sustituir la frase final del `highlight-box` de INVEST en ambos idiomas.

ES:
```html
Si un <strong>implicado</strong> no sabe cómo probar una historia de usuario, puede indicar que la historia <strong>no está lo bastante clara</strong>, que <strong>no refleja algo valioso</strong> para él, o simplemente que <strong>necesita ayuda para probarla</strong>.
```

EN:
```html
If a <strong>stakeholder</strong> does not know how to test a user story, this may indicate that the story is <strong>not clear enough</strong>, that it <strong>does not reflect something valuable</strong> to them, or that the stakeholder simply <strong>needs help in testing</strong>.
```

## C18 · Criterios de aceptación: los cinco usos

Sustituir la frase de prosa actual («Sirven para acotar su alcance, alcanzar consenso…») por
una lista de los cinco usos oficiales, en ambos idiomas.

ES:
```html
<p>Son las condiciones que debe cumplir la implementación de una historia de usuario para ser aceptada por los implicados; desde esa perspectiva, equivalen a las condiciones de prueba que los tests deben ejercitar. Suelen ser resultado de la <em>Conversación</em>. Se usan para:</p>
<ul>
  <li>Definir el <strong>alcance</strong> de la historia de usuario</li>
  <li>Alcanzar <strong>consenso</strong> entre los implicados</li>
  <li>Describir tanto <strong>escenarios positivos como negativos</strong></li>
  <li>Servir de <strong>base para la prueba de aceptación</strong> de la historia (ver DGPA más abajo)</li>
  <li>Permitir una <strong>planificación y una estimación precisas</strong></li>
</ul>
```

EN:
```html
<p>Conditions that an implementation of a user story must meet to be accepted by stakeholders — from that perspective, they are the test conditions the tests should exercise. They are usually a result of the <em>Conversation</em>. They are used to:</p>
<ul>
  <li>Define the <strong>scope</strong> of the user story</li>
  <li>Reach <strong>consensus</strong> among the stakeholders</li>
  <li>Describe both <strong>positive and negative scenarios</strong></li>
  <li>Serve as a <strong>basis for the user story acceptance testing</strong> (see ATDD below)</li>
  <li>Allow <strong>accurate planning and estimation</strong></li>
</ul>
```

Los dos formatos (orientado a escenario / orientado a reglas) y sus ejemplos **se conservan
sin cambios**.

## C19 · ATDD: equipo transversal y lenguaje natural

Modificar el paso 1 de la lista `<ol>` y añadir un paso nuevo sobre el lenguaje natural.

ES — paso 1 (sustituir):
```html
<li>Taller de especificación: se analiza, discute y redacta la historia de usuario y, si aún no existen, sus criterios de aceptación. Participan miembros del equipo con <strong>perspectivas distintas: clientes, desarrolladores y probadores</strong>, resolviendo incompletitudes, ambigüedades y defectos de la historia</li>
```

ES — añadir como último `<li>` de la misma lista:
```html
<li>Los casos de prueba deben expresarse de forma <strong>comprensible para los implicados</strong>: normalmente frases en <strong>lenguaje natural</strong> con las precondiciones necesarias (si las hay), las entradas y las postcondiciones</li>
```

EN — paso 1 (sustituir):
```html
<li>Specification workshop: the user story and, if not yet defined, its acceptance criteria are analyzed, discussed and written. Team members with <strong>different perspectives take part: customers, developers and testers</strong>, resolving incompleteness, ambiguities and defects in the story</li>
```

EN — añadir como último `<li>`:
```html
<li>Test cases should be expressed in a way that is <strong>understandable for the stakeholders</strong>: typically sentences in <strong>natural language</strong> involving the necessary preconditions (if any), the inputs and the postconditions</li>
```

---

# Fuera de alcance (explícito)

- **`CHAPTERS`**: los `lo` y `source` de los 5 temas del capítulo 4 están verificados y son
  correctos. No se tocan.
- **Banco de preguntas**: las 36 preguntas del capítulo 4 se verificaron y ninguna contradice
  este fix. Las id 85, 88, 89, 93, 94, 95 y 97 quedan **reforzadas** por él. Ninguna se modifica.
- **Glosario y flashcards**: verificados, sin errores relacionados con estos puntos.
- **Otros capítulos**: fuera de alcance por indicación explícita de Jorge.
- **Unificación de terminología** entre los títulos de la lección («Análisis de Valor Límite»,
  «Adivinanza de Errores») y el glosario («Análisis del valor frontera», «Predicción de
  errores»): detectada durante la verificación, **descartada de este fix** por decisión de
  alcance. Queda anotada aquí como candidata a un pase futuro.
- **Lección 4.1**: verificada y correcta (las 3 categorías, la advertencia sobre colaboración
  como no-cuarta-categoría). No se toca.

# Verificación de cierre

```bash
node scripts/validate-content.js     # pies de fuente, lo/source, citas §
node scripts/validate-questions.js   # no debería verse afectado; se corre por seguridad
node scripts/verify-runtime.js       # i18n + familias N*
```

Más una revisión de rama completa antes de commitear: releer las cuatro lecciones enteras en
ambos idiomas buscando duplicaciones introducidas por las inserciones, `<p>`/`<div>` mal
cerrados, y coherencia ES↔EN.

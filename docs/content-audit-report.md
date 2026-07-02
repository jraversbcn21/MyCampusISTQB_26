# Informe de Auditoría de Contenido — Fase 2

Auditoría de las 22 lecciones de `js/content.js` contra el ISTQB CTFL Syllabus v4.0
oficial. Veredictos: ✅ correcta (sin cambios de contenido, solo trazabilidad añadida) ·
⚠️ corregida (imprecisión o término corregido) · ➕ ampliada (concepto examinable que
faltaba, añadido).

| Tema | LOs | Veredicto | Resumen del cambio |
|------|-----|-----------|---------------------|
| 1.1 ¿Qué es el testing? | FL-1.1.1, FL-1.1.2 | ➕ | Versión ES ya correcta y completa frente a §1.1; solo se añadió trazabilidad y pie de fuente. Versión EN carecía de la sección "Verification vs Validation" presente en ES: se añadió para dar paridad de contenido (adición real de contenido en EN). |
| 1.2 ¿Por qué es necesario el testing? | FL-1.2.1, FL-1.2.2, FL-1.2.3 | ➕ | ES ya cubría los 3 LOs correctamente (terminología error/defecto/fallo, causa raíz, QA vs Testing). EN carecía por completo de ejemplos del rol del testing en el desarrollo (necesario para FL-1.2.1 "aportar ejemplos de por qué es necesario probar"): se añadió la sección "The Role of Testing in Software Development". |
| 1.3 Los 7 Principios del Testing | FL-1.3.1 | ✅ | Contenido ya correcto y completo en ambos idiomas frente a §1.3 (los 7 principios explicados correctamente); solo se añadió trazabilidad y pie de fuente. |
| 1.4 Actividades, testware y roles | FL-1.4.1, FL-1.4.2, FL-1.4.3, FL-1.4.4, FL-1.4.5 | ➕ | Faltaba por completo la sección de FL-1.4.2 (impacto del contexto en el proceso de prueba) en ambos idiomas: se añadió "El proceso de prueba en su contexto" / "The Test Process in Context". Se amplió la sección de Trazabilidad (FL-1.4.4) en ES para explicar su valor (cobertura, impacto de cambios, auditorías, gobernanza) y se añadió dicha sección completa en EN, donde no existía. |
| 1.5 Habilidades esenciales en testing | FL-1.5.1, FL-1.5.2, FL-1.5.3 | ➕ | Faltaba por completo el Enfoque de Equipo Completo (FL-1.5.2) en ambos idiomas: se añadió "Enfoque de Equipo Completo" / "Whole Team Approach". La versión EN carecía además de toda la sección de Independencia de la Prueba (FL-1.5.3, presente en ES): se añadió la tabla de niveles de independencia con ventajas/desventajas para dar paridad con ES. |
| 2.1 Testing en el contexto del SDLC | FL-2.1.1, FL-2.1.2, FL-2.1.3, FL-2.1.4, FL-2.1.5, FL-2.1.6 | ➕ | Waterfall/Ágil/DevOps/shift-left ya estaban cubiertos, pero faltaban 3 de los 6 LOs: FL-2.1.2 (buenas prácticas de prueba válidas para cualquier CVDS), FL-2.1.3 (prueba como impulsor del desarrollo — solo se mencionaban TDD/ATDD de pasada, sin BDD ni explicación) y FL-2.1.6 (retrospectivas, ausente por completo). Se añadieron las tres secciones en ambos idiomas (EN partía de un resumen de 2 párrafos, se amplió a paridad completa con ES). |
| 2.2 Niveles de prueba | FL-2.2.1 | ⚠️ | El encabezado afirmaba explícitamente "Los 4 Niveles de Prueba", pero el syllabus v4.0 define 5 (faltaba por completo "Prueba de Integración de Sistemas", distinto de la integración de componentes). Se corrigió el encabezado y se añadió esa sección y fila de tabla en ES, ampliando el EN (que solo tenía una tabla resumen sin detalle) a paridad completa con ES, incluyendo el nuevo nivel. |
| 2.3 Tipos de prueba | FL-2.2.2, FL-2.2.3 | ⚠️ | Faltaba la categoría "Pruebas de Caja Negra" (uno de los 4 tipos oficiales del syllabus); en su lugar se listaba "Pruebas Relacionadas con Cambios" como si fuera uno de los 4 tipos, cuando el syllabus lo trata como un apartado propio (§2.2.3). Se añadió Caja Negra y se reescribió la sección de confirmación/regresión con el detalle requerido por FL-2.2.3 (cómo se ejecuta cada una, análisis de impacto, candidatura a automatización). EN se amplió de una tabla mínima a paridad completa con ES. |
| 2.4 Pruebas de mantenimiento | FL-2.3.1 | ✅ | Contenido ya correcto, completo y con paridad ES/EN frente a §2.3 (desencadenantes, análisis de impacto, regresión en mantenimiento, gestión de configuración); solo se añadió trazabilidad y pie de fuente. |
| 3.1 Conceptos básicos del testing estático | FL-3.1.1, FL-3.1.2, FL-3.1.3 | ➕ | FL-3.1.1 (productos evaluables) y FL-3.1.2 (valor de la prueba estática) ya estaban bien cubiertos en ES. Faltaba por completo FL-3.1.3 (comparar y contrastar prueba estática y dinámica): se añadió la sección "Diferencias entre la Prueba Estática y la Prueba Dinámica" en ambos idiomas. La versión EN era un resumen mínimo de 2 párrafos; se amplió a paridad completa con ES (Análisis Estático, tabla de herramientas, beneficios detallados, defectos típicos). |
| 3.2 El proceso de revisión | FL-3.2.1, FL-3.2.2, FL-3.2.3, FL-3.2.4, FL-3.2.5 | ⚠️ | El listado de roles conflaba incorrectamente "Moderador (Manager)" como un único rol, cuando el syllabus define Gestor y Moderador como dos roles distintos con responsabilidades distintas (FL-3.2.3): se corrigió separándolos y se añadió el rol de Gestor, ausente por completo. Además faltaban por completo FL-3.2.1 (beneficios de la retroalimentación temprana) y FL-3.2.5 (factores de éxito de las revisiones): se añadieron ambas secciones. EN carecía del proceso de revisión, de las descripciones de roles y de la columna "Objetivo" en la tabla de tipos; se amplió a paridad completa con ES. |
| 4.1 Panorama de las técnicas | FL-4.1.1 | ⚠️ | El contenido de las 3 categorías oficiales (caja negra/caja blanca/basadas en experiencia) era correcto, pero el listado de caja negra incluía "Prueba de Caso de Uso", técnica que no pertenece al syllabus v4.0 (se retiró de la v3.1): se eliminó. Además la lección presentaba "Técnicas Basadas en Colaboración" como una 4ª categoría paralela, cuando el syllabus clasifica las técnicas de prueba solo en 3 categorías (la colaboración es un tema aparte, §4.5, centrado en prevenir defectos): se corrigió con una nota explícita de aviso de examen en ambos idiomas. |
| 4.2 Técnicas de caja negra | FL-4.2.1, FL-4.2.2, FL-4.2.3, FL-4.2.4 | ➕ ⚠️ | Atención especial del plan: EP y BVA ya explicaban el mecanismo (partición de un rango, cálculo de valores frontera de 2/3 valores), pero Tablas de Decisión y Transición de Estado solo daban la definición y estructura, sin ejemplo resuelto — se añadió un ejemplo completo de tabla de decisión (4 reglas con condiciones/acciones concretas, derivando un caso de prueba por columna) y un ejemplo completo de transición de estado (secuencia de eventos de un cajero ATM, caso de prueba válido e inválido). Se corrigió además el 3er criterio de cobertura de transición de estado: la lección lo llamaba "cobertura de transiciones inválidas" (definición incorrecta) cuando el syllabus lo define como "cobertura de todas las transiciones" (válidas + intento de inválidas), y se añadió el alias "cobertura de conmutador 0" para transiciones válidas. EN se amplió de 4 párrafos mínimos a paridad completa con ES. |
| 4.3 Técnicas de caja blanca | FL-4.3.1, FL-4.3.2, FL-4.3.3 | ➕ | Statement/Branch coverage (FL-4.3.1, FL-4.3.2) ya estaban bien cubiertos en ES con ejemplo de código. Faltaba por completo FL-4.3.3 (explicar el valor de la prueba de caja blanca): se añadió la sección "El Valor de la Prueba de Caja Blanca" (fortaleza de detectar defectos con especificación deficiente, uso en prueba estática, medición objetiva de cobertura, debilidad ante defectos de omisión). EN era un resumen mínimo sin ejemplo de código ni sección de valor; se amplió a paridad completa con ES. |
| 4.4 Técnicas basadas en experiencia | FL-4.4.1, FL-4.4.2, FL-4.4.3 | ➕ | Error guessing (FL-4.4.1) ya estaba bien cubierto. Testing exploratorio (FL-4.4.2) solo mencionaba "charters" de pasada: se añadió la prueba exploratoria basada en sesiones (session-based) con su marco de tiempo definido, charter, hoja de sesión y recapitulación/debrief, ausente por completo. Testing basado en checklists (FL-4.4.3) carecía de detalle sobre la naturaleza de los elementos (formulados como pregunta, no automatizables, no demasiado generales, actualización periódica): se añadió. EN se amplió de una lista mínima de 3 viñetas a paridad completa con ES. |
| 4.5 Técnicas basadas en colaboración | FL-4.5.1, FL-4.5.2, FL-4.5.3 | ➕ | Historias de usuario (FL-4.5.1) y ATDD (FL-4.5.3) ya estaban cubiertos a nivel básico, pero faltaban las 3 C (Card/Conversation/Confirmation) e INVEST: se añadieron. Faltaba por completo FL-4.5.2 (clasificar las opciones para escribir criterios de aceptación): se añadió la sección "Criterios de Aceptación" con los dos formatos oficiales del syllabus (orientado a escenario Given/When/Then, y orientado a reglas con checklist o tabla entrada→salida) y un ejemplo de cada uno. ATDD se amplió con el taller de especificación y el orden positivo→negativo→no funcional de los casos de prueba. EN se amplió de 2 párrafos mínimos a paridad completa con ES. |
| 5.1 Planificación de pruebas | FL-5.1.1, FL-5.1.2, FL-5.1.3, FL-5.1.4, FL-5.1.5, FL-5.1.6, FL-5.1.7 | ⚠️ ➕ | El plan de pruebas (FL-5.1.1) y los criterios de entrada/salida (FL-5.1.3) ya estaban bien cubiertos. Faltaban por completo 4 de los 7 LOs: FL-5.1.2 (contribución del probador a la planificación de iteración y entrega), FL-5.1.5 (priorización de casos de prueba, incl. dependencias), FL-5.1.6 (pirámide de prueba) y FL-5.1.7 (cuadrantes de prueba de Marick): se añadieron las cuatro secciones. La sección de estimación (FL-5.1.4) solo mencionaba "Planning Poker" y "estimación en 3 puntos" de pasada sin mecanismo, y un criterio no oficial ("20-40% del desarrollo"): se corrigió con las 4 técnicas oficiales del syllabus (proporciones, extrapolación, Delphi de Banda Ancha, estimación de 3 puntos) y dos ejemplos numéricos resueltos (E=(a+4m+b)/6 con a=6,m=9,b=18 → E=10, SD=2; y proporción 3:2 sobre 600 días-persona → 400 días-persona), verificados contra los mismos valores del syllabus. EN partía de 2 secciones mínimas; se amplió a paridad completa con ES. |
| 5.2 Gestión de riesgos | FL-5.2.1, FL-5.2.2, FL-5.2.3, FL-5.2.4 | ⚠️ ➕ | El nivel de riesgo (FL-5.2.1) y la distinción producto/proyecto (FL-5.2.2) ya estaban cubiertos, aunque los ejemplos de riesgo de proyecto eran incompletos: se ampliaron (problemas de organización, personal, técnicos y con proveedores). Faltaba por completo el vínculo explícito de FL-5.2.3 (cómo el análisis de riesgo de producto influye en el alcance/minuciosidad de la prueba: determina alcance, niveles/tipos, técnicas/cobertura, estimación de esfuerzo, priorización y actividades adicionales) y FL-5.2.4 (medidas concretas de control del riesgo: selección de probadores, independencia, revisiones/análisis estático, técnicas/cobertura, tipos de prueba, regresión): la sección genérica "Testing Basado en Riesgos" (5 pasos) se sustituyó por las dos secciones oficiales del syllabus. EN se amplió de un resumen mínimo a paridad completa con ES. |
| 5.3 Monitoreo, control y completitud | FL-5.3.1, FL-5.3.2, FL-5.3.3 | ⚠️ ➕ | Las métricas de prueba (FL-5.3.1) ya estaban cubiertas pero la tabla omitía 2 de las 7 categorías del syllabus (calidad de producto, riesgo): se corrigió la tabla para reflejar las 7 categorías oficiales. Los informes de prueba (FL-5.3.2) no mencionaban la audiencia (parte explícita del LO "propósitos, contenido y audiencias"): se añadió. Faltaba por completo FL-5.3.3 (ejemplos de cómo comunicar el estado de la prueba: comunicación verbal, cuadros de mando, canales electrónicos, documentación en línea, informes formales): se añadió la sección "Comunicación del Estado de la Prueba". Se añadió además el pie de fuente, ausente en ambos idiomas. EN se amplió a paridad completa con ES. |
| 5.4 Gestión de la configuración | FL-5.4.1 | ➕ | Contenido ya correcto y sustancialmente completo frente al único LO del tema (ítems de configuración, actividades de CM, relación con el testing, línea base). Se añadió una nota breve sobre la gestión de configuración automatizada en canalizaciones DevOps de CI/CD/despliegue continuo, mencionada explícitamente en el syllabus y ausente en la lección. Se añadió trazabilidad y pie de fuente, ausentes en ambos idiomas. |
| 5.5 Gestión de defectos | FL-5.5.1 | ➕ | El ciclo de vida del defecto y varios campos del informe (ID, fecha/autor, objeto/entorno, pasos, esperado/actual, severidad/prioridad) ya estaban cubiertos, pero faltaban por completo 2 de los campos oficiales del syllabus para un informe de defecto (FL-5.5.1, K3 "preparar un informe de defecto"): <strong>contexto del defecto</strong> (caso de prueba, actividad, fase del CVDS, técnica/datos usados) y <strong>referencias</strong> (p. ej. al caso de prueba); además el campo "estado" solo aparecía como diagrama de ciclo de vida, sin listarse como campo del informe con sus valores típicos (abierto, aplazado, duplicado, pendiente de corrección/confirmación, reabierto, cerrado, rechazado): se añadió explícitamente. Se añadió también una breve sección de objetivos del informe de defectos. Se añadió pie de fuente en ambos idiomas. |
| 6.1 Soporte de herramientas al testing | FL-6.1.1, FL-6.2.1 | ⚠️ ➕ | Tema que agrupa dos secciones del syllabus (§6.1 tipos de herramientas, §6.2 beneficios/riesgos de la automatización); ambas estaban presentes pero con imprecisiones. §6.1: la tabla de categorías no correspondía a las 8 categorías oficiales del syllabus (gestión, prueba estática, diseño/implementación, ejecución/cobertura, no funcionales, DevOps, colaboración, escalabilidad/despliegue, cualquier otra) sino a una clasificación no oficial por tipo de prueba (UI, API, unitarias...): se corrigió la tabla para reflejar las 8 categorías oficiales, añadiendo las que faltaban por completo (diseño/implementación, colaboración, escalabilidad/despliegue, "cualquier otra herramienta"). §6.2: la lista de riesgos incluía "falsa sensación de seguridad", término que no aparece en el syllabus v4.0 (se retiró: no es examinable) y faltaban 4 de los 8 riesgos oficiales (usar herramienta cuando manual es más apropiado, confiar en exceso ignorando el pensamiento crítico, software open-source abandonado, incompatibilidad con la plataforma de desarrollo, herramienta que no cumple normas regulatorias/seguridad) y 3 de los 6 beneficios oficiales (evaluación más objetiva, acceso más fácil a la información de gestión/informes, más tiempo para diseñar pruebas): se completaron ambas listas. Se eliminó además el recuadro "Consideraciones para adoptar herramientas" (evaluar madurez, pilotar, ROI): ese contenido fue explícitamente retirado del syllabus en la v4.0 (no es material examinable de esta versión). EN partía de una versión muy reducida (una tabla de 5 filas y un solo ítem de beneficio/riesgo cada uno); se amplió a paridad completa con ES. Se añadió pie de fuente en ambos idiomas. |

## Fase 3 — Glosario y flashcards (2026-07-01)

Expansión del `GLOSSARY` y barrido del `FLASHCARDS` en `js/content.js` contra el
ISTQB CTFL Syllabus v4.0 oficial (keywords de fin de capítulo §1–§6). Trabajo
ejecutado en 7 tareas sobre la rama `feat/glossary-phase3`
(commits `4703d99`..`5012e9d`, más este commit de cierre).

### Resultado final

- **Términos en `GLOSSARY`: 107** (48 preexistentes, renombrados a nomenclatura
  oficial v4.0 y con `source` añadido en la Tarea 2, + 59 términos nuevos
  añadidos en las Tareas 3–6: 19 del capítulo 1, 14 de los capítulos 2–3, 8 del
  capítulo 4, 18 de los capítulos 5–6).
- **Cobertura de keywords oficiales: 97/97** (verificado por
  `node scripts/validate-content.js`, que desde el commit `4703d99` incluye un
  check de completitud de keywords además de los checks de `CHAPTERS`/`LESSONS`
  de la Fase 2).
- **`FLASHCARDS`: 28/28** con estructura íntegra (`id` único, `q`/`a`
  bilingües) tras el barrido de la Tarea 7.

### Tarea 2 — Renombrados de los 48 términos preexistentes del glosario

La Tarea 2 (commit `076ea60`) no eliminó ningún término: los 48 términos que ya
existían en `GLOSSARY` se renombraron a la nomenclatura oficial del glosario
ISTQB v4.0 y recibieron un campo `source` (`Syllabus v4.0 keywords §N · §N.N.N`
o cita equivalente). El commit `d94a909` corrigió además la cita de "Causa
raíz" de §1.2.4 (sección inexistente) a §1.2.3.

Detalle completo de cada término renombrado: `git show 076ea60 -- js/content.js`
(diff completo de 48 líneas modificadas). Selección representativa:

| Término (antes) | Término (después, v4.0) | Motivo | Fuente |
|---|---|---|---|
| Defecto / Bug / Fault | Defecto / Defect | Nomenclatura oficial del glosario v4.0 | §1 · §1.2.3 |
| Aseguramiento de calidad / QA | Aseguramiento de la calidad / Quality assurance (QA) | Nombre completo oficial | §1 · §1.2.2 |
| Testware | Producto de prueba / Testware | Término ES oficial añadido | §1 · §1.4.3 |
| Prueba de componente / Unit test | Prueba de componentes / Component testing | "Unit test" no es el término oficial v4.0 (nivel = "Component testing") | §2 · §2.2.1 |
| Prueba de aceptación / UAT | Prueba de aceptación / Acceptance testing | "UAT" es coloquial; término oficial es "Acceptance testing" | §2 · §2.2.1 |
| Testing funcional / Testing no funcional / Testing de regresión | Prueba funcional / Prueba no funcional / Prueba de regresión | Normalización a "Prueba de X" (traducción oficial de "X testing") | §2 · §2.2.2–§2.2.3 |
| Alpha testing / Beta testing | Prueba alfa / Alpha testing · Prueba beta / Beta testing | Término ES añadido | §2.2.1 |
| Walkthrough | Revisión guiada / Walkthrough | Término ES oficial añadido | §3 · §3.2.4 |
| Partición de equivalencia / EP | Partición de equivalencia / Equivalence partitioning (EP) | Nombre completo oficial en vez de sigla sola | §4 · §4.2.1 |
| Análisis de valor límite / BVA | Análisis del valor frontera / Boundary value analysis (BVA) | Nomenclatura oficial ES ("valor frontera") | §4 · §4.2.2 |
| Tabla de decisión / Decision table | Prueba de tabla de decisión / Decision table testing | Es una técnica de prueba, no solo el artefacto | §4 · §4.2.3 |
| Transición de estado / State transition | Prueba de transición de estado / State transition testing | Ídem | §4 · §4.2.4 |
| Prueba de sentencia / Statement coverage | Cobertura de sentencia / Statement coverage | El concepto medido es la cobertura, no "la prueba" | §4 · §4.3.1 |
| Testing exploratorio | Prueba exploratoria / Exploratory testing | Normalización + término EN oficial | §4 · §4.4.2 |
| Error guessing / Adivinanza de errores | Predicción de errores / Error guessing | Traducción ES oficial ("predicción", no "adivinanza") | §4 · §4.4.1 |
| ATDD | Desarrollo guiado por prueba de aceptación (ATDD) / Acceptance test-driven development | Nombre completo oficial en vez de solo la sigla | §4 · §4.5.3 |
| Gestión de configuración / Config management | Gestión de la configuración / Configuration management | Nombre completo oficial | §5.4 |
| Testing de rendimiento / Performance testing | Prueba de rendimiento / Performance testing | Normalización a "Prueba de X" | §2.2.2 (ISO/IEC 25010) |
| Shift-left testing | Desplazamiento a la izquierda / Shift left | Término ES oficial añadido; "shift left" no es un tipo de "testing" separado sino un enfoque | §2 · §2.1.5 |

El resto de los 48 (ej. Testing/Prueba, Error/Mistake, Fallo/Failure, Calidad,
Verificación, Validación, Trazabilidad, Prueba de integración, Prueba de
sistema, Revisión, Inspección, Análisis estático, Prueba de rama, Plan de
prueba, Riesgo de producto/proyecto, Criterios de entrada/salida, Métricas de
prueba, Severidad, Prioridad, Gestión de defectos, DevOps, CI/CD) solo
recibieron el campo `source`, sin cambio de nombre del término.

### Tarea 7 — Correcciones en `FLASHCARDS`

**4 correcciones obligatorias** (errores conocidos, arrastrados desde la Fase 2):

| id | Qué se corrigió | Fuente |
|----|------------------|--------|
| 9 | Decía "4 niveles de prueba"; v4.0 define 5 (faltaba "Prueba de Integración de Sistemas"). Reescritas q/a (es/en) con los 5 niveles. | Syllabus v4.0 §2.2.1 |
| 14 | Llamaba "revisiones formales" a una lista que incluía la revisión informal (que no es formal). Pregunta reformulada a "¿tipos de revisión?" y "Walkthrough" renombrado a "Revisión guiada (walkthrough)". | Syllabus v4.0 §3.2.4 |
| 27 | Beneficios de automatización incluían "disponibilidad 24/7" y "liberación de testers", ausentes de §6.2. Sustituidos por los 5 beneficios oficiales (ahorro de tiempo, prevención de errores humanos, evaluación más objetiva, acceso a información de gestión/informes, reducción del tiempo de ejecución). | Syllabus v4.0 §6.2 |
| 28 | Listaba "falsa sensación de seguridad" como riesgo de automatización — término ausente de §6.2 (gap ya detectado en la Fase 2 para la lección del capítulo 6, pero no corregido entonces en `FLASHCARDS`). Sustituido por los 6 riesgos oficiales citados en el syllabus. | Syllabus v4.0 §6.2 |

**3 correcciones adicionales** encontradas durante el barrido de las 24
flashcards restantes (mismo criterio que la auditoría de Fase 2: corregir solo
si contradice v4.0, no reescribir lo que ya era correcto):

| id | Qué se corrigió | Fuente |
|----|------------------|--------|
| 8 | "Test Manager" / "Tester" descritos como títulos de puesto fijos con solo parte de sus tareas. El syllabus define explícitamente dos *roles* (no puestos) — rol de gestión de pruebas (planificación, monitorización, control, compleción) y rol de prueba (análisis, diseño, implementación, ejecución) — que una misma persona puede desempeñar. Reescrito para reflejar la terminología y el alcance de tareas oficiales. | Syllabus v4.0 §1.4.5 |
| 17 | Describía "BVA-2" como "mínimo y máximo de cada borde", que no es la definición oficial (2-value BVA = el valor límite + su vecino más cercano en la partición adyacente; no un rango min/max). Reescrito con las definiciones oficiales de BVA de 2 y 3 valores. | Syllabus v4.0 §4.2.2 |
| 18 | "Número de reglas = 2^n" se presentaba sin matiz; la fórmula solo aplica a una tabla de decisión COMPLETA (full) antes de simplificar/minimizar columnas. Se añadió la aclaración. | Syllabus v4.0 §4.2.3 |

**21 flashcards verificadas sin cambios** (ids 1–7, 10–13, 15, 16, 19–26):
afirmación central de cada una comprobada por grep en `syllabus_en.txt` (p. ej.
§1.2.3 para error/defecto/fallo, §1.3 para los 7 principios, §2.2.1–§2.2.3 para
niveles/tipos de prueba, §3.1.2–§3.1.3 para el valor y las diferencias de la
prueba estática, §4.2.1/§4.2.4/§4.3.1/§4.3.2 para EP/transición de
estado/cobertura de sentencia y rama, §4.4.2 (exploratoria) y §4.5.3 (ATDD),
§5.2.2 (riesgo de producto/proyecto), §5.1.3 (criterios de entrada/salida),
§5.5 (informe de defecto) y libro "Foundations of software testing" cap.
5.6.2 (severidad/prioridad, no desarrollado en el syllabus) — ninguna
contradijo el texto oficial v4.0, por lo que se dejaron intactas.

Puntos de atención señalados por el plan y su resultado:
- id 8 (roles) → corregido, ver tabla arriba.
- id 18 (2^n solo aplica a tablas completas) → corregido, ver tabla arriba.
- id 21 (definición de prueba exploratoria) → verificado contra §4.4.2, sin
  contradicción; se dejó igual.
- id 22 (definición de ATDD) → verificado contra §4.5.3, sin contradicción; se
  dejó igual.

/* ===================================================
   MyCampus ISTQB — Course Content (Chapters, Lessons, Flashcards, Glossary)
   Based on ISTQB CTFL Syllabus v4.0.1
   =================================================== */

const CHAPTERS = [
  {
    id: 0,
    color: "#6C63FF",
    icon: "🔬",
    title: { es: "Fundamentos del Testing", en: "Fundamentals of Testing" },
    duration: { es: "20% del examen", en: "20% of exam" },
    description: {
      es: "Qué es el testing, por qué es necesario, los 7 principios del testing y actividades del proceso.",
      en: "What testing is, why it is necessary, the 7 testing principles and testing process activities."
    },
    topics: [
      { id: "1.1", title: { es: "¿Qué es el testing?", en: "What is testing?" }, xp: 30 },
      { id: "1.2", title: { es: "¿Por qué es necesario el testing?", en: "Why is testing necessary?" }, xp: 30 },
      { id: "1.3", title: { es: "Los 7 Principios del Testing", en: "The 7 Testing Principles" }, xp: 50 },
      { id: "1.4", title: { es: "Actividades, testware y roles", en: "Testing activities, testware and roles" }, xp: 40 },
      { id: "1.5", title: { es: "Habilidades esenciales en testing", en: "Essential skills in testing" }, xp: 30 },
    ]
  },
  {
    id: 1,
    color: "#00D2FF",
    icon: "🔄",
    title: { es: "Testing a lo Largo del SDLC", en: "Testing Throughout the SDLC" },
    duration: { es: "16% del examen", en: "16% of exam" },
    description: {
      es: "Cómo el testing se integra en los distintos modelos de desarrollo, niveles y tipos de prueba.",
      en: "How testing integrates into different development models, test levels and test types."
    },
    topics: [
      { id: "2.1", title: { es: "Testing en el contexto del SDLC", en: "Testing in the context of SDLC" }, xp: 40 },
      { id: "2.2", title: { es: "Niveles de prueba", en: "Test levels" }, xp: 50 },
      { id: "2.3", title: { es: "Tipos de prueba", en: "Test types" }, xp: 40 },
      { id: "2.4", title: { es: "Pruebas de mantenimiento", en: "Maintenance testing" }, xp: 30 },
    ]
  },
  {
    id: 2,
    color: "#FF6B6B",
    icon: "📄",
    title: { es: "Testing Estático", en: "Static Testing" },
    duration: { es: "10% del examen", en: "10% of exam" },
    description: {
      es: "Revisiones estáticas, tipos de revisiones, beneficios del feedback temprano.",
      en: "Static reviews, review types, benefits of early feedback."
    },
    topics: [
      { id: "3.1", title: { es: "Conceptos básicos del testing estático", en: "Basic concepts of static testing" }, xp: 35 },
      { id: "3.2", title: { es: "El proceso de revisión", en: "The review process" }, xp: 45 },
    ]
  },
  {
    id: 3,
    color: "#FFC107",
    icon: "🎯",
    title: { es: "Análisis y Diseño de Pruebas", en: "Test Analysis and Design" },
    duration: { es: "32% del examen ⭐", en: "32% of exam ⭐" },
    description: {
      es: "Técnicas de caja negra, caja blanca, basadas en experiencia y colaborativas. El bloque más extenso del examen.",
      en: "Black-box, white-box, experience-based and collaboration-based techniques. The largest exam section."
    },
    topics: [
      { id: "4.1", title: { es: "Panorama de las técnicas", en: "Test techniques overview" }, xp: 30 },
      { id: "4.2", title: { es: "Técnicas de caja negra", en: "Black-box test techniques" }, xp: 70 },
      { id: "4.3", title: { es: "Técnicas de caja blanca", en: "White-box test techniques" }, xp: 60 },
      { id: "4.4", title: { es: "Técnicas basadas en experiencia", en: "Experience-based techniques" }, xp: 50 },
      { id: "4.5", title: { es: "Técnicas basadas en colaboración", en: "Collaboration-based techniques" }, xp: 40 },
    ]
  },
  {
    id: 4,
    color: "#4CAF50",
    icon: "📊",
    title: { es: "Gestión de Actividades de Prueba", en: "Managing Test Activities" },
    duration: { es: "20% del examen", en: "20% of exam" },
    description: {
      es: "Planificación, monitoreo, gestión de riesgos, configuración y gestión de defectos.",
      en: "Planning, monitoring, risk management, configuration management and defect management."
    },
    topics: [
      { id: "5.1", title: { es: "Planificación de pruebas", en: "Test planning" }, xp: 50 },
      { id: "5.2", title: { es: "Gestión de riesgos", en: "Risk management" }, xp: 50 },
      { id: "5.3", title: { es: "Monitoreo, control y completitud", en: "Test monitoring, control and completion" }, xp: 40 },
      { id: "5.4", title: { es: "Gestión de la configuración", en: "Configuration management" }, xp: 30 },
      { id: "5.5", title: { es: "Gestión de defectos", en: "Defect management" }, xp: 40 },
    ]
  },
  {
    id: 5,
    color: "#9C27B0",
    icon: "🛠️",
    title: { es: "Soporte de Herramientas al Testing", en: "Tool Support for Testing" },
    duration: { es: "2% del examen", en: "2% of exam" },
    description: {
      es: "Tipos de herramientas, beneficios, riesgos y consideraciones para su adopción.",
      en: "Tool types, benefits, risks and considerations for tool adoption."
    },
    topics: [
      { id: "6.1", title: { es: "Soporte de herramientas al testing", en: "Tool support for testing" }, xp: 20 },
    ]
  }
];

const LESSONS = {
  "1.1": {
    es: {
      title: "¿Qué es el testing?",
      chapterTag: "Cap. 1 · Fundamentos",
      content: `
<h3>Definición del Testing de Software</h3>
<p>El <strong>testing de software</strong> es un conjunto de actividades para descubrir defectos y evaluar la calidad de artefactos de software. Estas actividades se planifican y controlan, y el resultado es un nivel de confianza sobre la calidad del software.</p>

<div class="highlight-box">
💡 <strong>Objetivo principal:</strong> El testing no solo busca defectos, también evalúa la calidad del producto y proporciona información para la toma de decisiones.
</div>

<h3>Testing vs Depuración (Debugging)</h3>
<p>Es fundamental distinguir entre ambos conceptos:</p>
<table>
  <tr><th>Testing</th><th>Depuración</th></tr>
  <tr><td>Detecta síntomas (fallos)</td><td>Encuentra y corrige la causa raíz (defecto)</td></tr>
  <tr><td>Realizado por testers</td><td>Realizado por desarrolladores</td></tr>
  <tr><td>Activo (busca problemas)</td><td>Reactivo (responde a problemas encontrados)</td></tr>
  <tr><td>Puede ser estático o dinámico</td><td>Siempre dinámico (ejecuta el código)</td></tr>
</table>

<h3>Objetivos del Testing</h3>
<ul>
  <li>Evaluar productos de trabajo (requisitos, historias de usuario, diseño, código)</li>
  <li>Verificar si se cumplen los requisitos</li>
  <li>Validar que el objeto de prueba funciona como esperan los interesados</li>
  <li>Construir confianza en el nivel de calidad</li>
  <li>Encontrar defectos y fallos para reducir el nivel de riesgo</li>
  <li>Proporcionar información a los interesados para la toma de decisiones</li>
  <li>Cumplir requisitos contractuales, legales o regulatorios</li>
</ul>

<div class="example-box">
📌 <strong>Ejemplo:</strong> En un proyecto ágil, el testing puede verificar que una historia de usuario ("Como usuario, quiero restablecer mi contraseña") funciona correctamente antes de que se considere "done".
</div>

<h3>Testing dinámico y estático</h3>
<p><strong>Testing dinámico:</strong> Requiere la ejecución del software (pruebas de funcionalidad, rendimiento, etc.).</p>
<p><strong>Testing estático:</strong> No requiere ejecución del software (revisiones de código, análisis estático, revisiones de documentos).</p>

<h3>Verificación vs Validación</h3>
<ul>
  <li><strong>Verificación:</strong> ¿Estamos construyendo el producto correctamente? (cumple especificaciones)</li>
  <li><strong>Validación:</strong> ¿Estamos construyendo el producto correcto? (satisface necesidades del usuario)</li>
</ul>

<div class="warning-box">
⚠️ <strong>Importante para el examen:</strong> El testing NO puede probar que no hay defectos. Solo puede detectar fallos y reducir la probabilidad de problemas en producción.
</div>
      `
    },
    en: {
      title: "What is testing?",
      chapterTag: "Ch. 1 · Fundamentals",
      content: `
<h3>Definition of Software Testing</h3>
<p><strong>Software testing</strong> is a set of activities aimed at discovering defects and evaluating the quality of software artifacts. These activities are planned and controlled, and the result is a level of confidence about software quality.</p>

<div class="highlight-box">
💡 <strong>Main objective:</strong> Testing not only looks for defects, it also evaluates product quality and provides information for decision-making.
</div>

<h3>Testing vs Debugging</h3>
<p>It is fundamental to distinguish between both concepts:</p>
<table>
  <tr><th>Testing</th><th>Debugging</th></tr>
  <tr><td>Detects symptoms (failures)</td><td>Finds and fixes root cause (defect)</td></tr>
  <tr><td>Done by testers</td><td>Done by developers</td></tr>
  <tr><td>Active (searches for problems)</td><td>Reactive (responds to found problems)</td></tr>
  <tr><td>Can be static or dynamic</td><td>Always dynamic (executes code)</td></tr>
</table>

<h3>Testing Objectives</h3>
<ul>
  <li>Evaluate work products (requirements, user stories, design, code)</li>
  <li>Verify that specified requirements have been fulfilled</li>
  <li>Validate that the test object works as stakeholders expect</li>
  <li>Build confidence in the level of quality</li>
  <li>Find defects and failures to reduce risk level</li>
  <li>Provide information to stakeholders for decision-making</li>
  <li>Comply with contractual, legal or regulatory requirements</li>
</ul>

<div class="example-box">
📌 <strong>Example:</strong> In an agile project, testing can verify that a user story ("As a user, I want to reset my password") works correctly before it's considered "done".
</div>

<h3>Dynamic and Static Testing</h3>
<p><strong>Dynamic testing:</strong> Requires software execution (functionality, performance tests, etc.).</p>
<p><strong>Static testing:</strong> Does not require software execution (code reviews, static analysis, document reviews).</p>

<div class="warning-box">
⚠️ <strong>Important for the exam:</strong> Testing CANNOT prove the absence of defects. It can only detect failures and reduce the probability of problems in production.
</div>
      `
    }
  },
  "1.2": {
    es: {
      title: "¿Por qué es necesario el testing?",
      chapterTag: "Cap. 1 · Fundamentos",
      content: `
<h3>Causas de los defectos de software</h3>
<p>Los defectos de software ocurren porque los seres humanos cometen errores. La terminología clave es:</p>
<table>
  <tr><th>Término</th><th>Definición</th><th>Ejemplo</th></tr>
  <tr><td><strong>Error / Mistake</strong></td><td>Acción humana que produce un resultado incorrecto</td><td>Un programador malinterpreta un requisito</td></tr>
  <tr><td><strong>Defecto / Bug / Fault</strong></td><td>Imperfección en un producto de trabajo</td><td>El código tiene una condición incorrecta</td></tr>
  <tr><td><strong>Fallo / Failure</strong></td><td>El componente no realiza la función requerida</td><td>El sistema calcula mal el total de una compra</td></tr>
  <tr><td><strong>Causa raíz</strong></td><td>La razón fundamental que originó el defecto</td><td>Falta de comunicación en los requisitos</td></tr>
</table>

<div class="highlight-box">
🔗 <strong>Cadena de causalidad:</strong> Error → Defecto → Fallo
<br>Un <em>error</em> de un humano introduce un <em>defecto</em> en el código. Si ese código se ejecuta, puede producir un <em>fallo</em>.
</div>

<h3>¿Por qué ocurren los fallos?</h3>
<ul>
  <li>Errores humanos al diseñar, codificar o documentar</li>
  <li>Presión de tiempo que fuerza atajos</li>
  <li>Complejidad del código o infraestructura</li>
  <li>Malentendidos sobre interfaces o interacciones del sistema</li>
  <li>Condiciones ambientales (radiación, contaminación, campos electromagnéticos)</li>
</ul>

<h3>El rol del testing en el desarrollo</h3>
<p>El testing es importante porque contribuye al éxito del software:</p>
<ul>
  <li><strong>Reducción de riesgo</strong> de defectos en producción</li>
  <li><strong>Cumplimiento</strong> de requisitos contractuales y normativos</li>
  <li><strong>Confianza</strong> de los usuarios y clientes en el producto</li>
  <li><strong>Detección temprana</strong> reduce el costo de corrección</li>
</ul>

<div class="warning-box">
⚠️ <strong>Costo de los defectos:</strong> Cuanto más tarde se descubre un defecto, más caro resulta corregirlo. Un defecto en producción puede costar 100x más que uno encontrado en los requisitos.
</div>

<h3>Aseguramiento de Calidad (QA) vs Testing</h3>
<p><strong>QA (Quality Assurance):</strong> Se enfoca en los <em>procesos</em> para prevenir defectos. Es preventivo y proactivo.</p>
<p><strong>Testing / QC (Quality Control):</strong> Se enfoca en el <em>producto</em> para detectar defectos. Es reactivo y correctivo.</p>

<div class="example-box">
📌 <strong>Ejemplo QA vs QC:</strong>
<br>QA: Implementar revisiones de código obligatorias en el proceso de desarrollo.
<br>QC: Ejecutar pruebas para encontrar defectos en la aplicación antes de su lanzamiento.
</div>
      `
    },
    en: {
      title: "Why is testing necessary?",
      chapterTag: "Ch. 1 · Fundamentals",
      content: `
<h3>Root Causes of Software Defects</h3>
<p>Software defects occur because humans make mistakes. The key terminology is:</p>
<table>
  <tr><th>Term</th><th>Definition</th><th>Example</th></tr>
  <tr><td><strong>Error / Mistake</strong></td><td>Human action that produces an incorrect result</td><td>A programmer misunderstands a requirement</td></tr>
  <tr><td><strong>Defect / Bug / Fault</strong></td><td>Imperfection in a work product</td><td>The code has an incorrect condition</td></tr>
  <tr><td><strong>Failure</strong></td><td>The component fails to perform the required function</td><td>The system miscalculates a purchase total</td></tr>
  <tr><td><strong>Root cause</strong></td><td>The fundamental reason that originated the defect</td><td>Lack of communication in requirements</td></tr>
</table>

<div class="highlight-box">
🔗 <strong>Causality chain:</strong> Error → Defect → Failure<br>
A human <em>error</em> introduces a <em>defect</em> in the code. If that code is executed, it may produce a <em>failure</em>.
</div>

<h3>QA vs Testing</h3>
<p><strong>QA (Quality Assurance):</strong> Focuses on <em>processes</em> to prevent defects. It is preventive and proactive.</p>
<p><strong>Testing / QC (Quality Control):</strong> Focuses on the <em>product</em> to detect defects. It is reactive and corrective.</p>
      `
    }
  },
  "1.3": {
    es: {
      title: "Los 7 Principios del Testing",
      chapterTag: "Cap. 1 · Fundamentos",
      content: `
<h3>Los 7 Principios Fundamentales</h3>
<p>Estos principios son la base de la filosofía del testing moderno y son ampliamente examinados en el ISTQB.</p>

<div class="highlight-box">
🎯 <strong>Tip de examen:</strong> Debes conocer los 7 principios y ser capaz de identificar cuál aplica en un escenario dado.
</div>

<h3>Principio 1: El testing muestra la presencia de defectos, no su ausencia</h3>
<p>El testing puede mostrar que los defectos están presentes en el objeto de prueba, pero no puede probar que no hay defectos. El testing reduce la probabilidad de que permanezcan defectos sin descubrir, pero incluso si no se encuentran defectos, el testing no es una prueba de corrección.</p>

<h3>Principio 2: El testing exhaustivo es imposible</h3>
<p>No es posible probar todas las combinaciones de entradas y precondiciones (excepto en casos triviales). En lugar del testing exhaustivo, se utilizan técnicas de testing, priorización de casos de prueba y testing basado en riesgos para enfocar los esfuerzos.</p>
<div class="example-box">
📌 <strong>Ejemplo:</strong> Un campo de texto que acepta hasta 50 caracteres con letras, números y símbolos tendría millones de combinaciones posibles. Es imposible probarlas todas.
</div>

<h3>Principio 3: El testing temprano ahorra tiempo y dinero</h3>
<p>Cuanto antes se comience el testing en el SDLC, más económico será corregir los defectos. El "shift-left" implica comenzar el testing tan pronto como sea posible (ej: revisar requisitos antes de que se desarrolle el código).</p>

<h3>Principio 4: Los defectos se agrupan (clustering)</h3>
<p>Generalmente, un pequeño número de módulos contiene la mayoría de los defectos descubiertos durante el testing previo a la entrega, o muestra la mayor parte de los fallos operacionales. Este fenómeno se denomina <em>clustering</em> de defectos.</p>
<div class="highlight-box">
📊 <strong>Regla 80-20:</strong> Aproximadamente el 80% de los defectos se encuentran en el 20% del código.
</div>

<h3>Principio 5: Los tests se desgastan (paradoja del pesticida)</h3>
<p>Si se repiten las mismas pruebas una y otra vez, eventualmente estas dejarán de encontrar nuevos defectos. Para superar esta "paradoja del pesticida", los casos de prueba deben revisarse y actualizarse regularmente, y se deben escribir nuevos casos de prueba.</p>

<h3>Principio 6: El testing depende del contexto</h3>
<p>El testing se hace de forma diferente en distintos contextos. Por ejemplo, el software de seguridad crítica se prueba de manera diferente a una aplicación de comercio electrónico. Diferentes metodologías, técnicas y tipos de prueba se aplican según el contexto.</p>

<h3>Principio 7: La falacia de la ausencia de defectos</h3>
<p>Es un error suponer que la verificación de un sistema es todo lo que se necesita para asegurar el éxito de un sistema. Corregir completamente todos los defectos no ayudará si el sistema construido es inutilizable y no cumple con las necesidades y expectativas de los usuarios.</p>

<table>
  <tr><th>#</th><th>Principio</th><th>Clave</th></tr>
  <tr><td>1</td><td>Testing muestra presencia, no ausencia</td><td>No prueba corrección</td></tr>
  <tr><td>2</td><td>Testing exhaustivo es imposible</td><td>Priorización y riesgo</td></tr>
  <tr><td>3</td><td>Testing temprano ahorra dinero</td><td>Shift-left</td></tr>
  <tr><td>4</td><td>Los defectos se agrupan</td><td>Clustering / 80-20</td></tr>
  <tr><td>5</td><td>Los tests se desgastan</td><td>Paradoja del pesticida</td></tr>
  <tr><td>6</td><td>Depende del contexto</td><td>No hay recetas únicas</td></tr>
  <tr><td>7</td><td>Falacia de ausencia de defectos</td><td>Validación es esencial</td></tr>
</table>
      `
    },
    en: {
      title: "The 7 Testing Principles",
      chapterTag: "Ch. 1 · Fundamentals",
      content: `
<h3>The 7 Fundamental Principles</h3>
<p>These principles form the foundation of modern testing philosophy and are widely tested in ISTQB exams.</p>
<div class="highlight-box">🎯 <strong>Exam tip:</strong> You must know all 7 principles and be able to identify which applies in a given scenario.</div>
<h3>Principle 1: Testing shows presence of defects, not their absence</h3>
<p>Testing can show that defects are present, but cannot prove there are no defects.</p>
<h3>Principle 2: Exhaustive testing is impossible</h3>
<p>Testing all input combinations is not feasible. Use risk-based testing and techniques instead.</p>
<h3>Principle 3: Early testing saves time and money</h3>
<p>Testing as early as possible (shift-left) reduces the cost of fixing defects.</p>
<h3>Principle 4: Defects cluster together</h3>
<p>Most defects are found in a small number of modules (80/20 rule).</p>
<h3>Principle 5: Tests wear out (Pesticide paradox)</h3>
<p>Repeating the same tests stops finding new defects. Regularly update tests.</p>
<h3>Principle 6: Testing is context dependent</h3>
<p>Safety-critical software is tested differently from e-commerce apps.</p>
<h3>Principle 7: Absence-of-defects fallacy</h3>
<p>Finding and fixing all defects doesn't help if the system doesn't meet user needs.</p>
      `
    }
  },
  "1.4": {
    es: {
      title: "Actividades, testware y roles",
      chapterTag: "Cap. 1 · Fundamentos",
      content: `
<h3>Actividades del proceso de prueba</h3>
<p>El proceso de prueba incluye las siguientes actividades principales:</p>
<ul>
  <li><strong>Planificación de pruebas:</strong> Definir objetivos, enfoque y recursos.</li>
  <li><strong>Seguimiento y control:</strong> Comparar progreso real vs plan.</li>
  <li><strong>Análisis de pruebas:</strong> ¿Qué probar? Identificar condiciones de prueba.</li>
  <li><strong>Diseño de pruebas:</strong> ¿Cómo probar? Diseñar casos de prueba de alto nivel.</li>
  <li><strong>Implementación de pruebas:</strong> Crear scripts, datos y entorno.</li>
  <li><strong>Ejecución de pruebas:</strong> Ejecutar pruebas y comparar resultados.</li>
  <li><strong>Completitud de pruebas:</strong> Verificar criterios de salida, reportar, archivar.</li>
</ul>

<h3>Testware</h3>
<p>El <strong>testware</strong> es el conjunto de artefactos producidos durante el proceso de prueba:</p>
<ul>
  <li>Plan de pruebas, calendario de pruebas</li>
  <li>Condiciones de prueba, casos de prueba, scripts de prueba</li>
  <li>Datos de prueba, entorno de prueba</li>
  <li>Informe de defectos, informe de pruebas</li>
  <li>Registros de ejecución de pruebas</li>
</ul>

<h3>Roles en el testing</h3>
<table>
  <tr><th>Rol</th><th>Responsabilidad</th></tr>
  <tr><td><strong>Test Manager</strong></td><td>Planificación, monitoreo, gestión general del testing</td></tr>
  <tr><td><strong>Tester</strong></td><td>Análisis, diseño, implementación y ejecución de pruebas</td></tr>
</table>

<h3>Trazabilidad</h3>
<p>La <strong>trazabilidad</strong> es la capacidad de relacionar los productos de trabajo de testing (casos de prueba, defectos) con los requisitos y demás artefactos del proyecto. Permite determinar el impacto de los cambios.</p>
      `
    },
    en: {
      title: "Testing activities, testware and roles",
      chapterTag: "Ch. 1 · Fundamentals",
      content: `
<h3>Test Process Activities</h3>
<ul>
  <li><strong>Test planning:</strong> Define objectives, approach and resources.</li>
  <li><strong>Test monitoring & control:</strong> Compare progress against plan.</li>
  <li><strong>Test analysis:</strong> What to test? Identify test conditions.</li>
  <li><strong>Test design:</strong> How to test? Design high-level test cases.</li>
  <li><strong>Test implementation:</strong> Create scripts, data, and environment.</li>
  <li><strong>Test execution:</strong> Run tests and compare results.</li>
  <li><strong>Test completion:</strong> Verify exit criteria, report, archive.</li>
</ul>
<h3>Testware</h3>
<p>Artifacts produced during the test process: test plans, test cases, scripts, test data, defect reports, test reports.</p>
<h3>Roles</h3>
<table>
  <tr><th>Role</th><th>Responsibility</th></tr>
  <tr><td><strong>Test Manager</strong></td><td>Planning, monitoring, overall test management</td></tr>
  <tr><td><strong>Tester</strong></td><td>Analysis, design, implementation and test execution</td></tr>
</table>
      `
    }
  },
  "2.2": {
    es: {
      title: "Niveles de prueba",
      chapterTag: "Cap. 2 · SDLC",
      content: `
<h3>Los 4 Niveles de Prueba</h3>
<p>Los niveles de prueba son grupos de actividades de testing organizadas y gestionadas juntos. Cada nivel corresponde a una fase del desarrollo.</p>

<h3>Prueba de Componente / Unitaria</h3>
<p>Verifica componentes individuales en aislamiento. También llamada prueba unitaria.</p>
<ul>
  <li><strong>Objeto de prueba:</strong> Código fuente, módulos, clases</li>
  <li><strong>Defectos típicos:</strong> Errores de código, malos caminos en el flujo</li>
  <li><strong>Entorno:</strong> Stubs y drivers para simular dependencias</li>
  <li><strong>Realizado por:</strong> Desarrolladores</li>
</ul>

<h3>Prueba de Integración de Componentes</h3>
<p>Verifica la interacción entre componentes integrados.</p>
<ul>
  <li><strong>Objeto de prueba:</strong> Interfaces, APIs, flujos de datos entre módulos</li>
  <li><strong>Defectos típicos:</strong> Comunicación incorrecta entre componentes</li>
  <li><strong>Enfoques:</strong> Bottom-up, Top-down, Big-bang, Sandwich</li>
</ul>

<h3>Prueba de Sistema</h3>
<p>Verifica el comportamiento del sistema completo de extremo a extremo.</p>
<ul>
  <li><strong>Objeto de prueba:</strong> Sistema completo, aplicación end-to-end</li>
  <li><strong>Defectos típicos:</strong> Flujos de datos incorrectos, fallos funcionales del sistema</li>
  <li><strong>Realizado por:</strong> Equipo de pruebas independiente</li>
</ul>

<h3>Prueba de Aceptación</h3>
<p>Verifica si el sistema cumple con los criterios de aceptación del negocio y es listo para entrega.</p>
<ul>
  <li><strong>UAT (User Acceptance Testing):</strong> Usuarios finales</li>
  <li><strong>BAT (Business Acceptance Testing):</strong> Procesos de negocio</li>
  <li><strong>Alpha testing:</strong> En el sitio del desarrollador</li>
  <li><strong>Beta testing:</strong> En el entorno del cliente</li>
  <li><strong>Regulatory testing:</strong> Cumplimiento legal</li>
</ul>

<table>
  <tr><th>Nivel</th><th>¿Qué verifica?</th><th>¿Quién?</th></tr>
  <tr><td>Componente</td><td>Módulos individuales</td><td>Desarrolladores</td></tr>
  <tr><td>Integración</td><td>Interacción entre componentes</td><td>Desarrolladores / Testers</td></tr>
  <tr><td>Sistema</td><td>Sistema completo</td><td>Testers independientes</td></tr>
  <tr><td>Aceptación</td><td>Necesidades del negocio/usuario</td><td>Usuarios / Clientes</td></tr>
</table>
      `
    },
    en: {
      title: "Test levels",
      chapterTag: "Ch. 2 · SDLC",
      content: `
<h3>The 4 Test Levels</h3>
<table>
  <tr><th>Level</th><th>What it verifies</th><th>Who?</th></tr>
  <tr><td>Component/Unit</td><td>Individual modules</td><td>Developers</td></tr>
  <tr><td>Integration</td><td>Interaction between components</td><td>Developers / Testers</td></tr>
  <tr><td>System</td><td>Complete system end-to-end</td><td>Independent testers</td></tr>
  <tr><td>Acceptance</td><td>Business/user needs</td><td>Users / Clients</td></tr>
</table>
      `
    }
  },
  "1.5": {
    es: {
      title: "Habilidades esenciales en testing",
      chapterTag: "Cap. 1 · Fundamentos",
      content: `
<h3>Habilidades del Tester</h3>
<p>Un buen tester necesita una combinación de habilidades técnicas y no técnicas:</p>
<h4>Habilidades técnicas</h4>
<ul>
  <li>Conocimiento de técnicas de testing</li>
  <li>Comprensión del software a probar</li>
  <li>Uso de herramientas de testing</li>
  <li>Capacidad de análisis y diseño de pruebas</li>
  <li>Programación (especialmente para testing de componentes y automatización)</li>
</ul>
<h4>Habilidades no técnicas</h4>
<ul>
  <li>Curiosidad y pensamiento crítico</li>
  <li>Atención al detalle</li>
  <li>Comunicación efectiva</li>
  <li>Pensamiento analítico y sistemático</li>
  <li>Trabajo en equipo y colaboración</li>
  <li>Pensamiento independiente (para cuestionar supuestos)</li>
</ul>
<div class="highlight-box">
💡 <strong>Mentalidad del tester:</strong> Los testers deben ser capaces de pensar de forma diferente a los desarrolladores — buscando cómo el sistema puede fallar, en lugar de cómo funciona correctamente.
</div>
<h3>Independencia del Testing</h3>
<p>El nivel de independencia del tester influye en la efectividad del testing:</p>
<table>
  <tr><th>Nivel</th><th>Descripción</th><th>Ventaja</th></tr>
  <tr><td>Sin independencia</td><td>El desarrollador prueba su propio código</td><td>Conoce bien el código</td></tr>
  <tr><td>Independencia interna</td><td>Tester del mismo equipo</td><td>Mayor objetividad</td></tr>
  <tr><td>Independencia de equipo</td><td>Equipo de QA separado</td><td>Perspectiva externa</td></tr>
  <tr><td>Total independencia</td><td>Organización externa</td><td>Máxima objetividad</td></tr>
</table>
<div class="warning-box">
⚠️ <strong>Importante:</strong> Mayor independencia no siempre es mejor — puede introducir problemas de comunicación y falta de conocimiento del dominio.
</div>`
    },
    en: {
      title: "Essential skills in testing",
      chapterTag: "Ch. 1 · Fundamentals",
      content: `
<h3>Tester Skills</h3>
<p>A good tester needs a combination of technical and non-technical skills:</p>
<ul>
  <li>Knowledge of testing techniques</li>
  <li>Understanding of the software being tested</li>
  <li>Curiosity and critical thinking</li>
  <li>Attention to detail and analytical thinking</li>
  <li>Effective communication and teamwork</li>
</ul>
<div class="highlight-box">💡 <strong>Tester mindset:</strong> Testers should be able to think differently from developers — looking for how the system can fail, rather than how it works correctly.</div>`
    }
  },
  "2.1": {
    es: {
      title: "Testing en el contexto del SDLC",
      chapterTag: "Cap. 2 · SDLC",
      content: `
<h3>Modelos de Desarrollo de Software y Testing</h3>
<p>El testing debe adaptarse al modelo de desarrollo utilizado:</p>
<h3>Modelo Waterfall (Cascada)</h3>
<ul>
  <li>Las fases son secuenciales: requisitos → diseño → código → pruebas → mantenimiento</li>
  <li>El testing ocurre después de que el desarrollo está completo</li>
  <li>Los defectos encontrados tardíamente son muy costosos</li>
  <li>Testing más formal y documentado</li>
</ul>
<h3>Modelos Iterativos/Ágiles (Scrum, Kanban)</h3>
<ul>
  <li>El testing se integra en cada iteración/sprint</li>
  <li>Los testers colaboran con desarrolladores desde el inicio</li>
  <li>Testing continuo con feedback rápido</li>
  <li>Automatización es esencial para mantener el ritmo</li>
</ul>
<h3>DevOps y Shift-Left</h3>
<p><strong>DevOps</strong> combina el desarrollo y las operaciones para entregar software más rápidamente. El <strong>shift-left</strong> mueve el testing hacia las fases más tempranas del SDLC.</p>
<div class="example-box">
📌 <strong>Shift-left en práctica:</strong>
<ul>
  <li>Revisiones de requisitos (antes de diseñar)</li>
  <li>TDD: escribir pruebas antes del código</li>
  <li>ATDD: criterios de aceptación como pruebas</li>
  <li>Integración continua con pruebas automáticas</li>
</ul>
</div>
<div class="highlight-box">
💡 <strong>Principio:</strong> En cualquier modelo de SDLC, el testing debe comenzar lo antes posible (Principio 3: testing temprano).
</div>`
    },
    en: {
      title: "Testing in the context of SDLC",
      chapterTag: "Ch. 2 · SDLC",
      content: `
<h3>Software Development Models and Testing</h3>
<p>Testing must adapt to the development model being used. In Waterfall, testing occurs after development is complete. In Agile/iterative models, testing is integrated into each sprint. DevOps and shift-left bring testing as early as possible in the SDLC.</p>
<div class="highlight-box">💡 In any SDLC model, testing should start as early as possible (Principle 3: early testing).</div>`
    }
  },
  "2.3": {
    es: {
      title: "Tipos de prueba",
      chapterTag: "Cap. 2 · SDLC",
      content: `
<h3>Tipos de Prueba</h3>
<p>Los tipos de prueba categorizan las pruebas según su objetivo:</p>
<h3>Pruebas Funcionales</h3>
<p>Verifican <strong>QUÉ hace</strong> el sistema (comportamiento funcional). Evalúan características, funciones y comportamiento del sistema.</p>
<ul>
  <li>Prueba de funcionalidad</li>
  <li>Prueba de regresión</li>
  <li>Prueba de humo (smoke/sanity)</li>
</ul>
<h3>Pruebas No Funcionales</h3>
<p>Verifican <strong>CÓMO se comporta</strong> el sistema. Cubren características de calidad que no son funciones específicas.</p>
<table>
  <tr><th>Tipo</th><th>Qué evalúa</th></tr>
  <tr><td>Rendimiento/Carga</td><td>Velocidad, escalabilidad bajo carga</td></tr>
  <tr><td>Seguridad</td><td>Vulnerabilidades, acceso no autorizado</td></tr>
  <tr><td>Usabilidad</td><td>Facilidad de uso, experiencia de usuario</td></tr>
  <tr><td>Fiabilidad</td><td>Disponibilidad, tolerancia a fallos</td></tr>
  <tr><td>Compatibilidad</td><td>Interoperabilidad con otros sistemas</td></tr>
  <tr><td>Mantenibilidad</td><td>Facilidad de modificación</td></tr>
</table>
<h3>Pruebas de Caja Blanca</h3>
<p>Basadas en la estructura interna del código. Se derivan de la implementación del software (sentencias, ramas, rutas).</p>
<h3>Pruebas Relacionadas con Cambios</h3>
<ul>
  <li><strong>Confirmación:</strong> Verifica que un defecto corregido ya no falla</li>
  <li><strong>Regresión:</strong> Verifica que los cambios no introdujeron nuevos defectos</li>
</ul>
<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Distingue entre pruebas funcionales (QUÉ hace el sistema) y no funcionales (CÓMO lo hace).
</div>`
    },
    en: {
      title: "Test types",
      chapterTag: "Ch. 2 · SDLC",
      content: `
<h3>Test Types</h3>
<table>
  <tr><th>Type</th><th>What it evaluates</th></tr>
  <tr><td>Functional</td><td>WHAT the system does (behavior)</td></tr>
  <tr><td>Non-functional</td><td>HOW the system performs (performance, security, usability)</td></tr>
  <tr><td>White-box</td><td>Internal structure of the code</td></tr>
  <tr><td>Change-related</td><td>Confirmation (retesting) and Regression</td></tr>
</table>`
    }
  },
  "3.1": {
    es: {
      title: "Conceptos básicos del testing estático",
      chapterTag: "Cap. 3 · Testing Estático",
      content: `
<h3>¿Qué es el Testing Estático?</h3>
<p>El testing estático evalúa artefactos de software <strong>sin ejecutar el software</strong>. Puede aplicarse a:</p>
<ul>
  <li>Especificaciones de requisitos</li>
  <li>Historias de usuario y criterios de aceptación</li>
  <li>Diseño del sistema y arquitectura</li>
  <li>Código fuente</li>
  <li>Documentación técnica y de pruebas</li>
  <li>Contratos y planes de proyecto</li>
</ul>
<h3>Análisis Estático</h3>
<p>El <strong>análisis estático</strong> es el proceso automatizado de examinar el código fuente sin ejecutarlo. Las herramientas de análisis estático detectan:</p>
<ul>
  <li>Violaciones de estándares de codificación</li>
  <li>Variables no inicializadas o no usadas</li>
  <li>Dead code (código muerto nunca ejecutado)</li>
  <li>Vulnerabilidades de seguridad (SQL injection, XSS, etc.)</li>
  <li>Complejidad ciclomática alta</li>
</ul>
<div class="example-box">
📌 <strong>Herramientas comunes:</strong> SonarQube, ESLint, FindBugs, PMD, Checkstyle.
</div>
<h3>Beneficios del Testing Estático</h3>
<ul>
  <li>Detecta defectos antes de la ejecución (más barato corregir)</li>
  <li>Encuentra defectos que el testing dinámico no puede detectar fácilmente</li>
  <li>Mejora la calidad del código y la documentación</li>
  <li>Facilita la comunicación entre el equipo</li>
  <li>Reduce el tiempo de testing dinámico posterior</li>
</ul>
<div class="highlight-box">
💡 <strong>Defectos típicos encontrados en testing estático:</strong>
<br>• Requisitos ambiguos o contradictorios
<br>• Errores de diseño o interfaces
<br>• Código no seguro o difícil de mantener
<br>• Desviaciones de los estándares de codificación
</div>`
    },
    en: {
      title: "Basic concepts of static testing",
      chapterTag: "Ch. 3 · Static Testing",
      content: `
<h3>What is Static Testing?</h3>
<p>Static testing evaluates software artifacts WITHOUT executing the software. It applies to requirements, code, design, user stories, documentation, and contracts.</p>
<h3>Benefits</h3>
<ul>
  <li>Finds defects before execution (cheaper to fix)</li>
  <li>Finds defects dynamic testing cannot easily detect</li>
  <li>Improves code and documentation quality</li>
</ul>`
    }
  },
  "3.2": {
    es: {
      title: "El proceso de revisión",
      chapterTag: "Cap. 3 · Testing Estático",
      content: `
<h3>Tipos de Revisión</h3>
<table>
  <tr><th>Tipo</th><th>Formalidad</th><th>Guiado por</th><th>Objetivo</th></tr>
  <tr><td>Informal</td><td>Muy baja</td><td>Cualquiera</td><td>Encontrar defectos rápidamente</td></tr>
  <tr><td>Walkthrough</td><td>Baja-Media</td><td>Autor</td><td>Aprendizaje del equipo</td></tr>
  <tr><td>Revisión técnica</td><td>Media</td><td>Moderador</td><td>Consenso técnico</td></tr>
  <tr><td>Inspección</td><td>Alta</td><td>Moderador certificado</td><td>Máxima detección de defectos</td></tr>
</table>
<h3>Roles en una Revisión Formal</h3>
<ul>
  <li><strong>Autor:</strong> Creó el producto de trabajo que se revisa</li>
  <li><strong>Moderador (Manager):</strong> Facilita el proceso, asegura la eficacia</li>
  <li><strong>Escritor/Escriba:</strong> Documenta los defectos encontrados</li>
  <li><strong>Revisores (Inspectores):</strong> Analizan el producto de trabajo</li>
  <li><strong>Líder de revisión:</strong> Planifica y organiza la revisión</li>
</ul>
<h3>Proceso de Revisión</h3>
<ol>
  <li><strong>Planificación:</strong> Definir alcance, criterios de entrada/salida, asignar roles</li>
  <li><strong>Inicio:</strong> Distribuir materiales, verificar criterios de entrada</li>
  <li><strong>Revisión individual:</strong> Cada revisor examina el producto de trabajo</li>
  <li><strong>Comunicación y análisis:</strong> Reunión para discutir los hallazgos</li>
  <li><strong>Corrección y reporte:</strong> El autor corrige; se genera el informe</li>
  <li><strong>Seguimiento:</strong> Verificar que los defectos fueron corregidos</li>
</ol>
<div class="highlight-box">
💡 <strong>Para el examen:</strong> La INSPECCIÓN es la revisión más formal. El WALKTHROUGH es guiado por el autor. La revisión INFORMAL no tiene proceso definido.
</div>`
    },
    en: {
      title: "The review process",
      chapterTag: "Ch. 3 · Static Testing",
      content: `
<h3>Review Types</h3>
<table>
  <tr><th>Type</th><th>Formality</th><th>Led by</th></tr>
  <tr><td>Informal</td><td>Very low</td><td>Anyone</td></tr>
  <tr><td>Walkthrough</td><td>Low-Medium</td><td>Author</td></tr>
  <tr><td>Technical review</td><td>Medium</td><td>Moderator</td></tr>
  <tr><td>Inspection</td><td>High</td><td>Certified moderator</td></tr>
</table>
<h3>Roles in a Formal Review</h3>
<ul>
  <li>Author, Moderator, Scribe, Reviewers, Review leader</li>
</ul>`
    }
  },
  "4.1": {
    es: {
      title: "Panorama de las técnicas de prueba",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>Categorías de Técnicas de Prueba</h3>
<p>Las técnicas de diseño de pruebas se clasifican en tres grandes categorías:</p>
<div class="highlight-box">
🎯 <strong>Resumen clave para el examen:</strong>
<ul>
  <li><strong>Caja Negra:</strong> Basadas en la especificación (qué hace el sistema)</li>
  <li><strong>Caja Blanca:</strong> Basadas en la estructura interna (cómo lo hace)</li>
  <li><strong>Experiencia:</strong> Basadas en el conocimiento del tester</li>
</ul>
</div>
<h3>Técnicas de Caja Negra (Black-Box)</h3>
<p>No requieren conocimiento del código interno. Se basan en las especificaciones:</p>
<ul>
  <li>Partición de Equivalencia (EP)</li>
  <li>Análisis de Valor Límite (BVA)</li>
  <li>Tablas de Decisión</li>
  <li>Prueba de Transición de Estado</li>
  <li>Prueba de Caso de Uso</li>
</ul>
<h3>Técnicas de Caja Blanca (White-Box)</h3>
<p>Requieren acceso al código fuente. Miden la cobertura del código:</p>
<ul>
  <li>Cobertura de Sentencia (Statement Coverage)</li>
  <li>Cobertura de Rama (Branch Coverage)</li>
</ul>
<h3>Técnicas Basadas en Experiencia</h3>
<p>Se basan en el conocimiento, intuición y experiencia del tester:</p>
<ul>
  <li>Error Guessing (Adivinanza de Errores)</li>
  <li>Testing Exploratorio</li>
  <li>Testing basado en Checklists</li>
</ul>
<h3>Técnicas Basadas en Colaboración (CTFL 4.0)</h3>
<ul>
  <li>Escritura colaborativa de historias de usuario</li>
  <li>ATDD (Acceptance Test-Driven Development)</li>
</ul>`
    },
    en: {
      title: "Test techniques overview",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Test Design Technique Categories</h3>
<ul>
  <li><strong>Black-Box:</strong> Specification-based (EP, BVA, Decision Tables, State Transition)</li>
  <li><strong>White-Box:</strong> Structure-based (Statement Coverage, Branch Coverage)</li>
  <li><strong>Experience-based:</strong> Error Guessing, Exploratory Testing, Checklist-based</li>
  <li><strong>Collaboration-based:</strong> User stories, ATDD</li>
</ul>`
    }
  },
  "4.3": {
    es: {
      title: "Técnicas de caja blanca",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>Técnicas de Caja Blanca</h3>
<p>Las técnicas de caja blanca (white-box o estructura-based) se basan en el análisis de la <strong>estructura interna</strong> del código. Requieren acceso al código fuente.</p>
<h3>Cobertura de Sentencia (Statement Coverage)</h3>
<p>Mide el porcentaje de <strong>sentencias ejecutables</strong> que han sido ejecutadas por los casos de prueba.</p>
<div class="example-box">
📌 <strong>Ejemplo:</strong>
<code>
if (x > 0) {
  y = x * 2;  // Sentencia 1
}
z = y + 1;    // Sentencia 2
</code>
Si solo probamos con x=5, ejecutamos ambas sentencias → 100% statement coverage.
Si solo probamos con x=-1, solo ejecutamos la sentencia 2 → 50% statement coverage.
</div>
<h3>Cobertura de Rama (Branch Coverage)</h3>
<p>Mide el porcentaje de <strong>ramas del flujo de control</strong> ejecutadas. Para cada decisión (IF/SWITCH), tanto el camino verdadero como el falso deben ser probados.</p>
<div class="highlight-box">
💡 <strong>Branch Coverage ⊃ Statement Coverage:</strong>
<br>Si alcanzamos 100% de branch coverage, también tenemos 100% de statement coverage.
<br>Pero 100% de statement coverage NO garantiza 100% de branch coverage.
</div>
<div class="warning-box">
⚠️ <strong>Para el examen:</strong>
<br>• Statement coverage = % de sentencias ejecutadas
<br>• Branch coverage = % de ramas ejecutadas (más fuerte)
<br>• 100% branch coverage implica 100% statement coverage (no viceversa)
</div>`
    },
    en: {
      title: "White-box test techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>White-Box Techniques</h3>
<p>Based on the internal structure of the code. Require access to source code.</p>
<h3>Statement Coverage</h3>
<p>Measures the percentage of executable statements executed by test cases.</p>
<h3>Branch Coverage</h3>
<p>Measures the percentage of control flow branches executed. Stronger than statement coverage: 100% branch coverage implies 100% statement coverage (but not vice versa).</p>`
    }
  },
  "4.4": {
    es: {
      title: "Técnicas basadas en experiencia",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>Técnicas Basadas en Experiencia</h3>
<p>Estas técnicas se basan en el conocimiento, intuición y experiencia previa del tester. Son complementarias a las técnicas sistemáticas.</p>
<h3>Error Guessing (Adivinanza de Errores)</h3>
<p>El tester anticipa tipos de errores, defectos y fallos basándose en su experiencia previa. Crea una <strong>lista de errores</strong> y diseña pruebas para detectarlos.</p>
<div class="example-box">
📌 <strong>Errores típicos a "adivinar":</strong>
<ul>
  <li>División por cero</li>
  <li>Desbordamiento de buffer</li>
  <li>Campo vacío o nulo</li>
  <li>Caracteres especiales en campos de texto</li>
  <li>Valores negativos donde solo se esperan positivos</li>
</ul>
</div>
<h3>Testing Exploratorio</h3>
<p>Técnica simultánea donde el aprendizaje, diseño y ejecución ocurren al mismo tiempo. Se guía por <strong>charters</strong> (objetivos de exploración).</p>
<ul>
  <li>No sigue scripts predefinidos</li>
  <li>El tester adapta su enfoque en tiempo real</li>
  <li>Útil para descubrir defectos inesperados</li>
  <li>Requiere testers experimentados</li>
</ul>
<h3>Testing Basado en Checklists</h3>
<p>El tester usa una lista de condiciones o comprobaciones basadas en experiencia, estándares o heurísticas para guiar el testing.</p>
<div class="highlight-box">
💡 <strong>Cuándo usar cada técnica:</strong>
<br>• Error guessing: defectos esperados en áreas conocidas
<br>• Exploratorio: descubrir lo desconocido, probar sin especificaciones
<br>• Checklist: asegurar cobertura de áreas de riesgo conocidas
</div>`
    },
    en: {
      title: "Experience-based techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Experience-Based Techniques</h3>
<ul>
  <li><strong>Error Guessing:</strong> Tester anticipates likely errors based on experience</li>
  <li><strong>Exploratory Testing:</strong> Simultaneous learning, design and execution guided by charters</li>
  <li><strong>Checklist-based:</strong> Testing guided by a checklist based on experience or standards</li>
</ul>`
    }
  },
  "4.5": {
    es: {
      title: "Técnicas basadas en colaboración",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>Técnicas Basadas en Colaboración</h3>
<p>En el ISTQB v4.0, se añaden técnicas basadas en la colaboración entre desarrolladores, testers y representantes del negocio.</p>
<h3>Escritura Colaborativa de Historias de Usuario</h3>
<p>Las historias de usuario se escriben en colaboración. El formato típico es:</p>
<div class="example-box">
📌 <strong>Formato:</strong>
<br><em>Como [tipo de usuario], quiero [acción/objetivo] para que [beneficio/valor].</em>
<br><br><strong>Ejemplo:</strong> Como cliente registrado, quiero restablecer mi contraseña por email, para que pueda recuperar mi acceso si la olvido.
</div>
<p>Las historias deben incluir <strong>criterios de aceptación</strong> claros que definan cuándo la historia está "done".</p>
<h3>ATDD (Acceptance Test-Driven Development)</h3>
<p>En ATDD, los criterios de aceptación se expresan como <strong>casos de prueba</strong> antes de comenzar el desarrollo:</p>
<ol>
  <li>El equipo (dev + tester + negocio) define los criterios de aceptación</li>
  <li>Se crean los casos de prueba de aceptación</li>
  <li>El desarrollador implementa la funcionalidad para pasar esas pruebas</li>
  <li>Se ejecutan las pruebas para verificar que la historia está completa</li>
</ol>
<div class="highlight-box">
💡 <strong>Diferencia ATDD vs TDD:</strong>
<br>• TDD: el desarrollador escribe pruebas unitarias antes de su código
<br>• ATDD: el equipo completo escribe pruebas de aceptación antes del desarrollo
</div>`
    },
    en: {
      title: "Collaboration-based techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Collaboration-Based Techniques (CTFL v4.0)</h3>
<h3>Collaborative User Story Writing</h3>
<p>User stories written collaboratively with format: "As a [user], I want [action] so that [benefit]." Must include clear acceptance criteria.</p>
<h3>ATDD</h3>
<p>Acceptance criteria expressed as test cases before development begins. Whole team (dev + tester + business) participates.</p>`
    }
  },
  "5.1": {
    es: {
      title: "Planificación de pruebas",
      chapterTag: "Cap. 5 · Gestión",
      content: `
<h3>El Plan de Pruebas</h3>
<p>El plan de pruebas documenta el enfoque, recursos, alcance y actividades del testing. Un plan de pruebas típico incluye:</p>
<ul>
  <li>Contexto (alcance, objetivos, stakeholders)</li>
  <li>Supuestos y restricciones</li>
  <li>Comunicación y reporte de información</li>
  <li>Gestión de riesgos</li>
  <li>Enfoque de pruebas (niveles, tipos, técnicas)</li>
  <li>Criterios de entrada y salida</li>
  <li>Estimación del esfuerzo</li>
  <li>Calendario de actividades</li>
  <li>Roles y responsabilidades</li>
</ul>
<h3>Criterios de Entrada y Salida</h3>
<table>
  <tr><th>Criterios de Entrada</th><th>Criterios de Salida</th></tr>
  <tr><td>El código está completo y compilado</td><td>Todos los casos de prueba ejecutados</td></tr>
  <tr><td>El entorno de pruebas está disponible</td><td>90% de casos pasados</td></tr>
  <tr><td>Los datos de prueba están preparados</td><td>Todos los defectos críticos cerrados</td></tr>
  <tr><td>Los requisitos están aprobados</td><td>Informe de pruebas generado</td></tr>
</table>
<h3>Estimación del Esfuerzo de Testing</h3>
<p>Las técnicas de estimación incluyen:</p>
<ul>
  <li><strong>Basada en métricas:</strong> Usando datos históricos de proyectos similares</li>
  <li><strong>Basada en expertos:</strong> Planning Poker, estimación en 3 puntos</li>
  <li><strong>Porcentaje del desarrollo:</strong> El testing suele representar el 20-40% del total</li>
</ul>`
    },
    en: {
      title: "Test planning",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>The Test Plan</h3>
<p>Documents the testing approach, resources, scope and activities. Includes context, risks, approach, entry/exit criteria, effort estimates and schedules.</p>
<h3>Entry and Exit Criteria Examples</h3>
<table>
  <tr><th>Entry Criteria</th><th>Exit Criteria</th></tr>
  <tr><td>Code complete and compiled</td><td>All test cases executed</td></tr>
  <tr><td>Test environment available</td><td>90% tests passed</td></tr>
  <tr><td>Requirements approved</td><td>All critical defects closed</td></tr>
</table>`
    }
  },
  "5.2": {
    es: {
      title: "Gestión de riesgos",
      chapterTag: "Cap. 5 · Gestión",
      content: `
<h3>Riesgo en el Contexto del Testing</h3>
<p>Un <strong>riesgo</strong> es un factor potencial que puede resultar en una consecuencia negativa en el futuro. Se calcula como:</p>
<div class="highlight-box">
📊 <strong>Nivel de Riesgo = Probabilidad × Impacto</strong>
</div>
<h3>Tipos de Riesgo</h3>
<table>
  <tr><th>Tipo</th><th>Descripción</th><th>Ejemplos</th></tr>
  <tr><td><strong>Riesgo de Producto</strong></td><td>Posibilidad de que el producto no cumpla su función</td><td>Fallo de seguridad, rendimiento deficiente, funcionalidad incorrecta</td></tr>
  <tr><td><strong>Riesgo de Proyecto</strong></td><td>Posibilidad de que el proyecto falle en sus objetivos</td><td>Exceso de presupuesto, retrasos, problemas de personal</td></tr>
</table>
<h3>Testing Basado en Riesgos</h3>
<p>El testing basado en riesgos prioriza los esfuerzos de testing según el nivel de riesgo de cada área:</p>
<ol>
  <li><strong>Identificar</strong> los riesgos del producto</li>
  <li><strong>Evaluar</strong> su probabilidad e impacto</li>
  <li><strong>Priorizar</strong> el testing en áreas de mayor riesgo</li>
  <li><strong>Mitigar</strong> los riesgos mediante pruebas</li>
  <li><strong>Monitorear</strong> los riesgos a lo largo del proyecto</li>
</ol>
<div class="example-box">
📌 <strong>Ejemplo:</strong> En un sistema bancario, el módulo de transferencias tiene mayor riesgo que la página de inicio. Por lo tanto, se le asigna más esfuerzo de testing y técnicas más exhaustivas.
</div>`
    },
    en: {
      title: "Risk management",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>Risk in Testing Context</h3>
<p><strong>Risk Level = Probability × Impact</strong></p>
<h3>Risk Types</h3>
<table>
  <tr><th>Type</th><th>Description</th></tr>
  <tr><td>Product risk</td><td>Possibility product won't meet requirements</td></tr>
  <tr><td>Project risk</td><td>Possibility project won't meet objectives</td></tr>
</table>
<h3>Risk-Based Testing</h3>
<p>Prioritize testing effort based on risk level. Higher risk areas get more testing and exhaustive techniques.</p>`
    }
  },
  "5.5": {
    es: {
      title: "Gestión de defectos",
      chapterTag: "Cap. 5 · Gestión",
      content: `
<h3>El Ciclo de Vida de un Defecto</h3>
<p>Un defecto pasa por diferentes estados desde que se detecta hasta que se cierra:</p>
<div class="example-box">
📌 <strong>Estados típicos:</strong>
<br>Nuevo → Asignado → En corrección → Pendiente retest → Reabierto / Cerrado
</div>
<h3>Informe de Defecto</h3>
<p>Un informe de defecto bien escrito debe incluir:</p>
<ul>
  <li><strong>ID único</strong> y título descriptivo</li>
  <li><strong>Fecha</strong> de detección y <strong>autor</strong></li>
  <li><strong>Objeto de prueba</strong> (módulo, versión)</li>
  <li><strong>Entorno</strong> de prueba (OS, browser, etc.)</li>
  <li><strong>Pasos para reproducir</strong> el defecto</li>
  <li><strong>Resultado esperado</strong> vs <strong>resultado actual</strong></li>
  <li><strong>Severidad</strong> y <strong>prioridad</strong></li>
  <li><strong>Evidencia:</strong> capturas de pantalla, logs</li>
</ul>
<h3>Severidad vs Prioridad</h3>
<table>
  <tr><th></th><th>Alta prioridad</th><th>Baja prioridad</th></tr>
  <tr><td><strong>Alta severidad</strong></td><td>Sistema caído, afecta a todos</td><td>Crash en función rara vez usada</td></tr>
  <tr><td><strong>Baja severidad</strong></td><td>Error tipográfico en página principal</td><td>Error visual en pantalla de configuración</td></tr>
</table>
<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Severidad = impacto técnico. Prioridad = urgencia de corrección. Son dimensiones independientes.
</div>`
    },
    en: {
      title: "Defect management",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>Defect Lifecycle</h3>
<p>New → Assigned → In Fix → Pending Retest → Reopened / Closed</p>
<h3>Defect Report Contents</h3>
<ul>
  <li>Unique ID, title, date, author</li>
  <li>Test object and environment</li>
  <li>Steps to reproduce</li>
  <li>Expected vs actual result</li>
  <li>Severity and priority</li>
  <li>Evidence (screenshots, logs)</li>
</ul>
<div class="warning-box">⚠️ Severity = technical impact. Priority = urgency of fix. Independent dimensions.</div>`
    }
  },
  "6.1": {
    es: {
      title: "Soporte de herramientas al testing",
      chapterTag: "Cap. 6 · Herramientas",
      content: `
<h3>Herramientas de Testing</h3>
<p>Las herramientas de testing pueden soportar muchas actividades del proceso de prueba:</p>
<h3>Categorías de Herramientas</h3>
<table>
  <tr><th>Categoría</th><th>Ejemplos</th></tr>
  <tr><td>Gestión de pruebas</td><td>TestRail, Zephyr, Xray</td></tr>
  <tr><td>Análisis estático</td><td>SonarQube, ESLint, FindBugs</td></tr>
  <tr><td>Automatización de UI</td><td>Selenium, Playwright, Cypress</td></tr>
  <tr><td>Pruebas de API</td><td>Postman, RestAssured, SoapUI</td></tr>
  <tr><td>Pruebas de rendimiento</td><td>JMeter, Gatling, k6</td></tr>
  <tr><td>Pruebas unitarias</td><td>JUnit, pytest, NUnit</td></tr>
  <tr><td>CI/CD</td><td>Jenkins, GitHub Actions, GitLab CI</td></tr>
  <tr><td>Seguimiento de defectos</td><td>Jira, Bugzilla, Redmine</td></tr>
</table>
<h3>Beneficios de la Automatización</h3>
<ul>
  <li>Ejecución más rápida de pruebas de regresión</li>
  <li>Mayor consistencia y repetibilidad</li>
  <li>Cobertura ampliada (más pruebas en menos tiempo)</li>
  <li>Disponibilidad 24/7 (integración continua)</li>
  <li>Reducción del trabajo manual repetitivo</li>
</ul>
<h3>Riesgos de la Automatización</h3>
<ul>
  <li>Expectativas poco realistas sobre los beneficios</li>
  <li>Alto costo inicial de implementación</li>
  <li>Mantenimiento costoso de scripts (especialmente con UI cambiante)</li>
  <li>Falsa sensación de seguridad</li>
  <li>Dependencia de herramientas específicas</li>
</ul>
<div class="highlight-box">
💡 <strong>Consideraciones para adoptar herramientas:</strong>
<br>1. Evaluar la madurez del proceso existente
<br>2. Pilotar antes de adoptar masivamente
<br>3. Capacitar al equipo
<br>4. Establecer métricas de ROI claras
</div>`
    },
    en: {
      title: "Tool support for testing",
      chapterTag: "Ch. 6 · Tools",
      content: `
<h3>Testing Tool Categories</h3>
<table>
  <tr><th>Category</th><th>Examples</th></tr>
  <tr><td>Test management</td><td>TestRail, Zephyr</td></tr>
  <tr><td>Static analysis</td><td>SonarQube, ESLint</td></tr>
  <tr><td>UI automation</td><td>Selenium, Playwright, Cypress</td></tr>
  <tr><td>API testing</td><td>Postman, RestAssured</td></tr>
  <tr><td>Performance</td><td>JMeter, Gatling, k6</td></tr>
</table>
<h3>Benefits of Automation</h3>
<ul>
  <li>Faster regression test execution, greater consistency, extended coverage</li>
</ul>
<h3>Risks of Automation</h3>
<ul>
  <li>Unrealistic expectations, high initial cost, maintenance overhead, false sense of security</li>
</ul>`
    }
  },
  "4.2": {
    es: {
      title: "Técnicas de caja negra",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>¿Qué son las técnicas de caja negra?</h3>
<p>Las técnicas de caja negra (black-box) se basan en la especificación del objeto de prueba. No se accede al código fuente; solo se evalúan entradas y salidas.</p>

<h3>1. Partición de Equivalencia (EP)</h3>
<p>Divide los datos en particiones donde todos los valores se comportan de la misma manera. Se prueba un valor representativo de cada partición.</p>
<div class="example-box">
📌 <strong>Ejemplo:</strong> Un campo acepta edades de 18 a 65 años.
<br>• Partición válida: 18-65 (ej: probar con 30)
<br>• Partición inválida 1: menor a 18 (ej: probar con 10)
<br>• Partición inválida 2: mayor a 65 (ej: probar con 70)
</div>

<h3>2. Análisis de Valor Límite (BVA)</h3>
<p>Se enfoca en los valores en los límites de las particiones, donde es más probable que haya defectos.</p>
<div class="example-box">
📌 <strong>Ejemplo (BVA 2 valores):</strong> Para el rango 18-65:
<br>• Límites: 17, 18, 65, 66
<br><strong>Ejemplo (BVA 3 valores):</strong> 17, 18, 19, 64, 65, 66
</div>

<h3>3. Tablas de Decisión</h3>
<p>Se utilizan para probar sistemas con combinaciones de condiciones (reglas de negocio). Cada columna representa una combinación posible de condiciones y sus resultados.</p>
<div class="example-box">
📌 <strong>Estructura:</strong>
<br>Condiciones (filas superiores) × Acciones (filas inferiores) × Reglas (columnas)
</div>

<h3>4. Prueba de Transición de Estado</h3>
<p>Se usa cuando el comportamiento del sistema depende del estado actual y del evento recibido. Se modela como un diagrama de estados.</p>
<ul>
  <li><strong>Cobertura de todos los estados:</strong> cada estado se visita al menos una vez</li>
  <li><strong>Cobertura de transiciones válidas:</strong> todas las transiciones válidas se ejercitan</li>
  <li><strong>Cobertura de transiciones inválidas:</strong> se prueban transiciones que no deberían ser posibles</li>
</ul>
<div class="example-box">
📌 <strong>Ejemplo:</strong> Un cajero ATM: estados = "Esperando tarjeta", "Esperando PIN", "Menú principal", "Dispensando efectivo".
</div>

<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Debes poder calcular el número de casos de prueba con EP y BVA, e identificar qué técnica aplicar en un escenario dado.
</div>
      `
    },
    en: {
      title: "Black-box test techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Black-box Techniques</h3>
<p>Based on the specification of the test object, without accessing the source code.</p>
<h3>1. Equivalence Partitioning (EP)</h3>
<p>Divide data into partitions where all values behave the same. Test one representative value per partition.</p>
<h3>2. Boundary Value Analysis (BVA)</h3>
<p>Focus on values at the boundaries of partitions. BVA-2: min and max of each boundary. BVA-3: includes values just inside and outside.</p>
<h3>3. Decision Table Testing</h3>
<p>For systems with combinations of conditions. Each column is a rule (combination of conditions and their actions).</p>
<h3>4. State Transition Testing</h3>
<p>Used when system behavior depends on current state and received event. Modeled as state diagrams.</p>
      `
    }
  },

  /* ==================== 2.4 ==================== */
  "2.4": {
    es: {
      title: "Pruebas de mantenimiento",
      chapterTag: "Cap. 2 · SDLC",
      content: `
<h3>¿Qué son las pruebas de mantenimiento?</h3>
<p>Las <strong>pruebas de mantenimiento</strong> se realizan sobre un sistema ya operativo cuando se producen cambios, migraciones o retiradas del software. A diferencia de otros niveles de prueba, no se inician desde cero: el sistema ya existe y funciona en producción.</p>

<div class="highlight-box">
💡 <strong>Clave:</strong> Las pruebas de mantenimiento siempre tienen un <em>desencadenante</em> (trigger) que las activa: una modificación, una migración o una retirada del sistema.
</div>

<h3>Tipos de cambios que desencadenan pruebas de mantenimiento</h3>
<table>
  <tr><th>Tipo de cambio</th><th>Descripción</th><th>Ejemplo</th></tr>
  <tr><td><strong>Correctivo</strong></td><td>Corrección de defectos encontrados en producción</td><td>Fix de un bug reportado por un cliente</td></tr>
  <tr><td><strong>Adaptativo</strong></td><td>Adaptación a cambios en el entorno</td><td>Migrar de Java 8 a Java 17</td></tr>
  <tr><td><strong>Perfectivo</strong></td><td>Mejoras de rendimiento o usabilidad</td><td>Optimizar una consulta SQL lenta</td></tr>
  <tr><td><strong>Migración</strong></td><td>Mover datos o sistema a nueva plataforma</td><td>Migrar de base de datos on-premise a la nube</td></tr>
  <tr><td><strong>Retirada</strong></td><td>Retirar el sistema del servicio</td><td>Verificar que los datos migrados son correctos antes de apagar el sistema antiguo</td></tr>
</table>

<h3>Análisis de impacto (Impact Analysis)</h3>
<p>Antes de ejecutar pruebas de mantenimiento se realiza un <strong>análisis de impacto</strong> para:</p>
<ul>
  <li>Identificar qué partes del sistema pueden verse afectadas por el cambio</li>
  <li>Determinar el alcance de las pruebas de regresión necesarias</li>
  <li>Estimar el coste y riesgo del cambio</li>
</ul>

<div class="warning-box">
⚠️ <strong>Dificultad del análisis de impacto:</strong> Si la documentación del sistema está desactualizada o no existe, identificar las áreas afectadas se vuelve muy difícil. Esto aumenta el riesgo de que cambios aparentemente pequeños rompan funcionalidades inesperadas.
</div>

<h3>Pruebas de regresión en el mantenimiento</h3>
<p>Después de cualquier cambio se ejecutan pruebas de regresión para confirmar que las modificaciones no han introducido nuevos defectos en partes del sistema que antes funcionaban correctamente.</p>

<div class="example-box">
📌 <strong>Ejemplo real:</strong> Una empresa actualiza su módulo de cálculo de impuestos. El análisis de impacto identifica que los módulos de facturación, informes y exportación a contabilidad dependen de ese cálculo. Se ejecutan pruebas de regresión sobre esos tres módulos además de los tests específicos del nuevo cálculo.
</div>

<h3>Relación con la gestión de configuración</h3>
<p>Las pruebas de mantenimiento dependen de una buena gestión de configuración: necesitas saber exactamente qué versión del sistema está en producción y qué artefactos han cambiado para poder enfocar las pruebas correctamente.</p>

<div class="highlight-box">
💡 <strong>Para el examen:</strong> Recuerda los tres desencadenantes principales: <strong>modificación</strong>, <strong>migración</strong> y <strong>retirada</strong>. Y que el análisis de impacto precede siempre a las pruebas de mantenimiento.
</div>
      `
    },
    en: {
      title: "Maintenance testing",
      chapterTag: "Ch. 2 · SDLC",
      content: `
<h3>What is maintenance testing?</h3>
<p><strong>Maintenance testing</strong> is performed on an already operational system when changes, migrations or retirements occur. Unlike other test levels, it doesn't start from scratch: the system already exists and runs in production.</p>

<div class="highlight-box">
💡 <strong>Key point:</strong> Maintenance testing always has a <em>trigger</em>: a modification, migration or retirement of the system.
</div>

<h3>Types of changes that trigger maintenance testing</h3>
<table>
  <tr><th>Change type</th><th>Description</th><th>Example</th></tr>
  <tr><td><strong>Corrective</strong></td><td>Fixing defects found in production</td><td>Bug fix reported by a customer</td></tr>
  <tr><td><strong>Adaptive</strong></td><td>Adapting to environment changes</td><td>Migrating from Java 8 to Java 17</td></tr>
  <tr><td><strong>Perfective</strong></td><td>Performance or usability improvements</td><td>Optimizing a slow SQL query</td></tr>
  <tr><td><strong>Migration</strong></td><td>Moving data or system to a new platform</td><td>Migrating from on-premise to cloud database</td></tr>
  <tr><td><strong>Retirement</strong></td><td>Taking the system out of service</td><td>Verifying migrated data is correct before shutting down the old system</td></tr>
</table>

<h3>Impact Analysis</h3>
<p>Before executing maintenance tests, an <strong>impact analysis</strong> is performed to:</p>
<ul>
  <li>Identify which parts of the system may be affected by the change</li>
  <li>Determine the scope of regression testing needed</li>
  <li>Estimate the cost and risk of the change</li>
</ul>

<div class="warning-box">
⚠️ <strong>Impact analysis difficulty:</strong> If system documentation is outdated or missing, identifying affected areas becomes very difficult. This increases the risk that apparently small changes break unexpected functionality.
</div>

<h3>Regression testing in maintenance</h3>
<p>After any change, regression tests are executed to confirm that modifications haven't introduced new defects in parts of the system that previously worked correctly.</p>

<div class="example-box">
📌 <strong>Real example:</strong> A company updates its tax calculation module. Impact analysis identifies that the billing, reporting and accounting export modules depend on that calculation. Regression tests are run on those three modules in addition to specific tests for the new calculation.
</div>

<div class="highlight-box">
💡 <strong>For the exam:</strong> Remember the three main triggers: <strong>modification</strong>, <strong>migration</strong> and <strong>retirement</strong>. And that impact analysis always precedes maintenance testing.
</div>
      `
    }
  },

  /* ==================== 5.3 ==================== */
  "5.3": {
    es: {
      title: "Monitoreo, control y completitud de pruebas",
      chapterTag: "Cap. 5 · Gestión",
      content: `
<h3>Monitoreo del testing</h3>
<p>El <strong>monitoreo</strong> es la recopilación continua de información sobre el progreso de las pruebas para compararlo con lo planificado. Responde a la pregunta: <em>¿dónde estamos?</em></p>

<h3>Control del testing</h3>
<p>El <strong>control</strong> es la toma de acciones correctivas basadas en la información recopilada. Responde a: <em>¿qué hacemos con lo que sabemos?</em></p>

<div class="highlight-box">
💡 <strong>Diferencia clave:</strong> Monitoreo = observar y medir. Control = actuar sobre lo observado.
</div>

<h3>Métricas de prueba más utilizadas</h3>
<table>
  <tr><th>Métrica</th><th>Descripción</th></tr>
  <tr><td>Porcentaje de trabajo completado</td><td>Casos de prueba ejecutados / total planificados</td></tr>
  <tr><td>Cobertura de requisitos</td><td>% de requisitos cubiertos por al menos un test</td></tr>
  <tr><td>Densidad de defectos</td><td>Número de defectos por módulo o componente</td></tr>
  <tr><td>Defectos encontrados vs. cerrados</td><td>Tendencia de apertura/cierre de bugs</td></tr>
  <tr><td>Cobertura de código</td><td>% de código ejecutado por los tests</td></tr>
  <tr><td>Coste del testing</td><td>Coste real vs. coste planificado</td></tr>
</table>

<h3>Informes de prueba (Test reports)</h3>
<p>El equipo de testing comunica su progreso mediante informes. Existen dos tipos principales:</p>
<ul>
  <li><strong>Informe de progreso de pruebas (Test progress report):</strong> Se genera periódicamente durante la ejecución. Incluye estado actual, avance, defectos encontrados y desviaciones del plan.</li>
  <li><strong>Informe de completitud de pruebas (Test completion report):</strong> Se genera al finalizar una fase de testing. Resume los resultados, lecciones aprendidas y recomendaciones para el futuro.</li>
</ul>

<h3>Criterios de entrada y salida (Entry/Exit criteria)</h3>
<p>Los <strong>criterios de entrada</strong> (también llamados Definition of Ready) definen las condiciones que deben cumplirse antes de iniciar una actividad de testing:</p>
<ul>
  <li>Entorno de prueba disponible y configurado</li>
  <li>Datos de prueba preparados</li>
  <li>Código del objeto de prueba disponible y estable</li>
</ul>
<p>Los <strong>criterios de salida</strong> (también llamados Definition of Done) definen cuándo el testing está suficientemente completo:</p>
<ul>
  <li>Porcentaje mínimo de casos de prueba ejecutados</li>
  <li>Número máximo de defectos abiertos por severidad</li>
  <li>Cobertura mínima de requisitos o código alcanzada</li>
</ul>

<div class="warning-box">
⚠️ <strong>Para el examen:</strong> En contextos ágiles, los criterios de entrada/salida suelen llamarse <em>Definition of Ready</em> y <em>Definition of Done</em> respectivamente.
</div>

<div class="example-box">
📌 <strong>Ejemplo de acción de control:</strong> El monitoreo detecta que solo se han ejecutado el 40% de los casos de prueba cuando debería ser el 70%. El control puede implicar: reasignar testers, reducir alcance, negociar fecha de entrega o priorizar las pruebas de mayor riesgo.
</div>

<h3>Gestión de completitud de pruebas</h3>
<p>Al cierre de una fase o proyecto de testing se realizan las siguientes actividades:</p>
<ul>
  <li>Verificar que todos los defectos están cerrados o aceptados como riesgo conocido</li>
  <li>Entregar el testware al equipo de mantenimiento</li>
  <li>Analizar lecciones aprendidas para mejorar futuros proyectos</li>
  <li>Archivar resultados, logs y evidencias de prueba</li>
</ul>
      `
    },
    en: {
      title: "Test monitoring, control and completion",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>Test monitoring</h3>
<p><strong>Test monitoring</strong> is the ongoing collection of information about testing progress to compare it against the plan. It answers: <em>where are we?</em></p>

<h3>Test control</h3>
<p><strong>Test control</strong> is taking corrective actions based on collected information. It answers: <em>what do we do with what we know?</em></p>

<div class="highlight-box">
💡 <strong>Key difference:</strong> Monitoring = observe and measure. Control = act on what was observed.
</div>

<h3>Commonly used test metrics</h3>
<table>
  <tr><th>Metric</th><th>Description</th></tr>
  <tr><td>Percentage of work completed</td><td>Test cases executed / total planned</td></tr>
  <tr><td>Requirements coverage</td><td>% of requirements covered by at least one test</td></tr>
  <tr><td>Defect density</td><td>Number of defects per module or component</td></tr>
  <tr><td>Defects found vs. closed</td><td>Bug opening/closing trend</td></tr>
  <tr><td>Code coverage</td><td>% of code executed by tests</td></tr>
  <tr><td>Testing cost</td><td>Actual cost vs. planned cost</td></tr>
</table>

<h3>Test reports</h3>
<p>Two main types:</p>
<ul>
  <li><strong>Test progress report:</strong> Generated periodically during execution. Includes current status, progress, defects found and plan deviations.</li>
  <li><strong>Test completion report:</strong> Generated at the end of a testing phase. Summarizes results, lessons learned and future recommendations.</li>
</ul>

<h3>Entry and Exit criteria</h3>
<p><strong>Entry criteria</strong> (Definition of Ready) define conditions that must be met before starting a testing activity.</p>
<p><strong>Exit criteria</strong> (Definition of Done) define when testing is sufficiently complete.</p>

<div class="warning-box">
⚠️ <strong>For the exam:</strong> In agile contexts, entry/exit criteria are often called <em>Definition of Ready</em> and <em>Definition of Done</em> respectively.
</div>

<div class="example-box">
📌 <strong>Control action example:</strong> Monitoring detects only 40% of test cases executed when 70% was expected. Control may involve: reassigning testers, reducing scope, negotiating delivery date or prioritizing highest-risk tests.
</div>
      `
    }
  },

  /* ==================== 5.4 ==================== */
  "5.4": {
    es: {
      title: "Gestión de la configuración",
      chapterTag: "Cap. 5 · Gestión",
      content: `
<h3>¿Qué es la gestión de la configuración?</h3>
<p>La <strong>gestión de la configuración (CM)</strong> es una disciplina que proporciona control sobre los artefactos de software y testware a lo largo del proyecto. Su objetivo es mantener la integridad y trazabilidad de todos los elementos del proyecto.</p>

<div class="highlight-box">
💡 <strong>Analogía:</strong> La gestión de la configuración es como el control de versiones de todo el proyecto — no solo del código, sino también de los casos de prueba, entornos, documentos y cualquier otro artefacto.
</div>

<h3>Elementos bajo control de configuración (Configuration Items)</h3>
<p>Cualquier artefacto que necesita ser identificado, controlado y rastreado se denomina <strong>ítem de configuración</strong>:</p>
<ul>
  <li>Código fuente y ejecutables</li>
  <li>Casos de prueba y scripts de prueba</li>
  <li>Datos de prueba</li>
  <li>Entornos de prueba (configuración de servidores, bases de datos)</li>
  <li>Documentación (requisitos, planes de prueba, informes)</li>
  <li>Herramientas y sus configuraciones</li>
</ul>

<h3>Actividades principales de la gestión de la configuración</h3>
<table>
  <tr><th>Actividad</th><th>Descripción</th></tr>
  <tr><td><strong>Identificación</strong></td><td>Asignar un identificador único a cada ítem de configuración</td></tr>
  <tr><td><strong>Control de versiones</strong></td><td>Registrar todos los cambios y poder recuperar versiones anteriores</td></tr>
  <tr><td><strong>Auditoría de configuración</strong></td><td>Verificar que los ítems son consistentes entre sí</td></tr>
  <tr><td><strong>Reporting de estado</strong></td><td>Informar sobre el estado y historial de cambios de los ítems</td></tr>
</table>

<h3>Relación con el testing</h3>
<p>La gestión de la configuración es fundamental para el testing porque:</p>
<ul>
  <li>Garantiza que los testers prueban la versión correcta del software</li>
  <li>Permite reproducir defectos en el entorno exacto donde ocurrieron</li>
  <li>Facilita la trazabilidad entre requisitos, código y casos de prueba</li>
  <li>Asegura que los entornos de prueba son consistentes y repetibles</li>
</ul>

<div class="example-box">
📌 <strong>Ejemplo:</strong> Sin gestión de configuración, un tester podría reportar un bug en la versión 2.1 del sistema, pero el desarrollador lo busca en la versión 2.3. El defecto "desaparece" porque el código cambió. Con CM, ambos trabajan sobre el mismo ítem identificado.
</div>

<h3>Herramientas de gestión de configuración</h3>
<p>Las herramientas más comunes en la industria son:</p>
<ul>
  <li><strong>Control de versiones de código:</strong> Git, SVN</li>
  <li><strong>Gestión de entornos:</strong> Docker, Ansible, Terraform</li>
  <li><strong>Gestión de artefactos:</strong> Nexus, Artifactory</li>
  <li><strong>Gestión de configuración de pruebas:</strong> TestRail, Xray (integrados con Jira)</li>
</ul>

<div class="warning-box">
⚠️ <strong>Para el examen:</strong> La gestión de la configuración apoya al testing asegurando que todos los artefactos están identificados, versionados y son reproducibles. Recuerda que incluye <em>testware</em> (casos de prueba, datos, entornos) además del código.
</div>

<h3>Línea base (Baseline)</h3>
<p>Una <strong>línea base</strong> es una instantánea aprobada y verificada de un conjunto de ítems de configuración en un momento determinado. Solo puede modificarse mediante un proceso formal de control de cambios.</p>
<p>Ejemplo: la línea base de la versión 1.0 incluye el código, los casos de prueba ejecutados y los informes de prueba de ese release.</p>
      `
    },
    en: {
      title: "Configuration management",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>What is configuration management?</h3>
<p><strong>Configuration management (CM)</strong> is a discipline that provides control over software and testware artifacts throughout the project. Its goal is to maintain the integrity and traceability of all project elements.</p>

<div class="highlight-box">
💡 <strong>Analogy:</strong> Configuration management is like version control for the entire project — not just code, but also test cases, environments, documents and any other artifacts.
</div>

<h3>Configuration Items</h3>
<p>Any artifact that needs to be identified, controlled and tracked is called a <strong>configuration item</strong>:</p>
<ul>
  <li>Source code and executables</li>
  <li>Test cases and test scripts</li>
  <li>Test data</li>
  <li>Test environments (server and database configurations)</li>
  <li>Documentation (requirements, test plans, reports)</li>
  <li>Tools and their configurations</li>
</ul>

<h3>Main CM activities</h3>
<table>
  <tr><th>Activity</th><th>Description</th></tr>
  <tr><td><strong>Identification</strong></td><td>Assign a unique identifier to each configuration item</td></tr>
  <tr><td><strong>Version control</strong></td><td>Record all changes and be able to retrieve previous versions</td></tr>
  <tr><td><strong>Configuration audit</strong></td><td>Verify that items are consistent with each other</td></tr>
  <tr><td><strong>Status reporting</strong></td><td>Report on the status and change history of items</td></tr>
</table>

<h3>Relationship with testing</h3>
<p>Configuration management is fundamental for testing because:</p>
<ul>
  <li>Ensures testers test the correct version of the software</li>
  <li>Allows reproducing defects in the exact environment where they occurred</li>
  <li>Facilitates traceability between requirements, code and test cases</li>
  <li>Ensures test environments are consistent and repeatable</li>
</ul>

<div class="example-box">
📌 <strong>Example:</strong> Without CM, a tester might report a bug in version 2.1, but the developer looks for it in version 2.3. The defect "disappears" because the code changed. With CM, both work on the same identified item.
</div>

<div class="warning-box">
⚠️ <strong>For the exam:</strong> CM supports testing by ensuring all artifacts are identified, versioned and reproducible. Remember it includes <em>testware</em> (test cases, data, environments) in addition to code.
</div>

<h3>Baseline</h3>
<p>A <strong>baseline</strong> is an approved and verified snapshot of a set of configuration items at a specific point in time. It can only be modified through a formal change control process.</p>
      `
    }
  }
};

/* ===================================================
   FLASHCARDS
   =================================================== */
const FLASHCARDS = [
  // Chapter 1
  { id: 1, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Cuál es la diferencia entre un ERROR, un DEFECTO y un FALLO?", en: "What is the difference between an ERROR, a DEFECT, and a FAILURE?" },
    a: { es: "Error: acción humana incorrecta. Defecto (bug): resultado de ese error en el código. Fallo: comportamiento incorrecto del sistema al ejecutarse el defecto.", en: "Error: incorrect human action. Defect (bug): result of that error in the code. Failure: incorrect system behavior when the defect is executed." }
  },
  { id: 2, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Qué dice el Principio 1 del testing?", en: "What does Testing Principle 1 state?" },
    a: { es: "El testing muestra la PRESENCIA de defectos, no su AUSENCIA. No se puede probar que el software no tiene defectos.", en: "Testing shows the PRESENCE of defects, not their ABSENCE. You cannot prove software has no defects." }
  },
  { id: 3, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Qué es la 'Paradoja del Pesticida'?", en: "What is the 'Pesticide Paradox'?" },
    a: { es: "Principio 5: Si se repiten las mismas pruebas, eventualmente dejarán de encontrar nuevos defectos. Los tests deben actualizarse y revisarse periódicamente.", en: "Principle 5: If the same tests are repeated, they will eventually stop finding new defects. Tests must be updated and revised periodically." }
  },
  { id: 4, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Cuál es la diferencia entre VERIFICACIÓN y VALIDACIÓN?", en: "What is the difference between VERIFICATION and VALIDATION?" },
    a: { es: "Verificación: ¿Estamos construyendo el producto CORRECTAMENTE? (cumple especificaciones). Validación: ¿Estamos construyendo el producto CORRECTO? (satisface necesidades reales).", en: "Verification: Are we building the product CORRECTLY? (meets specs). Validation: Are we building the RIGHT product? (meets real needs)." }
  },
  { id: 5, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Qué es el 'testing exhaustivo' y por qué es imposible?", en: "What is 'exhaustive testing' and why is it impossible?" },
    a: { es: "Testing exhaustivo = probar todas las combinaciones de entradas. Es imposible porque el número de combinaciones es astronomicamente grande para cualquier software no trivial. (Principio 2)", en: "Exhaustive testing = testing all input combinations. Impossible because the number of combinations is astronomically large for any non-trivial software. (Principle 2)" }
  },
  { id: 6, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Qué significa 'Shift-Left' en testing?", en: "What does 'Shift-Left' mean in testing?" },
    a: { es: "Iniciar el testing lo antes posible en el SDLC, incluyendo revisión de requisitos y diseño antes de que exista código. Reduce costos y detecta defectos temprano (Principio 3).", en: "Starting testing as early as possible in the SDLC, including reviewing requirements and design before code exists. Reduces costs and detects defects early (Principle 3)." }
  },
  { id: 7, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Qué es la 'Falacia de Ausencia de Defectos'?", en: "What is the 'Absence-of-Defects Fallacy'?" },
    a: { es: "Principio 7: Asumir que encontrar y corregir todos los defectos garantiza el éxito. Error: el sistema puede estar libre de defectos pero ser inútil si no satisface las necesidades del usuario.", en: "Principle 7: Assuming that finding and fixing all defects guarantees success. Wrong: the system can be defect-free but useless if it doesn't meet user needs." }
  },
  { id: 8, chapter: 0, chapterTag: { es: "Cap. 1 · Fundamentos", en: "Ch. 1 · Fundamentals" },
    q: { es: "¿Cuáles son los dos roles principales en el proceso de testing?", en: "What are the two main roles in the testing process?" },
    a: { es: "1. Test Manager: planifica, monitorea y gestiona el proceso de prueba. 2. Tester: analiza, diseña, implementa y ejecuta las pruebas.", en: "1. Test Manager: plans, monitors and manages the test process. 2. Tester: analyzes, designs, implements and executes tests." }
  },
  // Chapter 2
  { id: 9, chapter: 1, chapterTag: { es: "Cap. 2 · SDLC", en: "Ch. 2 · SDLC" },
    q: { es: "¿Cuáles son los 4 niveles de prueba del ISTQB?", en: "What are the 4 ISTQB test levels?" },
    a: { es: "1. Prueba de Componente (Unitaria), 2. Prueba de Integración de Componentes, 3. Prueba de Sistema, 4. Prueba de Aceptación (UAT).", en: "1. Component (Unit) Testing, 2. Component Integration Testing, 3. System Testing, 4. Acceptance Testing (UAT)." }
  },
  { id: 10, chapter: 1, chapterTag: { es: "Cap. 2 · SDLC", en: "Ch. 2 · SDLC" },
    q: { es: "¿Qué es el testing funcional vs. no funcional?", en: "What is functional vs. non-functional testing?" },
    a: { es: "Funcional: verifica QUÉ hace el sistema (comportamiento). No funcional: verifica CÓMO se comporta el sistema (rendimiento, usabilidad, seguridad, fiabilidad).", en: "Functional: verifies WHAT the system does (behavior). Non-functional: verifies HOW the system behaves (performance, usability, security, reliability)." }
  },
  { id: 11, chapter: 1, chapterTag: { es: "Cap. 2 · SDLC", en: "Ch. 2 · SDLC" },
    q: { es: "¿Qué es el testing de regresión y por qué es importante?", en: "What is regression testing and why is it important?" },
    a: { es: "Pruebas que verifican que los cambios en el código no han introducido nuevos defectos en partes que antes funcionaban correctamente. Fundamental en el mantenimiento y las integraciones continuas.", en: "Tests that verify that code changes have not introduced new defects in parts that previously worked correctly. Fundamental in maintenance and continuous integration." }
  },
  { id: 12, chapter: 1, chapterTag: { es: "Cap. 2 · SDLC", en: "Ch. 2 · SDLC" },
    q: { es: "¿Cuál es la diferencia entre testing Alpha y Beta?", en: "What is the difference between Alpha and Beta testing?" },
    a: { es: "Alpha: realizado por usuarios en el sitio del desarrollador, antes de la entrega al cliente. Beta: realizado por usuarios en su propio entorno, antes del lanzamiento general.", en: "Alpha: performed by users at the developer's site, before delivery to the customer. Beta: performed by users in their own environment, before general release." }
  },
  // Chapter 3
  { id: 13, chapter: 2, chapterTag: { es: "Cap. 3 · Testing Estático", en: "Ch. 3 · Static Testing" },
    q: { es: "¿Qué es el testing estático y cómo difiere del dinámico?", en: "What is static testing and how does it differ from dynamic?" },
    a: { es: "Estático: evalúa artefactos SIN ejecutar el software (revisiones de código, análisis estático). Dinámico: ejecuta el software para verificar su comportamiento.", en: "Static: evaluates artifacts WITHOUT executing software (code reviews, static analysis). Dynamic: executes software to verify its behavior." }
  },
  { id: 14, chapter: 2, chapterTag: { es: "Cap. 3 · Testing Estático", en: "Ch. 3 · Static Testing" },
    q: { es: "¿Cuáles son los tipos de revisión formales en el testing estático?", en: "What are the types of formal reviews in static testing?" },
    a: { es: "1. Revisión informal, 2. Walkthrough (guiado por el autor), 3. Revisión técnica (equipo de pares), 4. Inspección (más formal, con roles definidos y métricas).", en: "1. Informal review, 2. Walkthrough (author-led), 3. Technical review (peer team), 4. Inspection (most formal, with defined roles and metrics)." }
  },
  { id: 15, chapter: 2, chapterTag: { es: "Cap. 3 · Testing Estático", en: "Ch. 3 · Static Testing" },
    q: { es: "¿Qué tipos de defectos detecta mejor el testing estático?", en: "What types of defects does static testing best detect?" },
    a: { es: "Ambigüedades en requisitos, violaciones de estándares de codificación, defectos de diseño, interfaces incorrectas, vulnerabilidades de seguridad, y brechas en la cobertura de pruebas.", en: "Requirement ambiguities, coding standard violations, design defects, incorrect interfaces, security vulnerabilities, and test coverage gaps." }
  },
  // Chapter 4
  { id: 16, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Qué es la Partición de Equivalencia (EP)?", en: "What is Equivalence Partitioning (EP)?" },
    a: { es: "Técnica de caja negra que divide los datos de entrada en particiones donde todos los valores se comportan igual. Se prueba un valor representativo de cada partición (válida e inválida).", en: "Black-box technique that divides input data into partitions where all values behave the same. Test one representative value per partition (valid and invalid)." }
  },
  { id: 17, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Qué es el Análisis de Valor Límite (BVA)?", en: "What is Boundary Value Analysis (BVA)?" },
    a: { es: "Técnica de caja negra que prueba los valores en los BORDES de las particiones. BVA-2: mínimo y máximo de cada borde. BVA-3: también incluye los valores inmediatamente adyacentes.", en: "Black-box technique testing values at the EDGES of partitions. BVA-2: min and max of each boundary. BVA-3: also includes immediately adjacent values." }
  },
  { id: 18, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Para qué se usan las Tablas de Decisión?", en: "When are Decision Tables used?" },
    a: { es: "Para probar combinaciones de condiciones (lógica de negocio compleja). Cada columna es una 'regla' que combina condiciones con resultados. Número de reglas = 2^n (n = número de condiciones).", en: "For testing combinations of conditions (complex business logic). Each column is a 'rule' combining conditions with outcomes. Number of rules = 2^n (n = number of conditions)." }
  },
  { id: 19, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Qué es la prueba de Transición de Estado?", en: "What is State Transition Testing?" },
    a: { es: "Técnica de caja negra para sistemas con estados. El comportamiento depende del estado actual y del evento recibido. Se modela con diagramas de estado y tablas de transición.", en: "Black-box technique for systems with states. Behavior depends on current state and received event. Modeled with state diagrams and transition tables." }
  },
  { id: 20, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Qué cubren las pruebas de SENTENCIA y de RAMA?", en: "What do STATEMENT and BRANCH coverage cover?" },
    a: { es: "Sentencia (Statement): % de sentencias ejecutables ejecutadas. Rama (Branch): % de ramas del código ejecutadas (incluyendo verdadero/falso). Branch coverage es más fuerte que statement coverage.", en: "Statement: % of executable statements executed. Branch: % of code branches executed (including true/false). Branch coverage is stronger than statement coverage." }
  },
  { id: 21, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Qué es el Testing Exploratorio?", en: "What is Exploratory Testing?" },
    a: { es: "Técnica basada en experiencia donde el tester diseña y ejecuta pruebas simultáneamente, aprendiendo del sistema a medida que avanza. Útil para encontrar defectos que las pruebas formales no detectan.", en: "Experience-based technique where the tester simultaneously designs and executes tests, learning from the system as they go. Useful for finding defects that formal tests miss." }
  },
  { id: 22, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Qué es ATDD (Acceptance Test-Driven Development)?", en: "What is ATDD (Acceptance Test-Driven Development)?" },
    a: { es: "Técnica colaborativa donde los casos de prueba de aceptación se crean ANTES del desarrollo, con la participación de desarrolladores, testers y stakeholders. Los tests guían el desarrollo.", en: "Collaborative technique where acceptance test cases are created BEFORE development, with participation of developers, testers and stakeholders. Tests drive development." }
  },
  // Chapter 5
  { id: 23, chapter: 4, chapterTag: { es: "Cap. 5 · Gestión", en: "Ch. 5 · Management" },
    q: { es: "¿Qué es el Riesgo de Producto vs. Riesgo de Proyecto?", en: "What is Product Risk vs. Project Risk?" },
    a: { es: "Riesgo de producto: posibilidad de que el producto no cumpla su función (defectos funcionales, problemas de rendimiento). Riesgo de proyecto: posibilidad de que el proyecto no logre sus objetivos (presupuesto, plazos, recursos).", en: "Product risk: possibility that the product won't fulfill its function (functional defects, performance issues). Project risk: possibility that the project won't achieve its objectives (budget, timelines, resources)." }
  },
  { id: 24, chapter: 4, chapterTag: { es: "Cap. 5 · Gestión", en: "Ch. 5 · Management" },
    q: { es: "¿Qué son los criterios de entrada y salida en testing?", en: "What are entry and exit criteria in testing?" },
    a: { es: "Entrada (Entry): condiciones que deben cumplirse para iniciar una fase de prueba (ej: el código está compilado). Salida (Exit): condiciones para completar la fase (ej: 90% de casos pasados, todos los críticos).", en: "Entry criteria: conditions that must be met to start a test phase (e.g., code is compiled). Exit criteria: conditions to complete the phase (e.g., 90% tests passed, all critical ones)." }
  },
  { id: 25, chapter: 4, chapterTag: { es: "Cap. 5 · Gestión", en: "Ch. 5 · Management" },
    q: { es: "¿Qué información debe incluir un informe de defecto?", en: "What information should a defect report include?" },
    a: { es: "ID, título, descripción, pasos para reproducir, resultado esperado, resultado actual, severidad, prioridad, entorno, versión del software, y evidencia (capturas, logs).", en: "ID, title, description, steps to reproduce, expected result, actual result, severity, priority, environment, software version, and evidence (screenshots, logs)." }
  },
  { id: 26, chapter: 4, chapterTag: { es: "Cap. 5 · Gestión", en: "Ch. 5 · Management" },
    q: { es: "¿Cuál es la diferencia entre SEVERIDAD y PRIORIDAD en un defecto?", en: "What is the difference between SEVERITY and PRIORITY in a defect?" },
    a: { es: "Severidad: impacto técnico del defecto (cuánto daño hace al sistema). Prioridad: urgencia de la corrección (cuándo debe corregirse). Un defecto puede ser de alta severidad pero baja prioridad y viceversa.", en: "Severity: technical impact of the defect (how much damage it does to the system). Priority: urgency of the fix (when it must be fixed). A defect can have high severity but low priority and vice versa." }
  },
  // Chapter 6
  { id: 27, chapter: 5, chapterTag: { es: "Cap. 6 · Herramientas", en: "Ch. 6 · Tools" },
    q: { es: "¿Cuáles son los beneficios del testing automatizado?", en: "What are the benefits of automated testing?" },
    a: { es: "Reducción del trabajo manual repetitivo, mayor consistencia, ejecución más rápida de regresión, mayor cobertura, disponibilidad 24/7, y liberación de testers para tareas de mayor valor.", en: "Reduction of repetitive manual work, greater consistency, faster regression execution, more coverage, 24/7 availability, and freeing testers for higher-value tasks." }
  },
  { id: 28, chapter: 5, chapterTag: { es: "Cap. 6 · Herramientas", en: "Ch. 6 · Tools" },
    q: { es: "¿Cuáles son los riesgos de la automatización de pruebas?", en: "What are the risks of test automation?" },
    a: { es: "Expectativas poco realistas, mantenimiento de scripts costoso, falsa sensación de seguridad, costo inicial alto, dependencia de herramientas específicas, y dificultad en pruebas exploratorias y visuales.", en: "Unrealistic expectations, costly script maintenance, false sense of security, high initial cost, tool dependency, and difficulty with exploratory and visual testing." }
  }
];

/* ===================================================
   GLOSSARY
   =================================================== */
const GLOSSARY = [
  { term: "Testing / Prueba", def: { es: "Conjunto de actividades para descubrir defectos y evaluar la calidad de artefactos de software.", en: "Set of activities to discover defects and evaluate the quality of software artifacts." }, chapter: "1" },
  { term: "Defecto / Bug / Fault", def: { es: "Imperfección en un componente o sistema que puede causar que el componente o sistema falle en realizar su función requerida.", en: "Imperfection in a component or system that can cause it to fail to perform its required function." }, chapter: "1" },
  { term: "Error / Mistake", def: { es: "Acción humana que produce un resultado incorrecto, que introduce un defecto en el sistema.", en: "Human action that produces an incorrect result, introducing a defect into the system." }, chapter: "1" },
  { term: "Fallo / Failure", def: { es: "Evento en el cual un componente o sistema no realiza una función requerida dentro de los límites especificados.", en: "Event in which a component or system does not perform a required function within specified limits." }, chapter: "1" },
  { term: "Causa raíz / Root cause", def: { es: "Razón fundamental por la que ocurre un problema. La eliminación de la causa raíz evita la recurrencia del defecto.", en: "Fundamental reason why a problem occurs. Removing the root cause prevents defect recurrence." }, chapter: "1" },
  { term: "Calidad / Quality", def: { es: "Grado en el que un componente o sistema satisface las necesidades indicadas e implícitas de sus partes interesadas.", en: "Degree to which a component or system satisfies the stated and implied needs of its stakeholders." }, chapter: "1" },
  { term: "Aseguramiento de calidad / QA", def: { es: "Actividades que se centran en proporcionar confianza en que los requisitos de calidad se cumplirán.", en: "Activities focused on providing confidence that quality requirements will be fulfilled." }, chapter: "1" },
  { term: "Verificación / Verification", def: { es: "Confirmación de que el software cumple con los requisitos especificados.", en: "Confirmation that software meets specified requirements." }, chapter: "1" },
  { term: "Validación / Validation", def: { es: "Confirmación de que el software satisface las necesidades y expectativas del usuario o cliente.", en: "Confirmation that software satisfies the needs and expectations of the user or customer." }, chapter: "1" },
  { term: "Testware", def: { es: "Artefactos producidos durante el proceso de prueba: planes, casos, scripts, datos, informes.", en: "Artifacts produced during the test process: plans, cases, scripts, data, reports." }, chapter: "1" },
  { term: "Trazabilidad / Traceability", def: { es: "Capacidad de identificar relaciones entre productos de trabajo de testing y requisitos u otros artefactos.", en: "Ability to identify relationships between test work products and requirements or other artifacts." }, chapter: "1" },
  { term: "Prueba de componente / Unit test", def: { es: "Nivel de prueba que verifica componentes individuales del software en aislamiento.", en: "Test level that verifies individual software components in isolation." }, chapter: "2" },
  { term: "Prueba de integración / Integration test", def: { es: "Nivel de prueba que verifica la interacción entre componentes o sistemas integrados.", en: "Test level that verifies the interaction between integrated components or systems." }, chapter: "2" },
  { term: "Prueba de sistema / System test", def: { es: "Nivel de prueba que verifica el comportamiento del sistema completo de extremo a extremo.", en: "Test level that verifies the behavior of the complete system end-to-end." }, chapter: "2" },
  { term: "Prueba de aceptación / UAT", def: { es: "Nivel de prueba realizado para determinar si el sistema cumple con los criterios de aceptación del negocio.", en: "Test level performed to determine if the system meets business acceptance criteria." }, chapter: "2" },
  { term: "Testing funcional", def: { es: "Pruebas que verifican lo que el sistema HACE, basadas en las funciones requeridas.", en: "Tests that verify what the system DOES, based on required functions." }, chapter: "2" },
  { term: "Testing no funcional", def: { es: "Pruebas que verifican cómo se comporta el sistema (rendimiento, usabilidad, seguridad, fiabilidad).", en: "Tests that verify how the system behaves (performance, usability, security, reliability)." }, chapter: "2" },
  { term: "Testing de regresión", def: { es: "Pruebas que verifican que los cambios no han introducido nuevos defectos en áreas que funcionaban correctamente.", en: "Tests that verify changes haven't introduced new defects in areas that previously worked correctly." }, chapter: "2" },
  { term: "Testing de humo / Smoke test", def: { es: "Conjunto básico de pruebas que verifican las funcionalidades más críticas para confirmar que el sistema puede ser probado más a fondo.", en: "Basic set of tests verifying the most critical functionalities to confirm the system can be further tested." }, chapter: "2" },
  { term: "Alpha testing", def: { es: "Prueba de aceptación realizada por usuarios en el sitio del desarrollador.", en: "Acceptance testing performed by users at the developer's site." }, chapter: "2" },
  { term: "Beta testing", def: { es: "Prueba de aceptación realizada por usuarios en su propio entorno antes del lanzamiento general.", en: "Acceptance testing performed by users in their own environment before general release." }, chapter: "2" },
  { term: "Revisión / Review", def: { es: "Proceso estático que evalúa los productos de trabajo de software para encontrar defectos antes de la ejecución.", en: "Static process evaluating software work products to find defects before execution." }, chapter: "3" },
  { term: "Inspección / Inspection", def: { es: "Tipo más formal de revisión estática, con roles definidos, métricas y criterios de entrada/salida.", en: "Most formal type of static review, with defined roles, metrics and entry/exit criteria." }, chapter: "3" },
  { term: "Walkthrough", def: { es: "Tipo de revisión guiada por el autor, donde el equipo sigue la lógica del producto paso a paso.", en: "Review type guided by the author, where the team follows the product logic step by step." }, chapter: "3" },
  { term: "Análisis estático / Static analysis", def: { es: "Evaluación automatizada del código sin ejecutarlo, para detectar defectos de código y violaciones de estándares.", en: "Automated evaluation of code without executing it, to detect code defects and standard violations." }, chapter: "3" },
  { term: "Partición de equivalencia / EP", def: { es: "Técnica de caja negra que divide las entradas en particiones donde todos los valores se comportan igual.", en: "Black-box technique dividing inputs into partitions where all values behave the same." }, chapter: "4" },
  { term: "Análisis de valor límite / BVA", def: { es: "Técnica de caja negra que prueba los valores en los bordes de las particiones de equivalencia.", en: "Black-box technique testing values at the edges of equivalence partitions." }, chapter: "4" },
  { term: "Tabla de decisión / Decision table", def: { es: "Técnica de caja negra para probar combinaciones de condiciones lógicas y sus acciones resultantes.", en: "Black-box technique for testing combinations of logical conditions and their resulting actions." }, chapter: "4" },
  { term: "Transición de estado / State transition", def: { es: "Técnica de caja negra para probar sistemas cuyo comportamiento depende del estado actual y del evento recibido.", en: "Black-box technique for testing systems whose behavior depends on the current state and received event." }, chapter: "4" },
  { term: "Prueba de sentencia / Statement coverage", def: { es: "Técnica de caja blanca que mide el porcentaje de sentencias ejecutables ejecutadas por los tests.", en: "White-box technique measuring the percentage of executable statements executed by tests." }, chapter: "4" },
  { term: "Prueba de rama / Branch coverage", def: { es: "Técnica de caja blanca que mide el porcentaje de ramas del flujo de control ejecutadas (más fuerte que statement coverage).", en: "White-box technique measuring the percentage of control flow branches executed (stronger than statement coverage)." }, chapter: "4" },
  { term: "Testing exploratorio", def: { es: "Técnica basada en experiencia donde el diseño y la ejecución de pruebas ocurren simultáneamente, sin scripts predefinidos.", en: "Experience-based technique where test design and execution happen simultaneously, without predefined scripts." }, chapter: "4" },
  { term: "Error guessing / Adivinanza de errores", def: { es: "Técnica basada en experiencia donde el tester usa intuición y experiencia para anticipar tipos de errores comunes.", en: "Experience-based technique where the tester uses intuition and experience to anticipate common error types." }, chapter: "4" },
  { term: "ATDD", def: { es: "Acceptance Test-Driven Development: técnica donde los tests de aceptación se crean antes del desarrollo con participación de todo el equipo.", en: "Acceptance Test-Driven Development: technique where acceptance tests are created before development with full team participation." }, chapter: "4" },
  { term: "Plan de pruebas / Test plan", def: { es: "Documento que describe el enfoque, recursos, alcance, criterios y actividades de testing para un proyecto.", en: "Document describing the testing approach, resources, scope, criteria and activities for a project." }, chapter: "5" },
  { term: "Riesgo de producto / Product risk", def: { es: "Posibilidad de que el producto de software no cumpla con su función esperada o los requisitos de calidad.", en: "Possibility that the software product won't fulfill its expected function or quality requirements." }, chapter: "5" },
  { term: "Riesgo de proyecto / Project risk", def: { es: "Posibilidad de que el proyecto no logre sus objetivos de alcance, tiempo o presupuesto.", en: "Possibility that the project won't achieve its scope, time or budget objectives." }, chapter: "5" },
  { term: "Criterios de entrada / Entry criteria", def: { es: "Condiciones que deben cumplirse para iniciar una actividad de testing.", en: "Conditions that must be met to start a testing activity." }, chapter: "5" },
  { term: "Criterios de salida / Exit criteria", def: { es: "Condiciones que deben cumplirse para completar una actividad de testing.", en: "Conditions that must be met to complete a testing activity." }, chapter: "5" },
  { term: "Métricas de prueba / Test metrics", def: { es: "Medidas cuantitativas usadas para gestionar y controlar el proceso de testing (cobertura, densidad de defectos, etc.).", en: "Quantitative measures used to manage and control the test process (coverage, defect density, etc.)." }, chapter: "5" },
  { term: "Gestión de configuración / Config management", def: { es: "Disciplina para controlar y registrar la evolución de los artefactos de software y testware a lo largo del proyecto.", en: "Discipline for controlling and recording the evolution of software and testware artifacts throughout the project." }, chapter: "5" },
  { term: "Severidad / Severity", def: { es: "Grado de impacto técnico que tiene un defecto sobre el sistema.", en: "Degree of technical impact a defect has on the system." }, chapter: "5" },
  { term: "Prioridad / Priority", def: { es: "Urgencia con la que debe corregirse un defecto.", en: "Urgency with which a defect must be fixed." }, chapter: "5" },
  { term: "Gestión de defectos / Defect management", def: { es: "Proceso de capturar, investigar, resolver y cerrar los defectos encontrados durante el testing.", en: "Process of capturing, investigating, resolving and closing defects found during testing." }, chapter: "5" },
  { term: "Testing de rendimiento / Performance testing", def: { es: "Pruebas que evalúan la velocidad, escalabilidad y estabilidad del sistema bajo diferentes cargas.", en: "Tests that evaluate the speed, scalability and stability of the system under different loads." }, chapter: "2" },
  { term: "Shift-left testing", def: { es: "Enfoque donde el testing comienza lo antes posible en el SDLC para detectar defectos temprano y reducir costos.", en: "Approach where testing starts as early as possible in the SDLC to detect defects early and reduce costs." }, chapter: "2" },
  { term: "DevOps", def: { es: "Conjunto de prácticas que combina desarrollo de software y operaciones de TI para acortar el ciclo de vida del desarrollo.", en: "Set of practices combining software development and IT operations to shorten the development lifecycle." }, chapter: "2" },
  { term: "CI/CD", def: { es: "Integración Continua / Entrega Continua: prácticas de automatización que permiten integrar y desplegar cambios frecuentemente.", en: "Continuous Integration / Continuous Delivery: automation practices enabling frequent integration and deployment of changes." }, chapter: "2" },
];

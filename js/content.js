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
      { id: "1.1", title: { es: "¿Qué es el testing?", en: "What is testing?" }, xp: 30, lo: ["FL-1.1.1","FL-1.1.2"], source: "Syllabus v4.0 §1.1" },
      { id: "1.2", title: { es: "¿Por qué es necesario el testing?", en: "Why is testing necessary?" }, xp: 30, lo: ["FL-1.2.1","FL-1.2.2","FL-1.2.3"], source: "Syllabus v4.0 §1.2" },
      { id: "1.3", title: { es: "Los 7 Principios del Testing", en: "The 7 Testing Principles" }, xp: 50, lo: ["FL-1.3.1"], source: "Syllabus v4.0 §1.3" },
      { id: "1.4", title: { es: "Actividades, testware y roles", en: "Testing activities, testware and roles" }, xp: 40, lo: ["FL-1.4.1","FL-1.4.2","FL-1.4.3","FL-1.4.4","FL-1.4.5"], source: "Syllabus v4.0 §1.4" },
      { id: "1.5", title: { es: "Habilidades esenciales en testing", en: "Essential skills in testing" }, xp: 30, lo: ["FL-1.5.1","FL-1.5.2","FL-1.5.3"], source: "Syllabus v4.0 §1.5" },
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
      { id: "2.1", title: { es: "Testing en el contexto del SDLC", en: "Testing in the context of SDLC" }, xp: 40, lo: ["FL-2.1.1","FL-2.1.2","FL-2.1.3","FL-2.1.4","FL-2.1.5","FL-2.1.6"], source: "Syllabus v4.0 §2.1" },
      { id: "2.2", title: { es: "Niveles de prueba", en: "Test levels" }, xp: 50, lo: ["FL-2.2.1"], source: "Syllabus v4.0 §2.2" },
      { id: "2.3", title: { es: "Tipos de prueba", en: "Test types" }, xp: 40, lo: ["FL-2.2.2","FL-2.2.3"], source: "Syllabus v4.0 §2.2.2-2.2.3" },
      { id: "2.4", title: { es: "Pruebas de mantenimiento", en: "Maintenance testing" }, xp: 30, lo: ["FL-2.3.1"], source: "Syllabus v4.0 §2.3" },
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
      { id: "3.1", title: { es: "Conceptos básicos del testing estático", en: "Basic concepts of static testing" }, xp: 35, lo: ["FL-3.1.1","FL-3.1.2","FL-3.1.3"], source: "Syllabus v4.0 §3.1" },
      { id: "3.2", title: { es: "El proceso de revisión", en: "The review process" }, xp: 45, lo: ["FL-3.2.1","FL-3.2.2","FL-3.2.3","FL-3.2.4","FL-3.2.5"], source: "Syllabus v4.0 §3.2" },
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
      { id: "4.1", title: { es: "Panorama de las técnicas", en: "Test techniques overview" }, xp: 30, lo: ["FL-4.1.1"], source: "Syllabus v4.0 §4.1" },
      { id: "4.2", title: { es: "Técnicas de caja negra", en: "Black-box test techniques" }, xp: 70, lo: ["FL-4.2.1","FL-4.2.2","FL-4.2.3","FL-4.2.4"], source: "Syllabus v4.0 §4.2" },
      { id: "4.3", title: { es: "Técnicas de caja blanca", en: "White-box test techniques" }, xp: 60, lo: ["FL-4.3.1","FL-4.3.2","FL-4.3.3"], source: "Syllabus v4.0 §4.3" },
      { id: "4.4", title: { es: "Técnicas basadas en experiencia", en: "Experience-based techniques" }, xp: 50, lo: ["FL-4.4.1","FL-4.4.2","FL-4.4.3"], source: "Syllabus v4.0 §4.4" },
      { id: "4.5", title: { es: "Técnicas basadas en colaboración", en: "Collaboration-based techniques" }, xp: 40, lo: ["FL-4.5.1","FL-4.5.2","FL-4.5.3"], source: "Syllabus v4.0 §4.5" },
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
      { id: "5.1", title: { es: "Planificación de pruebas", en: "Test planning" }, xp: 50, lo: ["FL-5.1.1","FL-5.1.2","FL-5.1.3","FL-5.1.4","FL-5.1.5","FL-5.1.6","FL-5.1.7"], source: "Syllabus v4.0 §5.1" },
      { id: "5.2", title: { es: "Gestión de riesgos", en: "Risk management" }, xp: 50, lo: ["FL-5.2.1","FL-5.2.2","FL-5.2.3","FL-5.2.4"], source: "Syllabus v4.0 §5.2" },
      { id: "5.3", title: { es: "Monitoreo, control y completitud", en: "Test monitoring, control and completion" }, xp: 40, lo: ["FL-5.3.1","FL-5.3.2","FL-5.3.3"], source: "Syllabus v4.0 §5.3" },
      { id: "5.4", title: { es: "Gestión de la configuración", en: "Configuration management" }, xp: 30, lo: ["FL-5.4.1"], source: "Syllabus v4.0 §5.4" },
      { id: "5.5", title: { es: "Gestión de defectos", en: "Defect management" }, xp: 40, lo: ["FL-5.5.1"], source: "Syllabus v4.0 §5.5" },
    ]
  },
  {
    id: 5,
    color: "#9C27B0",
    icon: "🛠️",
    title: { es: "Soporte de Herramientas al Testing", en: "Tool Support for Testing" },
    duration: { es: "2% del examen", en: "2% of exam" },
    description: {
      es: "Tipos de herramientas de soporte al testing, y los beneficios y riesgos de la automatización de pruebas.",
      en: "Types of test support tools, and the benefits and risks of test automation."
    },
    topics: [
      { id: "6.1", title: { es: "Soporte de herramientas al testing", en: "Tool support for testing" }, xp: 20, lo: ["FL-6.1.1","FL-6.2.1"], source: "Syllabus v4.0 §6.1 / §6.2" },
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
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §1.1</p>
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

<h3>Verification vs Validation</h3>
<ul>
  <li><strong>Verification:</strong> Are we building the product right? (meets specified requirements)</li>
  <li><strong>Validation:</strong> Are we building the right product? (satisfies the needs of users and other stakeholders)</li>
</ul>

<div class="warning-box">
⚠️ <strong>Important for the exam:</strong> Testing CANNOT prove the absence of defects. It can only detect failures and reduce the probability of problems in production.
</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §1.1</p>
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
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §1.2</p>
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

<h3>The Role of Testing in Software Development</h3>
<p>Testing is important because it contributes to the success of software:</p>
<ul>
  <li><strong>Risk reduction</strong> of defects in production</li>
  <li><strong>Compliance</strong> with contractual, legal and regulatory requirements</li>
  <li><strong>Confidence</strong> for users and customers in the product</li>
  <li><strong>Early detection</strong> reduces the cost of fixing defects</li>
</ul>

<h3>QA vs Testing</h3>
<p><strong>QA (Quality Assurance):</strong> Focuses on <em>processes</em> to prevent defects. It is preventive and proactive.</p>
<p><strong>Testing / QC (Quality Control):</strong> Focuses on the <em>product</em> to detect defects. It is reactive and corrective.</p>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §1.2</p>
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
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §1.3</p>
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
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §1.3</p>
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

<h3>El proceso de prueba en su contexto</h3>
<p>La prueba no se realiza de forma aislada: depende de varios factores contextuales que influyen en la estrategia, las técnicas, el grado de automatización y el nivel de documentación:</p>
<ul>
  <li>Implicados (necesidades, expectativas, requisitos)</li>
  <li>Miembros del equipo (competencias, experiencia, disponibilidad)</li>
  <li>Dominio del negocio (criticidad, riesgos, normativa)</li>
  <li>Factores técnicos (tipo de software, arquitectura, tecnología)</li>
  <li>Restricciones del proyecto (alcance, tiempo, presupuesto)</li>
  <li>Factores organizativos y ciclo de vida de desarrollo (SDLC)</li>
  <li>Herramientas disponibles</li>
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
<p>La <strong>trazabilidad</strong> es la capacidad de relacionar los productos de trabajo de testing (casos de prueba, defectos) con los requisitos y demás artefactos del proyecto.</p>
<p>Una buena trazabilidad aporta valor porque:</p>
<ul>
  <li>Permite evaluar la cobertura de los requisitos por los casos de prueba</li>
  <li>Facilita determinar el impacto de los cambios</li>
  <li>Ayuda en las auditorías de prueba y en el cumplimiento de criterios de gobernanza de TI</li>
  <li>Facilita comunicar el avance y la finalización de la prueba a los implicados</li>
</ul>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §1.4</p>
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
<h3>The Test Process in Context</h3>
<p>Testing is not performed in isolation: it depends on several contextual factors that influence strategy, techniques, automation level and documentation detail:</p>
<ul>
  <li>Stakeholders (needs, expectations, requirements)</li>
  <li>Team members (skills, experience, availability)</li>
  <li>Business domain (criticality, risks, regulations)</li>
  <li>Technical factors (software type, architecture, technology)</li>
  <li>Project constraints (scope, time, budget)</li>
  <li>Organizational factors and software development lifecycle (SDLC)</li>
  <li>Available tools</li>
</ul>
<h3>Testware</h3>
<p>Artifacts produced during the test process: test plans, test cases, scripts, test data, defect reports, test reports.</p>
<h3>Roles</h3>
<table>
  <tr><th>Role</th><th>Responsibility</th></tr>
  <tr><td><strong>Test Manager</strong></td><td>Planning, monitoring, overall test management</td></tr>
  <tr><td><strong>Tester</strong></td><td>Analysis, design, implementation and test execution</td></tr>
</table>
<h3>Traceability</h3>
<p><strong>Traceability</strong> is the ability to relate testware (test cases, defects) to requirements and other project artifacts.</p>
<p>Good traceability adds value because it:</p>
<ul>
  <li>Supports evaluating requirement coverage by test cases</li>
  <li>Makes it easier to determine the impact of changes</li>
  <li>Helps with test audits and IT governance compliance</li>
  <li>Makes it easier to communicate test progress and completion to stakeholders</li>
</ul>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §1.4</p>
      `
    }
  },
  "2.2": {
    es: {
      title: "Niveles de prueba",
      chapterTag: "Cap. 2 · SDLC",
      content: `
<h3>Los 5 Niveles de Prueba</h3>
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

<h3>Prueba de Integración de Sistemas</h3>
<p>Verifica las interfaces del sistema bajo prueba con otros sistemas y servicios externos.</p>
<ul>
  <li><strong>Objeto de prueba:</strong> Interfaces con sistemas/servicios externos</li>
  <li><strong>Defectos típicos:</strong> Fallos de comunicación entre sistemas, incompatibilidad de formatos de datos</li>
  <li><strong>Entorno:</strong> Requiere entornos de prueba similares al de producción</li>
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
  <tr><td>Integración de Componentes</td><td>Interacción entre componentes</td><td>Desarrolladores / Testers</td></tr>
  <tr><td>Sistema</td><td>Sistema completo</td><td>Testers independientes</td></tr>
  <tr><td>Integración de Sistemas</td><td>Interfaces con sistemas externos</td><td>Testers independientes / especializados</td></tr>
  <tr><td>Aceptación</td><td>Necesidades del negocio/usuario</td><td>Usuarios / Clientes</td></tr>
</table>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §2.2</p>`
    },
    en: {
      title: "Test levels",
      chapterTag: "Ch. 2 · SDLC",
      content: `
<h3>The 5 Test Levels</h3>
<p>Test levels are groups of test activities that are organized and managed together. Each level corresponds to a stage of development.</p>

<h3>Component/Unit Testing</h3>
<p>Verifies individual components in isolation. Also called unit testing.</p>
<ul>
  <li><strong>Test object:</strong> Source code, modules, classes</li>
  <li><strong>Typical defects:</strong> Coding errors, incorrect logic paths</li>
  <li><strong>Environment:</strong> Stubs and drivers to simulate dependencies</li>
  <li><strong>Performed by:</strong> Developers</li>
</ul>

<h3>Component Integration Testing</h3>
<p>Verifies the interaction between integrated components.</p>
<ul>
  <li><strong>Test object:</strong> Interfaces, APIs, data flows between modules</li>
  <li><strong>Typical defects:</strong> Incorrect communication between components</li>
  <li><strong>Approaches:</strong> Bottom-up, Top-down, Big-bang, Sandwich</li>
</ul>

<h3>System Testing</h3>
<p>Verifies the behavior of the complete system end-to-end.</p>
<ul>
  <li><strong>Test object:</strong> Complete system, end-to-end application</li>
  <li><strong>Typical defects:</strong> Incorrect data flows, functional system failures</li>
  <li><strong>Performed by:</strong> Independent test team</li>
</ul>

<h3>System Integration Testing</h3>
<p>Verifies the interfaces of the system under test with other external systems and services.</p>
<ul>
  <li><strong>Test object:</strong> Interfaces with external systems/services</li>
  <li><strong>Typical defects:</strong> Communication failures between systems, data format incompatibility</li>
  <li><strong>Environment:</strong> Requires test environments similar to production</li>
</ul>

<h3>Acceptance Testing</h3>
<p>Verifies whether the system meets business acceptance criteria and is ready for delivery.</p>
<ul>
  <li><strong>UAT (User Acceptance Testing):</strong> End users</li>
  <li><strong>BAT (Business Acceptance Testing):</strong> Business processes</li>
  <li><strong>Alpha testing:</strong> At the developer's site</li>
  <li><strong>Beta testing:</strong> At the customer's site</li>
  <li><strong>Regulatory testing:</strong> Legal compliance</li>
</ul>

<table>
  <tr><th>Level</th><th>What it verifies</th><th>Who?</th></tr>
  <tr><td>Component/Unit</td><td>Individual modules</td><td>Developers</td></tr>
  <tr><td>Component Integration</td><td>Interaction between components</td><td>Developers / Testers</td></tr>
  <tr><td>System</td><td>Complete system</td><td>Independent testers</td></tr>
  <tr><td>System Integration</td><td>Interfaces with external systems</td><td>Independent / specialized testers</td></tr>
  <tr><td>Acceptance</td><td>Business/user needs</td><td>Users / Clients</td></tr>
</table>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §2.2</p>`
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
<h3>Enfoque de Equipo Completo (Whole Team Approach)</h3>
<p>Es una práctica procedente de la Programación Extrema (XP) en la que cualquier miembro del equipo con los conocimientos y competencias necesarios puede realizar cualquier tarea, y todos son responsables de la calidad.</p>
<ul>
  <li>Mejora la dinámica de equipo y potencia la comunicación y colaboración</li>
  <li>Crea sinergia al aprovechar los distintos conjuntos de competencias dentro del equipo</li>
  <li>Los testers colaboran con el negocio en los criterios de aceptación y con los desarrolladores en la estrategia de automatización</li>
</ul>
<div class="warning-box">
⚠️ <strong>Ojo:</strong> No siempre es apropiado — en sistemas críticos para la seguridad puede necesitarse un alto nivel de independencia de la prueba.
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
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §1.5</p>`
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
<div class="highlight-box">💡 <strong>Tester mindset:</strong> Testers should be able to think differently from developers — looking for how the system can fail, rather than how it works correctly.</div>
<h3>Whole Team Approach</h3>
<p>A practice from Extreme Programming (XP) where any team member with the necessary knowledge and skills can perform any task, and everyone is responsible for quality.</p>
<ul>
  <li>Improves team dynamics and boosts communication and collaboration</li>
  <li>Creates synergy by leveraging the different skill sets within the team</li>
  <li>Testers collaborate with business representatives on acceptance criteria and with developers on automation strategy</li>
</ul>
<div class="warning-box">⚠️ <strong>Note:</strong> Not always appropriate — safety-critical systems may require a high level of test independence.</div>
<h3>Test Independence</h3>
<table>
  <tr><th>Level</th><th>Description</th><th>Advantage</th></tr>
  <tr><td>No independence</td><td>Developer tests their own code</td><td>Knows the code well</td></tr>
  <tr><td>Internal independence</td><td>Tester from the same team</td><td>Greater objectivity</td></tr>
  <tr><td>Team independence</td><td>Separate QA team</td><td>External perspective</td></tr>
  <tr><td>Full independence</td><td>External organization</td><td>Maximum objectivity</td></tr>
</table>
<div class="warning-box">⚠️ <strong>Important:</strong> More independence is not always better — it can introduce communication problems and lack of domain knowledge.</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §1.5</p>`
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
<h3>Buenas Prácticas de Prueba Válidas para Cualquier CVDS</h3>
<p>Independientemente del modelo de ciclo de vida elegido, se recomienda:</p>
<ul>
  <li>Cada actividad de desarrollo tiene su actividad de prueba correspondiente</li>
  <li>Cada nivel de prueba tiene objetivos específicos y distintos, evitando redundancia</li>
  <li>El análisis y diseño de prueba de un nivel comienza durante la fase de desarrollo correspondiente (principio de prueba temprana)</li>
  <li>Los testers revisan los productos de trabajo (requisitos, historias de usuario) en cuanto hay borradores disponibles</li>
</ul>
<h3>La Prueba como Impulsor del Desarrollo</h3>
<p>Los enfoques de "prueba primero" definen las pruebas antes de escribir el código, aplicando el principio de prueba temprana y el desplazamiento a la izquierda:</p>
<ul>
  <li><strong>TDD (Test-Driven Development):</strong> las pruebas dirigen la codificación; se escribe primero la prueba, luego el código que la satisface y después se refactoriza</li>
  <li><strong>ATDD (Acceptance Test-Driven Development):</strong> las pruebas se derivan de los criterios de aceptación como parte del diseño del sistema, antes de desarrollar esa parte de la aplicación</li>
  <li><strong>BDD (Behaviour-Driven Development):</strong> expresa el comportamiento deseado con casos de prueba en lenguaje natural (formato Dado/Cuando/Entonces), fáciles de entender por todos los implicados</li>
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
</div>
<h3>Retrospectivas y Mejora de Proceso</h3>
<p>Las <strong>retrospectivas</strong> suelen celebrarse al final de un proyecto o iteración para debatir qué tuvo éxito, qué puede mejorarse y cómo incorporar esas mejoras. Sus resultados deben registrarse (normalmente en el informe de compleción de la prueba).</p>
<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Las retrospectivas son clave para la mejora continua del proceso de prueba: mayor efectividad/eficiencia, mejor calidad de los productos de prueba y mejor cooperación entre desarrollo y prueba.
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §2.1</p>`
    },
    en: {
      title: "Testing in the context of SDLC",
      chapterTag: "Ch. 2 · SDLC",
      content: `
<h3>Software Development Models and Testing</h3>
<p>Testing must adapt to the development model being used:</p>
<h3>Waterfall Model</h3>
<ul>
  <li>Phases are sequential: requirements → design → code → testing → maintenance</li>
  <li>Testing occurs after development is complete</li>
  <li>Defects found late are very costly</li>
  <li>More formal, documented testing</li>
</ul>
<h3>Iterative/Agile Models (Scrum, Kanban)</h3>
<ul>
  <li>Testing is integrated into each iteration/sprint</li>
  <li>Testers collaborate with developers from the start</li>
  <li>Continuous testing with fast feedback</li>
  <li>Automation is essential to keep up the pace</li>
</ul>
<h3>Good Testing Practices Valid for Any SDLC</h3>
<p>Regardless of the lifecycle model chosen:</p>
<ul>
  <li>Every development activity has a corresponding test activity</li>
  <li>Each test level has specific, distinct objectives, avoiding redundancy</li>
  <li>Test analysis and design for a level starts during the corresponding development phase (early testing principle)</li>
  <li>Testers review work products (requirements, user stories) as soon as drafts are available</li>
</ul>
<h3>Testing as a Driver for Development</h3>
<p>"Test-first" approaches define tests before the code is written, applying the early testing principle and shift-left:</p>
<ul>
  <li><strong>TDD (Test-Driven Development):</strong> tests drive coding; tests are written first, then code to satisfy them, then both are refactored</li>
  <li><strong>ATDD (Acceptance Test-Driven Development):</strong> tests are derived from acceptance criteria as part of system design, before that part of the application is developed</li>
  <li><strong>BDD (Behaviour-Driven Development):</strong> expresses desired behavior with test cases in natural language (Given/When/Then), easy for all stakeholders to understand</li>
</ul>
<h3>DevOps and Shift-Left</h3>
<p><strong>DevOps</strong> combines development and operations to deliver software faster. <strong>Shift-left</strong> moves testing to earlier phases of the SDLC.</p>
<div class="highlight-box">💡 In any SDLC model, testing should start as early as possible (Principle 3: early testing).</div>
<h3>Retrospectives and Process Improvement</h3>
<p><strong>Retrospectives</strong> are usually held at the end of a project or iteration to discuss what worked, what can be improved, and how to incorporate those improvements. Results should be recorded (typically in the test completion report).</p>
<div class="warning-box">⚠️ <strong>For the exam:</strong> Retrospectives are key to continuous process improvement: increased test effectiveness/efficiency, better quality of test work products, and better cooperation between development and testing.</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §2.1</p>`
    }
  },
  "2.3": {
    es: {
      title: "Tipos de prueba",
      chapterTag: "Cap. 2 · SDLC",
      content: `
<h3>Tipos de Prueba</h3>
<p>Los tipos de prueba categorizan las pruebas según su objetivo. El syllabus define cuatro tipos de prueba, aplicables en todos los niveles de prueba:</p>
<h3>Pruebas Funcionales</h3>
<p>Verifican <strong>QUÉ hace</strong> el sistema (comportamiento funcional). Evalúan la completitud, corrección y pertinencia funcional.</p>
<ul>
  <li>Prueba de funcionalidad</li>
  <li>Prueba de humo (smoke/sanity)</li>
</ul>
<h3>Pruebas No Funcionales</h3>
<p>Verifican <strong>CÓMO se comporta</strong> el sistema. Cubren características de calidad que no son funciones específicas. La norma ISO/IEC 25010 clasifica ocho características de calidad no funcionales:</p>
<table>
  <tr><th>Característica</th><th>Qué evalúa</th></tr>
  <tr><td>Rendimiento/Carga (eficiencia de desempeño)</td><td>Velocidad, escalabilidad bajo carga</td></tr>
  <tr><td>Compatibilidad</td><td>Interoperabilidad con otros sistemas</td></tr>
  <tr><td>Usabilidad (también: capacidad de interacción)</td><td>Facilidad de uso, experiencia de usuario</td></tr>
  <tr><td>Fiabilidad</td><td>Disponibilidad, tolerancia a fallos</td></tr>
  <tr><td>Seguridad</td><td>Vulnerabilidades, acceso no autorizado</td></tr>
  <tr><td>Mantenibilidad</td><td>Facilidad de modificación</td></tr>
  <tr><td>Portabilidad (también: flexibilidad)</td><td>Facilidad de transferir el sistema a otros entornos</td></tr>
  <tr><td>Seguridad funcional (safety)</td><td>Evitar estados que pongan en peligro la vida, la salud, la propiedad o el medio ambiente</td></tr>
</table>
<h3>Pruebas de Caja Negra</h3>
<p>Se basan en la <strong>especificación</strong>. Las pruebas se obtienen a partir de documentación externa al objeto de prueba (requisitos, especificaciones), sin necesitar conocimiento del código interno.</p>
<h3>Pruebas de Caja Blanca</h3>
<p>Se basan en la <strong>estructura interna</strong> del código. Se derivan de la implementación del software (sentencias, ramas, rutas).</p>
<div class="highlight-box">
💡 <strong>Los cuatro tipos de prueba</strong> (funcional, no funcional, caja negra, caja blanca) pueden aplicarse en todos los niveles de prueba, aunque el enfoque varía en cada nivel.
</div>
<h3>Prueba de Confirmación y Prueba de Regresión</h3>
<p>Cuando se corrige un defecto o se añade una prestación, la prueba debe incluir también estos dos tipos:</p>
<ul>
  <li><strong>Prueba de confirmación (retesting):</strong> Confirma que el defecto original se corrigió con éxito. Puede hacerse reejecutando los casos de prueba que fallaron por el defecto, o añadiendo pruebas nuevas para el cambio.</li>
  <li><strong>Prueba de regresión:</strong> Confirma que el cambio no ha provocado efectos adversos en partes del sistema que ya funcionaban (el mismo componente, otros componentes u otros sistemas conectados). Conviene hacer antes un <strong>análisis de impacto</strong> para acotar su alcance.</li>
</ul>
<div class="example-box">
📌 <strong>Para el examen:</strong> La prueba de confirmación verifica que UN defecto concreto está corregido; la prueba de regresión verifica que NADA MÁS se ha roto. Ambas pueden ser necesarias en cualquier nivel de prueba, y la regresión es una firme candidata a la automatización.
</div>
<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Distingue entre pruebas funcionales (QUÉ hace el sistema) y no funcionales (CÓMO lo hace), y entre caja negra (especificación) y caja blanca (estructura interna).
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §2.2.2-2.2.3</p>`
    },
    en: {
      title: "Test types",
      chapterTag: "Ch. 2 · SDLC",
      content: `
<h3>Test Types</h3>
<p>Test types categorize tests according to their objective. The syllabus defines four test types, applicable at every test level:</p>
<h3>Functional Testing</h3>
<p>Verifies <strong>WHAT</strong> the system does (functional behavior). Evaluates functional completeness, correctness and appropriateness.</p>
<ul>
  <li>Functionality testing</li>
  <li>Smoke/sanity testing</li>
</ul>
<h3>Non-Functional Testing</h3>
<p>Verifies <strong>HOW WELL</strong> the system behaves. Covers quality characteristics that are not specific functions. The ISO/IEC 25010 standard classifies eight non-functional quality characteristics:</p>
<table>
  <tr><th>Characteristic</th><th>What it evaluates</th></tr>
  <tr><td>Performance efficiency</td><td>Speed, scalability under load</td></tr>
  <tr><td>Compatibility</td><td>Interoperability with other systems</td></tr>
  <tr><td>Usability (also known as: interaction capability)</td><td>Ease of use, user experience</td></tr>
  <tr><td>Reliability</td><td>Availability, fault tolerance</td></tr>
  <tr><td>Security</td><td>Vulnerabilities, unauthorized access</td></tr>
  <tr><td>Maintainability</td><td>Ease of modification</td></tr>
  <tr><td>Portability (also known as: flexibility)</td><td>Ease of transferring the system to other environments</td></tr>
  <tr><td>Safety</td><td>Avoiding states that endanger human life, health, property or the environment</td></tr>
</table>
<h3>Black-Box Testing</h3>
<p>Based on the <strong>specification</strong>. Tests are derived from documentation external to the test object (requirements, specifications), without needing knowledge of the internal code.</p>
<h3>White-Box Testing</h3>
<p>Based on the <strong>internal structure</strong> of the code. Tests are derived from the software's implementation (statements, branches, paths).</p>
<div class="highlight-box">💡 <strong>The four test types</strong> (functional, non-functional, black-box, white-box) can be applied at every test level, although the approach differs at each level.</div>
<h3>Confirmation Testing and Regression Testing</h3>
<p>When a defect is fixed or a feature is added, testing should also include these two:</p>
<ul>
  <li><strong>Confirmation testing (retesting):</strong> Confirms that the original defect was successfully fixed. It can be done by re-running the test cases that previously failed because of the defect, or by adding new tests for the change.</li>
  <li><strong>Regression testing:</strong> Confirms that the change hasn't caused adverse effects on parts of the system that already worked (the same component, other components, or other connected systems). An <strong>impact analysis</strong> beforehand helps scope it.</li>
</ul>
<div class="example-box">📌 <strong>For the exam:</strong> Confirmation testing checks that ONE specific defect is fixed; regression testing checks that NOTHING ELSE broke. Both may be needed at any test level, and regression testing is a strong candidate for automation.</div>
<div class="warning-box">⚠️ <strong>For the exam:</strong> Distinguish functional (WHAT the system does) from non-functional (HOW it does it), and black-box (specification) from white-box (internal structure).</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §2.2.2-2.2.3</p>`
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
  <li>Permite a los implicados verificar que los requisitos documentados describen sus <strong>necesidades reales</strong></li>
  <li>Crea un <strong>entendimiento compartido</strong> entre los implicados, al poder realizarse en fases tempranas del ciclo de vida</li>
</ul>
<h3>Diferencias entre la Prueba Estática y la Prueba Dinámica</h3>
<p>La prueba estática y la prueba dinámica son prácticas complementarias que persiguen objetivos similares (detectar defectos), pero presentan diferencias clave:</p>
<ul>
  <li>La prueba estática encuentra los <strong>defectos directamente</strong>; la prueba dinámica provoca <strong>fallos</strong> a partir de los cuales se determina el defecto mediante un análisis posterior.</li>
  <li>La prueba estática detecta más fácilmente defectos en caminos del código poco ejecutados o difíciles de alcanzar mediante prueba dinámica.</li>
  <li>La prueba estática puede aplicarse a productos de trabajo <strong>no ejecutables</strong> (requisitos, diseño); la prueba dinámica solo puede aplicarse a productos <strong>ejecutables</strong>.</li>
  <li>La prueba estática puede medir características de calidad independientes de la ejecución del código (p. ej. mantenibilidad); la prueba dinámica mide características que dependen de la ejecución (p. ej. eficiencia de rendimiento).</li>
</ul>
<div class="highlight-box">
💡 <strong>Defectos típicos encontrados en testing estático:</strong>
<br>• Requisitos ambiguos o contradictorios
<br>• Errores de diseño o interfaces
<br>• Código no seguro o difícil de mantener
<br>• Desviaciones de los estándares de codificación
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §3.1</p>`
    },
    en: {
      title: "Basic concepts of static testing",
      chapterTag: "Ch. 3 · Static Testing",
      content: `
<h3>What is Static Testing?</h3>
<p>Static testing evaluates software artifacts <strong>without executing the software</strong>. It can be applied to:</p>
<ul>
  <li>Requirements specifications</li>
  <li>User stories and acceptance criteria</li>
  <li>System design and architecture</li>
  <li>Source code</li>
  <li>Technical and test documentation</li>
  <li>Contracts and project plans</li>
</ul>
<h3>Static Analysis</h3>
<p><strong>Static analysis</strong> is the automated process of examining source code without executing it. Static analysis tools detect:</p>
<ul>
  <li>Coding standard violations</li>
  <li>Uninitialized or unused variables</li>
  <li>Dead code (code that is never executed)</li>
  <li>Security vulnerabilities (SQL injection, XSS, etc.)</li>
  <li>High cyclomatic complexity</li>
</ul>
<div class="example-box">
📌 <strong>Common tools:</strong> SonarQube, ESLint, FindBugs, PMD, Checkstyle.
</div>
<h3>Benefits of Static Testing</h3>
<ul>
  <li>Finds defects before execution (cheaper to fix)</li>
  <li>Finds defects dynamic testing cannot easily detect</li>
  <li>Improves code and documentation quality</li>
  <li>Facilitates communication within the team</li>
  <li>Reduces the time needed for later dynamic testing</li>
  <li>Lets stakeholders verify that the documented requirements describe their <strong>actual needs</strong></li>
  <li>Creates a <strong>shared understanding</strong> among stakeholders, since it can be performed early in the SDLC</li>
</ul>
<h3>Differences Between Static and Dynamic Testing</h3>
<ul>
  <li>Static testing finds defects <strong>directly</strong>; dynamic testing causes <strong>failures</strong> from which the underlying defect is determined through further analysis.</li>
  <li>Static testing more easily detects defects on rarely executed or hard-to-reach code paths.</li>
  <li>Static testing can be applied to <strong>non-executable</strong> work products; dynamic testing only to <strong>executable</strong> ones.</li>
  <li>Static testing can measure quality characteristics independent of code execution (e.g. maintainability); dynamic testing measures characteristics that depend on execution (e.g. performance efficiency).</li>
</ul>
<div class="highlight-box">
💡 <strong>Typical defects found in static testing:</strong>
<br>• Ambiguous or contradictory requirements
<br>• Design or interface errors
<br>• Insecure or hard-to-maintain code
<br>• Deviations from coding standards
</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §3.1</p>`
    }
  },
  "3.2": {
    es: {
      title: "El proceso de revisión",
      chapterTag: "Cap. 3 · Testing Estático",
      content: `
<h3>Beneficios de la Retroalimentación Temprana y Frecuente</h3>
<p>La retroalimentación temprana y frecuente de los implicados permite comunicar cuanto antes posibles problemas de calidad. Si hay poca implicación de los implicados durante el ciclo de vida, el producto puede no cumplir su visión original o actual, lo que puede provocar repetición de trabajo, incumplimiento de plazos o incluso el fracaso del proyecto. La retroalimentación frecuente ayuda al equipo de desarrollo a comprender mejor lo que construye y a centrarse en las funcionalidades que más valor aportan.</p>
<h3>Tipos de Revisión</h3>
<table>
  <tr><th>Tipo</th><th>Formalidad</th><th>Guiado por</th><th>Objetivo</th></tr>
  <tr><td>Informal</td><td>Muy baja</td><td>Cualquiera</td><td>Encontrar defectos rápidamente</td></tr>
  <tr><td>Walkthrough</td><td>Baja-Media</td><td>Autor</td><td>Aprendizaje del equipo</td></tr>
  <tr><td>Revisión técnica</td><td>Media</td><td>Moderador</td><td>Consenso técnico</td></tr>
  <tr><td>Inspección</td><td>Alta</td><td>Moderador certificado</td><td>Máxima detección de defectos</td></tr>
</table>
<h3>Roles y Responsabilidades en una Revisión Formal</h3>
<ul>
  <li><strong>Gestor:</strong> Decide qué se va a revisar y aporta los recursos (personal, tiempo) para la revisión</li>
  <li><strong>Autor:</strong> Crea y corrige el producto de trabajo que se revisa</li>
  <li><strong>Moderador (facilitador):</strong> Asegura el funcionamiento eficaz de las reuniones de revisión: media, gestiona el tiempo y mantiene un entorno seguro en el que todos puedan hablar libremente</li>
  <li><strong>Escriba (o grabador):</strong> Recopila las anomalías de los revisores y registra la información de la revisión (decisiones, nuevas anomalías)</li>
  <li><strong>Revisor:</strong> Lleva a cabo la revisión individual del producto de trabajo</li>
  <li><strong>Líder de revisión:</strong> Asume la responsabilidad general de la revisión: decide quién participa y organiza cuándo y dónde se realiza</li>
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
<h3>Factores de Éxito de las Revisiones</h3>
<ul>
  <li>Objetivos claros y criterios de salida medibles (nunca evaluar a los participantes)</li>
  <li>Elegir el tipo de revisión adecuado al objetivo y al producto de trabajo</li>
  <li>Revisar en fragmentos pequeños para mantener la concentración</li>
  <li>Dar retroalimentación a los implicados y autores para que puedan mejorar</li>
  <li>Dar tiempo suficiente a los participantes para prepararse</li>
  <li>Apoyo de la dirección al proceso de revisión</li>
  <li>Integrar las revisiones en la cultura de la organización</li>
  <li>Formación adecuada para todos los participantes</li>
</ul>
<div class="highlight-box">
💡 <strong>Para el examen:</strong> La INSPECCIÓN es la revisión más formal. El WALKTHROUGH es guiado por el autor. La revisión INFORMAL no tiene proceso definido. El GESTOR y el MODERADOR son roles distintos: el Gestor decide qué se revisa y aporta recursos; el Moderador facilita la reunión.
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §3.2</p>`
    },
    en: {
      title: "The review process",
      chapterTag: "Ch. 3 · Static Testing",
      content: `
<h3>Benefits of Early and Frequent Feedback</h3>
<p>Early and frequent feedback from stakeholders allows quality issues to be communicated as soon as possible. Low stakeholder involvement during the SDLC can result in a product that fails to meet the stakeholder's original or current vision, which can lead to costly rework, missed deadlines, or even project failure. Frequent feedback helps the development team better understand what they are building and focus on the features that bring the most value.</p>
<h3>Review Types</h3>
<table>
  <tr><th>Type</th><th>Formality</th><th>Led by</th><th>Objective</th></tr>
  <tr><td>Informal</td><td>Very low</td><td>Anyone</td><td>Find defects quickly</td></tr>
  <tr><td>Walkthrough</td><td>Low-Medium</td><td>Author</td><td>Team learning</td></tr>
  <tr><td>Technical review</td><td>Medium</td><td>Moderator</td><td>Technical consensus</td></tr>
  <tr><td>Inspection</td><td>High</td><td>Certified moderator</td><td>Maximum defect detection</td></tr>
</table>
<h3>Roles and Responsibilities in a Formal Review</h3>
<ul>
  <li><strong>Manager:</strong> Decides what is to be reviewed and provides resources (staff, time) for the review</li>
  <li><strong>Author:</strong> Creates and fixes the work product under review</li>
  <li><strong>Moderator (facilitator):</strong> Ensures the effective running of review meetings: mediation, time management, and a safe environment in which everyone can speak freely</li>
  <li><strong>Scribe (recorder):</strong> Collates anomalies from reviewers and records review information (decisions, new anomalies)</li>
  <li><strong>Reviewer:</strong> Performs the individual review of the work product</li>
  <li><strong>Review leader:</strong> Takes overall responsibility for the review: decides who participates and organizes when and where it takes place</li>
</ul>
<h3>Review Process</h3>
<ol>
  <li><strong>Planning:</strong> Define scope, entry/exit criteria, assign roles</li>
  <li><strong>Kick-off:</strong> Distribute materials, check entry criteria</li>
  <li><strong>Individual review:</strong> Each reviewer examines the work product</li>
  <li><strong>Communication and analysis:</strong> Meeting to discuss findings</li>
  <li><strong>Fixing and reporting:</strong> The author fixes issues; a report is produced</li>
  <li><strong>Follow-up:</strong> Verify that defects were fixed</li>
</ol>
<h3>Review Success Factors</h3>
<ul>
  <li>Clear objectives and measurable exit criteria (never evaluating participants)</li>
  <li>Choosing the right review type for the objective and work product</li>
  <li>Reviewing in small chunks to maintain focus</li>
  <li>Providing feedback to stakeholders and authors so they can improve</li>
  <li>Giving participants enough time to prepare</li>
  <li>Management support for the review process</li>
  <li>Making reviews part of the organizational culture</li>
  <li>Adequate training for all participants</li>
</ul>
<div class="highlight-box">
💡 <strong>For the exam:</strong> INSPECTION is the most formal review. WALKTHROUGH is led by the author. INFORMAL review has no defined process. MANAGER and MODERATOR are distinct roles: the Manager decides what is reviewed and provides resources; the Moderator facilitates the meeting.
</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §3.2</p>`
    }
  },
  "4.1": {
    es: {
      title: "Panorama de las técnicas de prueba",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>Categorías de Técnicas de Prueba</h3>
<p>El syllabus clasifica las técnicas de diseño de pruebas en <strong>tres</strong> grandes categorías. Las técnicas ayudan al probador en el análisis (qué probar) y el diseño (cómo probar) de las pruebas, permitiendo obtener un conjunto pequeño pero suficiente de casos de prueba de forma sistemática.</p>
<div class="highlight-box">
🎯 <strong>Resumen clave para el examen (las 3 categorías oficiales):</strong>
<ul>
  <li><strong>Caja Negra:</strong> Basadas en la especificación (qué hace el sistema), independientes de cómo esté implementado</li>
  <li><strong>Caja Blanca:</strong> Basadas en la estructura interna (cómo lo hace); solo pueden crearse tras el diseño/implementación</li>
  <li><strong>Basadas en Experiencia:</strong> Basadas en el conocimiento, intuición y experiencia del tester; detectan defectos que las otras dos no encuentran, por lo que son complementarias</li>
</ul>
</div>
<h3>Técnicas de Caja Negra (Black-Box)</h3>
<p>No requieren conocimiento del código interno. Se basan en las especificaciones:</p>
<ul>
  <li>Partición de Equivalencia (EP)</li>
  <li>Análisis de Valor Límite (BVA)</li>
  <li>Tablas de Decisión</li>
  <li>Prueba de Transición de Estado</li>
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
<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Los <strong>enfoques basados en colaboración</strong> (historias de usuario, ATDD — ver tema 4.5) <u>no</u> son una cuarta categoría de técnica de prueba: el syllabus solo clasifica las técnicas en las 3 categorías de arriba. Los enfoques colaborativos son un tema aparte que se centra en <em>prevenir</em> defectos mediante comunicación temprana, más que en detectarlos con una técnica sistemática.
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §4.1</p>`
    },
    en: {
      title: "Test techniques overview",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Test Design Technique Categories</h3>
<p>The syllabus classifies test design techniques into <strong>three</strong> categories. Techniques help the tester with test analysis (what to test) and test design (how to test it), producing a small but sufficient set of test cases systematically.</p>
<ul>
  <li><strong>Black-Box:</strong> Specification-based (EP, BVA, Decision Tables, State Transition); test cases don't depend on the implementation</li>
  <li><strong>White-Box:</strong> Structure-based (Statement Coverage, Branch Coverage); can only be created after design/implementation</li>
  <li><strong>Experience-based:</strong> Error Guessing, Exploratory Testing, Checklist-based; complementary because they find defects the other two miss</li>
</ul>
<div class="warning-box">⚠️ <strong>For the exam:</strong> Collaboration-based approaches (user stories, ATDD — see topic 4.5) are <u>not</u> a fourth technique category; the syllabus classifies techniques into only the 3 above. Collaboration-based approaches are a separate topic focused on preventing defects through early communication.</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §4.1</p>`
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
</div>
<h3>El Valor de la Prueba de Caja Blanca</h3>
<p>Todas las técnicas de caja blanca comparten un punto fuerte: tienen en cuenta <strong>toda la implementación real</strong> del software, lo que facilita detectar defectos incluso cuando la especificación es vaga, está obsoleta o incompleta.</p>
<div class="highlight-box">
💡 <strong>Fortalezas y debilidades:</strong>
<br>✅ Detecta defectos aunque la especificación sea deficiente, porque se basa en el código real
<br>✅ Es muy adecuada para revisar código (o pseudocódigo) que aún no está listo para ejecutarse, es decir, también se usa en <strong>prueba estática</strong> (p. ej. en un code walkthrough)
<br>✅ Proporciona una medición objetiva de la cobertura, permitiendo generar pruebas adicionales para aumentarla y así ganar confianza en el código
<br>❌ Si el software no implementa uno o más requisitos, la prueba de caja blanca por sí sola puede no detectar ese defecto de <strong>omisión</strong> (para eso hace falta caja negra)
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §4.3</p>`
    },
    en: {
      title: "White-box test techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>White-Box Techniques</h3>
<p>Based on the internal structure of the code. Require access to source code.</p>
<h3>Statement Coverage</h3>
<p>Measures the percentage of executable statements executed by test cases.</p>
<div class="example-box">
📌 <strong>Example:</strong>
<code>
if (x > 0) {
  y = x * 2;  // Statement 1
}
z = y + 1;    // Statement 2
</code>
Testing only x=5 executes both statements → 100% statement coverage. Testing only x=-1 executes only statement 2 → 50% statement coverage.
</div>
<h3>Branch Coverage</h3>
<p>Measures the percentage of control flow branches executed. Stronger than statement coverage: 100% branch coverage implies 100% statement coverage (but not vice versa).</p>
<h3>The Value of White-Box Testing</h3>
<p>All white-box techniques share a key strength: they account for the actual software implementation, making it easier to find defects even when the specification is vague, outdated or incomplete.</p>
<div class="highlight-box">
💡 <strong>Strengths and weaknesses:</strong>
<br>✅ Finds defects even with a poor specification, since it relies on the real code
<br>✅ Well suited to reviewing code (or pseudocode) not yet ready to execute — also used in <strong>static testing</strong> (e.g. a code walkthrough)
<br>✅ Gives an objective coverage measurement, enabling additional tests to raise coverage and confidence in the code
<br>❌ If the software fails to implement one or more requirements, white-box testing alone may miss that <strong>omission</strong> defect (black-box testing is needed for that)
</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §4.3</p>`
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
<p>Técnica simultánea donde el aprendizaje, diseño y ejecución ocurren al mismo tiempo, mientras el probador aprende sobre el objeto de prueba. Es especialmente útil cuando las especificaciones son escasas o hay mucha presión de tiempo, y complementa a las técnicas más formales.</p>
<ul>
  <li>No sigue scripts predefinidos; el tester adapta su enfoque en tiempo real</li>
  <li>Útil para descubrir defectos inesperados y para explorar en profundidad áreas no cubiertas</li>
  <li>Es más eficaz cuanta más experiencia, conocimiento del dominio y competencias clave (análisis, curiosidad, creatividad) tenga el probador</li>
</ul>
<div class="example-box">
📌 <strong>Prueba exploratoria basada en sesiones (session-based):</strong> forma estructurada de aplicar la técnica dentro de un <strong>marco de tiempo definido</strong> (p. ej. 60-90 min).
<ol>
  <li>El tester usa un <strong>charter</strong> (objetivo de prueba de alto nivel) para guiar la sesión</li>
  <li>Durante la sesión identifica y practica elementos de cobertura, documentando pasos y hallazgos en una <strong>hoja de sesión</strong></li>
  <li>Al terminar, hay una <strong>recapitulación (debrief)</strong>: el probador discute con los implicados los resultados de la sesión</li>
</ol>
La prueba exploratoria puede además incorporar otras técnicas ya vistas, como la partición de equivalencia.
</div>
<h3>Testing Basado en Checklists</h3>
<p>El tester diseña, implementa y ejecuta pruebas para cubrir las condiciones de una lista de comprobación, construida a partir de la experiencia, del conocimiento de lo importante para el usuario o de por qué y cómo falla el software.</p>
<ul>
  <li>Cada elemento se suele formular como una pregunta, comprobable de forma individual y directa</li>
  <li>No debe incluir elementos automatizables ni demasiado generales</li>
  <li>Debe actualizarse periódicamente (nuevos defectos hallados) sin dejar que crezca en exceso; listas muy detalladas dan más repetibilidad, listas más generales dan más cobertura pero menos repetibilidad</li>
</ul>
<div class="highlight-box">
💡 <strong>Cuándo usar cada técnica:</strong>
<br>• Error guessing: defectos esperados en áreas conocidas
<br>• Exploratorio: descubrir lo desconocido, probar sin especificaciones
<br>• Checklist: asegurar cobertura de áreas de riesgo conocidas
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §4.4</p>`
    },
    en: {
      title: "Experience-based techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Experience-Based Techniques</h3>
<h3>Error Guessing</h3>
<p>The tester anticipates likely errors, defects and failures based on experience: how the application behaved in the past, typical developer mistakes, and failure types seen in similar applications. <strong>Defect attacks</strong> use a list of possible errors/defects to design targeted tests.</p>
<h3>Exploratory Testing</h3>
<p>Simultaneous learning, test design and execution while the tester learns about the test object. Especially useful with scarce specifications or high time pressure, and complements more formal techniques.</p>
<ul>
  <li>No predefined scripts; the tester adapts in real time</li>
  <li>More effective the more experience, domain knowledge and core skills (analysis, curiosity, creativity) the tester has</li>
</ul>
<div class="example-box">
📌 <strong>Session-based exploratory testing:</strong> a structured way to apply the technique within a <strong>defined time-box</strong> (e.g. 60-90 min).
<ol>
  <li>The tester uses a <strong>charter</strong> (high-level test objective) to guide the session</li>
  <li>During the session, coverage items are identified and exercised, with steps and findings logged in a <strong>test session sheet</strong></li>
  <li>Afterward, a <strong>debrief</strong> discussion is held between the tester and stakeholders about the session's results</li>
</ol>
</div>
<h3>Checklist-Based Testing</h3>
<p>The tester designs, implements and executes tests to cover the conditions of a checklist, built from experience, knowledge of what matters to users, or understanding of why/how the software fails.</p>
<ul>
  <li>Items are usually phrased as questions, individually and directly checkable</li>
  <li>Should not include automatable or overly general items</li>
  <li>Should be updated periodically without growing excessively long</li>
</ul>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §4.4</p>`
    }
  },
  "4.5": {
    es: {
      title: "Técnicas basadas en colaboración",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>Técnicas Basadas en Colaboración</h3>
<p>En el ISTQB v4.0, se añaden enfoques basados en la colaboración entre desarrolladores, testers y representantes del negocio. A diferencia de las técnicas de los temas 4.2-4.4, no buscan detectar defectos sistemáticamente, sino <strong>prevenirlos</strong> mediante comunicación y consenso temprano.</p>
<h3>Escritura Colaborativa de Historias de Usuario</h3>
<p>Una historia de usuario representa una prestación de valor para un usuario. Tiene tres aspectos clave, las <strong>3 C</strong>: <strong>Card</strong> (cuartilla/ficha que la describe), <strong>Conversation</strong> (conversación sobre cómo se usará el software) y <strong>Confirmation</strong> (los criterios de aceptación). Se redacta en colaboración (lluvia de ideas, mapas mentales) entre negocio, desarrollo y prueba. El formato típico es:</p>
<div class="example-box">
📌 <strong>Formato:</strong>
<br><em>Como [tipo de usuario], quiero [acción/objetivo] para que [beneficio/valor]</em>, seguido de los criterios de aceptación.
<br><br><strong>Ejemplo:</strong> Como cliente registrado, quiero restablecer mi contraseña por email, para que pueda recuperar mi acceso si la olvido.
</div>
<div class="highlight-box">
💡 <strong>INVEST:</strong> una buena historia de usuario debe ser <strong>I</strong>ndependiente, <strong>N</strong>egociable, <strong>V</strong>aliosa, <strong>E</strong>stimable, pequeña (<strong>S</strong>mall) y comprobable (<strong>T</strong>estable). Si nadie sabe cómo probarla, probablemente no está lo bastante clara.
</div>
<h3>Criterios de Aceptación</h3>
<p>Son las condiciones que debe cumplir la historia para ser aceptada; equivalen a las condiciones de prueba de la historia. Sirven para acotar su alcance, alcanzar consenso, describir escenarios positivos y negativos, y son la base de la prueba de aceptación (ver DGPA más abajo). Existen dos formatos habituales para escribirlos:</p>
<ul>
  <li><strong>Orientado a escenario:</strong> formato Dado/Cuando/Entonces (Given/When/Then) usado en desarrollo guiado por comportamiento (BDD)</li>
  <li><strong>Orientado a reglas:</strong> lista de verificación con viñetas, o una tabla de mapeo entrada→salida</li>
</ul>
<div class="example-box">
📌 <strong>Ejemplo orientado a escenario (Given/When/Then):</strong> Dado que el usuario ha olvidado su contraseña, cuando solicita el restablecimiento con su email registrado, entonces recibe un enlace de restablecimiento válido por 30 minutos.
<br><strong>Ejemplo orientado a reglas:</strong> "- El enlace expira a los 30 min. - Solo es válido para el email que lo solicitó. - Tras usarlo, se invalida."
</div>
<h3>Desarrollo Guiado por Prueba de Aceptación (DGPA / ATDD)</h3>
<p>En ATDD, los casos de prueba se crean <strong>antes</strong> de implementar la historia, a partir de sus criterios de aceptación:</p>
<ol>
  <li>Taller de especificación: el equipo (negocio + dev + tester) redacta/depura la historia y sus criterios de aceptación, resolviendo ambigüedades</li>
  <li>Se crean los casos de prueba de aceptación a partir de esos criterios (pueden verse como ejemplos de cómo funciona el software)</li>
  <li>Primero se cubren casos positivos, luego negativos y por último características de calidad no funcionales</li>
  <li>El desarrollador implementa la funcionalidad para pasar esas pruebas; si están en un formato compatible con un framework de automatización, se convierten en requisitos ejecutables</li>
</ol>
<div class="highlight-box">
💡 <strong>Diferencia ATDD vs TDD:</strong>
<br>• TDD: el desarrollador escribe pruebas unitarias antes de su código
<br>• ATDD: el equipo completo escribe pruebas de aceptación (basadas en los criterios de aceptación) antes del desarrollo
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §4.5</p>`
    },
    en: {
      title: "Collaboration-based techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Collaboration-Based Techniques (CTFL v4.0)</h3>
<p>Added in ISTQB v4.0, these approaches rely on collaboration between developers, testers and business representatives. Unlike the techniques in topics 4.2-4.4, they aim to <strong>prevent</strong> defects through early communication and consensus rather than systematically detecting them.</p>
<h3>Collaborative User Story Writing</h3>
<p>A user story represents a feature of value to a user. It has three key aspects, the <strong>3 C's</strong>: <strong>Card</strong> (the medium describing it), <strong>Conversation</strong> (how the software will be used) and <strong>Confirmation</strong> (the acceptance criteria). Written collaboratively (brainstorming, mind maps) across business, development and testing, using the format: "As a [user], I want [action] so that [benefit]", followed by acceptance criteria.</p>
<div class="highlight-box">💡 <strong>INVEST:</strong> a good user story should be Independent, Negotiable, Valuable, Estimable, Small and Testable. If nobody knows how to test it, it's probably not clear enough.</div>
<h3>Acceptance Criteria</h3>
<p>Conditions the story must satisfy to be accepted — effectively its test conditions. Used to bound scope, reach consensus, describe positive/negative scenarios, and as the basis for acceptance testing. Two common formats:</p>
<ul>
  <li><strong>Scenario-oriented:</strong> Given/When/Then, used in Behavior-Driven Development (BDD)</li>
  <li><strong>Rule-oriented:</strong> a bulleted checklist, or an input→output mapping table</li>
</ul>
<h3>Acceptance Test-Driven Development (ATDD)</h3>
<p>Acceptance test cases are created <strong>before</strong> implementation, derived from the acceptance criteria:</p>
<ol>
  <li>Specification workshop: the whole team writes/refines the story and its acceptance criteria, resolving ambiguities</li>
  <li>Acceptance test cases are created from those criteria (they can be seen as examples of how the software should behave)</li>
  <li>Positive cases are covered first, then negative, then non-functional quality characteristics</li>
  <li>The developer implements the feature to pass those tests; in an automation-compatible format they become executable requirements</li>
</ol>
<div class="highlight-box">💡 <strong>ATDD vs TDD:</strong> TDD = developer writes unit tests before code. ATDD = whole team writes acceptance tests (from acceptance criteria) before development.</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §4.5</p>`
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
  <li>Contexto (alcance, objetivos, stakeholders, base de prueba)</li>
  <li>Supuestos y restricciones</li>
  <li>Implicados (roles, responsabilidades, necesidades de contratación y formación)</li>
  <li>Comunicación y reporte de información</li>
  <li>Registro de riesgos</li>
  <li>Enfoque de pruebas (niveles, tipos, técnicas, entregables, criterios de entrada/salida, independencia de prueba, métricas)</li>
  <li>Presupuesto y calendario</li>
</ul>

<h3>La Contribución del Probador a la Planificación de la Iteración y la Entrega</h3>
<p>En los CVDS iterativos suelen darse dos tipos de planificación:</p>
<ul>
  <li><strong>Planificación de la entrega:</strong> se anticipa al lanzamiento de un producto y redefine la lista de trabajo acumulado. Los probadores participan redactando historias de usuario y criterios de aceptación comprobables, en los análisis de riesgo de calidad y de proyecto, y estimando el esfuerzo de prueba asociado a las historias de usuario.</li>
  <li><strong>Planificación de la iteración:</strong> se ocupa de una única iteración. Los probadores participan en el análisis detallado del riesgo de las historias de usuario, determinan su capacidad de ser probadas, las desglosan en tareas de prueba y estiman el esfuerzo de cada una.</li>
</ul>

<h3>Criterios de Entrada y Salida</h3>
<table>
  <tr><th>Criterios de Entrada</th><th>Criterios de Salida</th></tr>
  <tr><td>El código está completo y compilado</td><td>Todos los casos de prueba ejecutados</td></tr>
  <tr><td>El entorno de pruebas está disponible</td><td>90% de casos pasados</td></tr>
  <tr><td>Los datos de prueba están preparados</td><td>Todos los defectos críticos cerrados</td></tr>
  <tr><td>Los requisitos están aprobados</td><td>Informe de pruebas generado</td></tr>
</table>
<p>En Desarrollo Ágil, los criterios de salida suelen llamarse <strong>definición de hecho</strong> (Definition of Done) y los criterios de entrada de una historia de usuario, <strong>definición de preparado</strong> (Definition of Ready).</p>

<h3>Técnicas de Estimación del Esfuerzo de Prueba</h3>
<p>El syllabus describe cuatro técnicas de estimación del esfuerzo de prueba:</p>
<ul>
  <li><strong>Basada en proporciones:</strong> se recopilan proporciones "estándar" de proyectos anteriores similares (p. ej. la proporción esfuerzo de desarrollo : esfuerzo de prueba) y se aplican al nuevo proyecto.</li>
  <li><strong>Extrapolación:</strong> se miden datos tempranos del proyecto actual y se extrapola el esfuerzo restante (p. ej. el esfuerzo medio de las últimas iteraciones); adecuada para CVDS iterativos.</li>
  <li><strong>Delphi de Banda Ancha:</strong> técnica iterativa basada en expertos. Cada experto estima el esfuerzo de forma aislada; si hay desviaciones fuera de los límites acordados, se discuten y se vuelve a estimar hasta alcanzar consenso. El <strong>Planning Poker</strong> es una variante ágil habitual, con cartas numeradas.</li>
  <li><strong>Estimación de tres puntos:</strong> técnica basada en expertos que combina una estimación optimista (a), la más probable (m) y una pesimista (b): <strong>E = (a + 4m + b) / 6</strong>, con un error de medición <strong>SD = (b - a) / 6</strong>.</li>
</ul>
<div class="example-box">
📌 <strong>Ejemplo — estimación de tres puntos:</strong> a = 6 horas-persona, m = 9, b = 18.
<br>E = (6 + 4×9 + 18) / 6 = (6 + 36 + 18) / 6 = 60 / 6 = <strong>10 horas-persona</strong>
<br>SD = (18 - 6) / 6 = <strong>2</strong> → la estimación final es 10 ± 2 horas-persona (entre 8 y 12).
<br>📌 <strong>Ejemplo — basada en proporciones:</strong> si en un proyecto anterior la proporción desarrollo:prueba fue 3:2, y el esfuerzo de desarrollo del proyecto actual se estima en 600 días-persona, el esfuerzo de prueba se estima en 600 × (2/3) = <strong>400 días-persona</strong>.
</div>

<h3>Priorización de Casos de Prueba</h3>
<p>Una vez especificados y agrupados en conjuntos, los casos de prueba se organizan en un calendario de ejecución. Las estrategias de priorización más usadas son:</p>
<ul>
  <li><strong>Basada en riesgo:</strong> se ejecutan primero los casos que cubren los riesgos más importantes (ver §5.2.3).</li>
  <li><strong>Basada en cobertura:</strong> se ejecutan primero los casos que logran mayor cobertura (p. ej. de sentencias). En la variante de <em>cobertura adicional</em>, cada caso posterior es el que aporta la mayor cobertura adicional.</li>
  <li><strong>Basada en requisitos:</strong> se ejecutan primero los casos vinculados a los requisitos de mayor prioridad para los implicados.</li>
</ul>
<div class="warning-box">
⚠️ <strong>Dependencias:</strong> si un caso de prueba de prioridad alta depende de otro de prioridad más baja, este último debe ejecutarse primero, aunque rompa el orden ideal. La disponibilidad de recursos (herramientas, entornos, personas) también condiciona el orden real de ejecución.
</div>

<h3>Pirámide de Prueba</h3>
<p>Modelo que muestra que las distintas pruebas tienen granularidad diferente, y ayuda a asignar el esfuerzo de automatización. Cuanto más alta la capa, menor la granularidad y el aislamiento de la prueba, y mayor su duración: la capa inferior agrupa muchas pruebas pequeñas, aisladas y rápidas; la capa superior, pocas pruebas complejas de extremo a extremo. Un modelo popular usa tres capas: <strong>pruebas de componentes</strong>, <strong>pruebas de integración</strong> y <strong>pruebas de extremo a extremo</strong> (el modelo original de Cohn usaba "unitarias", "de servicio" y "de interfaz de usuario").</p>

<h3>Cuadrantes de Prueba</h3>
<p>Definidos por Brian Marick, agrupan niveles de prueba, tipos de prueba, actividades, técnicas y productos de trabajo en el Desarrollo Ágil, según dos ejes: si la prueba está orientada al negocio o a la tecnología, y si apoya al equipo (guía el desarrollo) o critica el producto (mide su comportamiento frente a expectativas):</p>
<table>
  <tr><th></th><th>Apoya al equipo</th><th>Critica el producto</th></tr>
  <tr><td><strong>Orientada a tecnología</strong></td><td>Q1: pruebas de componentes e integración de componentes (automatizadas, en CI)</td><td>Q4: pruebas de humo y no funcionales excepto usabilidad (normalmente automatizadas)</td></tr>
  <tr><td><strong>Orientada a negocio</strong></td><td>Q2: pruebas funcionales, de historias de usuario, de API, prototipos (manuales o automatizadas)</td><td>Q3: prueba exploratoria, de usabilidad y de aceptación de usuario (normalmente manuales)</td></tr>
</table>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §5.1</p>`
    },
    en: {
      title: "Test planning",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>The Test Plan</h3>
<p>Documents the testing approach, resources, scope and activities. A typical test plan includes:</p>
<ul>
  <li>Context (scope, objectives, stakeholders, test basis)</li>
  <li>Assumptions and constraints</li>
  <li>Stakeholders (roles, responsibilities, hiring/training needs)</li>
  <li>Communication and reporting</li>
  <li>Risk register</li>
  <li>Test approach (levels, types, techniques, deliverables, entry/exit criteria, test independence, metrics)</li>
  <li>Budget and schedule</li>
</ul>

<h3>The Tester's Contribution to Iteration and Release Planning</h3>
<p>Iterative SDLCs usually involve two kinds of planning:</p>
<ul>
  <li><strong>Release planning:</strong> anticipates a product release and redefines the product backlog. Testers help write user stories and testable acceptance criteria, take part in quality and project risk analysis, and estimate the test effort of user stories.</li>
  <li><strong>Iteration planning:</strong> looks at a single iteration. Testers take part in detailed risk analysis of user stories, determine their testability, break them down into test tasks, and estimate the effort for each task.</li>
</ul>

<h3>Entry and Exit Criteria</h3>
<table>
  <tr><th>Entry Criteria</th><th>Exit Criteria</th></tr>
  <tr><td>Code complete and compiled</td><td>All test cases executed</td></tr>
  <tr><td>Test environment available</td><td>90% tests passed</td></tr>
  <tr><td>Test data ready</td><td>All critical defects closed</td></tr>
  <tr><td>Requirements approved</td><td>Test report produced</td></tr>
</table>
<p>In Agile, exit criteria are often called the <strong>Definition of Done</strong>, and the entry criteria a user story must meet the <strong>Definition of Ready</strong>.</p>

<h3>Test Estimation Techniques</h3>
<p>The syllabus describes four test estimation techniques:</p>
<ul>
  <li><strong>Ratio-based:</strong> "standard" ratios are gathered from similar past projects (e.g. the development effort : test effort ratio) and applied to the new project.</li>
  <li><strong>Extrapolation:</strong> measurements are taken early in the current project and the remaining effort is extrapolated (e.g. the average effort of the last few iterations); well suited to iterative SDLCs.</li>
  <li><strong>Wideband Delphi:</strong> an iterative, expert-based technique. Each expert estimates in isolation; if results deviate beyond agreed limits, experts discuss and re-estimate until consensus is reached. <strong>Planning Poker</strong> is a common Agile variant using numbered cards.</li>
  <li><strong>Three-point estimation:</strong> an expert-based technique combining an optimistic (a), most likely (m) and pessimistic (b) estimate: <strong>E = (a + 4m + b) / 6</strong>, with a measurement error of <strong>SD = (b - a) / 6</strong>.</li>
</ul>
<div class="example-box">
📌 <strong>Example — three-point estimation:</strong> a = 6 person-hours, m = 9, b = 18.
<br>E = (6 + 4×9 + 18) / 6 = (6 + 36 + 18) / 6 = 60 / 6 = <strong>10 person-hours</strong>
<br>SD = (18 - 6) / 6 = <strong>2</strong> → the final estimate is 10 ± 2 person-hours (between 8 and 12).
<br>📌 <strong>Example — ratio-based:</strong> if a previous project's development:test ratio was 3:2, and the current project's development effort is estimated at 600 person-days, the test effort is estimated at 600 × (2/3) = <strong>400 person-days</strong>.
</div>

<h3>Test Case Prioritization</h3>
<p>Once specified and grouped into test suites, test cases are organized into a test execution schedule. The most common prioritization strategies are:</p>
<ul>
  <li><strong>Risk-based:</strong> test cases covering the most important risks are run first (see §5.2.3).</li>
  <li><strong>Coverage-based:</strong> test cases achieving the highest coverage (e.g. statement coverage) run first. In the <em>additional coverage</em> variant, each subsequent test case is the one achieving the highest additional coverage.</li>
  <li><strong>Requirements-based:</strong> test cases linked to the requirements stakeholders prioritize highest run first.</li>
</ul>
<div class="warning-box">
⚠️ <strong>Dependencies:</strong> if a higher-priority test case depends on a lower-priority one, the lower-priority test case must run first, even if that breaks the ideal priority order. Resource availability (tools, environments, people) also affects the actual execution order.
</div>

<h3>Test Pyramid</h3>
<p>A model showing that tests can have different granularity, helping the team allocate test automation effort. The higher the layer, the lower the granularity and test isolation, and the longer the execution time: the bottom layer groups many small, isolated, fast tests; the top layer has few complex, end-to-end tests. A popular model uses three layers: <strong>component tests</strong>, <strong>integration tests</strong> and <strong>end-to-end tests</strong> (Cohn's original model used "unit tests", "service tests" and "UI tests").</p>

<h3>Test Quadrants</h3>
<p>Defined by Brian Marick, they group test levels, test types, activities, techniques and work products in Agile development along two axes: business-facing vs. technology-facing, and supporting the team (guiding development) vs. critiquing the product (measuring it against expectations):</p>
<table>
  <tr><th></th><th>Supports the team</th><th>Critiques the product</th></tr>
  <tr><td><strong>Technology-facing</strong></td><td>Q1: component and component integration tests (automated, in CI)</td><td>Q4: smoke tests and non-functional tests except usability (usually automated)</td></tr>
  <tr><td><strong>Business-facing</strong></td><td>Q2: functional tests, user story tests, API tests, prototypes (manual or automated)</td><td>Q3: exploratory, usability and user acceptance testing (usually manual)</td></tr>
</table>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §5.1</p>`
    }
  },
  "5.2": {
    es: {
      title: "Gestión de riesgos",
      chapterTag: "Cap. 5 · Gestión",
      content: `
<h3>Riesgo en el Contexto del Testing</h3>
<p>Un <strong>riesgo</strong> es un factor potencial que puede resultar en una consecuencia negativa en el futuro. El nivel de riesgo combina dos factores:</p>
<div class="highlight-box">
📊 <strong>Nivel de Riesgo = Probabilidad del riesgo × Impacto del riesgo</strong>
</div>
<p>La evaluación puede ser <strong>cuantitativa</strong> (multiplicando probabilidad e impacto) o <strong>cualitativa</strong> (usando una matriz de riesgo). Cuanto mayor el nivel de riesgo, más importante su tratamiento.</p>
<h3>Tipos de Riesgo</h3>
<table>
  <tr><th>Tipo</th><th>Descripción</th><th>Ejemplos</th></tr>
  <tr><td><strong>Riesgo de Producto</strong></td><td>Posibilidad de que el producto no satisfaga las necesidades de los implicados</td><td>Funcionalidad ausente/incorrecta, cálculos erróneos, arquitectura deficiente, rendimiento inadecuado, vulnerabilidades de seguridad</td></tr>
  <tr><td><strong>Riesgo de Proyecto</strong></td><td>Posibilidad de que el proyecto falle en sus objetivos de gestión y control</td><td>Problemas de organización (retrasos, estimaciones inexactas), de personal (competencias, conflictos), técnicos y con proveedores</td></tr>
</table>
<h3>Análisis del Riesgo de Producto: Influencia en el Alcance de las Pruebas</h3>
<p>El análisis del riesgo de producto (identificación + evaluación del riesgo) debería comenzar en una fase temprana del CVDS. Sus resultados se usan para:</p>
<ul>
  <li>Determinar el <strong>alcance</strong> de la prueba a realizar</li>
  <li>Determinar los <strong>niveles y tipos de prueba</strong> concretos a aplicar</li>
  <li>Determinar las <strong>técnicas de prueba</strong> y el nivel de <strong>cobertura</strong> a alcanzar</li>
  <li><strong>Estimar el esfuerzo</strong> de prueba necesario para cada tarea</li>
  <li><strong>Priorizar</strong> las pruebas para encontrar los defectos críticos lo antes posible</li>
  <li>Determinar si conviene aplicar alguna actividad adicional (no de prueba) para reducir el riesgo</li>
</ul>
<h3>Control del Riesgo de Producto</h3>
<p>Una vez analizado el riesgo, las respuestas posibles son: mitigación mediante pruebas, aceptación del riesgo, transferencia del riesgo o un plan de contingencia. Las medidas para mitigar riesgos de producto mediante pruebas incluyen:</p>
<ul>
  <li>Seleccionar probadores con el nivel adecuado de experiencia para cada tipo de riesgo</li>
  <li>Aplicar el nivel adecuado de independencia de la prueba</li>
  <li>Realizar revisiones y análisis estático</li>
  <li>Aplicar las técnicas de prueba y niveles de cobertura adecuados</li>
  <li>Aplicar los tipos de prueba que abordan las características de calidad afectadas</li>
  <li>Ejecutar pruebas dinámicas, incluyendo pruebas de regresión</li>
</ul>
<p>La <strong>monitorización del riesgo</strong> asegura que las acciones de mitigación son efectivas, aporta información para mejorar la evaluación del riesgo, e identifica riesgos emergentes.</p>
<div class="example-box">
📌 <strong>Ejemplo:</strong> En un sistema bancario, el módulo de transferencias tiene mayor riesgo de producto que la página de inicio (impacto alto: pérdida económica). El análisis de riesgo le asigna mayor cobertura y probadores más experimentados; como control del riesgo se añaden revisiones de código y pruebas de regresión adicionales sobre ese módulo.
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §5.2</p>`
    },
    en: {
      title: "Risk management",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>Risk in Testing Context</h3>
<p>The <strong>risk level</strong> combines two factors:</p>
<div class="highlight-box">
📊 <strong>Risk Level = Risk Probability × Risk Impact</strong>
</div>
<p>Evaluation can be <strong>quantitative</strong> (multiplying probability and impact) or <strong>qualitative</strong> (using a risk matrix). The higher the risk level, the more important its treatment.</p>
<h3>Risk Types</h3>
<table>
  <tr><th>Type</th><th>Description</th><th>Examples</th></tr>
  <tr><td><strong>Product risk</strong></td><td>Possibility the product won't meet stakeholder needs</td><td>Missing/incorrect functionality, wrong calculations, poor architecture, inadequate performance, security vulnerabilities</td></tr>
  <tr><td><strong>Project risk</strong></td><td>Possibility the project won't meet its management and control objectives</td><td>Organizational issues (delays, inaccurate estimates), staffing issues (skills, conflicts), technical and supplier issues</td></tr>
</table>
<h3>Product Risk Analysis: Influence on Test Scope</h3>
<p>Product risk analysis (risk identification + risk assessment) should ideally start early in the SDLC. Its results are used to:</p>
<ul>
  <li>Determine the <strong>scope</strong> of testing to be carried out</li>
  <li>Determine the specific <strong>test levels and types</strong> to apply</li>
  <li>Determine the <strong>test techniques</strong> and <strong>coverage</strong> level to achieve</li>
  <li><strong>Estimate the test effort</strong> required for each task</li>
  <li><strong>Prioritize</strong> tests to find critical defects as early as possible</li>
  <li>Determine whether any additional (non-test) activity could reduce the risk</li>
</ul>
<h3>Product Risk Control</h3>
<p>Once risk has been analyzed, possible responses include mitigation through testing, risk acceptance, risk transfer or a contingency plan. Measures to mitigate product risks through testing include:</p>
<ul>
  <li>Selecting testers with the appropriate level of experience for each risk type</li>
  <li>Applying the appropriate level of test independence</li>
  <li>Performing reviews and static analysis</li>
  <li>Applying appropriate test techniques and coverage levels</li>
  <li>Applying test types that address the affected quality characteristics</li>
  <li>Performing dynamic testing, including regression testing</li>
</ul>
<p><strong>Risk monitoring</strong> ensures mitigation actions are effective, provides information to improve risk assessment, and identifies emerging risks.</p>
<div class="example-box">
📌 <strong>Example:</strong> In a banking system, the transfers module has higher product risk than the home page (high impact: financial loss). Risk analysis assigns it more coverage and more experienced testers; as risk control, extra code reviews and regression tests are added for that module.
</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §5.2</p>`
    }
  },
  "5.5": {
    es: {
      title: "Gestión de defectos",
      chapterTag: "Cap. 5 · Gestión",
      content: `
<h3>Objetivos de un Informe de Defectos</h3>
<p>Un informe de defecto bien preparado persigue tres objetivos: dar a quienes gestionan y corrigen el defecto información suficiente para resolverlo, servir de medio de seguimiento de la calidad del producto, y aportar ideas para mejorar el proceso de desarrollo y de prueba.</p>

<h3>El Ciclo de Vida de un Defecto</h3>
<p>Un defecto pasa por diferentes estados desde que se detecta hasta que se cierra:</p>
<div class="example-box">
📌 <strong>Estados típicos:</strong>
<br>Nuevo → Asignado → En corrección → Pendiente retest → Reabierto / Cerrado
</div>

<h3>Campos de un Informe de Defecto</h3>
<p>Un informe de defecto registrado durante una prueba dinámica suele incluir:</p>
<ul>
  <li><strong>Identificador único</strong></li>
  <li><strong>Título</strong> con un breve resumen de la anomalía notificada</li>
  <li><strong>Fecha</strong> de detección, organización emisora y <strong>autor</strong> (incluyendo su rol)</li>
  <li><strong>Objeto de prueba</strong> (módulo, versión) y <strong>entorno de prueba</strong> identificados</li>
  <li><strong>Contexto del defecto:</strong> caso de prueba que se estaba ejecutando, actividad de prueba en curso, fase del CVDS, y otra información relevante (técnica de prueba, checklist o datos de prueba usados)</li>
  <li><strong>Descripción del fallo</strong> para permitir su reproducción y resolución: pasos que detectaron la anomalía, registros de prueba, volcados de base de datos, capturas de pantalla o grabaciones</li>
  <li><strong>Resultado esperado</strong> vs <strong>resultado actual</strong></li>
  <li><strong>Severidad</strong> del defecto (grado de impacto)</li>
  <li><strong>Prioridad</strong> de corrección</li>
  <li><strong>Estado</strong> del defecto (p. ej. abierto, aplazado, duplicado, pendiente de corrección, pendiente de prueba de confirmación, reabierto, cerrado, rechazado)</li>
  <li><strong>Referencias</strong> (p. ej. al caso de prueba)</li>
</ul>
<p>Algunos de estos campos (identificador, fecha, autor, estado inicial) suelen completarse automáticamente al usar una herramienta de gestión de defectos.</p>

<h3>Severidad vs Prioridad</h3>
<table>
  <tr><th></th><th>Alta prioridad</th><th>Baja prioridad</th></tr>
  <tr><td><strong>Alta severidad</strong></td><td>Sistema caído, afecta a todos</td><td>Crash en función rara vez usada</td></tr>
  <tr><td><strong>Baja severidad</strong></td><td>Error tipográfico en página principal</td><td>Error visual en pantalla de configuración</td></tr>
</table>
<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Severidad = impacto técnico. Prioridad = urgencia de corrección. Son dimensiones independientes.
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §5.5</p>`
    },
    en: {
      title: "Defect management",
      chapterTag: "Ch. 5 · Management",
      content: `
<h3>Objectives of a Defect Report</h3>
<p>A well-prepared defect report has three goals: give the people who manage and fix the defect enough information to resolve it, provide a means of tracking product quality, and provide ideas for improving the development and test process.</p>

<h3>Defect Lifecycle</h3>
<p>New → Assigned → In Fix → Pending Retest → Reopened / Closed</p>

<h3>Fields of a Defect Report</h3>
<p>A defect report raised during dynamic testing usually includes:</p>
<ul>
  <li><strong>Unique identifier</strong></li>
  <li><strong>Title</strong> with a brief summary of the reported anomaly</li>
  <li><strong>Date</strong> the anomaly was observed, issuing organization and <strong>author</strong> (including their role)</li>
  <li><strong>Test object</strong> (module, version) and <strong>test environment</strong> identification</li>
  <li><strong>Defect context:</strong> test case being executed, test activity in progress, SDLC phase, and other relevant information (test technique, checklist or test data being used)</li>
  <li><strong>Failure description</strong> to allow reproduction and resolution: steps that detected the anomaly, test logs, database dumps, screenshots or recordings</li>
  <li><strong>Expected</strong> vs <strong>actual result</strong></li>
  <li><strong>Severity</strong> of the defect (degree of impact)</li>
  <li><strong>Priority</strong> for fixing</li>
  <li><strong>Status</strong> (e.g. open, deferred, duplicate, waiting to be fixed, waiting for confirmation testing, reopened, closed, rejected)</li>
  <li><strong>References</strong> (e.g. to the test case)</li>
</ul>
<p>Some of these fields (identifier, date, author, initial status) are usually filled in automatically when using a defect management tool.</p>

<h3>Severity vs Priority</h3>
<table>
  <tr><th></th><th>High priority</th><th>Low priority</th></tr>
  <tr><td><strong>High severity</strong></td><td>System down, affects everyone</td><td>Crash in a rarely used function</td></tr>
  <tr><td><strong>Low severity</strong></td><td>Typo on the main page</td><td>Visual glitch in a settings screen</td></tr>
</table>
<div class="warning-box">⚠️ Severity = technical impact. Priority = urgency of fix. Independent dimensions.</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §5.5</p>`
    }
  },
  "6.1": {
    es: {
      title: "Soporte de herramientas al testing",
      chapterTag: "Cap. 6 · Herramientas",
      content: `
<h3>Herramientas de Testing</h3>
<p>Las herramientas de prueba apoyan y facilitan muchas actividades de prueba. El syllabus distingue ocho tipos de herramientas (lista no exhaustiva):</p>
<table>
  <tr><th>Tipo</th><th>Qué aportan</th><th>Ejemplos</th></tr>
  <tr><td>Gestión</td><td>Gestión del ciclo de vida (CVDS), requisitos, pruebas, defectos y configuración</td><td>Jira, TestRail, Xray</td></tr>
  <tr><td>Prueba estática</td><td>Apoyan las revisiones y el análisis estático</td><td>SonarQube, ESLint</td></tr>
  <tr><td>Diseño e implementación de pruebas</td><td>Generación de casos de prueba, datos de prueba y procedimientos de prueba</td><td>—</td></tr>
  <tr><td>Ejecución de pruebas y cobertura</td><td>Ejecución automatizada de pruebas y medición de cobertura</td><td>Selenium, Playwright, Cypress, JUnit, pytest</td></tr>
  <tr><td>Pruebas no funcionales</td><td>Pruebas difíciles o imposibles de realizar manualmente</td><td>JMeter, Gatling, k6</td></tr>
  <tr><td>DevOps</td><td>Canalización de entrega, seguimiento del flujo de trabajo, construcción automatizada, IC/EC</td><td>Jenkins, GitHub Actions, GitLab CI</td></tr>
  <tr><td>Colaboración</td><td>Facilitan la comunicación</td><td>Slack, Confluence</td></tr>
  <tr><td>Escalabilidad y normalización del despliegue</td><td>Máquinas virtuales, herramientas de contenerización</td><td>Docker, Kubernetes</td></tr>
  <tr><td>Cualquier otra herramienta</td><td>Cualquier herramienta que ayude en las pruebas</td><td>p. ej., una hoja de cálculo</td></tr>
</table>
<h3>Beneficios de la Automatización</h3>
<div class="highlight-box">
💡 Adquirir una herramienta no garantiza el éxito: cada nueva herramienta requiere esfuerzo (introducción, mantenimiento, formación) para lograr beneficios reales y duraderos.
</div>
<ul>
  <li>Ahorro de tiempo al reducir el trabajo manual repetitivo (ejecutar pruebas de regresión, reintroducir los mismos datos, comparar resultados esperados vs. reales, verificar estándares de codificación)</li>
  <li>Prevención de errores humanos simples gracias a mayor consistencia y repetibilidad</li>
  <li>Evaluación más objetiva (p. ej. cobertura) y medidas demasiado complejas de obtener manualmente</li>
  <li>Acceso más fácil a la información de pruebas para la gestión y los informes (estadísticas, gráficos, datos agregados)</li>
  <li>Tiempos de ejecución reducidos: detección más temprana de defectos, retroalimentación más rápida, menor tiempo de comercialización</li>
  <li>Más tiempo para que los probadores diseñen pruebas nuevas, más profundas y eficaces</li>
</ul>
<h3>Riesgos de la Automatización</h3>
<ul>
  <li>Expectativas poco realistas sobre los beneficios de una herramienta (funcionalidad, facilidad de uso)</li>
  <li>Estimaciones imprecisas de tiempo, costos y esfuerzo para introducir la herramienta, mantener los scripts y cambiar el proceso manual existente</li>
  <li>Usar una herramienta de prueba cuando la prueba manual es más apropiada</li>
  <li>Confiar demasiado en la herramienta, ignorando la necesidad del pensamiento crítico humano</li>
  <li>Dependencia del proveedor de la herramienta (puede quebrar, retirarla, venderla a otro proveedor o dar soporte deficiente)</li>
  <li>Usar software de código abierto que puede estar abandonado o requerir actualizaciones frecuentes</li>
  <li>Incompatibilidad de la herramienta de automatización con la plataforma de desarrollo</li>
  <li>Elegir una herramienta inadecuada que no cumpla los requisitos regulatorios o los estándares de seguridad</li>
</ul>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §6.1 / §6.2</p>`
    },
    en: {
      title: "Tool support for testing",
      chapterTag: "Ch. 6 · Tools",
      content: `
<h3>Test Tools</h3>
<p>Test tools support and facilitate many test activities. The syllabus distinguishes eight types of tools (non-exhaustive list):</p>
<table>
  <tr><th>Type</th><th>What they provide</th><th>Examples</th></tr>
  <tr><td>Management</td><td>Manage the SDLC, requirements, tests, defects and configuration</td><td>Jira, TestRail, Xray</td></tr>
  <tr><td>Static testing</td><td>Support reviews and static analysis</td><td>SonarQube, ESLint</td></tr>
  <tr><td>Test design and implementation</td><td>Generate test cases, test data and test procedures</td><td>—</td></tr>
  <tr><td>Test execution and coverage</td><td>Automated test execution and coverage measurement</td><td>Selenium, Playwright, Cypress, JUnit, pytest</td></tr>
  <tr><td>Non-functional testing</td><td>Testing that is difficult or impossible to perform manually</td><td>JMeter, Gatling, k6</td></tr>
  <tr><td>DevOps</td><td>Delivery pipeline, workflow tracking, automated build, CI/CD</td><td>Jenkins, GitHub Actions, GitLab CI</td></tr>
  <tr><td>Collaboration</td><td>Facilitate communication</td><td>Slack, Confluence</td></tr>
  <tr><td>Scalability and deployment standardization</td><td>Virtual machines, containerization tools</td><td>Docker, Kubernetes</td></tr>
  <tr><td>Any other tool</td><td>Any tool that assists in testing</td><td>e.g., a spreadsheet</td></tr>
</table>
<h3>Benefits of Test Automation</h3>
<div class="highlight-box">
💡 Simply acquiring a tool does not guarantee success: each new tool requires effort (introduction, maintenance, training) to achieve real and lasting benefits.
</div>
<ul>
  <li>Time saved by reducing repetitive manual work (regression tests, re-entering the same test data, comparing expected vs. actual results, checking coding standards)</li>
  <li>Prevention of simple human errors through greater consistency and repeatability</li>
  <li>More objective assessment (e.g. coverage) and measures too complicated for humans to determine</li>
  <li>Easier access to test information to support test management and reporting (statistics, graphs, aggregated data)</li>
  <li>Reduced test execution times: earlier defect detection, faster feedback, faster time to market</li>
  <li>More time for testers to design new, deeper and more effective tests</li>
</ul>
<h3>Risks of Test Automation</h3>
<ul>
  <li>Unrealistic expectations about the benefits of a tool (functionality, ease of use)</li>
  <li>Inaccurate estimates of time, cost and effort to introduce a tool, maintain test scripts and change the existing manual test process</li>
  <li>Using a test tool when manual testing is more appropriate</li>
  <li>Relying on a tool too much, e.g. ignoring the need for human critical thinking</li>
  <li>Dependency on the tool vendor (may go out of business, retire the tool, sell it to another vendor, or provide poor support)</li>
  <li>Using open-source software that may be abandoned or require frequent updates</li>
  <li>The automation tool is not compatible with the development platform</li>
  <li>Choosing an unsuitable tool that does not comply with regulatory requirements or safety standards</li>
</ul>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §6.1 / §6.2</p>`
    }
  },
  "4.2": {
    es: {
      title: "Técnicas de caja negra",
      chapterTag: "Cap. 4 · Técnicas",
      content: `
<h3>¿Qué son las técnicas de caja negra?</h3>
<p>Las técnicas de caja negra (black-box) se basan en la especificación del objeto de prueba. No se accede al código fuente; solo se evalúan entradas y salidas. El syllabus cubre cuatro: partición de equivalencia, análisis del valor frontera, prueba de tabla de decisión y prueba de transición de estado.</p>

<h3>1. Partición de Equivalencia (EP)</h3>
<p>Divide los datos en particiones donde todos los valores se comportan de la misma manera (particiones válidas o inválidas, no solapadas y no vacías). Basta con un valor representativo de cada partición: si detecta un defecto, se asume que cualquier otro valor de esa partición también lo detectaría.</p>
<div class="example-box">
📌 <strong>Ejemplo:</strong> Un campo acepta edades de 18 a 65 años.
<br>• Partición válida: 18-65 (ej: probar con 30)
<br>• Partición inválida 1: menor a 18 (ej: probar con 10)
<br>• Partición inválida 2: mayor a 65 (ej: probar con 70)
<br>Con <strong>cobertura de Cada Elección</strong>, si hay varios parámetros (varias particiones de entrada), cada partición de cada conjunto debe usarse al menos una vez en algún caso de prueba.
</div>

<h3>2. Análisis de Valor Límite (BVA)</h3>
<p>Practica las fronteras (valores mínimo y máximo) de las particiones, porque es donde los desarrolladores cometen más errores (p. ej. usar <code>&gt;</code> en vez de <code>&gt;=</code>).</p>
<div class="example-box">
📌 <strong>Ejemplo (BVA de 2 valores):</strong> Para el rango 18-65, cada frontera aporta 2 elementos de cobertura (el valor frontera y su vecino más cercano de la partición adyacente):
<br>• Límites: 17, 18, 65, 66
<br><strong>Ejemplo (BVA de 3 valores):</strong> cada frontera aporta 3 elementos (el valor frontera y sus dos vecinos): 17, 18, 19, 64, 65, 66
<br>El BVA de 3 valores es más riguroso: puede detectar defectos "off-by-one" que el BVA de 2 valores pasa por alto.
</div>

<h3>3. Prueba de Tabla de Decisión</h3>
<p>Se utiliza para probar reglas de negocio: cómo distintas combinaciones de <strong>condiciones</strong> (filas superiores) producen distintas <strong>acciones</strong> (filas inferiores). Cada columna es una <strong>regla</strong> que combina un valor de cada condición con las acciones resultantes. El elemento de cobertura es la columna/regla; para 100% de cobertura hay que practicar todas las reglas factibles.</p>
<div class="example-box">
📌 <strong>Ejemplo — descuento de una tienda online</strong> (condiciones: ¿es cliente VIP? · ¿compra ≥ 100€?):
<table>
  <tr><th></th><th>R1</th><th>R2</th><th>R3</th><th>R4</th></tr>
  <tr><td>¿Cliente VIP?</td><td>V</td><td>V</td><td>F</td><td>F</td></tr>
  <tr><td>¿Compra ≥ 100€?</td><td>V</td><td>F</td><td>V</td><td>F</td></tr>
  <tr><td>Acción: 20% descuento</td><td>X</td><td></td><td></td><td></td></tr>
  <tr><td>Acción: 10% descuento</td><td></td><td>X</td><td>X</td><td></td></tr>
  <tr><td>Acción: sin descuento</td><td></td><td></td><td></td><td>X</td></tr>
</table>
Cada columna (R1-R4) se convierte directamente en un caso de prueba: p. ej. R2 → cliente VIP con compra de 80€ → se espera 10% de descuento.
</div>

<h3>4. Prueba de Transición de Estado</h3>
<p>Se usa cuando el comportamiento del sistema depende del estado actual y del evento recibido (con una posible condición de guarda y acción resultante). Se modela como un diagrama o tabla de estados. Un caso de prueba se construye como una <strong>secuencia de eventos</strong> que recorre varios estados.</p>
<ul>
  <li><strong>Cobertura de todos los estados:</strong> los casos de prueba visitan cada estado al menos una vez (criterio más débil)</li>
  <li><strong>Cobertura de transiciones válidas</strong> (también llamada <em>cobertura de conmutador 0</em>): se ejercita cada transición válida al menos una vez; alcanzarla al 100% garantiza también el 100% de cobertura de todos los estados. Es el criterio más usado</li>
  <li><strong>Cobertura de todas las transiciones:</strong> se ejercitan todas las transiciones válidas <u>y además</u> se intentan las transiciones inválidas (no definidas). Es el criterio más exigente y debería ser el mínimo exigible en sistemas críticos</li>
</ul>
<div class="example-box">
📌 <strong>Ejemplo — cajero ATM</strong> (estados: Esperando tarjeta → Esperando PIN → Menú principal → Dispensando efectivo):
<br>Transiciones válidas: "Esperando tarjeta" --insertar tarjeta--> "Esperando PIN"; "Esperando PIN" --PIN correcto--> "Menú principal"; "Menú principal" --retirar efectivo--> "Dispensando efectivo".
<br>Un caso de prueba de cobertura de transiciones válidas recorre esa secuencia completa. Un caso de prueba de transición <strong>inválida</strong> intentaría, p. ej., "retirar efectivo" estando en "Esperando PIN" (no debería estar permitido) — probar solo una transición inválida por caso evita el enmascaramiento de defectos.
</div>

<div class="warning-box">
⚠️ <strong>Para el examen:</strong> Debes poder calcular el número de casos de prueba con EP y BVA, derivar reglas de una tabla de decisión y casos de prueba de un diagrama de estados, e identificar qué técnica aplicar en un escenario dado.
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §4.2</p>
      `
    },
    en: {
      title: "Black-box test techniques",
      chapterTag: "Ch. 4 · Techniques",
      content: `
<h3>Black-box Techniques</h3>
<p>Based on the specification of the test object, without accessing the source code. The syllabus covers four: equivalence partitioning, boundary value analysis, decision table testing and state transition testing.</p>

<h3>1. Equivalence Partitioning (EP)</h3>
<p>Divide data into partitions (valid or invalid, non-overlapping, non-empty) where all values behave the same. One representative value per partition is enough: if it detects a defect, any other value in that partition is assumed to detect it too.</p>
<div class="example-box">
📌 <strong>Example:</strong> A field accepts ages 18 to 65.
<br>• Valid partition: 18-65 (test with 30)
<br>• Invalid partition 1: below 18 (test with 10)
<br>• Invalid partition 2: above 65 (test with 70)
<br>With <strong>Each Choice coverage</strong>, when a test object has several parameters, each partition of each set must be used at least once across the test cases.
</div>

<h3>2. Boundary Value Analysis (BVA)</h3>
<p>Practices the boundaries (min/max values) of partitions, since developers are most likely to make off-by-one errors there.</p>
<div class="example-box">
📌 <strong>2-value BVA:</strong> for the 18-65 range, each boundary gives 2 coverage items (the boundary value and its nearest neighbor in the adjacent partition): 17, 18, 65, 66.
<br><strong>3-value BVA:</strong> each boundary gives 3 coverage items (the boundary and both neighbors): 17, 18, 19, 64, 65, 66.
<br>3-value BVA is more rigorous — it can catch off-by-one defects that 2-value BVA misses.
</div>

<h3>3. Decision Table Testing</h3>
<p>Used for business rules: how combinations of <strong>conditions</strong> (top rows) produce different <strong>actions</strong> (bottom rows). Each column is a <strong>rule</strong> combining one value per condition with the resulting actions. The coverage item is the column/rule; 100% coverage means testing every feasible rule.</p>
<div class="example-box">
📌 <strong>Example — online store discount</strong> (conditions: VIP customer? · purchase ≥ €100?):
<table>
  <tr><th></th><th>R1</th><th>R2</th><th>R3</th><th>R4</th></tr>
  <tr><td>VIP customer?</td><td>T</td><td>T</td><td>F</td><td>F</td></tr>
  <tr><td>Purchase ≥ €100?</td><td>T</td><td>F</td><td>T</td><td>F</td></tr>
  <tr><td>Action: 20% discount</td><td>X</td><td></td><td></td><td></td></tr>
  <tr><td>Action: 10% discount</td><td></td><td>X</td><td>X</td><td></td></tr>
  <tr><td>Action: no discount</td><td></td><td></td><td></td><td>X</td></tr>
</table>
Each column (R1-R4) becomes one test case directly: e.g. R2 → VIP customer with an €80 purchase → expect 10% discount.
</div>

<h3>4. State Transition Testing</h3>
<p>Used when behavior depends on the current state and the received event (with an optional guard condition and resulting action). Modeled as a state diagram or state table. A test case is built as a <strong>sequence of events</strong> traversing several states.</p>
<ul>
  <li><strong>All states coverage:</strong> every state is visited at least once (weakest criterion)</li>
  <li><strong>Valid transitions coverage</strong> (also called <em>0-switch coverage</em>): every valid transition is exercised at least once; achieving 100% also guarantees 100% all-states coverage. The most commonly used criterion</li>
  <li><strong>All transitions coverage:</strong> all valid transitions are exercised <u>and</u> invalid (undefined) transitions are also attempted. The strictest criterion, recommended as a minimum for safety/mission-critical systems</li>
</ul>
<div class="example-box">
📌 <strong>Example — ATM machine</strong> (states: Waiting for card → Waiting for PIN → Main menu → Dispensing cash):
<br>A valid-transitions test case walks the full sequence. An invalid-transition test case would attempt, e.g., "withdraw cash" while still in "Waiting for PIN" — testing only one invalid transition per test case avoids defect masking.
</div>

<div class="warning-box">⚠️ <strong>For the exam:</strong> Be able to calculate the number of test cases for EP and BVA, derive rules from a decision table and test cases from a state diagram, and identify which technique applies to a given scenario.</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §4.2</p>
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
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §2.3</p>
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
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §2.3</p>
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
  <tr><td>Avance del proyecto</td><td>Compleción de tareas, uso de recursos, esfuerzo de prueba</td></tr>
  <tr><td>Avance de la prueba</td><td>Casos de prueba implementados/ejecutados, pasados/fallados, tiempo de ejecución</td></tr>
  <tr><td>Calidad de producto</td><td>Disponibilidad, tiempo de respuesta, tiempo medio hasta el fallo</td></tr>
  <tr><td>Defectos</td><td>Número y prioridad de defectos encontrados/corregidos, densidad de defectos</td></tr>
  <tr><td>Riesgo</td><td>Nivel de riesgo residual</td></tr>
  <tr><td>Cobertura</td><td>Cobertura de requisitos, cobertura de código</td></tr>
  <tr><td>Coste</td><td>Coste de la prueba, coste organizativo de la calidad</td></tr>
</table>

<h3>Informes de prueba (Test reports)</h3>
<p>El equipo de testing comunica su progreso mediante informes. Distintos públicos (el propio equipo, gestión, clientes) requieren información distinta e influyen en el grado de formalidad y frecuencia: informar al equipo suele ser frecuente e informal, mientras que un informe de un proyecto finalizado sigue una plantilla formal y se entrega una sola vez. Existen dos tipos principales:</p>
<ul>
  <li><strong>Informe de progreso de pruebas (Test progress report):</strong> Se genera periódicamente durante la ejecución. Incluye estado actual, avance, defectos encontrados y desviaciones del plan.</li>
  <li><strong>Informe de completitud de pruebas (Test completion report):</strong> Se genera al finalizar una fase de testing. Resume los resultados, lecciones aprendidas y recomendaciones para el futuro.</li>
</ul>

<h3>Comunicación del Estado de la Prueba</h3>
<p>La mejor forma de comunicar el estado de la prueba depende de los intereses de la gestión de pruebas, la estrategia de la organización, normas reglamentarias o, en equipos autoorganizados, del propio equipo. Opciones habituales:</p>
<ul>
  <li>Comunicación verbal con el equipo y otros implicados</li>
  <li>Cuadros de mando (paneles de control CI/CD, tableros de tareas, gráficos de quemado)</li>
  <li>Canales de comunicación electrónica (correo, chat)</li>
  <li>Documentación en línea</li>
  <li>Informes formales de prueba</li>
</ul>
<p>Puede usarse más de una opción a la vez; la comunicación formal suele ser más apropiada para equipos distribuidos donde la comunicación directa no siempre es posible.</p>

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
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §5.3</p>
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
  <tr><td>Project progress</td><td>Task completion, resource usage, test effort</td></tr>
  <tr><td>Test progress</td><td>Test cases implemented/executed, passed/failed, execution time</td></tr>
  <tr><td>Product quality</td><td>Availability, response time, mean time to failure</td></tr>
  <tr><td>Defects</td><td>Number and priority of defects found/fixed, defect density</td></tr>
  <tr><td>Risk</td><td>Residual risk level</td></tr>
  <tr><td>Coverage</td><td>Requirements coverage, code coverage</td></tr>
  <tr><td>Cost</td><td>Testing cost, organizational cost of quality</td></tr>
</table>

<h3>Test reports</h3>
<p>The test team communicates progress through reports. Different audiences (the team itself, management, customers) need different information and drive the formality and frequency of reporting: reporting to the team tends to be frequent and informal, while a finished project's report follows a formal template and is delivered once. Two main types:</p>
<ul>
  <li><strong>Test progress report:</strong> Generated periodically during execution. Includes current status, progress, defects found and plan deviations.</li>
  <li><strong>Test completion report:</strong> Generated at the end of a testing phase. Summarizes results, lessons learned and future recommendations.</li>
</ul>

<h3>Communicating Test Status</h3>
<p>The best way to communicate test status depends on test management's concerns, the organization's test strategies, regulatory standards or, for self-organizing teams, the team itself. Common options:</p>
<ul>
  <li>Verbal communication with the team and other stakeholders</li>
  <li>Dashboards (CI/CD dashboards, task boards, burndown charts)</li>
  <li>Electronic communication channels (email, chat)</li>
  <li>Online documentation</li>
  <li>Formal test reports</li>
</ul>
<p>More than one option can be used at once; more formal communication is usually more appropriate for distributed teams where direct face-to-face communication isn't always possible.</p>

<h3>Entry and Exit criteria</h3>
<p><strong>Entry criteria</strong> (Definition of Ready) define conditions that must be met before starting a testing activity.</p>
<p><strong>Exit criteria</strong> (Definition of Done) define when testing is sufficiently complete.</p>

<div class="warning-box">
⚠️ <strong>For the exam:</strong> In agile contexts, entry/exit criteria are often called <em>Definition of Ready</em> and <em>Definition of Done</em> respectively.
</div>

<div class="example-box">
📌 <strong>Control action example:</strong> Monitoring detects only 40% of test cases executed when 70% was expected. Control may involve: reassigning testers, reducing scope, negotiating delivery date or prioritizing highest-risk tests.
</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §5.3</p>
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

<div class="highlight-box">
💡 <strong>DevOps:</strong> La integración continua, la entrega continua y el despliegue continuo suelen implementarse como parte de una canalización automatizada de DevOps, en la que normalmente se incluye la gestión de la configuración automatizada.
</div>
<p class="lesson-source">Fuente: ISTQB CTFL Syllabus v4.0 §5.4</p>
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

<div class="highlight-box">
💡 <strong>DevOps:</strong> Continuous integration, continuous delivery and continuous deployment are usually implemented as part of an automated DevOps pipeline, which typically includes automated configuration management.
</div>
<p class="lesson-source">Source: ISTQB CTFL Syllabus v4.0 §5.4</p>
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
    a: { es: "1. Rol de gestión de pruebas (test management role): responsable de la planificación, monitorización, control y compleción de la prueba. 2. Rol de prueba (testing role): responsable del análisis, diseño, implementación y ejecución de las pruebas. Una misma persona puede desempeñar ambos roles.", en: "1. Test management role: responsible for test planning, monitoring, control and completion. 2. Testing role: responsible for test analysis, design, implementation and execution. The same person may perform both roles." }
  },
  // Chapter 2
  { id: 9, chapter: 1, chapterTag: { es: "Cap. 2 · SDLC", en: "Ch. 2 · SDLC" },
    q: { es: "¿Cuáles son los 5 niveles de prueba del ISTQB?", en: "What are the 5 ISTQB test levels?" },
    a: { es: "1. Prueba de Componentes, 2. Prueba de Integración de Componentes, 3. Prueba de Sistema, 4. Prueba de Integración de Sistemas, 5. Prueba de Aceptación (UAT).", en: "1. Component Testing, 2. Component Integration Testing, 3. System Testing, 4. System Integration Testing, 5. Acceptance Testing (UAT)." }
  },
  { id: 10, chapter: 1, chapterTag: { es: "Cap. 2 · SDLC", en: "Ch. 2 · SDLC" },
    q: { es: "¿Qué es el testing funcional vs. no funcional?", en: "What is functional vs. non-functional testing?" },
    a: { es: "Funcional: verifica QUÉ hace el sistema (comportamiento). No funcional: verifica CÓMO se comporta el sistema, según las 8 características de ISO 25010: rendimiento, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad, portabilidad y seguridad funcional (safety).", en: "Functional: verifies WHAT the system does (behavior). Non-functional: verifies HOW WELL the system behaves, per the 8 ISO 25010 characteristics: performance efficiency, compatibility, usability, reliability, security, maintainability, portability and safety." }
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
    q: { es: "¿Cuáles son los tipos de revisión en el testing estático?", en: "What are the review types in static testing?" },
    a: { es: "1. Revisión informal, 2. Revisión guiada (walkthrough) (guiada por el autor), 3. Revisión técnica (equipo de pares cualificados, dirigida por un moderador), 4. Inspección (la más formal, con roles definidos y métricas).", en: "1. Informal review, 2. Walkthrough (author-led), 3. Technical review (qualified peer team, led by a moderator), 4. Inspection (most formal, with defined roles and metrics)." }
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
    a: { es: "Técnica de caja negra que prueba los valores en los BORDES de las particiones de equivalencia. BVA de 2 valores: dos elementos de cobertura por borde (el valor límite y su vecino más cercano en la partición adyacente). BVA de 3 valores: tres elementos de cobertura por borde (el valor límite y sus dos vecinos); más riguroso que el de 2 valores.", en: "Black-box technique testing values at the BOUNDARIES of equivalence partitions. 2-value BVA: two coverage items per boundary (the boundary value and its closest neighbor in the adjacent partition). 3-value BVA: three coverage items per boundary (the boundary value and both neighbors); more rigorous than 2-value BVA." }
  },
  { id: 18, chapter: 3, chapterTag: { es: "Cap. 4 · Técnicas", en: "Ch. 4 · Techniques" },
    q: { es: "¿Para qué se usan las Tablas de Decisión?", en: "When are Decision Tables used?" },
    a: { es: "Para probar combinaciones de condiciones (lógica de negocio compleja). Cada columna es una 'regla' que combina condiciones con resultados. En una tabla de decisión COMPLETA (full), el número de reglas = 2^n (n = número de condiciones); las tablas simplificadas o minimizadas tienen menos columnas.", en: "For testing combinations of conditions (complex business logic). Each column is a 'rule' combining conditions with outcomes. In a FULL decision table, the number of rules = 2^n (n = number of conditions); simplified or minimized tables have fewer columns." }
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
    a: { es: "Ahorro de tiempo al reducir el trabajo manual repetitivo, prevención de errores humanos simples (mayor consistencia y repetibilidad), evaluación más objetiva (p. ej. cobertura), acceso más fácil a información para la gestión y el informe de pruebas, y reducción del tiempo de ejecución (detección más temprana de defectos, retroalimentación más rápida).", en: "Time saved by reducing repetitive manual work, prevention of simple human errors (greater consistency and repeatability), more objective assessment (e.g. coverage), easier access to information for test management and reporting, and reduced test execution times (earlier defect detection, faster feedback)." }
  },
  { id: 28, chapter: 5, chapterTag: { es: "Cap. 6 · Herramientas", en: "Ch. 6 · Tools" },
    q: { es: "¿Cuáles son los riesgos de la automatización de pruebas?", en: "What are the risks of test automation?" },
    a: { es: "Expectativas poco realistas sobre los beneficios de la herramienta, estimaciones imprecisas de tiempo/coste/esfuerzo (introducción, mantenimiento de scripts, cambio del proceso manual), usar la herramienta cuando la prueba manual es más apropiada, depender demasiado de la herramienta (ignorar el pensamiento crítico humano), dependencia del proveedor, e incompatibilidad con la plataforma de desarrollo.", en: "Unrealistic expectations about the tool's benefits, inaccurate estimations of time/cost/effort (introduction, script maintenance, changing the manual process), using the tool when manual testing is more appropriate, relying on the tool too much (ignoring human critical thinking), tool vendor dependency, and incompatibility with the development platform." }
  }
];

/* ===================================================
   GLOSSARY
   =================================================== */
const GLOSSARY = [
  { term: { es: "Prueba", en: "Testing" }, def: { es: "Conjunto de actividades para descubrir defectos y evaluar la calidad de artefactos de software.", en: "Set of activities to discover defects and evaluate the quality of software artifacts." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.1" },
  { term: { es: "Defecto", en: "Defect" }, def: { es: "Imperfección en un componente o sistema que puede causar que el componente o sistema falle en realizar su función requerida.", en: "Imperfection in a component or system that can cause it to fail to perform its required function." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.2.3" },
  { term: { es: "Error", en: "Error" }, def: { es: "Acción humana que produce un resultado incorrecto, que introduce un defecto en el sistema.", en: "Human action that produces an incorrect result, introducing a defect into the system." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.2.3" },
  { term: { es: "Fallo", en: "Failure" }, def: { es: "Evento en el cual un componente o sistema no realiza una función requerida dentro de los límites especificados.", en: "Event in which a component or system does not perform a required function within specified limits." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.2.3" },
  { term: { es: "Causa raíz", en: "Root cause" }, def: { es: "Razón fundamental por la que ocurre un problema. La eliminación de la causa raíz evita la recurrencia del defecto.", en: "Fundamental reason why a problem occurs. Removing the root cause prevents defect recurrence." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.2.3" },
  { term: { es: "Calidad", en: "Quality" }, def: { es: "Grado en el que un componente o sistema satisface las necesidades indicadas e implícitas de sus partes interesadas.", en: "Degree to which a component or system satisfies the stated and implied needs of its stakeholders." }, chapter: "1", source: "Syllabus v4.0 keywords §1" },
  { term: { es: "Aseguramiento de la calidad", en: "Quality assurance (QA)" }, def: { es: "Actividades que se centran en proporcionar confianza en que los requisitos de calidad se cumplirán.", en: "Activities focused on providing confidence that quality requirements will be fulfilled." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.2.2" },
  { term: { es: "Verificación", en: "Verification" }, def: { es: "Confirmación de que el software cumple con los requisitos especificados.", en: "Confirmation that software meets specified requirements." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.1" },
  { term: { es: "Validación", en: "Validation" }, def: { es: "Confirmación de que el software satisface las necesidades y expectativas del usuario o cliente.", en: "Confirmation that software satisfies the needs and expectations of the user or customer." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.1" },
  { term: { es: "Producto de prueba", en: "Testware" }, def: { es: "Artefactos producidos durante el proceso de prueba: planes, casos, scripts, datos, informes.", en: "Artifacts produced during the test process: plans, cases, scripts, data, reports." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.3" },
  { term: { es: "Trazabilidad", en: "Traceability" }, def: { es: "Capacidad de identificar relaciones entre productos de trabajo de testing y requisitos u otros artefactos.", en: "Ability to identify relationships between test work products and requirements or other artifacts." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.4" },
  { term: { es: "Cobertura", en: "Coverage" }, def: { es: "Grado, expresado normalmente en porcentaje, en el que un conjunto especificado de elementos o criterios (p. ej. requisitos, código) ha sido ejercitado por un conjunto de pruebas.", en: "The degree, usually expressed as a percentage, to which a specified set of elements or criteria (e.g., requirements, code) has been exercised by a test suite." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.4" },
  { term: { es: "Depuración", en: "Debugging" }, def: { es: "Proceso de encontrar, analizar y eliminar las causas de los fallos en el software. Es una actividad de desarrollo, distinta del testing, que identifica los fallos.", en: "The process of finding, analyzing and removing the causes of failures in software. It is a development activity, distinct from testing, which identifies the failures." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.1.2" },
  { term: { es: "Análisis de prueba", en: "Test analysis" }, def: { es: "Actividad del proceso de prueba en la que se analiza la base de prueba para identificar características evaluables y definir las condiciones de prueba, respondiendo a la pregunta «qué probar».", en: "Test process activity in which the test basis is analyzed to identify testable features and define test conditions, answering the question \"what to test\"." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Base de prueba", en: "Test basis" }, def: { es: "Conjunto de información (requisitos, historias de usuario, diseño, código, riesgos...) que se usa como base para el análisis y el diseño de las pruebas.", en: "The body of information (requirements, user stories, design, code, risks...) used as the basis for test analysis and design." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Caso de prueba", en: "Test case" }, def: { es: "Conjunto de precondiciones, entradas, acciones, resultados esperados y postcondiciones desarrollado a partir de las condiciones de prueba durante el diseño de la prueba.", en: "A set of preconditions, inputs, actions, expected results and postconditions, elaborated from test conditions during test design." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Compleción de la prueba", en: "Test completion" }, def: { es: "Actividad del proceso de prueba, habitual en los hitos del proyecto, en la que se archiva el testware útil, se cierra el entorno de prueba y se elabora el informe de compleción de la prueba.", en: "Test process activity, typically performed at project milestones, in which useful testware is archived, the test environment is shut down, and a test completion report is produced." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Condición de prueba", en: "Test condition" }, def: { es: "Elemento o evento identificable de un componente o sistema, como una función o un requisito, que puede verificarse mediante uno o más casos de prueba.", en: "An identifiable element or event of a component or system, such as a function or a requirement, that can be verified by one or more test cases." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Control de la prueba", en: "Test control" }, def: { es: "Actividad de gestión de la prueba consistente en tomar las acciones necesarias para cumplir los objetivos de prueba, a partir de la información obtenida por la monitorización de la prueba.", en: "Test management activity that involves taking the actions necessary to meet the test objectives, based on information from test monitoring." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Datos de prueba", en: "Test data" }, def: { es: "Datos que existen, por ejemplo en una base de datos, antes de la ejecución de una prueba y que se usan para, o se ven afectados por, el componente o sistema bajo prueba.", en: "Data that exists, e.g., in a database, before test execution and is used for, or affected by, the component or system under test." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Diseño de la prueba", en: "Test design" }, def: { es: "Actividad del proceso de prueba en la que las condiciones de prueba se desarrollan en casos de prueba y otro testware, respondiendo a la pregunta «cómo probar».", en: "Test process activity in which test conditions are elaborated into test cases and other testware, answering the question \"how to test\"." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Ejecución de prueba", en: "Test execution" }, def: { es: "Actividad del proceso de prueba en la que las pruebas se ejecutan conforme a la planificación de ejecución y los resultados reales se comparan con los esperados.", en: "Test process activity in which tests are run according to the test execution schedule and the actual results are compared with the expected results." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Implementación de prueba", en: "Test implementation" }, def: { es: "Actividad del proceso de prueba en la que se crea o adquiere el testware necesario para la ejecución de la prueba, organizando los casos de prueba en procedimientos de prueba.", en: "Test process activity in which the testware needed for test execution is created or acquired, organizing test cases into test procedures." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Monitorización de la prueba", en: "Test monitoring" }, def: { es: "Actividad de gestión de la prueba consistente en la comprobación continua de todas las actividades de prueba y la comparación del progreso real con lo planificado.", en: "Test management activity that involves the ongoing checking of all test activities and comparing actual progress against the plan." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Objeto de prueba", en: "Test object" }, def: { es: "Producto de trabajo (componente, sistema o especificación) que es sometido a testing.", en: "The work product (component, system, or specification) being tested." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.1" },
  { term: { es: "Objetivo de prueba", en: "Test objective" }, def: { es: "Razón o propósito que guía el diseño y la ejecución de una prueba, como encontrar defectos, generar confianza o evaluar la calidad de un objeto de prueba.", en: "A reason or purpose for designing and executing a test, such as finding defects, gaining confidence, or evaluating the quality of a test object." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.1.1" },
  { term: { es: "Planificación de prueba", en: "Test planning" }, def: { es: "Actividad del proceso de prueba que consiste en definir los objetivos de prueba y seleccionar el enfoque que mejor los alcanza dentro de las restricciones del contexto.", en: "Test process activity that consists of defining the test objectives and selecting the approach that best achieves them within the constraints of the context." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Procedimiento de prueba", en: "Test procedure" }, def: { es: "Secuencia de casos de prueba en el orden de ejecución, junto con las acciones asociadas necesarias para llevarlos a cabo.", en: "A sequence of test cases in execution order, together with the associated actions required to carry them out." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Proceso de prueba", en: "Test process" }, def: { es: "Conjunto de actividades de prueba (planificación, monitorización, control, análisis, diseño, implementación, ejecución y compleción) organizadas para alcanzar los objetivos de prueba, adaptable al contexto del proyecto.", en: "The set of test activities (planning, monitoring, control, analysis, design, implementation, execution and completion) organized to achieve the test objectives, tailored to the project context." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4" },
  { term: { es: "Resultado de prueba", en: "Test result" }, def: { es: "Indicación, obtenida al ejecutar una prueba, de si el software se comportó o no como se esperaba en una prueba específica.", en: "An indication, obtained from executing a test, of whether or not the software behaved as expected for a specific test." }, chapter: "1", source: "Syllabus v4.0 keywords §1 · §1.4.1" },
  { term: { es: "Prueba de componentes", en: "Component testing" }, def: { es: "Nivel de prueba que verifica componentes individuales del software en aislamiento.", en: "Test level that verifies individual software components in isolation." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.1" },
  { term: { es: "Prueba de integración", en: "Integration testing" }, def: { es: "Nivel de prueba que verifica la interacción entre componentes o sistemas integrados.", en: "Test level that verifies the interaction between integrated components or systems." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.1" },
  { term: { es: "Prueba de sistema", en: "System testing" }, def: { es: "Nivel de prueba que verifica el comportamiento del sistema completo de extremo a extremo.", en: "Test level that verifies the behavior of the complete system end-to-end." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.1" },
  { term: { es: "Prueba de aceptación", en: "Acceptance testing" }, def: { es: "Nivel de prueba realizado para determinar si el sistema cumple con los criterios de aceptación del negocio.", en: "Test level performed to determine if the system meets business acceptance criteria." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.1" },
  { term: { es: "Prueba funcional", en: "Functional testing" }, def: { es: "Pruebas que verifican lo que el sistema HACE, basadas en las funciones requeridas.", en: "Tests that verify what the system DOES, based on required functions." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.2" },
  { term: { es: "Prueba no funcional", en: "Non-functional testing" }, def: { es: "Pruebas que evalúan atributos distintos de las características funcionales (cómo se comporta el sistema). ISO/IEC 25010 clasifica ocho características: rendimiento (eficiencia de desempeño), compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad, portabilidad y seguridad funcional (safety).", en: "Tests that evaluate attributes other than functional characteristics (how well the system behaves). ISO/IEC 25010 classifies eight characteristics: performance efficiency, compatibility, usability, reliability, security, maintainability, portability and safety." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.2" },
  { term: { es: "Prueba de regresión", en: "Regression testing" }, def: { es: "Pruebas que verifican que los cambios no han introducido nuevos defectos en áreas que funcionaban correctamente.", en: "Tests that verify changes haven't introduced new defects in areas that previously worked correctly." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.3" },
  { term: { es: "Testing de humo", en: "Smoke test" }, def: { es: "Conjunto básico de pruebas que verifican las funcionalidades más críticas para confirmar que el sistema puede ser probado más a fondo.", en: "Basic set of tests verifying the most critical functionalities to confirm the system can be further tested." }, chapter: "2", source: "Syllabus v4.0 §5.1.3 (ejemplo de criterio de entrada: 'initial quality level of a test object, e.g., all smoke tests have passed')" },
  { term: { es: "Prueba alfa", en: "Alpha testing" }, def: { es: "Prueba de aceptación realizada por usuarios en el sitio del desarrollador.", en: "Acceptance testing performed by users at the developer's site." }, chapter: "2", source: "Syllabus v4.0 §2.2.1" },
  { term: { es: "Prueba beta", en: "Beta testing" }, def: { es: "Prueba de aceptación realizada por usuarios en su propio entorno antes del lanzamiento general.", en: "Acceptance testing performed by users in their own environment before general release." }, chapter: "2", source: "Syllabus v4.0 §2.2.1" },
  { term: { es: "Nivel de prueba", en: "Test level" }, def: { es: "Grupo de actividades de prueba organizadas y gestionadas en conjunto, correspondiente a una instancia del proceso de prueba realizada sobre el software en una fase de desarrollo dada (de componentes individuales a sistemas completos).", en: "A group of test activities that are organized and managed together, corresponding to an instance of the test process performed in relation to software at a given phase of development, from individual components to complete systems." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2" },
  { term: { es: "Tipo de prueba", en: "Test type" }, def: { es: "Grupo de actividades de prueba relacionadas con características de calidad específicas (p. ej. funcionalidad, caja blanca, caja negra), que pueden realizarse en cualquier nivel de prueba.", en: "A group of test activities related to specific quality characteristics (e.g., functional, white-box, black-box), most of which can be performed at any test level." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2" },
  { term: { es: "Prueba de integración de componentes", en: "Component integration testing" }, def: { es: "Nivel de prueba centrado en las interfaces e interacciones entre componentes, muy dependiente de la estrategia de integración (bottom-up, top-down o big-bang).", en: "Test level focused on the interfaces and interactions between components, heavily dependent on the integration strategy (bottom-up, top-down or big-bang)." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.1" },
  { term: { es: "Prueba de integración de sistemas", en: "System integration testing" }, def: { es: "Nivel de prueba centrado en las interfaces del sistema bajo prueba con otros sistemas y servicios externos, que requiere entornos de prueba similares al operacional.", en: "Test level focused on the interfaces of the system under test with other systems and external services, requiring test environments similar to the operational one." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.1" },
  { term: { es: "Prueba de caja negra", en: "Black-box testing" }, def: { es: "Tipo de prueba basado en especificaciones, que deriva los casos de prueba de la documentación sin considerar la estructura interna del objeto de prueba.", en: "Specification-based test type that derives tests from documentation, without considering the internal structure of the test object." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.2" },
  { term: { es: "Prueba de caja blanca", en: "White-box testing" }, def: { es: "Tipo de prueba basado en la estructura, que deriva los casos de prueba de la implementación o estructura interna del sistema (código, arquitectura, flujos de trabajo o de datos).", en: "Structure-based test type that derives tests from the implementation or internal structure of the system (code, architecture, work flows and data flows)." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.2" },
  { term: { es: "Prueba de confirmación", en: "Confirmation testing" }, def: { es: "Tipo de prueba dinámica realizada tras corregir un defecto, para comprobar que la corrección lo ha resuelto; idealmente la realiza la misma persona que ejecutó la prueba original.", en: "Dynamic test type performed after a defect is fixed, to check whether the fix resolved the problem; ideally performed by the same person who ran the original test." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.2.3" },
  { term: { es: "Prueba de mantenimiento", en: "Maintenance testing" }, def: { es: "Prueba de un sistema operacional ya desplegado, motivada por modificaciones, migraciones o el retiro del sistema, que evalúa tanto el cambio realizado como posibles regresiones en el resto del sistema.", en: "Testing of an already-deployed operational system, triggered by modifications, upgrades/migrations or retirement, evaluating both the change made and possible regressions in the rest of the system." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.3" },
  { term: { es: "Revisión", en: "Review" }, def: { es: "Proceso estático que evalúa los productos de trabajo de software para encontrar defectos antes de la ejecución.", en: "Static process evaluating software work products to find defects before execution." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2" },
  { term: { es: "Inspección", en: "Inspection" }, def: { es: "Tipo más formal de revisión estática, con roles definidos, métricas y criterios de entrada/salida.", en: "Most formal type of static review, with defined roles, metrics and entry/exit criteria." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2.4" },
  { term: { es: "Revisión guiada", en: "Walkthrough" }, def: { es: "Tipo de revisión guiada por el autor, donde el equipo sigue la lógica del producto paso a paso.", en: "Review type guided by the author, where the team follows the product logic step by step." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2.4" },
  { term: { es: "Análisis estático", en: "Static analysis" }, def: { es: "Evaluación automatizada del código sin ejecutarlo, para detectar defectos de código y violaciones de estándares.", en: "Automated evaluation of code without executing it, to detect code defects and standard violations." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.1" },
  { term: { es: "Prueba estática", en: "Static testing" }, def: { es: "Testing que no implica la ejecución del software; incluye las revisiones y el análisis estático, y permite encontrar defectos directamente en el producto de trabajo.", en: "Testing that does not involve the execution of software; it includes reviews and static analysis, and can directly find defects in the work product." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.1.3" },
  { term: { es: "Prueba dinámica", en: "Dynamic testing" }, def: { es: "Testing que implica la ejecución del software, a diferencia de la prueba estática, y que provoca fallos para encontrar defectos.", en: "Testing that involves the execution of software, as opposed to static testing, causing failures in order to find defects." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.1.3" },
  { term: { es: "Anomalía", en: "Anomaly" }, def: { es: "Condición que se desvía de lo esperado; en revisiones, los defectos potenciales detectados en el producto de trabajo se registran como anomalías.", en: "A condition that deviates from expectation; in reviews, potential defects found in the work product are logged as anomalies." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2.2" },
  { term: { es: "Revisión informal", en: "Informal review" }, def: { es: "Tipo de revisión que no sigue un proceso definido ni requiere una salida documentada formal; su objetivo principal es detectar anomalías.", en: "Review type that does not follow a defined process and does not require formal documented output; its main objective is detecting anomalies." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2.4" },
  { term: { es: "Revisión formal", en: "Formal review" }, def: { es: "Revisión que sigue un proceso definido y documentado, con roles, criterios de entrada/salida y métricas; la inspección es el tipo más formal.", en: "Review that follows a defined and documented process, with roles, entry/exit criteria and metrics; inspection is the most formal type." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2" },
  { term: { es: "Revisión técnica", en: "Technical review" }, def: { es: "Revisión realizada por revisores técnicamente cualificados y liderada por un moderador, cuyos objetivos son alcanzar consenso y tomar decisiones sobre un problema técnico, además de detectar anomalías.", en: "Review performed by technically qualified reviewers and led by a moderator, whose objectives are to gain consensus and make decisions on a technical problem, as well as detecting anomalies." }, chapter: "3", source: "Syllabus v4.0 keywords §3 · §3.2.4" },
  { term: { es: "Partición de equivalencia", en: "Equivalence partitioning (EP)" }, def: { es: "Técnica de caja negra que divide las entradas en particiones donde todos los valores se comportan igual.", en: "Black-box technique dividing inputs into partitions where all values behave the same." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.2.1" },
  { term: { es: "Análisis del valor frontera", en: "Boundary value analysis (BVA)" }, def: { es: "Técnica de caja negra que prueba los valores en los bordes de las particiones de equivalencia.", en: "Black-box technique testing values at the edges of equivalence partitions." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.2.2" },
  { term: { es: "Prueba de tabla de decisión", en: "Decision table testing" }, def: { es: "Técnica de caja negra para probar combinaciones de condiciones lógicas y sus acciones resultantes.", en: "Black-box technique for testing combinations of logical conditions and their resulting actions." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.2.3" },
  { term: { es: "Prueba de transición de estado", en: "State transition testing" }, def: { es: "Técnica de caja negra para probar sistemas cuyo comportamiento depende del estado actual y del evento recibido.", en: "Black-box technique for testing systems whose behavior depends on the current state and received event." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.2.4" },
  { term: { es: "Cobertura de sentencia", en: "Statement coverage" }, def: { es: "Técnica de caja blanca que mide el porcentaje de sentencias ejecutables ejecutadas por los tests.", en: "White-box technique measuring the percentage of executable statements executed by tests." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.3.1" },
  { term: { es: "Cobertura de rama", en: "Branch coverage" }, def: { es: "Técnica de caja blanca que mide el porcentaje de ramas del flujo de control ejecutadas (más fuerte que statement coverage).", en: "White-box technique measuring the percentage of control flow branches executed (stronger than statement coverage)." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.3.2" },
  { term: { es: "Prueba exploratoria", en: "Exploratory testing" }, def: { es: "Técnica basada en experiencia donde el diseño y la ejecución de pruebas ocurren simultáneamente, sin scripts predefinidos.", en: "Experience-based technique where test design and execution happen simultaneously, without predefined scripts." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.4.2" },
  { term: { es: "Predicción de errores", en: "Error guessing" }, def: { es: "Técnica basada en experiencia donde el tester usa intuición y experiencia para anticipar tipos de errores comunes.", en: "Experience-based technique where the tester uses intuition and experience to anticipate common error types." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.4.1" },
  { term: { es: "Desarrollo guiado por prueba de aceptación (ATDD)", en: "Acceptance test-driven development" }, def: { es: "Acceptance Test-Driven Development: técnica donde los tests de aceptación se crean antes del desarrollo con participación de todo el equipo.", en: "Acceptance Test-Driven Development: technique where acceptance tests are created before development with full team participation." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.5.3" },
  { term: { es: "Técnica de prueba", en: "Test technique" }, def: { es: "Procedimiento sistemático usado en el análisis y diseño de la prueba para derivar condiciones de prueba, elementos de cobertura y casos de prueba; se clasifican en técnicas de caja negra, de caja blanca y basadas en la experiencia.", en: "Systematic procedure used during test analysis and design to derive test conditions, coverage items, and test cases; classified as black-box, white-box, and experience-based techniques." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.1" },
  { term: { es: "Técnica de prueba de caja negra", en: "Black-box test technique" }, def: { es: "Categoría de técnicas de diseño de casos de prueba, también llamada basada en especificación, que deriva los casos de prueba del comportamiento especificado del objeto de prueba sin considerar su estructura interna (p. ej. partición de equivalencia). Distinta de 'prueba de caja negra' (tipo de prueba, cap. 2): esta es la técnica de diseño, no el tipo de prueba.", en: "Category of test case design techniques, also known as specification-based, that derives test cases from the specified behavior of the test object without considering its internal structure (e.g., equivalence partitioning). Distinct from 'black-box testing' (test type, ch. 2): this is the design technique, not the test type." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.1" },
  { term: { es: "Técnica de prueba de caja blanca", en: "White-box test technique" }, def: { es: "Categoría de técnicas de diseño de casos de prueba, también llamada basada en la estructura, que deriva los casos de prueba del análisis de la estructura interna y el procesamiento del objeto de prueba (p. ej. cobertura de sentencia, cobertura de rama). Distinta de 'prueba de caja blanca' (tipo de prueba, cap. 2): esta es la técnica de diseño, no el tipo de prueba.", en: "Category of test case design techniques, also known as structure-based, that derives test cases from an analysis of the test object's internal structure and processing (e.g., statement coverage, branch coverage). Distinct from 'white-box testing' (test type, ch. 2): this is the design technique, not the test type." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.1" },
  { term: { es: "Técnica de prueba basada en la experiencia", en: "Experience-based test technique" }, def: { es: "Categoría de técnicas de diseño de casos de prueba que aprovecha el conocimiento y la experiencia del probador; detecta defectos que las técnicas de caja negra y caja blanca pueden pasar por alto, por lo que las complementa (p. ej. prueba exploratoria, predicción de errores).", en: "Category of test case design techniques that effectively uses the tester's knowledge and experience; it can detect defects missed by black-box and white-box techniques, making it complementary to them (e.g., exploratory testing, error guessing)." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.1" },
  { term: { es: "Elemento de cobertura", en: "Coverage item" }, def: { es: "Atributo o combinación de atributos derivado de la base de prueba que una técnica de prueba usa como objetivo de cobertura (p. ej. particiones, ramas, transiciones, sentencias).", en: "An attribute or combination of attributes derived from the test basis that a test technique uses as a coverage target (e.g., partitions, branches, transitions, statements)." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.1" },
  { term: { es: "Prueba basada en lista de comprobación", en: "Checklist-based testing" }, def: { es: "Técnica basada en la experiencia en la que el probador diseña, implementa y ejecuta pruebas para cubrir las condiciones de una lista de comprobación construida a partir de la experiencia o del conocimiento de cómo falla el software.", en: "Experience-based technique in which the tester designs, implements, and executes tests to cover the conditions of a checklist built from experience or knowledge of how software fails." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.4.3" },
  { term: { es: "Enfoque de prueba basado en la colaboración", en: "Collaboration-based test approach" }, def: { es: "Enfoque de prueba que, a diferencia de las técnicas de caja negra, caja blanca y basadas en la experiencia, se centra también en la prevención de defectos mediante la colaboración y la comunicación (p. ej. redacción colaborativa de historias de usuario).", en: "Test approach that, unlike black-box, white-box, and experience-based techniques, also focuses on defect prevention through collaboration and communication (e.g., collaborative user story writing)." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.5" },
  { term: { es: "Criterios de aceptación", en: "Acceptance criteria" }, def: { es: "Condiciones que debe cumplir la implementación de una historia de usuario para ser aceptada por los interesados; se redactan en formato orientado a escenarios (Given/When/Then) o a reglas.", en: "Conditions that an implementation of a user story must meet to be accepted by stakeholders; written in a scenario-oriented (Given/When/Then) or rule-oriented format." }, chapter: "4", source: "Syllabus v4.0 keywords §4 · §4.5.2" },
  { term: { es: "Plan de prueba", en: "Test plan" }, def: { es: "Documento que describe el enfoque, recursos, alcance, criterios y actividades de testing para un proyecto.", en: "Document describing the testing approach, resources, scope, criteria and activities for a project." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.1.1" },
  { term: { es: "Riesgo de producto", en: "Product risk" }, def: { es: "Posibilidad de que el producto de software no cumpla con su función esperada o los requisitos de calidad.", en: "Possibility that the software product won't fulfill its expected function or quality requirements." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.2" },
  { term: { es: "Riesgo de proyecto", en: "Project risk" }, def: { es: "Posibilidad de que el proyecto no logre sus objetivos de alcance, tiempo o presupuesto.", en: "Possibility that the project won't achieve its scope, time or budget objectives." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.2" },
  { term: { es: "Criterios de entrada", en: "Entry criteria" }, def: { es: "Condiciones que deben cumplirse para iniciar una actividad de testing.", en: "Conditions that must be met to start a testing activity." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.1.3" },
  { term: { es: "Criterios de salida", en: "Exit criteria" }, def: { es: "Condiciones que deben cumplirse para completar una actividad de testing.", en: "Conditions that must be met to complete a testing activity." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.1.3" },
  { term: { es: "Métricas de prueba", en: "Test metrics" }, def: { es: "Medidas cuantitativas usadas para gestionar y controlar el proceso de testing (cobertura, densidad de defectos, etc.).", en: "Quantitative measures used to manage and control the test process (coverage, defect density, etc.)." }, chapter: "5", source: "Syllabus v4.0 §5.3.1" },
  { term: { es: "Gestión de la configuración", en: "Configuration management" }, def: { es: "Disciplina para controlar y registrar la evolución de los artefactos de software y testware a lo largo del proyecto.", en: "Discipline for controlling and recording the evolution of software and testware artifacts throughout the project." }, chapter: "5", source: "Syllabus v4.0 §5.4" },
  { term: { es: "Severidad", en: "Severity" }, def: { es: "Grado de impacto técnico que tiene un defecto sobre el sistema.", en: "Degree of technical impact a defect has on the system." }, chapter: "5", source: "Foundations of Software Testing (ISTQB Certification) — cap. 5.6.2, Informe de incidencias (severidad y prioridad de defectos)" },
  { term: { es: "Prioridad", en: "Priority" }, def: { es: "Urgencia con la que debe corregirse un defecto.", en: "Urgency with which a defect must be fixed." }, chapter: "5", source: "Foundations of Software Testing (ISTQB Certification) — cap. 5.6.2, Informe de incidencias (severidad y prioridad de defectos)" },
  { term: { es: "Gestión de defectos", en: "Defect management" }, def: { es: "Proceso de capturar, investigar, resolver y cerrar los defectos encontrados durante el testing.", en: "Process of capturing, investigating, resolving and closing defects found during testing." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.5" },
  { term: { es: "Riesgo", en: "Risk" }, def: { es: "Evento, peligro, amenaza o situación potencial cuya ocurrencia produce un efecto adverso; se caracteriza por su probabilidad de ocurrencia y su impacto.", en: "A potential event, hazard, threat or situation whose occurrence has an adverse effect; characterized by its likelihood of occurrence and its impact." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.1" },
  { term: { es: "Nivel de riesgo", en: "Risk level" }, def: { es: "Medida del riesgo derivada de la combinación de su probabilidad y su impacto; cuanto mayor es el nivel de riesgo, más importante es su tratamiento.", en: "A measure of a risk, derived from the combination of its likelihood and its impact; the higher the risk level, the more important its treatment." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.1" },
  { term: { es: "Gestión del riesgo", en: "Risk management" }, def: { es: "Conjunto de actividades coordinadas para dirigir y controlar una organización con respecto al riesgo; en testing comprende el análisis del riesgo (identificación y evaluación) y el control del riesgo (mitigación y monitorización).", en: "The coordinated set of activities to direct and control an organization with regard to risk; in testing it comprises risk analysis (identification and assessment) and risk control (mitigation and monitoring)." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2" },
  { term: { es: "Prueba basada en el riesgo", en: "Risk-based testing" }, def: { es: "Enfoque en el que las actividades de prueba se seleccionan, priorizan y gestionan según el análisis y el nivel de los riesgos de producto.", en: "An approach where test activities are selected, prioritized and managed based on the analysis and level of product risks." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2" },
  { term: { es: "Identificación del riesgo", en: "Risk identification" }, def: { es: "Actividad del análisis del riesgo consistente en generar una lista exhaustiva de riesgos, usando técnicas como la tormenta de ideas, talleres, entrevistas o diagramas causa-efecto.", en: "Risk analysis activity that consists of generating a comprehensive list of risks, using techniques such as brainstorming, workshops, interviews or cause-effect diagrams." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.3" },
  { term: { es: "Evaluación del riesgo", en: "Risk assessment" }, def: { es: "Actividad del análisis del riesgo que categoriza los riesgos identificados, determina su probabilidad, impacto y nivel, los prioriza y propone cómo tratarlos.", en: "Risk analysis activity that categorizes identified risks, determines their likelihood, impact and level, prioritizes them, and proposes ways to handle them." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.3" },
  { term: { es: "Análisis del riesgo", en: "Risk analysis" }, def: { es: "Actividad de gestión del riesgo que engloba la identificación del riesgo y la evaluación del riesgo; su objetivo es dar visibilidad del riesgo de producto para enfocar el esfuerzo de prueba y minimizar el nivel residual de riesgo.", en: "Risk management activity comprising risk identification and risk assessment; its goal is to provide awareness of product risk in order to focus the test effort and minimize the residual level of risk." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.3" },
  { term: { es: "Control del riesgo", en: "Risk control" }, def: { es: "Actividad de gestión del riesgo que engloba la mitigación del riesgo y la monitorización del riesgo; comprende todas las medidas tomadas en respuesta a los riesgos de producto identificados y evaluados.", en: "Risk management activity comprising risk mitigation and risk monitoring; it covers all the measures taken in response to identified and assessed product risks." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.4" },
  { term: { es: "Mitigación del riesgo", en: "Risk mitigation" }, def: { es: "Actividad de control del riesgo que implementa las acciones propuestas en la evaluación del riesgo para reducir el nivel de riesgo (p. ej. aplicar técnicas de prueba adecuadas, realizar revisiones).", en: "Risk control activity that implements the actions proposed in risk assessment to reduce the risk level (e.g., applying appropriate test techniques, performing reviews)." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.4" },
  { term: { es: "Monitorización del riesgo", en: "Risk monitoring" }, def: { es: "Actividad de control del riesgo cuyo objetivo es comprobar que las acciones de mitigación son efectivas, obtener información adicional para mejorar la evaluación del riesgo e identificar riesgos emergentes.", en: "Risk control activity aimed at checking that mitigation actions are effective, obtaining further information to improve risk assessment, and identifying emerging risks." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.2.4" },
  { term: { es: "Informe de defecto", en: "Defect report" }, def: { es: "Documento que registra un defecto o anomalía detectada durante la prueba, aportando la información necesaria (identificador único, título, entorno, pasos, resultados esperados/reales, severidad, prioridad, estado) para su análisis y resolución.", en: "A document that records a defect or anomaly detected during testing, providing the information needed (unique identifier, title, environment, steps, expected/actual results, severity, priority, status) for its analysis and resolution." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.5" },
  { term: { es: "Enfoque de prueba", en: "Test approach" }, def: { es: "Conjunto de decisiones de testing para un proyecto —niveles y tipos de prueba, técnicas, entregables, criterios de entrada y salida, independencia de la prueba, métricas, requisitos de datos y de entorno— documentado como parte del plan de prueba.", en: "The set of testing decisions for a project — test levels, test types, techniques, deliverables, entry and exit criteria, independence of testing, metrics, data and environment requirements — documented as part of the test plan." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.1.1" },
  { term: { es: "Estrategia de prueba", en: "Test strategy" }, def: { es: "Enfoque general, típicamente a nivel de organización o programa, que establece las reglas de alto nivel sobre cómo se abordará el testing; el plan de prueba debe demostrar que se ajusta a la estrategia de prueba existente (o justificar por qué se desvía).", en: "A general, typically organization- or program-level approach that sets the high-level rules for how testing will be addressed; the test plan must demonstrate adherence to the existing test strategy (or explain why it deviates)." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.1.1; Foundations of Software Testing (ISTQB Certification) — cap. 1.4.2, Planificación y control de la prueba" },
  { term: { es: "Informe de compleción de la prueba", en: "Test completion report" }, def: { es: "Informe elaborado durante la compleción de la prueba que resume una actividad de prueba concreta (nivel, ciclo, iteración) usando los informes de avance y otros datos; incluye resumen, evaluación frente al plan, desviaciones, riesgos no mitigados y lecciones aprendidas.", en: "A report prepared during test completion that summarizes a specific test activity (test level, cycle, iteration) using test progress reports and other data; it includes a summary, evaluation against the plan, deviations, unmitigated risks and lessons learned." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.3.2" },
  { term: { es: "Informe del avance de la prueba", en: "Test progress report" }, def: { es: "Informe generado periódicamente durante la monitorización y el control de la prueba para mantener informados a los interesados; incluye el progreso, impedimentos, métricas de prueba y riesgos nuevos o modificados.", en: "A report generated periodically during test monitoring and test control to keep stakeholders informed; it includes progress, impediments, test metrics and new or changed risks." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.3.2" },
  { term: { es: "Pirámide de prueba", en: "Test pyramid" }, def: { es: "Modelo que muestra que las distintas pruebas pueden tener diferente granularidad, organizadas en capas: cuanta más alta la capa, menor la granularidad y la aislación, y mayor el tiempo de ejecución; apoya al equipo en la automatización y en la asignación del esfuerzo de prueba.", en: "A model showing that different tests can have different granularity, organized in layers: the higher the layer, the lower the granularity and isolation, and the higher the execution time; it supports the team in test automation and test effort allocation." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.1.6" },
  { term: { es: "Cuadrantes de prueba", en: "Testing quadrants" }, def: { es: "Modelo, definido por Brian Marick, que agrupa los niveles de prueba con los tipos de prueba, actividades, técnicas y productos de trabajo apropiados en el desarrollo ágil, según si las pruebas están orientadas al negocio o a la tecnología, y si apoyan al equipo o critican el producto.", en: "A model, defined by Brian Marick, that groups test levels with the appropriate test types, activities, techniques and work products in Agile development, based on whether tests are business- or technology-facing, and whether they support the team or critique the product." }, chapter: "5", source: "Syllabus v4.0 keywords §5 · §5.1.7" },
  { term: { es: "Prueba de rendimiento", en: "Performance testing" }, def: { es: "Pruebas que evalúan la velocidad, escalabilidad y estabilidad del sistema bajo diferentes cargas.", en: "Tests that evaluate the speed, scalability and stability of the system under different loads." }, chapter: "2", source: "Syllabus v4.0 §2.2.2 (eficiencia de desempeño, ISO/IEC 25010)" },
  { term: { es: "Desplazamiento a la izquierda", en: "Shift left" }, def: { es: "Enfoque donde el testing comienza lo antes posible en el SDLC para detectar defectos temprano y reducir costos.", en: "Approach where testing starts as early as possible in the SDLC to detect defects early and reduce costs." }, chapter: "2", source: "Syllabus v4.0 keywords §2 · §2.1.5" },
  { term: { es: "DevOps", en: "DevOps" }, def: { es: "Conjunto de prácticas que combina desarrollo de software y operaciones de TI para acortar el ciclo de vida del desarrollo.", en: "Set of practices combining software development and IT operations to shorten the development lifecycle." }, chapter: "2", source: "Syllabus v4.0 §2.1.4" },
  { term: { es: "CI/CD", en: "CI/CD" }, def: { es: "Integración Continua / Entrega Continua: prácticas de automatización que permiten integrar y desplegar cambios frecuentemente.", en: "Continuous Integration / Continuous Delivery: automation practices enabling frequent integration and deployment of changes." }, chapter: "2", source: "Syllabus v4.0 §2.1.4" },
  { term: { es: "Automatización de la prueba", en: "Test automation" }, def: { es: "Uso de herramientas de software para gestionar o realizar tareas de prueba (p. ej. ejecutar pruebas de regresión, generar datos de prueba, comparar resultados esperados y reales); conlleva beneficios como el ahorro de tiempo, pero también riesgos que requieren análisis y mitigación.", en: "The use of software tools to manage or perform testing tasks (e.g., executing regression tests, generating test data, comparing expected and actual results); it brings benefits such as time savings, but also risks that require analysis and mitigation." }, chapter: "6", source: "Syllabus v4.0 keywords §6 · §6.2" },
];

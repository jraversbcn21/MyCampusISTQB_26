/* ===================================================
   MyCampus ISTQB — Question Bank
   Based on ISTQB CTFL v4.0 Official Sample Exams
   =================================================== */

const QUESTIONS = [
  // ===== CHAPTER 1: FUNDAMENTALS =====
  {
    id: 1, chapter: 0,
    q: {
      es: "¿Cuál de las siguientes afirmaciones describe MEJOR el objetivo principal del testing?",
      en: "Which of the following BEST describes the main objective of testing?"
    },
    options: {
      es: ["Demostrar que el software no tiene defectos", "Evaluar los productos de trabajo del software y reducir el riesgo de fallos en operación", "Garantizar que el software cumpla todos los requisitos del cliente", "Asegurar que el software está libre de todos los errores posibles"],
      en: ["Prove that software has no defects", "Evaluate software work products and reduce the risk of failures in operation", "Guarantee software meets all customer requirements", "Ensure software is free from all possible errors"]
    },
    correct: 1,
    explanation: {
      es: "El objetivo principal del testing es evaluar la calidad de los artefactos de software y reducir el riesgo de fallos. El testing NO puede probar la ausencia de defectos (Principio 1).",
      en: "The main objective of testing is to evaluate the quality of software artifacts and reduce the risk of failures. Testing CANNOT prove the absence of defects (Principle 1)."
    }
  },
  {
    id: 2, chapter: 0,
    q: {
      es: "Un programador comete un error al escribir código para calcular el descuento de un producto. Como resultado, el sistema aplica el doble del descuento previsto. ¿Cómo se clasifica el 'doble descuento' que se muestra en pantalla?",
      en: "A programmer makes an error when writing code to calculate a product discount. As a result, the system applies double the intended discount. How is the 'double discount' displayed on screen classified?"
    },
    options: {
      es: ["Error", "Defecto", "Fallo", "Causa raíz"],
      en: ["Error", "Defect", "Failure", "Root cause"]
    },
    correct: 2,
    explanation: {
      es: "El 'doble descuento' mostrado en pantalla es un FALLO: el comportamiento incorrecto del sistema en ejecución. El error es la acción humana del programador, y el defecto es el código incorrecto en el sistema.",
      en: "The 'double discount' shown on screen is a FAILURE: incorrect system behavior during execution. The error is the programmer's human action, and the defect is the incorrect code in the system."
    }
  },
  {
    id: 3, chapter: 0,
    q: {
      es: "¿Cuál de los siguientes principios del testing indica que 'probar todo es imposible'?",
      en: "Which testing principle states that 'testing everything is impossible'?"
    },
    options: {
      es: ["Principio 1: El testing muestra la presencia de defectos", "Principio 2: El testing exhaustivo es imposible", "Principio 4: Los defectos se agrupan", "Principio 5: La paradoja del pesticida"],
      en: ["Principle 1: Testing shows presence of defects", "Principle 2: Exhaustive testing is impossible", "Principle 4: Defects cluster together", "Principle 5: Pesticide paradox"]
    },
    correct: 1,
    explanation: {
      es: "El Principio 2 establece que el testing exhaustivo (probar todas las combinaciones de entradas) es imposible. En cambio, se usan técnicas de diseño de pruebas y priorización basada en riesgos.",
      en: "Principle 2 states that exhaustive testing (testing all input combinations) is impossible. Instead, test design techniques and risk-based prioritization are used."
    }
  },
  {
    id: 4, chapter: 0,
    q: {
      es: "El equipo de testing nota que después de varias iteraciones, sus pruebas automatizadas ya no detectan nuevos defectos. ¿Qué principio del testing describe mejor esta situación?",
      en: "The test team notices that after several iterations, their automated tests are no longer detecting new defects. Which testing principle best describes this situation?"
    },
    options: {
      es: ["Principio 3: Testing temprano", "Principio 4: Clustering de defectos", "Principio 5: Paradoja del pesticida", "Principio 7: Falacia de ausencia de defectos"],
      en: ["Principle 3: Early testing", "Principle 4: Defect clustering", "Principle 5: Pesticide paradox", "Principle 7: Absence-of-defects fallacy"]
    },
    correct: 2,
    explanation: {
      es: "La Paradoja del Pesticida (Principio 5) establece que si las mismas pruebas se repiten continuamente, eventualmente dejarán de detectar nuevos defectos. Los casos de prueba deben revisarse y actualizarse regularmente.",
      en: "The Pesticide Paradox (Principle 5) states that if the same tests are run repeatedly, they will eventually stop finding new defects. Test cases must be regularly reviewed and updated."
    }
  },
  {
    id: 5, chapter: 0,
    q: {
      es: "¿Cuál es la diferencia entre VERIFICACIÓN y VALIDACIÓN en el contexto del testing?",
      en: "What is the difference between VERIFICATION and VALIDATION in the context of testing?"
    },
    options: {
      es: [
        "Verificación confirma que el software no tiene defectos; validación confirma que no tiene errores",
        "Verificación confirma que el software cumple su especificación; validación confirma que satisface las necesidades del usuario",
        "Verificación es dinámica; validación es estática",
        "Verificación la realiza el cliente; validación la realiza el equipo de desarrollo"
      ],
      en: [
        "Verification confirms the software has no defects; validation confirms it has no errors",
        "Verification confirms the software meets its specification; validation confirms it satisfies user needs",
        "Verification is dynamic; validation is static",
        "Verification is done by the customer; validation by the development team"
      ]
    },
    correct: 1,
    explanation: {
      es: "Verificación = ¿Estamos construyendo el producto correctamente? (cumple especificaciones). Validación = ¿Estamos construyendo el producto correcto? (satisface necesidades reales del usuario).",
      en: "Verification = Are we building the product correctly? (meets specifications). Validation = Are we building the right product? (satisfies real user needs)."
    }
  },
  {
    id: 6, chapter: 0,
    q: {
      es: "Un sistema de control de vuelo ha pasado todas las pruebas técnicas, sin embargo, los pilotos no pueden usar la interfaz porque es demasiado compleja. ¿Qué principio del testing ilustra esta situación?",
      en: "A flight control system has passed all technical tests, however, pilots cannot use the interface because it is too complex. Which testing principle does this illustrate?"
    },
    options: {
      es: ["Principio 2: Testing exhaustivo imposible", "Principio 5: Paradoja del pesticida", "Principio 6: El testing depende del contexto", "Principio 7: Falacia de ausencia de defectos"],
      en: ["Principle 2: Exhaustive testing impossible", "Principle 5: Pesticide paradox", "Principle 6: Testing is context dependent", "Principle 7: Absence-of-defects fallacy"]
    },
    correct: 3,
    explanation: {
      es: "La Falacia de Ausencia de Defectos (Principio 7): corregir todos los defectos técnicos no sirve si el sistema no satisface las necesidades del usuario (validación). El sistema puede ser técnicamente correcto pero inutilizable.",
      en: "Absence-of-Defects Fallacy (Principle 7): fixing all technical defects is useless if the system doesn't satisfy user needs (validation). The system can be technically correct but unusable."
    }
  },
  {
    id: 7, chapter: 0,
    q: {
      es: "¿Cuál de las siguientes actividades es responsabilidad del ROL de TESTER (no del Test Manager)?",
      en: "Which of the following activities is the responsibility of the TESTER role (not the Test Manager)?"
    },
    options: {
      es: ["Elaborar el plan de pruebas", "Decidir el presupuesto de testing", "Diseñar y ejecutar casos de prueba", "Reportar métricas de testing a la dirección"],
      en: ["Create the test plan", "Decide the testing budget", "Design and execute test cases", "Report testing metrics to management"]
    },
    correct: 2,
    explanation: {
      es: "El Tester se encarga del análisis, diseño, implementación y ejecución de las pruebas. El Test Manager es responsable de la planificación, gestión de recursos, presupuesto y reporte de métricas.",
      en: "The Tester is responsible for analysis, design, implementation and execution of tests. The Test Manager handles planning, resource management, budget and metrics reporting."
    }
  },
  // ===== CHAPTER 2: SDLC =====
  {
    id: 8, chapter: 1,
    q: {
      es: "¿En qué nivel de prueba se verifican principalmente las INTERFACES entre componentes del sistema?",
      en: "At which test level are INTERFACES between system components primarily verified?"
    },
    options: {
      es: ["Prueba de componente (unitaria)", "Prueba de integración de componentes", "Prueba de sistema", "Prueba de aceptación"],
      en: ["Component (unit) testing", "Component integration testing", "System testing", "Acceptance testing"]
    },
    correct: 1,
    explanation: {
      es: "La prueba de integración de componentes verifica las interacciones entre los componentes integrados, incluyendo las interfaces y los flujos de datos entre ellos.",
      en: "Component integration testing verifies interactions between integrated components, including interfaces and data flows between them."
    }
  },
  {
    id: 9, chapter: 1,
    q: {
      es: "Un equipo de desarrollo ágil quiere detectar defectos lo antes posible. ¿Qué enfoque describe MEJOR esta práctica?",
      en: "An agile development team wants to detect defects as early as possible. Which approach BEST describes this practice?"
    },
    options: {
      es: ["Testing de regresión", "Big-bang integration testing", "Shift-left testing", "Testing de aceptación"],
      en: ["Regression testing", "Big-bang integration testing", "Shift-left testing", "Acceptance testing"]
    },
    correct: 2,
    explanation: {
      es: "Shift-left testing implica comenzar el testing lo antes posible en el SDLC (incluyendo revisión de requisitos y diseño), lo que reduce el costo de corrección de defectos.",
      en: "Shift-left testing means starting testing as early as possible in the SDLC (including reviewing requirements and design), which reduces defect correction costs."
    }
  },
  {
    id: 10, chapter: 1,
    q: {
      es: "¿Cuál es el objetivo PRINCIPAL de las pruebas de regresión?",
      en: "What is the MAIN objective of regression testing?"
    },
    options: {
      es: [
        "Verificar que el nuevo código cumple con los requisitos",
        "Confirmar que los cambios no han introducido nuevos defectos en funcionalidades existentes",
        "Evaluar el rendimiento del sistema bajo alta carga",
        "Verificar que el sistema cumple con los estándares de seguridad"
      ],
      en: [
        "Verify that new code meets requirements",
        "Confirm that changes haven't introduced new defects in existing functionality",
        "Evaluate system performance under high load",
        "Verify the system meets security standards"
      ]
    },
    correct: 1,
    explanation: {
      es: "Las pruebas de regresión confirman que los cambios recientes (correcciones de defectos, nuevas funcionalidades) no han afectado negativamente las partes del sistema que funcionaban correctamente.",
      en: "Regression tests confirm that recent changes (defect fixes, new features) haven't negatively affected parts of the system that were working correctly."
    }
  },
  {
    id: 11, chapter: 1,
    q: {
      es: "¿Cuál de los siguientes es un tipo de prueba NO FUNCIONAL?",
      en: "Which of the following is a NON-FUNCTIONAL test type?"
    },
    options: {
      es: ["Prueba de regresión", "Prueba de aceptación de usuario", "Prueba de carga (performance)", "Prueba de humo (smoke test)"],
      en: ["Regression testing", "User acceptance testing", "Load testing (performance)", "Smoke testing"]
    },
    correct: 2,
    explanation: {
      es: "La prueba de carga (load testing) es una prueba no funcional que evalúa el rendimiento del sistema bajo condiciones de carga. Las pruebas no funcionales evalúan CÓMO se comporta el sistema, no QUÉ hace.",
      en: "Load testing is a non-functional test evaluating system performance under load conditions. Non-functional tests evaluate HOW the system behaves, not WHAT it does."
    }
  },
  // ===== CHAPTER 3: STATIC TESTING =====
  {
    id: 12, chapter: 2,
    q: {
      es: "¿Cuál de las siguientes afirmaciones describe MEJOR la diferencia entre testing estático y dinámico?",
      en: "Which statement BEST describes the difference between static and dynamic testing?"
    },
    options: {
      es: [
        "El testing estático solo se aplica al código fuente; el dinámico a los documentos",
        "El testing estático evalúa artefactos sin ejecutar el software; el dinámico requiere ejecutarlo",
        "El testing estático lo realizan herramientas automatizadas; el dinámico lo realizan personas",
        "El testing estático detecta defectos de rendimiento; el dinámico detecta defectos funcionales"
      ],
      en: [
        "Static testing applies only to source code; dynamic to documents",
        "Static testing evaluates artifacts without executing software; dynamic requires executing it",
        "Static testing is done by automated tools; dynamic by people",
        "Static testing detects performance defects; dynamic detects functional defects"
      ]
    },
    correct: 1,
    explanation: {
      es: "El testing estático evalúa artefactos de software (código, requisitos, diseños) sin ejecutar el programa. El testing dinámico requiere la ejecución del software para verificar su comportamiento.",
      en: "Static testing evaluates software artifacts (code, requirements, designs) without running the program. Dynamic testing requires software execution to verify its behavior."
    }
  },
  {
    id: 13, chapter: 2,
    q: {
      es: "¿Cuál es el tipo de revisión FORMAL más rigurosa según el ISTQB?",
      en: "Which is the MOST formal and rigorous review type according to ISTQB?"
    },
    options: {
      es: ["Revisión informal", "Walkthrough", "Revisión técnica", "Inspección"],
      en: ["Informal review", "Walkthrough", "Technical review", "Inspection"]
    },
    correct: 3,
    explanation: {
      es: "La Inspección es el tipo de revisión más formal, con roles definidos (moderador, autor, reviewers, escriba), criterios de entrada/salida específicos, y métricas de defectos.",
      en: "Inspection is the most formal review type, with defined roles (moderator, author, reviewers, scribe), specific entry/exit criteria, and defect metrics."
    }
  },
  // ===== CHAPTER 4: TECHNIQUES =====
  {
    id: 14, chapter: 3,
    q: {
      es: "Un campo de entrada acepta valores numéricos entre 1 y 100. Usando la técnica de Partición de Equivalencia, ¿cuántas particiones se identifican?",
      en: "An input field accepts numeric values between 1 and 100. Using the Equivalence Partitioning technique, how many partitions are identified?"
    },
    options: {
      es: ["1 partición (solo valores válidos)", "2 particiones (válidos e inválidos)", "3 particiones (menor a 1, 1-100, mayor a 100)", "4 particiones"],
      en: ["1 partition (only valid values)", "2 partitions (valid and invalid)", "3 partitions (less than 1, 1-100, greater than 100)", "4 partitions"]
    },
    correct: 2,
    explanation: {
      es: "Se identifican 3 particiones: una válida (1-100) y dos inválidas (valores menores a 1, y valores mayores a 100). Se prueba un valor representativo de cada partición.",
      en: "3 partitions are identified: one valid (1-100) and two invalid (values less than 1, and values greater than 100). One representative value from each partition is tested."
    }
  },
  {
    id: 15, chapter: 3,
    q: {
      es: "Usando BVA de 2 valores para el rango 1-100, ¿cuáles serían los valores de prueba en el límite SUPERIOR?",
      en: "Using 2-value BVA for the range 1-100, what would be the test values at the UPPER boundary?"
    },
    options: {
      es: ["99 y 100", "100 y 101", "99, 100 y 101", "Solo 100"],
      en: ["99 and 100", "100 and 101", "99, 100 and 101", "Only 100"]
    },
    correct: 1,
    explanation: {
      es: "BVA de 2 valores prueba el último valor válido (100) y el primer valor inválido (101) en el límite superior. Para el límite inferior sería: 0 (inválido) y 1 (válido).",
      en: "2-value BVA tests the last valid value (100) and the first invalid value (101) at the upper boundary. For the lower boundary: 0 (invalid) and 1 (valid)."
    }
  },
  {
    id: 16, chapter: 3,
    q: {
      es: "¿Cuál técnica de diseño de pruebas es MEJOR para verificar que un sistema de descuento aplica las reglas correctas según múltiples condiciones (cliente VIP, monto mínimo, código de cupón)?",
      en: "Which test design technique is BEST for verifying a discount system applies correct rules based on multiple conditions (VIP customer, minimum amount, coupon code)?"
    },
    options: {
      es: ["Análisis de valor límite", "Tabla de decisión", "Transición de estado", "Testing exploratorio"],
      en: ["Boundary value analysis", "Decision table", "State transition", "Exploratory testing"]
    },
    correct: 1,
    explanation: {
      es: "Las Tablas de Decisión son ideales para probar combinaciones de condiciones con diferentes acciones resultantes. Cada columna representa una regla de negocio diferente.",
      en: "Decision Tables are ideal for testing combinations of conditions with different resulting actions. Each column represents a different business rule."
    }
  },
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
  {
    id: 18, chapter: 3,
    q: {
      es: "¿Qué técnica de caja blanca mide el porcentaje de RAMAS del código que han sido ejecutadas por los casos de prueba?",
      en: "Which white-box technique measures the percentage of code BRANCHES that have been executed by test cases?"
    },
    options: {
      es: ["Prueba de sentencia (statement coverage)", "Prueba de rama (branch coverage)", "Prueba de condición (condition coverage)", "Prueba de ruta (path coverage)"],
      en: ["Statement coverage", "Branch coverage", "Condition coverage", "Path coverage"]
    },
    correct: 1,
    explanation: {
      es: "Branch coverage (prueba de rama) mide qué porcentaje de las ramas del flujo de control han sido ejercitadas. Es más fuerte que statement coverage porque incluye tanto los caminos verdadero como falso de cada decisión.",
      en: "Branch coverage measures what percentage of control flow branches have been exercised. It is stronger than statement coverage because it includes both true and false paths of each decision."
    }
  },
  {
    id: 19, chapter: 3,
    q: {
      es: "¿Qué es el 'Testing Exploratorio' según ISTQB?",
      en: "What is 'Exploratory Testing' according to ISTQB?"
    },
    options: {
      es: [
        "Testing que se realiza sin ningún tipo de documentación previa",
        "Técnica donde el aprendizaje, diseño y ejecución de pruebas ocurren simultáneamente",
        "Testing de caja blanca que explora el código fuente",
        "Tipo de testing automatizado que busca defectos aleatoriamente"
      ],
      en: [
        "Testing done without any prior documentation",
        "Technique where learning, test design and execution happen simultaneously",
        "White-box testing that explores source code",
        "Automated testing type that randomly searches for defects"
      ]
    },
    correct: 1,
    explanation: {
      es: "El Testing Exploratorio es una técnica basada en experiencia donde el tester aprende del sistema, diseña pruebas y las ejecuta de forma simultánea. Es guiado por objetivos (charters) pero no sigue scripts predefinidos.",
      en: "Exploratory Testing is an experience-based technique where the tester learns about the system, designs tests and executes them simultaneously. It is guided by objectives (charters) but doesn't follow predefined scripts."
    }
  },
  {
    id: 20, chapter: 3,
    q: {
      es: "¿Para qué tipo de sistema es MÁS adecuada la técnica de Prueba de Transición de Estado?",
      en: "For which type of system is the State Transition Testing technique MOST suitable?"
    },
    options: {
      es: [
        "Sistemas con complejas condiciones de entrada",
        "Sistemas con valores numéricos de entrada",
        "Sistemas cuyo comportamiento depende del estado actual y el evento recibido",
        "Sistemas con reglas de negocio complejas"
      ],
      en: [
        "Systems with complex input conditions",
        "Systems with numerical input values",
        "Systems whose behavior depends on current state and received event",
        "Systems with complex business rules"
      ]
    },
    correct: 2,
    explanation: {
      es: "La Prueba de Transición de Estado es ideal para sistemas cuyo comportamiento cambia según el estado actual del sistema y el evento/input recibido (ej: ATM, semáforo, proceso de pedido).",
      en: "State Transition Testing is ideal for systems whose behavior changes based on the system's current state and the received event/input (e.g., ATM, traffic light, order process)."
    }
  },
  // ===== CHAPTER 5: MANAGEMENT =====
  {
    id: 21, chapter: 4,
    q: {
      es: "¿Cuál es la diferencia entre RIESGO DE PRODUCTO y RIESGO DE PROYECTO?",
      en: "What is the difference between PRODUCT RISK and PROJECT RISK?"
    },
    options: {
      es: [
        "El riesgo de producto es siempre mayor que el de proyecto",
        "El riesgo de producto se relaciona con el software fallando; el de proyecto con el proyecto no cumpliendo sus objetivos",
        "El riesgo de producto lo gestiona el tester; el de proyecto lo gestiona el PM",
        "No hay diferencia, son términos intercambiables"
      ],
      en: [
        "Product risk is always greater than project risk",
        "Product risk relates to the software failing; project risk to the project not meeting its objectives",
        "Product risk is managed by the tester; project risk by the PM",
        "There is no difference, they are interchangeable terms"
      ]
    },
    correct: 1,
    explanation: {
      es: "Riesgo de producto: posibilidad de que el software no funcione correctamente (defectos de rendimiento, funcionalidad, seguridad). Riesgo de proyecto: posibilidad de que el proyecto no logre sus objetivos (plazos, presupuesto, alcance).",
      en: "Product risk: possibility that software doesn't work correctly (performance, functionality, security defects). Project risk: possibility that the project doesn't achieve its objectives (timelines, budget, scope)."
    }
  },
  {
    id: 22, chapter: 4,
    q: {
      es: "¿Cuál de las siguientes es una MÉTRICA de testing adecuada para el monitoreo del progreso?",
      en: "Which of the following is an appropriate testing METRIC for progress monitoring?"
    },
    options: {
      es: ["El número de programadores en el equipo", "El porcentaje de casos de prueba ejecutados", "El costo total del proyecto", "La fecha de inicio del proyecto"],
      en: ["The number of programmers on the team", "The percentage of test cases executed", "Total project cost", "Project start date"]
    },
    correct: 1,
    explanation: {
      es: "El porcentaje de casos de prueba ejecutados es una métrica de testing válida para monitorear el progreso. Otras métricas incluyen: densidad de defectos, tasa de detección de defectos, cobertura de código.",
      en: "The percentage of test cases executed is a valid testing metric for monitoring progress. Other metrics include: defect density, defect detection rate, code coverage."
    }
  },
  {
    id: 23, chapter: 4,
    q: {
      es: "Un defecto causa que el sistema se caiga por completo, pero fue introducido en una función usada solo por el 1% de los usuarios. ¿Cómo se clasificaría?",
      en: "A defect causes the entire system to crash, but was introduced in a function used by only 1% of users. How would it be classified?"
    },
    options: {
      es: ["Alta severidad, alta prioridad", "Alta severidad, baja prioridad", "Baja severidad, alta prioridad", "Baja severidad, baja prioridad"],
      en: ["High severity, high priority", "High severity, low priority", "Low severity, high priority", "Low severity, low priority"]
    },
    correct: 1,
    explanation: {
      es: "Alta severidad (causa crash del sistema completo) pero posiblemente baja prioridad (afecta solo al 1% de usuarios, por lo que puede planificarse para una versión futura). La severidad y prioridad son dimensiones independientes.",
      en: "High severity (causes complete system crash) but possibly low priority (affects only 1% of users, so it may be scheduled for a future release). Severity and priority are independent dimensions."
    }
  },
  {
    id: 24, chapter: 4,
    q: {
      es: "¿Qué son los 'criterios de salida' (exit criteria) en el proceso de testing?",
      en: "What are 'exit criteria' in the testing process?"
    },
    options: {
      es: [
        "Las condiciones que deben cumplirse para INICIAR una fase de testing",
        "Las condiciones que deben cumplirse para COMPLETAR una fase de testing",
        "Los requisitos mínimos de hardware para ejecutar las pruebas",
        "El número mínimo de testers necesario para el proyecto"
      ],
      en: [
        "Conditions that must be met to START a testing phase",
        "Conditions that must be met to COMPLETE a testing phase",
        "Minimum hardware requirements to run tests",
        "Minimum number of testers needed for the project"
      ]
    },
    correct: 1,
    explanation: {
      es: "Los criterios de salida (exit criteria) son las condiciones que deben cumplirse para que una fase de testing pueda considerarse completa (ej: 95% de casos ejecutados, todos los defectos críticos cerrados).",
      en: "Exit criteria are conditions that must be met for a testing phase to be considered complete (e.g., 95% of cases executed, all critical defects closed)."
    }
  },
  {
    id: 25, chapter: 4,
    q: {
      es: "¿Cuál es el PROPÓSITO PRINCIPAL de la gestión de configuración en el contexto del testing?",
      en: "What is the MAIN PURPOSE of configuration management in the context of testing?"
    },
    options: {
      es: [
        "Gestionar el equipo de testers",
        "Controlar y registrar la evolución de artefactos de software y testware para asegurar la trazabilidad",
        "Automatizar la ejecución de pruebas",
        "Calcular el presupuesto de testing"
      ],
      en: [
        "Managing the test team",
        "Control and record the evolution of software and testware artifacts to ensure traceability",
        "Automate test execution",
        "Calculate the testing budget"
      ]
    },
    correct: 1,
    explanation: {
      es: "La gestión de configuración controla y registra la evolución de todos los artefactos (código, documentos, testware) para asegurar la trazabilidad y reproducibilidad. Permite saber qué versión fue probada con qué casos.",
      en: "Configuration management controls and records the evolution of all artifacts (code, documents, testware) to ensure traceability and reproducibility. It allows knowing which version was tested with which cases."
    }
  },
  // ===== CHAPTER 6: TOOLS =====
  {
    id: 26, chapter: 5,
    q: {
      es: "¿Cuál de los siguientes es un BENEFICIO de la automatización de pruebas?",
      en: "Which of the following is a BENEFIT of test automation?"
    },
    options: {
      es: [
        "Elimina completamente la necesidad de testers humanos",
        "Permite ejecutar pruebas de regresión de forma más rápida y consistente",
        "Garantiza que no quedan defectos en el sistema",
        "Reduce el costo de mantenimiento de los casos de prueba"
      ],
      en: [
        "Completely eliminates the need for human testers",
        "Allows regression tests to be executed faster and more consistently",
        "Guarantees no defects remain in the system",
        "Reduces the maintenance cost of test cases"
      ]
    },
    correct: 1,
    explanation: {
      es: "Un beneficio principal de la automatización es la ejecución más rápida y consistente de pruebas de regresión. La automatización NO elimina la necesidad de testers humanos ni garantiza ausencia de defectos.",
      en: "A main benefit of automation is faster and more consistent execution of regression tests. Automation does NOT eliminate the need for human testers nor guarantees the absence of defects."
    }
  },
  {
    id: 27, chapter: 5,
    q: {
      es: "¿Cuál de los siguientes es un RIESGO al adoptar herramientas de automatización de pruebas?",
      en: "Which of the following is a RISK when adopting test automation tools?"
    },
    options: {
      es: [
        "Las pruebas se ejecutan más rápido",
        "Las expectativas poco realistas sobre los beneficios de la automatización",
        "Mayor cobertura de pruebas",
        "Reducción del trabajo repetitivo de los testers"
      ],
      en: [
        "Tests run faster",
        "Unrealistic expectations about the benefits of automation",
        "Greater test coverage",
        "Reduction of repetitive tester work"
      ]
    },
    correct: 1,
    explanation: {
      es: "Un riesgo clave de la automatización son las expectativas poco realistas (creer que resolverá todos los problemas, que el ROI es inmediato, etc.). Otros riesgos: alto costo de mantenimiento, dependencia de herramientas, falsa sensación de seguridad.",
      en: "A key risk of automation is unrealistic expectations (believing it will solve all problems, that ROI is immediate, etc.). Other risks: high maintenance costs, tool dependency, false sense of security."
    }
  },
  // Extra questions
  {
    id: 28, chapter: 0,
    q: {
      es: "¿Cuál de los siguientes es un ejemplo de testing ESTÁTICO?",
      en: "Which of the following is an example of STATIC testing?"
    },
    options: {
      es: [
        "Ejecutar casos de prueba funcionales en el sistema",
        "Revisar el documento de requisitos en busca de ambigüedades",
        "Realizar pruebas de rendimiento bajo carga",
        "Ejecutar scripts de prueba automatizados"
      ],
      en: [
        "Executing functional test cases on the system",
        "Reviewing the requirements document for ambiguities",
        "Performing load performance testing",
        "Running automated test scripts"
      ]
    },
    correct: 1,
    explanation: {
      es: "La revisión de documentos de requisitos es testing estático porque evalúa artefactos sin ejecutar el software. Las otras opciones requieren ejecución del software (testing dinámico).",
      en: "Reviewing requirements documents is static testing because it evaluates artifacts without executing software. The other options require software execution (dynamic testing)."
    }
  },
  {
    id: 29, chapter: 1,
    q: {
      es: "En un modelo de desarrollo Waterfall, ¿en qué fase se realizan principalmente las pruebas de SISTEMA?",
      en: "In a Waterfall development model, in which phase is SYSTEM testing primarily performed?"
    },
    options: {
      es: [
        "Durante la fase de requisitos",
        "Durante el diseño del sistema",
        "Después de que el sistema completo ha sido codificado e integrado",
        "Antes de que comience el desarrollo"
      ],
      en: [
        "During the requirements phase",
        "During system design",
        "After the complete system has been coded and integrated",
        "Before development begins"
      ]
    },
    correct: 2,
    explanation: {
      es: "En Waterfall, la prueba de sistema se realiza después de que todo el sistema ha sido codificado e integrado, en la fase de pruebas formal, antes de la entrega al cliente.",
      en: "In Waterfall, system testing is performed after the entire system has been coded and integrated, in the formal testing phase, before delivery to the customer."
    }
  },
  {
    id: 30, chapter: 3,
    q: {
      es: "El código de un módulo tiene el siguiente flujo: una condición IF con dos ramas (VERDADERO/FALSO). Si solo probamos la rama VERDADERO, ¿qué cobertura de SENTENCIA obtenemos si todas las sentencias están en la rama verdadera?",
      en: "A module's code has the following flow: an IF condition with two branches (TRUE/FALSE). If we only test the TRUE branch, what STATEMENT coverage do we get if all statements are in the true branch?"
    },
    options: {
      es: ["0%", "50%", "100%", "No se puede determinar"],
      en: ["0%", "50%", "100%", "Cannot be determined"]
    },
    correct: 2,
    explanation: {
      es: "Si todas las sentencias ejecutables están en la rama VERDADERO, al probar solo esa rama obtenemos 100% de cobertura de sentencia. Esto ilustra por qué la cobertura de rama es más fuerte: con 100% sentencia, podemos tener solo 50% de cobertura de rama.",
      en: "If all executable statements are in the TRUE branch, testing only that branch gives us 100% statement coverage. This illustrates why branch coverage is stronger: with 100% statement coverage, we may have only 50% branch coverage."
    }
  },
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
  {
    id: 32, chapter: 4,
    q: {
      es: "¿Cuál de las siguientes actividades forma parte de la PLANIFICACIÓN de pruebas?",
      en: "Which of the following activities is part of test PLANNING?"
    },
    options: {
      es: [
        "Ejecutar los casos de prueba y registrar resultados",
        "Definir el alcance, el enfoque y los recursos de testing",
        "Analizar los defectos encontrados durante la ejecución",
        "Diseñar los casos de prueba específicos"
      ],
      en: [
        "Execute test cases and record results",
        "Define the scope, approach and testing resources",
        "Analyze defects found during execution",
        "Design specific test cases"
      ]
    },
    correct: 1,
    explanation: {
      es: "La planificación de pruebas incluye definir el alcance, el enfoque de testing, estimar el esfuerzo, identificar recursos, y establecer los criterios de entrada y salida. La ejecución y el análisis de defectos son actividades posteriores.",
      en: "Test planning includes defining the scope, testing approach, estimating effort, identifying resources, and establishing entry and exit criteria. Execution and defect analysis are later activities."
    }
  },
  {
    id: 33, chapter: 0,
    q: {
      es: "Según la regla del clustering de defectos (Principio 4), ¿qué implica para la estrategia de testing?",
      en: "According to the defect clustering principle (Principle 4), what does it imply for the testing strategy?"
    },
    options: {
      es: [
        "Se deben probar igualmente todos los módulos del sistema",
        "Se debe enfocar más esfuerzo de testing en los módulos con mayor historial de defectos",
        "Los módulos sin defectos no necesitan ser probados",
        "Solo hay que probar los módulos nuevos"
      ],
      en: [
        "All system modules should be tested equally",
        "More testing effort should be focused on modules with the highest defect history",
        "Modules without defects don't need to be tested",
        "Only new modules need to be tested"
      ]
    },
    correct: 1,
    explanation: {
      es: "El Principio 4 (clustering de defectos) indica que la mayoría de los defectos se concentran en pocos módulos. Por lo tanto, la estrategia de testing debe priorizar más esfuerzo en los módulos más propensos a defectos.",
      en: "Principle 4 (defect clustering) indicates that most defects concentrate in few modules. Therefore, the testing strategy should prioritize more effort on the most defect-prone modules."
    }
  },
  {
    id: 34, chapter: 2,
    q: {
      es: "¿Qué tipo de revisión es guiada por el AUTOR del documento que se revisa?",
      en: "What type of review is guided by the AUTHOR of the document being reviewed?"
    },
    options: {
      es: ["Inspección formal", "Walkthrough", "Revisión técnica", "Revisión informal"],
      en: ["Formal inspection", "Walkthrough", "Technical review", "Informal review"]
    },
    correct: 1,
    explanation: {
      es: "El Walkthrough es un tipo de revisión donde el autor guía al equipo a través del documento o código paso a paso. Su objetivo es el aprendizaje del equipo y encontrar defectos en la lógica o comprensión.",
      en: "A Walkthrough is a review type where the author guides the team through the document or code step by step. Its objective is team learning and finding defects in logic or understanding."
    }
  },
  {
    id: 35, chapter: 3,
    q: {
      es: "¿Cuál de las siguientes es una técnica basada en EXPERIENCIA del tester?",
      en: "Which of the following is an EXPERIENCE-BASED tester technique?"
    },
    options: {
      es: [
        "Partición de equivalencia",
        "Prueba de rama (branch coverage)",
        "Error guessing (adivinanza de errores)",
        "Tabla de decisión"
      ],
      en: [
        "Equivalence partitioning",
        "Branch coverage",
        "Error guessing",
        "Decision table"
      ]
    },
    correct: 2,
    explanation: {
      es: "Error guessing (adivinanza de errores) es una técnica basada en la experiencia del tester, que usa su intuición y conocimiento previo para anticipar dónde es más probable que existan defectos.",
      en: "Error guessing is an experience-based technique where the tester uses intuition and prior knowledge to anticipate where defects are most likely to exist."
    }
  },
  {
    id: 36, chapter: 4,
    q: {
      es: "¿Cuál es el propósito de un INFORME DE DEFECTO?",
      en: "What is the purpose of a DEFECT REPORT?"
    },
    options: {
      es: [
        "Documentar el plan de pruebas del proyecto",
        "Comunicar información sobre un defecto detectado para facilitar su comprensión y corrección",
        "Registrar las métricas de testing del equipo",
        "Aprobar la entrega del sistema al cliente"
      ],
      en: [
        "Document the project test plan",
        "Communicate information about a detected defect to facilitate its understanding and correction",
        "Record team testing metrics",
        "Approve system delivery to the customer"
      ]
    },
    correct: 1,
    explanation: {
      es: "El informe de defecto comunica información sobre un defecto detectado (descripción, pasos para reproducir, resultado esperado vs actual, severidad, prioridad) para que pueda ser comprendido y corregido por el equipo de desarrollo.",
      en: "The defect report communicates information about a detected defect (description, steps to reproduce, expected vs actual result, severity, priority) so it can be understood and fixed by the development team."
    }
  },
  {
    id: 37, chapter: 1,
    q: {
      es: "¿Cuál de los siguientes afirmaciones sobre el modelo de SDLC en desarrollo ágil es CORRECTA?",
      en: "Which statement about the SDLC model in agile development is CORRECT?"
    },
    options: {
      es: [
        "El testing solo se realiza al final de cada sprint",
        "El testing es una actividad separada que se realiza después del desarrollo",
        "El testing está integrado en cada iteración junto con el desarrollo",
        "En ágil no hay testers, los desarrolladores hacen todo el testing"
      ],
      en: [
        "Testing is only done at the end of each sprint",
        "Testing is a separate activity done after development",
        "Testing is integrated into each iteration alongside development",
        "In agile there are no testers, developers do all testing"
      ]
    },
    correct: 2,
    explanation: {
      es: "En el desarrollo ágil, el testing está integrado continuamente en cada iteración/sprint. Los testers colaboran con desarrolladores y stakeholders desde el inicio de la iteración, no al final.",
      en: "In agile development, testing is continuously integrated into each iteration/sprint. Testers collaborate with developers and stakeholders from the start of the iteration, not at the end."
    }
  },
  {
    id: 38, chapter: 3,
    q: {
      es: "Para un campo que acepta FECHAS con el formato DD/MM/AAAA, ¿qué casos de prueba de BVA (2 valores) incluirías para el DÍA?",
      en: "For a field accepting DATES in DD/MM/YYYY format, what BVA (2-value) test cases would you include for the DAY?"
    },
    options: {
      es: [
        "0, 1, 28, 31, 32",
        "0, 1 y 31, 32",
        "1 y 31",
        "0, 15 y 32"
      ],
      en: [
        "0, 1, 28, 31, 32",
        "0, 1 and 31, 32",
        "1 and 31",
        "0, 15 and 32"
      ]
    },
    correct: 1,
    explanation: {
      es: "BVA de 2 valores prueba el primer valor inválido inferior (0) y el primer valor válido (1) en el límite inferior, y el último valor válido (31) y el primer valor inválido superior (32) en el límite superior.",
      en: "2-value BVA tests the first invalid lower value (0) and first valid value (1) at the lower boundary, and the last valid value (31) and first upper invalid value (32) at the upper boundary."
    }
  },
  {
    id: 39, chapter: 0,
    q: {
      es: "¿Cuál de los siguientes es el mejor ejemplo de 'testing que depende del contexto' (Principio 6)?",
      en: "Which of the following is the best example of 'context-dependent testing' (Principle 6)?"
    },
    options: {
      es: [
        "Siempre usar las mismas técnicas de testing en todos los proyectos",
        "Un sistema de banca aplica las mismas pruebas que un videojuego",
        "Un sistema médico crítico requiere pruebas de seguridad mucho más exhaustivas que una app de entretenimiento",
        "Solo probar el código nuevo, no el existente"
      ],
      en: [
        "Always using the same testing techniques on all projects",
        "A banking system applies the same tests as a video game",
        "A critical medical system requires much more extensive safety testing than an entertainment app",
        "Only testing new code, not existing code"
      ]
    },
    correct: 2,
    explanation: {
      es: "El Principio 6 establece que el testing depende del contexto. Un sistema médico crítico necesita mucho más testing de seguridad y fiabilidad que una app de entretenimiento, porque las consecuencias de los fallos son muy diferentes.",
      en: "Principle 6 states that testing is context dependent. A critical medical system needs much more safety and reliability testing than an entertainment app, because the consequences of failures are very different."
    }
  },
  {
    id: 40, chapter: 4,
    q: {
      es: "¿Qué es ATDD (Acceptance Test-Driven Development)?",
      en: "What is ATDD (Acceptance Test-Driven Development)?"
    },
    options: {
      es: [
        "Una técnica donde los desarrolladores escriben pruebas unitarias antes del código",
        "Una técnica colaborativa donde los criterios de aceptación se definen como pruebas antes del desarrollo",
        "Un tipo de prueba de rendimiento para sistemas de alta disponibilidad",
        "Un método para automatizar pruebas de aceptación de usuario"
      ],
      en: [
        "A technique where developers write unit tests before code",
        "A collaborative technique where acceptance criteria are defined as tests before development",
        "A type of performance testing for high-availability systems",
        "A method for automating user acceptance tests"
      ]
    },
    correct: 1,
    explanation: {
      es: "ATDD es una técnica colaborativa donde las historias de usuario se expresan como criterios de aceptación y pruebas antes del desarrollo. Participan desarrolladores, testers y representantes del negocio para asegurar el entendimiento compartido.",
      en: "ATDD is a collaborative technique where user stories are expressed as acceptance criteria and tests before development. Developers, testers and business representatives participate to ensure shared understanding."
    }
  },

  // ===== CHAPTER 2: TESTING THROUGHOUT THE SDLC (extra) =====
  {
    id: 41, chapter: 1,
    q: {
      es: "¿Cuál es la principal diferencia entre pruebas de componente y pruebas de integración?",
      en: "What is the main difference between component testing and integration testing?"
    },
    options: {
      es: [
        "Las pruebas de componente verifican módulos individuales aislados; las de integración verifican la interacción entre componentes",
        "Las pruebas de componente son manuales; las de integración son siempre automatizadas",
        "Las pruebas de componente solo las hacen los desarrolladores; las de integración solo los testers",
        "No hay diferencia significativa entre ambos niveles de prueba"
      ],
      en: [
        "Component testing verifies individual modules in isolation; integration testing verifies interaction between components",
        "Component testing is manual; integration testing is always automated",
        "Component testing is done only by developers; integration testing only by testers",
        "There is no significant difference between both test levels"
      ]
    },
    correct: 0,
    explanation: {
      es: "Las pruebas de componente (unit testing) verifican módulos de forma aislada usando stubs/drivers. Las pruebas de integración verifican la comunicación e interfaces entre esos componentes ya integrados.",
      en: "Component (unit) testing verifies modules in isolation using stubs/drivers. Integration testing verifies the communication and interfaces between those already integrated components."
    }
  },
  {
    id: 42, chapter: 1,
    q: {
      es: "En un modelo en V, ¿con qué fase de desarrollo se corresponden las pruebas de sistema?",
      en: "In a V-model, which development phase corresponds to system testing?"
    },
    options: {
      es: [
        "Diseño de componentes",
        "Diseño de arquitectura del sistema",
        "Especificación de requisitos del sistema",
        "Análisis de requisitos de negocio"
      ],
      en: [
        "Component design",
        "System architecture design",
        "System requirements specification",
        "Business requirements analysis"
      ]
    },
    correct: 2,
    explanation: {
      es: "En el modelo en V, las pruebas de sistema se corresponden con la especificación de requisitos del sistema. Cada nivel de prueba se diseña en paralelo con su fase de desarrollo correspondiente.",
      en: "In the V-model, system testing corresponds to system requirements specification. Each test level is designed in parallel with its corresponding development phase."
    }
  },
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

  // ===== CHAPTER 3: STATIC TESTING (extra) =====
  {
    id: 44, chapter: 2,
    q: {
      es: "¿Cuál de los siguientes beneficios es EXCLUSIVO del testing estático frente al testing dinámico?",
      en: "Which of the following benefits is EXCLUSIVE to static testing compared to dynamic testing?"
    },
    options: {
      es: [
        "Puede detectar defectos en artefactos no ejecutables como requisitos o diseños",
        "Verifica el comportamiento del software en tiempo de ejecución",
        "Permite ejecutar casos de prueba automatizados",
        "Mide el rendimiento del sistema bajo carga"
      ],
      en: [
        "Can detect defects in non-executable artifacts like requirements or designs",
        "Verifies software behavior at runtime",
        "Allows executing automated test cases",
        "Measures system performance under load"
      ]
    },
    correct: 0,
    explanation: {
      es: "El testing estático puede detectar defectos en artefactos no ejecutables (requisitos, diseños, código sin ejecutar) antes de que se construya el software. El testing dinámico requiere que el software sea ejecutable.",
      en: "Static testing can detect defects in non-executable artifacts (requirements, designs, unexecuted code) before the software is built. Dynamic testing requires executable software."
    }
  },
  {
    id: 45, chapter: 2,
    q: {
      es: "¿Qué rol en una revisión formal es responsable de asegurar que el proceso de revisión siga las pautas definidas?",
      en: "Which role in a formal review is responsible for ensuring the review process follows defined guidelines?"
    },
    options: {
      es: ["El autor", "El moderador (facilitador)", "El revisor", "El escriba (scribe)"],
      en: ["The author", "The moderator (facilitator)", "The reviewer", "The scribe"]
    },
    correct: 1,
    explanation: {
      es: "El moderador (facilitador) es responsable de planificar, facilitar y asegurar que la revisión formal se lleve a cabo según el proceso definido. También media conflictos entre participantes.",
      en: "The moderator (facilitator) is responsible for planning, facilitating and ensuring the formal review follows the defined process. They also mediate conflicts between participants."
    }
  },
  {
    id: 46, chapter: 2,
    q: {
      es: "¿Cuál de las siguientes afirmaciones sobre el análisis estático es CORRECTA?",
      en: "Which of the following statements about static analysis is CORRECT?"
    },
    options: {
      es: [
        "El análisis estático requiere ejecutar el código para encontrar defectos",
        "El análisis estático solo puede realizarlo el equipo de testing, no los desarrolladores",
        "Las herramientas de análisis estático pueden detectar variables no inicializadas o código muerto sin ejecutar el programa",
        "El análisis estático reemplaza completamente las pruebas dinámicas"
      ],
      en: [
        "Static analysis requires executing code to find defects",
        "Static analysis can only be done by the test team, not developers",
        "Static analysis tools can detect uninitialized variables or dead code without running the program",
        "Static analysis completely replaces dynamic testing"
      ]
    },
    correct: 2,
    explanation: {
      es: "El análisis estático examina el código o artefactos sin ejecutarlos. Las herramientas pueden detectar problemas como variables no inicializadas, código muerto, violaciones de estándares de codificación y complejidad ciclomática elevada.",
      en: "Static analysis examines code or artifacts without executing them. Tools can detect issues like uninitialized variables, dead code, coding standard violations, and high cyclomatic complexity."
    }
  },

  // ===== CHAPTER 6: TOOLS (extra) =====
  {
    id: 47, chapter: 5,
    q: {
      es: "¿Cuál de los siguientes es un riesgo típico al introducir herramientas de automatización de pruebas en un equipo?",
      en: "Which of the following is a typical risk when introducing test automation tools to a team?"
    },
    options: {
      es: [
        "Las herramientas siempre aumentan el número de defectos encontrados",
        "Expectativas poco realistas sobre los beneficios de la herramienta",
        "Las herramientas eliminan la necesidad de testers humanos",
        "La automatización garantiza cobertura del 100% de los requisitos"
      ],
      en: [
        "Tools always increase the number of defects found",
        "Unrealistic expectations about the tool's benefits",
        "Tools eliminate the need for human testers",
        "Automation guarantees 100% requirements coverage"
      ]
    },
    correct: 1,
    explanation: {
      es: "Las expectativas poco realistas son un riesgo clave al adoptar herramientas de testing. Muchos equipos esperan que la automatización resuelva todos sus problemas, cuando en realidad requiere inversión en mantenimiento, habilidades y tiempo inicial.",
      en: "Unrealistic expectations are a key risk when adopting testing tools. Many teams expect automation to solve all their problems, when in reality it requires investment in maintenance, skills, and initial setup time."
    }
  },
  {
    id: 48, chapter: 5,
    q: {
      es: "¿Qué tipo de herramienta ayuda a los testers a gestionar los casos de prueba, defectos y resultados de ejecución?",
      en: "What type of tool helps testers manage test cases, defects, and execution results?"
    },
    options: {
      es: [
        "Herramienta de análisis estático",
        "Herramienta de gestión de pruebas (TMS)",
        "Herramienta de pruebas de rendimiento",
        "Framework de pruebas unitarias"
      ],
      en: [
        "Static analysis tool",
        "Test Management System (TMS)",
        "Performance testing tool",
        "Unit test framework"
      ]
    },
    correct: 1,
    explanation: {
      es: "Una herramienta de gestión de pruebas (TMS) permite organizar y rastrear casos de prueba, planificación de pruebas, ejecución y resultados, así como el seguimiento de defectos. Ejemplos: TestRail, Zephyr, qTest.",
      en: "A Test Management System (TMS) allows organizing and tracking test cases, test planning, execution and results, as well as defect tracking. Examples: TestRail, Zephyr, qTest."
    }
  },
  {
    id: 49, chapter: 5,
    q: {
      es: "¿Cuál es el principal criterio para seleccionar una herramienta de testing para un proyecto?",
      en: "What is the main criterion for selecting a testing tool for a project?"
    },
    options: {
      es: [
        "Que sea la herramienta más popular del mercado",
        "Que sea gratuita y de código abierto",
        "Que se adecúe a las necesidades del proyecto, las habilidades del equipo y el contexto organizacional",
        "Que soporte todos los lenguajes de programación existentes"
      ],
      en: [
        "That it is the most popular tool on the market",
        "That it is free and open source",
        "That it fits the project needs, team skills, and organizational context",
        "That it supports all existing programming languages"
      ]
    },
    correct: 2,
    explanation: {
      es: "La selección de herramientas debe basarse en el ajuste al contexto: necesidades del proyecto, habilidades del equipo, compatibilidad técnica, coste total de propiedad y apoyo organizacional. No existe una herramienta universalmente mejor.",
      en: "Tool selection must be based on context fit: project needs, team skills, technical compatibility, total cost of ownership, and organizational support. There is no universally best tool."
    }
  },
  {
    id: 50, chapter: 5,
    q: {
      es: "¿Qué tipo de herramienta se utiliza para medir el porcentaje de código ejercitado durante las pruebas?",
      en: "What type of tool is used to measure the percentage of code exercised during testing?"
    },
    options: {
      es: [
        "Herramienta de gestión de defectos",
        "Herramienta de cobertura de código",
        "Herramienta de pruebas de carga",
        "Herramienta de comparación de datos"
      ],
      en: [
        "Defect management tool",
        "Code coverage tool",
        "Load testing tool",
        "Data comparison tool"
      ]
    },
    correct: 1,
    explanation: {
      es: "Las herramientas de cobertura de código instrumentan el código para registrar qué líneas, ramas o condiciones se ejecutan durante las pruebas. Ejemplos: JaCoCo (Java), Istanbul/NYC (JavaScript), Coverage.py (Python).",
      en: "Code coverage tools instrument code to record which lines, branches, or conditions are executed during testing. Examples: JaCoCo (Java), Istanbul/NYC (JavaScript), Coverage.py (Python)."
    }
  }
];

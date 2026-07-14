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
      es: "En el BVA de 3 valores, cada valor límite tiene tres elementos de cobertura: el propio valor límite y sus dos vecinos. Para el valor límite 10, son 9 (su vecino en la partición inválida), 10, y 11 (este último, su vecino dentro de la partición válida). Obsérvese que en el BVA de 3 valores algunos elementos de cobertura pueden no ser valores límite (aquí, el 11). En el BVA de 2 valores serían solo 10 y su vecino más próximo de la partición adyacente (9).",
      en: "In 3-value BVA, each boundary value has three coverage items: the boundary value itself and both its neighbors. For the boundary value 10, these are 9 (its neighbor in the invalid partition), 10, and 11 (its neighbor inside the valid partition). Note that in 3-value BVA some coverage items may not be boundary values (here, 11). In 2-value BVA, the items would be just 10 and its closest neighbor in the adjacent partition (9)."
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
  },
  // ===== CHAPTER 1 (Fundamentals) — additional LO-mapped questions =====
  {
    id: 51, chapter: 0, lo: "FL-1.4.4", k: 2,
    source: "Syllabus v4.0 §1.4.4",
    q: {
      es: "¿Cuál es el principal beneficio de mantener la trazabilidad entre las bases de prueba y los productos de trabajo de prueba?",
      en: "What is the main benefit of maintaining traceability between the test basis and test work products?"
    },
    options: {
      es: [
        "Permite evaluar la cobertura, analizar el impacto de los cambios y facilitar auditorías",
        "Reduce el número de casos de prueba necesarios",
        "Garantiza que el software no tenga defectos",
        "Elimina la necesidad de la gestión de la configuración"
      ],
      en: [
        "It enables coverage assessment, change impact analysis and facilitates audits",
        "It reduces the number of test cases needed",
        "It guarantees the software has no defects",
        "It removes the need for configuration management"
      ]
    },
    correct: 0,
    explanation: {
      es: "La trazabilidad permite evaluar la cobertura, analizar el impacto de los cambios, facilitar auditorías y hacer el progreso del testing comprensible. No elimina otros procesos ni garantiza ausencia de defectos.",
      en: "Traceability enables coverage assessment, change impact analysis, audit support and makes testing progress understandable. It does not remove other processes nor guarantee absence of defects."
    }
  },
  {
    id: 52, chapter: 0, lo: "FL-1.1.1", k: 1,
    source: "Syllabus v4.0 §1.1.1",
    q: {
      es: "Según el syllabus, ¿cuál de los siguientes es un objetivo típico de las pruebas?",
      en: "According to the syllabus, which of the following is a typical test objective?"
    },
    options: {
      es: [
        "Sustituir por completo la actividad de depuración del equipo de desarrollo",
        "Certificar legalmente el software sin necesidad de aprobación de los interesados",
        "Proporcionar información a los interesados para que puedan tomar decisiones informadas",
        "Reducir el número de desarrolladores necesarios en el proyecto"
      ],
      en: [
        "Completely replace the development team's debugging activity",
        "Legally certify the software without stakeholder approval",
        "Provide information to stakeholders so they can make informed decisions",
        "Reduce the number of developers needed on the project"
      ]
    },
    correct: 2,
    explanation: {
      es: "El syllabus lista objetivos típicos de las pruebas como evaluar productos de trabajo, encontrar defectos, verificar el cumplimiento de requisitos y, entre otros, proporcionar información a los interesados para la toma de decisiones informadas. La depuración es una actividad distinta y las pruebas no sustituyen la certificación legal ni reducen la plantilla.",
      en: "The syllabus lists typical test objectives such as evaluating work products, finding defects, verifying requirements compliance and, among others, providing information to stakeholders for informed decision-making. Debugging is a separate activity, and testing does not replace legal certification or reduce staffing."
    }
  },
  {
    id: 53, chapter: 0, lo: "FL-1.1.2", k: 2,
    source: "Syllabus v4.0 §1.1.2",
    q: {
      es: "Cuando una prueba dinámica provoca un fallo, ¿qué actividad se encarga de encontrar la causa (el defecto), analizarla y eliminarla?",
      en: "When dynamic testing triggers a failure, which activity is responsible for finding the cause (the defect), analyzing it and eliminating it?"
    },
    options: {
      es: [
        "La depuración (debugging)",
        "La prueba de confirmación (confirmation testing)",
        "El análisis de pruebas (test analysis)",
        "La prueba de regresión (regression testing)"
      ],
      en: [
        "Debugging",
        "Confirmation testing",
        "Test analysis",
        "Regression testing"
      ]
    },
    correct: 0,
    explanation: {
      es: "El testing y la depuración son actividades separadas. El testing puede provocar fallos (pruebas dinámicas) o encontrar defectos directamente (pruebas estáticas); la depuración se encarga de reproducir el fallo, diagnosticar el defecto y corregirlo. Después, la prueba de confirmación verifica la corrección y la de regresión comprueba que no se hayan introducido nuevos fallos.",
      en: "Testing and debugging are separate activities. Testing can trigger failures (dynamic testing) or directly find defects (static testing); debugging is concerned with reproducing the failure, diagnosing the defect and fixing it. Afterwards, confirmation testing checks the fix, and regression testing checks that no new failures were introduced."
    }
  },
  {
    id: 54, chapter: 0, lo: "FL-1.2.1", k: 2,
    source: "Syllabus v4.0 §1.2.1",
    q: {
      es: "¿Cuál de las siguientes es una contribución del testing al éxito de un proyecto, según el syllabus?",
      en: "Which of the following is a contribution of testing to project success, according to the syllabus?"
    },
    options: {
      es: [
        "Elimina por completo la necesidad de aseguramiento de calidad (QA)",
        "Proporciona a los usuarios una representación indirecta en el proyecto de desarrollo",
        "Garantiza que no se incumplirá ningún plazo del proyecto",
        "Sustituye la necesidad de cumplir requisitos contractuales o legales"
      ],
      en: [
        "It completely eliminates the need for quality assurance (QA)",
        "It provides users with indirect representation in the development project",
        "It guarantees no project deadline will be missed",
        "It replaces the need to comply with contractual or legal requirements"
      ]
    },
    correct: 1,
    explanation: {
      es: "El syllabus indica que el testing proporciona a los usuarios una representación indirecta en el proyecto, ya que los testers procuran que las necesidades reales de los usuarios se tengan en cuenta durante todo el ciclo de vida, cuando no es viable involucrar directamente a usuarios representativos.",
      en: "The syllabus states that testing provides users with indirect representation on the development project, since testers ensure real user needs are considered throughout the lifecycle when directly involving representative users is not feasible."
    }
  },
  {
    id: 55, chapter: 0, lo: "FL-1.2.2", k: 1,
    source: "Syllabus v4.0 §1.2.2",
    q: {
      es: "¿Cuál de las siguientes afirmaciones describe correctamente la relación entre el testing y el Aseguramiento de la Calidad (QA)?",
      en: "Which statement correctly describes the relationship between testing and Quality Assurance (QA)?"
    },
    options: {
      es: [
        "El testing es un enfoque orientado al producto y correctivo; el QA es un enfoque orientado al proceso y preventivo",
        "El testing y el QA son términos sinónimos e intercambiables",
        "El QA es responsabilidad exclusiva del equipo de testing",
        "El testing se centra en mejorar los procesos de desarrollo, mientras que el QA se centra en encontrar defectos en el código"
      ],
      en: [
        "Testing is a product-oriented, corrective approach; QA is a process-oriented, preventive approach",
        "Testing and QA are synonymous, interchangeable terms",
        "QA is the exclusive responsibility of the test team",
        "Testing focuses on improving development processes, while QA focuses on finding defects in code"
      ]
    },
    correct: 0,
    explanation: {
      es: "Aunque a menudo se usan indistintamente, testing y QA no son lo mismo: el testing es un enfoque orientado al producto y correctivo (una forma de control de calidad), mientras que el QA es un enfoque orientado al proceso y preventivo, y es responsabilidad de todos en el proyecto, no solo del equipo de testing.",
      en: "Although often used interchangeably, testing and QA are not the same: testing is a product-oriented, corrective approach (a form of quality control), while QA is a process-oriented, preventive approach, and is the responsibility of everyone on the project, not just the test team."
    }
  },
  {
    id: 56, chapter: 0, lo: "FL-1.2.3", k: 2,
    source: "Syllabus v4.0 §1.2.3",
    q: {
      es: "Un desarrollador, bajo presión de tiempo, malinterpreta un requisito y escribe código incorrecto que queda en el sistema sin detectarse. ¿Qué elemento representa la CAUSA RAÍZ en este escenario?",
      en: "Under time pressure, a developer misunderstands a requirement and writes incorrect code that remains undetected in the system. What represents the ROOT CAUSE in this scenario?"
    },
    options: {
      es: [
        "El código incorrecto que quedó en el sistema",
        "El comportamiento incorrecto que el sistema mostraría al ejecutarse",
        "La malinterpretación del requisito por parte del desarrollador",
        "La presión de tiempo que llevó a cometer el error"
      ],
      en: [
        "The incorrect code left in the system",
        "The incorrect behavior the system would show when executed",
        "The developer's misunderstanding of the requirement",
        "The time pressure that led to the mistake"
      ]
    },
    correct: 3,
    explanation: {
      es: "Una causa raíz es la razón fundamental de un problema (una situación que lleva a un error). Aquí, la presión de tiempo es la causa raíz que llevó al error humano (malinterpretar el requisito), que produjo un defecto (el código incorrecto) que, de ejecutarse, podría causar un fallo.",
      en: "A root cause is the fundamental reason for a problem (a situation that leads to an error). Here, time pressure is the root cause that led to the human error (misunderstanding the requirement), which produced a defect (the incorrect code) that, if executed, could cause a failure."
    }
  },
  {
    id: 57, chapter: 0, lo: "FL-1.3.1", k: 2,
    source: "Syllabus v4.0 §1.3.1",
    q: {
      es: "¿Qué principio de las pruebas establece que 'las pruebas tempranas ahorran tiempo y dinero'?",
      en: "Which testing principle states that 'early testing saves time and money'?"
    },
    options: {
      es: [
        "Principio 1: Las pruebas muestran la presencia de defectos",
        "Principio 3: Las pruebas tempranas ahorran tiempo y dinero",
        "Principio 4: Los defectos se agrupan",
        "Principio 6: Las pruebas dependen del contexto"
      ],
      en: [
        "Principle 1: Testing shows the presence of defects",
        "Principle 3: Early testing saves time and money",
        "Principle 4: Defects cluster together",
        "Principle 6: Testing is context dependent"
      ]
    },
    correct: 1,
    explanation: {
      es: "El Principio 3 indica que los defectos eliminados tempranamente no provocarán defectos posteriores en productos de trabajo derivados, reduciendo el coste de calidad. Por ello, tanto las pruebas estáticas como las dinámicas deben comenzar lo antes posible en el ciclo de vida.",
      en: "Principle 3 states that defects removed early will not cause subsequent defects in derived work products, reducing the cost of quality. Therefore, both static and dynamic testing should start as early as possible in the lifecycle."
    }
  },
  {
    id: 58, chapter: 0, lo: "FL-1.4.1", k: 2,
    source: "Syllabus v4.0 §1.4.1",
    q: {
      es: "Dentro del proceso de pruebas, ¿qué actividad responde a la pregunta '¿qué probar?', analizando la base de pruebas para identificar condiciones de prueba?",
      en: "Within the test process, which activity answers the question 'what to test?' by analyzing the test basis to identify test conditions?"
    },
    options: {
      es: [
        "El análisis de pruebas (test analysis)",
        "El diseño de pruebas (test design)",
        "La implementación de pruebas (test implementation)",
        "El cierre de pruebas (test completion)"
      ],
      en: [
        "Test analysis",
        "Test design",
        "Test implementation",
        "Test completion"
      ]
    },
    correct: 0,
    explanation: {
      es: "El análisis de pruebas incluye analizar la base de pruebas para identificar características comprobables, y definir y priorizar condiciones de prueba; responde a la pregunta '¿qué probar?' en términos de criterios de cobertura medibles. El diseño de pruebas, en cambio, responde a '¿cómo probar?'.",
      en: "Test analysis includes analyzing the test basis to identify testable features, and defining and prioritizing test conditions; it answers the question 'what to test?' in terms of measurable coverage criteria. Test design, in contrast, answers 'how to test?'."
    }
  },
  {
    id: 59, chapter: 0, lo: "FL-1.4.2", k: 2,
    source: "Syllabus v4.0 §1.4.2",
    q: {
      es: "¿Cuáles de los siguientes son factores de CONTEXTO que, según el syllabus, influyen en cómo se lleva a cabo el proceso de pruebas?",
      en: "Which of the following are CONTEXT factors that, according to the syllabus, influence how the test process is carried out?"
    },
    options: {
      es: [
        "Las partes interesadas, el dominio de negocio, los factores técnicos y las restricciones del proyecto",
        "Únicamente el número de líneas de código fuente del sistema",
        "Únicamente la antigüedad de la empresa que desarrolla el software",
        "Únicamente el sistema operativo instalado en el servidor de producción"
      ],
      en: [
        "Stakeholders, business domain, technical factors and project constraints",
        "Only the number of lines of source code in the system",
        "Only the age of the company developing the software",
        "Only the operating system installed on the production server"
      ]
    },
    correct: 0,
    explanation: {
      es: "El syllabus enumera varios factores contextuales que impactan el proceso de pruebas: partes interesadas, miembros del equipo, dominio de negocio, factores técnicos, restricciones del proyecto, factores organizacionales, el SDLC y las herramientas. Estos factores afectan la estrategia, las técnicas, el nivel de automatización y el reporte de pruebas.",
      en: "The syllabus lists several contextual factors impacting the test process: stakeholders, team members, business domain, technical factors, project constraints, organizational factors, the SDLC, and tools. These factors affect the test strategy, techniques, automation level and test reporting."
    }
  },
  {
    id: 60, chapter: 0, lo: "FL-1.4.3", k: 2,
    source: "Syllabus v4.0 §1.4.3",
    q: {
      es: "El 'registro de riesgos' (risk register), a menudo incluido en el plan de pruebas, ¿a qué grupo de actividades del proceso de pruebas pertenece como producto de trabajo (testware)?",
      en: "The 'risk register', often included in the test plan, belongs to which group of test process activities as a testware work product?"
    },
    options: {
      es: [
        "Planificación de pruebas (test planning)",
        "Diseño de pruebas (test design)",
        "Ejecución de pruebas (test execution)",
        "Cierre de pruebas (test completion)"
      ],
      en: [
        "Test planning",
        "Test design",
        "Test execution",
        "Test completion"
      ]
    },
    correct: 0,
    explanation: {
      es: "Según el syllabus, los productos de trabajo de la planificación de pruebas incluyen el plan de pruebas, el cronograma de pruebas, el registro de riesgos y los criterios de entrada y salida; estos últimos suelen formar parte del propio plan de pruebas.",
      en: "According to the syllabus, test planning work products include the test plan, test schedule, risk register, and entry/exit criteria; the latter are often part of the test plan itself."
    }
  },
  {
    id: 61, chapter: 0, lo: "FL-1.4.5", k: 2,
    source: "Syllabus v4.0 §1.4.5",
    q: {
      es: "En el desarrollo Ágil, según el syllabus, ¿qué puede ocurrir con algunas de las tareas del rol de gestión de pruebas?",
      en: "In Agile development, according to the syllabus, what can happen with some of the test management role's tasks?"
    },
    options: {
      es: [
        "Pueden ser asumidas por el propio equipo ágil",
        "Deben eliminarse por completo, ya que Ágil no requiere gestión de pruebas",
        "Siempre deben ser realizadas por un Test Manager externo a la organización",
        "Se transfieren automáticamente al cliente final"
      ],
      en: [
        "They can be handled by the Agile team itself",
        "They must be eliminated entirely, since Agile does not require test management",
        "They must always be performed by a Test Manager outside the organization",
        "They are automatically transferred to the end customer"
      ]
    },
    correct: 0,
    explanation: {
      es: "El syllabus señala que la forma de llevar a cabo el rol de gestión de pruebas varía según el contexto; por ejemplo, en el desarrollo ágil, algunas tareas de gestión de pruebas pueden ser gestionadas por el propio equipo ágil, sin necesidad de un rol separado.",
      en: "The syllabus notes that the way the test management role is carried out varies by context; for example, in Agile development, some test management tasks may be handled by the Agile team itself, without needing a separate role."
    }
  },
  {
    id: 62, chapter: 0, lo: "FL-1.5.1", k: 2,
    source: "Syllabus v4.0 §1.5.1",
    q: {
      es: "¿Cuál de las siguientes combinaciones representa habilidades GENÉRICAS que el syllabus considera relevantes para los testers?",
      en: "Which of the following combinations represents GENERIC skills the syllabus considers relevant for testers?"
    },
    options: {
      es: [
        "Ser el desarrollador con más antigüedad en la empresa",
        "Minuciosidad, atención al detalle, pensamiento analítico y buenas habilidades de comunicación",
        "Poseer una certificación obligatoria en gestión financiera",
        "Conocer un único lenguaje de programación en profundidad"
      ],
      en: [
        "Being the most senior developer at the company",
        "Thoroughness, attention to detail, analytical thinking and good communication skills",
        "Holding a mandatory certification in financial management",
        "Deep knowledge of a single programming language"
      ]
    },
    correct: 1,
    explanation: {
      es: "El syllabus enumera como habilidades genéricas relevantes para los testers: conocimiento de pruebas, minuciosidad/atención al detalle/curiosidad, buenas habilidades de comunicación, pensamiento analítico y crítico/creatividad, conocimiento técnico y conocimiento del dominio de negocio.",
      en: "The syllabus lists as relevant generic skills for testers: testing knowledge, thoroughness/attention to detail/curiosity, good communication skills, analytical and critical thinking/creativity, technical knowledge, and domain knowledge."
    }
  },
  {
    id: 63, chapter: 0, lo: "FL-1.5.2", k: 1,
    source: "Syllabus v4.0 §1.5.2",
    q: {
      es: "¿Cuál de las siguientes es una VENTAJA del enfoque de equipo completo (whole team approach), según el syllabus?",
      en: "Which of the following is an ADVANTAGE of the whole team approach, according to the syllabus?"
    },
    options: {
      es: [
        "Mejora la dinámica del equipo y potencia la comunicación y la colaboración, creando sinergia entre las distintas habilidades",
        "Elimina por completo la necesidad de independencia de pruebas en cualquier contexto",
        "Reduce la necesidad de que los testers colaboren con los representantes del negocio",
        "Garantiza que todos los miembros del equipo tengan el mismo nivel de conocimiento técnico"
      ],
      en: [
        "It improves team dynamics and enhances communication and collaboration, creating synergy between different skill sets",
        "It completely eliminates the need for test independence in any context",
        "It reduces the need for testers to collaborate with business representatives",
        "It guarantees all team members have the same level of technical knowledge"
      ]
    },
    correct: 0,
    explanation: {
      es: "El enfoque de equipo completo mejora la dinámica del equipo, potencia la comunicación y la colaboración, y crea sinergia al aprovechar las distintas habilidades del equipo. Sin embargo, no siempre es apropiado; en contextos críticos de seguridad puede requerirse un alto nivel de independencia.",
      en: "The whole team approach improves team dynamics, enhances communication and collaboration, and creates synergy by leveraging the team's various skill sets. However, it is not always appropriate; safety-critical contexts may require a high level of independence."
    }
  },
  {
    id: 64, chapter: 0, lo: "FL-1.5.3", k: 2,
    source: "Syllabus v4.0 §1.5.3",
    q: {
      es: "¿Cuál de los siguientes es un posible INCONVENIENTE de un alto grado de independencia de las pruebas, según el syllabus?",
      en: "Which of the following is a possible DRAWBACK of a high degree of test independence, according to the syllabus?"
    },
    options: {
      es: [
        "Los testers independientes nunca encuentran defectos relevantes",
        "Los testers independientes pueden aislarse del equipo de desarrollo, generando problemas de comunicación o una relación conflictiva",
        "La independencia elimina por completo los sesgos cognitivos de todo el equipo",
        "La independencia mejora automáticamente la velocidad de codificación de los desarrolladores"
      ],
      en: [
        "Independent testers never find relevant defects",
        "Independent testers may become isolated from the development team, leading to communication problems or an adversarial relationship",
        "Independence completely eliminates the whole team's cognitive biases",
        "Independence automatically improves developers' coding speed"
      ]
    },
    correct: 1,
    explanation: {
      es: "Según el syllabus, entre los inconvenientes de la independencia de pruebas están el aislamiento de los testers respecto al equipo de desarrollo, problemas de comunicación, relaciones conflictivas, pérdida de sentido de responsabilidad de calidad por parte de los desarrolladores, y la percepción de los testers como un cuello de botella.",
      en: "According to the syllabus, drawbacks of test independence include testers becoming isolated from the development team, communication problems, adversarial relationships, developers losing a sense of responsibility for quality, and testers being seen as a bottleneck."
    }
  },

  // ===== CHAPTER 2 (Testing Throughout the SDLC) — additional LO-mapped questions =====
  {
    id: 65, chapter: 1, lo: "FL-2.2.3", k: 2,
    source: "Syllabus v4.0 §2.2.3",
    q: {
      es: "Tras corregir un defecto, se vuelve a ejecutar el mismo caso de prueba que lo detectó para comprobar que ha quedado solucionado. ¿Qué tipo de prueba es?",
      en: "After a defect is fixed, the same test case that detected it is re-executed to check the fix worked. What type of testing is this?"
    },
    options: {
      es: ["Prueba de confirmación", "Prueba de regresión", "Prueba de humo", "Prueba de mantenimiento"],
      en: ["Confirmation testing", "Regression testing", "Smoke testing", "Maintenance testing"]
    },
    correct: 0,
    explanation: {
      es: "La prueba de confirmación (re-test) vuelve a ejecutar el caso que falló, tras la corrección, para confirmar que el defecto se resolvió. La regresión busca efectos secundarios no deseados en otras partes.",
      en: "Confirmation testing (re-testing) re-runs the failed test after the fix to confirm the defect is resolved. Regression testing looks for unintended side effects elsewhere."
    }
  },
  {
    id: 66, chapter: 1, lo: "FL-2.1.1", k: 2,
    source: "Syllabus v4.0 §2.1.1",
    q: {
      es: "Un equipo debe decidir cómo organizar sus actividades de prueba al elegir entre un modelo de ciclo de vida secuencial (por ejemplo, cascada) o uno iterativo-incremental (por ejemplo, ágil). Según el syllabus, ¿qué aspectos de la prueba se ven afectados por la elección del CVDS (ciclo de vida de desarrollo de software)?",
      en: "A team must decide how to organize its test activities when choosing between a sequential lifecycle model (e.g., waterfall) and an iterative-incremental one (e.g., agile). According to the syllabus, which aspects of testing are impacted by the choice of SDLC (software development lifecycle)?"
    },
    options: {
      es: [
        "Únicamente el número de probadores contratados para el proyecto",
        "El alcance y la cronología de las actividades de prueba, el nivel de detalle de la documentación, las técnicas de prueba elegidas y el alcance de la automatización",
        "Solo el presupuesto asignado a la fase de mantenimiento",
        "Nada; las actividades de prueba son siempre idénticas independientemente del modelo de CVDS elegido"
      ],
      en: [
        "Only the number of testers hired for the project",
        "The scope and timing of test activities, the level of detail of test documentation, the chosen test techniques, and the extent of test automation",
        "Only the budget allocated to the maintenance phase",
        "Nothing; test activities are always identical regardless of the chosen SDLC model"
      ]
    },
    correct: 1,
    explanation: {
      es: "El CVDS elegido repercute en el alcance/cronología de los niveles y tipos de prueba, el nivel de detalle de la documentación, las técnicas y el enfoque de prueba, el alcance de la automatización y el rol del probador. Además, independientemente del CVDS, aplican buenas prácticas comunes: cada actividad de desarrollo tiene su actividad de prueba correspondiente y el análisis/diseño de prueba comienza pronto (prueba temprana).",
      en: "The chosen SDLC impacts the scope/timing of test levels and types, the level of detail of test documentation, test techniques and approach, the extent of automation, and the tester's role. Regardless of the SDLC, common good practices apply: every development activity has a corresponding test activity, and test analysis/design starts early (early testing)."
    }
  },
  {
    id: 67, chapter: 1, lo: "FL-2.1.3", k: 1,
    source: "Syllabus v4.0 §2.1.3",
    q: {
      es: "¿Cuáles son ejemplos de enfoques de 'prueba primero' (test-first) para el desarrollo de software, según el syllabus?",
      en: "Which are examples of 'test-first' approaches to software development, according to the syllabus?"
    },
    options: {
      es: [
        "Cascada, modelo en V y modelo en espiral",
        "Revisión informal, walkthrough e inspección",
        "Desarrollo guiado por pruebas (TDD), desarrollo guiado por pruebas de aceptación (ATDD) y desarrollo guiado por el comportamiento (BDD)",
        "Prueba de humo, prueba de confirmación y prueba de regresión"
      ],
      en: [
        "Waterfall, V-model and spiral model",
        "Informal review, walkthrough and inspection",
        "Test-Driven Development (TDD), Acceptance Test-Driven Development (ATDD) and Behaviour-Driven Development (BDD)",
        "Smoke testing, confirmation testing and regression testing"
      ]
    },
    correct: 2,
    explanation: {
      es: "TDD, ATDD y BDD son enfoques donde las pruebas se definen antes de escribir el código, aplicando el principio de prueba temprana y el desplazamiento a la izquierda, y apoyando un modelo de desarrollo iterativo.",
      en: "TDD, ATDD and BDD are approaches where tests are defined before the code is written, applying the early testing principle and shift-left approach, and supporting an iterative development model."
    }
  },
  {
    id: 68, chapter: 1, lo: "FL-2.1.4", k: 2,
    source: "Syllabus v4.0 §2.1.4",
    q: {
      es: "¿Cuál de las siguientes es una ventaja de DevOps desde la perspectiva de la prueba, según el syllabus?",
      en: "Which of the following is an advantage of DevOps from a testing perspective, according to the syllabus?"
    },
    options: {
      es: [
        "La integración continua (IC) promueve un enfoque de desplazamiento a la izquierda, animando a los desarrolladores a entregar código acompañado de pruebas de componente y análisis estático",
        "DevOps elimina completamente la necesidad de pruebas manuales",
        "DevOps garantiza que no se necesiten recursos adicionales para automatizar las pruebas",
        "DevOps sustituye la necesidad de un cambio cultural dentro de la organización"
      ],
      en: [
        "Continuous integration (CI) promotes a shift-left approach by encouraging developers to deliver code accompanied by component tests and static analysis",
        "DevOps completely eliminates the need for manual testing",
        "DevOps guarantees that no additional resources are needed to automate testing",
        "DevOps replaces the need for a cultural change within the organization"
      ]
    },
    correct: 0,
    explanation: {
      es: "Entre las ventajas de DevOps para la prueba están la retroalimentación rápida, que la IC promueva el desplazamiento a la izquierda, procesos automatizados (CI/CD) que facilitan entornos de prueba estables, y menor riesgo de regresión. Sin embargo, la prueba manual sigue siendo necesaria y la automatización requiere recursos y mantenimiento.",
      en: "DevOps advantages for testing include fast feedback, CI promoting a shift-left approach, automated CI/CD processes that facilitate stable test environments, and reduced regression risk. However, manual testing is still necessary and automation requires resources and maintenance."
    }
  },
  {
    id: 69, chapter: 1, lo: "FL-2.1.5", k: 2,
    source: "Syllabus v4.0 §2.1.5",
    q: {
      es: "¿Cuál de las siguientes es una buena práctica para lograr un enfoque de 'desplazamiento a la izquierda' (shift-left), según el syllabus?",
      en: "Which of the following is a good practice for achieving a 'shift-left' approach, according to the syllabus?"
    },
    options: {
      es: [
        "Posponer todas las pruebas no funcionales hasta después de la aceptación del usuario",
        "Esperar a que el sistema completo esté integrado antes de iniciar cualquier análisis estático",
        "Reducir la participación de los probadores en las fases iniciales del proyecto",
        "Revisar la especificación desde la perspectiva de la prueba y redactar los casos de prueba antes de escribir el código"
      ],
      en: [
        "Postpone all non-functional testing until after user acceptance",
        "Wait until the whole system is integrated before starting any static analysis",
        "Reduce testers' involvement in the early phases of the project",
        "Review the specification from a testing perspective and write test cases before the code is written"
      ]
    },
    correct: 3,
    explanation: {
      es: "Las buenas prácticas de desplazamiento a la izquierda incluyen revisar las especificaciones desde la perspectiva de la prueba, redactar casos de prueba antes de escribir el código, usar IC/EC, completar el análisis estático antes de la prueba dinámica, y realizar pruebas no funcionales desde el nivel de componente cuando sea posible.",
      en: "Shift-left good practices include reviewing specifications from a testing perspective, writing test cases before the code is written, using CI/CD, completing static analysis before dynamic testing, and performing non-functional testing starting at the component level when possible."
    }
  },
  {
    id: 70, chapter: 1, lo: "FL-2.1.6", k: 2,
    source: "Syllabus v4.0 §2.1.6",
    q: {
      es: "¿Cuál es el propósito PRINCIPAL de una retrospectiva de proyecto o de iteración, según el syllabus?",
      en: "What is the MAIN purpose of a project or iteration retrospective, according to the syllabus?"
    },
    options: {
      es: [
        "Debatir qué tuvo éxito y debe conservarse, qué no funcionó y puede mejorarse, y cómo incorporar esas mejoras en el futuro",
        "Evaluar el desempeño individual de cada probador para decisiones salariales",
        "Sustituir el informe de cierre de pruebas por una reunión informal",
        "Determinar exclusivamente qué herramientas de automatización se deben comprar"
      ],
      en: [
        "Discuss what worked well and should be kept, what did not work and could be improved, and how to incorporate improvements going forward",
        "Evaluate each tester's individual performance for salary decisions",
        "Replace the test completion report with an informal meeting",
        "Determine exclusively which automation tools should be purchased"
      ]
    },
    correct: 0,
    explanation: {
      es: "Las retrospectivas, en las que participan probadores, desarrolladores, arquitectos, el propietario de producto y analistas de negocio, debaten qué tuvo éxito, qué puede mejorarse y cómo incorporar las mejoras. Sus beneficios incluyen mayor efectividad de la prueba, mejor calidad de los productos de prueba y mejor cooperación entre desarrollo y prueba.",
      en: "Retrospectives, attended by testers, developers, architects, the product owner and business analysts, discuss what succeeded, what can be improved, and how to incorporate improvements. Benefits include increased test effectiveness, better quality of test work products, and improved cooperation between development and testing."
    }
  },
  {
    id: 71, chapter: 1, lo: "FL-2.2.1", k: 2,
    source: "Syllabus v4.0 §2.2.1",
    q: {
      es: "¿Cuál de las siguientes es una FORMA reconocida de prueba de ACEPTACIÓN (nivel de prueba), según el syllabus?",
      en: "Which of the following is a recognized form of ACCEPTANCE testing (test level), according to the syllabus?"
    },
    options: {
      es: [
        "Prueba de integración de componentes",
        "Prueba de humo (smoke testing)",
        "Prueba de aceptación operativa",
        "Análisis estático del código fuente"
      ],
      en: [
        "Component integration testing",
        "Smoke testing",
        "Operational acceptance testing",
        "Static analysis of the source code"
      ]
    },
    correct: 2,
    explanation: {
      es: "Las principales formas de prueba de aceptación son: prueba de aceptación de usuario (PAU), prueba de aceptación operativa, prueba de aceptación contractual y de regulación, prueba alfa y prueba beta. Se concentran en validar que el sistema satisface las necesidades de negocio del usuario y está listo para el despliegue.",
      en: "The main forms of acceptance testing are: user acceptance testing (UAT), operational acceptance testing, contractual and regulatory acceptance testing, alpha testing and beta testing. They focus on validating that the system meets the user's business needs and is ready for deployment."
    }
  },
  {
    id: 72, chapter: 1, lo: "FL-2.2.2", k: 2,
    source: "Syllabus v4.0 §2.2.2",
    q: {
      es: "Un tester diseña casos de prueba a partir del código fuente y los flujos de datos internos del sistema, sin considerar la especificación externa. ¿Qué TIPO de prueba, de los cuatro descritos en el syllabus, está realizando?",
      en: "A tester designs test cases based on the source code and the system's internal data flows, without considering the external specification. Which TYPE of testing, among the four described in the syllabus, is this?"
    },
    options: {
      es: [
        "Prueba de caja negra",
        "Prueba de caja blanca",
        "Prueba funcional",
        "Prueba de aceptación"
      ],
      en: [
        "Black-box testing",
        "White-box testing",
        "Functional testing",
        "Acceptance testing"
      ]
    },
    correct: 1,
    explanation: {
      es: "La prueba de caja blanca se basa en la estructura y obtiene pruebas de la implementación interna (código, arquitectura, flujos de trabajo y de datos). La prueba de caja negra, en cambio, obtiene pruebas a partir de documentación externa al objeto de prueba. Ambas, junto con la prueba funcional y no funcional, son los cuatro tipos de prueba y pueden aplicarse en todos los niveles de prueba.",
      en: "White-box testing is structure-based and derives tests from the internal implementation (code, architecture, workflows and data flows). Black-box testing, in contrast, derives tests from documentation external to the test object. Both, together with functional and non-functional testing, are the four test types and can be applied at all test levels."
    }
  },
  {
    id: 73, chapter: 1, lo: "FL-2.3.1", k: 2,
    source: "Syllabus v4.0 §2.3.1",
    q: {
      es: "¿Cuál de los siguientes es un DESENCADENANTE (trigger) típico de la prueba de mantenimiento, según el syllabus?",
      en: "Which of the following is a typical TRIGGER for maintenance testing, according to the syllabus?"
    },
    options: {
      es: [
        "La redacción inicial del plan de pruebas del proyecto",
        "La migración del entorno de operación a una nueva plataforma",
        "La selección del framework de automatización de pruebas",
        "La firma del contrato con el cliente al inicio del proyecto"
      ],
      en: [
        "The initial drafting of the project's test plan",
        "Migration of the operational environment to a new platform",
        "The selection of the test automation framework",
        "Signing the contract with the customer at the start of the project"
      ]
    },
    correct: 1,
    explanation: {
      es: "Los desencadenantes de la prueba de mantenimiento incluyen modificaciones (mejoras planificadas, cambios correctivos o correcciones en caliente), actualizaciones o migraciones del entorno de operación (por ejemplo, a una nueva plataforma, requiriendo pruebas de conversión de datos) y la retirada del sistema. El alcance depende del riesgo del cambio, el tamaño del sistema y la magnitud del cambio.",
      en: "Maintenance testing triggers include modifications (planned enhancements, corrective changes or hotfixes), updates or migrations of the operational environment (e.g., to a new platform, requiring data conversion testing) and system retirement. The scope depends on the risk of the change, the size of the system and the magnitude of the change."
    }
  },
  // ===== CHAPTER 3: STATIC TESTING (extra, Task 4) =====
  {
    id: 74, chapter: 2, lo: "FL-3.2.4", k: 2,
    source: "Syllabus v4.0 §3.2.4",
    q: {
      es: "¿Cuál de los siguientes tipos de revisión es el MÁS formal, sigue un proceso definido y suele incluir métricas y roles asignados?",
      en: "Which of the following review types is the MOST formal, follows a defined process and usually includes metrics and assigned roles?"
    },
    options: {
      es: ["Inspección", "Revisión informal", "Walkthrough (recorrido)", "Revisión técnica"],
      en: ["Inspection", "Informal review", "Walkthrough", "Technical review"]
    },
    correct: 0,
    explanation: {
      es: "La inspección es el tipo de revisión más formal: sigue un proceso definido, con roles, reglas de entrada/salida y recolección de métricas. La revisión informal es la menos formal.",
      en: "The inspection is the most formal review type: it follows a defined process with roles, entry/exit rules and metrics collection. The informal review is the least formal."
    }
  },
  {
    id: 75, chapter: 2, lo: "FL-3.1.1", k: 1,
    source: "Syllabus v4.0 §3.1.1",
    q: {
      es: "Según el syllabus, ¿cuál de los siguientes productos de trabajo es MENOS apropiado para ser examinado mediante prueba estática?",
      en: "According to the syllabus, which of the following work products is LEAST appropriate to be examined through static testing?"
    },
    options: {
      es: [
        "El código ejecutable de terceros, difícil de interpretar y que no debe ser analizado por razones legales",
        "Un documento de especificación de requisitos",
        "El código fuente escrito por el equipo de desarrollo",
        "Un plan de pruebas o un caso de prueba"
      ],
      en: [
        "Third-party executable code, hard to interpret and that must not be analyzed for legal reasons",
        "A requirements specification document",
        "Source code written by the development team",
        "A test plan or a test case"
      ]
    },
    correct: 0,
    explanation: {
      es: "Casi cualquier producto de trabajo legible y comprensible puede examinarse mediante prueba estática (requisitos, código fuente, planes y casos de prueba, elementos del backlog, etc.). Los productos NO apropiados son los difíciles de interpretar por personas y que no deben analizarse con herramientas, como el código ejecutable de terceros por razones legales.",
      en: "Almost any readable and understandable work product can be examined via static testing (requirements, source code, test plans and cases, backlog items, etc.). Work products that are NOT appropriate are those hard for people to interpret and that must not be analyzed by tools, such as third-party executable code for legal reasons."
    }
  },
  {
    id: 76, chapter: 2, lo: "FL-3.1.2", k: 2,
    source: "Syllabus v4.0 §3.1.2",
    q: {
      es: "Según el syllabus, ¿por qué los costes totales del proyecto suelen ser MENORES cuando se realizan revisiones, a pesar de que implementarlas tiene un coste?",
      en: "According to the syllabus, why are total project costs usually LOWER when reviews are performed, even though implementing reviews has a cost?"
    },
    options: {
      es: [
        "Porque se necesita dedicar menos tiempo y esfuerzo a corregir defectos cuando el proyecto está más avanzado",
        "Porque las revisiones eliminan por completo la necesidad de realizar pruebas dinámicas",
        "Porque las revisiones siempre las realizan herramientas automáticas sin coste de personal",
        "Porque las revisiones sustituyen a la gestión de requisitos y al diseño"
      ],
      en: [
        "Because less time and effort is needed to fix defects when the project is further advanced",
        "Because reviews completely eliminate the need for dynamic testing",
        "Because reviews are always performed by automated tools at no staffing cost",
        "Because reviews replace requirements management and design"
      ]
    },
    correct: 0,
    explanation: {
      es: "Aunque implementar revisiones puede resultar costoso, los costes totales del proyecto suelen ser menores que cuando no se realizan, ya que se necesita dedicar menos tiempo y esfuerzo a la corrección de defectos cuando el proyecto se encuentra más avanzado. Además, la prueba estática cumple el principio de prueba temprana y puede detectar defectos que la prueba dinámica no encuentra.",
      en: "Although implementing reviews can be costly, total project costs are usually much lower than when reviews are not performed, since less time and effort is needed to fix defects later in the project. Static testing also fulfills the early testing principle and can find defects that dynamic testing cannot."
    }
  },
  {
    id: 77, chapter: 2, lo: "FL-3.1.3", k: 2,
    source: "Syllabus v4.0 §3.1.3",
    q: {
      es: "Según el syllabus, ¿cuál de las siguientes es una diferencia CORRECTA entre la prueba estática y la prueba dinámica?",
      en: "According to the syllabus, which of the following is a CORRECT difference between static and dynamic testing?"
    },
    options: {
      es: [
        "La prueba estática encuentra los defectos directamente, mientras que la prueba dinámica provoca fallos a partir de los cuales se determinan los defectos mediante un análisis posterior",
        "La prueba estática solo puede aplicarse a productos de trabajo ejecutables, igual que la dinámica",
        "La prueba dinámica detecta más fácilmente los defectos en caminos del código que rara vez se ejecutan",
        "La prueba estática mide características de calidad que dependen de la ejecución del código, como la eficiencia de rendimiento"
      ],
      en: [
        "Static testing finds defects directly, while dynamic testing causes failures from which the associated defects are determined through subsequent analysis",
        "Static testing can only be applied to executable work products, just like dynamic testing",
        "Dynamic testing more easily detects defects in code paths that are rarely executed",
        "Static testing measures quality characteristics that depend on code execution, such as performance efficiency"
      ]
    },
    correct: 0,
    explanation: {
      es: "La prueba estática y la dinámica son complementarias: la estática encuentra los defectos directamente, mientras que la dinámica provoca fallos a partir de los cuales se determinan los defectos mediante análisis posterior. Además, la prueba estática puede aplicarse a productos no ejecutables y detecta más fácilmente defectos en caminos de código poco ejecutados o difíciles de alcanzar dinámicamente.",
      en: "Static and dynamic testing are complementary: static testing finds defects directly, while dynamic testing causes failures from which the associated defects are determined through subsequent analysis. Static testing can also be applied to non-executable work products and more easily detects defects in code paths that are rarely executed or hard to reach dynamically."
    }
  },
  {
    id: 78, chapter: 2, lo: "FL-3.2.2", k: 2,
    source: "Syllabus v4.0 §3.2.2",
    q: {
      es: "En el proceso de revisión genérico del syllabus, ¿cómo se denomina la actividad en la que cada revisor evalúa el producto de trabajo por su cuenta, aplicando técnicas como la basada en lista de comprobación o en escenarios, y registra las anomalías encontradas?",
      en: "In the syllabus's generic review process, what is the activity called in which each reviewer independently evaluates the work product, applying techniques such as checklist-based or scenario-based review, and records the anomalies found?"
    },
    options: {
      es: ["Revisión individual", "Planificación", "Inicio de la revisión", "Corrección y suministro de información"],
      en: ["Individual review", "Planning", "Review initiation", "Fixing and reporting"]
    },
    correct: 0,
    explanation: {
      es: "Las actividades del proceso de revisión son: planificación, inicio de la revisión, revisión individual, comunicación y análisis, y corrección y suministro de información. En la revisión individual, cada revisor evalúa la calidad del producto de trabajo aplicando una o varias técnicas (por ejemplo, basada en lista de comprobación o en escenarios) y registra las anomalías, recomendaciones y preguntas identificadas.",
      en: "The review process activities are: planning, review initiation, individual review, communication and analysis, and fixing and reporting. During individual review, each reviewer evaluates the quality of the work product applying one or more techniques (e.g., checklist-based or scenario-based review) and records the anomalies, recommendations and questions identified."
    }
  },
  {
    id: 79, chapter: 2, lo: "FL-3.2.5", k: 1,
    source: "Syllabus v4.0 §3.2.5",
    q: {
      es: "Según el syllabus, ¿cuál de las siguientes acciones NUNCA debe ser un objetivo de una revisión, siendo en realidad contraria a los factores de éxito de las revisiones?",
      en: "According to the syllabus, which of the following actions should NEVER be an objective of a review, being in fact contrary to the success factors of reviews?"
    },
    options: {
      es: [
        "Evaluar el desempeño de los participantes",
        "Definir objetivos claros y criterios de salida medibles",
        "Proporcionar tiempo suficiente a los participantes para prepararse",
        "Contar con el apoyo de la dirección al proceso de revisión"
      ],
      en: [
        "Evaluating the performance of the participants",
        "Defining clear objectives and measurable exit criteria",
        "Providing participants with sufficient time to prepare",
        "Having management support for the review process"
      ]
    },
    correct: 0,
    explanation: {
      es: "Entre los factores de éxito de las revisiones, el syllabus destaca definir objetivos claros y criterios de salida medibles, elegir el tipo de revisión adecuado, revisar en fragmentos pequeños, dar tiempo suficiente para prepararse y contar con apoyo de la dirección. Explícitamente señala que la evaluación del desempeño de los participantes NUNCA debe ser un objetivo de la revisión.",
      en: "Among the success factors for reviews, the syllabus highlights defining clear objectives and measurable exit criteria, choosing the right review type, reviewing in small chunks, giving participants enough time to prepare, and having management support. It explicitly states that evaluating the performance of participants should NEVER be an objective of the review."
    }
  },
  // ===== CHAPTER 4 (Test Analysis & Design) — additional LO-mapped questions (Task 5) =====
  {
    id: 80, chapter: 3, lo: "FL-4.2.2", k: 3,
    source: "Syllabus v4.0 §4.2.2",
    q: {
      es: "Un campo de entrada acepta números enteros válidos de 1 a 100. Aplicando el análisis de valores límite de 2 valores, ¿qué conjunto de valores límite debería probarse?",
      en: "An input field accepts valid integers from 1 to 100. Applying 2-value boundary value analysis, which set of boundary values should be tested?"
    },
    options: {
      es: ["0, 1, 100, 101", "1, 100", "1, 50, 100", "0, 50, 101"],
      en: ["0, 1, 100, 101", "1, 100", "1, 50, 100", "0, 50, 101"]
    },
    correct: 0,
    explanation: {
      es: "El BVA de 2 valores prueba cada valor límite y su valor adyacente. Para los límites 1 y 100, los valores a probar son 0 y 1 (en torno al límite inferior) y 100 y 101 (en torno al superior).",
      en: "2-value BVA tests each boundary and its adjacent value. For boundaries 1 and 100, the values to test are 0 and 1 (around the lower boundary) and 100 and 101 (around the upper one)."
    }
  },
  {
    id: 81, chapter: 3, lo: "FL-4.1.1", k: 2,
    source: "Syllabus v4.0 §4.1.1",
    q: {
      es: "¿Cuál de las siguientes técnicas se clasifica como técnica de prueba de CAJA BLANCA (basada en la estructura)?",
      en: "Which of the following techniques is classified as a WHITE-BOX (structure-based) test technique?"
    },
    options: {
      es: ["Partición de equivalencia", "Prueba de rama (branch testing)", "Tabla de decisión", "Prueba exploratoria"],
      en: ["Equivalence partitioning", "Branch testing", "Decision table testing", "Exploratory testing"]
    },
    correct: 1,
    explanation: {
      es: "Las técnicas de caja blanca se basan en el análisis de la estructura interna y el procesamiento del objeto de prueba, y solo pueden crearse tras el diseño o la implementación del código. La prueba de rama analiza el código fuente y sus ramas de decisión, por lo que es una técnica de caja blanca. Las otras tres son técnicas de caja negra o basadas en la experiencia.",
      en: "White-box techniques are based on analysis of the internal structure and processing of the test object, and can only be created after the code has been designed or implemented. Branch testing analyzes the source code and its decision branches, making it a white-box technique. The other three are black-box or experience-based techniques."
    }
  },
  {
    id: 82, chapter: 3, lo: "FL-4.1.1", k: 2,
    source: "Syllabus v4.0 §4.1.1",
    q: {
      es: "¿Cuál es la diferencia FUNDAMENTAL entre las técnicas de prueba de caja negra y las de caja blanca?",
      en: "What is the FUNDAMENTAL difference between black-box and white-box test techniques?"
    },
    options: {
      es: [
        "Las técnicas de caja negra se basan en el comportamiento especificado sin hacer referencia a la estructura interna; las de caja blanca se basan en el análisis de la estructura interna, por lo que solo pueden crearse después del diseño o la implementación",
        "Las técnicas de caja negra requieren siempre acceso al código fuente, mientras que las de caja blanca no",
        "No existe diferencia real; ambos términos son sinónimos según el syllabus",
        "Las técnicas de caja negra solo se aplican en pruebas unitarias; las de caja blanca solo en pruebas de sistema"
      ],
      en: [
        "Black-box techniques are based on specified behavior without referring to internal structure; white-box techniques are based on analysis of internal structure, so they can only be created after design or implementation",
        "Black-box techniques always require access to the source code, while white-box techniques do not",
        "There is no real difference; both terms are synonyms according to the syllabus",
        "Black-box techniques only apply to unit testing; white-box techniques only to system testing"
      ]
    },
    correct: 0,
    explanation: {
      es: "Las técnicas de caja negra (basadas en la especificación) analizan el comportamiento especificado del objeto de prueba sin referencia a su estructura interna, por lo que los casos de prueba son independientes de la implementación. Las técnicas de caja blanca (basadas en la estructura) analizan la estructura interna y el procesamiento, por lo que solo pueden crearse tras el diseño o la implementación del objeto de prueba.",
      en: "Black-box techniques (specification-based) analyze the specified behavior of the test object without reference to its internal structure, so test cases are independent of the implementation. White-box techniques (structure-based) analyze the internal structure and processing, so they can only be created after the test object has been designed or implemented."
    }
  },
  {
    id: 83, chapter: 3, lo: "FL-4.1.1", k: 2,
    source: "Syllabus v4.0 §4.1.1",
    q: {
      es: "Según el syllabus, ¿qué característica distingue a las técnicas de prueba BASADAS EN LA EXPERIENCIA?",
      en: "According to the syllabus, what characteristic distinguishes EXPERIENCE-BASED test techniques?"
    },
    options: {
      es: [
        "Son las únicas capaces de alcanzar el 100% de cobertura de código",
        "Dependen en gran medida de los conocimientos y competencias del probador, y pueden detectar defectos no detectados por las técnicas de caja negra y de caja blanca, siendo complementarias a ellas",
        "Solo pueden aplicarse antes de que el código esté implementado",
        "Sustituyen completamente la necesidad de aplicar técnicas de caja negra y de caja blanca"
      ],
      en: [
        "They are the only techniques able to achieve 100% code coverage",
        "They rely heavily on the tester's knowledge and skills, and can detect defects not found by black-box and white-box techniques, making them complementary to those techniques",
        "They can only be applied before the code has been implemented",
        "They completely replace the need to apply black-box and white-box techniques"
      ]
    },
    correct: 1,
    explanation: {
      es: "Las técnicas basadas en la experiencia utilizan de forma eficaz los conocimientos y la experiencia de los probadores. Su efectividad depende en gran medida de las competencias del probador, y pueden detectar defectos que las técnicas de caja negra y caja blanca no detectan, por lo que son complementarias a ellas, no sustitutas.",
      en: "Experience-based techniques effectively use testers' knowledge and experience. Their effectiveness depends heavily on the tester's skills, and they can detect defects that black-box and white-box techniques do not, making them complementary rather than a replacement."
    }
  },
  {
    id: 84, chapter: 3, lo: "FL-4.2.1", k: 3,
    source: "Syllabus v4.0 §4.2.1",
    q: {
      es: "Un sistema de reservas de vuelos acepta un número entero de asientos por transacción: los valores de 1 a 9 (inclusive) son válidos; 0 o menos, y 10 o más, son inválidos. Aplicando partición de equivalencia, ¿qué conjunto de valores de prueba representa correctamente las 3 particiones (una válida y dos inválidas)?",
      en: "A flight booking system accepts an integer number of seats per transaction: values from 1 to 9 (inclusive) are valid; 0 or less, and 10 or more, are invalid. Applying equivalence partitioning, which set of test values correctly represents the 3 partitions (one valid, two invalid)?"
    },
    options: {
      es: ["-1, 5, 15", "0, 1, 9, 10", "5, 6, 7", "-1, 15"],
      en: ["-1, 5, 15", "0, 1, 9, 10", "5, 6, 7", "-1, 15"]
    },
    correct: 0,
    explanation: {
      es: "La partición de equivalencia requiere un valor representativo de CADA partición: uno de la partición inválida inferior (p. ej., -1), uno de la partición válida (p. ej., 5) y uno de la partición inválida superior (p. ej., 15). La opción 0,1,9,10 corresponde a valores de BVA (límites y adyacentes), no a representantes de partición; 5,6,7 solo cubre la partición válida; -1,15 omite la partición válida.",
      en: "Equivalence partitioning requires one representative value from EACH partition: one from the lower invalid partition (e.g., -1), one from the valid partition (e.g., 5), and one from the upper invalid partition (e.g., 15). The 0,1,9,10 option corresponds to BVA values (boundaries and neighbors), not EP representatives; 5,6,7 only covers the valid partition; -1,15 omits the valid partition."
    }
  },
  {
    id: 85, chapter: 3, lo: "FL-4.2.1", k: 3,
    source: "Syllabus v4.0 §4.2.1",
    q: {
      es: "Un formulario de checkout acepta como método de pago únicamente los valores 'Tarjeta de crédito', 'PayPal' o 'Transferencia bancaria'; cualquier otro valor introducido (por ejemplo, 'Bitcoin') debe ser rechazado. Aplicando partición de equivalencia sobre este campo, ¿cuántas particiones se identifican y de qué tipo?",
      en: "A checkout form accepts only 'Credit card', 'PayPal' or 'Bank transfer' as payment method values; any other entered value (e.g., 'Bitcoin') must be rejected. Applying equivalence partitioning to this field, how many partitions are identified and of what type?"
    },
    options: {
      es: [
        "1 única partición inválida",
        "3 particiones válidas (una por cada método de pago admitido) y 1 partición inválida (cualquier otro valor)",
        "3 particiones válidas y 3 particiones inválidas correspondientes, una por cada método",
        "1 partición válida que agrupa los tres métodos y 1 partición inválida"
      ],
      en: [
        "1 single invalid partition",
        "3 valid partitions (one per supported payment method) and 1 invalid partition (any other value)",
        "3 valid partitions and 3 corresponding invalid partitions, one per method",
        "1 valid partition grouping all three methods and 1 invalid partition"
      ]
    },
    correct: 1,
    explanation: {
      es: "Las particiones de equivalencia pueden ser discretas y desordenadas. Cada valor válido discreto que el sistema puede procesar de forma distinta constituye su propia partición válida (Tarjeta, PayPal, Transferencia), y todos los valores no reconocidos forman una única partición inválida, ya que el sistema los trata de la misma manera (rechazo).",
      en: "Equivalence partitions can be discrete and unordered. Each discrete valid value that the system may process differently forms its own valid partition (Card, PayPal, Bank transfer), while all unrecognized values form a single invalid partition, since the system treats them the same way (rejection)."
    }
  },
  {
    id: 86, chapter: 3, lo: "FL-4.2.1", k: 3,
    source: "Syllabus v4.0 §4.2.1",
    q: {
      es: "Un formulario tiene dos parámetros independientes: 'País de envío' (particiones: Nacional, Internacional) y 'Método de pago' (particiones: Tarjeta, Efectivo contra entrega). Aplicando el criterio de cobertura de 'Cada Elección' (Each Choice) de partición de equivalencia, ¿cuál es el número MÍNIMO de casos de prueba necesarios para lograr el 100% de cobertura?",
      en: "A form has two independent parameters: 'Shipping country' (partitions: Domestic, International) and 'Payment method' (partitions: Card, Cash on delivery). Applying the Each Choice equivalence partitioning coverage criterion, what is the MINIMUM number of test cases needed to achieve 100% coverage?"
    },
    options: {
      es: ["4 (todas las combinaciones posibles)", "2 (el tamaño del conjunto de particiones más grande)", "1 (un único caso puede cubrirlo todo)", "3"],
      en: ["4 (all possible combinations)", "2 (the size of the largest partition set)", "1 (a single case can cover everything)", "3"]
    },
    correct: 1,
    explanation: {
      es: "La cobertura de Cada Elección exige que los casos de prueba utilicen cada partición de cada conjunto al menos una vez, sin exigir todas las combinaciones. Con dos conjuntos de 2 particiones cada uno, bastan 2 casos de prueba (p. ej., Nacional+Tarjeta e Internacional+Efectivo) para cubrir todas las particiones al menos una vez; probar las 4 combinaciones sería un criterio más fuerte (combinatorio), no exigido por Cada Elección.",
      en: "Each Choice coverage requires test cases to use each partition of each set at least once, without requiring all combinations. With two sets of 2 partitions each, 2 test cases suffice (e.g., Domestic+Card and International+Cash) to cover all partitions at least once; testing all 4 combinations would be a stronger (combinatorial) criterion, not required by Each Choice."
    }
  },
  {
    id: 87, chapter: 3, lo: "FL-4.2.3", k: 3,
    source: "Syllabus v4.0 §4.2.3",
    q: {
      es: "Un sistema de envíos aplica las siguientes reglas de negocio: (1) Si el cliente es Premium, el envío es siempre gratuito, sin importar el peso del paquete. (2) Si el cliente NO es Premium y el paquete pesa más de 10 kg, se aplica un recargo de envío. (3) Si el cliente NO es Premium y el paquete pesa 10 kg o menos, el envío tiene coste estándar (sin recargo ni gratuidad). Usando una tabla de decisión con las condiciones 'Cliente Premium' y 'Peso > 10 kg', ¿qué acción resulta de la regla 'Cliente Premium = Falso' y 'Peso > 10 kg = Verdadero'?",
      en: "A shipping system applies these business rules: (1) If the customer is Premium, shipping is always free, regardless of package weight. (2) If the customer is NOT Premium and the package weighs more than 10 kg, a shipping surcharge applies. (3) If the customer is NOT Premium and the package weighs 10 kg or less, shipping has a standard cost (no surcharge, no free shipping). Using a decision table with the conditions 'Premium customer' and 'Weight > 10 kg', what action results from the rule 'Premium customer = False' and 'Weight > 10 kg = True'?"
    },
    options: {
      es: ["Envío gratuito", "Recargo de envío", "Envío estándar, sin recargo", "La combinación es inviable (N/A)"],
      en: ["Free shipping", "Shipping surcharge", "Standard shipping, no surcharge", "The combination is infeasible (N/A)"]
    },
    correct: 1,
    explanation: {
      es: "Según la regla (2) del enunciado, cuando el cliente NO es Premium y el paquete pesa más de 10 kg, se aplica un recargo de envío. La gratuidad (regla 1) solo aplica a clientes Premium, y el coste estándar (regla 3) solo aplica cuando el peso es ≤10 kg.",
      en: "According to rule (2) in the scenario, when the customer is NOT Premium and the package weighs more than 10 kg, a shipping surcharge applies. Free shipping (rule 1) only applies to Premium customers, and the standard cost (rule 3) only applies when the weight is ≤10 kg."
    }
  },
  {
    id: 88, chapter: 3, lo: "FL-4.2.3", k: 3,
    source: "Syllabus v4.0 §4.2.3",
    q: {
      es: "Un gimnasio gestiona reservas de clases con las condiciones 'Es socio' y 'Cuota al día', sabiendo que el concepto de 'cuota al día' SOLO existe y aplica para quienes son socios (un no socio no paga cuota de socio). ¿Cuál de las siguientes combinaciones de condiciones es IMPOSIBLE (inviable, N/A) en la tabla de decisión?",
      en: "A gym manages class bookings with the conditions 'Is member' and 'Membership fee up to date', knowing that the concept of 'fee up to date' ONLY exists and applies to members (a non-member does not pay a membership fee). Which of the following condition combinations is IMPOSSIBLE (infeasible, N/A) in the decision table?"
    },
    options: {
      es: [
        "Es socio = Verdadero, Cuota al día = Verdadero",
        "Es socio = Verdadero, Cuota al día = Falso",
        "Es socio = Falso, Cuota al día = Verdadero",
        "Es socio = Falso, Cuota al día = Falso"
      ],
      en: [
        "Is member = True, Fee up to date = True",
        "Is member = True, Fee up to date = False",
        "Is member = False, Fee up to date = True",
        "Is member = False, Fee up to date = False"
      ]
    },
    correct: 2,
    explanation: {
      es: "Dado que 'cuota al día' solo tiene sentido para socios, la combinación 'Es socio = Falso' junto con 'Cuota al día = Verdadero' es lógicamente imposible: un no socio no puede tener una cuota de socio al día. Esta columna debería marcarse como N/A y eliminarse de la tabla de decisión.",
      en: "Since 'fee up to date' only makes sense for members, the combination 'Is member = False' together with 'Fee up to date = True' is logically impossible: a non-member cannot have a member fee that is up to date. This column should be marked N/A and removed from the decision table."
    }
  },
  {
    id: 89, chapter: 3, lo: "FL-4.2.3", k: 3,
    source: "Syllabus v4.0 §4.2.3",
    q: {
      es: "Una tabla de decisión de entrada AMPLIADA (extended entry) tiene dos condiciones: 'Tipo de cliente' (con 3 valores posibles: Nuevo, Regular, VIP) y '¿Compra > $50?' (con 2 valores posibles: Sí, No). Sin combinaciones inviables, ¿cuántas reglas (columnas) completas tiene la tabla?",
      en: "An extended-entry decision table has two conditions: 'Customer type' (with 3 possible values: New, Regular, VIP) and 'Purchase > $50?' (with 2 possible values: Yes, No). With no infeasible combinations, how many complete rules (columns) does the table have?"
    },
    options: {
      es: ["5", "6", "8", "3"],
      en: ["5", "6", "8", "3"]
    },
    correct: 1,
    explanation: {
      es: "En una tabla de entrada ampliada, el número de reglas es el producto del número de valores posibles de cada condición: 3 (tipos de cliente) × 2 (valores de compra) = 6 reglas. Esto difiere de una tabla de entrada limitada con condiciones puramente booleanas, donde el número de reglas sería 2^n.",
      en: "In an extended-entry table, the number of rules is the product of the number of possible values of each condition: 3 (customer types) × 2 (purchase values) = 6 rules. This differs from a limited-entry table with purely boolean conditions, where the number of rules would be 2^n."
    }
  },
  {
    id: 90, chapter: 3, lo: "FL-4.2.3", k: 3,
    source: "Syllabus v4.0 §4.2.3",
    q: {
      es: "La regla de negocio de un sistema de biblioteca establece: 'Un usuario puede llevarse un libro en préstamo solo si NO tiene multas pendientes Y el libro está disponible. Si tiene multas pendientes, el préstamo se rechaza sin importar la disponibilidad del libro.' Usando una tabla de decisión con las condiciones 'Multas pendientes' y 'Libro disponible', ¿qué resultado corresponde a la regla 'Multas pendientes = Falso' y 'Libro disponible = Falso'?",
      en: "A library system's business rule states: 'A user can borrow a book only if they have NO pending fines AND the book is available. If they have pending fines, the loan is rejected regardless of book availability.' Using a decision table with the conditions 'Pending fines' and 'Book available', what outcome corresponds to the rule 'Pending fines = False' and 'Book available = False'?"
    },
    options: {
      es: ["Préstamo concedido", "Préstamo rechazado por libro no disponible", "Préstamo rechazado por multas pendientes", "Combinación inviable (N/A)"],
      en: ["Loan granted", "Loan rejected due to book unavailability", "Loan rejected due to pending fines", "Infeasible combination (N/A)"]
    },
    correct: 1,
    explanation: {
      es: "Cuando no hay multas pendientes pero el libro no está disponible, el préstamo se rechaza por falta de disponibilidad, no por multas (que en este caso son Falso). El préstamo solo se concede cuando ambas condiciones favorables se cumplen: sin multas Y libro disponible.",
      en: "When there are no pending fines but the book is not available, the loan is rejected due to unavailability, not due to fines (which are False in this case). The loan is only granted when both favorable conditions hold: no fines AND book available."
    }
  },
  {
    id: 91, chapter: 3, lo: "FL-4.2.4", k: 3,
    source: "Syllabus v4.0 §4.2.4",
    q: {
      es: "Un sistema de gestión de pedidos tiene los estados Creado, Pagado, Enviado, Entregado y Cancelado, con las transiciones válidas: Creado→Pagado, Creado→Cancelado, Pagado→Enviado, Pagado→Cancelado y Enviado→Entregado. Aplicando el criterio de cobertura de TODOS LOS ESTADOS, ¿cuál es el número MÍNIMO de casos de prueba para visitar todos los estados al menos una vez?",
      en: "An order management system has the states Created, Paid, Shipped, Delivered and Cancelled, with valid transitions: Created→Paid, Created→Cancelled, Paid→Shipped, Paid→Cancelled and Shipped→Delivered. Applying the ALL STATES coverage criterion, what is the MINIMUM number of test cases needed to visit all states at least once?"
    },
    options: {
      es: ["1", "2", "5", "4"],
      en: ["1", "2", "5", "4"]
    },
    correct: 1,
    explanation: {
      es: "Un caso de prueba puede recorrer Creado→Pagado→Enviado→Entregado, visitando 4 estados. Como Cancelado solo se alcanza abandonando ese flujo (p. ej., Creado→Cancelado), se necesita un segundo caso de prueba para visitarlo. Por lo tanto, el mínimo es 2 casos de prueba para cubrir los 5 estados.",
      en: "One test case can traverse Created→Paid→Shipped→Delivered, visiting 4 states. Since Cancelled is only reached by leaving that flow (e.g., Created→Cancelled), a second test case is needed to visit it. Therefore, the minimum is 2 test cases to cover all 5 states."
    }
  },
  {
    id: 92, chapter: 3, lo: "FL-4.2.4", k: 3,
    source: "Syllabus v4.0 §4.2.4",
    q: {
      es: "Usando el mismo sistema de gestión de pedidos (transiciones válidas: Creado→Pagado, Creado→Cancelado, Pagado→Enviado, Pagado→Cancelado, Enviado→Entregado), ¿cuál es el número MÍNIMO de casos de prueba para lograr una cobertura del 100% de TRANSICIONES VÁLIDAS (cobertura de conmutador 0)?",
      en: "Using the same order management system (valid transitions: Created→Paid, Created→Cancelled, Paid→Shipped, Paid→Cancelled, Shipped→Delivered), what is the MINIMUM number of test cases needed to achieve 100% VALID TRANSITIONS coverage (0-switch coverage)?"
    },
    options: {
      es: ["5", "2", "3", "4"],
      en: ["5", "2", "3", "4"]
    },
    correct: 2,
    explanation: {
      es: "Un caso de prueba Creado→Pagado→Enviado→Entregado cubre 3 transiciones (Creado→Pagado, Pagado→Enviado, Enviado→Entregado). Se necesita un segundo caso, Creado→Cancelado, para cubrir esa transición, y un tercero, Creado→Pagado→Cancelado, para cubrir Pagado→Cancelado (ya que, tras cancelar, el flujo termina y no puede continuar en el mismo caso). En total, 3 casos de prueba cubren las 5 transiciones válidas.",
      en: "A test case Created→Paid→Shipped→Delivered covers 3 transitions (Created→Paid, Paid→Shipped, Shipped→Delivered). A second case, Created→Cancelled, is needed to cover that transition, and a third, Created→Paid→Cancelled, to cover Paid→Cancelled (since after cancelling the flow ends and cannot continue in the same case). In total, 3 test cases cover the 5 valid transitions."
    }
  },
  {
    id: 93, chapter: 3, lo: "FL-4.2.4", k: 3,
    source: "Syllabus v4.0 §4.2.4",
    q: {
      es: "Según el mismo modelo de estados del sistema de pedidos, ¿cuál de las siguientes transiciones sería INVÁLIDA y debería intentarse explícitamente al aplicar el criterio de cobertura de TODAS LAS TRANSICIONES (que incluye las inválidas)?",
      en: "Based on the same order state model, which of the following transitions would be INVALID and should be explicitly attempted when applying the ALL TRANSITIONS coverage criterion (which includes invalid ones)?"
    },
    options: {
      es: ["Enviado → Entregado", "Entregado → Pagado", "Creado → Pagado", "Pagado → Cancelado"],
      en: ["Shipped → Delivered", "Delivered → Paid", "Created → Paid", "Paid → Cancelled"]
    },
    correct: 1,
    explanation: {
      es: "'Entregado → Pagado' no forma parte de las transiciones válidas definidas: un pedido entregado no puede volver al estado Pagado. La cobertura de todas las transiciones exige, además de cubrir todas las transiciones válidas, intentar también las inválidas (idealmente una por caso de prueba, para evitar el enmascaramiento de defectos).",
      en: "'Delivered → Paid' is not among the defined valid transitions: a delivered order cannot revert to the Paid state. All transitions coverage requires, in addition to covering all valid transitions, also attempting invalid ones (ideally one per test case, to avoid defect masking)."
    }
  },
  {
    id: 94, chapter: 3, lo: "FL-4.3.1", k: 2,
    source: "Syllabus v4.0 §4.3.1",
    q: {
      es: "Según el syllabus ISTQB, ¿qué NO garantiza necesariamente una cobertura de sentencia (statement coverage) del 100%?",
      en: "According to the ISTQB syllabus, what does 100% statement coverage NOT necessarily guarantee?"
    },
    options: {
      es: [
        "Que todas las sentencias ejecutables del código han sido ejecutadas al menos una vez",
        "Que se ha practicado toda la lógica de decisión, incluyendo todas las ramas del código",
        "Que puede calcularse como el número de sentencias ejecutadas dividido entre el total de sentencias ejecutables",
        "Que es una técnica de prueba de caja blanca"
      ],
      en: [
        "That all executable statements in the code have been executed at least once",
        "That all decision logic has been exercised, including all branches in the code",
        "That it can be calculated as the number of statements executed divided by the total number of executable statements",
        "That it is a white-box test technique"
      ]
    },
    correct: 1,
    explanation: {
      es: "Una cobertura de sentencia del 100% asegura que cada sentencia ejecutable se ha ejecutado al menos una vez, pero NO asegura que se haya practicado toda la lógica de decisión, ya que puede que no se ejerciten todas las ramas del código (por ejemplo, si un IF sin ELSE tiene todas sus sentencias en la rama verdadera).",
      en: "100% statement coverage ensures every executable statement has been executed at least once, but it does NOT ensure that all decision logic has been exercised, since not all branches of the code may be exercised (for example, if an IF without ELSE has all its statements in the true branch)."
    }
  },
  {
    id: 95, chapter: 3, lo: "FL-4.3.2", k: 2,
    source: "Syllabus v4.0 §4.3.2",
    q: {
      es: "¿Qué relación existe, según el syllabus, entre la cobertura de rama (branch coverage) y la cobertura de sentencia (statement coverage)?",
      en: "According to the syllabus, what relationship exists between branch coverage and statement coverage?"
    },
    options: {
      es: [
        "Son completamente independientes; no existe relación entre ellas",
        "La cobertura de sentencia siempre subsume a la cobertura de rama",
        "La cobertura de rama subsume a la cobertura de sentencia: el 100% de cobertura de rama implica el 100% de cobertura de sentencia, pero no al revés",
        "Ambas miden exactamente lo mismo, solo cambia el nombre"
      ],
      en: [
        "They are completely independent; there is no relationship between them",
        "Statement coverage always subsumes branch coverage",
        "Branch coverage subsumes statement coverage: 100% branch coverage implies 100% statement coverage, but not the other way around",
        "Both measure exactly the same thing, only the name differs"
      ]
    },
    correct: 2,
    explanation: {
      es: "El syllabus indica que la cobertura de rama subsume la cobertura de sentencia: cualquier conjunto de casos de prueba que logre el 100% de cobertura de rama también logra el 100% de cobertura de sentencia, pero un conjunto con 100% de cobertura de sentencia puede no alcanzar el 100% de cobertura de rama.",
      en: "The syllabus states that branch coverage subsumes statement coverage: any test suite achieving 100% branch coverage also achieves 100% statement coverage, but a suite with 100% statement coverage may not achieve 100% branch coverage."
    }
  },
  {
    id: 96, chapter: 3, lo: "FL-4.3.3", k: 2,
    source: "Syllabus v4.0 §4.3.3",
    q: {
      es: "¿Cuál es un punto FUERTE compartido por todas las técnicas de prueba de caja blanca, según el syllabus?",
      en: "According to the syllabus, what is a STRENGTH shared by all white-box test techniques?"
    },
    options: {
      es: [
        "No requieren que el código esté implementado para poder aplicarse",
        "Tienen en cuenta toda la implementación del software, lo que facilita detectar defectos incluso cuando la especificación es vaga, obsoleta o incompleta",
        "Detectan automáticamente los defectos de omisión cuando falta implementar un requisito",
        "Eliminan la necesidad de realizar pruebas de caja negra"
      ],
      en: [
        "They do not require the code to be implemented in order to be applied",
        "They take into account the entire software implementation, which makes it easier to detect defects even when the specification is vague, outdated or incomplete",
        "They automatically detect omission defects when a requirement has not been implemented",
        "They eliminate the need to perform black-box testing"
      ]
    },
    correct: 1,
    explanation: {
      es: "El syllabus señala que un punto fuerte fundamental de las técnicas de caja blanca es que consideran toda la implementación del software, facilitando la detección de defectos aunque la especificación sea vaga o incompleta. Un punto débil correspondiente es que, si el software no implementa uno o más requisitos, la prueba de caja blanca puede NO detectar esos defectos de omisión.",
      en: "The syllabus notes that a fundamental strength of white-box techniques is that they take the entire software implementation into account, making it easier to detect defects even when the specification is vague or incomplete. A corresponding weakness is that if the software fails to implement one or more requirements, white-box testing may NOT detect the resulting omission defects."
    }
  },
  {
    id: 97, chapter: 3, lo: "FL-4.4.1", k: 2,
    source: "Syllabus v4.0 §4.4.1",
    q: {
      es: "Según el syllabus ISTQB, los 'ataques de defecto' (fault attacks) son un enfoque metódico de implementación de:",
      en: "According to the ISTQB syllabus, 'fault attacks' are a methodical approach to implementing:"
    },
    options: {
      es: ["La prueba de tabla de decisión", "La predicción de errores (error guessing)", "La prueba de transición de estado", "El desarrollo guiado por prueba de aceptación (DGPA)"],
      en: ["Decision table testing", "Error guessing", "State transition testing", "Acceptance test-driven development (ATDD)"]
    },
    correct: 1,
    explanation: {
      es: "El syllabus define los ataques de defecto como un enfoque metódico de la implementación de la predicción de errores (error guessing), donde el probador crea o adquiere una lista de posibles errores, defectos y fallos, y diseña pruebas para exponerlos.",
      en: "The syllabus defines fault attacks as a methodical approach to implementing error guessing, where the tester creates or acquires a list of possible errors, defects and failures, and designs tests to expose them."
    }
  },
  {
    id: 98, chapter: 3, lo: "FL-4.4.2", k: 2,
    source: "Syllabus v4.0 §4.4.2",
    q: {
      es: "En un enfoque de prueba exploratoria BASADO EN SESIONES (session-based), ¿qué elemento se utiliza para guiar la sesión de prueba, conteniendo los objetivos de la prueba?",
      en: "In a SESSION-BASED exploratory testing approach, what element is used to guide the test session, containing the test objectives?"
    },
    options: {
      es: ["Un caso de prueba detallado, escrito paso a paso", "Un contrato de prueba (test charter)", "Una tabla de decisión", "Un diagrama de transición de estados"],
      en: ["A detailed, step-by-step written test case", "A test charter", "A decision table", "A state transition diagram"]
    },
    correct: 1,
    explanation: {
      es: "En el enfoque basado en sesiones, el probador utiliza un contrato de prueba (test charter) que contiene los objetivos de prueba para guiar la sesión, dentro de un marco temporal definido, seguida normalmente de una recapitulación (debrief) con los implicados.",
      en: "In the session-based approach, the tester uses a test charter containing the test objectives to guide the session, within a defined time frame, typically followed by a debrief with stakeholders."
    }
  },
  {
    id: 99, chapter: 3, lo: "FL-4.4.2", k: 2,
    source: "Syllabus v4.0 §4.4.2",
    q: {
      es: "¿En cuál de las siguientes situaciones resulta ESPECIALMENTE útil aplicar la prueba exploratoria, según el syllabus?",
      en: "According to the syllabus, in which of the following situations is exploratory testing ESPECIALLY useful?"
    },
    options: {
      es: [
        "Cuando las especificaciones son completas, detalladas y estables",
        "Cuando las especificaciones son escasas o inadecuadas, o existe una presión de tiempo importante para la prueba",
        "Únicamente durante las pruebas de aceptación formales con el cliente",
        "Solo cuando el equipo carece por completo de testers con experiencia"
      ],
      en: [
        "When the specifications are complete, detailed and stable",
        "When the specifications are sparse or inadequate, or there is significant time pressure for testing",
        "Only during formal acceptance testing with the customer",
        "Only when the team completely lacks experienced testers"
      ]
    },
    correct: 1,
    explanation: {
      es: "El syllabus indica que la prueba exploratoria resulta útil cuando las especificaciones son escasas o inadecuadas, o cuando existe una presión de tiempo importante para la prueba; también es útil para complementar otras técnicas más formales.",
      en: "The syllabus states that exploratory testing is useful when specifications are sparse or inadequate, or when there is significant time pressure for testing; it is also useful to complement other more formal techniques."
    }
  },
  {
    id: 100, chapter: 3, lo: "FL-4.4.3", k: 2,
    source: "Syllabus v4.0 §4.4.3",
    q: {
      es: "Según el syllabus, ¿qué tipo de elementos NO deberían incluirse en una lista de comprobación (checklist) usada para la prueba basada en lista de comprobación?",
      en: "According to the syllabus, what type of items should NOT be included in a checklist used for checklist-based testing?"
    },
    options: {
      es: [
        "Elementos formulados como preguntas que pueden comprobarse de forma directa",
        "Elementos que pueden comprobarse automáticamente, que son más adecuados como criterios de entrada/salida, o que son demasiado generales",
        "Elementos relacionados con características de calidad no funcionales, como la usabilidad",
        "Elementos basados en la experiencia del probador sobre por qué falla el software"
      ],
      en: [
        "Items formulated as questions that can be checked directly",
        "Items that can be checked automatically, that are better suited as entry/exit criteria, or that are too general",
        "Items related to non-functional quality characteristics, such as usability",
        "Items based on the tester's experience about why software fails"
      ]
    },
    correct: 1,
    explanation: {
      es: "El syllabus indica que las listas de comprobación no deben contener elementos que puedan comprobarse automáticamente, elementos más adecuados como criterios de entrada/salida, o elementos demasiado generales. Los elementos deben formularse como preguntas verificables directa e individualmente.",
      en: "The syllabus states that checklists should not contain items that can be checked automatically, items better suited as entry/exit criteria, or items that are too general. Items should be formulated as questions that can be checked directly and individually."
    }
  },
  {
    id: 101, chapter: 3, lo: "FL-4.5.1", k: 2,
    source: "Syllabus v4.0 §4.5.1",
    q: {
      es: "Según el modelo de las '3 C' para historias de usuario (Card, Conversation, Confirmation), ¿qué representa la 'Confirmación' (Confirmation)?",
      en: "According to the '3 C's' model for user stories (Card, Conversation, Confirmation), what does 'Confirmation' represent?"
    },
    options: {
      es: [
        "El medio físico o digital que describe la historia de usuario (por ejemplo, una tarjeta o entrada en un tablón)",
        "La conversación, verbal o documentada, que explica cómo se utilizará el software",
        "Los criterios de aceptación de la historia de usuario",
        "La estimación de esfuerzo (story points) asignada a la historia de usuario"
      ],
      en: [
        "The physical or digital medium describing the user story (e.g., a card or an entry on a board)",
        "The conversation, verbal or documented, that explains how the software will be used",
        "The acceptance criteria of the user story",
        "The effort estimate (story points) assigned to the user story"
      ]
    },
    correct: 2,
    explanation: {
      es: "Las '3 C' son Card (Cuartilla, el medio que describe la historia), Conversation (Conversación, cómo se usará el software) y Confirmation (Confirmación, los criterios de aceptación de la historia de usuario).",
      en: "The '3 C's' are Card (the medium describing the story), Conversation (how the software will be used) and Confirmation (the acceptance criteria of the user story)."
    }
  },
  {
    id: 102, chapter: 3, lo: "FL-4.5.2", k: 2,
    source: "Syllabus v4.0 §4.5.2",
    q: {
      es: "¿Cuáles son los DOS formatos más comunes para redactar los criterios de aceptación de una historia de usuario, según el syllabus?",
      en: "According to the syllabus, what are the TWO most common formats for writing the acceptance criteria of a user story?"
    },
    options: {
      es: [
        "Orientado al escenario (Dado/Cuando/Entonces) y orientado a reglas (lista de verificación o tabla entrada-salida)",
        "Diagramas UML de casos de uso y pseudocódigo",
        "Casos de prueba automatizados y casos de prueba manuales",
        "Tablas de decisión y diagramas de transición de estados"
      ],
      en: [
        "Scenario-oriented (Given/When/Then) and rule-oriented (checklist or input-output table)",
        "UML use case diagrams and pseudocode",
        "Automated test cases and manual test cases",
        "Decision tables and state transition diagrams"
      ]
    },
    correct: 0,
    explanation: {
      es: "El syllabus indica que los dos formatos más comunes para los criterios de aceptación son: orientado al escenario (por ejemplo, formato Dado/Cuando/Entonces del desarrollo guiado por el comportamiento) y orientado a reglas (lista de verificación con viñetas, o forma tabulada de mapeo entrada-salida).",
      en: "The syllabus states that the two most common formats for acceptance criteria are: scenario-oriented (e.g., the Given/When/Then format used in behavior-driven development) and rule-oriented (a bulleted checklist, or a tabular input-output mapping)."
    }
  },
  {
    id: 103, chapter: 3, lo: "FL-4.5.3", k: 3,
    source: "Syllabus v4.0 §4.5.3",
    q: {
      es: "Siguiendo el enfoque DGPA (ATDD) para la historia de usuario 'Como cliente registrado, quiero recibir un código de descuento del 10% en mi primera compra, para sentirme incentivado a completar mi pedido', ¿qué tipo de casos de prueba deben crearse PRIMERO, según el orden recomendado por el syllabus?",
      en: "Following the ATDD approach for the user story 'As a registered customer, I want to receive a 10% discount code on my first purchase, so that I feel encouraged to complete my order', which type of test cases should be created FIRST, according to the order recommended by the syllabus?"
    },
    options: {
      es: [
        "Casos de prueba de rendimiento y carga",
        "Casos de prueba positivos que confirman el comportamiento correcto sin excepciones (por ejemplo, el cliente recibe el 10% de descuento en su primera compra)",
        "Casos de prueba negativos (por ejemplo, un cliente no registrado intenta usar el código)",
        "Casos de prueba de usabilidad de la interfaz de checkout"
      ],
      en: [
        "Performance and load test cases",
        "Positive test cases that confirm correct behavior without exceptions (e.g., the customer receives the 10% discount on their first purchase)",
        "Negative test cases (e.g., an unregistered customer tries to use the code)",
        "Usability test cases for the checkout interface"
      ]
    },
    correct: 1,
    explanation: {
      es: "Según el syllabus, normalmente los primeros casos de prueba en DGPA son positivos, confirmando el comportamiento correcto sin excepciones ni condiciones de error. Una vez completados estos, el equipo realiza las pruebas negativas, y por último cubre las características de calidad no funcionales.",
      en: "According to the syllabus, in ATDD the first test cases are typically positive, confirming correct behavior without exceptions or error conditions. Once these are completed, the team performs negative tests, and finally covers non-functional quality characteristics."
    }
  },
  {
    id: 104, chapter: 3, lo: "FL-4.5.3", k: 3,
    source: "Syllabus v4.0 §4.5.3",
    q: {
      es: "Para la misma historia de usuario ('Como cliente registrado, quiero recibir un código de descuento del 10% en mi primera compra'), con el criterio de aceptación 'Dado un cliente registrado sin compras previas, cuando completa su primer pedido, entonces el sistema aplica automáticamente un 10% de descuento', ¿cuál de las siguientes opciones representa un caso de prueba NEGATIVO derivado correctamente mediante DGPA?",
      en: "For the same user story ('As a registered customer, I want to receive a 10% discount code on my first purchase'), with the acceptance criterion 'Given a registered customer with no previous purchases, when they complete their first order, then the system automatically applies a 10% discount', which of the following options represents a NEGATIVE test case correctly derived using ATDD?"
    },
    options: {
      es: [
        "Dado un cliente registrado sin compras previas, cuando completa su primer pedido, entonces recibe el 10% de descuento",
        "Dado un cliente registrado que YA realizó una compra anterior, cuando completa un nuevo pedido, entonces el sistema NO debe aplicar el 10% de descuento de bienvenida",
        "Dado un cliente Premium, cuando solicita soporte técnico, entonces recibe respuesta en menos de 24 horas",
        "Verificar que la página de checkout carga en menos de 2 segundos"
      ],
      en: [
        "Given a registered customer with no previous purchases, when they complete their first order, then they receive the 10% discount",
        "Given a registered customer who has ALREADY made a previous purchase, when they complete a new order, then the system must NOT apply the 10% welcome discount",
        "Given a Premium customer, when they request technical support, then they receive a response within 24 hours",
        "Verify that the checkout page loads in under 2 seconds"
      ]
    },
    correct: 1,
    explanation: {
      es: "Un caso de prueba negativo válido comprueba que el sistema rechaza correctamente una condición fuera del alcance previsto: un cliente que ya compró antes NO debe recibir el descuento de 'primera compra'. La opción (a) es el caso positivo; la opción (c) es una funcionalidad no relacionada (fuera del alcance de esta historia); la opción (d) es una prueba no funcional no vinculada a la regla de negocio de esta historia. El syllabus indica que los casos de prueba deben cubrir las características de la historia sin ir más allá de ella.",
      en: "A valid negative test case checks that the system correctly rejects a condition outside the intended scope: a customer who has already purchased before must NOT receive the 'first purchase' discount. Option (a) is the positive case; option (c) is unrelated functionality (outside this story's scope); option (d) is a non-functional test unrelated to this story's business rule. The syllabus states that test cases must cover the story's features without going beyond it."
    }
  },
  // ===== CHAPTER 5 (Managing Test Activities): 16 new questions, ids 105-120 =====
  {
    id: 105, chapter: 4, lo: "FL-5.2.2", k: 2,
    source: "Syllabus v4.0 §5.2.2",
    q: {
      es: "El riesgo de que un proveedor externo no entregue a tiempo el entorno de pruebas necesario para el proyecto es un ejemplo de:",
      en: "The risk that an external supplier fails to deliver the required test environment on time is an example of:"
    },
    options: {
      es: ["Riesgo de proyecto", "Riesgo de producto", "Riesgo de calidad del producto", "Riesgo técnico del producto"],
      en: ["Project risk", "Product risk", "Product quality risk", "Technical product risk"]
    },
    correct: 0,
    explanation: {
      es: "Los riesgos de proyecto se relacionan con la gestión y el control del proyecto (retrasos, recursos, proveedores, entornos). Los riesgos de producto se relacionan con las características de calidad del producto (fallos del software).",
      en: "Project risks relate to project management and control (delays, resources, suppliers, environments). Product risks relate to the product's quality characteristics (software failures)."
    }
  },
  {
    id: 106, chapter: 4, lo: "FL-5.1.1", k: 2,
    source: "Syllabus v4.0 §5.1.1",
    q: {
      es: "Según el syllabus, ¿cuál de los siguientes elementos forma parte del CONTENIDO habitual de un plan de pruebas?",
      en: "According to the syllabus, which of the following elements is typically part of a test plan's CONTENT?"
    },
    options: {
      es: [
        "Los guiones de prueba detallados paso a paso de cada caso de prueba",
        "El registro de riesgos (por ejemplo, riesgos de producto y de proyecto)",
        "El número final de defectos cerrados al terminar el proyecto",
        "El plan de marketing del producto"
      ],
      en: [
        "The detailed step-by-step test scripts for each test case",
        "The risk register (e.g., product and project risks)",
        "The final number of defects closed when the project ends",
        "The product's marketing plan"
      ]
    },
    correct: 1,
    explanation: {
      es: "El plan de pruebas incluye, entre otros elementos, el contexto de la prueba, implicados, comunicación, el registro de riesgos y el enfoque de prueba. Los guiones de prueba detallados son testware aparte, y el conteo final de defectos pertenece al informe de compleción de la prueba.",
      en: "A test plan includes, among other elements, the test context, stakeholders, communication, the risk register, and the test approach. Detailed test scripts are separate testware, and the final defect count belongs to the test completion report."
    }
  },
  {
    id: 107, chapter: 4, lo: "FL-5.1.2", k: 1,
    source: "Syllabus v4.0 §5.1.2",
    q: {
      es: "En los ciclos de vida iterativos, ¿cuál de las siguientes actividades es propia de la PLANIFICACIÓN DE LA ENTREGA (release planning), y no de la planificación de la iteración?",
      en: "In iterative lifecycles, which of the following activities belongs to RELEASE PLANNING, rather than iteration planning?"
    },
    options: {
      es: [
        "Desglosar las historias de usuario en tareas de prueba concretas",
        "Determinar la capacidad de ser probadas de las historias de usuario de la iteración",
        "Participar en la redacción de historias de usuario y criterios de aceptación comprobables",
        "Perfeccionar los aspectos funcionales y no funcionales del objeto de prueba de la iteración"
      ],
      en: [
        "Breaking down user stories into concrete test tasks",
        "Determining the testability of the iteration's user stories",
        "Participating in writing user stories and testable acceptance criteria",
        "Refining the functional and non-functional aspects of the iteration's test object"
      ]
    },
    correct: 2,
    explanation: {
      es: "La planificación de la entrega incluye la participación del tester en la redacción de historias de usuario y criterios de aceptación comprobables, además de los análisis de riesgo de proyecto y calidad. Las otras opciones son actividades propias de la planificación de la iteración.",
      en: "Release planning includes the tester participating in writing user stories and testable acceptance criteria, along with project and quality risk analysis. The other options are activities typical of iteration planning."
    }
  },
  {
    id: 108, chapter: 4, lo: "FL-5.1.3", k: 2,
    source: "Syllabus v4.0 §5.1.3",
    q: {
      es: "¿Cuál de las siguientes opciones es un ejemplo de CRITERIO DE ENTRADA (y no de criterio de salida)?",
      en: "Which of the following is an example of an ENTRY criterion (and not an exit criterion)?"
    },
    options: {
      es: [
        "La densidad de defectos se encuentra por debajo del umbral acordado",
        "La disponibilidad de la base de prueba y de requisitos comprobables",
        "Se han ejecutado todas las pruebas planificadas",
        "El nivel de cobertura de código alcanzado"
      ],
      en: [
        "Defect density is below the agreed threshold",
        "The availability of the test basis and testable requirements",
        "All planned tests have been executed",
        "The level of code coverage achieved"
      ]
    },
    correct: 1,
    explanation: {
      es: "Los criterios de entrada son precondiciones para emprender una actividad, como la disponibilidad de material de prueba (base de prueba, requisitos comprobables). Las otras tres opciones son medidas de completitud típicas de los criterios de salida.",
      en: "Entry criteria are preconditions for undertaking an activity, such as the availability of test material (test basis, testable requirements). The other three options are completeness measures typical of exit criteria."
    }
  },
  {
    id: 109, chapter: 4, lo: "FL-5.1.4", k: 3,
    source: "Syllabus v4.0 §5.1.4",
    q: {
      es: "Tres expertos estiman el esfuerzo de prueba de una nueva funcionalidad usando la técnica de ESTIMACIÓN DE TRES PUNTOS: estimación optimista (a) = 4 días-persona, estimación más probable (m) = 6 días-persona, estimación pesimista (b) = 14 días-persona. Aplicando la fórmula E = (a + 4m + b) / 6, ¿cuál es la estimación final (E)?",
      en: "Three experts estimate the test effort for a new feature using the THREE-POINT ESTIMATION technique: optimistic estimate (a) = 4 person-days, most likely estimate (m) = 6 person-days, pessimistic estimate (b) = 14 person-days. Applying the formula E = (a + 4m + b) / 6, what is the final estimate (E)?"
    },
    options: {
      es: ["6 días-persona", "7 días-persona", "8 días-persona", "9 días-persona"],
      en: ["6 person-days", "7 person-days", "8 person-days", "9 person-days"]
    },
    correct: 1,
    explanation: {
      es: "E = (a + 4m + b) / 6 = (4 + 4×6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = 7 días-persona. Esta es la técnica de estimación de tres puntos, basada en expertos, descrita en el syllabus.",
      en: "E = (a + 4m + b) / 6 = (4 + 4×6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = 7 person-days. This is the expert-based three-point estimation technique described in the syllabus."
    }
  },
  {
    id: 110, chapter: 4, lo: "FL-5.1.5", k: 3,
    source: "Syllabus v4.0 §5.1.5",
    q: {
      es: "Un equipo debe ordenar la ejecución de tres casos de prueba: TC1 (riesgo alto, sin dependencias), TC2 (riesgo medio, depende de datos que crea TC3), TC3 (riesgo bajo, crea los datos que necesita TC2). Aplicando la priorización basada en riesgo y respetando las dependencias, ¿cuál es el orden de ejecución CORRECTO?",
      en: "A team must order the execution of three test cases: TC1 (high risk, no dependencies), TC2 (medium risk, depends on data created by TC3), TC3 (low risk, creates the data TC2 needs). Applying risk-based prioritization while respecting dependencies, what is the CORRECT execution order?"
    },
    options: {
      es: ["TC1, TC2, TC3", "TC1, TC3, TC2", "TC3, TC1, TC2", "TC3, TC2, TC1"],
      en: ["TC1, TC2, TC3", "TC1, TC3, TC2", "TC3, TC1, TC2", "TC3, TC2, TC1"]
    },
    correct: 1,
    explanation: {
      es: "TC1 tiene el riesgo más alto y ninguna dependencia, por lo que se ejecuta primero. Aunque TC2 tiene mayor riesgo que TC3, TC2 depende de los datos que genera TC3; según el syllabus, si un caso de prioridad más alta depende de uno de prioridad más baja, este último debe ejecutarse antes. Por tanto, el orden correcto es TC1, TC3, TC2.",
      en: "TC1 has the highest risk and no dependencies, so it runs first. Although TC2 has higher risk than TC3, TC2 depends on the data TC3 generates; per the syllabus, if a higher-priority test case depends on a lower-priority one, the lower-priority one must run first. Therefore, the correct order is TC1, TC3, TC2."
    }
  },
  {
    id: 111, chapter: 4, lo: "FL-5.1.6", k: 1,
    source: "Syllabus v4.0 §5.1.6",
    q: {
      es: "Según el modelo de la PIRÁMIDE DE PRUEBA, ¿qué característica tienen las pruebas de la capa SUPERIOR en comparación con las de la capa inferior?",
      en: "According to the TEST PYRAMID model, what characteristic do tests in the TOP layer have compared to those in the bottom layer?"
    },
    options: {
      es: [
        "Son más numerosas, pero de menor granularidad y más rápidas",
        "Son menos numerosas, de mayor granularidad, extremo a extremo y más lentas",
        "Tienen exactamente la misma cantidad y velocidad que las de la capa inferior",
        "Solo pueden ejecutarse de forma manual, nunca automatizada"
      ],
      en: [
        "They are more numerous, but of smaller granularity and faster",
        "They are fewer, of larger granularity, end-to-end, and slower",
        "They have exactly the same number and speed as the bottom layer's tests",
        "They can only be executed manually, never automated"
      ]
    },
    correct: 1,
    explanation: {
      es: "La capa superior de la pirámide de prueba representa pruebas complejas, de alto nivel y de extremo a extremo, que suelen ser más lentas y de las que normalmente se necesitan pocas para lograr una cobertura razonable, a diferencia de las pruebas pequeñas, aisladas y rápidas de la capa inferior.",
      en: "The top layer of the test pyramid represents complex, high-level, end-to-end tests, which tend to be slower and of which normally only a few are needed to achieve reasonable coverage, unlike the small, isolated, fast tests of the bottom layer."
    }
  },
  {
    id: 112, chapter: 4, lo: "FL-5.1.7", k: 2,
    source: "Syllabus v4.0 §5.1.7",
    q: {
      es: "¿Cuál de los CUADRANTES DE PRUEBA (testing quadrants) contiene las pruebas de componente y de integración de componentes, que deberían automatizarse e incluirse en el proceso de integración continua?",
      en: "Which of the TESTING QUADRANTS contains component and component integration tests, which should be automated and included in the continuous integration process?"
    },
    options: {
      es: ["Cuadrante Q1 (orientado a la tecnología, apoya al equipo)", "Cuadrante Q2 (orientado al negocio, apoya al equipo)", "Cuadrante Q3 (orientado al negocio, critica al producto)", "Cuadrante Q4 (orientado a la tecnología, critica al producto)"],
      en: ["Quadrant Q1 (technology-facing, supports the team)", "Quadrant Q2 (business-facing, supports the team)", "Quadrant Q3 (business-facing, critiques the product)", "Quadrant Q4 (technology-facing, critiques the product)"]
    },
    correct: 0,
    explanation: {
      es: "El Cuadrante Q1 (orientado a la tecnología, apoya al equipo) contiene las pruebas de componentes y de integración de componentes, que deben automatizarse e incluirse en el proceso de integración continua (IC).",
      en: "Quadrant Q1 (technology-facing, supports the team) contains component and component integration tests, which should be automated and included in the continuous integration (CI) process."
    }
  },
  {
    id: 113, chapter: 4, lo: "FL-5.2.1", k: 1,
    source: "Syllabus v4.0 §5.2.1",
    q: {
      es: "¿Qué dos factores se combinan para determinar el NIVEL DE RIESGO de un riesgo identificado?",
      en: "Which two factors are combined to determine the RISK LEVEL of an identified risk?"
    },
    options: {
      es: ["La probabilidad del riesgo y el impacto del riesgo", "El costo de la prueba y la duración del proyecto", "La experiencia del equipo y la disponibilidad de herramientas", "La complejidad del código y la densidad de defectos"],
      en: ["Risk probability and risk impact", "Test cost and project duration", "Team experience and tool availability", "Code complexity and defect density"]
    },
    correct: 0,
    explanation: {
      es: "El nivel de riesgo se determina combinando la probabilidad del riesgo (la probabilidad de que ocurra) y el impacto del riesgo (el daño o las consecuencias si ocurre). Cuanto mayor es el nivel de riesgo, más importante es su tratamiento.",
      en: "Risk level is determined by combining risk probability (the likelihood it occurs) and risk impact (the harm or consequences if it occurs). The higher the risk level, the more important its treatment."
    }
  },
  {
    id: 114, chapter: 4, lo: "FL-5.2.3", k: 2,
    source: "Syllabus v4.0 §5.2.3",
    q: {
      es: "¿Para cuál de los siguientes propósitos se utilizan los resultados del ANÁLISIS DEL RIESGO DE PRODUCTO, según el syllabus?",
      en: "According to the syllabus, for which of the following purposes are the results of PRODUCT RISK ANALYSIS used?"
    },
    options: {
      es: [
        "Determinar el alcance de la prueba y priorizar las pruebas para encontrar antes los defectos críticos",
        "Fijar el salario de los miembros del equipo de prueba",
        "Sustituir por completo la necesidad de un plan de pruebas",
        "Eliminar la necesidad de definir criterios de entrada"
      ],
      en: [
        "Determine the scope of testing and prioritize tests to find critical defects earlier",
        "Set the salary of the test team members",
        "Completely replace the need for a test plan",
        "Eliminate the need to define entry criteria"
      ]
    },
    correct: 0,
    explanation: {
      es: "El análisis del riesgo de producto influye en la minuciosidad y el alcance de las pruebas: se usa para determinar el alcance, los niveles y tipos de prueba, las técnicas y la cobertura, estimar el esfuerzo y priorizar las pruebas para encontrar los defectos críticos lo antes posible.",
      en: "Product risk analysis influences the thoroughness and scope of testing: it is used to determine the scope, test levels and types, techniques and coverage, estimate test effort, and prioritize tests to find critical defects as early as possible."
    }
  },
  {
    id: 115, chapter: 4, lo: "FL-5.2.4", k: 2,
    source: "Syllabus v4.0 §5.2.4",
    q: {
      es: "¿Cuál de las siguientes es una medida propuesta por el syllabus para MITIGAR un riesgo de producto mediante la prueba?",
      en: "Which of the following is a measure proposed by the syllabus to MITIGATE a product risk through testing?"
    },
    options: {
      es: [
        "Seleccionar testers con el nivel de experiencia adecuado para el tipo de riesgo y aplicar los niveles de cobertura apropiados",
        "Aumentar el presupuesto del proyecto sin ningún límite",
        "Ignorar todos los riesgos por debajo de nivel medio",
        "Eliminar al equipo de prueba del proyecto"
      ],
      en: [
        "Selecting testers with the appropriate level of experience for the risk type and applying appropriate coverage levels",
        "Increasing the project budget without any limit",
        "Ignoring all risks below medium level",
        "Removing the test team from the project"
      ]
    },
    correct: 0,
    explanation: {
      es: "Entre las medidas para mitigar riesgos de producto mediante la prueba, el syllabus menciona: seleccionar testers con experiencia y competencia adecuadas, aplicar el nivel de independencia adecuado, realizar revisiones y análisis estático, y aplicar las técnicas y niveles de cobertura adecuados.",
      en: "Among the measures to mitigate product risks through testing, the syllabus mentions: selecting testers with appropriate experience and competence, applying the appropriate level of independence, performing reviews and static analysis, and applying appropriate techniques and coverage levels."
    }
  },
  {
    id: 116, chapter: 4, lo: "FL-5.3.1", k: 1,
    source: "Syllabus v4.0 §5.3.1",
    q: {
      es: "La densidad de defectos y el porcentaje de detección de defectos son ejemplos de qué CATEGORÍA de métrica de prueba, según el syllabus?",
      en: "Defect density and defect detection percentage are examples of which CATEGORY of test metric, according to the syllabus?"
    },
    options: {
      es: ["Métricas de defectos", "Métricas de costo", "Métricas de avance del proyecto", "Métricas de cobertura"],
      en: ["Defect metrics", "Cost metrics", "Project progress metrics", "Coverage metrics"]
    },
    correct: 0,
    explanation: {
      es: "El syllabus agrupa la densidad de defectos y el porcentaje de detección de defectos, junto con el número y prioridades de defectos encontrados/corregidos, dentro de las métricas de defectos.",
      en: "The syllabus groups defect density and defect detection percentage, along with the number and priorities of defects found/fixed, under defect metrics."
    }
  },
  {
    id: 117, chapter: 4, lo: "FL-5.3.2", k: 2,
    source: "Syllabus v4.0 §5.3.2",
    q: {
      es: "¿Cuál es la principal diferencia entre un INFORME DEL AVANCE DE LA PRUEBA y un INFORME DE COMPLECIÓN DE LA PRUEBA?",
      en: "What is the main difference between a TEST PROGRESS REPORT and a TEST COMPLETION REPORT?"
    },
    options: {
      es: [
        "Los informes de avance se generan regularmente durante la prueba para apoyar el control continuo; los de compleción resumen una etapa de prueba ya finalizada",
        "Los informes de compleción se generan a diario; los de avance solo una vez, al final del proyecto",
        "Son el mismo documento, solo cambia el nombre según la organización",
        "Los informes de avance son solo para desarrolladores; los de compleción solo para clientes"
      ],
      en: [
        "Progress reports are generated regularly during testing to support ongoing control; completion reports summarize an already-finished test stage",
        "Completion reports are generated daily; progress reports only once, at the end of the project",
        "They are the same document, only the name changes depending on the organization",
        "Progress reports are only for developers; completion reports only for customers"
      ]
    },
    correct: 0,
    explanation: {
      es: "Los informes del avance de la prueba se generan de forma regular (diaria, semanal, etc.) para apoyar el control continuo de la prueba. Los informes de compleción de la prueba se preparan cuando un proyecto, nivel o tipo de prueba está completo, resumiendo esa etapa específica.",
      en: "Test progress reports are generated regularly (daily, weekly, etc.) to support ongoing test control. Test completion reports are prepared when a project, test level, or test type is complete, summarizing that specific stage."
    }
  },
  {
    id: 118, chapter: 4, lo: "FL-5.3.3", k: 2,
    source: "Syllabus v4.0 §5.3.3",
    q: {
      es: "¿Cuál de las siguientes opciones es un ejemplo de cómo COMUNICAR EL ESTADO DE LA PRUEBA, según el syllabus?",
      en: "Which of the following is an example of how to COMMUNICATE TEST STATUS, according to the syllabus?"
    },
    options: {
      es: [
        "Cuadros de mando, como paneles de control de IC/CD, tableros de tareas y gráficos de quemado",
        "Refactorizar el código fuente del sistema",
        "Escribir nuevas pruebas unitarias para el módulo",
        "Realizar un taller de análisis de causa raíz de un defecto"
      ],
      en: [
        "Dashboards, such as CI/CD control panels, task boards, and burndown charts",
        "Refactoring the system's source code",
        "Writing new unit tests for the module",
        "Conducting a defect root-cause-analysis workshop"
      ]
    },
    correct: 0,
    explanation: {
      es: "El syllabus menciona como opciones para comunicar el estado de la prueba: comunicación verbal, cuadros de mando (paneles de IC/CD, tableros de tareas, gráficos de quemado), canales electrónicos, documentación en línea e informes formales de prueba.",
      en: "The syllabus mentions as options for communicating test status: verbal communication, dashboards (CI/CD control panels, task boards, burndown charts), electronic channels, online documentation, and formal test reports."
    }
  },
  {
    id: 119, chapter: 4, lo: "FL-5.4.1", k: 2,
    source: "Syllabus v4.0 §5.4.1",
    q: {
      es: "Cuando un elemento de configuración (por ejemplo, un entorno de prueba) es aprobado para ser probado, se convierte en una LÍNEA BASE. ¿Qué implica esto según la gestión de la configuración?",
      en: "When a configuration item (e.g., a test environment) is approved for testing, it becomes a BASELINE. What does this imply according to configuration management?"
    },
    options: {
      es: [
        "Solo puede modificarse a partir de entonces mediante un proceso formal de control de cambios",
        "Ya no necesita ser identificado ni versionado nunca más",
        "Cualquier miembro del equipo puede modificarlo libremente sin registro",
        "Deja de estar relacionado con otros elementos de configuración"
      ],
      en: [
        "It can only be modified from then on through a formal change control process",
        "It no longer needs to be identified or versioned again",
        "Any team member can freely modify it without any record",
        "It is no longer related to other configuration items"
      ]
    },
    correct: 0,
    explanation: {
      es: "Una vez que un elemento de configuración se aprueba y se convierte en línea base, solo puede modificarse mediante un proceso formal de control de cambios. La gestión de la configuración mantiene un registro de los elementos modificados al crear una nueva línea base.",
      en: "Once a configuration item is approved and becomes a baseline, it can only be modified through a formal change control process. Configuration management keeps a record of modified items when a new baseline is created."
    }
  },
  {
    id: 120, chapter: 4, lo: "FL-5.5.1", k: 3,
    source: "Syllabus v4.0 §5.5.1",
    q: {
      es: "Un tester registra el siguiente informe de defecto: Título: 'El login falla'. Pasos para reproducir: introducir credenciales válidas y pulsar 'Iniciar sesión'. Resultado esperado: el usuario es redirigido al panel principal. Resultado real: se muestra un error 500. ¿Cuál de los siguientes elementos ESENCIALES, según el syllabus, falta en este informe de defecto?",
      en: "A tester logs the following defect report: Title: 'Login fails'. Steps to reproduce: enter valid credentials and click 'Login'. Expected result: the user is redirected to the main dashboard. Actual result: a 500 error is shown. Which of the following ESSENTIAL elements, according to the syllabus, is missing from this defect report?"
    },
    options: {
      es: [
        "La severidad y la prioridad del defecto",
        "El esquema de colores de la pantalla de login",
        "El historial de commits de Git del desarrollador",
        "La campaña de marketing relacionada con el login"
      ],
      en: [
        "The severity and priority of the defect",
        "The color scheme of the login screen",
        "The developer's Git commit history",
        "The marketing campaign related to the login"
      ]
    },
    correct: 0,
    explanation: {
      es: "Un informe de defecto típico debe incluir, entre otros elementos, la severidad (grado de impacto) y la prioridad de corrección, además del identificador único, la descripción del fallo y los resultados esperado/real. El informe del escenario carece de severidad y prioridad, información esencial para gestionar la resolución del defecto.",
      en: "A typical defect report must include, among other elements, the severity (degree of impact) and the fix priority, in addition to the unique identifier, failure description, and expected/actual results. The scenario's report lacks severity and priority, information essential for managing the defect's resolution."
    }
  }
];

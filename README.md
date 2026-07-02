# MyCampus ISTQB — Foundation Level v4.0

Plataforma de estudio web para preparar la certificación **ISTQB Certified Tester Foundation Level (CTFL) v4.0**. Incluye lecciones, glosario, flashcards, simulacros de examen, sistema de gamificación y progreso sincronizado en la nube.

## Características

- **Lecciones interactivas** — Currículo ISTQB FL v4.0 completo (22 lecciones, 6 capítulos), auditado línea a línea contra el syllabus oficial
- **Glosario** — 107 términos bilingües (ES/EN), con cobertura del 100% de los 97 *keywords* oficiales del syllabus v4.0
- **Flashcards** — Tarjetas de repaso con lectura en voz alta (Web Speech API)
- **Simulacros de examen** — Banco de 120 preguntas tipo test distribuidas por peso oficial de examen, con feedback inmediato
- **Gamificación** — Sistema de XP, niveles (Aprendiz → ISTQB Ready) y logros
- **Autenticación** — Login con email/contraseña o Google (vía Supabase)
- **Sincronización en la nube** — Progreso guardado por usuario en Supabase, con fallback silencioso a `localStorage` si no hay conexión
- **Multilingüe** — Interfaz y contenido en español e inglés

## Tecnologías

- HTML / CSS / JavaScript (vanilla, sin framework ni build step)
- [Supabase](https://supabase.com) — autenticación y base de datos
- Google Fonts (Inter, JetBrains Mono)

## Puesta en marcha

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Edita `js/config.js` con tus credenciales:

```js
const SUPABASE_URL  = 'TU_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';
```

3. Abre `index.html` en un navegador, o sirve el directorio estáticamente:

```bash
python -m http.server 8000
# abre http://localhost:8000
```

No hay `npm install` ni paso de compilación.

## Fidelidad de contenido ISTQB

El banco de preguntas, las lecciones y el glosario se han auditado y ampliado contra el **ISTQB CTFL Syllabus v4.0** oficial, en tres fases ya completadas. Cada pregunta, hecho de lección o término de glosario cita su fuente oficial (syllabus o exámenes de muestra). Detalle completo, correcciones encontradas y trazabilidad: [`docs/content-audit-report.md`](docs/content-audit-report.md).

Dos scripts Node (solo desarrollo, no se sirven al navegador) actúan como gate de calidad — ejecútalos tras cualquier cambio de contenido:

```bash
node scripts/validate-questions.js   # banco de preguntas (js/questions.js)
node scripts/validate-content.js     # lecciones y glosario (js/content.js)
```

## Materiales de referencia

La carpeta `ISTQB 2026/` contiene documentación oficial (syllabus, exámenes de muestra, libro de referencia) usada como fuente de verdad para el contenido de la app. No forma parte del código de la aplicación.

## Para desarrolladores

Guía de arquitectura, convenciones y estado del proyecto para trabajar con IA/Claude Code: [`CLAUDE.md`](CLAUDE.md) / [`AGENTS.md`](AGENTS.md).

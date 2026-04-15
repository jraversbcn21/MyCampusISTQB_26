# MyCampus ISTQB — Foundation Level v4.0

Plataforma de estudio web para preparar la certificación **ISTQB Certified Tester Foundation Level (CTFL) v4.0**. Incluye lecciones, simulacros de examen, sistema de gamificación y progreso sincronizado en la nube.

## Características

- **Lecciones interactivas** — Todo el currículo ISTQB FL v4.0 organizado por capítulos
- **Simulacros de examen** — Preguntas tipo test con feedback inmediato
- **Gamificación** — Sistema de XP, niveles (Aprendiz → ISTQB Ready) y logros
- **Autenticación** — Login con email/contraseña o Google (via Supabase)
- **Sincronización en la nube** — Progreso guardado por usuario en Supabase
- **Multilingüe** — Interfaz en español e inglés

## Tecnologías

- HTML / CSS / JavaScript (vanilla, sin framework)
- [Supabase](https://supabase.com) — autenticación y base de datos
- Google Fonts (Inter, JetBrains Mono)

## Configuración

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Edita `js/config.js` con tus credenciales:

```js
const SUPABASE_URL  = 'TU_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';
```

3. Abre `index.html` en un navegador o despliega en cualquier servidor estático.

## Materiales de estudio

La carpeta `ISTQB 2026/` contiene documentación oficial de referencia (syllabus, exámenes de muestra, etc.).

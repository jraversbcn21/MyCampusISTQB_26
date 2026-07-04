# Plan de ejecución: monitoreo de errores + protección anti-abuso en el signup

**Estado: PENDIENTE DE EJECUTAR** (este documento es el plan, nada de lo descrito aquí
está implementado todavía). Escrito el 2026-07-04 para ejecutarse en una sesión futura.

## Contexto

Son los dos pendientes del veredicto de preparación para producción del 2026-07-04
(ver `docs/audit-2026-07-04-architecture-security.md`, adéndum, y la conversación que
produjo `privacy.html`):

- **Parte A:** no hay observabilidad — si algo falla para un usuario real, nadie se
  entera salvo que escriba un email. Solución elegida: Sentry free tier.
- **Parte B:** el signup por email solo depende de las protecciones nativas de Supabase
  Auth. Hay que **revisar primero** si bastan, y solo añadir captcha si el hueco es real
  (así se decidió: revisar → gate → implementar solo si aplica).

El tercer pendiente de aquella lista (política de privacidad) ya está hecho:
`privacy.html`, commits `26090cc..a72ece4`.

## Reglas transversales (leer ANTES de ejecutar cualquier paso)

1. **Privacidad en el mismo commit.** `AGENTS.md` §Project Overview exige que si cambian
   los terceros que reciben datos, `privacy.html` se actualiza EN EL MISMO COMMIT
   (secciones 2/4/5 + fecha de "última actualización", en ES **y** EN). Sentry y
   Cloudflare Turnstile son terceros nuevos que reciben la IP del usuario, así que las
   dos partes de este plan tienen su paso de política **obligatorio**, no opcional.
   Atención: la política dice hoy "no usamos herramientas de analítica" — Sentry es
   monitoreo de errores, no analítica, pero hay que nombrarlo explícitamente para que
   esa frase siga siendo honesta.
2. **SRI en todo script de CDN.** Pinnear a versión exacta + hash sha384 siguiendo el
   procedimiento ya documentado en `AGENTS.md` §Supabase Backend (bajar el fichero
   exacto, no la URL `@x.y.z` a secas; calcular sha384; contrastar el hash contra un
   segundo CDN antes de fiarse). Excepción documentada: el script de Turnstile es
   dinámico y no admite SRI — se acepta y se anota como riesgo conocido en `AGENTS.md`.
3. **Verificación con arnés.** Cada fase termina con `node scripts/verify-runtime.js`
   en verde + prueba manual en navegador. Todo fix/feature de comportamiento añade su
   chequeo al arnés (patrón establecido en la segunda pasada del 2026-07-04). El hook
   de `.githooks/` ya ejecuta el arnés al commitear `js/` o `index.html`.

**Paso 0 (común):** al empezar la sesión, comprobar si los commits de la política de
privacidad (`26090cc`, `c221dc4`, `a72ece4`) siguen sin push. Si es así, decidir el push
con el usuario antes de apilar más trabajo encima.

---

## Parte A — Monitoreo de errores (Sentry free tier)

### Prerrequisito manual del usuario (BLOQUEANTE, ~10 min)

Crear cuenta gratuita en [sentry.io](https://sentry.io) → nuevo proyecto de tipo
**"Browser JavaScript"** → copiar el **DSN**. El DSN es público por diseño (misma clase
de secreto que el anon key de Supabase), así que puede ir en `js/config.js` sin problema.
Sin DSN no se puede empezar la Parte A.

### Pasos

- **A1. Pinnear el SDK.** `@sentry/browser` como bundle UMD desde CDN, en el `<head>` de
  `index.html` **antes** de supabase-js (tiene que cargar primero para capturar errores
  de todos los scripts posteriores). Versión exacta + SRI (Regla 2). Solo errores: SIN
  tracing, SIN session replay — bundle más pequeño y coherente con la política de
  privacidad minimalista.

- **A2. Módulo `js/monitoring.js`.** Nuevo módulo singleton siguiendo el patrón del repo
  (objeto plano, `init()`, helpers con `_`), cargado justo después de `js/config.js` en
  el orden de scripts. Debe contener:
  - Guard de degradación (mismo patrón que `auth.js` con el CDN): si `window.Sentry` no
    existe (CDN bloqueado/offline) o `typeof SENTRY_DSN === 'undefined'`, no-op
    silencioso. **La app JAMÁS debe depender del monitoreo para funcionar.**
  - `Sentry.init({ dsn: SENTRY_DSN, sendDefaultPii: false, sampleRate: 1.0, beforeSend })`
    donde `beforeSend` hace scrubbing de PII: eliminar `user.email` y cualquier string
    con forma de email dentro del mensaje/contexto. Identificar al usuario SOLO por su
    UUID de Supabase (pseudónimo). Nunca email ni nombre.
  - Actualizar `AGENTS.md` §Script Load Order con el nuevo orden
    (`sentry-cdn → config → monitoring → i18n → …`) y la tabla de módulos en
    `AGENTS.md` y `CLAUDE.md`.

- **A3. Política de privacidad (MISMO commit que A1/A2 — Regla 1).** Añadir Sentry
  (Functional Software, Inc.) a la sección 4 como encargado que recibe IP, user-agent y
  contexto técnico del error; aclarar en la sección 2 que NO se le envía email ni nombre
  (por el scrubbing de A2); actualizar la fecha. En ES y EN.

- **A4. Chequeos nuevos en `scripts/verify-runtime.js`:**
  - con `window.Sentry` ausente, la carga completa de la app no lanza y `App` inicializa;
  - `beforeSend` elimina un email sembrado en un evento de prueba.

- **A5. Verificación end-to-end.** Servir la app (`python -m http.server 8000`); lanzar
  un error de prueba desde la consola (`setTimeout(() => { throw new Error('sentry-test') }, 0)`);
  confirmar que aparece en el dashboard de Sentry **sin email** en el evento. Repetir con
  el CDN de Sentry bloqueado (devtools → Network → block request URL) y confirmar que la
  app funciona con normalidad.

- **A6. Criterio de hecho:** error visible en el dashboard, cero PII en el evento, arnés
  en verde, `AGENTS.md`/`CLAUDE.md`/`privacy.html` actualizados en el mismo commit.

---

## Parte B — Rate-limiting / captcha en el signup

Dos fases con un **gate de decisión explícito** en medio: primero revisar lo que Supabase
ya trae, y solo implementar captcha si el tipo de lanzamiento lo justifica.

### Fase B1 — Auditoría del dashboard de Supabase (solo lectura, ~20-30 min)

Requiere que el usuario tenga el dashboard abierto (o que dé acceso). Checklist de qué
mirar y **anotar en este mismo documento** al ejecutar:

- **Authentication → Rate Limits:** anotar los umbrales vigentes por endpoint (emails
  por hora, peticiones de token, verificaciones, SMS/MFA). Rellenar aquí:

  | Endpoint | Límite vigente | ¿Suficiente para el lanzamiento previsto? |
  |---|---|---|
  | *(rellenar al ejecutar)* | | |

- **Authentication → Emails / SMTP — PUNTO CRÍTICO:** los proyectos Supabase con el SMTP
  integrado tienen el envío de emails severamente restringido (límite bajísimo por hora
  y, en proyectos recientes, **solo a miembros del equipo del proyecto**). Comprobar:
  - ¿Está activo "Confirm email" en el signup?
  - ¿Hay SMTP custom configurado?
  - Si "Confirm email" está activo **sin** SMTP propio, los usuarios reales NO recibirán
    el email de confirmación → **bloqueante de producción independiente del captcha**.
    Opciones: SMTP custom gratuito (Resend, Brevo free tier) o desactivar la confirmación
    de email asumiendo el trade-off (cuentas sin verificar). Decidir con el usuario.
- **Authentication → Attack protection:** comprobar qué ofrece el plan free (protección
  de contraseñas filtradas, captcha nativo) y si "Enable Captcha protection" está
  disponible/activo (a fecha de este plan: no está activo).

### Gate de decisión (criterio, no intuición)

- **Lanzamiento soft** (link compartido a mano, sin anuncio público): los límites nativos
  anotados en B1 + el SMTP resuelto **bastan**. Documentar los valores en `AGENTS.md`
  (sección Supabase Backend) y **PARAR aquí**. No añadir captcha que friccione a usuarios
  legítimos sin necesidad real.
- **Lanzamiento anunciado/público** (redes, comunidades ISTQB, tráfico no controlado):
  continuar con B2.

### Fase B2 — Cloudflare Turnstile vía integración nativa de Supabase (SOLO si el gate lo pide)

**Prerrequisito manual del usuario (BLOQUEANTE):** cuenta Cloudflare gratuita →
Turnstile → crear **site key** + **secret key** en modo "Managed". Se elige Turnstile
sobre hCaptcha/reCAPTCHA por coherencia con `privacy.html` (sin cookies de tracking).

- **B2.1. Orden de despliegue — AVISO IMPORTANTE:** al habilitar el captcha en el
  servidor (Supabase dashboard → Auth → Attack protection → Enable Captcha con la secret
  key), **TODOS los endpoints de auth lo exigen** (login, signup, reset). Si el cliente
  no tiene el widget desplegado aún, **nadie puede autenticarse**. Orden correcto:
  desplegar el cliente con el widget primero → activar en el dashboard → probar
  inmediatamente.
- **B2.2. Cliente (`js/auth.js` + `index.html`):**
  - script de Turnstile en `index.html` (sin SRI posible — excepción a la Regla 2,
    anotarla en `AGENTS.md`);
  - widget en el form de auth con render explícito y `theme` acorde al tema activo de la
    app;
  - pasar `captchaToken` en `options` de `signInWithPassword`, `signUp` y
    `resetPasswordForEmail` — soporte nativo de supabase-js v2;
  - **resetear el widget tras cada intento fallido** (los tokens de Turnstile son de un
    solo uso);
  - degradación: si el script de Turnstile no carga, mensaje claro reutilizando el patrón
    `Auth._showLoadFailure()`. Trade-off honesto a documentar: con el captcha activado en
    servidor, sin widget no hay login posible — el mensaje debe decirlo;
  - claves i18n nuevas para los errores del captcha, ES/EN pareadas (el arnés exige
    paridad y fallará el commit si falta una).
- **B2.3. Política de privacidad (MISMO commit — Regla 1):** añadir Cloudflare como
  tercero (recibe la IP al servir el widget); actualizar fecha. ES y EN.
- **B2.4. Chequeos de arnés:** los 3 flujos de auth incluyen `captchaToken` cuando el
  widget está presente; con `window.turnstile` ausente, mensaje de fallo sin excepción.
- **B2.5. Verificación end-to-end:** signup real de prueba con captcha; intento con token
  inválido → error claro y widget reseteado; login normal OK; **Google OAuth no debe
  verse afectado** (Google gestiona su propio anti-abuso en su pantalla) — verificar que
  sigue funcionando con el captcha activo.

---

## Orden recomendado y estimación

1. **Parte A completa** primero: es autónoma, de bajo riesgo y da visibilidad inmediata
   (≈ 1 sesión corta, más los 10 min de prerrequisito del usuario).
2. **B1** (≈ 30 min con el dashboard delante) → **gate** → **B2 solo si aplica**
   (≈ 1 sesión).

Commits al final de cada parte; push solo cuando el usuario lo pida (pauta de este repo).
El hook de `.githooks/` ejecutará el arnés automáticamente en cada commit que toque
`js/` o `index.html`.

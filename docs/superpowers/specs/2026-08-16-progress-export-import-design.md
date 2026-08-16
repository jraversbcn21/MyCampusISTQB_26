# Export/import manual de progreso a fichero (2026-08-16)

**Estado:** aprobado por el dueño (conversación 2026-08-16).
**Origen:** follow-up diferido explícitamente en
`2026-07-22-cloud-progress-loss-on-reauth-fix-design.md` ("El export/import manual queda como
follow-up aparte").
**Objetivo:** que el usuario pueda guardar su progreso en un fichero propio y restaurarlo,
como red de seguridad independiente de localStorage y de Supabase.

## Decisiones de alcance (aprobadas)

- **Ubicación UI:** sección "Copia de seguridad" al final de la vista **Progreso**. Sin vista
  nueva, sin tocar el sidebar.
- **Semántica de import: reemplazo total** del estado actual, previa confirmación explícita.
  Sin fusión inteligente ni elección por import (descartados por complejidad/verificabilidad).
- **Enfoque técnico:** APIs nativas del navegador. Export con `Blob` +
  `URL.createObjectURL` + `<a download>`; import con `<input type="file" accept=".json">`
  oculto + `FileReader`. Cero dependencias nuevas, funciona offline.

## Formato del fichero

`mycampus-backup-YYYY-MM-DD.json` (fecha del día del export):

```json
{
  "app": "mycampus-istqb",
  "version": 1,
  "exportedAt": "<ISO 8601>",
  "state": { ...App.state completo... }
}
```

El envoltorio con marcador `app` permite rechazar JSONs ajenos en el import y versionar el
formato si algún día cambia. `version: 1` es el único valor válido hoy; un `version` distinto
se rechaza con el mismo error genérico (no hay migración de formatos que hacer todavía).

## Componentes

### UI (index.html + css/styles.css + i18n)

- Sección al final de `#view-progress`: título, una frase explicativa, botón
  **Exportar progreso** y botón **Importar progreso**, más el `<input type="file">` oculto
  (inline `style="display:none"`, convención del repo).
- Claves i18n nuevas `bk_*` (título, descripción, botones, toasts de éxito/error,
  texto de confirmación), pareadas ES/EN — el gate de paridad las cubre automáticamente.
- Iconos del sprite `#i-*` existente si aplica (o sin icono); nada de emojis (gate N17).
- Botones con tokens existentes y AA (mismo criterio `--primary-dark` si llevan texto blanco).
- Targets táctiles ≥44px (barrido de `validate-responsive.js`, que ya cubre la vista
  Progreso).

### `App.exportProgress()` (js/app.js)

1. Construye el envoltorio con `JSON.stringify` de `App.state`.
2. `Blob` tipo `application/json`, `URL.createObjectURL`, `<a download>` sintético, click,
   `URL.revokeObjectURL`.
3. Toast `success` (`bk_export_ok`).
4. Guard `typeof` para el arnés (sin `URL.createObjectURL` en el mock → no-op limpio,
   patrón `window.scrollTo` de `advanceLesson`).

### `App.importProgress(file)` (js/app.js)

1. `FileReader.readAsText`; en `onload`, `JSON.parse` dentro de `try/catch`.
2. **Validación estructural mínima:** `obj.app === 'mycampus-istqb'`, `obj.version === 1`,
   `obj.state` es objeto, `typeof obj.state.xp === 'number'`,
   `Array.isArray(obj.state.completedLessons)`. Cualquier fallo → toast `error`
   (`bk_import_invalid`), **estado intacto**, return.
3. **Confirmación explícita** (`confirm()` nativo con texto i18n `bk_import_confirm`:
   "Esto reemplazará tu progreso actual"). Cancelar → estado intacto, sin toast.
4. Reemplazo: `App.state = obj.state`, `saveState()`, re-render (`updateSidebar` + re-navegar
   a la vista actual para repintar Progreso), toast `success` (`bk_import_ok`).
5. El `<input type="file">` se resetea (`value = ''`) para permitir re-importar el mismo
   fichero.

## Interacción con la maquinaria de sync (lo crítico)

- Tras el reemplazo se llama a **`saveState()` normal**, que estampa
  `_updatedAt = Date.now()` → el estado importado es el más fresco y **gana en todos los
  mecanismos existentes**: push con debounce, conflict resolution multi-dispositivo
  ("más reciente gana") y `_shouldApplyCloud`.
- **No se toca `js/sync.js` ni el gate `_reconciled`.** Un import es una acción de usuario
  en ventana — exactamente el caso que la maquinaria del 2026-07-22 ya contempla. Si el
  import ocurre antes de terminar la reconciliación inicial, el gate retiene el push y el
  `.finally` lo suelta, como cualquier otra acción temprana.
- Los **guards de migración en el punto de uso** ya existentes (`_rankingEnsureState`,
  el guard de `_maybeCelebrate`) cubren backups viejos sin campos nuevos — no se añade
  ninguna migración en el import (misma lección que `loadState`: los defaults no se
  fusionan ahí).
- Si el backup trae `rankingOptIn: true`, el siguiente push re-upserta la fila vía
  `_pushRanking` — coherente con la semántica de resurrección documentada del ranking.
- **Ventana de reconciliación de login (fix del review final, 2026-08-16):** un import puede
  llegar antes de que termine la reconciliación de un login recién arrancado
  (`hadLocalBase===false`). En ese caso `Sync.loadState`/el `.then` de `_onAuthSuccess` podían
  aplicar la copia de la nube por encima del import recién hecho. `_applyBackup` marca
  `Auth._importedInWindow = true` justo tras `saveState()`; `Auth._shouldApplyCloud` lo
  comprueba como primera condición y devuelve `false` si está marcada, ganando siempre sobre
  la nube — no es una regla nueva de frescura, es una excepción explícita a `_shouldApplyCloud`.

## Seguridad

- Ningún dato del fichero se interpola en `innerHTML` durante el import (no se muestra ni el
  nombre del fichero). Los campos del estado que llegan a `innerHTML` en renders posteriores
  (nombre, activityLog, examHistory, ranking) pasan por `escapeHtml()` en esos renders.
  **Corrección del review final:** esto NO era cierto para los campos numéricos `streak`,
  `examsCompleted` y `xp`, interpolados crudos en `progressStatsBig` y en el toast de racha —
  se asumían "seguros por ser números", pero un backup importado los trae como cualquier otro
  valor de JSON, incluido un string con markup. Se cerraron como parte de este fix (mismos
  tres sitios, envueltos en `escapeHtml()`); el gate N29 lo verifica con un backup malicioso
  que trae `streak` como `<img onerror=…>`.
- `JSON.parse` sobre contenido arbitrario es seguro (no ejecuta); los límites de tamaño los
  impone el propio `JSON.parse`/memoria del navegador — sin límite artificial propio.

## Errores

| Caso | Resultado |
|---|---|
| Fichero ilegible / JSON inválido | toast `error` `bk_import_invalid`, estado intacto |
| Marcador `app`/`version` incorrecto | ídem |
| `state` sin forma mínima (xp/completedLessons) | ídem |
| Confirmación cancelada | estado intacto, sin toast |
| Export sin `URL.createObjectURL` (arnés) | no-op limpio |

## Gates

- **Familia N29 en `scripts/verify-runtime.js`:**
  - export produce el envoltorio `{app, version: 1, exportedAt, state}` con el estado actual;
  - import válido reemplaza el estado y dispara `saveState` (estampa fresca);
  - import con marcador ajeno, JSON roto o `state` malformado **no toca el estado**;
  - confirmación cancelada no toca el estado;
  - un backup con `display_name`/nombre malicioso (`<img onerror=…>`) acaba escapado en los
    renders (reutilizando el patrón del check XSS de N27);
  - claves `bk_*` definidas y pareadas (además de la paridad global);
  - checks estáticos anclados a regla/markup real (lección N19/N21: `/\.selector \{/`, nunca
    `includes()`).
- `validate-responsive.js`: la vista Progreso ya está en el barrido; verificar que la sección
  nueva no introduce overflow y los botones dan ≥44px.
- CSS nuevo en sección propia **antes** de la cadena final del tail
  (`pointer: coarse` → `.bmc-fab` → reduced-motion → `:focus-visible` intacta); overrides
  móviles, si hacen falta, en el tier 480 **con prefijo de id** (cuarta aparición del
  cascade trap — mismo criterio que `#view-ranking`).

## Fuera de alcance (deliberado)

- Fusión de estados en el import.
- Backups automáticos/periódicos o en la nube.
- Migración entre versiones de formato (solo existe la 1).
- Cambios en `privacy.html`: el fichero lo genera y custodia el propio usuario en su máquina;
  no hay tratamiento nuevo de datos por terceros.

## Cierre

Deploy a Vercel al terminar (afecta a usuarios), tras gates en verde y árbol commiteado.

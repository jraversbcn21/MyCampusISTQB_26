# Export/Import de Progreso Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Botones "Exportar/Importar progreso" en la vista Progreso que guardan/restauran `App.state` como fichero JSON local, con reemplazo total confirmado y sello de frescura para que el import gane en la sincronización.

**Architecture:** Todo nativo del navegador (Blob + URL.createObjectURL para exportar; `<input type=file>` + FileReader para importar). La lógica testeable vive en dos helpers puros de `App` (`_buildBackup`, `_applyBackup`); los wrappers con APIs de navegador (`exportProgress`, `importProgress`) llevan guards `typeof` para el arnés. No se toca `js/sync.js`: el `saveState()` tras el import estampa `_updatedAt` fresco y la maquinaria existente hace el resto.

**Tech Stack:** Vanilla JS (sin build, sin deps), arnés `scripts/verify-runtime.js` (familia nueva N29).

**Spec:** `docs/superpowers/specs/2026-08-16-progress-export-import-design.md`

## Global Constraints

- Repo sin npm ni build: solo APIs de navegador y Node puro en scripts.
- Toda cadena visible pasa por i18n (`data-i18n` en HTML, `i18n.t()` en JS), pareada ES/EN. Sin em-dashes en las cadenas.
- Formato del backup: `{ app: 'mycampus-istqb', version: 1, exportedAt: <ISO>, state: {...} }`. Fichero `mycampus-backup-YYYY-MM-DD.json`.
- Import = reemplazo total, previa `confirm()`; cualquier fallo de validación deja el estado intacto.
- CSS nuevo en sección propia ANTES de la cadena final del tail (`@media (pointer: coarse)` → `.bmc-fab` → reduced-motion → `:focus-visible`). Nada después de `:focus-visible`.
- Botones: `<button>` reales (teclado gratis), fondo `var(--primary-dark)` + `color:#fff` (5.83:1 AA; NUNCA `--primary`, falla AA), min-height 44px.
- Sin emojis como iconos (gate N17). Sin `innerHTML` con datos del fichero sin escapar.
- Checks estáticos anclados a regla/markup real (`/\.selector \{/`), nunca `includes()` a secas (lección N19/N21).
- Commits directos a `master`; el hook pre-commit corre los gates sobre lo staged.

---

### Task 1: Claves i18n `bk_*`

**Files:**
- Modify: `js/i18n.js` (objeto `TRANSLATIONS.es` termina ~línea 287; `TRANSLATIONS.en` empieza ~línea 288 y termina al final del objeto)
- Test: `scripts/verify-runtime.js` (familia N29, nueva, insertada después de la familia N28 y antes del bloque de resumen final)

**Interfaces:**
- Produces: claves `bk_title`, `bk_desc`, `bk_export`, `bk_import`, `bk_export_ok`, `bk_import_ok`, `bk_import_invalid`, `bk_import_confirm` en ES y EN — Tasks 2-4 las consumen vía `data-i18n` / `i18n.t()`.

- [ ] **Step 1: Escribir el check que falla**

En `scripts/verify-runtime.js`, localizar el cierre de la familia N28 (buscar `N28`) e insertar después, como nueva sección:

```js
  /* ---- N29: export/import de progreso (2026-08-16) ---- */
  {
    const { TRANSLATIONS } = loadApp();
    const bkKeys = ['bk_title', 'bk_desc', 'bk_export', 'bk_import',
      'bk_export_ok', 'bk_import_ok', 'bk_import_invalid', 'bk_import_confirm'];
    check('N29 i18n: claves bk_* definidas en ES y EN',
      bkKeys.every(k => typeof TRANSLATIONS.es[k] === 'string' && typeof TRANSLATIONS.en[k] === 'string'));
  }
```

- [ ] **Step 2: Verificar que falla**

Run: `node scripts/verify-runtime.js`
Expected: `❌ N29 i18n: claves bk_* definidas en ES y EN` (y solo ese fallo).

- [ ] **Step 3: Añadir las claves**

Al final del objeto `es:` de `TRANSLATIONS` (antes de su `},` de cierre), añadir:

```js
    // Backup export/import (2026-08-16)
    bk_title: "Copia de seguridad",
    bk_desc: "Guarda tu progreso en un fichero o restauralo en cualquier dispositivo.",
    bk_export: "Exportar progreso",
    bk_import: "Importar progreso",
    bk_export_ok: "Copia exportada",
    bk_import_ok: "Progreso restaurado",
    bk_import_invalid: "El fichero no es una copia de seguridad valida de MyCampus",
    bk_import_confirm: "Esto reemplazara tu progreso actual por el del fichero. ¿Continuar?",
```

Al final del objeto `en:`:

```js
    // Backup export/import (2026-08-16)
    bk_title: "Backup",
    bk_desc: "Save your progress to a file or restore it on any device.",
    bk_export: "Export progress",
    bk_import: "Import progress",
    bk_export_ok: "Backup exported",
    bk_import_ok: "Progress restored",
    bk_import_invalid: "The file is not a valid MyCampus backup",
    bk_import_confirm: "This will replace your current progress with the file's. Continue?",
```

- [ ] **Step 4: Verificar que pasa**

Run: `node scripts/verify-runtime.js`
Expected: todo ✅ (la paridad global ES/EN también cubre las claves nuevas).

- [ ] **Step 5: Commit**

```bash
git add js/i18n.js scripts/verify-runtime.js
git commit -m "feat(i18n): claves bk_* del backup de progreso (N29)"
```

### Task 2: Markup y CSS de la sección "Copia de seguridad"

**Files:**
- Modify: `index.html` (dentro de `#view-progress`, la `.progress-grid` cierra en ~línea 596)
- Modify: `css/styles.css` (nueva sección ANTES del comentario del bloque `@media (pointer: coarse)`, ~línea 2766)
- Test: `scripts/verify-runtime.js` (checks estáticos N29)

**Interfaces:**
- Produces: `#backupExportBtn`, `#backupImportBtn`, `#backupImportInput` (input file oculto). Los onclick llaman a `App.exportProgress()` / `App.importProgress(this.files[0])`, implementados en Tasks 3-4 (hasta entonces los botones existen pero sus métodos no; los checks estáticos no los ejecutan).

- [ ] **Step 1: Escribir los checks que fallan**

Añadir al bloque N29 de `scripts/verify-runtime.js`:

```js
  {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    check('N29 markup: card de backup dentro de #view-progress con los 3 controles',
      /id="backupExportBtn"[^>]*data-i18n="bk_export"/.test(html) &&
      /id="backupImportBtn"[^>]*data-i18n="bk_import"/.test(html) &&
      /<input type="file" id="backupImportInput" accept="\.json[^"]*" style="display:none"/.test(html));
    check('N29 css: regla real .backup-actions antes del bloque pointer:coarse',
      /\.backup-actions \{/.test(cssSrc) &&
      cssSrc.search(/\.backup-actions \{/) < cssSrc.indexOf('@media (pointer: coarse)'));
    check('N29 css: .btn-backup usa --primary-dark (AA), nunca --primary a secas',
      /\.btn-backup \{[^}]*var\(--primary-dark\)/.test(cssSrc) &&
      !/\.btn-backup \{[^}]*var\(--primary\)[;\s]/.test(cssSrc));
  }
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: los 3 checks nuevos en ❌.

- [ ] **Step 3: Añadir el markup**

En `index.html`, dentro de `.progress-grid` de `#view-progress`, después de la card de "Actividad reciente" (`</div>` que cierra la card de `activityLog`, ~línea 595) y antes del `</div>` que cierra `.progress-grid`:

```html
          <div class="card backup-card">
            <h3 data-i18n="bk_title">Copia de seguridad</h3>
            <p class="backup-desc" data-i18n="bk_desc">Guarda tu progreso en un fichero o restauralo en cualquier dispositivo.</p>
            <div class="backup-actions">
              <button type="button" class="btn-backup" id="backupExportBtn" onclick="App.exportProgress()" data-i18n="bk_export">Exportar progreso</button>
              <button type="button" class="btn-backup" id="backupImportBtn" onclick="document.getElementById('backupImportInput').click()" data-i18n="bk_import">Importar progreso</button>
              <input type="file" id="backupImportInput" accept=".json,application/json" style="display:none" onchange="App.importProgress(this.files[0])">
            </div>
          </div>
```

(Convenciones del repo: onclick inline con llamadas globales; oculto con `style="display:none"` inline; `<button>` real, sin icono.)

- [ ] **Step 4: Añadir el CSS**

En `css/styles.css`, justo ANTES del comentario que precede a `@media (pointer: coarse)` (~línea 2766), insertar sección nueva:

```css
/* ===== BACKUP EXPORT/IMPORT (2026-08-16) ===== */
.backup-desc {
  color: var(--text2);
  margin: 8px 0 16px;
}
.backup-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn-backup {
  background: var(--primary-dark); /* --primary falla AA con texto blanco (4.32:1) */
  color: #fff;
  border: none;
  border-radius: 8px;
  min-height: 44px;
  padding: 10px 18px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-backup:hover {
  filter: brightness(1.1);
}
```

(Si `--text2` no existe en `:root`, usar el token de texto secundario que usen las otras cards de la vista — comprobar con `grep -n "text2\|text-secondary" css/styles.css` y reutilizar el existente.)

- [ ] **Step 5: Verificar que pasan todos los gates**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: todo ✅ (contrast no parsea `.btn-backup` — el AA lo fija el check N29 — pero debe seguir en verde).

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css scripts/verify-runtime.js
git commit -m "feat(ui): seccion Copia de seguridad en la vista Progreso (N29)"
```

### Task 3: `App._buildBackup()` y `App.exportProgress()`

**Files:**
- Modify: `js/app.js` (nueva sección al final del objeto `App`, antes del cierre; comentario de sección `/* ===== BACKUP EXPORT/IMPORT (2026-08-16) ===== */`)
- Test: `scripts/verify-runtime.js`

**Interfaces:**
- Consumes: `App.state`, `App.showToast(msg, type)`, `i18n.t(key)`.
- Produces: `App._buildBackup()` → `{app: 'mycampus-istqb', version: 1, exportedAt: string, state: object}` (Task 4 valida este mismo formato); `App.exportProgress()` → descarga el fichero (navegador) o no-op limpio (arnés).

- [ ] **Step 1: Escribir los checks que fallan**

Añadir al bloque N29:

```js
  {
    const { App } = loadApp();
    App.state.xp = 123;
    const bk = App._buildBackup();
    check('N29 export: _buildBackup produce el envoltorio {app, version:1, exportedAt, state}',
      bk.app === 'mycampus-istqb' && bk.version === 1 &&
      typeof bk.exportedAt === 'string' && bk.state === App.state && bk.state.xp === 123);
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N29 export: exportProgress con guard de Blob/URL y nombre mycampus-backup-',
      /exportProgress\(\)/.test(appSrc) &&
      /typeof Blob === 'undefined'/.test(appSrc) &&
      /mycampus-backup-/.test(appSrc) &&
      /revokeObjectURL/.test(appSrc));
  }
```

(`exportProgress` no se ejecuta en el arnés — Node tiene `Blob`/`URL` pero el `<a>` mockeado no soporta `click()` de descarga; el comportamiento de navegador lo verifica el paso manual del Task 5. Aquí se testea el helper puro + estáticos del wrapper.)

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: los 2 checks nuevos en ❌ (los métodos no existen).

- [ ] **Step 3: Implementar**

En `js/app.js`, al final del objeto `App` (tras el último método existente, manteniendo la coma):

```js
  /* ===== BACKUP EXPORT/IMPORT (2026-08-16) ===== */

  _buildBackup() {
    return {
      app: 'mycampus-istqb',
      version: 1,
      exportedAt: new Date().toISOString(),
      state: this.state,
    };
  },

  exportProgress() {
    // Guard para el arnés y navegadores sin soporte: sin APIs de descarga, no-op limpio.
    if (typeof Blob === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) return;
    const json = JSON.stringify(this._buildBackup(), null, 2);
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a');
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    a.href = url;
    a.download = `mycampus-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast(i18n.t('bk_export_ok'), 'success');
  },
```

- [ ] **Step 4: Verificar que pasa**

Run: `node scripts/verify-runtime.js`
Expected: todo ✅.

- [ ] **Step 5: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(app): exportProgress y _buildBackup (N29)"
```

### Task 4: `App._applyBackup()` y `App.importProgress()` + confirm inyectable en el arnés

**Files:**
- Modify: `js/app.js` (misma sección BACKUP de Task 3)
- Modify: `scripts/verify-runtime.js` — `loadApp()` (~línea 152-154): el parámetro `confirm` pasa de hardcodeado a inyectable
- Test: `scripts/verify-runtime.js`

**Interfaces:**
- Consumes: formato de Task 3 (`app === 'mycampus-istqb'`, `version === 1`); `App.saveState()`, `App.updateSidebar()`, `App.navigate(view)`, `App.showToast`, `i18n.t`, `confirm` global; ids de Task 2 (`backupImportInput`).
- Produces: `App._applyBackup(text) → boolean` (true = estado reemplazado); `App.importProgress(file)` (wrapper FileReader).

- [ ] **Step 1: Hacer inyectable el confirm del arnés**

En `loadApp()` de `scripts/verify-runtime.js`, la línea que invoca la Function (~154):

```js
  const globals = fn(win, doc, ls, { replaceState() {} }, fetchMock, opts.confirm || (() => true), nav);
```

(Antes pasaba `() => true` literal; con `opts.confirm` un check puede simular "Cancelar". Sin opts, comportamiento idéntico — ningún check existente cambia.)

- [ ] **Step 2: Escribir los checks que fallan**

Añadir al bloque N29:

```js
  {
    const mkBackup = (over) => JSON.stringify(Object.assign({
      app: 'mycampus-istqb', version: 1, exportedAt: 'x',
      state: { xp: 500, completedLessons: ['1-1'], activityLog: [], examHistory: [] },
    }, over));

    const ctx1 = loadApp();
    ctx1.App.state.xp = 1;
    check('N29 import: backup valido reemplaza el estado y estampa frescura via saveState',
      ctx1.App._applyBackup(mkBackup()) === true &&
      ctx1.App.state.xp === 500 &&
      typeof JSON.parse(ctx1.localStorage.getItem('mycampus_state') || '{}')._updatedAt === 'number');

    const ctx2 = loadApp();
    ctx2.App.state.xp = 1;
    const badOnes = [
      'no-es-json{{{',
      mkBackup({ app: 'otra-app' }),
      mkBackup({ version: 2 }),
      mkBackup({ state: null }),
      mkBackup({ state: { xp: 'no-numero', completedLessons: [] } }),
      mkBackup({ state: { xp: 5, completedLessons: 'no-array' } }),
    ];
    check('N29 import: JSON roto / marcador ajeno / version 2 / state malformado no tocan el estado',
      badOnes.every(t => ctx2.App._applyBackup(t) === false) && ctx2.App.state.xp === 1);

    const ctx3 = loadApp({ confirm: () => false });
    ctx3.App.state.xp = 1;
    check('N29 import: confirmacion cancelada deja el estado intacto',
      ctx3.App._applyBackup(mkBackup()) === false && ctx3.App.state.xp === 1);

    const ctx4 = loadApp();
    const evil = mkBackup({ state: { xp: 5, completedLessons: [],
      activityLog: [{ text: '<img src=x onerror="window.__pwn=1">', xp: 0, time: 't' }], examHistory: [] } });
    ctx4.App._applyBackup(evil);
    ctx4.App.renderProgress();
    const actHtml = ctx4.document.getElementById('activityLog').innerHTML;
    check('N29 xss: activityLog de un backup malicioso llega escapado al innerHTML',
      actHtml.includes('&lt;img') && !actHtml.includes('<img src=x'));
  }
```

(Nota: si la clave de localStorage del estado no es `mycampus_state`, comprobar el nombre real con `grep -n "localStorage.setItem" js/app.js` y usar ese; el resto del check no cambia.)

- [ ] **Step 3: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: los 4 checks nuevos en ❌ (`_applyBackup` no existe); todos los checks previos siguen ✅ (el confirm inyectable no rompe nada).

- [ ] **Step 4: Implementar**

En `js/app.js`, sección BACKUP, tras `exportProgress`:

```js
  _applyBackup(text) {
    let obj;
    try { obj = JSON.parse(text); } catch (e) {
      this.showToast(i18n.t('bk_import_invalid'), 'error');
      return false;
    }
    const st = obj && obj.state;
    const valid = obj && obj.app === 'mycampus-istqb' && obj.version === 1 &&
      st && typeof st === 'object' &&
      typeof st.xp === 'number' && Array.isArray(st.completedLessons);
    if (!valid) {
      this.showToast(i18n.t('bk_import_invalid'), 'error');
      return false;
    }
    if (!confirm(i18n.t('bk_import_confirm'))) return false;
    this.state = st;
    // saveState estampa _updatedAt fresco: el import gana en toda la maquinaria de sync
    // (debounce, conflict resolution, _shouldApplyCloud). No tocar sync.js.
    this.saveState();
    this.updateSidebar();
    this.navigate(this.currentView || 'progress');
    this.showToast(i18n.t('bk_import_ok'), 'success');
    return true;
  },

  importProgress(file) {
    if (!file || typeof FileReader === 'undefined') return;
    const reader = new FileReader();
    reader.onload = () => {
      this._applyBackup(String(reader.result));
      const input = document.getElementById('backupImportInput');
      if (input) input.value = ''; // permite re-importar el mismo fichero
    };
    reader.readAsText(file);
  },
```

- [ ] **Step 5: Verificar que pasa todo**

Run: `node scripts/verify-runtime.js`
Expected: todo ✅, incluidas TODAS las familias previas (N1-N28).

- [ ] **Step 6: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(app): importProgress con reemplazo confirmado y validacion (N29)"
```

### Task 5: Verificación final, responsive y deploy

**Files:**
- Ninguno nuevo (solo ejecución y, si `validate-responsive.js` falla, ajuste del CSS del Task 2)

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: feature en producción verificada.

- [ ] **Step 1: Gates completos**

Run:
```bash
node scripts/validate-questions.js && node scripts/validate-content.js && node scripts/verify-runtime.js && node scripts/validate-contrast.js
```
Expected: todo en verde.

- [ ] **Step 2: Responsive real**

Run: `node scripts/validate-responsive.js`
Expected: PASS (la vista Progreso ya está en el barrido; la card nueva no debe introducir overflow horizontal y los botones deben medir ≥44px). Si falla por la card nueva, ajustar `.backup-actions`/`.btn-backup` (flex-wrap ya previsto) y repetir.

- [ ] **Step 3: Prueba manual en navegador**

Run: `python -m http.server 8000` y abrir `http://localhost:8000`.
Verificar a mano: (1) exportar descarga `mycampus-backup-<hoy>.json` con el envoltorio correcto; (2) importar ese mismo fichero pide confirmación y restaura; (3) un `.json` ajeno (p. ej. `{"a":1}`) da el toast de error sin tocar el progreso; (4) cambiar de idioma y comprobar los 4 textos en EN.
(Ojo: login local puede rebotar a producción — la URL de localhost no está en el allowlist de Supabase, limitación documentada; si bloquea, verificar los flujos de fichero en producción tras el deploy.)

- [ ] **Step 4: Push y CI**

```bash
git push
```
Verificar que la Action `gates` queda en verde (`https://github.com/jraversbcn21/MyCampusISTQB_26/actions`).

- [ ] **Step 5: Deploy y verificación de producción**

```powershell
$env:NODE_EXTRA_CA_CERTS="$env:USERPROFILE\.certs\corporate-ca.pem"; vercel deploy --prod --yes
```
Después: `bash scripts/verify-prod.sh` → PRODUCCION OK. Prueba manual del export/import en `https://mycampusistqb.vercel.app`.

- [ ] **Step 6: Sincronizar CLAUDE.md**

Añadir a CLAUDE.md una sección breve del backup (ubicación, formato con marcador, reemplazo-total + sello de frescura, guard de migración en punto de uso NO añadido porque los existentes cubren, gate N29) y commit `docs:` + push.

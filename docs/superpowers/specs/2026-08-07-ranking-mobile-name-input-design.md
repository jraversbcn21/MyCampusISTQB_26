# Campo de nombre legible en `.ranking-controls` en móvil — diseño

**Fecha:** 2026-08-07
**Estado:** aprobado (conversación con Jorge, opción A elegida sobre la alternativa de iniciales)

## Problema

Reportado por Jorge en dispositivo real (~390px, captura `Nombre.png`): con el opt-in del
ranking activo, el panel `.ranking-controls` muestra el campo del nombre aplastado a ~60px —
de "Jorge Indi" solo se ve "Joi".

**Causa raíz (diagnóstico, no síntoma):** `.ranking-controls` (css/styles.css, sección base
RANKING ~2479) es una fila flex con `flex-wrap: wrap` donde `#rkNameInput` lleva
`flex: 1; min-width: 0` y comparte línea con dos botones anchos (`.rk-rename-btn`
"Guardar nombre" y `.rk-leave-btn` "Salir del ranking"). En un viewport móvil los botones
consumen el ancho y el input, gracias al `min-width: 0`, se **encoge en vez de saltar de
línea** — el wrap nunca se dispara porque el input puede comprimirse hasta casi cero.

## Alternativa descartada — iniciales

Se consideró mostrar iniciales ("JI" para "Jorge Indi", "JO" para "Jorge"). Descartada
porque el elemento afectado no es un display de solo lectura: es el **input editable** del
rename. Iniciales ahí impedirían ver y editar el nombre real sin añadir un modo edición
aparte (más JS, más estados). Las iniciales como avatar decorativo en las filas de la tabla
quedan anotadas como posible mejora futura, separada de este fix.

## Solución (CSS puro, tier ≤480px)

Dentro del bloque de ranking ya existente en `@media (max-width: 480px)` (~línea 1536),
con el prefijo `#view-ranking` obligatorio (trampa de cascada documentada tres veces en
CLAUDE.md: el tier va ANTES que la sección base en el archivo, sin el id la regla base
posterior ganaría por orden de fuente):

```css
#view-ranking .ranking-controls #rkNameInput { flex-basis: 100%; }
#view-ranking .ranking-controls .rk-rename-btn,
#view-ranking .ranking-controls .rk-leave-btn { flex: 1; }
```

- El input pasa a ocupar su propia fila a ancho completo de la tarjeta → el nombre se ve
  entero y sigue editable en el sitio.
- Los dos botones caen a la segunda fila y se reparten el ancho a partes iguales; si en
  algún idioma no cupieran juntos, el `flex-wrap` existente ya los apila.

## Qué NO se toca

- `.ranking-optin` — ya es `flex-direction: column; align-items: stretch`; su input ya va
  a ancho completo.
- Desktop (>480px) — idéntico al actual.
- JS y markup — sin cambios.

## Verificación

- **Gate:** check estático nuevo en la familia **N27** de `scripts/verify-runtime.js`,
  anclado a regla real (`/#view-ranking \.ranking-controls #rkNameInput \{/` +
  `flex-basis: 100%` en su cuerpo), nunca `includes()` — lección N19/N21.
- **Visual:** captura Playwright a 390px con el panel de controles renderizado (estado
  opt-in) como evidencia del cierre. `validate-responsive.js` no puede cubrirlo en su
  barrido actual (sin Supabase la vista renderiza el mensaje `rk_offline`, no el panel),
  por eso el gate automático es el estático de N27.
- Gates de CSS existentes (`validate-contrast.js`) no se ven afectados — no hay colores
  nuevos.

## Riesgos

Ninguno relevante: override aditivo en el tier, mismo patrón que los dos que ya existen en
ese bloque (`padding` del panel y de las celdas).

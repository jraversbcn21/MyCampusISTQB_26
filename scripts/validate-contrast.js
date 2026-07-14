/* Validador de contraste WCAG — arnés de desarrollo (no se sirve al navegador).
   Parsea los tokens de :root y [data-theme="light"] en css/styles.css y
   comprueba que cada par texto/fondo real (incluyendo fondos rgba() mezclados
   sobre la superficie) cumple AA 4.5:1 en AMBOS temas. Igual que los otros
   validadores: acepta una ruta opcional (copia staged) y sale con 1 si falla. */
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'css', 'styles.css');
const css = fs.readFileSync(SRC, 'utf8');

function block(re) {
  const m = css.match(re);
  if (!m) { console.error('No se encontró el bloque de tokens esperado'); process.exit(1); }
  const vars = {};
  for (const [, name, val] of m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[name.trim()] = val.trim();
  return vars;
}
const dark = block(/:root\s*\{([^}]+)\}/);
const light = { ...dark, ...block(/\[data-theme="light"\]\s*\{([^}]+)\}/) };

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(fg, bg) {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
function blendOver(fg, alpha, bg) {
  return fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));
}

// Cada par: [etiqueta, token de texto, fondo]. El fondo es un token o
// {tint: token-base, alpha, over: token-superficie} para fondos rgba().
const PAIRS = [
  ['badge/verdict/history success', 'success-text', { tint: 'success', alpha: 0.2, over: 'surface' }],
  ['dc-option correct (tinte .1)', 'success-text', { tint: 'success', alpha: 0.1, over: 'surface' }],
  ['success sobre superficie', 'success-text', 'surface'],
  ['badge/rating/streak warning', 'warning-text', { tint: 'warning', alpha: 0.2, over: 'surface' }],
  ['exam-timer warning (tinte .1)', 'warning-text', { tint: 'warning', alpha: 0.1, over: 'surface' }],
  ['warning sobre superficie', 'warning-text', 'surface'],
  ['badge/rating danger', 'danger-text', { tint: 'danger', alpha: 0.2, over: 'surface' }],
  ['dc-option wrong / timer danger (tinte .1)', 'danger-text', { tint: 'danger', alpha: 0.1, over: 'surface' }],
  ['danger sobre superficie', 'danger-text', 'surface'],
  ['badge-primary (+20 XP)', 'primary-text', { tint: 'primary', alpha: 0.2, over: 'surface' }],
  ['glossary-term / primary sobre superficie', 'primary-text', 'surface'],
  ['text3 sobre superficie', 'text3', 'surface'],
  ['text3 sobre bg4 (peor caso)', 'text3', 'bg4'],
  ['text2 sobre superficie (guardia)', 'text2', 'surface'],
];

let errors = [];
for (const [themeName, vars] of [['oscuro', dark], ['claro', light]]) {
  for (const [label, fgTok, bgSpec] of PAIRS) {
    if (!vars[fgTok]) { errors.push(`[${themeName}] falta el token --${fgTok}`); continue; }
    const fg = hexToRgb(vars[fgTok]);
    const bg = typeof bgSpec === 'string'
      ? hexToRgb(vars[bgSpec])
      : blendOver(hexToRgb(vars[bgSpec.tint]), bgSpec.alpha, hexToRgb(vars[bgSpec.over]));
    const r = ratio(fg, bg);
    const ok = r >= 4.5;
    console.log(`  [${themeName}] ${label}: ${r.toFixed(2)}:1 ${ok ? '✅' : '❌'}`);
    if (!ok) errors.push(`[${themeName}] ${label}: ${r.toFixed(2)}:1 < 4.5:1`);
  }
}
if (errors.length) { console.error(`\n❌ ${errors.length} pares fallan AA:`); errors.forEach(e => console.error('  - ' + e)); process.exit(1); }
console.log('\n✅ Todos los pares de contraste cumplen AA en ambos temas.');

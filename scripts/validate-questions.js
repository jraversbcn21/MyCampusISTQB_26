/* Validador de banco de preguntas — arnés de desarrollo (no se sirve al navegador). */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'js', 'questions.js');
const src = fs.readFileSync(SRC, 'utf8');

// questions.js define `const QUESTIONS = [...]` como global de navegador.
// Lo evaluamos y devolvemos el array.
let QUESTIONS;
try {
  QUESTIONS = eval(src + '\n; QUESTIONS');
} catch (e) {
  console.error('❌ questions.js no parsea:', e.message);
  process.exit(1);
}

const TARGET = { 0: 24, 1: 18, 2: 12, 3: 36, 4: 24, 5: 6 };
let errors = [];

// Conteo por capítulo
const counts = {};
for (const q of QUESTIONS) counts[q.chapter] = (counts[q.chapter] || 0) + 1;
console.log('Conteo por capítulo:');
for (const ch of Object.keys(TARGET)) {
  const have = counts[ch] || 0;
  const want = TARGET[ch];
  const ok = have === want;
  console.log(`  Cap ${ch}: ${have}/${want} ${ok ? '✅' : '❌'}`);
  if (!ok) errors.push(`Cap ${ch}: ${have} preguntas, se esperaban ${want}`);
}

// Integridad estructural (TODAS las preguntas)
const seenIds = new Set();
for (const q of QUESTIONS) {
  const tag = `id ${q.id}`;
  if (seenIds.has(q.id)) errors.push(`${tag}: id duplicado`);
  seenIds.add(q.id);
  for (const lang of ['es', 'en']) {
    if (!q.q || !q.q[lang]) errors.push(`${tag}: falta q.${lang}`);
    if (!q.options || !Array.isArray(q.options[lang]) || q.options[lang].length !== 4)
      errors.push(`${tag}: options.${lang} debe tener 4 opciones`);
    if (!q.explanation || !q.explanation[lang]) errors.push(`${tag}: falta explanation.${lang}`);
  }
  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3)
    errors.push(`${tag}: correct fuera de rango`);
}

// Trazabilidad (solo preguntas nuevas: id > 50)
for (const q of QUESTIONS) {
  if (q.id <= 50) continue;
  const tag = `id ${q.id}`;
  if (!/^FL-\d+\.\d+\.\d+$/.test(q.lo || '')) errors.push(`${tag}: lo inválido o ausente (${q.lo})`);
  if (![1, 2, 3].includes(q.k)) errors.push(`${tag}: k debe ser 1, 2 o 3 (${q.k})`);
  if (!q.source || !q.source.trim()) errors.push(`${tag}: source vacío`);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} problema(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('\n✅ Todas las validaciones pasan.');

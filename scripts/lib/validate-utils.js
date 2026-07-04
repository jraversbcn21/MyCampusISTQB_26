/* Utilidades compartidas por validate-questions.js y validate-content.js.
   Ambos scripts siguen siendo validadores independientes (formas de datos
   distintas) — esto solo consolida el arnés común: cargar globals de
   navegador desde Node, el regex de learning objectives, el chequeo
   bilingüe simple repetido, y el reporte final. */
const fs = require('fs');
const path = require('path');

const FL_RE = /^FL-\d+\.\d+\.\d+$/;

// Carga un archivo JS de navegador (que define `const X = ...` como globals)
// y devuelve un objeto con los nombres pedidos. Usa `new Function` en vez de
// `eval` para no heredar el scope de quien llama.
function loadGlobals(filePath, names) {
  const src = fs.readFileSync(filePath, 'utf8');
  try {
    return new Function(`${src}\n; return {${names.join(', ')}};`)();
  } catch (e) {
    console.error(`❌ ${path.basename(filePath)} no parsea:`, e.message);
    process.exit(1);
  }
}

// Comprueba que obj[field].es y obj[field].en existan y no sean strings
// vacíos/en blanco. Cubre el patrón repetido en term/def (glosario) y
// q/a (flashcards) y q/explanation (preguntas) — no cubre options
// (array de 4) ni content+pie de fuente (lecciones), que son chequeos
// distintos y solo aparecen una vez cada uno.
function checkBilingualText(obj, field, tag, errors) {
  for (const lang of ['es', 'en']) {
    const val = obj && obj[field] && obj[field][lang];
    if (!val || !String(val).trim()) errors.push(`${tag}: falta ${field}.${lang}`);
  }
}

function report(errors) {
  if (errors.length) {
    console.error(`\n❌ ${errors.length} problema(s):`);
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }
  console.log('\n✅ Todas las validaciones pasan.');
}

module.exports = { FL_RE, loadGlobals, checkBilingualText, report };

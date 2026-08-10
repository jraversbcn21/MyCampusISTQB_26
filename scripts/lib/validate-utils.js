/* Utilidades compartidas por validate-questions.js y validate-content.js.
   Ambos scripts siguen siendo validadores independientes (formas de datos
   distintas) — esto solo consolida el arnés común: cargar globals de
   navegador desde Node, el regex de learning objectives, el chequeo
   bilingüe simple repetido, y el reporte final. */
const fs = require('fs');
const path = require('path');

const FL_RE = /^FL-\d+\.\d+\.\d+$/;

// Secciones reales del syllabus CTFL v4.0.1: subsecciones x.y.z por cada sección
// x.y, según el TOC y la lista de objetivos de aprendizaje del PDF oficial
// (verificado contra el PDF el 2026-08-10). Toda cita §... en un `source` debe
// apuntar a una de estas. Motivo del gate: la deriva del capítulo 2 (los sources
// citaban §2.3/§2.4 siguiendo la numeración interna de la app, no la del
// syllabus) pasó los validadores durante semanas porque solo se comprobaba que
// `source` no estuviera vacío.
const SYLLABUS_SUBSECTIONS = {
  '1.1': 2, '1.2': 3, '1.3': 1, '1.4': 5, '1.5': 3,
  '2.1': 6, '2.2': 3, '2.3': 1,
  '3.1': 3, '3.2': 5,
  '4.1': 1, '4.2': 4, '4.3': 3, '4.4': 3, '4.5': 3,
  '5.1': 7, '5.2': 4, '5.3': 3, '5.4': 1, '5.5': 1,
  '6.1': 1, '6.2': 1
};
const SYLLABUS_SECTIONS = new Set(['1', '2', '3', '4', '5', '6']);
for (const [sec, n] of Object.entries(SYLLABUS_SUBSECTIONS)) {
  SYLLABUS_SECTIONS.add(sec);
  for (let i = 1; i <= n; i++) SYLLABUS_SECTIONS.add(`${sec}.${i}`);
}

// Valida cada referencia §x[.y[.z]] dentro de un string `source` (o pie de
// fuente de lección). Solo actúa si el string contiene '§' — las citas al libro
// de referencia (Severity/Priority en el glosario) no llevan § y quedan fuera a
// propósito. No exige que el capítulo citado coincida con el del ítem: existen
// citas cruzadas legítimas (el glosario cita smoke tests en §5.1.3, la única
// mención del syllabus).
function checkSyllabusRefs(source, tag, errors) {
  if (!source || !source.includes('§')) return;
  for (const m of source.matchAll(/§(\d[\d.]*)/g)) {
    const sec = m[1].replace(/\.+$/, '');
    if (!SYLLABUS_SECTIONS.has(sec)) {
      errors.push(`${tag}: la cita §${sec} no existe en el syllabus v4.0.1`);
    }
  }
}

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

module.exports = { FL_RE, SYLLABUS_SECTIONS, checkSyllabusRefs, loadGlobals, checkBilingualText, report };

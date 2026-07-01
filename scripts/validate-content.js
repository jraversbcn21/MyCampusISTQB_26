/* Validador de auditoría de contenido — arnés de desarrollo (no se sirve al navegador). */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'js', 'content.js');
const src = fs.readFileSync(SRC, 'utf8');

let CHAPTERS, LESSONS;
try {
  const result = new Function(src + '\n; return {CHAPTERS, LESSONS};')();
  CHAPTERS = result.CHAPTERS;
  LESSONS = result.LESSONS;
} catch (e) {
  console.error('❌ content.js no parsea:', e.message);
  process.exit(1);
}

const TARGET_TOPIC_COUNT = { 0: 5, 1: 4, 2: 2, 3: 5, 4: 5, 5: 1 };
let errors = [];

console.log('Conteo de temas por capítulo:');
CHAPTERS.forEach((ch, i) => {
  const have = ch.topics.length;
  const want = TARGET_TOPIC_COUNT[i];
  const ok = have === want;
  console.log(`  Cap ${i}: ${have}/${want} ${ok ? '✅' : '❌'}`);
  if (!ok) errors.push(`Cap ${i}: ${have} temas, se esperaban ${want}`);
});

// Trazabilidad y pie de fuente por tema
CHAPTERS.forEach((ch, chIdx) => {
  ch.topics.forEach(topic => {
    const tag = `topic ${topic.id}`;
    if (!Array.isArray(topic.lo) || topic.lo.length === 0) {
      errors.push(`${tag}: falta lo (array de códigos FL-x.y.z)`);
    } else {
      topic.lo.forEach(code => {
        if (!/^FL-\d+\.\d+\.\d+$/.test(code)) errors.push(`${tag}: código lo inválido "${code}"`);
      });
    }
    if (!topic.source || !topic.source.trim()) errors.push(`${tag}: source vacío`);

    const lesson = LESSONS[topic.id];
    if (!lesson) {
      errors.push(`${tag}: sin entrada en LESSONS`);
      return;
    }
    for (const lang of ['es', 'en']) {
      if (!lesson[lang] || !lesson[lang].content) {
        errors.push(`${tag}: falta LESSONS.${topic.id}.${lang}.content`);
        continue;
      }
      if (!lesson[lang].content.includes('class="lesson-source"')) {
        errors.push(`${tag}: falta pie de fuente (.lesson-source) en LESSONS.${topic.id}.${lang}.content`);
      }
    }
  });
});

if (errors.length) {
  console.error(`\n❌ ${errors.length} problema(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('\n✅ Todas las validaciones pasan.');

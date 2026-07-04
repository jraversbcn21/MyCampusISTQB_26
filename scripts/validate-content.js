/* Validador de auditoría de contenido — arnés de desarrollo (no se sirve al navegador). */
const path = require('path');
const { FL_RE, loadGlobals, checkBilingualText, report } = require('./lib/validate-utils');

const SRC = path.join(__dirname, '..', 'js', 'content.js');
const { CHAPTERS, LESSONS, GLOSSARY, FLASHCARDS } = loadGlobals(SRC, ['CHAPTERS', 'LESSONS', 'GLOSSARY', 'FLASHCARDS']);

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
        if (!FL_RE.test(code)) errors.push(`${tag}: código lo inválido "${code}"`);
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

/* ===== GLOSSARY ===== */
// Lista canónica: keywords oficiales por capítulo, syllabus v4.0 (secciones "Keywords").
// Duplicados entre capítulos asignados al primer capítulo donde aparecen.
const KEYWORDS = {
  '1': ['coverage','debugging','defect','error','failure','quality','quality assurance','root cause',
        'test analysis','test basis','test case','test completion','test condition','test control',
        'test data','test design','test execution','test implementation','test monitoring','test object',
        'test objective','test planning','test procedure','test process','test result','testing',
        'testware','traceability','validation','verification'],
  '2': ['acceptance testing','black-box testing','component integration testing','component testing',
        'confirmation testing','functional testing','integration testing','maintenance testing',
        'non-functional testing','regression testing','shift left','system integration testing',
        'system testing','test level','test type','white-box testing'],
  '3': ['anomaly','dynamic testing','formal review','informal review','inspection','review',
        'static analysis','static testing','technical review','walkthrough'],
  '4': ['acceptance criteria','acceptance test-driven development','black-box test technique',
        'boundary value analysis','branch coverage','checklist-based testing',
        'collaboration-based test approach','coverage item','decision table testing',
        'equivalence partitioning','error guessing','experience-based test technique',
        'exploratory testing','state transition testing','statement coverage','test technique',
        'white-box test technique'],
  '5': ['defect management','defect report','entry criteria','exit criteria','product risk',
        'project risk','risk','risk analysis','risk assessment','risk control','risk identification',
        'risk level','risk management','risk mitigation','risk monitoring','risk-based testing',
        'test approach','test completion report','test plan','test progress report','test pyramid',
        'test strategy','testing quadrants'],
  '6': ['test automation']
};

const norm = s => s.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
const segsOf = term => [term.es, term.en].map(s => norm(s || '')).filter(Boolean);

const seenTerms = new Set();
GLOSSARY.forEach((g, i) => {
  const label = g.term ? `${g.term.es || '?'} / ${g.term.en || '?'}` : '(sin term)';
  const tag = `glossary[${i}] "${label.slice(0, 45)}"`;
  checkBilingualText(g, 'term', tag, errors);
  checkBilingualText(g, 'def', tag, errors);
  if (!['1','2','3','4','5','6'].includes(g.chapter)) errors.push(`${tag}: chapter inválido "${g.chapter}"`);
  if (!g.source || !g.source.trim()) errors.push(`${tag}: source vacío`);
  const key = g.term ? `${(g.term.es || '').toLowerCase().trim()}|${(g.term.en || '').toLowerCase().trim()}` : '';
  if (seenTerms.has(key)) errors.push(`${tag}: término duplicado`);
  seenTerms.add(key);
});

const allSegs = new Set();
GLOSSARY.forEach(g => { if (g.term) segsOf(g.term).forEach(s => allSegs.add(s)); });
let totalKw = 0, missingKw = [];
for (const [ch, list] of Object.entries(KEYWORDS)) {
  for (const kw of list) {
    totalKw++;
    if (!allSegs.has(norm(kw))) missingKw.push(`keyword faltante (cap.${ch}): "${kw}"`);
  }
}
console.log(`\nKeywords oficiales cubiertos: ${totalKw - missingKw.length}/${totalKw}`);
missingKw.forEach(m => errors.push(m));

/* ===== FLASHCARDS (estructural) ===== */
const fcIds = new Set();
FLASHCARDS.forEach(f => {
  const tag = `flashcard id ${f.id}`;
  if (fcIds.has(f.id)) errors.push(`${tag}: id duplicado`);
  fcIds.add(f.id);
  checkBilingualText(f, 'q', tag, errors);
  checkBilingualText(f, 'a', tag, errors);
});

report(errors);

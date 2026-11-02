const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const E = require('../crrt-engine.js');
const { SOURCES, CASES, QUIZ, MAP } = require('../teach-content.js');
const root = join(__dirname, '..');
const round = (v) => (v === null ? null : Math.round(v * 10) / 10);
const run = (patch) => E.calc({ ...E.DEFAULTS, ...patch });
const get = (o, path) => path.split('.').reduce((a, k) => a[k], o);

test('six cases, every scenario matches the engine', () => {
  assert.equal(CASES.length, 6);
  for (const c of CASES) {
    assert.ok(c.scenarios.length >= 2, c.id);
    for (const s of c.scenarios) {
      const r = run({ ...c.base, ...s.patch });
      const level = E.checks(r).some((x) => x.lv === 'crit') ? 'crit' : E.checks(r).some((x) => x.lv === 'warn') ? 'warn' : 'ok';
      assert.deepEqual({ eff: r.eff, actual: round(r.actual), effDose: round(r.effDose), ff: round(r.ff), level }, s.expect, `${c.id} ${s.label}`);
    }
  }
});

test('case narrative numbers come from the engine', () => {
  const sc = (id, i) => { const c = CASES.find((x) => x.id === id); return run({ ...c.base, ...c.scenarios[i].patch }); };
  assert.equal(round(sc('sepsis', 0).hep.rateMl), 1);
  assert.equal(round(sc('sepsis', 1).hep.rateMl), 2.5);
  assert.equal(round(sc('clot', 0).qp), 5220);
  assert.equal(round(sc('fluid', 0).nufKg), 3.8);
  assert.equal(round(sc('fluid', 1).nufKg), 2.7);
  assert.equal(round(sc('fluid', 2).nufKg), 1.3);
  // citrate 3 mmol/L blood from an 18 mmol/L solution
  for (const [qb, pbp] of [[150, 1500], [120, 1200], [130, 1300]]) assert.equal(Math.round(qb * 60 / 1000 * 3 / 18 * 1000), pbp);
});

test('the HIT case shows that a clean tool check is not clinical clearance', () => {
  const c = CASES.find((x) => x.id === 'hit');
  assert.equal(c.scenarios[0].expect.level, 'ok');
});

test('quiz: 20 questions, three levels, balanced answers, calc answers match engine', () => {
  assert.equal(QUIZ.length, 20);
  const levels = {}; const pos = [0, 0, 0, 0];
  for (const q of QUIZ) {
    levels[q.level] = (levels[q.level] || 0) + 1; pos[q.answer]++;
    assert.equal(q.options.length, 4, q.stem);
    assert.equal(new Set(q.options).size, 4, q.stem);
    if (q.calc) assert.equal(round(get(run(q.calc.patch), q.calc.field)), q.calc.value, q.stem);
  }
  assert.deepEqual(levels, { 基礎: 7, 進階: 7, 高階: 6 });
  assert.deepEqual(pos, [5, 5, 5, 5]);
  assert.equal(Math.round(180 * 60 / 1000 * 3 / 18 * 1000), 1800);
});

test('the correct option is not a giveaway by length', () => {
  const strictLongest = QUIZ.filter((q) => {
    const l = q.options.map((o) => o.length); const max = Math.max(...l);
    return l[q.answer] === max && l.filter((x) => x === max).length === 1;
  });
  assert.ok(strictLongest.length <= 7, `${strictLongest.length} answers are the unique longest`);
});

test('all source keys and map case links resolve', () => {
  const used = new Set();
  [...CASES, ...QUIZ].forEach((x) => x.src.forEach((k) => { assert.ok(SOURCES[k], k); used.add(k); }));
  assert.deepEqual(Object.keys(SOURCES).filter((k) => !used.has(k)), []);
  const ids = CASES.map((c) => c.id);
  MAP.branches.forEach((b) => b.leaves.forEach((l) => { if (l.c) assert.ok(ids.includes(l.c), l.c); }));
});

test('index.html loads every script with the same version and has all views', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const v = [...html.matchAll(/(?:src|href)="(?:crrt-engine\.js|teach-content\.js|teach\.js|teach\.css)\?v=(\d+)"/g)].map((m) => m[1]);
  assert.equal(v.length, 4); assert.equal(new Set(v).size, 1);
  ['view-tool', 'view-cases', 'view-quiz', 'view-map', 'demoBanner'].forEach((id) => assert.ok(html.includes(`id="${id}"`), id));
});

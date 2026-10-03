/* ═══════════════════════════════════════════════════════════
   TERRA VÉLO — Moteur du serious game
   Aucune dépendance · fonctionne hors serveur (GitHub Pages)
   ═══════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ─────────── Paramètres ─────────── */
const STORE_KEY = 'terravelo_sgn_v1';
const SALT = 'TV-SGN-1STMG-HPME';
const MULT = [1, 0.6, 0.3];      // points selon la tentative réussie (1re, 2e, 3e)
const FAIL_RATIO = 0.25;         // part des points gardée, au prorata, après 3 échecs
const MASTER = 0.75, CONSOL = 0.5, NOTION_OK = 0.7;

/* ─────────── Stockage (avec repli mémoire) ─────────── */
let memStore = null;
const store = {
  get() { try { const v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : memStore; } catch (e) { return memStore; } },
  set(s) { memStore = s; try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {} },
  clear() { memStore = null; try { localStorage.removeItem(STORE_KEY); } catch (e) {} }
};
const fresh = () => ({ v: 1, id: { prenom: '', nom: '', classe: '' }, parts: {}, badges: [], seenIntro: {}, started: null, ended: null });
let S = store.get() || fresh();
const save = () => store.set(S);

/* ─────────── Index du contenu ─────────── */
const ACT = {}; ACTIVITIES.forEach((a, i) => { a.index = i; ACT[a.id] = a; });
const MIS = {}; MISSIONS.forEach((m, i) => { m.index = i; MIS[m.id] = m; m.acts = ACTIVITIES.filter(a => a.mission === m.id); });
const PARTS = [];
ACTIVITIES.forEach(a => a.parts.forEach((p, i) => {
  const ch = p.ch != null ? [p.ch] : (Array.isArray(a.ch) ? a.ch : [a.ch]);
  PARTS.push({ key: a.id + ':' + i, act: a, part: p, i, ch });
}));
const MAX = PARTS.reduce((s, x) => s + x.part.pts, 0);

/* ─────────── Utilitaires ─────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const r1 = n => Math.round(n * 100) / 100;
const fmt = n => String(r1(n)).replace('.', ',');
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ps = key => S.parts[key] || (S.parts[key] = { att: 0, done: false, ok: false, score: 0, errs: [], elim: [] });
const actDone = a => a.parts.every((p, i) => S.parts[a.id + ':' + i] && S.parts[a.id + ':' + i].done);
const misDone = m => m.acts.every(actDone);
const total = () => PARTS.reduce((s, x) => s + (S.parts[x.key] ? S.parts[x.key].score : 0), 0);
const allDone = () => ACTIVITIES.every(actDone);
const firstUndone = () => ACTIVITIES.find(a => !actDone(a));
const noteOn20 = () => Math.round(total() / MAX * 20 * 2) / 2;
const norm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
const maxAtt = p => p.type === 'choice' ? Math.min(3, p.options.length - 1) : 3;

function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36).toUpperCase().padStart(7, '0').slice(-5);
}
function makeCode(prenom, nom, classe, note) {
  const n2 = Math.round(note * 2);
  return 'TV-' + String(n2).padStart(2, '0') + '-' + hash([norm(prenom), norm(nom), norm(classe), n2, SALT].join('|'));
}

/* ─────────── Chrome commun (topbar + progression) ─────────── */
function chrome(missionLabel) {
  const pct = Math.min(100, total() / MAX * 100);
  return `
  <header class="topbar"><div class="topbar-inner">
    <a class="brand" href="#/"><div class="brand-mark">TV</div><div class="brand-text">Terra Vélo<em>Mission SGN</em></div></a>
    <div class="top-actions">
      <button class="top-btn" data-act="dossier">Dossier</button>
      <a class="top-btn" href="#/">Menu</a>
    </div>
  </div></header>
  <div class="progress-strip"><div class="progress-inner">
    <div class="progress-mission">${esc(missionLabel || 'Première STMG · SGN')}</div>
    <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div class="progress-pts">${fmt(total())} / ${MAX} pts</div>
  </div></div>`;
}
function refreshStrip() {
  const f = $('.progress-fill'), p = $('.progress-pts');
  if (f) f.style.width = Math.min(100, total() / MAX * 100) + '%';
  if (p) p.textContent = fmt(total()) + ' / ' + MAX + ' pts';
}

/* ═══════════════════ VUES ═══════════════════ */
const app = () => $('#app');

function viewHome() {
  const cur = firstUndone();
  const started = Object.keys(S.parts).length > 0;
  const missions = MISSIONS.map(m => {
    const done = misDone(m);
    const unlocked = m.index === 0 || misDone(MISSIONS[m.index - 1]);
    const isCur = !done && unlocked;
    const nd = m.acts.filter(actDone).length;
    const pts = m.acts.reduce((s, a) => s + a.parts.reduce((t, p) => t + p.pts, 0), 0);
    const got = m.acts.reduce((s, a) => s + a.parts.reduce((t, p, i) => t + (S.parts[a.id + ':' + i] ? S.parts[a.id + ':' + i].score : 0), 0), 0);
    const cls = done ? 'done' : isCur ? 'current' : 'locked';
    const tag = unlocked ? 'a' : 'div';
    const href = unlocked ? ` href="#/m/${m.id}"` : '';
    return `<${tag} class="mcard ${cls}"${href} data-need-id="1">
      <div class="mnum">${m.num === 4 ? 'F' : m.num}</div>
      <div class="minfo"><div class="mname">${m.num === 4 ? 'Mission finale' : 'Mission ' + m.num} · ${esc(m.title)}</div>
        <div class="mmeta">${m.acts.length} activités · ${fmt(pts)} pts${done ? ' · ' + fmt(got) + ' obtenus' : ''}</div>
        <div class="mbar"><i style="width:${nd / m.acts.length * 100}%"></i></div></div>
      <div class="mstate">${done ? 'Terminée' : isCur ? (nd ? 'En cours' : 'À faire') : 'Verrouillée'}</div>
    </${tag}>`;
  }).join('');
  const badgeList = MISSIONS.map(m => m.badge).slice(0, 2).concat([EXTRA_BADGE.label]).concat(MISSIONS.slice(2).map(m => m.badge));
  app().innerHTML = chrome() + `
  <section class="hero"><div class="hero-inner">
    <div class="hero-tag">Première STMG · Sciences de gestion et numérique</div>
    <h1 class="hero-title">Mission<em>Terra Vélo</em></h1>
    <p class="hero-sub">Stagiaire chargé(e) de mission dans une PME de Gaillac, vous devez comprendre une organisation, ses salariés et les tensions qui la traversent, puis remettre votre diagnostic à la directrice.</p>
    <div class="hero-meta">
      <div><div class="hm-val">4</div><div class="hm-lab">Missions</div></div><div class="hm-sep"></div>
      <div><div class="hm-val">35-45</div><div class="hm-lab">Minutes</div></div><div class="hm-sep"></div>
      <div><div class="hm-val">${fmt(total())}</div><div class="hm-lab">Points / ${MAX}</div></div><div class="hm-sep"></div>
      <div><div class="hm-val">Ch. 1-3</div><div class="hm-lab">Révisions</div></div>
    </div>
  </div></section>
  <div class="page-wrap">
    <div class="card top-green">
      <div class="card-title">Identification</div>
      <div class="fields-grid">
        <div class="field-wrap"><label class="field-label" for="f-prenom">Prénom</label><input class="field-input" id="f-prenom" autocomplete="given-name" value="${esc(S.id.prenom)}"></div>
        <div class="field-wrap"><label class="field-label" for="f-nom">Nom</label><input class="field-input" id="f-nom" autocomplete="family-name" value="${esc(S.id.nom)}"></div>
        <div class="field-wrap"><label class="field-label" for="f-classe">Classe</label><input class="field-input" id="f-classe" placeholder="Ex : 1STMG 107" value="${esc(S.id.classe)}"></div>
      </div>
      <p class="field-note">Aucune autre information n’est demandée. Votre progression est enregistrée sur cet appareil : vous pouvez fermer la page et reprendre plus tard.</p>
      <div class="msg-err" id="id-err"></div>
      <div class="btn-row">
        <button class="btn btn-primary" data-act="start">${allDone() ? 'Voir mes résultats' : started ? 'Reprendre la mission' : 'Commencer la mission'}</button>
        <button class="btn btn-secondary" data-act="dossier">Dossier Terra Vélo</button>
        ${started ? '<button class="btn btn-ghost" data-act="reset">Recommencer à zéro</button>' : ''}
      </div>
    </div>
    <div class="section-title">Missions</div>
    <div class="missions">${missions}</div>
    <div class="section-title">Validations</div>
    <div class="badges">${badgeList.map(b => `<span class="badge ${S.badges.includes(b) ? 'on' : ''}">${esc(b)}</span>`).join('')}</div>
    ${allDone() ? '<div class="btn-row"><a class="btn btn-dark" href="#/resultats">Fiche de résultats</a></div>' : ''}
  </div>
  <div class="footer-note">Horizon PME · Ressource pédagogique SGN · <a href="#/prof">Espace enseignant</a></div>`;
  $$('#f-prenom, #f-nom, #f-classe').forEach(el => el.addEventListener('input', readId));
  $$('.mcard[href]').forEach(el => el.addEventListener('click', e => { if (!checkId()) e.preventDefault(); }));
}

function readId() {
  const p = $('#f-prenom'); if (!p) return;
  S.id = { prenom: p.value.trim(), nom: $('#f-nom').value.trim(), classe: $('#f-classe').value.trim() };
  save();
}
function checkId() {
  readId();
  const miss = ['prenom', 'nom', 'classe'].filter(k => !S.id[k]);
  if (miss.length) {
    const e = $('#id-err');
    if (e) { e.textContent = 'Renseignez votre prénom, votre nom et votre classe pour commencer.'; }
    const f = $('#f-' + miss[0]); if (f) { f.focus(); f.classList.add('shake'); setTimeout(() => f.classList.remove('shake'), 400); }
    return false;
  }
  return true;
}

function viewMissionIntro(m) {
  if (!m) return go('#/');
  if (!S.started) { S.started = Date.now(); save(); }
  const firstAct = m.acts.find(a => !actDone(a)) || m.acts[0];
  S.seenIntro[m.id] = true; save();
  app().innerHTML = chrome(labelMission(m)) + `
  <div class="page-wrap">
    <div class="interlude">
      <span class="page-eyebrow">${m.num === 4 ? 'Mission finale' : 'Mission ' + m.num + ' / 3'}${m.ch ? ' · Chapitre ' + m.ch : ' · Chapitres 1, 2 et 3'}</span>
      <h1>${esc(m.title)}</h1>
      ${m.intro}
    </div>
    <div class="act-nav">
      <a class="btn btn-secondary" href="#/">Menu</a>
      <a class="btn btn-primary" href="#/a/${firstAct.id}">${misDone(m) ? 'Revoir la mission' : 'Commencer'}</a>
    </div>
  </div>`;
}
const labelMission = m => (m.num === 4 ? 'Mission finale' : 'Mission ' + m.num) + ' · ' + m.title;

function viewMissionEnd(m) {
  const got = m.acts.reduce((s, a) => s + a.parts.reduce((t, p, i) => t + ps(a.id + ':' + i).score, 0), 0);
  const max = m.acts.reduce((s, a) => s + a.parts.reduce((t, p) => t + p.pts, 0), 0);
  const next = MISSIONS[m.index + 1];
  app().innerHTML = chrome(labelMission(m)) + `
  <div class="page-wrap">
    <div class="interlude">
      <span class="page-eyebrow">${m.num === 4 ? 'Mission finale' : 'Mission ' + m.num} terminée</span>
      <h1>${esc(m.title)}</h1>
      <div class="big-badge">${esc(m.badge)}</div>
      <p class="score-line"><b>${fmt(got)}</b> / ${fmt(max)} points sur cette mission</p>
      ${next ? '<p>La suite de l’histoire vous attend.</p>' : '<p>Votre diagnostic est remis à Nadia Ferrand. Découvrez votre fiche de résultats.</p>'}
    </div>
    <div class="act-nav">
      <a class="btn btn-secondary" href="#/">Menu</a>
      ${next ? `<a class="btn btn-primary" href="#/m/${next.id}">${next.num === 4 ? 'Mission finale' : 'Mission ' + next.num} →</a>` : '<a class="btn btn-primary" href="#/resultats">Voir mes résultats →</a>'}
    </div>
  </div>`;
}

/* ─────────── Activité ─────────── */
function viewActivity(a) {
  if (!a) return go('#/');
  const cur = firstUndone();
  if (cur && a.index > cur.index) return go('#/a/' + cur.id);
  if (!S.started) { S.started = Date.now(); save(); }
  const m = MIS[a.mission];
  const pos = m.acts.indexOf(a) + 1;
  const chLabel = Array.isArray(a.ch) ? 'Chapitres ' + a.ch.join(', ') : 'Chapitre ' + a.ch + (a.obj ? ' · Objectif ' + a.obj : '');
  let html = chrome(labelMission(m)) + `
  <div class="page-wrap">
    <span class="page-eyebrow">${m.num === 4 ? 'Mission finale' : 'Mission ' + m.num} · Activité ${pos} / ${m.acts.length} · <span class="terra">${chLabel}</span></span>
    <h1 class="page-title">${esc(a.title)}</h1>
    <div class="step-header"><div class="step-badge terra">Situation</div><div class="step-title">${esc(m.title)}</div></div>
    <div class="step-body"><div class="ctx-box">${a.intro}</div>${a.doc || ''}</div>
    <div id="parts"></div>
    <div class="act-nav" id="act-nav"></div>
  </div>`;
  app().innerHTML = html;
  renderParts(a);
}

function renderParts(a, focusIndex) {
  const box = $('#parts');
  box.innerHTML = '';
  for (let i = 0; i < a.parts.length; i++) {
    if (i > 0 && !ps(a.id + ':' + (i - 1)).done) break;
    box.appendChild(buildPart(a, i));
  }
  renderNav(a);
  if (focusIndex != null) {
    const el = $('#part-' + a.id + '-' + focusIndex);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  }
}

function renderNav(a) {
  const nav = $('#act-nav');
  const m = MIS[a.mission];
  const prev = ACTIVITIES[a.index - 1];
  let right = '';
  if (actDone(a)) {
    const next = ACTIVITIES[a.index + 1];
    if (!next || next.mission !== a.mission) right = `<a class="btn btn-primary" href="#/fin/${m.id}">Terminer la mission →</a>`;
    else right = `<a class="btn btn-primary" href="#/a/${next.id}">Activité suivante →</a>`;
  }
  nav.innerHTML = `${prev ? `<a class="btn btn-secondary" href="#/a/${prev.id}">← Précédent</a>` : `<a class="btn btn-secondary" href="#/m/${m.id}">← Introduction</a>`}${right}`;
}

function buildPart(a, i) {
  const p = a.parts[i], key = a.id + ':' + i, st = ps(key);
  const sec = document.createElement('section');
  sec.className = 'part' + (st.done ? ' locked' : '');
  sec.id = 'part-' + a.id + '-' + i;
  const n = a.parts.length;
  const ptsTxt = st.done ? `${fmt(st.score)} / ${fmt(p.pts)} pts` : `${fmt(p.pts)} pts`;
  sec.innerHTML = `
    <div class="part-head"><span class="part-lab">${n > 1 ? 'Question ' + (i + 1) + ' / ' + n : 'Question'}${!st.done && st.att ? ' · <span class="attempts">tentative ' + (st.att + 1) + ' / ' + maxAtt(p) + '</span>' : ''}</span>
      <span class="part-pts ${st.done && !st.ok ? 'ko' : ''}">${ptsTxt}</span></div>
    <div class="part-body">
      ${p.reveal ? `<div class="reveal">${p.reveal}</div>` : ''}
      <div class="part-q">${p.q}</div>
      <div class="ix"></div>
      <div class="fbz"></div>
      ${st.done ? '' : '<div class="btn-row"><button class="btn btn-dark" data-validate="1">Valider</button></div>'}
    </div>`;
  const ix = $('.ix', sec);
  TYPES[p.type].render(ix, p, st, st.done);
  if (st.done) {
    TYPES[p.type].solution(ix, p);
    $('.fbz', sec).innerHTML = st.ok ? fbOk(p, st) : fbSolution(p, st);
  } else if (st.att > 0) {
    $('.fbz', sec).innerHTML = st.lastFb || '';
  }
  const vb = $('[data-validate]', sec);
  if (vb) vb.addEventListener('click', () => validate(a, i, sec));
  return sec;
}

const fbOk = (p, st) => `<div class="fb ok"><div class="fb-t">${st.att === 1 ? 'Bien vu' : 'Correct'}</div><p>${p.explain}</p><div class="fb-pts">+ ${fmt(st.score)} pt${st.score >= 2 ? 's' : ''}</div></div>`;
const fbSolution = (p, st) => `<div class="fb sol"><div class="fb-t">Correction</div><p>${p.explain}</p>${st.lastWhys && st.lastWhys.length ? '<ul>' + st.lastWhys.map(w => `<li>${w}</li>`).join('') + '</ul>' : ''}<div class="fb-pts">${fmt(st.score)} pt${st.score >= 2 ? 's' : ''} sur ${fmt(p.pts)}</div></div>`;

function validate(a, i, sec) {
  const p = a.parts[i], key = a.id + ':' + i, st = ps(key);
  if (st.done) return;
  const T = TYPES[p.type];
  const ans = T.read($('.ix', sec), p);
  const res = T.check(p, ans);
  const fbz = $('.fbz', sec);
  if (res.incomplete) {
    fbz.innerHTML = `<div class="fb warn">${res.incomplete}</div>`;
    return;
  }
  st.att++;
  if (res.ok) {
    st.done = true; st.ok = true;
    st.score = r1(p.pts * MULT[st.att - 1]);
    save();
    afterPartDone(a, i);
    return;
  }
  (res.whys || []).forEach(w => { if (w && !st.errs.includes(w)) st.errs.push(w); });
  const N = maxAtt(p);
  if (st.att >= N) {
    st.done = true; st.ok = false;
    st.score = r1(p.pts * FAIL_RATIO * Math.max(0, res.frac || 0));
    st.lastWhys = (res.whys || []).filter(Boolean).slice(0, 3);
    save();
    afterPartDone(a, i);
    return;
  }
  // Retour pédagogique gradué
  let fb;
  if (st.att === 1) {
    fb = `<div class="fb hint"><div class="fb-t">Indice</div><p>${p.hint}</p>${res.info ? '<p>' + res.info + '</p>' : ''}<p class="attempts">Réessayez : il vous reste ${N - st.att} tentative${N - st.att > 1 ? 's' : ''}.</p></div>`;
  } else {
    const whys = (res.whys || []).filter(Boolean);
    fb = `<div class="fb why"><div class="fb-t">Pourquoi ce n’est pas encore ça</div>${res.info ? '<p>' + res.info + '</p>' : ''}${whys.length ? '<ul>' + whys.slice(0, 3).map(w => `<li>${w}</li>`).join('') + '</ul>' : ''}<p>${p.hint2}</p><p class="attempts">Dernière tentative.</p></div>`;
    if (T.markWrong) T.markWrong($('.ix', sec), p, ans);
  }
  if (T.afterWrong) T.afterWrong($('.ix', sec), p, ans, st);
  st.lastFb = fb;
  save();
  fbz.innerHTML = fb;
  const lab = $('.part-lab', sec);
  if (lab) lab.innerHTML = (a.parts.length > 1 ? 'Question ' + (i + 1) + ' / ' + a.parts.length : 'Question') + ` · <span class="attempts">tentative ${st.att + 1} / ${N}</span>`;
  fbz.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function afterPartDone(a, i) {
  const m = MIS[a.mission];
  if (actDone(a)) {
    if (a.id === EXTRA_BADGE.after && !S.badges.includes(EXTRA_BADGE.label)) S.badges.push(EXTRA_BADGE.label);
    if (misDone(m) && !S.badges.includes(m.badge)) S.badges.push(m.badge);
    if (allDone() && !S.ended) S.ended = Date.now();
    save();
  }
  renderParts(a, i + 1 < a.parts.length ? i + 1 : i);
  if (actDone(a) && i + 1 >= a.parts.length) {
    const el = $('#part-' + a.id + '-' + i + ' .fbz');
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }
  refreshStrip();
}

/* ═══════════════════ TYPES D’INTERACTION ═══════════════════ */
const TYPES = {};

/* ── Choix unique / multiple ── */
function choiceRender(ix, p, st, locked, multi) {
  const opts = locked ? p.options : shuffle(p.options);
  ix.innerHTML = `<div class="choices ${multi ? 'multi' : ''}">${opts.map(o =>
    `<button type="button" class="choice ${st.elim && st.elim.includes(o.id) && !locked ? 'elim' : ''}" data-id="${o.id}" ${locked || (st.elim && st.elim.includes(o.id)) ? 'disabled' : ''}><span class="dot"></span><span>${o.text}</span></button>`).join('')}</div>
    ${multi && !locked ? '<p class="part-help" style="margin:10px 0 0">Plusieurs réponses attendues : sélectionnez toutes celles qui conviennent, et seulement celles-là.</p>' : ''}`;
  if (locked) return;
  ix.addEventListener('click', e => {
    const b = e.target.closest('.choice'); if (!b || b.disabled) return;
    if (!multi) $$('.choice', ix).forEach(c => c.classList.remove('sel', 'bad'));
    else $$('.choice', ix).forEach(c => c.classList.remove('bad'));
    b.classList.toggle('sel', multi ? !b.classList.contains('sel') : true);
  });
}
TYPES.choice = {
  render: (ix, p, st, locked) => choiceRender(ix, p, st, locked, false),
  read: ix => $$('.choice.sel', ix).map(b => b.dataset.id),
  check(p, ans) {
    if (!ans.length) return { incomplete: 'Choisissez une réponse avant de valider.' };
    const o = p.options.find(x => x.id === ans[0]);
    return { ok: !!o.ok, frac: 0, whys: o.ok ? [] : [o.why] };
  },
  afterWrong(ix, p, ans, st) {
    st.elim = st.elim || [];
    ans.forEach(id => { if (!st.elim.includes(id)) st.elim.push(id); });
    ans.forEach(id => { const b = $(`.choice[data-id="${id}"]`, ix); if (b) { b.classList.remove('sel'); b.classList.add('elim'); b.disabled = true; } });
  },
  solution(ix, p) { $$('.choice', ix).forEach(b => { const o = p.options.find(x => x.id === b.dataset.id); if (o.ok) b.classList.add('good'); }); }
};
TYPES.multi = {
  render: (ix, p, st, locked) => choiceRender(ix, p, st, locked, true),
  read: ix => $$('.choice.sel', ix).map(b => b.dataset.id),
  check(p, ans) {
    if (!ans.length) return { incomplete: 'Sélectionnez au moins une réponse avant de valider.' };
    const good = p.options.filter(o => o.ok).map(o => o.id);
    const hit = ans.filter(id => good.includes(id)).length;
    const extra = ans.filter(id => !good.includes(id));
    const miss = good.length - hit;
    const ok = !extra.length && !miss;
    const parts = [];
    if (miss) parts.push(`il manque ${miss} réponse${miss > 1 ? 's' : ''} pertinente${miss > 1 ? 's' : ''}`);
    if (extra.length) parts.push(`${extra.length} réponse${extra.length > 1 ? 's' : ''} sélectionnée${extra.length > 1 ? 's' : ''} ne convien${extra.length > 1 ? 'nent' : 't'} pas`);
    return { ok, frac: Math.max(0, (hit - extra.length) / good.length),
      info: ok ? '' : 'Bilan : ' + parts.join(' et ') + '.',
      whys: extra.map(id => p.options.find(o => o.id === id).why) };
  },
  markWrong(ix, p, ans) {
    ans.forEach(id => { const o = p.options.find(x => x.id === id); if (!o.ok) $(`.choice[data-id="${id}"]`, ix).classList.add('bad'); });
  },
  solution(ix, p) { $$('.choice', ix).forEach(b => { const o = p.options.find(x => x.id === b.dataset.id); if (o.ok) b.classList.add('good'); }); }
};

/* ── Classement (glisser-déposer + toucher) ── */
TYPES.sort = {
  render(ix, p, st, locked) {
    const items = locked ? p.items : shuffle(p.items);
    const chip = it => `<button type="button" class="chip" data-id="${it.id}" ${locked ? 'disabled' : 'draggable="true"'}>${it.text}</button>`;
    ix.innerHTML = `${locked ? '' : '<p class="sort-help">Faites glisser chaque étiquette, ou touchez une étiquette puis la catégorie choisie. Touchez une étiquette déjà placée pour la déplacer.</p>'}
      <div class="pool" data-zone="pool">${locked ? '' : items.map(chip).join('')}</div>
      <div class="zones ${p.cats.length <= 3 ? 'wide' : ''}">${p.cats.map(c => `<div class="zone ${locked ? 'locked' : ''}" data-zone="${c.id}"><div class="zone-h">${esc(c.label)}<span></span></div><div class="zone-b">${locked ? items.filter(it => it.cat === c.id).map(chip).join('') : ''}</div></div>`).join('')}</div>`;
    if (locked) { $('.pool', ix).style.display = 'none'; return; }
    let selected = null;
    const pool = $('.pool', ix);
    const update = () => {
      pool.classList.toggle('empty', !$('.chip', pool));
      $$('.zone', ix).forEach(z => { $('.zone-h span', z).textContent = $$('.chip', z).length || ''; });
    };
    const clearSel = () => { if (selected) selected.classList.remove('sel'); selected = null; $$('.target', ix).forEach(t => t.classList.remove('target')); };
    const dropInto = (chipEl, zoneEl) => {
      const target = zoneEl.dataset.zone === 'pool' ? pool : $('.zone-b', zoneEl);
      target.appendChild(chipEl);
      chipEl.classList.remove('ko', 'ok');
      update();
    };
    ix.addEventListener('click', e => {
      const c = e.target.closest('.chip');
      if (c) {
        if (selected === c) { clearSel(); return; }
        clearSel(); selected = c; c.classList.add('sel');
        $$('.zone', ix).forEach(z => z.classList.add('target'));
        if (c.closest('.zone')) pool.classList.add('target');
        return;
      }
      const z = e.target.closest('.zone, .pool');
      if (z && selected) { dropInto(selected, z); clearSel(); }
    });
    ix.addEventListener('dragstart', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      clearSel(); c.classList.add('dragging');
      e.dataTransfer.setData('text/plain', c.dataset.id); e.dataTransfer.effectAllowed = 'move';
    });
    ix.addEventListener('dragend', e => { const c = e.target.closest('.chip'); if (c) c.classList.remove('dragging'); $$('.target', ix).forEach(t => t.classList.remove('target')); });
    ix.addEventListener('dragover', e => { const z = e.target.closest('.zone, .pool'); if (z) { e.preventDefault(); $$('.target', ix).forEach(t => t !== z && t.classList.remove('target')); z.classList.add('target'); } });
    ix.addEventListener('drop', e => {
      const z = e.target.closest('.zone, .pool'); if (!z) return;
      e.preventDefault();
      const c = $(`.chip[data-id="${e.dataTransfer.getData('text/plain')}"]`, ix);
      if (c) dropInto(c, z);
      z.classList.remove('target');
    });
    update();
  },
  read(ix) {
    const map = {};
    $$('.zone', ix).forEach(z => $$('.chip', z).forEach(c => { map[c.dataset.id] = z.dataset.zone; }));
    return map;
  },
  check(p, ans) {
    if (Object.keys(ans).length < p.items.length) return { incomplete: `Placez toutes les étiquettes avant de valider (${p.items.length - Object.keys(ans).length} restante${p.items.length - Object.keys(ans).length > 1 ? 's' : ''}).` };
    const wrong = p.items.filter(it => ans[it.id] !== it.cat);
    return { ok: !wrong.length, frac: (p.items.length - wrong.length) / p.items.length,
      info: wrong.length ? `${wrong.length} étiquette${wrong.length > 1 ? 's sont mal placées' : ' est mal placée'} sur ${p.items.length}.` : '',
      whys: wrong.map(it => it.why).filter(Boolean) };
  },
  markWrong(ix, p, ans) {
    p.items.forEach(it => { const c = $(`.chip[data-id="${it.id}"]`, ix); if (c) c.classList.toggle('ko', ans[it.id] !== it.cat); });
  },
  solution(ix, p) { $$('.chip', ix).forEach(c => c.classList.add('ok')); }
};

/* ── Champs à compléter (listes déroulantes / vrai-faux) ── */
TYPES.fields = {
  render(ix, p, st, locked) {
    const isTF = p.shared && p.shared.length === 2;
    const sharedOrder = p.shared ? (isTF ? p.shared.map((t, k) => k) : shuffle(p.shared.map((t, k) => k))) : null;
    const rows = p.rows.map((r, ri) => {
      if (isTF) {
        return `<div class="frow tf" data-r="${ri}"><div class="flabel">${r.label}</div>
          <div class="tfbtns">${p.shared.map((t, k) => `<button type="button" class="tfbtn ${locked && r.answer === k ? 'on' : ''}" data-v="${k}" ${locked ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</div></div>`;
      }
      const list = p.shared ? sharedOrder.map(k => [k, p.shared[k]]) : shuffle(r.options.map((t, k) => [k, t]));
      return `<div class="frow" data-r="${ri}"><div class="flabel">${r.label}</div>
        <select ${locked ? 'disabled' : ''} aria-label="${esc(r.label)}"><option value="">— Choisir —</option>${list.map(([k, t]) => `<option value="${k}" ${locked && r.answer === k ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
    }).join('');
    ix.innerHTML = `<div class="frows">${rows}</div>`;
    if (locked || !isTF) {
      if (!locked) ix.addEventListener('change', e => { const row = e.target.closest('.frow'); if (row) row.classList.remove('ko'); });
      return;
    }
    ix.addEventListener('click', e => {
      const b = e.target.closest('.tfbtn'); if (!b) return;
      const row = b.closest('.frow');
      $$('.tfbtn', row).forEach(x => x.classList.remove('on'));
      b.classList.add('on'); row.classList.remove('ko');
    });
  },
  read(ix) {
    return $$('.frow', ix).map(row => {
      const s = $('select', row);
      if (s) return s.value === '' ? -1 : +s.value;
      const on = $('.tfbtn.on', row); return on ? +on.dataset.v : -1;
    });
  },
  check(p, ans) {
    const empty = ans.filter(v => v < 0).length;
    if (empty) return { incomplete: `Répondez à toutes les lignes avant de valider (${empty} sans réponse).` };
    const wrong = p.rows.filter((r, ri) => ans[ri] !== r.answer);
    return { ok: !wrong.length, frac: (p.rows.length - wrong.length) / p.rows.length,
      info: wrong.length ? `${wrong.length} réponse${wrong.length > 1 ? 's sont incorrectes' : ' est incorrecte'} sur ${p.rows.length}.` : '',
      whys: wrong.map(r => r.why).filter(Boolean) };
  },
  markWrong(ix, p, ans) { $$('.frow', ix).forEach((row, ri) => row.classList.toggle('ko', ans[ri] !== p.rows[ri].answer)); },
  solution(ix, p) {
    $$('.frow', ix).forEach((row, ri) => {
      row.classList.add('ok');
      const r = p.rows[ri];
      if (r.why) row.insertAdjacentHTML('beforeend', `<div class="fsol"><em>${r.why}</em></div>`);
    });
  }
};

/* ── Repérage d’informations dans un document ── */
TYPES.highlight = {
  render(ix, p, st, locked) {
    ix.innerHTML = `<div class="hl-doc"><div class="hl-head">${esc(p.head)}</div>${p.segments.map((s, k) =>
      s.meta ? `<div class="seg meta">${s.t}</div>` : `<button type="button" class="seg" data-k="${k}" ${locked ? 'disabled' : ''}>${s.t}</button>`).join('')}</div>`;
    if (locked) return;
    ix.addEventListener('click', e => { const s = e.target.closest('button.seg'); if (s) { s.classList.toggle('on'); s.classList.remove('ko'); } });
  },
  read: ix => $$('.seg.on', ix).map(s => +s.dataset.k),
  check(p, ans) {
    if (!ans.length) return { incomplete: 'Sélectionnez au moins un passage avant de valider.' };
    const good = p.segments.map((s, k) => s.ok ? k : -1).filter(k => k >= 0);
    const hit = ans.filter(k => good.includes(k)).length;
    const extra = ans.filter(k => !good.includes(k));
    const miss = good.length - hit;
    const bits = [];
    if (hit) bits.push(`${hit} passage${hit > 1 ? 's' : ''} pertinent${hit > 1 ? 's' : ''} repéré${hit > 1 ? 's' : ''}`);
    if (miss) bits.push(`${miss} oublié${miss > 1 ? 's' : ''}`);
    if (extra.length) bits.push(`${extra.length} en trop`);
    return { ok: !miss && !extra.length, frac: Math.max(0, (hit - extra.length) / good.length),
      info: 'Bilan : ' + bits.join(', ') + '.',
      whys: extra.map(k => p.segments[k].why).filter(Boolean) };
  },
  markWrong(ix, p, ans) { ans.forEach(k => { if (!p.segments[k].ok) $(`.seg[data-k="${k}"]`, ix).classList.add('ko'); }); },
  solution(ix, p) { $$('button.seg', ix).forEach(s => { if (p.segments[+s.dataset.k].ok) s.classList.add('good'); }); }
};

/* ── Organigramme interactif ── */
function orgHTML(interactive, locked) {
  const node = (id, head) => {
    const pp = PEOPLE[id];
    return `<button type="button" class="onode ${head ? 'head' : ''}" data-p="${id}" ${!interactive || locked ? 'disabled' : ''}>
      <span class="av" style="background:${pp.col}">${pp.ini}</span>
      <span class="on-txt"><span class="on-name">${esc(pp.name.split(' ')[0])}</span><span class="on-role">${esc(pp.role)}</span></span></button>`;
  };
  return `<div class="org ${interactive && !locked ? 'interactive' : ''}">
    <div class="org-top">${node(ORG.root, true)}</div>
    <div class="org-staff">${ORG.staff.map(id => node(id)).join('')}</div>
    <div class="org-line"></div>
    <div class="org-branches">${ORG.branches.map(b => `<div class="org-col"><div class="org-col-lab">${esc(b.label)}</div>${node(b.head, true)}${b.team.map(id => node(id)).join('')}<div class="org-more">${esc(b.more)}</div></div>`).join('')}</div>
  </div>`;
}
TYPES.org = {
  render(ix, p, st, locked) {
    ix.innerHTML = orgHTML(true, locked);
    if (locked) return;
    ix.addEventListener('click', e => {
      const n = e.target.closest('.onode'); if (!n || n.disabled) return;
      $$('.onode', ix).forEach(x => x.classList.remove('sel', 'bad'));
      n.classList.add('sel');
    });
  },
  read: ix => { const n = $('.onode.sel', ix); return n ? n.dataset.p : null; },
  check(p, ans) {
    if (!ans) return { incomplete: 'Touchez une personne dans l’organigramme avant de valider.' };
    return { ok: ans === p.answer, frac: 0, whys: ans === p.answer ? [] : [(p.wrongWhy && p.wrongWhy[ans]) || `${PEOPLE[ans].name} n’apparaît pas dans ce rôle d’après le carnet d’observation.`] };
  },
  markWrong(ix, p, ans) { const n = $(`.onode[data-p="${ans}"]`, ix); if (n) { n.classList.remove('sel'); n.classList.add('bad'); } },
  solution(ix, p) { const n = $(`.onode[data-p="${p.answer}"]`, ix); if (n) n.classList.add('good'); }
};

/* ═══════════════════ RÉSULTATS ═══════════════════ */
function computeResults() {
  const ch = { 1: { got: 0, max: 0 }, 2: { got: 0, max: 0 }, 3: { got: 0, max: 0 } };
  PARTS.forEach(x => {
    const sc = S.parts[x.key] ? S.parts[x.key].score : 0;
    x.ch.forEach(c => { ch[c].got += sc / x.ch.length; ch[c].max += x.part.pts / x.ch.length; });
  });
  const acts = ACTIVITIES.map(a => {
    const max = a.parts.reduce((s, p) => s + p.pts, 0);
    const got = a.parts.reduce((s, p, i) => s + (S.parts[a.id + ':' + i] ? S.parts[a.id + ':' + i].score : 0), 0);
    const errs = a.parts.reduce((l, p, i) => l.concat((S.parts[a.id + ':' + i] && S.parts[a.id + ':' + i].errs) || []), []);
    return { a, max, got, pct: max ? got / max : 0, errs };
  });
  return { ch, acts };
}
const status = pct => pct >= MASTER ? ['Maîtrisé', 'st-ok'] : pct >= CONSOL ? ['À consolider', 'st-mid'] : ['À revoir', 'st-ko'];

function viewResults() {
  if (!allDone()) {
    const cur = firstUndone();
    app().innerHTML = chrome('Résultats') + `<div class="page-wrap"><div class="card"><div class="card-title">Mission en cours</div>
      <p>Les résultats seront disponibles lorsque les quatre missions seront terminées.</p>
      <div class="btn-row"><a class="btn btn-primary" href="#/a/${cur.id}">Reprendre la mission</a><a class="btn btn-secondary" href="#/">Menu</a></div></div></div>`;
    return;
  }
  const { ch, acts } = computeResults();
  const note = noteOn20();
  const code = makeCode(S.id.prenom, S.id.nom, S.id.classe, note);
  const good = [], bad = [];
  acts.forEach(r => (r.pct >= NOTION_OK ? good : bad).push(...r.a.notions.map(n => ({ n, r }))));
  const uniq = arr => arr.filter((x, k) => arr.findIndex(y => y.n === x.n) === k);
  const goodN = uniq(good), badN = uniq(bad).filter(x => !goodN.some(g => g.n === x.n) || true);
  const toReview = acts.filter(r => r.pct < NOTION_OK).sort((x, y) => x.pct - y.pct);
  const mins = S.started && S.ended ? Math.max(1, Math.round((S.ended - S.started) / 60000)) : null;
  const date = new Date(S.ended || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const badgeList = [MISSIONS[0].badge, MISSIONS[1].badge, EXTRA_BADGE.label, MISSIONS[2].badge, MISSIONS[3].badge];

  app().innerHTML = chrome('Résultats') + `
  <div class="page-wrap">
    <span class="page-eyebrow">Fiche récapitulative · Mission Terra Vélo · SGN Première STMG</span>
    <h1 class="page-title">Vos <em>résultats</em></h1>
    <div class="res-hero">
      <div><div class="res-lab">Score</div><div class="res-score">${fmt(note)}<small> / 20</small></div>
        <div style="color:rgba(255,255,255,.55);font-size:14px;margin-top:8px">Total exact : ${fmt(total())} / ${MAX} · note arrondie au demi-point</div></div>
      <div class="res-id"><b>${esc(S.id.prenom)} ${esc(S.id.nom)}</b>${esc(S.id.classe)}<br>${date}${mins ? ' · ' + mins + ' min' : ''}</div>
    </div>

    <div class="card"><div class="card-title">Diagnostic par chapitre</div><div class="chaps">
      ${[1, 2, 3].map(c => { const pct = ch[c].max ? ch[c].got / ch[c].max : 0; const [lab, cls] = status(pct);
        return `<div class="chap"><div class="chap-name">${esc(CH_LABELS[c])}</div><span class="chap-status ${cls}">${lab}</span>
          <div class="chap-bar"><div class="track"><i style="width:${pct * 100}%"></i></div><span>${Math.round(pct * 100)} %</span></div></div>`; }).join('')}
    </div></div>

    <div class="card"><div class="card-title">Validations</div><div class="badges">${badgeList.map(b => `<span class="badge ${S.badges.includes(b) ? 'on' : ''}">${esc(b)}</span>`).join('')}</div></div>

    <div class="two-col">
      <div class="card"><div class="card-title">Notions maîtrisées</div>${goodN.length ? `<ul class="nlist good">${goodN.map(x => `<li>${esc(x.n)}</li>`).join('')}</ul>` : '<p style="color:var(--muted);font-size:14px">Aucune notion n’est encore pleinement maîtrisée : reprenez les explications ci-dessous.</p>'}</div>
      <div class="card"><div class="card-title">Notions à revoir</div>${toReview.length ? `<ul class="nlist bad">${uniq(toReview.flatMap(r => r.a.notions.map(n => ({ n })))).map(x => `<li>${esc(x.n)}</li>`).join('')}</ul>` : '<p style="color:var(--muted);font-size:14px">Aucune. Excellent travail.</p>'}</div>
    </div>

    ${toReview.length ? `<div class="card"><div class="card-title">Pour progresser</div>
      ${toReview.slice(0, 6).map(r => `<div class="advice"><h4>${esc(r.a.title)} <span style="font-weight:500;color:var(--muted);font-size:13px">· ${fmt(r.got)} / ${fmt(r.max)} pts</span></h4>
        <p>${r.a.remediation}</p>
        ${r.errs.length ? `<p class="err">${r.errs.length > 1 ? 'Vos erreurs' : 'Votre erreur'} : ${r.errs.slice(0, 2).join(' ')}</p>` : ''}</div>`).join('')}
    </div>` : ''}

    <div class="card"><div class="card-title">Code de résultat</div>
      <div class="code-box"><div><div class="code-lab">À montrer à votre professeur</div><div class="code-val">${code}</div></div>
      <div style="font-size:13px;color:rgba(255,255,255,.6);max-width:280px">Ce code est lié à votre nom, votre classe et votre note. Il ne peut pas être recopié par un autre élève.</div></div>
    </div>

    <div class="btn-row no-print">
      ${window.TV_NO_PRINT ? '<span class="field-note" style="margin:0">Impression PDF disponible sur la version GitHub Pages.</span>' : '<button class="btn btn-primary" data-act="print">Imprimer / enregistrer en PDF</button>'}
      <a class="btn btn-secondary" href="#/">Menu</a>
      <a class="btn btn-secondary" href="#/a/${ACTIVITIES[0].id}">Revoir les corrections</a>
    </div>
    <p class="print-only" style="margin-top:14px;font-size:11px;color:#666">Horizon PME · Mission Terra Vélo · Fiche générée le ${new Date().toLocaleDateString('fr-FR')}</p>
  </div>`;
}

/* ─────────── Espace enseignant : vérification d’un code ─────────── */
function viewProf() {
  app().innerHTML = chrome('Espace enseignant') + `
  <div class="page-wrap">
    <span class="page-eyebrow">Espace enseignant</span>
    <h1 class="page-title">Vérifier un <em>code</em></h1>
    <div class="card top-green">
      <p style="margin-bottom:16px;font-size:15px">Saisissez les informations indiquées par l’élève. Le code contient la note : <b>TV-35-XXXXX</b> signifie 35 demi-points, soit <b>17,5 / 20</b>.</p>
      <div class="fields-grid">
        <div class="field-wrap"><label class="field-label" for="v-prenom">Prénom</label><input class="field-input" id="v-prenom"></div>
        <div class="field-wrap"><label class="field-label" for="v-nom">Nom</label><input class="field-input" id="v-nom"></div>
        <div class="field-wrap"><label class="field-label" for="v-classe">Classe</label><input class="field-input" id="v-classe"></div>
      </div>
      <div class="field-wrap" style="margin-top:14px"><label class="field-label" for="v-code">Code de résultat</label><input class="field-input" id="v-code" placeholder="TV-00-XXXXX" style="font-family:'Courier New',monospace;letter-spacing:.1em;text-transform:uppercase"></div>
      <div class="btn-row"><button class="btn btn-dark" data-act="verify">Vérifier</button></div>
      <div id="v-res"></div>
    </div>
  </div>`;
}
function verifyCode() {
  const g = id => $('#' + id).value;
  const code = g('v-code').trim().toUpperCase().replace(/\s/g, '');
  const m = code.match(/^TV-(\d{2})-([0-9A-Z]{5})$/);
  const out = $('#v-res');
  if (!m) { out.innerHTML = '<div class="fb why"><div class="fb-t">Format invalide</div><p>Le code doit ressembler à TV-35-AB12C.</p></div>'; return; }
  const note = +m[1] / 2;
  const ok = makeCode(g('v-prenom'), g('v-nom'), g('v-classe'), note) === code;
  out.innerHTML = ok
    ? `<div class="fb ok"><div class="fb-t">Code authentique</div><p>Activité terminée. Note obtenue : <b>${fmt(note)} / 20</b>.</p></div>`
    : `<div class="fb why"><div class="fb-t">Code non reconnu</div><p>Le code ne correspond pas à ce prénom, ce nom et cette classe (vérifiez l’orthographe exacte, notamment de la classe).</p></div>`;
}

/* ─────────── Dossier Terra Vélo (panneau latéral) ─────────── */
function openDossier() {
  const d = document.createElement('div');
  d.className = 'modal';
  d.innerHTML = `<div class="modal-panel" role="dialog" aria-label="Dossier Terra Vélo">
    <div class="modal-head"><h2>Dossier Terra Vélo</h2><button class="top-btn" data-close="1">Fermer</button></div>
    <div class="modal-body">
      ${DOSSIER_HTML}
      <h3>Organigramme</h3>
      <div class="card" style="padding:14px">${orgHTML(false)}</div>
      <h3>Les personnes que vous rencontrez</h3>
      <div class="people">${Object.keys(PEOPLE).map(id => { const p = PEOPLE[id]; return `<div class="person"><span class="av" style="background:${p.col}">${p.ini}</span><div><b>${esc(p.name)}</b><small>${esc(p.role)} · ${esc(p.service)}</small>${esc(p.bio)}</div></div>`; }).join('')}</div>
    </div></div>`;
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.remove(); });
  document.body.appendChild(d);
  document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { d.remove(); document.removeEventListener('keydown', k); } });
}

/* ═══════════════════ ROUTEUR ═══════════════════ */
function go(h) { if (location.hash !== h) location.hash = h; else route(); }
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [v, id] = h.split('/');
  const needId = ['m', 'a', 'fin'].includes(v);
  if (needId && (!S.id.prenom || !S.id.nom || !S.id.classe)) { location.hash = '#/'; return; }
  window.scrollTo(0, 0);
  if (v === 'm') viewMissionIntro(MIS[id]);
  else if (v === 'a') viewActivity(ACT[id]);
  else if (v === 'fin') { const m = MIS[id]; if (m && misDone(m)) viewMissionEnd(m); else go('#/'); }
  else if (v === 'resultats') viewResults();
  else if (v === 'prof') viewProf();
  else viewHome();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const act = t.dataset.act;
  if (act === 'dossier') openDossier();
  else if (act === 'print') window.print();
  else if (act === 'verify') verifyCode();
  else if (act === 'reset') {
    if (t.dataset.armed) { store.clear(); S = fresh(); go('#/'); }
    else { t.dataset.armed = '1'; t.textContent = 'Confirmer : tout effacer'; t.classList.add('btn-dark'); setTimeout(() => { if (t.isConnected) { delete t.dataset.armed; t.textContent = 'Recommencer à zéro'; t.classList.remove('btn-dark'); } }, 5000); }
  } else if (act === 'start') {
    if (!checkId()) return;
    if (allDone()) return go('#/resultats');
    const cur = firstUndone();
    const m = MIS[cur.mission];
    go(!S.seenIntro[m.id] ? '#/m/' + m.id : '#/a/' + cur.id);
  }
});
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
if (document.readyState !== 'loading') route();

/* Exposé pour les tests uniquement */
window.__TV = { get S() { return S; }, MAX, makeCode, PARTS };
})();

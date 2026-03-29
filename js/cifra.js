/* cifra.js — navegação, zoom, tela cheia, transpositor */

// ── ESCALA CROMÁTICA ──────────────────────────────────────────────
const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

// notas que preferem bemol quando se usa acidentes bemóis
const PREFER_FLAT = new Set(['F','Bb','Eb','Ab','Db','Gb']);

function noteIndex(note) {
  let i = SHARP.indexOf(note);
  if (i >= 0) return i;
  i = FLAT.indexOf(note);
  return i; // -1 se não encontrar
}

function transposeNote(note, semitones, useFlatStyle) {
  const i = noteIndex(note);
  if (i < 0) return note; // não reconhecido — devolve intacto
  const newIdx = ((i + semitones) % 12 + 12) % 12;
  // escolhe sharp ou flat baseado no contexto
  const sharpNote = SHARP[newIdx];
  const flatNote  = FLAT[newIdx];
  if (useFlatStyle && flatNote !== sharpNote) return flatNote;
  return sharpNote;
}

// Regex para capturar uma nota raiz (ex: C#, Db, A, Bb)
const NOTE_RE = /^([A-G][#b]?)/;

// Transpõe um token de acorde completo (ex: "D#m7/F#", "Bbmaj7", "Am")
function transposeChordToken(token, semitones, useFlatStyle) {
  // Tenta capturar nota raiz
  const m = token.match(NOTE_RE);
  if (!m) return token;
  const root = m[1];
  const rest  = token.slice(root.length);

  // Verifica se tem baixo  ex: /F#
  const slashIdx = rest.indexOf('/');
  if (slashIdx >= 0) {
    const quality = rest.slice(0, slashIdx);   // ex: "m7"
    const bassRaw = rest.slice(slashIdx + 1);  // ex: "F#"
    const bm = bassRaw.match(NOTE_RE);
    const bassTransposed = bm ? transposeNote(bm[1], semitones, useFlatStyle) + bassRaw.slice(bm[1].length) : bassRaw;
    return transposeNote(root, semitones, useFlatStyle) + quality + '/' + bassTransposed;
  }

  return transposeNote(root, semitones, useFlatStyle) + rest;
}

// Transpõe uma linha inteira preservando espaços
function transposeChordLine(line, semitones, useFlatStyle) {
  // Divide em tokens separados por espaços, transpõe cada um
  return line.replace(/[^\s]+/g, token => transposeChordToken(token, semitones, useFlatStyle));
}

// Decide se o tom resultante usa bemóis
function useFlat(semitones, originalTom) {
  const idx = noteIndex(originalTom);
  if (idx < 0) return false;
  const newIdx = ((idx + semitones) % 12 + 12) % 12;
  return PREFER_FLAT.has(SHARP[newIdx]) || PREFER_FLAT.has(FLAT[newIdx]);
}


// ── ESTADO GLOBAL ─────────────────────────────────────────────────
let cur = 0;
let semitonesOffset = 0;
let cols = 1;
let fontBase = 0;
let lyricsOnly = false;

let secs, total, originalTom;


// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  secs  = Array.from(document.querySelectorAll('.s'));
  total = secs.length;

  ensureLyricsToggleButton();

  // Lê o tom original do data-tom no <body>
  originalTom = document.body.dataset.tom || 'C';

  // Guarda o texto original de cada elemento de acorde
  document.querySelectorAll('.ch, .co').forEach(el => {
    el.dataset.orig = el.textContent;
  });

  // Init tom value and label from data-tom
  const tomElInit = document.getElementById('hdrTom');
  if (tomElInit) {
    tomElInit.textContent = originalTom;
    tomElInit.classList.add('ready');
  }
  const labelEl0 = document.getElementById('hdrTomLabel');
  if (labelEl0) { labelEl0.textContent = '0'; labelEl0.className = 'hdr-tom-label delta-zero'; }

  update();
  bindKeys();
  bindSwipe();
  bindSectionClick();
});

function ensureLyricsToggleButton() {
  const toolbar = document.querySelector('.toolbar');
  if (!toolbar || document.getElementById('btnLyrics')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tb-btn';
  btn.id = 'btnLyrics';
  btn.textContent = 'Ly';
  btn.title = 'Visao de letra somente (L)';
  btn.addEventListener('click', toggleLyricsOnly);

  const fsBtn = document.getElementById('btnFS');
  if (fsBtn && fsBtn.parentElement === toolbar) {
    toolbar.insertBefore(btn, fsBtn.nextSibling);
  } else {
    toolbar.appendChild(btn);
  }
}


// ── NAVEGAÇÃO ─────────────────────────────────────────────────────
function nav(d) {
  cur = Math.max(0, Math.min(total - 1, cur + d));
  update();
}

function update() {
  secs.forEach((s, i) => s.classList.toggle('active', i === cur));

  requestAnimationFrame(() => {
    const el = secs[cur];
    const h  = document.querySelector('header');
    const topOffset = (h?.offsetHeight || 0) + 12;
    let elTop = 0, node = el;
    while (node && node !== document.body) { elTop += node.offsetTop; node = node.offsetParent; }
    window.scrollTo({ top: elTop - topOffset, behavior: 'smooth' });
  });

  const counter = document.getElementById('counter');
  const next = cur < total - 1 ? getLabel(secs[cur + 1]) : null;
  const curLabel = getLabel(secs[cur]);
  if (counter) counter.textContent = `${cur + 1}/${total} · ${curLabel}${next ? ' → ' + next : ''}`;

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  if (btnPrev) btnPrev.disabled = cur === 0;
  if (btnNext) btnNext.disabled = cur === total - 1;
}

function getLabel(el) {
  return el.querySelector('.lbl')?.innerText.trim() || '';
}

function bindSectionClick() {
  secs.forEach((s, i) => s.addEventListener('click', () => { cur = i; update(); }));
}


// ── ZOOM ──────────────────────────────────────────────────────────
function sz(d) {
  fontBase = Math.max(-3, Math.min(5, fontBase + d));
  document.documentElement.style.setProperty('--cf', (0.9  + fontBase * 0.08) + 'em');
  document.documentElement.style.setProperty('--lf', (0.95 + fontBase * 0.08) + 'em');
}


// ── COLUNAS ───────────────────────────────────────────────────────
function toggleCols() {
  cols = cols === 1 ? 2 : 1;
  document.documentElement.style.setProperty('--cols', cols);
  const b = document.getElementById('btnCols');
  if (b) { b.textContent = cols === 1 ? '1col' : '2col'; b.classList.toggle('active-btn', cols === 2); }
}


// ── TELA CHEIA ────────────────────────────────────────────────────
function toggleFS() {
  const btn = document.getElementById('btnFS');
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    if (btn) btn.textContent = '✕';
  } else {
    document.exitFullscreen();
    if (btn) btn.textContent = '⛶';
  }
}


// ── LETRA SOMENTE ────────────────────────────────────────────────
function toggleLyricsOnly() {
  lyricsOnly = !lyricsOnly;
  document.body.classList.toggle('lyrics-only', lyricsOnly);

  const b = document.getElementById('btnLyrics');
  if (b) b.classList.toggle('active-btn', lyricsOnly);
}


// ── TRANSPOSITOR ─────────────────────────────────────────────────
function transpose(d) {
  semitonesOffset = ((semitonesOffset + d) % 12 + 12) % 12;
  const flat = useFlat(semitonesOffset, originalTom);

  // Retranspõe sempre a partir do original
  document.querySelectorAll('.ch, .co').forEach(el => {
    const orig = el.dataset.orig || el.textContent;
    el.textContent = transposeChordLine(orig, semitonesOffset, flat);
  });

  // Atualiza tom e indicador no header
  const tomEl    = document.getElementById('hdrTom');
  const labelEl  = document.getElementById('hdrTomLabel');
  if (tomEl) {
    const idx = noteIndex(originalTom);
    if (idx >= 0) {
      const newIdx = ((idx + semitonesOffset) % 12 + 12) % 12;
      const newTom = flat ? FLAT[newIdx] : SHARP[newIdx];
      tomEl.textContent = newTom;
      tomEl.classList.add('ready');
    }
  }
  if (labelEl) {
    // Mostra delta: 0 em branco, positivo em verde, negativo em laranja
    const display = semitonesOffset > 6
      ? -(12 - semitonesOffset)   // ex: offset 11 = -1
      : semitonesOffset;          // ex: offset 2  = +2
    if (display === 0) {
      labelEl.textContent = '0';
      labelEl.className = 'hdr-tom-label delta-zero';
    } else if (display > 0) {
      labelEl.textContent = '+' + display;
      labelEl.className = 'hdr-tom-label delta-pos';
    } else {
      labelEl.textContent = display;
      labelEl.className = 'hdr-tom-label delta-neg';
    }
  }
}


// ── RESET TOM ────────────────────────────────────────────────────
function transposeReset() {
  semitonesOffset = 0;
  // Re-aplica com offset zero (restaura originais)
  document.querySelectorAll('.ch, .co').forEach(el => {
    el.textContent = el.dataset.orig || el.textContent;
  });
  const tomEl   = document.getElementById('hdrTom');
  const labelEl = document.getElementById('hdrTomLabel');
  if (tomEl) { tomEl.textContent = originalTom; tomEl.classList.add('ready'); }
  if (labelEl) {
    labelEl.textContent = '0';
    labelEl.className = 'hdr-tom-label delta-zero';
  }
}

// ── TECLADO ───────────────────────────────────────────────────────
function bindKeys() {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    switch(e.key) {
      case 'ArrowDown': case 'ArrowRight': nav(1);  break;
      case 'ArrowUp':   case 'ArrowLeft':  nav(-1); break;
      case '=': case '+': sz(1);  break;
      case '-': case '_': sz(-1); break;
      case 'f': case 'F': toggleFS(); break;
      case 'l': case 'L': toggleLyricsOnly(); break;
      case 'b': case 'B': transpose(-1); break;  // bemol
      case 's': case 'S': transpose(1);  break;  // sustenido
    }
  });
}


// ── SWIPE ─────────────────────────────────────────────────────────
function bindSwipe() {
  let tx = 0;
  document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend',   e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) nav(d > 0 ? 1 : -1);
  });
}

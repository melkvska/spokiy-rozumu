/* ==========================================================================
   widget.js — інтерактивний віджет «Конструктор дихальної сесії»
   Проєкт «Спокій розуму», лабораторна робота №11. Vanilla JavaScript, без jQuery.

   Формула:
     фаза (с)      = round(базова тривалість фази × темп)      темп: 1 або 1.25
     цикл (с)      = сума фаз техніки
     сесія (с)     = розминка (0 | 60) + цикли × цикл + заземлення (0 | 90)
   Обмеження: цикли — ціле число від 1 до 30.
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Конфігурація (бізнес-правила) ---------- */
  const CYCLES_MIN = 1;
  const CYCLES_MAX = 30;
  const WARMUP_SEC = 60;
  const GROUNDING_SEC = 90;
  const PACES = Object.freeze({ '1': 1, '1.25': 1.25 });
  const PACE_NAMES = Object.freeze({ '1': 'звичайний темп', '1.25': 'повільний темп' });
  const DEFAULT_TECHNIQUE = '478';

  const TECHNIQUES = Object.freeze({
    '478': { name: '4-7-8', phases: [['Вдих', 4], ['Затримка', 7], ['Видих', 8]] },
    box: { name: 'Квадратне 4-4-4-4', phases: [['Вдих', 4], ['Затримка', 4], ['Видих', 4], ['Пауза', 4]] },
    coherent: { name: 'Резонансне 5-5', phases: [['Вдих', 5], ['Видих', 5]] },
    calm: { name: 'Подовжений видих 4-6', phases: [['Вдих', 4], ['Видих', 6]] },
  });

  const MSG_RANGE = `Вкажіть кількість циклів від ${CYCLES_MIN} до ${CYCLES_MAX}.`;
  const MSG_INTEGER = `Введіть ціле число від ${CYCLES_MIN} до ${CYCLES_MAX}, наприклад 4.`;

  /* ---------- 2. DOM: шукаємо лише всередині віджета (ізоляція) ---------- */
  const root = document.getElementById('breath-planner');
  if (!root) return; // віджета немає на сторінці — тихо виходимо

  const q = (id) => root.querySelector(`#${id}`);
  const el = {
    form: q('bp-form'), technique: q('bp-technique'), hint: q('bp-technique-hint'),
    cycles: q('bp-cycles'), range: q('bp-cycles-range'), error: q('bp-cycles-error'),
    warmup: q('bp-warmup'), grounding: q('bp-grounding'),
    total: q('bp-total'), summary: q('bp-summary'), steps: q('bp-steps'),
    circle: q('bp-circle'), count: q('bp-count'), phase: q('bp-phase'), start: q('bp-start'),
  };
  const missing = Object.keys(el).filter((k) => !el[k]);
  if (missing.length) {
    console.warn(`[breath-planner] Віджет вимкнено: не знайдено елементи ${missing.join(', ')}`);
    return; // без критичного падіння решти сторінки
  }
  const paceInputs = root.querySelectorAll('input[name="pace"]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 3. Допоміжні функції ---------- */
  const formatTime = (sec) => {
    const s = Math.max(0, Math.round(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const pluralCycles = (n) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return `${n} цикл`;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} цикли`;
    return `${n} циклів`;
  };

  /** Перевірка кількості циклів. Повертає { ok, value, note } або { ok:false, message } */
  function parseCycles() {
    const input = el.cycles;
    if (input.validity.badInput) return { ok: false, message: MSG_INTEGER }; // напр. «-» чи «e»
    const raw = input.value.trim().replace(',', '.');
    if (raw === '') return { ok: false, message: MSG_RANGE };
    if (!/^-?\d+(\.\d+)?$/.test(raw)) return { ok: false, message: MSG_INTEGER }; // 1e3, +3, 0x10
    const num = Number(raw);
    if (!Number.isFinite(num)) return { ok: false, message: MSG_RANGE };
    const value = Math.round(num);
    if (value < CYCLES_MIN || value > CYCLES_MAX) return { ok: false, message: MSG_RANGE };
    return { ok: true, value, note: Number.isInteger(num) ? '' : `Дробове значення округлено до ${value}.` };
  }

  function getTechniqueKey() {
    const key = el.technique.value;
    if (Object.prototype.hasOwnProperty.call(TECHNIQUES, key)) return key;
    console.warn('[breath-planner] Невідома техніка, повертаю значення за замовчуванням');
    el.technique.value = DEFAULT_TECHNIQUE;
    return DEFAULT_TECHNIQUE;
  }

  function getPaceKey() {
    const checked = root.querySelector('input[name="pace"]:checked');
    return checked && Object.prototype.hasOwnProperty.call(PACES, checked.value) ? checked.value : '1';
  }

  /** Чиста функція розрахунку — не працює з DOM, тому її легко тестувати */
  function buildSession({ techniqueKey, cycles, paceKey, warmup, grounding }) {
    const t = TECHNIQUES[techniqueKey];
    const pace = PACES[paceKey];
    const phases = t.phases.map(([label, sec]) => [label, Math.round(sec * pace)]);
    const cycleSec = phases.reduce((sum, [, sec]) => sum + sec, 0);
    const total = (warmup ? WARMUP_SEC : 0) + cycles * cycleSec + (grounding ? GROUNDING_SEC : 0);
    return { t, phases, cycleSec, total, cycles, paceKey, warmup, grounding };
  }

  /* ---------- 4. Стани поля: помилка / норма ---------- */
  function showError(message) {
    el.cycles.setAttribute('aria-invalid', 'true');
    el.cycles.classList.add('border-red-500', 'bg-red-50');
    el.error.textContent = message;           // textContent — без innerHTML
    el.error.classList.replace('text-brand-700', 'text-red-700');
    el.error.classList.remove('hidden');
  }

  function showNote(note) {
    el.cycles.setAttribute('aria-invalid', 'false');
    el.cycles.classList.remove('border-red-500', 'bg-red-50');
    el.error.textContent = note;              // інформаційна підказка (округлення) — не червоним
    el.error.classList.replace('text-red-700', 'text-brand-700');
    el.error.classList.toggle('hidden', !note);
  }

  /* ---------- 5. Розрахунок і відображення ---------- */
  let session = null;

  function render() {
    const techniqueKey = getTechniqueKey();
    const t = TECHNIQUES[techniqueKey];
    const hint = `${t.phases.map(([l, s]) => `${l.toLowerCase()} ${s} с`).join(' · ')} — ${t.phases.reduce((a, [, s]) => a + s, 0)} секунд на цикл.`;
    el.hint.textContent = hint.charAt(0).toUpperCase() + hint.slice(1);

    const parsed = parseCycles();
    if (!parsed.ok) {
      session = null;
      showError(parsed.message);
      el.total.textContent = '—';
      el.summary.textContent = 'Виправте кількість циклів, щоб побачити тривалість.';
      el.steps.replaceChildren();
      el.start.disabled = true;
      return;
    }
    showNote(parsed.note);
    el.range.value = String(parsed.value);
    el.start.disabled = false;

    session = buildSession({
      techniqueKey, cycles: parsed.value, paceKey: getPaceKey(),
      warmup: el.warmup.checked, grounding: el.grounding.checked,
    });

    el.total.textContent = formatTime(session.total);
    el.summary.textContent = `${pluralCycles(session.cycles)} · ${t.name} · ${PACE_NAMES[session.paceKey]}`;

    const items = [];
    if (session.warmup) items.push('Розминка: розслабити плечі та щелепу — 1:00');
    items.push(`${t.name}: ${pluralCycles(session.cycles)} по ${session.cycleSec} с — ${formatTime(session.cycles * session.cycleSec)}`);
    if (session.grounding) items.push('Заземлення 5-4-3-2-1 — 1:30');
    el.steps.replaceChildren(...items.map((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
  }

  /* ---------- 6. Дихальний гід (один таймер, без накладання) ---------- */
  let timerId = null;
  let queue = [];

  function buildQueue(s) {
    const list = [];
    if (s.warmup) list.push({ label: 'Розминка: розслабте плечі та щелепу', sec: WARMUP_SEC, scale: 1 });
    for (let c = 1; c <= s.cycles; c += 1) {
      s.phases.forEach(([label, sec]) => {
        const scale = label === 'Вдих' ? 1.25 : label === 'Видих' ? 0.85 : null;
        list.push({ label: `${label} · цикл ${c} з ${s.cycles}`, sec, scale });
      });
    }
    if (s.grounding) list.push({ label: 'Заземлення: назвіть 5 речей, які бачите…', sec: GROUNDING_SEC, scale: 1 });
    return list;
  }

  function setCircle(scale, sec) {
    if (reduceMotion || scale === null) return;
    el.circle.style.transitionDuration = `${Math.max(1, sec)}s`;
    el.circle.style.transform = `scale(${scale})`;
  }

  function setButton(running) {
    el.start.setAttribute('aria-pressed', String(running));
    el.start.querySelector('i').className = running ? 'fa-solid fa-stop' : 'fa-solid fa-play';
    el.start.querySelector('span').textContent = running ? 'Зупинити' : 'Почати сесію';
  }

  function stopGuide(message = 'Готові, коли будете ви') {
    clearInterval(timerId);
    timerId = null;
    queue = [];
    setButton(false);
    el.count.textContent = '—';
    el.phase.textContent = message;
    el.circle.style.transform = 'scale(1)';
  }

  function nextStep() {
    const step = queue.shift();
    if (!step) { stopGuide('Сесію завершено. Як ви почуваєтеся?'); return; }
    let left = step.sec;
    el.phase.textContent = step.label;
    el.count.textContent = String(left);
    setCircle(step.scale, step.sec);
    clearInterval(timerId);
    timerId = setInterval(() => {
      left -= 1;
      if (left <= 0) { nextStep(); return; }
      el.count.textContent = String(left);
    }, 1000);
  }

  function toggleGuide() {
    if (timerId !== null) { stopGuide(); return; }
    render();
    if (!session) return;
    queue = buildQueue(session);
    setButton(true);
    nextStep();
  }

  /* ---------- 7. Події ---------- */
  const onParamsChange = () => {
    if (timerId !== null) stopGuide('Параметри змінено — сесію зупинено.');
    render();
  };

  el.cycles.addEventListener('input', onParamsChange);
  el.cycles.addEventListener('change', () => {            // після виходу з поля — нормалізуємо значення
    const parsed = parseCycles();
    if (parsed.ok && el.cycles.value !== String(parsed.value)) el.cycles.value = String(parsed.value);
  });
  el.range.addEventListener('input', () => { el.cycles.value = el.range.value; onParamsChange(); });
  el.technique.addEventListener('change', onParamsChange);
  el.warmup.addEventListener('change', onParamsChange);
  el.grounding.addEventListener('change', onParamsChange);
  paceInputs.forEach((r) => r.addEventListener('change', onParamsChange));
  el.form.addEventListener('submit', (e) => e.preventDefault()); // Enter у полі не перезавантажує сторінку
  el.start.addEventListener('click', toggleGuide);

  render();
})();

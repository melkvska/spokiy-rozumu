/* ==========================================================================
   validation.js — клієнтська валідація форми зворотного зв'язку
   Проєкт «Спокій розуму», лабораторна робота №9
   Стек: Vanilla JavaScript, без сторонніх бібліотек.
   ВАЖЛИВО: реального надсилання на сервер немає — після успішної перевірки
   показується модальне вікно «Демонстрація успішного надсилання».
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Регулярні вирази та конфігурація ---------- */

  // Ім'я: літери (латиниця, кирилиця, укр. Ґ/Є/І/Ї), апостроф, дефіс, пробіл; 2–50 символів
  const REGEX_NAME = /^[A-Za-zА-Яа-яЁёҐґЄєІіЇї'’ʼ\- ]{2,50}$/;

  // Email: локальна частина @ домен . зона (мін. 2 літери), без пробілів
  const REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  // Телефон: строго +380 і рівно 9 цифр, без пробілів, дужок, дефісів
  const REGEX_PHONE = /^\+380\d{9}$/;

  const MESSAGE_MIN = 10;
  const MESSAGE_MAX = 1000;

  // Tailwind-класи станів поля
  const STATE = {
    error: ['border-red-500', 'bg-red-50'],
    success: ['border-green-600', 'bg-green-50'],
    normal: ['border-gray-300', 'bg-white'],
  };

  /* ---------- 2. DOM-елементи ---------- */
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  const fields = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message'),
    agreement: document.getElementById('agreement'),
  };
  const submitBtn = document.getElementById('submitBtn');
  const counter = document.getElementById('messageCounter');
  const modal = document.getElementById('successModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalName = document.getElementById('modalName');

  // Поля, з якими користувач уже взаємодіяв (щоб не показувати помилки одразу)
  const touched = new Set();

  /* ---------- 3. Функції керування UI-станами ---------- */

  /** Показує помилку під полем: червона рамка, текст, aria-invalid="true" */
  function showError(input, message) {
    const errorEl = document.getElementById(`${input.id}Error`);
    input.classList.remove(...STATE.normal, ...STATE.success);
    if (input.type !== 'checkbox') input.classList.add(...STATE.error);
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;          // textContent, а не innerHTML — безпечно від XSS
    errorEl.classList.remove('hidden');
    return false;
  }

  /** Успішний стан: зелена рамка, помилку приховано, aria-invalid="false" */
  function showSuccess(input) {
    clearError(input);
    if (input.type !== 'checkbox') {
      input.classList.remove(...STATE.normal);
      input.classList.add(...STATE.success);
    }
    return true;
  }

  /** Повертає поле до нормального стану (без помилки й без «успіху») */
  function clearError(input) {
    const errorEl = document.getElementById(`${input.id}Error`);
    input.classList.remove(...STATE.error, ...STATE.success);
    input.classList.add(...STATE.normal);
    input.setAttribute('aria-invalid', 'false');
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  /* ---------- 4. Функції валідації окремих полів ---------- */

  function validateName() {
    const input = fields.username;
    const value = input.value.trim().replace(/\s+/g, ' ');
    if (value === '') return showError(input, "Вкажіть, будь ласка, ваше ім'я.");
    if (value.length < 2) return showError(input, "Ім'я має містити щонайменше 2 символи.");
    if (!REGEX_NAME.test(value)) return showError(input, "Ім'я може містити лише літери, пробіл, апостроф або дефіс.");
    return showSuccess(input);
  }

  function validateEmail() {
    const input = fields.email;
    const value = input.value.trim();
    if (value === '') return showError(input, 'Вкажіть електронну пошту.');
    if (!REGEX_EMAIL.test(value)) return showError(input, 'Введіть коректну адресу, наприклад user@gmail.com.');
    return showSuccess(input);
  }

  function validatePhone() {
    const input = fields.phone;
    const value = input.value.trim();
    if (value === '') return showError(input, 'Вкажіть номер телефону.');
    if (/[A-Za-zА-Яа-яЁёҐґЄєІіЇї]/.test(value)) return showError(input, 'Номер може містити лише цифри та знак + на початку.');
    if (!REGEX_PHONE.test(value)) return showError(input, 'Номер має бути у форматі +380XXXXXXXXX (9 цифр після +380).');
    return showSuccess(input);
  }

  function validateMessage() {
    const input = fields.message;
    const length = input.value.trim().length;
    if (length === 0) return showError(input, 'Напишіть ваше повідомлення.');
    if (length < MESSAGE_MIN) return showError(input, `Повідомлення занадто коротке: ${length} з ${MESSAGE_MIN} символів.`);
    if (length > MESSAGE_MAX) return showError(input, `Повідомлення не може бути довшим за ${MESSAGE_MAX} символів.`);
    return showSuccess(input);
  }

  function validateAgreement() {
    const input = fields.agreement;
    if (!input.checked) return showError(input, 'Щоб надіслати форму, потрібно погодитися з політикою конфіденційності.');
    return showSuccess(input);
  }

  const validators = {
    username: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
    agreement: validateAgreement,
  };

  /* ---------- 5. Обробка телефону (Edge Cases, окрема UX-функція) ----------
     Не змінює введення під час набору. Лише при виході з поля (blur)
     прибирає пробіли/дужки/дефіси і доповнює звичний формат до +380.
     Користувач бачить результат у полі, тому зміна зрозуміла. */
  function normalizePhone(raw) {
    const cleaned = raw.trim().replace(/[\s()\-.]/g, '');
    if (/^0\d{9}$/.test(cleaned)) return `+38${cleaned}`;     // 0501234567  → +380501234567
    if (/^380\d{9}$/.test(cleaned)) return `+${cleaned}`;      // 380501234567 → +380501234567
    return cleaned;                                            // усе інше лишаємо як є — правило перевірить RegEx
  }

  /* ---------- 6. Динамічна валідація: input + blur ---------- */
  Object.entries(fields).forEach(([name, input]) => {
    const validate = validators[name];

    // blur — фінальна перевірка поля, після неї поле вважається «торкнутим»
    input.addEventListener('blur', () => {
      if (name === 'phone' && input.value.trim() !== '') input.value = normalizePhone(input.value);
      if (name === 'agreement') return;          // чекбокс перевіряється на change
      if (input.value.trim() === '' && !touched.has(name)) return; // просто пройшли Tab-ом — без помилки
      touched.add(name);
      validate();
    });

    // input — оновлення стану, але лише після першої взаємодії
    input.addEventListener('input', () => {
      if (name === 'message') updateCounter();
      if (touched.has(name)) validate();
    });

    if (name === 'agreement') {
      input.addEventListener('change', () => { touched.add(name); validate(); });
    }
  });

  function updateCounter() {
    const length = fields.message.value.length;
    counter.textContent = `${length} / ${MESSAGE_MAX}`;
    counter.classList.toggle('text-red-700', length > MESSAGE_MAX);
  }

  /* ---------- 7. Submit: перевірка всіх полів ---------- */
  form.addEventListener('submit', (event) => {
    event.preventDefault();                       // реального надсилання немає
    if (submitBtn.disabled) return;               // захист від швидкого повторного натискання

    if (fields.phone.value.trim() !== '') fields.phone.value = normalizePhone(fields.phone.value);
    Object.keys(fields).forEach((name) => touched.add(name));

    // Запускаємо ВСІ перевірки (не зупиняємось на першій), щоб показати всі помилки
    const results = Object.keys(validators).map((name) => ({ name, ok: validators[name]() }));
    const firstInvalid = results.find((r) => !r.ok);

    if (firstInvalid) {
      fields[firstInvalid.name].focus();          // фокус на перше поле з помилкою
      return;
    }

    submitBtn.disabled = true;
    openModal(fields.username.value.trim().split(' ')[0]);
    form.reset();
    touched.clear();
    Object.values(fields).forEach(clearError);
    updateCounter();
    setTimeout(() => { submitBtn.disabled = false; }, 1500);
  });

  /* ---------- 8. Доступне модальне вікно ---------- */
  let lastFocused = null;

  function openModal(name) {
    lastFocused = document.activeElement;
    modalName.textContent = name;                 // textContent — HTML з імені не виконується
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    modalTitle.focus();
    document.addEventListener('keydown', onModalKeydown);
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    document.removeEventListener('keydown', onModalKeydown);
    (lastFocused && document.contains(lastFocused) ? lastFocused : submitBtn).focus();
  }

  // Escape закриває вікно; Tab не виходить за межі вікна (focus trap)
  function onModalKeydown(event) {
    if (event.key === 'Escape') { closeModal(); return; }
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      else if (!modal.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    }
  }

  modal.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
})();

# Спокій розуму

Лендинг української смарт-платформи першої психологічної самодопомоги «Спокій розуму». Користувач обирає свій емоційний стан і за 1–2 кліки отримує коротку практику: дихальну вправу, техніку заземлення або відеорелакс. Без реєстрації та оплати.

Навчальний проєкт з дисципліни «Технології веб-розробки та дизайну» (ЛР №6–11), НУ «Львівська політехніка», ПП-24, Мелько В. І.

## Посилання

- GitHub Pages: https://melkvska.github.io/spokiy-rozumu/
- Netlify: https://spokiy-rozumu-lab7.netlify.app
- Vercel: https://spokiy-rozumu-6xl9.vercel.app

## ЛР №9 — форма зворотного зв'язку

- Секція `#feedback`: ім'я, email, телефон, тема, повідомлення, згода з політикою конфіденційності.
- Валідація на Vanilla JS (`assets/js/validation.js`): RegEx для імені, email і телефону `+380XXXXXXXXX`, динамічна перевірка на `input` / `blur`, перевірка всіх полів на `submit`.
- UI-стани normal / focus / error / success на Tailwind CSS, доступність: `label for`, `aria-describedby`, `aria-invalid`, клавіатурна навігація.
- Доступне модальне вікно (Escape, focus trap). Реального надсилання на сервер немає — це демонстрація після клієнтської валідації.

## ЛР №11 — інтерактивний віджет

- **Конструктор дихальної сесії** (`#breath-planner`): техніка (select), кількість циклів (number + range), темп (radio), розминка та заземлення (checkbox).
- Формула: `сесія = розминка (0/60 с) + цикли × сума фаз × темп + заземлення (0/90 с)`; цикли — ціле число 1–30.
- Захист від Edge Cases: порожнє поле, 0, від'ємні, дробові, `1e3`, надвеликі числа, підмінений select, відсутні DOM-елементи; виведення лише через `textContent`.
- Дихальний гід з одним таймером, кнопкою «Зупинити» та `prefers-reduced-motion`. Логіка — `assets/js/widget.js` (IIFE, без глобальних змінних).

## ЛР №10 — JS-плагіни через CDN

- **Swiper.js 11** — слайдер відгуків `#reviews`: 6 слайдів, loop, autoplay 3,5 с з паузою при наведенні, стрілки, клікабельна пагінація, брейкпоінти 1 / 2 / 3 слайди, кнопка зупинки прокрутки.
- **Fancybox 5** — галерея `#gallery` «Простір спокою» з графіки ЛР №3: один альбом `data-fancybox="calm-gallery"`, ефект fade, зум до 300 %, мініатюри.
- **Typed.js 2** — ефект друкування тексту в Hero.
- Ініціалізація — `assets/js/plugins.js`; з `prefers-reduced-motion` автоанімації вимикаються.

## Стек

- HTML5 (семантична розмітка, WCAG 2.2 AA)
- Tailwind CSS (CDN) + власний `css/style.css` з дизайн-токенами
- Font Awesome 6, Google Fonts (Lora, Nunito Sans)
- Вбудоване YouTube-відео та Google Maps в адаптивних контейнерах `aspect-ratio`

## Структура

```
spokiy-rozumu/
├── index.html          # лендинг: Header, Hero, Переваги, Практики, Про нас, Відео, CTA, Контакти, Footer
├── css/style.css       # фон, токени медіа (:root), reduced-motion
├── assets/js/validation.js  # валідація форми зворотного зв'язку
├── assets/js/plugins.js     # Swiper, Fancybox, Typed.js (ЛР №10)
├── assets/js/widget.js      # конструктор дихальної сесії (ЛР №11)
├── assets/gallery/          # зображення галереї (графіка з ЛР №3)
└── assets/
    ├── images/         # logo.svg, hero-calm.webp, about-calm.webp
    └── icons/          # benefit-1..3.webp (іконки з ЛР №3)
```

## Локальний запуск

```bash
git clone https://github.com/melkvska/spokiy-rozumu.git
cd spokiy-rozumu
# відкрити index.html у браузері або через Live Server у VS Code
```

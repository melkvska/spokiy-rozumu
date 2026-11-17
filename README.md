# Спокій розуму

Лендинг української смарт-платформи першої психологічної самодопомоги «Спокій розуму». Користувач обирає свій емоційний стан і за 1–2 кліки отримує коротку практику: дихальну вправу, техніку заземлення або відеорелакс. Без реєстрації та оплати.

Навчальний проєкт з дисципліни «Технології веб-розробки та дизайну» (ЛР №6–8), НУ «Львівська політехніка», ПП-24, Мелько В. І.

## Посилання

- GitHub Pages: https://melkvska.github.io/spokiy-rozumu/
- Netlify: https://spokiy-rozumu-lab7.netlify.app
- Vercel: https://spokiy-rozumu-6xl9.vercel.app

## ЛР №9 — форма зворотного зв'язку

- Секція `#feedback`: ім'я, email, телефон, тема, повідомлення, згода з політикою конфіденційності.
- Валідація на Vanilla JS (`assets/js/validation.js`): RegEx для імені, email і телефону `+380XXXXXXXXX`, динамічна перевірка на `input` / `blur`, перевірка всіх полів на `submit`.
- UI-стани normal / focus / error / success на Tailwind CSS, доступність: `label for`, `aria-describedby`, `aria-invalid`, клавіатурна навігація.
- Доступне модальне вікно (Escape, focus trap). Реального надсилання на сервер немає — це демонстрація після клієнтської валідації.

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

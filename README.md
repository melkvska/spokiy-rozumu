# Спокій розуму

Лендинг української смарт-платформи першої психологічної самодопомоги «Спокій розуму». Користувач обирає свій емоційний стан і за 1–2 кліки отримує коротку практику: дихальну вправу, техніку заземлення або відеорелакс. Без реєстрації та оплати.

Навчальний проєкт з дисципліни «Технології веб-розробки та дизайну» (ЛР №6–8), НУ «Львівська політехніка», ПП-24, Мелько В. І.

## Посилання

- GitHub Pages: https://melkvska.github.io/spokiy-rozumu/
- Netlify: https://spokiy-rozumu-lab7.netlify.app

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

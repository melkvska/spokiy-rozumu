/** Конфігурація Tailwind CSS — дизайн-система «Спокій розуму» (ЛР №4).
 *  ЛР №12: Play CDN замінено статичним css/tailwind.css, згенерованим з цієї конфігурації.
 *  Перегенерація: npx tailwindcss@3.4 -i css/tailwind.input.css -o css/tailwind.css --minify */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f0f6f8', 100: '#e1edf1', 200: '#c3dbe3', 500: '#4a829b', 600: '#3b6b80', 700: '#2f5567', 800: '#254453', 900: '#1b323e' },
        sos: { DEFAULT: '#e55b5b', hover: '#d14949', dark: '#b93a3a' },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Lora', 'Georgia', 'serif'],
      },
      maxWidth: { container: '1140px' },
    },
  },
  // класи станів, які JavaScript додає динамічно (validation.js, widget.js, меню, модальне вікно)
  safelist: ['border-red-500', 'bg-red-50', 'border-green-600', 'bg-green-50', 'ring-red-100', 'ring-green-100', 'flex', 'hidden', 'overflow-hidden', 'text-red-700', 'text-brand-700'],
};

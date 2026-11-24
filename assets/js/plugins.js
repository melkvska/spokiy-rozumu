/* ==========================================================================
   plugins.js — ініціалізація JS-плагінів (Vanilla JS, без jQuery)
   Проєкт «Спокій розуму», лабораторна робота №10
   Бібліотеки підключені через CDN jsDelivr у index.html:
     Swiper 11  — слайдер відгуків
     Fancybox 5 — галерея-лайтбокс «Простір спокою»
     Typed.js 2 — ефект друкування тексту в Hero
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Користувачі з налаштуванням «зменшити рух» не отримують автоанімацій (WCAG 2.3.3)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Swiper.js — слайдер відгуків ---------- */
  if (window.Swiper && document.querySelector('.reviews-swiper')) {
    const reviewsSwiper = new Swiper('.reviews-swiper', {
      loop: true,
      spaceBetween: 24,
      grabCursor: true,
      autoplay: reduceMotion ? false : {
        delay: 3500,                 // гортання кожні 3,5 с
        disableOnInteraction: false, // після свайпу автоплей продовжується
        pauseOnMouseEnter: true,     // зупинка при наведенні миші
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,             // клікабельні крапки
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      keyboard: { enabled: true, onlyInViewport: true }, // стрілки клавіатури
      a11y: {
        prevSlideMessage: 'Попередній відгук',
        nextSlideMessage: 'Наступний відгук',
        paginationBulletMessage: 'Перейти до відгуку {{index}}',
        slideLabelMessage: 'Відгук {{index}} з {{slidesLength}}',
      },
      breakpoints: {
        320: { slidesPerView: 1 },   // мобільні
        768: { slidesPerView: 2 },   // планшети
        1024: { slidesPerView: 3 },  // десктопи
      },
    });

    // Кнопка «Зупинити / Продовжити прокрутку» (WCAG 2.2.2 — керування рухомим вмістом)
    const toggle = document.getElementById('reviewsToggle');
    if (toggle) {
      const setState = (paused) => {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.querySelector('i').className = paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
        toggle.querySelector('span').textContent = paused ? 'Продовжити прокрутку' : 'Зупинити прокрутку';
      };
      if (reduceMotion || !reviewsSwiper.autoplay) { setState(true); }
      toggle.addEventListener('click', () => {
        if (reviewsSwiper.autoplay.running) { reviewsSwiper.autoplay.stop(); setState(true); }
        else { reviewsSwiper.autoplay.start(); setState(false); }
      });
    }
  }

  /* ---------- 2. Fancybox v5 — галерея «Простір спокою» ---------- */
  if (window.Fancybox) {
    // Зв'язування плагіна з data-атрибутом: усі елементи з однаковим значенням → один альбом
    Fancybox.bind('[data-fancybox="calm-gallery"]', {
      Carousel: { transition: 'fade' },       // плавне згасання між фото
      Images: { zoom: true, Panzoom: { maxScale: 3 } }, // зум до 300 %
      Thumbs: { type: 'classic' },            // мініатюри внизу
      Toolbar: {
        display: { left: ['infobar'], middle: ['zoomIn', 'zoomOut'], right: ['slideshow', 'thumbs', 'close'] },
      },
      l10n: {
        CLOSE: 'Закрити', NEXT: 'Далі', PREV: 'Назад',
        ZOOMIN: 'Збільшити', ZOOMOUT: 'Зменшити',
        TOGGLE_SLIDESHOW: 'Слайдшоу', TOGGLE_THUMBS: 'Мініатюри',
      },
    });
  }

  /* ---------- 3. Typed.js — друкування тексту в Hero ---------- */
  const typedEl = document.getElementById('typed-text');
  if (window.Typed && typedEl && !reduceMotion) {
    typedEl.textContent = '';
    new Typed('#typed-text', {
      strings: [
        'Дихальна вправа за 1 хвилину.',
        'Техніка заземлення 5-4-3-2-1.',
        'Аудіо-релакс перед сном.',
      ],
      typeSpeed: 50,   // швидкість друкування, мс на символ
      backSpeed: 30,   // швидкість стирання
      backDelay: 1800, // пауза перед стиранням
      loop: true,      // зациклення
    });
  }
});

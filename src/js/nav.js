// ─── Мобильное меню в шапке ───
// На широких экранах ссылки видны всегда, кнопка-бургер скрыта стилями,
// поэтому обработчики ниже там просто не срабатывают.
import { header, nav, navToggle } from './dom.js';

function setOpen(open) {
  nav.classList.toggle('nav--open', open);
  navToggle.setAttribute('aria-expanded', open);
}

export function initNav() {
  navToggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('nav--open'));
  });

  // Ссылки ведут на якоря этой же страницы — после перехода меню закрываем,
  // иначе оно осталось бы висеть поверх раздела, к которому мы прокрутились
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      setOpen(false);
    }
  });

  // Клик мимо шапки закрывает меню. Клик по самой кнопке сюда тоже дойдёт,
  // но он внутри header — иначе меню закрывалось бы сразу после открытия.
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      setOpen(false);
      navToggle.focus(); // возвращаем фокус на кнопку, а не теряем на body
    }
  });
}

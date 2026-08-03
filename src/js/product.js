// ─── Окно товара: крупное изображение ───
// Открывается кликом по карточке каталога — везде, кроме кнопки «В корзину»:
// она остаётся быстрым действием и окно не открывает.
import { PRODUCTS } from './data.js';
import { esc } from './utils.js';
import { SPRITE, grid, productModal, productOverlay, productInner, productClose } from './dom.js';

let lastFocused = null;
let hideTimer = null; // отложенное hidden, пока идёт анимация закрытия

const FOCUSABLE = 'a[href], button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function render(p) {
  // Фото занимает окно целиком, рисованная иллюстрация — с полями на подложке
  productInner.classList.toggle('product__inner--photo', Boolean(p.photo));
  const name = esc(p.name);
  productInner.innerHTML = p.photo
    ? `<img class="product__photo" src="${ esc(p.photo) }" alt="${ name }">`
    : `<svg class="product__illustration" viewBox="0 0 200 150" role="img" aria-label="${ name }"><use href="${ SPRITE }#i-${ esc(p.img) }"/></svg>`;
}

// aria-modal обещает, что фокус заперт внутри — держим слово
function keepFocusInside(e) {
  const items = [...productModal.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
  if (!items.length) {
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  if (!productModal.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function open(p) {
  clearTimeout(hideTimer); // отменяем отложенное скрытие от прошлого закрытия
  render(p);
  // Названия в окне больше нет, поэтому имя диалогу даём атрибутом —
  // иначе скринридер объявит его безымянным
  productModal.setAttribute('aria-label', p.name);
  productModal.hidden = false;
  productOverlay.hidden = false;
  productModal.getBoundingClientRect(); // форсируем перерасчёт ради transition
  productModal.classList.add('product--open');
  productOverlay.classList.add('product-overlay--open');
  document.body.classList.add('no-scroll');
  lastFocused = document.activeElement;
  productClose.focus();
}

function close() {
  productModal.classList.remove('product--open');
  productOverlay.classList.remove('product-overlay--open');
  document.body.classList.remove('no-scroll');
  hideTimer = setTimeout(() => {
    productModal.hidden = true;
    productOverlay.hidden = true;
  }, 250);
  if (lastFocused) {
    lastFocused.focus();
  }
}

export function initProduct() {
  grid.addEventListener('click', (e) => {
    // Кнопка «В корзину» — быстрое действие, окно по ней не открываем
    if (e.target.closest('[data-add]')) {
      return;
    }
    // С клавиатуры фокус попадает на изображение-кнопку, мышью удобно
    // ткнуть в любое место карточки — принимаем оба варианта
    const card = e.target.closest('.card');
    if (!card) {
      return;
    }
    const p = PRODUCTS.find((x) => x.id === +card.dataset.id);
    if (p) {
      open(p);
    }
  });

  productClose.addEventListener('click', close);
  productOverlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (!productModal.classList.contains('product--open')) {
      return;
    }
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Tab') {
      keepFocusInside(e);
    }
  });
}

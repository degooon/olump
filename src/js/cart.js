// ─── Корзина: выезжающая панель, счётчик, оформление заказа ───
import { PRODUCTS, COLOR_HEX } from './data.js';
import { fmt, smooth } from './utils.js';
import { cart, saveCart, ORDER_PHONE } from './state.js';
import {
  grid, cartCount, cartDrawer, cartOverlay, cartItems, cartEmpty,
  cartFoot, cartTotal, cartOrder, cartOpenBtn, cartClose, cartToCatalog, catalog,
} from './dom.js';

let lastFocused = null;
let hideTimer = null; // отложенное hidden при закрытии панели

// Обновляет вид кнопки «В корзину» / «В корзине» в карточке каталога
function setAddBtnState(btn, inCart) {
  btn.classList.toggle('in', inCart);
  btn.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${ inCart ? 'i-check' : 'i-bag' }"/></svg>${ inCart ? 'В корзине' : 'В корзину'}`;
}

function openCart() {
  // Отменяем отложенное скрытие: без этого таймер только что закрытой панели
  // спрятал бы уже открытую заново корзину
  clearTimeout(hideTimer);
  renderCart();
  cartDrawer.hidden = false;
  cartOverlay.hidden = false;
  cartDrawer.getBoundingClientRect(); // форсируем перерасчёт, чтобы transition сработал
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.classList.add('no-scroll');
  lastFocused = document.activeElement;
  cartClose.focus();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.classList.remove('no-scroll');
  hideTimer = setTimeout(() => {
    cartDrawer.hidden = true; cartOverlay.hidden = true;
  }, 300);
  if (lastFocused) {
    lastFocused.focus();
  }
}

// Строка товара в панели
function cartItemHTML(p, qty) {
  return `
  <div class="ci" data-id="${p.id}">
    <div class="ci__thumb" style="--tint:${COLOR_HEX[p.color]}">
      ${p.photo
    ? `<img src="${p.photo}" alt="">`
    : `<svg viewBox="0 0 200 150" aria-hidden="true"><use href="#i-${p.img}"/></svg>`}
    </div>
    <div>
      <p class="ci__name">${p.name}</p>
      <span class="ci__unit">${fmt(p.price)} за шт.</span>
      <div class="ci__row">
        <span class="qty">
          <button type="button" data-act="dec" aria-label="Уменьшить количество" ${qty <= 1 ? 'disabled' : ''}>−</button>
          <output aria-live="polite">${qty}</output>
          <button type="button" data-act="inc" aria-label="Увеличить количество">+</button>
        </span>
        <b class="ci__sum">${fmt(p.price * qty)}</b>
      </div>
    </div>
    <button class="ci__rm" type="button" data-act="rm" aria-label="Убрать ${p.name} из корзины">
      <svg class="icon" aria-hidden="true"><use href="#i-x"/></svg>
    </button>
  </div>`;
}

function renderCart() {
  const rows = [...cart.entries()].map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return cartItemHTML(p, qty);
  });
  cartItems.innerHTML = rows.join('');
  const empty = cart.size === 0;
  cartItems.style.display = empty ? 'none' : '';
  cartEmpty.classList.toggle('show', empty);
  cartFoot.style.display = empty ? 'none' : '';
  cartTotal.textContent = fmt(totalSum());
}

// Сумма заказа по текущей корзине
function totalSum() {
  let total = 0;
  cart.forEach((qty, id) => {
    total += PRODUCTS.find((x) => x.id === id).price * qty;
  });
  return total;
}

// Точечно обновляет строку панели: количество, сумму и доступность «−».
// Полный renderCart здесь нельзя: он пересоздаёт кнопку под фокусом.
function updateRow(row, qty) {
  const p = PRODUCTS.find((x) => x.id === +row.dataset.id);
  const dec = row.querySelector('[data-act="dec"]');
  row.querySelector('output').textContent = qty;
  row.querySelector('.ci__sum').textContent = fmt(p.price * qty);
  dec.disabled = qty <= 1;
  if (dec.disabled && document.activeElement === dec) {
    row.querySelector('[data-act="inc"]').focus(); // не бросаем фокус на body
  }
}

// Счётчик в шапке = суммарное количество штук
function updateCartCount() {
  let n = 0;
  cart.forEach((q) => {
    n += q;
  });
  cartCount.textContent = n;
  cartCount.hidden = n === 0;
}

// ─── Инициализация: события корзины ───
export function initCart() {
  // Кнопка «В корзину» в карточках каталога
  grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (!addBtn) {
      return;
    }
    const id = +addBtn.dataset.add;
    if (cart.has(id)) {
      cart.delete(id);
    } else {
      cart.set(id, 1);
    }
    saveCart();
    setAddBtnState(addBtn, cart.has(id));
    updateCartCount();
  });

  // Клики внутри панели: плюс/минус/убрать
  cartItems.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) {
      return;
    }
    const row = btn.closest('.ci');
    const id = +row.dataset.id;
    const act = btn.dataset.act;

    if (act === 'rm') {
      cart.delete(id);
      saveCart();
      const gridBtn = grid.querySelector(`[data-add="${ id }"]`);
      if (gridBtn) {
        setAddBtnState(gridBtn, false);
      }
      renderCart();
      updateCartCount();
      return;
    }

    // inc/dec: обновляем строку точечно, без полной перерисовки панели
    const qty = Math.max(1, cart.get(id) + (act === 'inc' ? 1 : -1));
    cart.set(id, qty);
    saveCart();
    updateRow(row, qty);
    cartTotal.textContent = fmt(totalSum());
    updateCartCount();
  });

  // Оформление: собираем текст заказа и открываем WhatsApp
  cartOrder.addEventListener('click', () => {
    if (!cart.size) {
      return;
    }
    const lines = [...cart.entries()].map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return `• ${ p.name } — ${ qty } шт. × ${ fmt(p.price)}`;
    });
    let total = 0;
    cart.forEach((qty, id) => {
      total += PRODUCTS.find((x) => x.id === id).price * qty;
    });
    const text = `Здравствуйте! Заказ с сайта «Олимп»:\n${ lines.join('\n') }\nИтого: ${ fmt(total)}`;
    // noopener: не отдаём новой вкладке window.opener (reverse tabnabbing)
    window.open(`https://wa.me/${ ORDER_PHONE }?text=${ encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  cartOpenBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  cartToCatalog.addEventListener('click', () => {
    closeCart();
    catalog.scrollIntoView({ behavior: smooth });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cartDrawer.hidden) {
      closeCart();
    }
  });

  // Корзина могла восстановиться из localStorage — сразу показываем счётчик
  // (кнопки карточек уже верные: render() в initCatalog читает cart)
  updateCartCount();
}

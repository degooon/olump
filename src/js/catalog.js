// ─── Каталог: фильтрация, карточки, отрисовка сетки ───
import { PRODUCTS, CAT_LABEL, COLOR_HEX } from './data.js';
import { fmt, smooth } from './utils.js';
import { cart, favs } from './state.js';
import {
  grid, emptyEl, emptyReset, countEl,
  form, range, rangeOut, sortSel,
  catalog, filtersToggle, filtersPanel,
} from './dom.js';

// ─── Состояние фильтров читаем прямо из формы ───
function getState() {
  const data = new FormData(form);
  return {
    cat:    data.get('cat') || 'all',
    q:      (data.get('q') || '').trim().toLowerCase(),
    max:    +data.get('max'),
    colors: new Set(data.getAll('color')),
    mats:   new Set(data.getAll('mat')),
    stock:  data.get('stock') === 'on',
    sort:   sortSel.value,
  };
}

// ─── Главная логика: один filter с шестью условиями ───
function filtered() {
  const s = getState();
  const list = PRODUCTS.filter((p) =>
    (s.cat === 'all' || p.cat === s.cat) &&
    p.price <= s.max &&
    (!s.colors.size || s.colors.has(p.color)) &&
    (!s.mats.size || s.mats.has(p.mat)) &&
    (!s.stock || p.stock) &&
    (!s.q || p.name.toLowerCase().includes(s.q))
  );
  switch (s.sort) {
    case 'asc': list.sort((a, b) => a.price - b.price); break;
    case 'desc': list.sort((a, b) => b.price - a.price); break;
    case 'new': list.sort((a, b) => (b.isNew - a.isNew) || (b.pop - a.pop)); break;
    default: list.sort((a, b) => b.pop - a.pop);
  }
  return list;
}

// ─── Шаблон карточки ───
function badge(p) {
  if (p.old) {
    return `<span class="badge badge--sale">−${ Math.round((1 - p.price / p.old) * 100) }%</span>`;
  }
  if (p.isNew) {
    return '<span class="badge badge--new">Новинка</span>';
  }
  if (p.pop >= 88) {
    return '<span class="badge">Хит</span>';
  }
  return '';
}

function cardHTML(p, i) {
  const inCart = cart.has(p.id);
  const isFav = favs.has(p.id);
  const addBtn = p.stock
    ? `<button class="add${inCart ? ' in' : ''}" type="button" data-add="${p.id}">
         <svg class="icon" aria-hidden="true"><use href="#${inCart ? 'i-check' : 'i-bag'}"/></svg>
         ${inCart ? 'В корзине' : 'В корзину'}
       </button>`
    : '<button class="add" type="button" disabled>Нет в наличии</button>';
  // Товары с реальным фото показывают его вместо рисованной иллюстрации
  const media = p.photo
    ? `<img class="card__photo" src="${p.photo}" alt="${p.name}" loading="lazy">`
    : `<svg viewBox="0 0 200 150" role="img" aria-label="${p.name}"><use href="#i-${p.img}"/></svg>`;
  return `
  <article class="card" style="--tint:${COLOR_HEX[p.color]};animation-delay:${Math.min(i * 45, 360)}ms">
    <div class="card__media${p.photo ? ' card__media--photo' : ''}">
      <div class="card__badges">${badge(p)}</div>
      <button class="fav" type="button" data-fav="${p.id}" aria-pressed="${isFav}" aria-label="В избранное: ${p.name}">
        <svg class="icon" aria-hidden="true"><use href="#i-heart"/></svg>
      </button>
      ${media}
    </div>
    <div class="card__body">
      <span class="card__cat">${CAT_LABEL[p.cat]}</span>
      <h3 class="card__name">${p.name}</h3>
      <div class="card__row">
        <div class="price">
          <span class="price__now">${fmt(p.price)}</span>
          ${p.old ? `<s class="price__old">${ fmt(p.old) }</s>` : ''}
        </div>
        ${addBtn}
      </div>
    </div>
  </article>`;
}

// ─── Отрисовка ───
export function render() {
  const list = filtered();
  countEl.innerHTML = `Показано: <b>${ list.length }</b> из ${ PRODUCTS.length}`;
  grid.innerHTML = list.map(cardHTML).join('');
  const isEmpty = list.length === 0;
  grid.classList.toggle('hidden', isEmpty);
  emptyEl.classList.toggle('show', isEmpty);
}

// ─── Инициализация: события каталога + первый рендер ───
export function initCatalog() {
  form.addEventListener('input', () => {
    rangeOut.textContent = fmt(+range.value);
    render();
  });

  form.addEventListener('reset', () => {
    requestAnimationFrame(() => {
      rangeOut.textContent = fmt(+range.value);
      render();
    });
  });

  emptyReset.addEventListener('click', () => form.reset());

  sortSel.addEventListener('change', render);

  // Клик по карточке: избранное. Добавление в корзину — в модуле cart.js.
  grid.addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav]');
    if (!favBtn) {
      return;
    }
    const id = +favBtn.dataset.fav;
    if (favs.has(id)) {
      favs.delete(id);
    } else {
      favs.add(id);
    }
    favBtn.setAttribute('aria-pressed', favs.has(id));
  });

  // Быстрые категории под героем
  document.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const radio = form.querySelector(`input[name="cat"][value="${ btn.dataset.cat }"]`);
      if (radio) {
        radio.checked = true; render();
      }
      catalog.scrollIntoView({ behavior: smooth });
    });
  });

  // Фильтры на мобильных
  filtersToggle.addEventListener('click', () => {
    const open = filtersPanel.classList.toggle('open');
    filtersToggle.setAttribute('aria-expanded', open);
  });

  // Стартовое состояние
  rangeOut.textContent = fmt(+range.value);
  render();
}

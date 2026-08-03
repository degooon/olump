// ─── Лента быстрых категорий ───
// Собирает плитки из данных и управляет стрелками прокрутки. Полоса прокрутки
// спрятана, поэтому без стрелок с мышью ленту не пролистать: остаётся только
// Shift+колесо, о котором мало кто знает. Показываем их на любом устройстве и
// лишь тогда, когда лента действительно не помещается.
import { CATEGORIES } from './data.js';
import { smooth, esc } from './utils.js';
import { SPRITE, catsGrid, catsPrev, catsNext } from './dom.js';

// Небольшой запас: у дробных ширин scrollLeft почти никогда не достигает
// максимума точно, и стрелка «вперёд» осталась бы активной навсегда
const EDGE = 2;

// Плитка — кнопка: она меняет фильтр каталога, а не ведёт на отдельную
// страницу. Обработчик клика живёт в catalog.js: там форма фильтров.
function renderTiles() {
  catsGrid.innerHTML = CATEGORIES.map((c) => `
    <button class="cat reveal" type="button" data-cat="${ esc(c.id) }">
      <svg class="cat__icon" viewBox="0 0 200 150" aria-hidden="true"><use href="${ SPRITE }#i-${ esc(c.icon) }"/></svg>
      <span class="cat__label">${ esc(c.label) }</span>
    </button>`).join('');
}

function update() {
  const max = catsGrid.scrollWidth - catsGrid.clientWidth;
  const scrollable = max > EDGE;

  catsPrev.hidden = !scrollable;
  catsNext.hidden = !scrollable;
  if (!scrollable) {
    return;
  }
  catsPrev.disabled = catsGrid.scrollLeft <= EDGE;
  catsNext.disabled = catsGrid.scrollLeft >= max - EDGE;
}

function scrollBy(direction) {
  // Прокручиваем почти на экран, оставляя часть видимой — так понятнее,
  // что список продолжается, а не подменился целиком
  catsGrid.scrollBy({ left: direction * catsGrid.clientWidth * 0.8, behavior: smooth });
}

export function initCats() {
  renderTiles();

  catsPrev.addEventListener('click', () => scrollBy(-1));
  catsNext.addEventListener('click', () => scrollBy(1));
  catsGrid.addEventListener('scroll', update, { passive: true });

  // Ширина ленты меняется не только от размера окна: при смене категории
  // может измениться и раскладка, поэтому следим за самим элементом
  new ResizeObserver(update).observe(catsGrid);
  update();
}

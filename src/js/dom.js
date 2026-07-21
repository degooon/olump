// ─── Ссылки на элементы страницы ───
// Все обращения к DOM собраны здесь — так легко найти любой элемент.
// Модуль подключается через type="module" (defer), поэтому DOM уже готов.

// Каталог и фильтры
export const grid = document.getElementById('grid');
export const emptyEl = document.getElementById('empty');
export const emptyReset = document.getElementById('empty-reset');
export const countEl = document.getElementById('count');
export const form = document.getElementById('filters-form');
export const range = document.getElementById('price-range');
export const rangeOut = document.getElementById('price-out');
export const sortSel = document.getElementById('sort');
export const catalog = document.getElementById('catalog');
export const filtersToggle = document.getElementById('filters-toggle');
export const filtersPanel = document.getElementById('filters-panel');

// Корзина: счётчик в шапке и выезжающая панель
export const cartCount = document.getElementById('cart-count');
export const cartDrawer = document.getElementById('cart-drawer');
export const cartOverlay = document.getElementById('cart-overlay');
export const cartItems = document.getElementById('cart-items');
export const cartEmpty = document.getElementById('cart-empty');
export const cartFoot = document.getElementById('cart-foot');
export const cartTotal = document.getElementById('cart-total');
export const cartOrder = document.getElementById('cart-order');
export const cartOpenBtn = document.getElementById('cart-open');
export const cartClose = document.getElementById('cart-close');
export const cartToCatalog = document.getElementById('cart-to-catalog');

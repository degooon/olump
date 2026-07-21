// ─── Общее состояние приложения ───
// Эти структуры делят между собой каталог и корзина.
import { PRODUCTS } from './data.js';

// Ключ localStorage; версия в имени спасёт от старого формата при изменениях.
const CART_KEY = 'olimp-cart-v1';

const KNOWN_IDS = new Set(PRODUCTS.map((p) => p.id));

// Читает сохранённую корзину. localStorage может быть недоступен (приватный
// режим) или содержать мусор — тогда начинаем с пустой корзины. Записи с
// неизвестным id или кривым количеством отбрасываем.
function loadCart() {
  try {
    const entries = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return new Map(entries.filter(([id, qty]) => KNOWN_IDS.has(id) && Number.isInteger(qty) && qty > 0));
  } catch {
    // битые данные или нет доступа к хранилищу
    return new Map();
  }
}

export const cart = loadCart(); // id товара → количество
export const favs = new Set(); // id товаров в избранном

// Сохраняет корзину; вызывать после каждого изменения cart.
export function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify([...cart]));
  } catch {
    // приватный режим или переполненное хранилище — просто не сохраняем
  }
}

// Номер для приёма заказов в WhatsApp: формат 7XXXXXXXXXX, без «+» и пробелов.
// ЗАМЕНИ на реальный номер клиента перед выкладкой на хостинг.
export const ORDER_PHONE = '78000000000';

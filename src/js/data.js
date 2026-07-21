// ─── Данные каталога ───
// Товары, подписи категорий и цвета выкрасок карточек.
// Фото импортируем — Vite сам захеширует и оптимизирует их при сборке.
import divanZevsPhoto from '../img/cards/divan-krem-fon.webp';

export const PRODUCTS = [
  { id: 1, name: 'Диван «Гера»', cat: 'sofa', price: 78990, old: 92990, color: 'terra', mat: 'velour', stock: true, pop: 98, isNew: false, img: 'sofa' },
  { id: 2, name: 'Диван «Атлас»', cat: 'sofa', price: 64500, old: null, color: 'graphite', mat: 'fabric', stock: true, pop: 74, isNew: false, img: 'sofa' },
  { id: 3, name: 'Диван «Эос»', cat: 'sofa', price: 71200, old: null, color: 'olive', mat: 'fabric', stock: false, pop: 61, isNew: true, img: 'sofa' },
  { id: 4, name: 'Кресло «Арго»', cat: 'armchair', price: 24900, old: null, color: 'terra', mat: 'velour', stock: true, pop: 95, isNew: false, img: 'armchair' },
  { id: 5, name: 'Кресло «Ника»', cat: 'armchair', price: 19700, old: null, color: 'beige', mat: 'fabric', stock: true, pop: 68, isNew: false, img: 'armchair' },
  { id: 6, name: 'Кресло «Понт»', cat: 'armchair', price: 27300, old: null, color: 'graphite', mat: 'wood', stock: true, pop: 55, isNew: true, img: 'armchair' },
  { id: 7, name: 'Стол «Олимпия»', cat: 'table', price: 42000, old: null, color: 'beige', mat: 'wood', stock: true, pop: 90, isNew: false, img: 'table' },
  { id: 8, name: 'Стол «Ирида»', cat: 'table', price: 14800, old: null, color: 'graphite', mat: 'metal', stock: true, pop: 63, isNew: true, img: 'table' },
  { id: 9, name: 'Стол «Гелиос»', cat: 'table', price: 36400, old: 41900, color: 'beige', mat: 'wood', stock: false, pop: 58, isNew: false, img: 'table' },
  { id: 10, name: 'Стул «Эол»', cat: 'chair', price: 7900, old: null, color: 'beige', mat: 'wood', stock: true, pop: 72, isNew: false, img: 'chair' },
  { id: 11, name: 'Стул «Борей»', cat: 'chair', price: 9400, old: null, color: 'graphite', mat: 'metal', stock: true, pop: 66, isNew: true, img: 'chair' },
  { id: 12, name: 'Стул «Зефир»', cat: 'chair', price: 8600, old: null, color: 'terra', mat: 'velour', stock: true, pop: 81, isNew: false, img: 'chair' },
  { id: 13, name: 'Кровать «Селена»', cat: 'bed', price: 54300, old: null, color: 'beige', mat: 'fabric', stock: true, pop: 88, isNew: false, img: 'bed' },
  { id: 14, name: 'Кровать «Морфей»', cat: 'bed', price: 61800, old: null, color: 'graphite', mat: 'velour', stock: true, pop: 77, isNew: true, img: 'bed' },
  { id: 15, name: 'Шкаф «Аргус»', cat: 'storage', price: 48900, old: null, color: 'beige', mat: 'wood', stock: true, pop: 52, isNew: false, img: 'wardrobe' },
  { id: 16, name: 'Стеллаж «Гермес»', cat: 'storage', price: 21500, old: null, color: 'graphite', mat: 'metal', stock: true, pop: 70, isNew: false, img: 'shelf' },
  { id: 17, name: 'Торшер «Гестия»', cat: 'light', price: 12400, old: null, color: 'terra', mat: 'metal', stock: true, pop: 69, isNew: true, img: 'lamp' },
  { id: 18, name: 'Лампа «Фаэтон»', cat: 'light', price: 6900, old: null, color: 'olive', mat: 'metal', stock: false, pop: 49, isNew: false, img: 'lamp' },
  { id: 19, name: 'Диван «Зевс»', cat: 'sofa', price: 84900, old: null, color: 'graphite', mat: 'velour', stock: true, pop: 93, isNew: true, img: 'sofa', photo: divanZevsPhoto },
];

export const CAT_LABEL = { sofa: 'Диваны', armchair: 'Кресла', table: 'Столы', chair: 'Стулья', bed: 'Кровати', storage: 'Шкафы', light: 'Свет' };

export const COLOR_HEX = { graphite: '#4A4642', beige: '#D8C3A0', terra: '#C0653F', olive: '#8A8B67' };

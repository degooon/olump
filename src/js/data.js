// ─── Данные каталога ───
// Товары и категории берутся из разметки: WordPress печатает их одним блоком
//   <script type="application/json" id="catalog-data">…</script>
// Формат блока описан в docs/catalog-data.md — это договор между темой и
// фронтендом, менять его надо с обеих сторон сразу.
//
// Если блока нет (открыли просто index.html, собрали без WordPress) —
// работает набор ниже: это реальные товары склада с настоящими фотографиями,
// но без цен. Цены проставит владелец в админке WordPress.

// Все фотографии карточек разом. Забираем их пачкой, а не сорока импортами
// руками; Vite подставит адреса с хешами при сборке.
const FILES = import.meta.glob('../img/cards/*.webp', { eager: true, query: '?url', import: 'default' });

// Каждое фото заготовлено в трёх ширинах. У части исходников не хватило
// разрешения на 1600px — такого файла просто нет, и в srcset он не попадёт.
// В photo кладём средний размер: это то, что увидят браузеры постарше,
// не умеющие выбирать по srcset.
function shot(slug) {
  const found = [400, 800, 1600]
    .map((w) => [w, FILES[`../img/cards/${ slug }-${ w }.webp`]])
    .filter(([, url]) => url);
  if (!found.length) {
    return {};
  }
  const mid = found.find(([w]) => w === 800) ?? found[found.length - 1];
  return {
    photo: mid[1],
    srcset: found.map(([w, url]) => `${ url } ${ w }w`).join(', '),
  };
}

// id — код категории (он же в поле cat у товара), icon — имя иконки в спрайте.
// С id совпадает не всегда: шкафам подходит картинка гардероба, а отдельной
// иконки для кухонь в спрайте нет — взят стеллаж.
const DEMO_CATEGORIES = [
  { id: 'sofa', label: 'Диваны', icon: 'sofa' },
  { id: 'storage', label: 'Шкафы', icon: 'wardrobe' },
  { id: 'table', label: 'Столы', icon: 'table' },
  { id: 'bed', label: 'Кровати', icon: 'bed' },
  { id: 'kitchen', label: 'Кухни', icon: 'shelf' },
  { id: 'dresser', label: 'Комоды', icon: 'dresser' },
];

// Товары: слаг фотографии, название, категория.
// Порядок в списке — это и есть порядок в выдаче «По популярности».
// Выше поставлены снимки на однотонном фоне: они выглядят каталожно,
// и с них приятнее начинать. Названия описательные — их проставит
// по-своему владелец в админке.
const ITEMS = [
  ['divan-19', 'Диван модульный графит', 'sofa'],
  ['divan-20', 'Диван угловой серый', 'sofa'],
  ['divan-13', 'Диван прямой голубой', 'sofa'],
  ['divan-15', 'Диван угловой сиреневый', 'sofa'],
  ['divan-14', 'Диван модульный оливковый', 'sofa'],
  ['divan-11', 'Диван модульный зелёный', 'sofa'],
  ['shkaf-04', 'Шкаф-купе белый', 'storage'],
  ['shkaf-05', 'Шкаф-купе трёхдверный', 'storage'],
  ['kuhnya-01', 'Кухня бежевая', 'kitchen'],
  ['kuhnya-02', 'Кухня зелёная', 'kitchen'],
  ['kuhnya-03', 'Кухня графит', 'kitchen'],
  ['shkaf-06', 'Шкаф в прихожую', 'storage'],
  ['stol-01', 'Стол керамика чёрный', 'table'],
  ['stol-02', 'Стол керамика белый', 'table'],
  ['stol-03', 'Стол керамика светлый', 'table'],
  ['stol-06', 'Стол керамика мрамор', 'table'],
  ['stol-04', 'Обеденная группа белая', 'table'],
  ['stol-05', 'Обеденная группа бежевая', 'table'],
  ['divan-05', 'Диван угловой синий', 'sofa'],
  ['divan-07', 'Диван угловой каретная стяжка', 'sofa'],
  ['divan-09', 'Диван угловой серо-бежевый', 'sofa'],
  ['divan-03', 'Диван угловой с креслами', 'sofa'],
  ['divan-06', 'Диван прямой синий велюр', 'sofa'],
  ['divan-10', 'Диван прямой коричневый велюр', 'sofa'],
  ['divan-01', 'Диван модульный рубчик', 'sofa'],
  ['divan-12', 'Диван трёхместный рубчик', 'sofa'],
  ['divan-16', 'Диван прямой синий', 'sofa'],
  ['divan-17', 'Диван прямой серый', 'sofa'],
  ['divan-18', 'Диван прямой светло-серый', 'sofa'],
  ['divan-08', 'Диван прямой бежевый', 'sofa'],
  ['divan-04', 'Диван прямой светлый', 'sofa'],
  ['divan-02', 'Диван-книжка светлый', 'sofa'],
  ['shkaf-07', 'Шкаф-купе зеркальный', 'storage'],
  ['shkaf-01', 'Шкаф-купе комбинированный', 'storage'],
  ['shkaf-03', 'Шкаф распашной светлый', 'storage'],
  ['shkaf-02', 'Шкаф распашной с антресолью', 'storage'],
  ['krovat-03', 'Кровать мягкая светлая', 'bed'],
  ['krovat-02', 'Кровать с изголовьем «веер»', 'bed'],
  ['krovat-01', 'Кровать с изголовьем «ракушка»', 'bed'],
  ['komod-01', 'Комод графит', 'dresser'],
  ['komod-02', 'Комод дуб с графитом', 'dresser'],
];

const ICON = Object.fromEntries(DEMO_CATEGORIES.map((c) => [c.id, c.icon]));

// price не указана намеренно: цен пока нет, карточка покажет «по запросу».
// Появятся в WordPress — придут вместе с остальными полями.
//
// pop — просто убывающий вес, повторяющий порядок списка. Держим его ниже
// порога плашки «Хит» (88): реальных данных о том, что берут чаще, у нас нет,
// а плашка на каждой карточке — уже не плашка.
const DEMO_PRODUCTS = ITEMS.map(([slug, name, cat], i) => ({
  id: 100 + i,
  name,
  cat,
  old: null,
  stock: true,
  pop: ITEMS.length - i,
  isNew: false,
  img: ICON[cat],
  ...shot(slug),
}));

// Читаем данные из разметки. Возвращаем null при любой неожиданности: сайт
// со старыми товарами лучше, чем пустая страница и ошибка в консоли. Каталог,
// который не удалось разобрать, — повод чинить тему, а не ронять витрину.
function fromPage() {
  const el = document.getElementById('catalog-data');
  if (!el) {
    return null;
  }
  try {
    const data = JSON.parse(el.textContent);
    const ok = Array.isArray(data.categories) && data.categories.length > 0 && Array.isArray(data.products);
    return ok ? data : null;
  } catch {
    return null;
  }
}

const page = fromPage();

export const CATEGORIES = page ? page.categories : DEMO_CATEGORIES;
export const PRODUCTS = page ? page.products : DEMO_PRODUCTS;

// Подпись по коду категории — для карточек. Не отдельный список, а срез
// CATEGORIES: разойтись с ним ему уже нечем.
export const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

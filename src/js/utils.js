// ─── Утилиты ───

// Форматирует число как цену в рублях: 78990 -> «78 990 ₽».
// Между числом и ₽ стоит неразрывный пробел (код U+00A0), чтобы они не
// переносились на разные строки.
export const fmt = (n) => `${n.toLocaleString('ru-RU')}\u00A0₽`;

// Режим прокрутки с учётом настройки ОС «уменьшить движение».
export const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

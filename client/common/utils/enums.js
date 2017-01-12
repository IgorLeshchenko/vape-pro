'use strict';

export const status = [
    { name: 'Все', value: 'all' },
    { name: 'Активные', value: 'true' },
    { name: 'Не Активные', value: 'false' }
];

export const suppliesStatuses = [
    { name: 'Новый', value: 'new' },
    { name: 'Доставляется', value: 'shipped' },
    { name: 'Получен', value: 'received' },
    { name: 'Отменен', value: 'declined' }
];

export const ordersStatuses = [
    { name: 'Новый', value: 'new' },
    { name: 'Подтвержден', value: 'approved' },
    { name: 'Завершен', value: 'received' },
    { name: 'Отменен', value: 'declined' }
];

export const paymentTypes = [
    { name: 'Наличный', value: 'cash' },
    { name: 'Безналичный', value: 'card' },
];

export const sortTypes = [
    { name: 'По Рейтингу', value: 'rating' },
    { name: 'От Дорогих к Дешевым', value: 'price-desc' },
    { name: 'От Дешевых к Дорогим', value: 'price-asc' },
    { name: 'По Имени - A-Z', value: 'name-asc' },
    { name: 'По Имени - Z-A', value: 'name-desc' },
];

export const containerProductsValueTypes = [
    { name: 'Текст', value: 'text' },
    { name: 'Цвет', value: 'color' },
];

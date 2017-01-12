'use strict';

// App imports:
import configs from '../../../configs/config.json';

const staticItems = [
    { name: 'gwt:property', value: 'locale=ru' },
    { name: 'robots', value: 'index, follow' },
    { name: 'author', value: 'Vape Pro' }
];
const commonShoppingItems = configs.client.seo.shoppingItems.join(', ');
const commonKeyWords = configs.client.seo.keywords.join(', ');

export const getLandingPage = () => ([
    ...staticItems,
    {
        name: 'title',
        value: `Интернет-магазин Vape Pro: ${commonShoppingItems}`
    },
    {
        name: 'description',
        value: `Интернет магазин vape-pro.com.ua ${commonShoppingItems}. Официальная гарантия. Доставка по всей Украине.`
    },
    {
        name: 'keywords',
        value: commonKeyWords
    }
]);

export const getContainerPage = (data) => {
    const { name, seoDescription } = data || {};
    const seoKeywords = name.split(' ').join(', ');

    return [
        ...staticItems,
        { name: 'title', value: `${name} | интернет магазин Vape Pro в Киеве: цена, отзывы, продажа.` },
        { name: 'description', value: seoDescription },
        { name: 'keywords', value: seoKeywords },
    ];
};

export const getContainersPage = (data) => {
    const { name, seoDescription, seoKeywords } = data || {};

    return [
        ...staticItems,
        { name: 'title', value: `${name} | интернет магазин Vape Pro в Киеве: цена, отзывы, продажа.` },
        { name: 'description', value: seoDescription },
        { name: 'keywords', value: seoKeywords },
    ];
};

export const getQAPage = () => ([
    ...staticItems,
    { name: 'title', value: `Вопросы и Ответы | интернет магазин Vape Pro в Киеве` },
    { name: 'description', value: `Вопросы и Ответы - интернет магазина vape-pro.com.ua` },
    { name: 'keywords', value: 'вопросы, ответы' },
]);

export const getAboutPage = () => ([
    ...staticItems,
    { name: 'title', value: `О Нас | интернет магазин Vape Pro в Киеве` },
    { name: 'description', value: 'О Нас - интернет магазин vape-pro.com.ua' },
    { name: 'keywords', value: 'о нас, о компании, история' },
]);

export const getContactsPage = () => ([
    ...staticItems,
    { name: 'title', value: `Контакты | Vape Pro | Время работы, Телефон, Почта` },
    { name: 'description', value: 'Контакты, Время работы, Телефон, Почта интернет магазина vape-pro.com.ua' },
    { name: 'keywords', value: 'Контакты, Время работы, Телефон' },
]);

export const getCheckoutPage = () => ([
    { name: 'robots', value: 'noindex, nofollow' },
    { name: 'title', value: `Оформление Заказа | интернет магазин Vape Pro в Киеве` }
]);

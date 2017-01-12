'use strict';

// App imports:
import configs from '../../../configs/config.json';
import { getHttpLink, getCdnLinkById } from '../../../client/common/helpers/httpLink.helper';

const commonShoppingItems = configs.client.seo.shoppingItems.join(', ');

export const getLandingPage = () => ([
    { name: 'card', value: 'summary' },
    { name: 'site', value: '@vape-pro' },
    { name: 'title', value: 'Интернет-магазин Vape Pro' },
    { name: 'image', value: getHttpLink(`/logo-500.png`) },
    { name: 'description', value: `Интернет-магазин Vape Pro: ${commonShoppingItems}` },
]);

export const getContainersPage = ({ name, seoDescription }) => ([
    { name: 'card', value: 'summary' },
    { name: 'site', value: '@vape-pro' },
    { name: 'title', value: name },
    { name: 'description', value: seoDescription },
]);

export const getContainerPage = ({ name, picture, description }) => ([
    { name: 'card', value: 'product' },
    { name: 'site', value: '@vape-pro' },
    { name: 'title', value: name },
    { name: 'image', value: getCdnLinkById(picture) },
    { name: 'description', value: description },
]);

export const getQAPage = () => ([

]);

export const getAboutPage = () => ([

]);

export const getContactsPage = () => ([

]);

export const getCheckoutPage = () => ([

]);

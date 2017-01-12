'use strict';

// App imports:
import configs from '../../../configs/config.json';
import { getHttpLink, getCdnLinkById } from '../../../client/common/helpers/httpLink.helper';

const commonShoppingItems = configs.client.seo.shoppingItems.join(', ');

export const getLandingPage = () => ([
    { name: 'fb:app_id', value: '1925379017683190' },
    { name: 'og:title', value: 'Интернет-магазин Vape Pro' },
    { name: 'og:type', value: 'website' },
    { name: 'og:description', value: `Интернет-магазин Vape Pro: ${commonShoppingItems}` },
    { name: 'og:url', value: getHttpLink(`/`) },
    { name: 'og:image', value: getHttpLink(`/logo-500.png`) },
]);

export const getContainersPage = ({ name, path }) => ([
    { name: 'fb:app_id', value: '1925379017683190' },
    { name: 'og:type', value: 'website' },
    { name: 'og:name', value: name },
    { name: 'og:link', value: getHttpLink(`/shop/d/${path}`) },
]);

export const getContainerPage = ({ path, picture, description }) => ([
    { name: 'fb:app_id', value: '1925379017683190' },
    { name: 'og:type', value: 'website' },
    { name: 'og:description', value: description },
    { name: 'og:url', value: getHttpLink(`/shop/p/${path}`) },
    { name: 'og:image', value: getCdnLinkById(picture) },
]);

export const getQAPage = () => ([

]);

export const getAboutPage = () => ([

]);

export const getContactsPage = () => ([

]);

export const getCheckoutPage = () => ([

]);

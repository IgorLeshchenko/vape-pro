'use strict';

// App imports:
import { getHttpLink } from '../../../client/common/helpers/httpLink.helper';

exports.getLandingPage = () => {
    return getHttpLink(`/`);
};

exports.getContainerPage = ({ path }) => {
    return getHttpLink(`/shop/p/${path}`);
};

exports.getContainersPage = ({ path }) => {
    return getHttpLink(`/shop/d/${path}`);
};

exports.getQAPage = () => {
    return getHttpLink(`/qa`);
};

exports.getAboutPage = () => {
    return getHttpLink(`/about`);
};

exports.getPaymentsAndDeliveriesPage = () => {
    return getHttpLink(`/payments-and-deliveries`);
};

exports.getContactsPage = () => {
    return getHttpLink(`/contacts`);
};

exports.getCheckoutPage = () => {
    return getHttpLink(`/checkout`);
};

'use strict';

// App Imports:
import configs from '../../../configs/config.json';

export const getHttpLink = (subPath) => {
    const { host, port } = configs.client;

    if (!port || port && port === 80) {
        return `https://${host}${subPath}`;
    } else {
        return `http://${host}:${port}${subPath}`;
    }
};

export const getCdnLink = (subPath) => {
    return getHttpLink(subPath);
};

export const getCdnLinkById = (image) => {
    const { _id } = image || {};

    if (_id) {
        return getCdnLink(`/uploads/${_id}/250.png`);
    } else {
        return getCdnLink(`/uploads/default/250.png`);
    }
};

export const getApiLink = (subPath) => {
    return getHttpLink(subPath);
};

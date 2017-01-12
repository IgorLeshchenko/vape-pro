'use strict';

// Third Party imports:
import { isUndefined, isNaN } from 'lodash';

export const get = (routeParams, filtersParams) => {
    const { data } = filtersParams;
    const { q, sortBy, priceMin, priceMax } = routeParams;
    const priceMinDefault = data.priceMin;
    const priceMaxDefault = data.priceMax;
    const params = [];

    if (q) {
        params.push(`q=${q}`);
    }

    if (sortBy && sortBy != 'rating') {
        params.push(`sortBy=${sortBy}`);
    }

    if (!isUndefined(priceMin) || !isUndefined(priceMax)) {
        const newPriceMin = parseInt(priceMin, 10);
        const newPriceMax = parseInt(priceMax, 10);

        if ((priceMin && priceMin != priceMinDefault) || (priceMax && priceMax != priceMaxDefault)) {
            params.push(`priceMin=${!isNaN(newPriceMin) ? newPriceMin : priceMinDefault}`);
            params.push(`priceMax=${!isNaN(newPriceMax) ? newPriceMax : priceMaxDefault}`);
        }
    }

    return params.join('&');
};

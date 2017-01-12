'use strict';

// Third Party imports:
import { each } from 'lodash';

// App Imports:
import { isNumber } from '../../helpers/validation.helper';

const validate = (data) => {
    const { products } = data;
    let isValid = true;
    let errors = {
        products: [],
        shippingTracking: [],
        shippingPrice: [],
        customsPrice: []
    };

    if (!products || !products.length) {
        errors.products.push({ error: 'В поставке должен быть минимум 1 товар' });
    } else {
        each(products, ({ amount, price }) => {
            if (!isNumber(amount)) {
                errors.products.push({ error: 'Количество товара не может быть пустым' });
            }

            if (!isNumber(price)) {
                errors.products.push({ error: 'Цена за товар не может быть пустой' });
            }
        });
    }

    each(errors, error => {
        if (error.length) {
            isValid = false;
        }
    });

    return { isValid, errors };
};

export default validate;

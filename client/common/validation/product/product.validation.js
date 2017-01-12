'use strict';

// Third Party imports:
import { each, isBoolean, isEmpty } from 'lodash';

// App Imports:
import { isNumber } from '../../helpers/validation.helper';

const validate = (data) => {
    const { name, type, price, amountAvailable, amountSold, gallery, characteristics } = data;
    let isValid = true;
    let errors = {
        name: [],
        type: [],
        price: [],
        amountAvailable: [],
        amountSold: [],
        gallery: [],
        characteristics: []
    };

    if (!name) {
        errors.name.push({ error: 'Обязательное поле' });
    }

    if (!type || !type.id || type == 'none' || type.id == 'none') {
        errors.type.push({ error: 'Тип Товара должен быть выбран' });
    }

    if (!isNumber(price)) {
        errors.price.push({ error: 'Обязательное поле' });
    }

    if (!isNumber(amountAvailable)) {
        errors.amountAvailable.push({ error: 'Обязательное поле' });
    }

    if (!isNumber(amountSold)) {
        errors.amountSold.push({ error: 'Обязательное поле' });
    }

    if (!gallery || !gallery.length) {
        errors.gallery.push({ error: 'Должно быть не меньше 1 изображения' });
    }

    each(characteristics, ({ value }) => {
        if (!isNumber(value) && !isBoolean(value) && isEmpty((value))) {
            errors.characteristics.push({ error: 'Значения характеристик не могут быть пустыми' });
        }
    });

    each(errors, error => {
        if (error.length) {
            isValid = false;
        }
    });

    return { isValid, errors };
};

export default validate;

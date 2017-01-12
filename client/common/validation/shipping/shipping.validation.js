'use strict';

// Third Party imports:
import { each, isEmpty } from 'lodash';

const validate = (data) => {
    const { name, payments, description } = data;
    let isValid = true;
    let errors = {
        name: [],
        payments: [],
        description: []
    };

    if (!name) {
        errors.name.push({ error: 'Обязательное поле' });
    }

    if (!payments || !payments.length) {
        errors.payments.push({ error: 'Должен быть минимум 1 способ оплаты' });
    }

    if (!description) {
        errors.description.push({ error: 'Обязательное поле' });
    }

    each(errors, error => {
        if (error.length) {
            isValid = false;
        }
    });

    return { isValid, errors };
};

export default validate;

'use strict';

// Third Party imports:
import { each } from 'lodash';

const validate = (data) => {
    const { name, type, description } = data;
    let isValid = true;
    let errors = {
        name: [],
        type: [],
        description: []
    };

    if (!name) {
        errors.name.push({ error: 'Обязательное поле' });
    }

    if (!type || type == 'none') {
        errors.type.push({ error: 'Обязательное поле' });
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

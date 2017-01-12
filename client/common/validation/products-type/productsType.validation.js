'use strict';

// Third Party imports:
import { each, isEmpty } from 'lodash';

const validate = (data) => {
    const { name, characteristics } = data;
    let isValid = true;
    let errors = {
        name: [],
        characteristics: []
    };

    if (!name) {
        errors.name.push({ error: 'Обязательное поле' });
    }

    if (!characteristics || !characteristics.length) {
        errors.characteristics.push({ error: 'Должна быть минимум одна характеристика' });
    } else {
        each(characteristics, ({ name }) => {
            if (!name || isEmpty(name)) {
                errors.characteristics.push({ error: 'Названия характеристик не могут быть пустыми' });
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

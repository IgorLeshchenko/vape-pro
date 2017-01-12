'use strict';

// Third Party imports:
import { each } from 'lodash';

// App Imports:
import { isNumber } from '../../helpers/validation.helper';

const validate = (data) => {
    const { name, index, seoKeywords, seoDescription } = data;
    let isValid = true;
    let errors = {
        name: [],
        index: [],
        seoKeywords: [],
        seoDescription: []
    };

    if (!name) {
        errors.name.push({ error: 'Обязательное поле' });
    }

    if (!isNumber(index)) {
        errors.index.push({ error: 'Обязательное поле' });
    }

    if (!seoKeywords) {
        errors.seoKeywords.push({ error: 'Обязательное поле' });
    }

    if (!seoDescription) {
        errors.seoDescription.push({ error: 'Обязательное поле' });
    }

    each(errors, error => {
        if (error.length) {
            isValid = false;
        }
    });

    return { isValid, errors };
};

export default validate;

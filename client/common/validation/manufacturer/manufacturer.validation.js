'use strict';

// Third Party imports:
import { each } from 'lodash';

// App Imports:
import { isNumber } from '../../helpers/validation.helper';

const validate = (data) => {
    const { name, picture, index, country, website, description, seoKeywords, seoDescription } = data;
    let isValid = true;
    let errors = {
        name: [],
        picture: [],
        index: [],
        country: [],
        website: [],
        description: [],
        seoKeywords: [],
        seoDescription: [],
    };

    if (!name) {
        errors.name.push({ error: 'Обязательное поле' });
    }

    if (!picture || !picture.id) {
        errors.picture.push({ error: 'Производитель должен иметь логотип' });
    }

    if (!isNumber(index)) {
        errors.index.push({ error: 'Обязательное поле' });
    }

    if (!country) {
        errors.country.push({ error: 'Обязательное поле' });
    }

    if (!website) {
        errors.website.push({ error: 'Обязательное поле' });
    }

    if (!description) {
        errors.description.push({ error: 'Обязательное поле' });
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

'use strict';

// Third Party imports:
import { each, isEmpty, isBoolean } from 'lodash';

// App Imports:
import { isNumber } from '../../helpers/validation.helper';

const validate = (data) => {
    const {
        name, index, type, directory, category, manufacturer, picture, productsName, products, content, description,
        seoKeywords, seoDescription
    } = data;
    let isValid = true;
    let errors = {
        name: [],
        index: [],
        type: [],
        directory: [],
        category: [],
        manufacturer: [],
        picture: [],
        productsName: [],
        products: [],
        content: [],
        description: [],
        seoKeywords: [],
        seoDescription: []
    };

    if (!name) {
        errors.name.push({ error: 'Обязательное поле' });
    }

    if (!isNumber(index)) {
        errors.index.push({ error: 'Обязательное поле' });
    }

    if (!type || !type.id) {
        errors.type.push({ error: 'Тип Товара должен быть выбран' });
    }

    if (!category || !category.id) {
        errors.category.push({ error: 'Категория должна быть выбрана' });
    }

    if (!manufacturer || !manufacturer.id) {
        errors.manufacturer.push({ error: 'Производитель должен быть выбран' });
    }

    if (!directory || !directory.id) {
        errors.directory.push({ error: 'Раздел должен быть выбран' });
    }

    if (!picture || !picture.id) {
        errors.picture.push({ error: 'Контейнер должен иметь изображение' });
    }

    if (!productsName) {
        errors.productsName.push({ error: 'Обязательное поле' });
    }

    if (!products || !products.length) {
        errors.products.push({ error: 'Должен быть минимум 1 вариант товара' });
    } else {
        each(products, ({ name }) => {
            if (!isNumber(name) && !isBoolean(name) && isEmpty((name))) {
                errors.products.push({ error: 'Значения вариантов не могут быть пустыми' });
            }
        });
    }

    if (!content || !content.length) {
        errors.content.push({ error: 'Комплектация на может быть пустой' });
    } else {
        each(content, ({ name }) => {
            if (!isNumber(name) && !isBoolean(name) && isEmpty((name))) {
                errors.content.push({ error: 'Значения названий не могут быть пустыми' });
            }
        });
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


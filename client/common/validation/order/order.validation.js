'use strict';

// Third Party imports:
import { each, find } from 'lodash';

// App Imports:
import { isNumber, isFirstOrLastName, isPhone, isEmail } from '../../helpers/validation.helper';

const validate = (data, shippings) => {
    const activeShipping = find(shippings, { _id: data.shippingType.id }) || {};
    let isValid = true;
    let errors = {
        customerFirstName: [],
        customerLastName: [],
        customerEmail: [],
        customerPhone: [],
        customerComment: [],
        shippingTracking: [],
        shippingPrice: [],
        shippingCity: [],
        shippingStreet: [],
        shippingHouse: [],
        shippingPostOffice: [],
        products: [],
        shippingType: [],
        paymentType: [],
    };

    // Customer Info:

    if (!data.customerFirstName) {
        errors.customerFirstName.push({ error: 'Укажите Имя Получателя' });
    } else {
        if (!isFirstOrLastName(data.customerFirstName)) {
            errors.customerFirstName.push({ error: 'Разрешены только буквы русского алфавита' });
        }
    }

    if (!data.customerLastName) {
        errors.customerLastName.push({ error: 'Укажите Фамилию Получателя' });
    } else {
        if (!isFirstOrLastName(data.customerLastName)) {
            errors.customerLastName.push({ error: 'Разрешены только буквы русского алфавита' });
        }
    }

    if (!data.customerPhone) {
        errors.customerPhone.push({ error: 'Укажите Телефон Получателя' });
    } else {
        if (!isPhone(data.customerPhone)) {
            errors.customerPhone.push({ error: 'Не верный формат телефона' });
        }
    }

    if (!data.customerEmail) {
        errors.customerEmail.push({ error: 'Укажите Эл. Почту Получателя' });
    } else {
        if (!isEmail(data.customerEmail)) {
            errors.customerEmail.push({ error: 'Не верный формат Эл. Почты' });
        }
    }

    // Shipping Info:

    if (!data.shippingType || !data.shippingType.id ||  data.shippingType.id === 'none') {
        errors.shippingType.push({ error: 'Укажите способ доставки' });
    }

    if (!data.paymentType || !data.paymentType.id || data.paymentType.id === 'none') {
        errors.paymentType.push({ error: 'Укажите способ оплаты' });
    }

    if (activeShipping && activeShipping.type !== 'shop') {
        if (!data.shippingCity) {
            errors.shippingCity.push({ error: 'Укажите город' });
        }

        if (activeShipping.type === 'postOffice') {
            if (!data.shippingPostOffice) {
                errors.shippingPostOffice.push({ error: 'Укажите № Отделения' });
            }
        }

        if (activeShipping.type === 'customer') {
            if (!data.shippingStreet) {
                errors.shippingStreet.push({ error: 'Укажите улицу' });
            }

            if (!data.shippingHouse) {
                errors.shippingHouse.push({ error: 'Укажите дом' });
            }
        }
    }

    // Products Info:

    if (!data.products || !data.products.length) {
        errors.products.push({ error: 'В заказе должен быть минимум 1 товар' });
    } else {
        each(data.products, ({ product, amount, price }) => {
            if (!isNumber(amount) || amount <= 0) {
                errors.products.push({ error: 'Количество товара не может быть пустым или равно 0' });
            } else {
                if (amount > product.amountAvailable) {
                    errors.products.push({ error: 'Количество товара не может превышать остаток' });
                }
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

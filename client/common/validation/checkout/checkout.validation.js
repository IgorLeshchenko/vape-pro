'use strict';

// Third Party imports:
import { find, each, isEmpty } from 'lodash';

// App Imports:
import { isPhone, isEmail, isFirstOrLastName } from '../../helpers/validation.helper';

const validate = (data) => {
    const { checkoutData, cartData, shippings } = data;
    const { products } = cartData;
    const activeShipping = find(shippings, { _id: checkoutData.shippingType }) || {};
    let isFormValid = true;
    let cartErrors = {};
    let formErrors = {
        firstName: [],
        lastName: [],
        phone: [],
        email: [],
        shippingType: [],
        paymentType: [],
        city: [],
        postHouseNumber: [],
        street: [],
        house: []
    };

    if (!checkoutData.firstName) {
        formErrors.firstName.push({ error: 'Укажите Ваше Имя' });
    } else {
        if (!isFirstOrLastName(checkoutData.firstName)) {
            formErrors.firstName.push({ error: 'Разрешены только буквы русского алфавита' });
        }
    }

    if (!checkoutData.lastName) {
        formErrors.lastName.push({ error: 'Укажите Вашу Фамилию' });
    } else {
        if (!isFirstOrLastName(checkoutData.lastName)) {
            formErrors.lastName.push({ error: 'Разрешены только буквы русского алфавита' });
        }
    }

    if (!checkoutData.phone) {
        formErrors.phone.push({ error: 'Укажите Ваш Телефон' });
    } else {
        if (!isPhone(checkoutData.phone)) {
            formErrors.phone.push({ error: 'Не верный формат телефона' });
        }
    }

    if (!checkoutData.email) {
        formErrors.email.push({ error: 'Укажите Вашу Эл. Почту' });
    } else {
        if (!isEmail(checkoutData.email)) {
            formErrors.email.push({ error: 'Не верный формат Эл. Почты' });
        }
    }

    if (!checkoutData.shippingType || checkoutData.shippingType === 'none') {
        formErrors.shippingType.push({ error: 'Укажите способ доставки' });
    }

    if (!checkoutData.paymentType || checkoutData.paymentType === 'none') {
        formErrors.paymentType.push({ error: 'Укажите способ оплаты' });
    }

    if (activeShipping && activeShipping.type !== 'shop') {
        if (!checkoutData.city) {
            formErrors.city.push({ error: 'Укажите город' });
        }

        if (activeShipping.type === 'postOffice') {
            if (!checkoutData.postHouseNumber) {
                formErrors.postHouseNumber.push({ error: 'Укажите № Отделения' });
            }
        }

        if (activeShipping.type === 'customer') {
            if (!checkoutData.street) {
                formErrors.street.push({ error: 'Укажите улицу' });
            }

            if (!checkoutData.house) {
                formErrors.house.push({ error: 'Укажите дом' });
            }
        }
    }

    each(products, item => {
        const { _id, amount } = item;
        const { amountAvailable } = item.product;

        if (amount > amountAvailable) {
            cartErrors[_id] = `Доступно на складе: ${amountAvailable} шт`;
        }
    });

    each(formErrors, error => {
        if (error.length) {
            isFormValid = false;
        }
    });

    return { isFormValid, isCartValid: isEmpty(cartErrors), formErrors, cartErrors };

};

export default validate;

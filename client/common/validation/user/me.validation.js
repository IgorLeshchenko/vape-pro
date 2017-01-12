'use strict';

// Third Party imports:
import { each } from 'lodash';

// App Imports:
import { isPhone } from '../../helpers/validation.helper';

export const validate = (data) => {
    const { firstName, lastName, phone } = data;
    let isValid = true;
    let errors = {
        firstName: [],
        lastName: [],
        phone: []
    };

    if (!firstName) {
        errors.firstName.push({ error: 'Обязательное поле' });
    }

    if (!lastName) {
        errors.lastName.push({ error: 'Обязательное поле' });
    }

    if (!phone || !isPhone(phone)) {
        errors.phone.push({ error: 'Обязательное поле' });
    }

    each(errors, error => {
        if (error.length) {
            isValid = false;
        }
    });

    return { isValid, errors };
};

export const validateSecurity = (data) => {
    const { password, passwordNew, passwordNewRepeat } = data;
    let isValid = true;
    let errors = {
        password: [],
        passwordNew: [],
        passwordNewRepeat: []
    };

    if (!password) {
        errors.password.push({ error: 'Обязательное поле' });
    }

    if (!passwordNew) {
        errors.passwordNew.push({ error: 'Обязательное поле' });
    }

    if (!passwordNewRepeat) {
        errors.passwordNewRepeat.push({ error: 'Обязательное поле' });
    }

    if (passwordNew && passwordNewRepeat) {
        if (passwordNew.length < 5) {
            errors.passwordNew.push({ error: 'Пароль не может быть короче 5 символов' });
        }

        if (passwordNewRepeat.length < 5) {
            errors.passwordNewRepeat.push({ error: 'Пароль не может быть короче 5 символов' });
        }

        if (passwordNew !== passwordNewRepeat) {
            errors.passwordNewRepeat.push({ error: 'Пароли не совпадают' });
        }
    }

    each(errors, error => {
        if (error.length) {
            isValid = false;
        }
    });

    return { isValid, errors };
};

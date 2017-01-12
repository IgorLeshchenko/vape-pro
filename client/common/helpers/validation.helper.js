'use strict';

export const isNumber = (entry) => {
    return !isNaN(parseFloat(entry)) && isFinite(entry)
};

export const isEmail = (entry) => {
    return /^.+@.+\..+$/gi.test(entry)
};

export const isFirstOrLastName = (entry) => {
    return /^[А-ЯЁ][а-яё]*$/gi.test(entry);
};

export const isPhone = (entry) => {
    return entry && /\(\d{3}\) \d{3} \d{2} \d{2}/gi.test(entry);
};

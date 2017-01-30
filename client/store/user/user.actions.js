'use strict';

// Third Party imports:
import isomorphicFetch from 'isomorphic-fetch';

// App imports:
import { getApiLink } from '../../common/helpers/httpLink.helper';
import { show as showToast } from '../../components/ui/toastr/toastr';

import { validate } from '../../common/validation/user/user.validation';
import * as actionsTypes from './actions.enum';

export const reset = () => dispatch => {
    dispatch({ type: actionsTypes.USER_RESET });
};

export const change = data => dispatch => {
    dispatch({ type: actionsTypes.USER_CHANGE, data });
};

export const updateValidation = (isValid, validation) => dispatch => {
    dispatch({ type: actionsTypes.USER_VALIDATE, isValid, validation });
};

export const fetch = id => dispatch => {
    const apiLink = getApiLink(`/api/mgm/users/${id}`);

    dispatch({ type: actionsTypes.USER_FETCH });

    return isomorphicFetch(apiLink, { method: 'GET' })
        .then(response => {
            const { status } = response;

            if (status !== 200) {
                dispatch({ type: actionsTypes.USER_FETCH_FAILURE, error: {} });
                return Promise.reject({ status });
            }

            return response.json();
        })
        .then(data => {
            dispatch({ type: actionsTypes.USER_FETCH_SUCCESS, data });

            return data;
        })
        .catch(error => {
            dispatch({ type: actionsTypes.USER_FETCH_FAILURE, error });
            return Promise.reject(error);
        });
};

export const create = data => dispatch => {
    const apiLink = getApiLink(`/api/mgm/users`);
    const validationResults = validate(data);

    if (!validationResults.isValid) {
        return dispatch(updateValidation(false, validationResults.errors));
    }

    dispatch({ type: actionsTypes.USER_CREATE });

    return isomorphicFetch(apiLink, { method: 'POST' })
        .then(response => {
            const { status, error } = response;

            if (status !== 200) {
                dispatch({ type: actionsTypes.USER_CREATE_FAILURE, error: {} });
                return Promise.reject({ status, error });
            }

            return response.json();
        })
        .then(payload => {
            dispatch({ type: actionsTypes.USER_CREATE_SUCCESS, data: payload });
            return payload;
        })
        .catch(error => {
            dispatch({ type: actionsTypes.USER_CREATE_FAILURE, error });
            return Promise.reject(error);
        });
};

export const update = data => dispatch => {
    const apiLink = getApiLink(`/api/mgm/users/${data._id}`);
    const validationResults = validate(data);

    if (!validationResults.isValid) {
        dispatch(updateValidation(false, validationResults.errors));

        showToast({
            type: 'error', message: 'Форма не валидна'
        });

        return Promise.reject('User Update: Validation Failed');
    }

    dispatch({ type: actionsTypes.USER_CREATE });

    return isomorphicFetch(apiLink, { method: 'PUT' })
        .then(response => {
            const { status } = response;

            if (status !== 200) {
                let message = 'Обновление пользователя не удалось';

                if (status === 405) {
                    message = 'Такой email уже существует';
                    dispatch(updateValidation(false, [{ field: 'email', error: message }]));
                }

                dispatch({ type: actionsTypes.USER_UPDATE_FAILURE, error: {} });

                return showToast({
                    type: 'error', message: message
                });
            }

            return response.json();
        })
        .then(payload => {
            dispatch({ type: actionsTypes.USER_UPDATE_SUCCESS, data: payload });
            return payload;
        })
        .catch(error => {
            dispatch({ type: actionsTypes.USER_UPDATE_FAILURE, error });
            return Promise.reject(error);
        });
};

export const remove = id => dispatch => {
    const apiLink = getApiLink(`/api/mgm/users/${id}`);

    dispatch({ type: actionsTypes.USER_REMOVE });

    return isomorphicFetch(apiLink, { method: 'DELETE' })
        .then(response => {
            const { status } = response;

            if (status !== 200) {
                dispatch({ type: actionsTypes.USER_REMOVE_FAILURE, error: {} });
                return Promise.reject({ status });
            }

            return response.json();
        })
        .then(payload => {
            dispatch({ type: actionsTypes.USER_REMOVE_SUCCESS, data: payload });
            return payload;
        })
        .catch(error => {
            dispatch({ type: actionsTypes.USER_REMOVE_FAILURE, error });
            return Promise.reject(error);
        });
};

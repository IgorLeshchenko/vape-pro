'use strict';

// Third Party imports:
import axios from 'axios';
import { normalize } from 'normalizr';

// App Imports:
import actionsTypes from '../../actionsTypes';
import schema from './users.schemas';
import { getApiLink } from '../../../common/helpers/httpLink.helper';

export const LIST_KEY = 'users';
export const API_URL_BASE = getApiLink('/api/users');

export const fetchMe = (req = {}) => dispatch => {
    const { headers } = req;
    const id = 'me';
    const apiLink = `${API_URL_BASE}/${id}`;

    dispatch({ type: actionsTypes.ITEM_FETCH_START, id });

    return axios({ url: apiLink, method: 'GET', headers })
        .then(payload => {
            const data = normalize({ users: [Object.assign({}, payload.data, { isMe: true })] }, schema);

            dispatch({ type: actionsTypes.ITEM_FETCH_SUCCESS, id, data });

            return data;
        })
        .catch(error => {
            const { status } = error.response || {};

            dispatch({ type: actionsTypes.ITEM_FETCH_FAIL, id, error });

            if (status && status === 401) {
                return Promise.resolve({});
            }

            return Promise.reject(error);
        });
};

export const signIn = (email, password, role) => dispatch => {
    const id = 'me';
    const prefix = role === 'admin' ? 'a' : 'c';
    const apiLink = `${API_URL_BASE}/auth/${prefix}/sign-in`;

    return axios.post(apiLink, { email, password }).then(payload => {
        const data = normalize({ users: [payload.data] }, schema);

        dispatch({ type: actionsTypes.ITEM_FETCH_SUCCESS, id, data });

        return data;
    }).catch(error => {
        dispatch({ type: actionsTypes.ITEM_FETCH_FAIL, id, error });
        return Promise.reject(error);
    });
};

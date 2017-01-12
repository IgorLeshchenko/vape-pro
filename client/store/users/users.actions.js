'use strict';

// Third Party imports:
import isomorphicFetch from 'isomorphic-fetch';

// App imports:
import { getApiLink } from '../../common/helpers/httpLink.helper';
import { show as showToast } from '../../components/ui/toastr/toastr';
import * as actionsTypes from './actions.enum';

const getRequestQuery = (data) => {
    const { page, size, query, sortBy, sortOrder, status, role } = data;

    return [
        `page=${page}`,
        `size=${size}`,
        `query=${query}`,
        `status=${status}`,
        `role=${role}`,
        `sortBy=${sortBy}`,
        `sortOrder=${sortOrder}`
    ].join('&');
};

export const fetch = (data) => dispatch => {
    const apiLink = getApiLink(`/api/mgm/users?${getRequestQuery(data)}`);

    dispatch({ type: actionsTypes.USERS_FETCH });

    return isomorphicFetch(apiLink, { method: 'GET' })
        .then((response) => {
            if (response.status !== 200) {
                showToast({
                    type: 'error', message: 'Не удалось загрузить список пользователей'
                });

                dispatch({ type: actionsTypes.USERS_FETCH_FAILURE, error: {} });

                return {};
            }

            return response.json();
        })
        .then((data) => {
            dispatch({ type: actionsTypes.USERS_FETCH_SUCCESS, data });

            return data;
        })
        .catch((error) => {
            dispatch({ type: actionsTypes.USERS_FETCH_FAILURE, error });

            return error;
        });
};

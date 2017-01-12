'use strict';

// Third Party imports:
import { each } from 'lodash';

// App imports:
import * as usersActionsTypes from './actions.enum';
import * as userActionsTypes from '../user/actions.enum';

export const defaultState = {
    items: [],
    isFetching: false,
    isFetchError: false,
    pages: 0,
    total: 0
};

export const reducer = (state = defaultState, action) => {
    switch (action.type) {

        // Fetch

        case usersActionsTypes.USERS_FETCH:
            return Object.assign({}, state, {
                isFetching: true
            });

        case usersActionsTypes.USERS_FETCH_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isFetchError: false,
                items: action.items,
                pages: action.pages,
                total: action.total
            });

        case usersActionsTypes.USERS_FETCH_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isFetchError: true,
                items: [],
                pages: defaultState.pages,
                total: defaultState.total
            });

        // Remove

        case userActionsTypes.USER_REMOVE:
            return Object.assign({}, state, {
                isFetching: true
            });

        case userActionsTypes.USER_REMOVE_SUCCESS:
            const usersAfterRemove = [];

            each(state.items, item => {
                if (item.id !== action.id) {
                    usersAfterRemove.push(item);
                }
            });

            return Object.assign({}, state, {
                items: usersAfterRemove
            });

        case userActionsTypes.USER_REMOVE_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isFetchError: true
            });

        default:
            return state;
    }
};

export default reducer;

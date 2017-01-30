'use strict';

// App imports:
import * as actionsTypes from './actions.enum';

export const defaultState = {
    isFetching: false,
    isFetchError: false,
    isSaving: false,
    isSaveError: false,
    isValid: true,
    isChanged: false,
    validation: {},
    data: {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'customer',
        picture: {},
        updatedAt: '',
        createdAt: '',
    },
    dataPristine: {}
};

export const reducer = (state = defaultState, action) => {
    switch (action.type) {

        // Helpers

        case actionsTypes.USER_CHANGE:
            return Object.assign({}, state, {
                isChanged: true,
                data: Object.assign({}, state.data, action.data),
            });

        case actionsTypes.USER_RESET:
            return Object.assign({}, state, {
                isFetchError: false,
                isSaveError: false,
                isValid: true,
                isChanged: false,
                validation: {},
                data: Object.assign({}, state.data, state.dataPristine),
            });

        case actionsTypes.USER_VALIDATE:
            return Object.assign({}, state, {
                isValid: action.isValid,
                validation: action.validation,
            });

        // Fetch

        case actionsTypes.USER_FETCH:
            return Object.assign({}, state, {
                isFetching: true
            });

        case actionsTypes.USER_FETCH_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isFetchError: false,
                data: Object.assign({}, state.data, action.data),
                dataPristine: Object.assign({}, state.data, action.data)
            });

        case actionsTypes.USER_FETCH_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isFetchError: true,
                data: defaultState.data,
                dataPristine: defaultState.data
            });

        // Create

        case actionsTypes.USER_CREATE:
            return Object.assign({}, state, {
                isSaving: true,
                isValid: true,
                validation: [],
            });

        case actionsTypes.USER_CREATE_SUCCESS:
            return Object.assign({}, state, {
                isFetchError: false,
                isSaveError: false,
                isValid: true,
                isChanged: false,
                validation: {},
                data: Object.assign({}, state.data, action.data),
                dataPristine: Object.assign({}, state.data, action.data)
            });

        case actionsTypes.USER_CREATE_FAILURE:
            return Object.assign({}, state, {
                isSaving: false,
                isSaveError: true
            });

        // Update

        case actionsTypes.USER_UPDATE:
            return Object.assign({}, state, {
                isSaving: true,
                isValid: true,
                validation: [],
            });

        case actionsTypes.USER_UPDATE_SUCCESS:
            return Object.assign({}, state, {
                isFetchError: false,
                isSaveError: false,
                isValid: true,
                isChanged: false,
                validation: {},
                data: Object.assign({}, state.data, action.data),
                dataPristine: Object.assign({}, state.data, action.data)
            });

        case actionsTypes.USER_UPDATE_FAILURE:
            return Object.assign({}, state, {
                isSaving: false,
                isSaveError: true
            });

        default:
            return state;
    }
};

export default reducer;

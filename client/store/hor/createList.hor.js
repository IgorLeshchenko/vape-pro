'use strict';

// Third Party imports:

// App imports:
import actionsTypes from '../actionsTypes';

export const initialState = {
    page: 1,
    size: 20,
    count: 0,
    isFetching: false,
    isError: false,
    error: '',
    pages: {}
};

export default listKey => {
    return (state = initialState, action) => {
        switch (action.type) {
            case actionsTypes.LIST_FETCH_START: {
                const { key, page, size } = action;

                if (!listKey || key !== listKey) {
                    return state;
                }

                return {
                    ...state,
                    page,
                    size,
                    isFetching: true,
                    isError: false,
                    error: '',
                    pages: {
                        ...state.pages,
                        [page]: {
                            ids: []
                        }
                    }
                };
            }

            case actionsTypes.LIST_FETCH_SUCCESS: {
                const { data, key, page, count } = action;
                const { result } = data || {};

                if (!listKey || key !== listKey) {
                    return state;
                }

                return {
                    ...state,
                    count,
                    isFetching: false,
                    pages: {
                        ...state.pages,
                        [page]: {
                            ids: result[key] || []
                        }
                    }
                };
            }

            case actionsTypes.LIST_FETCH_FAIL: {
                const { key, page, error } = action;

                if (!listKey || key !== listKey) {
                    return state;
                }

                return {
                    ...state,
                    isFetching: false,
                    isError: true,
                    error,
                    pages: {
                        ...state.pages,
                        [page]: {
                            ids: []
                        }
                    }
                };
            }

            default:
                return state;
        }
    };
};

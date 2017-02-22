'use strict';

import actionsTypes from '../actionsTypes';

export default key => {
    return (state = {}, action) => {
        switch (action.type) {
            case actionsTypes.ITEM_FETCH_SUCCESS:
            case actionsTypes.LIST_FETCH_SUCCESS: {
                const { entities } = action.data;

                if (!entities.hasOwnProperty(key)) {
                    return state;
                }

                return {
                    ...state,
                    ...entities[key]
                };
            }
            default:
                return state;
        }
    };
};

'use strict';

// Third Party imports:
import { each, keys } from 'lodash';

export const fetchComponentsData = (dispatch, components, params) => {
    const promises = [];

    each(components, component => {
        const componentKeys = keys(component);

        each(componentKeys, key => {
            const hasFetchMethod = component[key].hasOwnProperty('serverFetch');

            if (hasFetchMethod) {
                promises.push(component[key].serverFetch(dispatch, params));
            }
        });
    });

    return Promise.all(promises);
};

export default fetchComponentsData;

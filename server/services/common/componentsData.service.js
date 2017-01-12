'use strict';

// Third Party imports:
import { each } from 'lodash';

const fetchComponentsData = (dispatch, components, params) => {
    const promises = [];

    each(components, component => {
        const keys = _.keys(component);

        each(keys, (key) => {
            const hasFetchMethod = component[key].hasOwnProperty('serverFetch');

            if (hasFetchMethod) {
                promises.push(component[key].serverFetch(dispatch, params));
            }
        });
    });

    return Promise.all(promises);
};

export default fetchComponentsData;

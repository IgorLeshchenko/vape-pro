'use strict';

// Node imports:
import { each } from 'lodash';

// App imports:
import logger from './logger.service';

export const onError = (err, req, res, next) => {
    if (err) {
        logger.error(err.message);

        each(err.errors, cErr => {
            logger.error(cErr.message);
        });
    }

    next();
};

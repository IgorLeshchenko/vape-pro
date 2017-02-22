'use strict';

// Third Party imports:
import { schema } from 'normalizr';

export const img = new schema.Entity('imgs');

export default {
    imgs: [img]
};

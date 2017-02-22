'use strict';

// Third Party imports:
import { schema } from 'normalizr';

// App imports:
import { img } from '../imgs/imgs.schemas';

export const user = new schema.Entity('users', {
    picture: img
});

export default {
    users: [user]
};

'use strict';

// Third Party imports:
import { combineReducers } from 'redux';

// App imports:
import user from './user/user.reducer';
import users from './users/users.reducer';

export default combineReducers([
    user,
    users
]);

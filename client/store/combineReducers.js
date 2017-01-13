'use strict';

// Third Party imports:
import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

// App imports:
import user from './user/user.reducer';
import users from './users/users.reducer';

export default combineReducers([
    router,
    user,
    users
]);

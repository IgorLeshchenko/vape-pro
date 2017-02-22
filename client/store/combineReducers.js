'use strict';

// Third Party imports:
import { combineReducers } from 'redux';

// App imports:
import entities from './entities/entities.reducer';
import lists from './lists/lists.reducer';

export default combineReducers({
    entities,
    lists
});

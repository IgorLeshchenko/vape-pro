'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import UserModel from '../../models/user.model';

const getDataToUpdate = data => {
    return pick(data, [
        'firstName', 'lastName', 'phone', 'picture', 'isActive', 'oldPassword', 'newPassword'
    ]);
};

const isUnique = ({ _id, email }) => {
    const query = { email: email };

    if (!isUndefined(_id)) {
        query._id = { $ne: _id };
    }

    if (!email) {
        return Promise.resolve(true);
    }

    return UserModel.findOne(query)
        .then(user => {
            if (user) {
                return Promise.reject(new Error('User is not unique'));
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId', { _id }));
    }

    return UserModel.findById(itemId)
        .populate('picture', 'id')
        .exec()
        .then(user => {
            if (!user) {
                return Promise.reject(new Error('Failed to find user', { _id }));
            }

            return user.toJSON();
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'email', sortOrder = 'asc', filters = {} } = data;
    const { query, status, role } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(query) }]
    };
    const searchResultFields = [
        'id', 'email', 'firstName', 'lastName', 'phone', 'role', 'picture', 'isActive'
    ].join(' ');
    let searchResultLimits = {};

    if (!isUndefined(status) && status !== 'all') {
        searchQuery.isActive = sanitize(status);
    }

    if (!isUndefined(role) && role !== 'all') {
        searchQuery.role = sanitize(role);
    }

    if (!isUndefined(size) && size !== 0) {
        const skipTo = parseInt(page, 10) * parseInt(size, 10);
        const limitTo = parseInt(size, 10);

        searchResultLimits = {
            skip: skipTo,
            limit: limitTo
        };
    }

    return UserModel.count(searchQuery)
        .then(usersCount => {
            if (usersCount === 0) {
                return {};
            }

            return UserModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .populate('picture', 'id')
                .exec()
                .then(users => {
                    const pages = Math.floor(usersCount / (+size || 0)) || 0;

                    return {
                        items: users,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +usersCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get users list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { email } = data;

    return isUnique({ email })
        .then(() => {
            return extend(new UserModel(), getDataToUpdate(data));
        })
        .then(user => user.save())
        .then(user => getById(user._id))
        .catch(error => {
            LoggerService.error('Failed to create user', error);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const { email } = data;
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId'));
    }

    return isUnique({ _id: itemId, email })
        .then(() => UserModel.findById(itemId))
        .then(user => {
            if (!user) {
                return Promise.reject(new Error('Failed to find user'));
            }

            return extend(user, getDataToUpdate(data));
        })
        .then(user => user.save())
        .then(user => getById(user._id))
        .catch(error => {
            LoggerService.error('Failed to update user', error);
            return Promise.reject(error);
        });
};

export const updatePassword = (id, data) => {
    const itemId = castToObjectId(id);
    const { newPassword } = getDataToUpdate(data);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId'));
    }

    return update(itemId, { password: newPassword })
        .catch(error => {
            LoggerService.error('Failed to update user password', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return UserModel.findById(itemId)
        .then(user => {
            if (!user) {
                return Promise.reject(new Error('Failed to find shipping', { id }));
            }

            return extend(user, {
                isDeleted: true
            });
        })
        .then(user => user.save())
        .catch(error => {
            LoggerService.error('Failed to remove user', error, { id });
            return Promise.reject(error);
        });
};

export const comparePasswords = (id, password) => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId', { id }));
    }

    return UserModel.findById(itemId)
        .then(user => {
            if (!user) {
                return Promise.reject(new Error('Failed to find user', { id }));
            }

            if (!user.validPassword(password)) {
                return Promise.reject(new Error('Wrong password'));
            }

            return true;
        });
};

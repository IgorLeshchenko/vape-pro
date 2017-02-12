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
                return Promise.reject({ status: 422, message: 'User is not unique' });
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return UserModel.findById(itemId)
        .populate('picture', 'id')
        .exec()
        .then(user => {
            if (!user) {
                return Promise.reject({ status: 404, message: 'Failed to find user' });
            }

            return user.toJSON();
        })
        .catch(error => {
            LoggerService.error('Failed to get user by id. Message:', error.message);
            return Promise.reject(error);
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'email', sortOrder = 'asc', filters = {} } = data;
    const { query, status, role } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [
            { firstName: getQueryString(query) },
            { lastName: getQueryString(query) },
            { email: getQueryString(query) }
        ]
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
                    const intSize = parseInt(size, 10);
                    const pages = intSize !== 0 ? Math.floor(usersCount / intSize) : 1;

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
            LoggerService.error('Failed to create user. Message:', error.message);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const { email } = data;
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return isUnique({ _id: itemId, email })
        .then(() => UserModel.findById(itemId))
        .then(user => {
            if (!user) {
                return Promise.reject({ status: 404, message: 'Failed to find user' });
            }

            return extend(user, getDataToUpdate(data));
        })
        .then(user => user.save())
        .then(user => getById(user._id))
        .catch(error => {
            LoggerService.error('Failed to update user. Message:', error.message);
            return Promise.reject(error);
        });
};

export const updatePassword = (id, data) => {
    const itemId = castToObjectId(id);
    const { newPassword } = getDataToUpdate(data);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return update(itemId, { password: newPassword })
        .catch(error => {
            LoggerService.error('Failed to update user password. Message:', error.message);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return UserModel.findById(itemId)
        .then(user => {
            if (!user) {
                return Promise.reject({ status: 404, message: 'Failed to find user' });
            }

            return extend(user, {
                isDeleted: true
            });
        })
        .then(user => user.save())
        .catch(error => {
            LoggerService.error('Failed to remove user. Message:', error.message);
            return Promise.reject(error);
        });
};

export const comparePasswords = (id, password) => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return UserModel.findById(itemId)
        .then(user => {
            if (!user) {
                return Promise.reject({ status: 404, message: 'Failed to find user' });
            }

            if (!user.validPassword(password)) {
                return Promise.reject({ status: 422, message: 'Wrong password' });
            }

            return true;
        });
};

'use strict';

// Node imports:
import { isNull, extend, pick, isUndefined } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import { castToObjectId } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import ContainerModel from '../../models/container.model';
import ContainersAggregation from '../../aggregations/containers/containers.aggregation';
import ContainersSearchAggregation from '../../aggregations/containers/containersSearch.aggregation';
import ContainersFiltersControllers from './containersFilters.controller';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'path', 'index', 'isNewComing', 'isNewSeller', 'isTopSeller', 'type', 'directory', 'category',
        'manufacturer', 'picture', 'productsName', 'productsValueType', 'products', 'content', 'description',
        'seoKeywords', 'seoDescription', 'video', 'isActive'
    ]);
};

const isUnique = ({ _id, name }) => {
    const query = { name: name };

    if (!isUndefined(_id)) {
        query._id = { $ne: _id };
    }

    if (!name) {
        return Promise.resolve(true);
    }

    return ContainerModel.findOne(query)
        .then(container => {
            if (container) {
                return Promise.reject({ status: 422, message: 'Container is not unique' });
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return ContainerModel.findById(itemId)
        .populate(`type`, `id name`)
        .populate(`directory`, `id name path`)
        .populate(`category`, `id name path`)
        .populate(`manufacturer`, `id name path picture`)
        .populate(`picture`, `id name`)
        .populate({
            path: `products.product`,
            model: `Product`,
            populate: {
                path: `gallery`,
                model: `Img`
            }
        })
        .exec()
        .then(container => {
            if (!container) {
                return Promise.reject({ status: 404, message: 'Failed to find container' });
            }

            return container.toJSON();
        });
};

export const getByPath = path => {
    const safePath = sanitize(path);

    return ContainerModel.findOne({ path: safePath })
        .populate(`type`, `id name`)
        .populate(`directory`, `id name path`)
        .populate(`category`, `id name path`)
        .populate(`manufacturer`, `id name path picture`)
        .populate(`picture`, `id name`)
        .populate({
            path: `products.product`,
            model: `Product`,
            populate: {
                path: `gallery`,
                model: `Img`
            }
        })
        .exec()
        .then(container => {
            if (!container) {
                return Promise.reject({ status: 404, message: 'Failed to find container' });
            }

            return container.toJSON();
        });
};

export const search = query => {
    const aggregation = ContainersSearchAggregation.get({ query });

    return ContainerModel.aggregate(aggregation)
        .then(containers => {
            return {
                items: containers,
            };
        })
        .catch(error => {
            LoggerService.error('Failed to get containers list (search). Message:', error.message);
            return Promise.reject(error);
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'rating', sortOrder = 'asc', filters = {} } = data;

    return ContainersFiltersControllers.getSearchQuery(filters)
        .then(searchQuery => {
            const aggregation = ContainersAggregation.get({ searchQuery, page, size, sortBy, sortOrder, filters });

            return Promise.all([
                ContainersFiltersControllers.getContainersCount(searchQuery, filters),
                ContainerModel.aggregate(aggregation)
            ]).then(promiseData => {
                const containersCount = promiseData[0];
                const containers = promiseData[1];
                const pages = Math.floor(containersCount / (+size || 0)) || 0;

                if (containersCount === 0) {
                    return {};
                }

                return {
                    items: containers,
                    page: +page,
                    size: +size,
                    pages: +pages,
                    total: +containersCount
                };
            });
        })
        .catch(error => {
            LoggerService.error('Failed to get containers list. Message:', error.message);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name } = data;

    return isUnique({ name })
        .then(() => {
            return extend(new ContainerModel(), getDataToUpdate(data));
        })
        .then(container => container.save())
        .then(container => getById(container._id))
        .catch(error => {
            LoggerService.error('Failed to create container. Message:', error.message);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const { name } = data;
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return isUnique({ _id: itemId, name })
        .then(() => ContainerModel.findById(itemId))
        .then(container => {
            if (!container) {
                return Promise.reject({ status: 404, message: 'Failed to find container' });
            }

            return extend(container, getDataToUpdate(data));
        })
        .then(container => container.save())
        .then(container => getById(container._id))
        .catch(error => {
            LoggerService.error('Failed to update container. Message:', error.message);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return ContainerModel.findById(itemId)
        .then(container => {
            if (!container) {
                return Promise.reject({ status: 404, message: 'Failed to find container' });
            }

            return extend(container, {
                isDeleted: true
            });
        })
        .then(container => container.save())
        .catch(error => {
            LoggerService.error('Failed to remove container. Message:', error.message);
            return Promise.reject(error);
        });
};

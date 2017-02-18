'use strict';

// Node imports:
import { isUndefined } from 'lodash';
import { ObjectId } from 'mongodb';

// App imports:
import { getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import CategoriesController from '../categories/categories.controller';
import ManufacturersController from '../manufacturers/manufacturers.controller';
import ManufacturerModel from '../../models/manufacturer.model';
import ProductsModel from '../../models/product.model';
import ContainerModel from '../../models/container.model';
import ContainersCountAggregation from '../../aggregations/containers/containersCount.aggregation';

export const getSearchQuery = filters => {
    const { status, q, directory, category, manufacturer, isTopSeller } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(q) }]
    };

    if (!isUndefined(status) && status !== 'all') {
        searchQuery.isActive = status === `true` || status === true;
    }

    if (!isUndefined(directory) && directory !== 'all') {
        searchQuery.directory = new ObjectId(directory);
    }

    if (!isUndefined(isTopSeller)) {
        searchQuery.isTopSeller = isTopSeller === 'true' || isTopSeller === true;
    }

    if (isUndefined(category) || category === 'all' && isUndefined(manufacturer) || manufacturer === 'all') {
        return Promise.resolve(searchQuery);
    }

    if (!isUndefined(category) && category !== 'all') {
        return CategoriesController.getByPath(category)
            .then(({ _id }) => {
                return Object.assign({}, searchQuery, { category: _id });
            });
    }

    if (!isUndefined(manufacturer) && manufacturer !== 'all') {
        return ManufacturersController.getByPath(manufacturer)
            .then(({ _id }) => {
                return Object.assign({}, searchQuery, { manufacturer: _id });
            });
    }
};

export const getListOfManufacturers = filters => {
    return getSearchQuery(filters)
        .then(searchQuery => {
            delete searchQuery.manufacturer;
            delete searchQuery.category;

            return ContainerModel.distinct('manufacturer', searchQuery);
        })
        .then(manufacturesIds => {
            const manufacturersQuery = { '_id': { $in: manufacturesIds }, isActive: true, isDeleted: false };
            const manufacturersResultsFields = [
                'id', 'name', 'path', 'picture'
            ].join(' ');

            return ManufacturerModel.find(manufacturersQuery, manufacturersResultsFields)
                .sort({ name: 1 })
                .populate('picture', 'id')
                .exec();
        })
        .catch(error => {
            LoggerService.error('Failed to get manufacturers filters list. Message:', error.message);
            return Promise.reject(error);
        });
};

export const getPricesRange = filters => {
    return getSearchQuery(filters)
        .then(searchQuery => ContainerModel.distinct('products.product', searchQuery))
        .then(productsIds => {
            const priceSearchQuery = { '_id': { $in: productsIds }, isActive: true, isDeleted: false  };
            const priceResultsFields = [
                'price'
            ].join(' ');

            return Promise.all([
                ProductsModel.find(priceSearchQuery, priceResultsFields).sort({ price: 1 }).limit(1)
                    .exec(),
                ProductsModel.find(priceSearchQuery, priceResultsFields).sort({ price: -1 }).limit(1)
                    .exec()
            ]);
        })
        .then(pricesData => {
            const minPrice = pricesData[0] ? pricesData[0].price : 0;
            const maxPrice = pricesData[1] ? pricesData[1].price : 0;

            return { minPrice, maxPrice };
        })
        .catch(error => {
            LoggerService.error('Failed to get prices range. Message:', error.message);
            return Promise.reject(error);
        });
};

export const getContainersCount = (searchQuery, filters) => {
    const aggregation = ContainersCountAggregation.get({ searchQuery, filters });

    return ContainerModel.aggregate(aggregation)
        .then(containers => {
            if (!containers || !containers.length) {
                return 0;
            }

            return containers[0].count;
        })
        .catch(error => {
            LoggerService.error('Failed to get containers count. Message:', error.message);
            return Promise.reject(error);
        });
};

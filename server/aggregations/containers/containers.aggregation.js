'use strict';

// Node imports:
import { isNull, isUndefined } from 'lodash';

export const get = ({ searchQuery, page, size, sortBy, sortOrder, filters }) => {
    const { priceMin, priceMax } = filters;
    const aggregation = [
        {
            $match: searchQuery
        },
        {
            $unwind: '$products'
        },
        {
            $lookup: {
                from: 'products', localField: 'products.product', foreignField: '_id', as: 'products_items'
            }
        },
        {
            $unwind: '$products_items'
        },
        {
            $group: {
                '_id': '$_id',
                id: { $first: '$_id' },
                name: { $first: '$name' },
                path: { $first: '$path' },
                type: { $first: '$type' },
                index: { $first: '$index' },
                isNewComing: { $first: '$isNewComing' },
                isNewSeller: { $first: '$isNewSeller' },
                isTopSeller: { $first: '$isTopSeller' },
                picture: { $first: '$picture' },
                category: { $first: '$category' },
                directory: { $first: '$directory' },
                price: { $max: '$products_items.price' },
                amountSold: { $sum: '$products_items.amountSold' },
                amountAvailable: { $sum: '$products_items.amountAvailable' },
                isActive: { $first: '$isActive' },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                '_id': 1,
                id: 1,
                name: 1,
                path: 1,
                type: 1,
                index: 1,
                isNewComing: 1,
                isNewSeller: 1,
                isTopSeller: 1,
                picture: 1,
                category: 1,
                directory: 1,
                price: 1,
                amountSold: 1,
                amountAvailable: 1,
                isInStock: {
                    $cond: { if: { $gt: ['$amountAvailable', 0] }, then: true, else: false }
                },
                isActive: 1,
                count: { $sum: 1 }
            }
        }
    ];

    if (!isUndefined(priceMin) && !isUndefined(priceMax)) {
        const priceMinInt = parseInt(priceMin, 10);
        const priceMaxInt = parseInt(priceMax, 10);

        aggregation.push({
            $match: {
                price: {
                    $gte: priceMinInt,
                    $lte: priceMaxInt
                }
            }
        });
    }

    // Sort aggregation items:
    // Note: path is required for non duplicating results when pagination applied
    switch (sortBy) {
        case 'price-asc':
            aggregation.push({
                $sort: { 'isInStock': -1, 'price': 1, 'path': 1 }
            });
            break;
        case 'price-desc':
            aggregation.push({
                $sort: { 'isInStock': -1, 'price': -1, 'path': 1 }
            });
            break;
        case 'name-asc':
            aggregation.push({
                $sort: { 'isInStock': -1, 'name': 1, 'path': 1 }
            });
            break;
        case 'name-desc':
            aggregation.push({
                $sort: { 'isInStock': -1, 'name': -1, 'path': 1 }
            });
            break;
        case 'date-available':
            aggregation.push({
                $sort: { 'isInStock': -1, 'createdAt': -1, 'path': 1 }
            });
            break;
        default:
            aggregation.push({
                $sort: { 'isInStock': -1, 'index': -1, 'path': 1 }
            });
    }

    // Limit aggregation results:
    if (!isNull(size) && size !== 0) {
        const skipTo = parseInt(page, 10) * parseInt(size, 10);
        const limitTo = parseInt(size, 10);

        aggregation.push({ $skip: skipTo });
        aggregation.push({ $limit: limitTo });
    }

    // Populate dependant items:
    aggregation.push({
        $lookup: { from: 'productstypes', localField: 'type', foreignField: '_id', as: 'type' }
    });
    aggregation.push({
        $lookup: { from: 'imgs', localField: 'picture', foreignField: '_id', as: 'picture' }
    });
    aggregation.push({
        $lookup: { from: 'directories', localField: 'directory', foreignField: '_id', as: 'directory' }
    });
    aggregation.push({
        $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' }
    });

    return aggregation;
};

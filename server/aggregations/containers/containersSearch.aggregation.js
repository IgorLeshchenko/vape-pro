'use strict';

// Node imports:

// App imports:
import { getQueryString } from '../../services/common/query-helpers.service';

export const get = ({ query }) => {
    const searchQuery = {
        isDeleted: false, isActive: true, $or: [{ name: getQueryString(query) }]
    };

    return [
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
                isNewComing: { $first: '$isNewComing' },
                isNewSeller: { $first: '$isNewSeller' },
                isTopSeller: { $first: '$isTopSeller' },
                picture: { $first: '$picture' },
                price: { $max: '$products_items.price' },
                amountAvailable: { $sum: '$products_items.amountAvailable' }
            }
        },
        {
            $sort: { 'amountAvailable': -1, 'isTopSeller': -1, 'isNewSeller': -1, 'isNewComing': -1, 'index': -1 }
        },
        {
            $skip: 0
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: 'imgs', localField: 'picture', foreignField: '_id', as: 'picture'
            }
        }
    ];
};

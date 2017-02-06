'use strict';

// Node imports:
import { isUndefined } from 'lodash';

export const get = ({ searchQuery, filters }) => {
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
                price: { $max: '$products_items.price' },
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

    aggregation.push({ $group: { _id: null, count: { $sum: 1 } } });

    return aggregation;
};

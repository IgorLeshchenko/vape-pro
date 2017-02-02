'use strict';

// Node imports:
import { isNull } from 'lodash';

export const get = ({ searchQuery, page, size, sortBy, sortOrder }) => {
    const aggregation = [
        {
            $match: searchQuery
        },
        {
            $unwind: '$products'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                shippingPrice: 1,
                customsPrice: 1,
                createdAt: 1,
                productsAmount: {
                    $sum: '$products.amount'
                },
                productsPrice: {
                    $multiply: [
                        {
                            $ifNull: ['$products.amount', 0]
                        },
                        {
                            $ifNull: ['$products.price', 0]
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                id: { $first: '$_id' },
                status: { $first: '$status' },
                createdAt: { $first: '$createdAt' },
                shippingPrice: { $first: '$shippingPrice' },
                customsPrice: { $first: '$customsPrice' },
                productsAmount: { $sum: '$productsAmount' },
                productsPrice: { $sum: '$productsPrice' }
            }
        },
        {
            $project: {
                id: 1,
                status: 1,
                createdAt: 1,
                productsAmount: 1,
                price: {
                    $add: ['$shippingPrice', '$customsPrice', '$productsPrice']
                }
            }
        }
    ];

    // Sort aggregation items:
    switch (sortBy) {
        default:
            aggregation.push({ $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } });
    }

    // Limit aggregation results:
    if (!isNull(size) && size !== 0) {
        const skipTo = parseInt(page, 10) * parseInt(size, 10);
        const limitTo = parseInt(size, 10);

        aggregation.push({ $skip: skipTo });
        aggregation.push({ $limit: limitTo });
    }

    return aggregation;
};

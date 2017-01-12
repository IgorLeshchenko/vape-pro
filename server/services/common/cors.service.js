'use strict';

// App Imports:
import configs from '../../../configs/config.json';

export default (req, res, next) => {
    const allowedHost = configs.mode === 'production' ? 'http://vape-pro.com.ua' : 'http://localhost:3000';

    res.setHeader('Access-Control-Allow-Origin', allowedHost);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
};

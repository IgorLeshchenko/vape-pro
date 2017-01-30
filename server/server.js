'use strict';

// Node imports:
import express from 'express';
import expressSession from 'express-session';
import expressFileUpload from 'express-fileupload';
import expressValidator from 'express-validator';
import connectRedis from 'connect-redis';
import serveFavicon from 'serve-favicon';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { match } from 'react-router';
import path from 'path';
import nodeJSX from 'node-jsx';

nodeJSX.install({ extension: '.jsx' });

// App imports:
import configs from '../configs/config.json';
import Logger from './services/common/logger.service';
import AuthService from './services/common/auth.service';
import CorsService from './services/common/cors.service';
import ServerRenderService, { isPageRequest } from './services/server-render/serverRender.service'; // eslint-disable-next-line
import db from './services/db/mongoose';
import routes from '../client/router/routes';
import serverRoutes from './routes';

// eShop environment setup:
const port = process.env.PORT || configs.server.port;
const app = express();
const appRedisStore = connectRedis(expressSession); // eslint-disable-next-line
const appAuth = AuthService(passport);

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

global.__base = __dirname;
global.__env = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : configs.mode;

if (__env === 'dev') {
    app.use(CorsService);
}

app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(expressFileUpload());
app.use(expressSession({
    secret: 'vape-pro', resave: true, saveUninitialized: true, store: new appRedisStore()
}));

app.use(serveFavicon(__dirname + '/../public/images/favicon/favicon.ico'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(serverRoutes);

app.get('*', (req, res, next) => {
    if (!isPageRequest(req)) {
        return next();
    }

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
            return res.status(500).send(error.message);
        }

        if (redirectLocation) {
            return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }

        if (renderProps == null) {
            return res.status(404).send('Not found');
        }

        ServerRenderService(req, renderProps)
            .then(page => res.status(200).send(page))
            .catch(err => res.status(500).end(err.message));
    });
});

app.listen(port, () => {
    Logger.info(`Express server [${__env}] listening on port ${port}`);
});

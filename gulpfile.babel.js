'use strict';

import gulp from 'gulp';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import duration from 'gulp-duration';
import sass from 'gulp-sass';
import browserify from 'browserify';
import babelify from 'babelify';
import autoprefixer from 'gulp-autoprefixer';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import watchify from 'watchify';
import merge from 'merge-stream';
import uglify from 'gulp-uglify';
import uglifycss from 'gulp-uglifycss';
import streamify from 'gulp-streamify';

const babelConfigs = {
    'presets': [
        'stage-0',
        'es2015',
        'react'
    ],
    'plugins': [ 'transform-class-properties' ]
};

const configs = {
    js: {
        src: './client/bootstrap.js',
        source: 'bootstrap.js',
        name: 'app-bundle.js',
        dest: './public/assets/'
    },
    scss: {
        src: './client/App.scss',
        watch: [ './client/**/*.scss' ],
        name: 'app-bundle.css',
        dest: 'public/assets/',
        imports: [
            'node_modules/toastr/build/toastr.css',
            'node_modules/react-image-crop/dist/ReactCrop.css'
        ]
    }
};

const getCSSBundle = () => {
    const bundleConfig = configs.scss;
    const bundleTimer = duration('CSS Development bundle ready');
    const cssStream = gulp.src(bundleConfig.imports);
    const scssStream = gulp.src(bundleConfig.src)
        .pipe(sass({ errLogToConsole: true }))
        .on('error', error => console.error(error));

    merge(scssStream, cssStream)
        .pipe(concat(bundleConfig.name))
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(gulp.dest(bundleConfig.dest))
        .pipe(bundleTimer)
        .resume();
};

const getJSBundle = (bundler) => {
    const bundleConfig = configs.js;
    const bundleTimer = duration('JS Development bundle ready');

    return bundler
        .bundle()
        .on('error', error => console.error(error))
        .pipe(source(bundleConfig.source))
        .pipe(buffer())
        .pipe(rename(bundleConfig.name))
        .pipe(gulp.dest(bundleConfig.dest))
        .pipe(bundleTimer)
        .resume();
};

const getCSSProdBundle = () => {
    const bundleConfig = configs.scss;
    const bundleTimer = duration('CSS Production bundle ready');
    const cssStream = gulp.src(bundleConfig.imports);
    const scssStream = gulp.src(bundleConfig.src)
        .pipe(sass({ errLogToConsole: true }))
        .on('error', error => console.error(error));

    merge(scssStream, cssStream)
        .pipe(concat(bundleConfig.name))
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(uglifycss({
            'maxLineLen': 80,
            'uglyComments': true
        }))
        .pipe(gulp.dest(bundleConfig.dest))
        .pipe(bundleTimer)
        .resume();
};

const getJSProdBundle = (bundler) => {
    const bundleConfig = configs.js;
    const bundleTimer = duration('JS Production bundle ready');

    return bundler
        .bundle()
        .on('error', error => console.error(error))
        .pipe(source(bundleConfig.source))
        .pipe(buffer())
        .pipe(rename(bundleConfig.name))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(bundleConfig.dest))
        .pipe(bundleTimer)
        .resume();
};

gulp.task('build:prod', () => {
    const bundler = browserify(configs.js.src, { debug: true })
        .transform(babelify, babelConfigs);

    getCSSProdBundle();
    getJSProdBundle(bundler);
});

gulp.task('build:dev', () => {
    const bundler = watchify(browserify(configs.js.src, watchify.args))
        .transform(babelify, babelConfigs);

    getCSSBundle();
    getJSBundle(bundler, configs.js);

    gulp.watch(configs.scss.watch, () => {
        getCSSBundle();
    });

    bundler.on('update', () => {
        getJSBundle(bundler);
    });
});

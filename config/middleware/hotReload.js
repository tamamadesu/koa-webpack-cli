'use strict';

const config      = require('../index');
const koaWebpack  = require('koa-webpack');
const browserSync = require('koa-browser-sync');

const hotReload = (webpackConfig) => {

    return koaWebpack({
        config : webpackConfig,
        dev : {
            publicPath : webpackConfig.output.publicPath,
            stats : {
                modules: false,
                chunks : false,
                colors : true
            }
        },
        hot : {
            path   :'/__webpack_hmr',
            log    : () => {}
        }
    });
};


const liveReload = () => {

    return browserSync({
        init      : true,
        logLevel  : 'silent',
        logPrefix : config.name,
        files     : [config.staticPath + '**/*.css'],
        plugins   : [
                        {
                            module: 'bs-html-injector',
                            options: {
                                files: [config.staticPath + '*.html']
                            }
                        }
                    ]
    });
};

module.exports = {
    hotReload  : hotReload,
    liveReload : liveReload
};
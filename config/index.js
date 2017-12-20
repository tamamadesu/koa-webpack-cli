'use strict';

const path     = require('path');
const basePath = path.resolve(__dirname, '../');
const packJson = require(basePath + '/package.json');

const config = {
    name     : packJson.name || 'my web server',
    port     : 8000,
    hmr      : true,
    npmCmd   : process.env.npm_lifecycle_event,  // 执行命令
    arrArgv  : require('optimist').argv._,   // 传递参数
    basePath,
    staticPath: basePath + '/dist/',
    dev: {
        output: {
            path              : basePath + '/dist',
            filename          : 'js/[name].js',
            publicPath        : './',
            chunkFilename     : 'js/chunk_[name].js',
            sourceMapFilename : 'sourceMap/[file].map',
        }
    },
    build: {
        output : {
            path          : basePath + '/public',
            filename      : 'js/[name].[chunkhash:8].js',
            publicPath    : 'http://cdn.com/',
            chunkFilename : 'js/chunk.[name].[chunkhash:8].js'
        }
    },
    webpackAppend:{
        resolve: {
            extensions: ['.js', '.vue'],
            alias: {
                'vue' : basePath + '/node_modules/vue/dist/vue.min.js'
            }
        },
        externals: {
            'jquery': 'jQuery',
            '$': 'jQuery'
        },
    }
};

module.exports = config;

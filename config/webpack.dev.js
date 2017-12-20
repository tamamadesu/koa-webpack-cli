'use strict';

let webpack           = require('webpack');
let merge             = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.js');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let FriendlyError     = require('friendly-errors-webpack-plugin');
let WriteFilePlugin   = require('write-file-webpack-plugin');

let config = require('./index');
let env    = config.npmCmd;

const devWebpackConfig = merge(baseWebpackConfig,{

    output : config[env].output,
    plugins: [
        new FriendlyError(),
        new ExtractTextPlugin({
            filename : 'css/[name].css',
            allChunks : true
        })
    ]
});

if(config.hmr){
    devWebpackConfig.output.publicPath = '/memory/';
    devWebpackConfig.plugins = devWebpackConfig.plugins.concat([
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new WriteFilePlugin({
            log:false,
            test: /\.(css|html)$/
        })
    ]);
}

module.exports = devWebpackConfig;



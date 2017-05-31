"use strict";

const color                = require('colors');
const webpack              = require('webpack');
const merge                = require('webpack-merge');
const WebpackMd5Hash       = require('webpack-md5-hash');
const baseWebpackConfig    = require("./webpack.base.js");
const ExtractTextPlugin    = require("extract-text-webpack-plugin");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const config               = require("./index");

const  prodWebpackConfig = merge(baseWebpackConfig,{
    output : config.build.output,
    plugins: [
        new ExtractTextPlugin({
            filename : 'css/[name].[contenthash:8].css',
            allChunks : true
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            workerCount:require('os').cpus.length,
            uglifyJS: {
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                },
                comments: false,
                sourceMap: true,
                mangle: true
            },
        }),
        new WebpackMd5Hash()
    ]
});

const outputDebug = (err, stats) => {

    if(err){
        console.err(err);
    }

    console.log(stats.toString({
        chunks: false,
        colors:true
    }));

    console.log(color.yellow(`\n 构建成功，文件目录为：${prodWebpackConfig.output.path}\n`));

};

webpack(prodWebpackConfig).run(outputDebug);
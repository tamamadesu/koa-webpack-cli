'use strict';

let fs                    = require('fs');
let config                = require('./index');
let webpack               = require('webpack');
let ExtractTextPlugin     = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin     = require('html-webpack-plugin');
let WebpackNotifierPlugin = require('webpack-notifier');

let env        = config.npmCmd;
let basePath   = config.basePath;
let arrArgv    = config.arrArgv;
let outputPath = config[env].output.path;
let srcDir     = basePath + '/src/js/';
let hotReload  = 'webpack-hot-middleware/client?reload=true';

// see: https://github.com/webpack/loader-utils/issues/56
process.noDeprecation = true;

let exportConfig = {

    entry:{
    },
    output: {
        path: outputPath,
        jsonpFunction:'starCityJsonp',
    },
    devtool: env == 'dev' ? '#cheap-module-eval-source-map' : false, //source-map
    performance: {
        hints: env == 'dev' ? false : 'warning'
    },
    module: {
        rules:[{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: 'babel-loader',
                include: basePath
            },{
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: basePath +  '/tsconfig.json'
                },
                exclude: /node_modules/,
                include: basePath
            },{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback:'style-loader', use:`css-loader?${env == 'dev' ? '': 'minimize&'}sourceMap!postcss-loader`}),
                include: basePath
            },{
                test: /\.sass$/,
                use: ExtractTextPlugin.extract({fallback:'style-loader', use:`css-loader?${env == 'dev' ? '': 'minimize&'}sourceMap!postcss-loader!sass-loader?indentedSyntax`}),
                include: basePath
            },{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [require('postcss-cssnext')()],
                    loaders: {
                        css: ExtractTextPlugin.extract({use: `css-loader?${env == 'dev' ? '': 'minimize&'}sourceMap`}),
                        sass: ExtractTextPlugin.extract({use: `css-loader?${env == 'dev' ? '': 'minimize&'}sourceMap!sass-loader?indentedSyntax`})
                    },
                }
            },{
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: env == 'dev' ? true : false
                }
            },{
                test: /\.svg$/,
                loader: 'svg-inline-loader',
                options: {
                    removeTags: true,
                    removingTags: ['id']
                }
            },{
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: env == 'dev' ? 'img/[name].[ext]' : 'img/[name].[hash:7].[ext]'
                }
            },{
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: env == 'dev' ? 'fonts/[name].[ext]' : 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins:[
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new WebpackNotifierPlugin({excludeWarnings: true}),
        new webpack.DefinePlugin({
            'ENV': JSON.stringify(env)
        })
    ]
};

const getAllEnteyWithHtml = (arrArgv) => {

    let entrys = {};


    // add entry hotReload
    fs.readdirSync(srcDir).forEach(function(file){
        let name = file.slice(0,file.lastIndexOf('.'));
        if(config.hmr && env === 'dev'){
            entrys[name] = [hotReload,srcDir + file];
        }else{
            entrys[name] = srcDir + file;
        }
    });

    if(arrArgv.length){
        let custom_entrys = {};
        arrArgv.forEach(function(src){
            if(!entrys[src]){
                throw new Error('参数错误，检查 src/js/');
            }else{
                custom_entrys[src] = entrys[src];
            }
        });

        entrys = custom_entrys;
    }

    for(var i in entrys){

        let filename = `${outputPath}/${i}.html`;
        let path = `${basePath}/src/tmpl/${i}.pug`;
        if (fs.existsSync(path)) {
            exportConfig.plugins.push(new HtmlWebpackPlugin({
                filename: filename,
                template: `${basePath}/src/tmpl/${i}.pug`,
                inject: 'body',
                chunks:[i]
            }));
        }

    }

    exportConfig.entry = entrys;
};


getAllEnteyWithHtml(arrArgv);

module.exports = exportConfig;

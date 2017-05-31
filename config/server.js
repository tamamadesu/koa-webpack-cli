"use strict";

const Koa     = require('koa');
const serve   = require('koa-static');
const Router  = require('koa-router');
const color   = require('colors');

const config        = require("./index");
const webpackConfig = require("./webpack.dev");

const proxyMiddleware        = require('./middleware/proxy');
const {hotReload,liveReload} = require('./middleware/hotReload');

const app    = new Koa();
const router = new Router();

app.use(hotReload(webpackConfig));
app.use(liveReload());
app.use(proxyMiddleware());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(config.staticPath));

app.listen(config.port, () => {

    console.log(`[${config.name}]`.gray + color.green(` 服务已启动，端口为:${config.port}`));
    console.log(`[${config.name}]`.gray + color.green(` 目录为:${config.staticPath}`));
    require("openurl").open(`http://localhost:${config.port}`);

});

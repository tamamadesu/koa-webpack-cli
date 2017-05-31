"use strict";

const config = require('../index');
const rules  = require(config.basePath + '/mock/');

const middleware = (options) => {

    options = Object.assign({},options);

    // return async (ctx,next)=>{

    //     rules(ctx.request,ctx.response);
    //     await next();
    // }

    return rules;
};


module.exports = middleware;

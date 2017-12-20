'use strict';

const config = require('../index');
const rules  = require(config.basePath + '/mock/');

const middleware = (options) => {

    options = Object.assign({},options);
    return rules;
};


module.exports = middleware;

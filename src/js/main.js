'use strict';

require('../sass/main.sass');

console.log('hello world');

$.get('/fetchList').then((data)=>{
    console.log(data);
}).fail((data)=> {
    console.log(data);
});
"use strict";

const fs     = require('fs');
const path   = require('path');
const rp     = require('request-promise');
const colors = require('colors');

//https://cdn.rawgit.com/Marak/faker.js/master/examples/browser/index.html
const fake = require('faker');
fake.locale = "zh_CN";

const create = (relations,nums) => {

    let data;
    let get = () =>{
        let obj = {};
        for(let j in relations){
            let keys = relations[j].split(".");
            if(keys.indexOf('fake') !== -1){
                let func = null;
                for(let i=1;i<keys.length;i++){
                    if(i === 1){
                        func = fake[keys[1]];
                    }else{
                        func = func[keys[i]];
                    }
                }
                obj[j] = func();
            }else{
                obj[j] = relations[j];
            }
        }
        return obj;
    };
    if(nums){
        data = [];
        for(let i=0; i<nums;i++){
            data.push(get());
        }
    }else{
        data = get();
    }

    return data;
};

const rules = async (ctx,next) => {

    let req  = ctx.request;
    let res  = ctx.response;
    let oUrl = req.url;
    let map  = JSON.parse(fs.readFileSync(path.resolve(__dirname,'rules.json'), 'utf8'));

    for(let i in map){

        let proxyInfo = i.split(" ");
        let method = proxyInfo[0].toUpperCase();
        let url    = proxyInfo[1];
        let nums   = proxyInfo[2]*1 || 0;


        if(method === req.method && url === oUrl){
            if(typeof map[i] == "string"){
                res.body = await rp(map[i]);
            }else{
                res.body = create(map[i],nums);
            }
            console.log(colors.yellow(`[proxy]: ${method} ${oUrl} -> mock Data from rules.json`));
        }
    }

    await next();

};


module.exports = rules;
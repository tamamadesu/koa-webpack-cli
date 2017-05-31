"use strict";

if (module.hot) { module.hot.accept(); }


require("../sass/main.sass");

console.log(2422);

// document.querySelector("h1").innerHTML = 2;

$.post("/getList").then((data)=>{
    console.log(data);
}).fail((data)=> {
    console.log(data);
});
import{w as s}from"./paths.4bb479c7.js";const t={nickname:"",fullName:"",campus:"",imageUrl:"",id:0},a=localStorage.getItem("userData")??t,r=s(typeof a=="string"?JSON.parse(a):t);r.subscribe(e=>{window.localStorage.setItem("userData",JSON.stringify(e))});export{r as u};

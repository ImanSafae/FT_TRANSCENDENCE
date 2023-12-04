import{w as o}from"./paths.4bb479c7.js";const e=o(localStorage.getItem("twoFaLocked")==="true");e.subscribe(t=>{localStorage.setItem("twoFaLocked",t.toString())});export{e as t};

import"./index.3452823c.js";import{l as a,s as l}from"./loggedStore.1126538f.js";import{g as r}from"./navigation.2d2aeeb5.js";import"./twoFaLockedState.1c68f5ea.js";import{u as s}from"./userDataStore.1e00dd27.js";const c="http://159.65.54.159:5173/:3000/auth/code";let n="";async function i(e){let o={code:e};try{let t=await fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(t.ok)return console.log("code successfully sent!"),t}catch{console.log("error")}}async function u(){a.set(!0);const e=await i(n);if(e)try{console.log(e);const o=await e.json();s.set(o),console.log("myData: ",o.fullName,o.nickname,o.campus),l.auth={username:o.nickname}}catch(o){console.log("error: ",o)}else console.log("not logged yet")}async function p(){let o=new URL(window.location.href).searchParams.get("code");o&&(n=o,console.log("Therefore, receiving data..."),await u(),r("/profile"))}function y(){a.set(!1),window.localStorage.removeItem("userData")}export{p as a,y as l};
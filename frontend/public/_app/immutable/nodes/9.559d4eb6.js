import{s as F,f as i,l as p,a as S,g as c,h as V,m as _,d as g,c as T,r as $,j as w,i as J,u as e,n as j,v as A,w as K,o as O}from"../chunks/scheduler.33b54330.js";import{S as Q,i as X}from"../chunks/index.3452823c.js";import{g as Y}from"../chunks/navigation.2d2aeeb5.js";import{u as Z,e as ee}from"../chunks/data.9cfe125f.js";import{u as te}from"../chunks/userDataStore.1e00dd27.js";function se(b){let s,l,n,t,o,y,u=b[0].user.nickname+"",d,D,E,v,x,H=b[0].user.fullName+"",k,P,I=b[0].user.campus+"",M,z,N,R,f,q='<h2 style="text-align:center">Games played</h2> <h3>Victories: 0</h3> <h3>Losses: 0</h3>',W,h,B='<button class="svelte-1tcby1d">Send a private message</button> <button class="svelte-1tcby1d">Challenge to a transcending Pong game</button>';return{c(){s=i("div"),l=i("div"),n=i("div"),t=i("div"),o=i("h2"),y=p("Welcome to "),d=p(u),D=p("'s profile!"),E=S(),v=i("h3"),x=p("alias "),k=p(H),P=p(" from 42 "),M=p(I),z=S(),N=i("br"),R=S(),f=i("div"),f.innerHTML=q,W=S(),h=i("div"),h.innerHTML=B,this.h()},l(r){s=c(r,"DIV",{class:!0});var a=V(s);l=c(a,"DIV",{class:!0});var G=V(l);n=c(G,"DIV",{class:!0});var U=V(n);t=c(U,"DIV",{class:!0});var m=V(t);o=c(m,"H2",{});var C=V(o);y=_(C,"Welcome to "),d=_(C,u),D=_(C,"'s profile!"),C.forEach(g),E=T(m),v=c(m,"H3",{});var L=V(v);x=_(L,"alias "),k=_(L,H),P=_(L," from 42 "),M=_(L,I),L.forEach(g),z=T(m),N=c(m,"BR",{}),R=T(m),f=c(m,"DIV",{class:!0,"data-svelte-h":!0}),$(f)!=="svelte-1ws72vz"&&(f.innerHTML=q),m.forEach(g),U.forEach(g),G.forEach(g),W=T(a),h=c(a,"DIV",{class:!0,"data-svelte-h":!0}),$(h)!=="svelte-1oz91vi"&&(h.innerHTML=B),a.forEach(g),this.h()},h(){w(f,"class","game-stats"),w(t,"class","user-description svelte-1tcby1d"),w(n,"class","user-info svelte-1tcby1d"),w(l,"class","profile-container svelte-1tcby1d"),w(h,"class","invite-buttons svelte-1tcby1d"),w(s,"class","main-container svelte-1tcby1d")},m(r,a){J(r,s,a),e(s,l),e(l,n),e(n,t),e(t,o),e(o,y),e(o,d),e(o,D),e(t,E),e(t,v),e(v,x),e(v,k),e(v,P),e(v,M),e(t,z),e(t,N),e(t,R),e(t,f),e(s,W),e(s,h)},p(r,[a]){a&1&&u!==(u=r[0].user.nickname+"")&&j(d,u),a&1&&H!==(H=r[0].user.fullName+"")&&j(k,H),a&1&&I!==(I=r[0].user.campus+"")&&j(M,I)},i:A,o:A,d(r){r&&g(s)}}}function ae(b,s,l){let n;K(b,te,y=>l(1,n=y));let t;async function o(){var D;let u=new URLSearchParams((D=window==null?void 0:window.location)==null?void 0:D.search).get("login");console.log("login:",u);const d=Z.find(E=>E.nickname===u);if(!d)throw ee(404);l(0,t.user=d,t),console.log(d)}return O(async()=>{o(),t.user.nickname===n.nickname&&Y("/profile")}),[t]}class ce extends Q{constructor(s){super(),X(this,s,ae,se,F,{})}}export{ce as component};
import{s as $,f as p,a as S,g as w,h as b,r as G,c as L,d as m,j as g,i as y,u as f,D as X,x as q,v as z,G as ee,E as le,w as ae,o as ne,l as B,m as H,n as R,e as J}from"../chunks/scheduler.33b54330.js";import{S as te,i as se,b as oe,d as re,m as ce,a as ie,t as ue,e as he}from"../chunks/index.3452823c.js";import{e as O}from"../chunks/each.2c88f82a.js";import{s as K}from"../chunks/loggedStore.1126538f.js";import{u as fe}from"../chunks/userDataStore.1e00dd27.js";import"../chunks/paths.4bb479c7.js";import"../chunks/twoFaLockedState.1c68f5ea.js";function Q(o,s,l){const e=o.slice();return e[9]=s[l],e}function W(o,s,l){const e=o.slice();return e[12]=s[l],e}function Y(o){let s,l,e,t=o[12].interlocutor+"",a,n,c,_=o[12].lastMessage+"",E,M,D,r;function k(...h){return o[6](o[12],...h)}return{c(){s=p("li"),l=p("div"),e=p("p"),a=B(t),n=S(),c=p("p"),E=B(_),M=S(),this.h()},l(h){s=w(h,"LI",{});var I=b(s);l=w(I,"DIV",{class:!0});var C=b(l);e=w(C,"P",{class:!0});var N=b(e);a=H(N,t),N.forEach(m),n=L(C),c=w(C,"P",{class:!0});var V=b(c);E=H(V,_),V.forEach(m),C.forEach(m),M=L(I),I.forEach(m),this.h()},h(){g(e,"class","msg-author svelte-1s8wh6w"),g(c,"class","msg-line svelte-1s8wh6w"),g(l,"class","convo svelte-1s8wh6w")},m(h,I){y(h,s,I),f(s,l),f(l,e),f(e,a),f(l,n),f(l,c),f(c,E),f(s,M),D||(r=q(s,"click",k),D=!0)},p(h,I){o=h,I&1&&t!==(t=o[12].interlocutor+"")&&R(a,t),I&1&&_!==(_=o[12].lastMessage+"")&&R(E,_)},d(h){h&&m(s),D=!1,r()}}}function Z(o){let s,l=O(o[3].messages),e=[];for(let t=0;t<l.length;t+=1)e[t]=x(Q(o,l,t));return{c(){for(let t=0;t<e.length;t+=1)e[t].c();s=J()},l(t){for(let a=0;a<e.length;a+=1)e[a].l(t);s=J()},m(t,a){for(let n=0;n<e.length;n+=1)e[n]&&e[n].m(t,a);y(t,s,a)},p(t,a){if(a&8){l=O(t[3].messages);let n;for(n=0;n<l.length;n+=1){const c=Q(t,l,n);e[n]?e[n].p(c,a):(e[n]=x(c),e[n].c(),e[n].m(s.parentNode,s))}for(;n<e.length;n+=1)e[n].d(1);e.length=l.length}},d(t){t&&m(s),ee(e,t)}}}function x(o){let s,l=o[9]+"",e;return{c(){s=p("p"),e=B(l),this.h()},l(t){s=w(t,"P",{class:!0});var a=b(s);e=H(a,l),a.forEach(m),this.h()},h(){g(s,"class","svelte-1s8wh6w")},m(t,a){y(t,s,a),f(s,e)},p(t,a){a&8&&l!==(l=t[9]+"")&&R(e,l)},d(t){t&&m(s)}}}function me(o){let s,l,e,t="<h3>CONVERSATIONS</h3>",a,n,c,_,E,M,D,r,k,h,I="SEND",C,N,V=O(o[0].summaries),d=[];for(let i=0;i<V.length;i+=1)d[i]=Y(W(o,V,i));let v=o[2]&&o[3]&&Z(o);return{c(){s=p("div"),l=p("div"),e=p("div"),e.innerHTML=t,a=S(),n=p("ul");for(let i=0;i<d.length;i+=1)d[i].c();c=S(),_=p("div"),E=p("ul"),v&&v.c(),M=S(),D=p("div"),r=p("textarea"),k=S(),h=p("button"),h.textContent=I,this.h()},l(i){s=w(i,"DIV",{class:!0});var T=b(s);l=w(T,"DIV",{class:!0});var u=b(l);e=w(u,"DIV",{class:!0,"data-svelte-h":!0}),G(e)!=="svelte-dyioij"&&(e.innerHTML=t),a=L(u),n=w(u,"UL",{class:!0});var j=b(n);for(let U=0;U<d.length;U+=1)d[U].l(j);j.forEach(m),u.forEach(m),c=L(T),_=w(T,"DIV",{class:!0});var P=b(_);E=w(P,"UL",{class:!0});var F=b(E);v&&v.l(F),F.forEach(m),M=L(P),D=w(P,"DIV",{class:!0});var A=b(D);r=w(A,"TEXTAREA",{placeholder:!0,class:!0}),b(r).forEach(m),k=L(A),h=w(A,"BUTTON",{class:!0,"data-svelte-h":!0}),G(h)!=="svelte-1ahj4a7"&&(h.textContent=I),A.forEach(m),P.forEach(m),T.forEach(m),this.h()},h(){g(e,"class","header svelte-1s8wh6w"),g(n,"class","convo-list svelte-1s8wh6w"),g(l,"class","dm-container svelte-1s8wh6w"),g(E,"class","message-list svelte-1s8wh6w"),g(r,"placeholder","Message"),g(r,"class","svelte-1s8wh6w"),g(h,"class","svelte-1s8wh6w"),g(D,"class","input-area svelte-1s8wh6w"),g(_,"class","message-area-container svelte-1s8wh6w"),g(s,"class","container svelte-1s8wh6w")},m(i,T){y(i,s,T),f(s,l),f(l,e),f(l,a),f(l,n);for(let u=0;u<d.length;u+=1)d[u]&&d[u].m(n,null);f(s,c),f(s,_),f(_,E),v&&v.m(E,null),f(_,M),f(_,D),f(D,r),X(r,o[1]),f(D,k),f(D,h),C||(N=[q(r,"input",o[7]),q(h,"click",o[5])],C=!0)},p(i,[T]){if(T&17){V=O(i[0].summaries);let u;for(u=0;u<V.length;u+=1){const j=W(i,V,u);d[u]?d[u].p(j,T):(d[u]=Y(j),d[u].c(),d[u].m(n,null))}for(;u<d.length;u+=1)d[u].d(1);d.length=V.length}i[2]&&i[3]?v?v.p(i,T):(v=Z(i),v.c(),v.m(E,null)):v&&(v.d(1),v=null),T&2&&X(r,i[1])},i:z,o:z,d(i){i&&m(s),ee(d,i),v&&v.d(),C=!1,le(N)}}}function _e(o,s,l){let e;ae(o,fe,r=>l(8,e=r));let{convos:t}=s,a="",n=!1,c=null;ne(()=>{K.on("privatemessage",r=>{const k=t.summaries.find(h=>h.interlocutor===r.interlocutor);k.messages=[...k.messages,r.message]})});function _(r,k){console.log("objet cliqué"),r.target.closest(".convo")&&(l(3,c=k),l(2,n=!0))}function E(){if(!n||!c)return;const r={recipient:c==null?void 0:c.interlocutor,message:a,userData:e},k=e.nickname+": "+a;l(3,c.messages=[...c.messages,k],c),K.emit("privatemessage",r),l(1,a="")}const M=(r,k)=>_(k,r);function D(){a=this.value,l(1,a)}return o.$$set=r=>{"convos"in r&&l(0,t=r.convos)},[t,a,n,c,_,E,M,D]}class de extends te{constructor(s){super(),se(this,s,_e,me,$,{convos:0})}}function ve(o){let s,l,e;return l=new de({props:{convos:o[0]}}),{c(){s=p("div"),oe(l.$$.fragment),this.h()},l(t){s=w(t,"DIV",{class:!0});var a=b(s);re(l.$$.fragment,a),a.forEach(m),this.h()},h(){g(s,"class","dm-interface")},m(t,a){y(t,s,a),ce(l,s,null),e=!0},p(t,[a]){const n={};a&1&&(n.convos=t[0]),l.$set(n)},i(t){e||(ie(l.$$.fragment,t),e=!0)},o(t){ue(l.$$.fragment,t),e=!1},d(t){t&&m(s),he(l)}}}function ge(o,s,l){let{data:e}=s;return o.$$set=t=>{"data"in t&&l(0,e=t.data)},[e]}class Te extends te{constructor(s){super(),se(this,s,ge,ve,$,{data:0})}}export{Te as component};
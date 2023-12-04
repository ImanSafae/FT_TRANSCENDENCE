import{s as q,a as B,e as d,c as U,i as E,d as h,b as j,o as W,f as z,g as F,h as G,j as D,k as p,l as H,m as J,n as K,t as M,p as I,q as k}from"../chunks/scheduler.33b54330.js";import{S as Q,i as X,t as g,c as P,a as w,g as y,b as v,d as O,m as R,e as L}from"../chunks/index.3452823c.js";const Y="modulepreload",Z=function(o,e){return new URL(o,e).href},T={},m=function(e,n,i){if(!n||n.length===0)return e();const r=document.getElementsByTagName("link");return Promise.all(n.map(f=>{if(f=Z(f,i),f in T)return;T[f]=!0;const t=f.endsWith(".css"),s=t?'[rel="stylesheet"]':"";if(!!i)for(let a=r.length-1;a>=0;a--){const u=r[a];if(u.href===f&&(!t||u.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${f}"]${s}`))return;const c=document.createElement("link");if(c.rel=t?"stylesheet":Y,t||(c.as="script",c.crossOrigin=""),c.href=f,document.head.appendChild(c),t)return new Promise((a,u)=>{c.addEventListener("load",a),c.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${f}`)))})})).then(()=>e()).catch(f=>{const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=f,window.dispatchEvent(t),!t.defaultPrevented)throw f})},se={};function $(o){let e,n,i;var r=o[1][0];function f(t,s){return{props:{data:t[3],form:t[2]}}}return r&&(e=k(r,f(o)),o[12](e)),{c(){e&&v(e.$$.fragment),n=d()},l(t){e&&O(e.$$.fragment,t),n=d()},m(t,s){e&&R(e,t,s),E(t,n,s),i=!0},p(t,s){if(s&2&&r!==(r=t[1][0])){if(e){y();const l=e;g(l.$$.fragment,1,0,()=>{L(l,1)}),P()}r?(e=k(r,f(t)),t[12](e),v(e.$$.fragment),w(e.$$.fragment,1),R(e,n.parentNode,n)):e=null}else if(r){const l={};s&8&&(l.data=t[3]),s&4&&(l.form=t[2]),e.$set(l)}},i(t){i||(e&&w(e.$$.fragment,t),i=!0)},o(t){e&&g(e.$$.fragment,t),i=!1},d(t){t&&h(n),o[12](null),e&&L(e,t)}}}function x(o){let e,n,i;var r=o[1][0];function f(t,s){return{props:{data:t[3],$$slots:{default:[ee]},$$scope:{ctx:t}}}}return r&&(e=k(r,f(o)),o[11](e)),{c(){e&&v(e.$$.fragment),n=d()},l(t){e&&O(e.$$.fragment,t),n=d()},m(t,s){e&&R(e,t,s),E(t,n,s),i=!0},p(t,s){if(s&2&&r!==(r=t[1][0])){if(e){y();const l=e;g(l.$$.fragment,1,0,()=>{L(l,1)}),P()}r?(e=k(r,f(t)),t[11](e),v(e.$$.fragment),w(e.$$.fragment,1),R(e,n.parentNode,n)):e=null}else if(r){const l={};s&8&&(l.data=t[3]),s&8215&&(l.$$scope={dirty:s,ctx:t}),e.$set(l)}},i(t){i||(e&&w(e.$$.fragment,t),i=!0)},o(t){e&&g(e.$$.fragment,t),i=!1},d(t){t&&h(n),o[11](null),e&&L(e,t)}}}function ee(o){let e,n,i;var r=o[1][1];function f(t,s){return{props:{data:t[4],form:t[2]}}}return r&&(e=k(r,f(o)),o[10](e)),{c(){e&&v(e.$$.fragment),n=d()},l(t){e&&O(e.$$.fragment,t),n=d()},m(t,s){e&&R(e,t,s),E(t,n,s),i=!0},p(t,s){if(s&2&&r!==(r=t[1][1])){if(e){y();const l=e;g(l.$$.fragment,1,0,()=>{L(l,1)}),P()}r?(e=k(r,f(t)),t[10](e),v(e.$$.fragment),w(e.$$.fragment,1),R(e,n.parentNode,n)):e=null}else if(r){const l={};s&16&&(l.data=t[4]),s&4&&(l.form=t[2]),e.$set(l)}},i(t){i||(e&&w(e.$$.fragment,t),i=!0)},o(t){e&&g(e.$$.fragment,t),i=!1},d(t){t&&h(n),o[10](null),e&&L(e,t)}}}function V(o){let e,n=o[6]&&A(o);return{c(){e=z("div"),n&&n.c(),this.h()},l(i){e=F(i,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var r=G(e);n&&n.l(r),r.forEach(h),this.h()},h(){D(e,"id","svelte-announcer"),D(e,"aria-live","assertive"),D(e,"aria-atomic","true"),p(e,"position","absolute"),p(e,"left","0"),p(e,"top","0"),p(e,"clip","rect(0 0 0 0)"),p(e,"clip-path","inset(50%)"),p(e,"overflow","hidden"),p(e,"white-space","nowrap"),p(e,"width","1px"),p(e,"height","1px")},m(i,r){E(i,e,r),n&&n.m(e,null)},p(i,r){i[6]?n?n.p(i,r):(n=A(i),n.c(),n.m(e,null)):n&&(n.d(1),n=null)},d(i){i&&h(e),n&&n.d()}}}function A(o){let e;return{c(){e=H(o[7])},l(n){e=J(n,o[7])},m(n,i){E(n,e,i)},p(n,i){i&128&&K(e,n[7])},d(n){n&&h(e)}}}function te(o){let e,n,i,r,f;const t=[x,$],s=[];function l(a,u){return a[1][1]?0:1}e=l(o),n=s[e]=t[e](o);let c=o[5]&&V(o);return{c(){n.c(),i=B(),c&&c.c(),r=d()},l(a){n.l(a),i=U(a),c&&c.l(a),r=d()},m(a,u){s[e].m(a,u),E(a,i,u),c&&c.m(a,u),E(a,r,u),f=!0},p(a,[u]){let b=e;e=l(a),e===b?s[e].p(a,u):(y(),g(s[b],1,1,()=>{s[b]=null}),P(),n=s[e],n?n.p(a,u):(n=s[e]=t[e](a),n.c()),w(n,1),n.m(i.parentNode,i)),a[5]?c?c.p(a,u):(c=V(a),c.c(),c.m(r.parentNode,r)):c&&(c.d(1),c=null)},i(a){f||(w(n),f=!0)},o(a){g(n),f=!1},d(a){a&&(h(i),h(r)),s[e].d(a),c&&c.d(a)}}}function ne(o,e,n){let{stores:i}=e,{page:r}=e,{constructors:f}=e,{components:t=[]}=e,{form:s}=e,{data_0:l=null}=e,{data_1:c=null}=e;j(i.page.notify);let a=!1,u=!1,b=null;W(()=>{const _=i.page.subscribe(()=>{a&&(n(6,u=!0),M().then(()=>{n(7,b=document.title||"untitled page")}))});return n(5,a=!0),_});function N(_){I[_?"unshift":"push"](()=>{t[1]=_,n(0,t)})}function S(_){I[_?"unshift":"push"](()=>{t[0]=_,n(0,t)})}function C(_){I[_?"unshift":"push"](()=>{t[0]=_,n(0,t)})}return o.$$set=_=>{"stores"in _&&n(8,i=_.stores),"page"in _&&n(9,r=_.page),"constructors"in _&&n(1,f=_.constructors),"components"in _&&n(0,t=_.components),"form"in _&&n(2,s=_.form),"data_0"in _&&n(3,l=_.data_0),"data_1"in _&&n(4,c=_.data_1)},o.$$.update=()=>{o.$$.dirty&768&&i.page.set(r)},[t,f,s,l,c,a,u,b,i,r,N,S,C]}class oe extends Q{constructor(e){super(),X(this,e,ne,te,q,{stores:8,page:9,constructors:1,components:0,form:2,data_0:3,data_1:4})}}const ae=[()=>m(()=>import("../nodes/0.bf6c27bc.js"),["..\\nodes\\0.bf6c27bc.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\navigation.2d2aeeb5.js","..\\chunks\\singletons.a08082c0.js","..\\chunks\\paths.4bb479c7.js","..\\chunks\\Auth.06c05157.js","..\\chunks\\loggedStore.1126538f.js","..\\chunks\\twoFaLockedState.1c68f5ea.js","..\\chunks\\userDataStore.1e00dd27.js","..\\assets\\0.14e7e858.css","..\\assets\\Navbar.96df01e9.css"],import.meta.url),()=>m(()=>import("../nodes/1.6709feef.js"),["..\\nodes\\1.6709feef.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\singletons.a08082c0.js","..\\chunks\\paths.4bb479c7.js"],import.meta.url),()=>m(()=>import("../nodes/2.fe26f230.js"),["..\\nodes\\2.fe26f230.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\navigation.2d2aeeb5.js","..\\chunks\\singletons.a08082c0.js","..\\chunks\\paths.4bb479c7.js","..\\chunks\\Auth.06c05157.js","..\\chunks\\loggedStore.1126538f.js","..\\chunks\\twoFaLockedState.1c68f5ea.js","..\\chunks\\userDataStore.1e00dd27.js","..\\assets\\2.b996e85e.css","..\\assets\\Navbar.96df01e9.css"],import.meta.url),()=>m(()=>import("../nodes/3.82d348fd.js"),["..\\nodes\\3.82d348fd.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\paths.4bb479c7.js","..\\chunks\\loggedStore.1126538f.js","..\\chunks\\twoFaLockedState.1c68f5ea.js","..\\chunks\\userDataStore.1e00dd27.js","..\\chunks\\navigation.2d2aeeb5.js","..\\chunks\\singletons.a08082c0.js","..\\chunks\\GlitchyButton.6731be8a.js","..\\assets\\GlitchyButton.0a20d06b.css","..\\assets\\3.c98f7d09.css","..\\assets\\Navbar.96df01e9.css"],import.meta.url),()=>m(()=>import("../nodes/4.aaff5a03.js"),["..\\nodes\\4.aaff5a03.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\navigation.2d2aeeb5.js","..\\chunks\\singletons.a08082c0.js","..\\chunks\\paths.4bb479c7.js","..\\chunks\\each.2c88f82a.js","..\\chunks\\loggedStore.1126538f.js","..\\chunks\\userDataStore.1e00dd27.js","..\\chunks\\PleaseLogin.0f42e3fc.js","..\\chunks\\GlitchyButton.6731be8a.js","..\\assets\\GlitchyButton.0a20d06b.css","..\\assets\\PleaseLogin.77a43646.css","..\\assets\\4.1496c874.css"],import.meta.url),()=>m(()=>import("../nodes/5.9a616e71.js"),["..\\nodes\\5.9a616e71.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\each.2c88f82a.js","..\\chunks\\loggedStore.1126538f.js","..\\chunks\\paths.4bb479c7.js","..\\chunks\\userDataStore.1e00dd27.js","..\\chunks\\twoFaLockedState.1c68f5ea.js","..\\assets\\5.835cc983.css"],import.meta.url),()=>m(()=>import("../nodes/6.c6cf20af.js"),["..\\nodes\\6.c6cf20af.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\each.2c88f82a.js","..\\assets\\6.4291f90c.css"],import.meta.url),()=>m(()=>import("../nodes/7.5dbb4706.js"),["..\\nodes\\7.5dbb4706.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\assets\\7.d29bc067.css"],import.meta.url),()=>m(()=>import("../nodes/8.acee2339.js"),["..\\nodes\\8.acee2339.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\loggedStore.1126538f.js","..\\chunks\\paths.4bb479c7.js","..\\chunks\\userDataStore.1e00dd27.js","..\\chunks\\twoFaLockedState.1c68f5ea.js","..\\chunks\\data.9cfe125f.js","..\\chunks\\control.f5b05b5f.js","..\\chunks\\navigation.2d2aeeb5.js","..\\chunks\\singletons.a08082c0.js","..\\chunks\\PleaseLogin.0f42e3fc.js","..\\chunks\\GlitchyButton.6731be8a.js","..\\assets\\GlitchyButton.0a20d06b.css","..\\assets\\PleaseLogin.77a43646.css","..\\assets\\8.4a7179cf.css","..\\assets\\Navbar.96df01e9.css"],import.meta.url),()=>m(()=>import("../nodes/9.559d4eb6.js"),["..\\nodes\\9.559d4eb6.js","..\\chunks\\scheduler.33b54330.js","..\\chunks\\index.3452823c.js","..\\chunks\\navigation.2d2aeeb5.js","..\\chunks\\singletons.a08082c0.js","..\\chunks\\paths.4bb479c7.js","..\\chunks\\data.9cfe125f.js","..\\chunks\\control.f5b05b5f.js","..\\chunks\\userDataStore.1e00dd27.js","..\\assets\\9.5e9e363f.css"],import.meta.url)],le=[],fe={"/":[2],"/2fa":[3],"/chat":[-5],"/chat/dm":[-6],"/chat/rooms":[6],"/game":[7],"/profile":[8],"/profile/[nickname]":[9]},ce={handleError:({error:o})=>{console.error(o)}};export{fe as dictionary,ce as hooks,se as matchers,ae as nodes,oe as root,le as server_loads};
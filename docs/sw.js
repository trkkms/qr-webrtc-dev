if(!self.define){let e,i={};const n=(n,t)=>(n=new URL(n+".js",t).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let r={};const c=e=>n(e,o),d={module:{uri:o},exports:r,require:c};i[o]=Promise.all(t.map((e=>d[e]||c(e)))).then((e=>(s(...e),r)))}}define(["./workbox-21445d85"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"5e1d0a6c58b9cccd7ce192823f4b6dbe"},{url:"icons/48x48.png",revision:"f53744d7c290ee1c25493abc722c94ea"},{url:"manifest.webmanifest",revision:"e722e922726b3e459571314f91dce49d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

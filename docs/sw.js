if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,d)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let t={};const o=e=>i(e,r),f={module:{uri:r},exports:t,require:o};s[r]=Promise.all(n.map((e=>f[e]||o(e)))).then((e=>(d(...e),t)))}}define(["./workbox-21445d85"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.ad4495dd.js",revision:"f0fe2a845cf9762c4bb69ed010f1500a"},{url:"assets/vendor.36d518d7.js",revision:"1a4f0b6912158ea7b9502d1de653da12"},{url:"index.html",revision:"de88d6f9faf876019589d2e4d977b56a"},{url:"icons/48x48.png",revision:"f53744d7c290ee1c25493abc722c94ea"},{url:"manifest.webmanifest",revision:"e722e922726b3e459571314f91dce49d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

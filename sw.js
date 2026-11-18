const C='madrasehyar-v19',F='fonts-madrasehyar',A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
// Install: always download fresh copies (cache:'reload' skips the browser HTTP cache, so an old index.html can never be re-stored as the "new" version).
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error('sw install: '+u);return c.put(u,r)})))));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('madrasehyar-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
const isFont=u=>u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
// Same-origin files: answer instantly from cache (works offline) and refresh the cache from the network in the background,
// so a newly deployed version is picked up on the next launch even if sw.js itself did not change.
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(isFont(u)){e.respondWith(caches.open(F).then(async c=>{const m=await c.match(r);if(m)return m;try{const x=await fetch(r);if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}catch(err){return Response.error()}}));return}
 if(u.origin!==location.origin)return;
 e.respondWith(caches.open(C).then(async c=>{
  const m=await c.match(r,{ignoreSearch:r.mode==='navigate'});
  const net=fetch(r,{cache:'no-cache'}).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x}).catch(()=>null);
  if(m){e.waitUntil(net);return m}
  const x=await net;if(x)return x;
  if(r.mode==='navigate'){const h=await c.match('./index.html');if(h)return h}
  return Response.error();
 }));
});

const C='madrasehyar-v13',F='fonts-madrasehyar',A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('madrasehyar-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
const isFont=u=>u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
// Offline-first: always answer from cache; the network is used only when the cache has no copy
// (first install, or after browser data was cleared). Updates arrive through a new sw.js version (bump C).
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(isFont(u)){e.respondWith(caches.open(F).then(async c=>{const m=await c.match(r);if(m)return m;try{const x=await fetch(r);if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}catch(err){return Response.error()}}));return}
 if(u.origin!==location.origin)return;
 e.respondWith(caches.open(C).then(async c=>{
  const m=await c.match(r,{ignoreSearch:r.mode==='navigate'});if(m)return m;
  try{const x=await fetch(r);if(x&&x.ok)c.put(r,x.clone());return x}
  catch(err){if(r.mode==='navigate'){const h=await c.match('./index.html');if(h)return h}return Response.error()}
 }));
});

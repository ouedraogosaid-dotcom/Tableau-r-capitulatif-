/* Registre récapitulatif — cache hors ligne */
var CACHE = "registre-v2";
var FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FICHIERS); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(noms){
    return Promise.all(noms.map(function(n){ return n === CACHE ? null : caches.delete(n); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  if(new URL(req.url).origin !== self.location.origin) return;   // polices Google : réseau seul
  e.respondWith(
    caches.match(req).then(function(rep){
      if(rep) return rep;
      return fetch(req).then(function(net){
        var copie = net.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copie); });
        return net;
      }).catch(function(){ return caches.match("./index.html"); });
    })
  );
});

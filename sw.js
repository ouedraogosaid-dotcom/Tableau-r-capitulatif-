/* Registre récapitulatif — cache hors ligne
   - pages (navigation) : réseau d'abord, cache en secours → les mises à jour arrivent sans changer CACHE ;
   - autres fichiers : cache d'abord, rafraîchi en arrière-plan. */
var CACHE = "registre-v7";
var FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FICHIERS); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(noms){
    return Promise.all(noms.map(function(n){ return n === CACHE ? null : caches.delete(n); }));
  }).then(function(){ return self.clients.claim(); }));
});

function mettreEnCache(req, rep){
  if(rep && rep.ok && rep.type === "basic"){
    var copie = rep.clone();
    caches.open(CACHE).then(function(c){ c.put(req, copie); });
  }
  return rep;
}

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  if(new URL(req.url).origin !== self.location.origin) return;   // polices Google : réseau seul

  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(function(net){ return mettreEnCache(req, net); }).catch(function(){
        return caches.match(req).then(function(rep){ return rep || caches.match("./index.html"); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function(rep){
      var reseau = fetch(req).then(function(net){ return mettreEnCache(req, net); });
      if(rep){ e.waitUntil(reseau.catch(function(){})); return rep; }
      return reseau;
    })
  );
});

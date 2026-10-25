/*
 * O NaviGO mudou para https://usenavigo.github.io/navigo/app/. Este service worker substitui o
 * antigo: apaga o cache deste endereço, se desliga e leva as abas abertas para o endereço novo.
 */
self.addEventListener('install', function () {
  self.skipWaiting();
});
self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      await self.registration.unregister();
      var list = await self.clients.matchAll({ type: 'window' });
      list.forEach(function (c) {
        var u = new URL(c.url);
        c.navigate('https://usenavigo.github.io' + u.pathname + u.search + u.hash).catch(function () {});
      });
    })(),
  );
});

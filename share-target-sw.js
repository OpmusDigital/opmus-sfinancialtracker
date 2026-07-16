// Receipt share target — imported by BOTH service workers.
//
// index.html registers sw.js and firebase-messaging-sw.js at the SAME scope, so
// whichever one registered last is the worker actually controlling the page.
// Rather than depend on that order (it flips depending on whether push is on),
// both import this file, so a shared receipt always lands.
//
// manifest.json points share_target at ./share-receipt — a URL with nothing
// behind it on the server. The handler below answers it before it ever reaches
// the network. Every other request is ignored outright: no respondWith, no
// caching, no interception, so normal page loads behave exactly as before.

var MFT_SHARE_CACHE = 'mft-shared-receipt';
var MFT_SHARE_ITEM  = 'shared-receipt-file';

self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'POST') return;              // every GET is none of our business
  var path;
  try { path = new URL(req.url).pathname; } catch (e) { return; }
  if (!/\/share-receipt\/?$/.test(path)) return;  // not our URL — leave it alone
  event.respondWith(mftHandleReceiptShare(req));
});

function mftHandleReceiptShare(request) {
  var back = new URL('./?shared=receipt', self.registration.scope).href;
  return request.formData().then(function(form) {
    var file = form.get('receipt');
    if (!file || !file.size) return null;
    return caches.open(MFT_SHARE_CACHE).then(function(cache) {
      return cache.put(
        new URL(MFT_SHARE_ITEM, self.registration.scope).href,
        new Response(file, { headers: { 'Content-Type': file.type || 'image/jpeg' } })
      );
    });
  }).catch(function() {
    return null; // a bad share must never strand the user on a browser error page
  }).then(function() {
    // 303 so the browser re-issues as GET; the app picks the file up from cache.
    return Response.redirect(back, 303);
  });
}

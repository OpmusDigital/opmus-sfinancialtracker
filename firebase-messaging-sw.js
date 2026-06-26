// Firebase Cloud Messaging service worker — handles BACKGROUND push
// notifications (delivered even when the app/tab is fully closed).
//
// This file MUST sit next to index.html and keep this exact filename so the
// Firebase Messaging SDK can find it. It is separate from sw.js (the PWA
// install / local-notification worker) and they coexist fine.
//
// The scheduled Cloud Function sends a "webpush.notification" message; the FCM
// SDK below auto-displays it. We only add a click handler to focus/open the app.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCgy7j7u1dO-c-_NUBpX5-OweQA2YxlG24",
  authDomain:        "my-financial-tracker-b473e.firebaseapp.com",
  projectId:         "my-financial-tracker-b473e",
  storageBucket:     "my-financial-tracker-b473e.firebasestorage.app",
  messagingSenderId: "1034537453068",
  appId:             "1:1034537453068:web:fa89242f982c35278e1029"
});

// Initialising messaging is what registers FCM's internal push handler, which
// auto-displays any incoming "notification" message while in the background.
firebase.messaging();

// When a pushed notification is tapped, focus an open tab or open the app.
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var link = (event.notification.data && event.notification.data.FCM_MSG &&
              event.notification.data.FCM_MSG.notification &&
              event.notification.data.FCM_MSG.notification.click_action) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      for (var i = 0; i < clients.length; i++) {
        if ('focus' in clients[i]) return clients[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(link);
    })
  );
});

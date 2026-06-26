// Firebase Cloud Messaging service worker — handles BACKGROUND push
// notifications (delivered even when the app/tab is fully closed).
//
// This file MUST sit next to index.html and keep this exact filename so the
// Firebase Messaging SDK can find it. It is separate from sw.js (the PWA
// install / local-notification worker) and they coexist fine.
//
// The scheduled Cloud Function sends a "webpush.notification" message; the FCM
// SDK below auto-displays it AND handles taps (opening the link from the
// message's fcmOptions). We deliberately don't add our own notificationclick
// handler — the SDK already registers one, and adding a second can open two tabs.

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

// Initialising messaging registers FCM's internal push + notification-click
// handlers, which auto-display incoming "notification" messages while the app
// is in the background and open the app when the notification is tapped.
firebase.messaging();

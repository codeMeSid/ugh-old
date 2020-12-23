importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js");
if (!firebase.apps.length) {
  const app = firebase.initializeApp({
    apiKey: "AIzaSyCSXN_s65RoG7CtnHCexpZ_UQkBvkN8OEA",
    authDomain: "ultimategamershub.firebaseapp.com",
    databaseURL: "https://ultimategamershub.firebaseio.com",
    projectId: "ultimategamershub",
    storageBucket: "ultimategamershub.appspot.com",
    messagingSenderId: "286356059040",
    appId: "1:286356059040:web:ab0ca6afd29f31ff65aac5",
    measurementId: "G-MB4E67PEG4",
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    const {
      notification: { title, body },
    } = payload;
    self.registration.showNotification(title, { body, icon: "/favicon.ico" });
  });
}

importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");
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
  const messenger = firebase.messaging(app);
  //background notifications will be received here
  messenger.onBackgroundMessage((payload) =>
    console.log({ messengerSw: payload })
  );
}

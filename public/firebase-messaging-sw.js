// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyA193djmTxALqrGHA7fBYImTnS-fArLtgk",
  authDomain: "docmedilink.firebaseapp.com",
  projectId: "docmedilink",
  storageBucket: "docmedilink.appspot.com",
  messagingSenderId: "653716766364",
  appId: "1:653716766364:web:119eb7d7aadf38fb0bb759",
  measurementId: "G-B36V24QGTG"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background for docmedilink ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './images/logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
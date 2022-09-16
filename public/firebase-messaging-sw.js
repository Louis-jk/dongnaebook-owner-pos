importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js");
// self.importScripts(
//   "./firebase/8.7.1/firebase-app.js",
//   "./firebase/8.7.1/firebase-messaging.js"
// );
// import "./firebase/8.7.1/firebase-app";
// import "./firebase/8.7.1/firebase-messaging";

// 경로 로컬 경로로 수정 테스트 후 일렉트론 빌드 테스트 예정

var firebaseConfig = {
  apiKey: "AIzaSyBOyroyao3fp4wbGG8N4oFWx6zmrkH2vzg",
  authDomain: "ohjoo-60a6b.firebaseapp.com",
  projectId: "ohjoo-60a6b",
  storageBucket: "ohjoo-60a6b.appspot.com",
  messagingSenderId: "915859720833",
  appId: "1:915859720833:web:4666f3e4fc29721ceb5b80",
  measurementId: "G-XR06Y931MJ",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

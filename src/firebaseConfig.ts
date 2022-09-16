import firebase from 'firebase';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBOyroyao3fp4wbGG8N4oFWx6zmrkH2vzg",
  authDomain: "ohjoo-60a6b.firebaseapp.com",
  projectId: "ohjoo-60a6b",
  storageBucket: "ohjoo-60a6b.appspot.com",
  messagingSenderId: "915859720833",
  appId: "1:915859720833:web:4666f3e4fc29721ceb5b80",
  measurementId: "G-XR06Y931MJ"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


//  자동 토큰 저장
const storeAddToken = async (token: string) => {
  try {
    const jsonValue = JSON.stringify({ token: token });
    await localStorage.setItem('ohjooStoreToken', jsonValue);
  } catch (e) {
    alert(`${e} :: 관리자에게 문의하세요.`);
  }
};

export const getToken = (setTokenFound: any) => {

  return messaging
    .getToken({
      vapidKey:
        "BNpwEkkuvtHBGdBUbdlNaCl8VfIBS4VmQlPqXJgu8H3W1DB2MuuXUAEjAEv7BbEuQGKAJSw0ZoZY-BwDrNJt5as",
    })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        setTokenFound(currentToken);
        storeAddToken(currentToken);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound('');
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
const { contextBridge, ipcRenderer } = require('electron');

// 알림 사운드 종류
const audio01 = new Audio(
  'https://dmonster1452.cafe24.com/api/ohjoo_sound_10.mp3'
);
const audio02 = new Audio(
  'https://dmonster1452.cafe24.com/api/ohjoo_sound_20.mp3'
);
const audio03 = new Audio(
  'https://dmonster1452.cafe24.com/api/ohjoo_sound_30.mp3'
);

// 알림 사운드 횟수 받기(메인 프로세서로부터)
let soundCount = '';

ipcRenderer.on('get_sound_count', (event, data) => {
  console.log('get_sound_count ?', data);
  soundCount = data;
});

ipcRenderer.on('get_sound_vol', (event, data) => {
  console.log('get_sound_vol ?', data);
  audio01.volume = data;
  audio02.volume = data;
  audio03.volume = data;
});

// 알림 끄기 (주문 접수시)
ipcRenderer.on('get_stop_sound', (event, data) => {
  audio01.pause();
  audio01.currentTime = 0;
  audio02.pause();
  audio02.currentTime = 0;
  audio03.pause();
  audio03.currentTime = 0;
});

// firebase 알림 받기
const {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED,
} = require('electron-push-receiver/src/constants');

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
  console.log('service successfully started', token);
  ipcRenderer.send('fcmToken', token);
  // console.log('_ :: NOTIFICATION_SERVICE_STARTED', _);
});

// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log('notification error', error);
});

// Send FCM token to backend
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  console.log('token updated', token);
});

// Display notification
ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
  // check to see if payload contains a body string, if it doesn't consider it a silent push
  if (serverNotificationPayload.notification.body) {
    // payload has a body, so show it to the user
    // console.log('display notification', serverNotificationPayload)
    let myNotification = new Notification(
      serverNotificationPayload.notification.title,
      {
        body: serverNotificationPayload.notification.body,
        silent: true,
        icon: '../build/icons/png/64x64.png',
        image: '../build/icons/png/64x64.png',
      }
    );
    if (soundCount === '1') {
      audio01.play();
    } else if (soundCount === '2') {
      audio02.play();
    } else {
      audio03.play();
    }
    myNotification.onclick = () => {
      console.log('Notification clicked');
    };
  } else {
    // payload has no body, so consider it silent (and just consider the data portion)
    console.log(
      'do something with the key/value pairs in the data',
      serverNotificationPayload.data
    );
  }
});

// Start service
const senderId = '915859720833'; // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
console.log('starting service and registering a client');
ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId);

// preload와 electron 브릿지 ()
contextBridge.exposeInMainWorld('appRuntime', {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, data: any) => {
    ipcRenderer.on(channel, data);
  },
  subscribe: (channel: string, listener: any) => {
    const subscription = (event: any, ...args: any) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});

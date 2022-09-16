import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

// Material UI Components
import { ThemeProvider } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

// Local Component
import { getToken, onMessageListener } from './firebaseConfig';
import { theme } from './styles/base';
import './App.css';
import Routes from './routes';
import Api from './Api';
import * as orderAction from './redux/actions/orderAction';
import appRuntime from './appRuntime';

function App() {
  const dispatch = useDispatch();
  const { mt_id, mt_jumju_code, mt_alarm_vol } = useSelector(
    (state: any) => state.login
  );
  const { isChecked } = useSelector((state: any) => state.checkOrder);
  const [audio] = React.useState(
    new Audio('https://dmonster1452.cafe24.com/api/sound.mp3')
  );
  const [notification, setNotification] = React.useState({
    title: '',
    body: '',
  });
  const [isTokenFound, setTokenFound] = React.useState(false);

  // 알림 스톱 핸들러
  const alarmStopHandler = () => {
    appRuntime.send('sound_stop', 'stop alarm');
  };

  // 접수처리시 알림 스톱 : web 테스트시 끄기
  // useEffect(() => {
  //   alarmStopHandler();
  // }, [isChecked]);

  // 현재 신규주문 건수 가져오기
  const getNewOrderHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '신규주문',
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('push 신규주문 success?', arrItems);
        dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)));
      } else {
        console.log('push 신규주문 faild?', arrItems);
        dispatch(orderAction.updateNewOrder(null));
      }
    });
  };

  const handleClick = (title: string, body: string) => {
    toast.custom(
      <Box
        borderRadius={3}
        py={2}
        px={3}
        boxShadow='0 2px 5px 0 rgba(0,0,0,0.2)'
        minWidth={200}
        style={{ backgroundColor: theme.palette.primary.dark }}
      >
        <Typography variant='h6' component='h6' color='#fff' mb={1}>
          [메뉴] {title}
        </Typography>
        <Typography color='#fff'>{body}</Typography>
      </Box>,
      {
        duration: 4000,
        position: 'bottom-right',
        style: { backgroundColor: theme.palette.primary.main, color: '#fff' },
        className: '',
        icon: '👏',
        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      }
    );

    audio.volume = mt_alarm_vol;
    audio.play();
  };

  getToken(setTokenFound);

  onMessageListener()
    .then((payload: any) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      getNewOrderHandler();
      handleClick(payload.notification.title, payload.notification.body);
      // console.log(payload);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
      <Toaster gutter={5} />
    </React.StrictMode>
  );
}

export default App;

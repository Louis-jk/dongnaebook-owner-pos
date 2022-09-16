import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Material UI Components
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Api from '../Api';
import * as loginAction from '../redux/actions/loginAction';
import { baseStyles, theme } from '../styles/base';


export default function Check() {

  const base = baseStyles();
  const dispatch = useDispatch();
  const history = useHistory();


  const onLoginHandler = (id: string, pwd: string, token: string) => {

    const param = {
      mt_id: id,
      mt_pwd: pwd,
      mt_app_token: token
    };

    Api.send('store_login', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)));
        dispatch(loginAction.updateToken(arrItems.mt_app_token));
        history.replace('/main');
      } else {
        // alert('회원정보가 일치하지 않습니다.');
        history.replace('/login');
      }
    });
  };

  // 유저 정보 가져오기(자동로그인?)
  const getStorage = () => {
    try {
      const getUser = localStorage.getItem('userAccount');
      const getToken = localStorage.getItem('ohjooStoreToken');
      if (getUser !== null && getToken !== null) {
        console.log('유저 정보 가져오기 :: ', JSON.parse(getUser));

        const UserInfo = JSON.parse(getUser);
        const userId = UserInfo.userId;
        const userPwd = UserInfo.userPwd;

        const jsonToken = JSON.parse(getToken);
        const storageToken = jsonToken.token;

        console.log('userId :', userId);
        console.log('userPwd :', userPwd);
        console.log('storageToken :', storageToken);

        onLoginHandler(userId, userPwd, storageToken);
      } else {
        console.log("유저 정보 못가져옴");
        history.push('/login');
      }
    } catch (err) {
      console.log('로컬 스토리지에 저장된 회원 정보 없음');
      history.push('/login');
    }
  }

  useEffect(() => {
    getStorage();
  }, [])


  return (
    <Box className={base.loadingWrap} style={{ flexDirection: 'column', backgroundColor: theme.palette.primary.main, height: '100vh' }}>
      <CircularProgress disableShrink color="secondary" style={{ width: 50, height: 50, marginBottom: 20 }} />
      <Typography style={{ color: theme.palette.primary.contrastText }}>체크중</Typography>
    </Box>
  )
}
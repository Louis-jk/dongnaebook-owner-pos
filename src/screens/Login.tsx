import * as React from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Material UI Components
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Button,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

// Material UI Icons
import CloseIcon from '@material-ui/icons/Close';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import MinimizeIcon from '@material-ui/icons/Minimize';

// Local Component
import Logo from '../assets/images/logo_bk.png';
import Api from '../Api';
import * as loginAction from '../redux/actions/loginAction';
import { getToken, onMessageListener } from '../firebaseConfig';
import { LoginContainer, baseStyles, LoginButton } from '../styles/base';
import appRuntime from '../appRuntime';

interface State {
  email: string;
  password: string;
  isAutoLogin: boolean;
  showPassword: boolean;
}

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const base = baseStyles();

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const [token, setToken] = React.useState('');
  const [values, setValues] = React.useState<State>({
    email: '',
    password: '',
    isAutoLogin: false,
    showPassword: false,
  });

  // tooltip
  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#222',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#222',
    },
  }));

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickAutoLogin = () => {
    setValues({ ...values, isAutoLogin: !values.isAutoLogin });
  };

  // 자동 로그인 처리
  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify({
        userId: values.email,
        userPwd: values.password,
      });
      await localStorage.setItem('userAccount', jsonValue);
    } catch (e) {
      alert(`${e} :: 관리자에게 문의하세요.`);
    }
  };

  //  자동 토큰 저장
  const storeAddToken = async (token: string) => {
    try {
      const jsonValue = JSON.stringify({ token: token });
      await localStorage.setItem('ohjooStoreToken', jsonValue);
    } catch (e) {
      alert(`${e} :: 관리자에게 문의하세요.`);
    }
  };

  const onLoginHandler = () => {
    // setLoading(true);

    const param = {
      mt_id: values.email,
      mt_pwd: values.password,
      mt_device: 'pos',
      mt_pos_token: token,
    };

    // console.log("로그인 params", param);

    Api.send('store_login', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        if (values.isAutoLogin) {
          storeData();
        }
        console.log('login arrItems', arrItems);
        storeAddToken(token);
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)));
        dispatch(loginAction.updateToken(token));
        // appRuntime.send('sound_count', arrItems.mt_sound); // 알림 사운드 횟수 보내기 : web 테스트시 끄기
        // appRuntime.send('sound_volume', arrItems.mt_alarm_vol); // 알림 사운드 VOLUME 보내기 : web 테스트시 끄기`
        history.replace('/main');
        setValues({
          ...values,
          email: '',
          password: '',
        });
        // setLoading(false);
      } else {
        // setLoading(false);
        alert('회원정보가 일치하지 않습니다.');
      }
    });
  };

  const getElectronToken = () => {
    // 메인 프로세서 토큰 호출
    appRuntime.send('callToken', 'call');

    // 메인프로세서로부터 토큰 값 받기
    appRuntime.on('electronToken', (event: any, data: any) => {
      setToken(data);
      console.log('token', data);
    });
  };

  React.useEffect(() => {
    getToken(setToken);
    // getElectronToken(); // 일렉트론 빌드시 토큰 가져오기 : web 테스트시 끄기
  }, []);

  // 윈도우 닫기 핸들러
  const windowCloseHandler = () => {
    appRuntime.send('windowClose', 'close');
  };

  // 윈도우 닫기 핸들러
  const windowMinimizeHandler = () => {
    appRuntime.send('windowMinimize', 'minimize');
  };

  return (
    <Box>
      {/* <Box style={{ position: 'absolute', top: 0, left: 0 }}>
        <BootstrapTooltip title="아이콘을 누르고 위치를 이동시킬 수 있습니다." placement='right'>
          <IconButton className={base.dragBtn}>
            <DragHandleIcon />
          </IconButton>
        </BootstrapTooltip>
      </Box> */}
      <Box style={{ position: 'absolute', top: 0, right: 0 }}>
        <BootstrapTooltip title='최소화' placement='bottom'>
          <IconButton onClick={windowMinimizeHandler}>
            <MinimizeIcon />
          </IconButton>
        </BootstrapTooltip>
        <BootstrapTooltip title='종료' placement='bottom'>
          <IconButton onClick={windowCloseHandler}>
            <CloseIcon />
          </IconButton>
        </BootstrapTooltip>
      </Box>

      <LoginContainer component='section'>
        <Box
          className={base.noDrag}
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          p={5}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            boxShadow: '0 0 15px 2px rgba(0,0,0,0.17)',
          }}
        >
          <img
            src={Logo}
            alt='오늘의 주문 로고'
            style={{ width: 150, marginBottom: 30 }}
          />
          {/* <Typography variant="h6">로그인</Typography> */}
          <Box mb={2} style={{ minWidth: 300 }}>
            <TextField
              value={values.email}
              label='아이디'
              variant='outlined'
              className={base.loginInput}
              onChange={handleChange('email')}
            />
          </Box>

          <Box mb={2} style={{ minWidth: 300 }}>
            <TextField
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              label='패스워드'
              variant='outlined'
              className={base.loginInput}
              onChange={handleChange('password')}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          <LoginButton
            variant='contained'
            className={base.w100}
            onClick={onLoginHandler}
          >
            로그인
          </LoginButton>

          <BootstrapTooltip
            title='체크 시 다음번부터 로그인 화면 없이 바로 앱을 실행시킵니다.'
            placement='bottom'
          >
            <FormControlLabel
              value='end'
              style={{ marginTop: 20 }}
              control={<Checkbox color='primary' />}
              checked={values.isAutoLogin ? true : false}
              label='자동로그인'
              labelPlacement='end'
              onClick={handleClickAutoLogin}
            />
          </BootstrapTooltip>
        </Box>
      </LoginContainer>
    </Box>
  );
}

import * as React from 'react';
import { styled, makeStyles } from '@material-ui/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import { koKR } from '@material-ui/core/locale';
// import { ko } from 'date-fns/locale';

export const theme = createTheme(
  {
    typography: {
      fontFamily: [
        'Noto Sans KR',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h5: {
        fontWeight: 'bold',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode: 'light',
      primary: {
        light: '#ffe082',
        main: '#ffc739',
        dark: '#ffa000',
        contrastText: '#1c1b30',
      },
      secondary: {
        light: '#444259',
        main: '#1c1b30',
        dark: '#000008',
        contrastText: '#fff',
      },
      info: {
        light: '#66caa4',
        main: '#309975',
        dark: '#006a49',
        contrastText: '#fff',
      },
      success: {
        light: '#CBE2B0',
        main: '#9FE6A0',
        dark: '#21BF73',
        contrastText: '#222',
      },
      error: {
        light: '#d04f3d',
        main: '#991b15',
        dark: '#640000',
        contrastText: '#fff',
      },
      warning: {
        light: '#586cca',
        main: '#1c4299',
        dark: '#001d6a',
        contrastText: '#fff',
      },
      text: {
        primary: '#222',
        secondary: '#333',
      },
    },
  },
  koKR
);

export const MainBox = styled(Box)({
  // padding: theme.spacing(3),
  // marginTop: 35,
  '-webkit-app-region': 'no-drag',
  overflowY: 'scroll',
  width: '100%',
  backgroundColor: '#fff',
  [theme.breakpoints.up('sm')]: {
    // minHeight: 'calc(100vh - 84px)',
    height: 'calc(100vh - 84px)',
    // height: '100%',
    marginTop: 64,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    // backgroundColor: theme.palette.primary.main,
  },
});

export const LoginContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  height: '100vh',
  backgroundColor: '#ffc739',
  '& .wrap': {
    minWidth: 250,
    width: '30%',
  },
});

export const LoginButton = styled(Button)({
  fontSize: '18px !important',
  fontWeight: 'bold',
  color: '#222',
  height: 48,
  border: 0,
  borderRadius: 3,
  background: 'linear-gradient(45deg, #ffc739 30%, #ffc739 90%)',
  padding: '0 30px',
  boxShadow: '0 0 5px 2px rgba(255, 220, 100, 1)',
});

export const ModalConfirmButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  color: theme.palette.primary.contrastText,
  width: 150,
  height: 50,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
  },
});

export const ModalCancelButton = styled(Button)({
  backgroundColor: '#ececec',
  borderRadius: 3,
  color: '#222',
  width: 150,
  height: 50,
  boxShadow: 'none',

  '&:hover': {
    backgroundColor: '#d6d6d6',
    borderColor: '#d6d6d6',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: '#c5c5c5',
    borderColor: '#c5c5c5',
    boxShadow: 'none',
  },
});

export const baseStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',

    '& a': {
      textDecoration: 'none',
    },
    '& ul': {
      listStyle: 'none',
    },
    '& li': {
      padding: 0,
    },
  },
  whiteBg: {
    backgroundColor: '#fff',
  },
  dragBtn: {
    cursor: 'grab',

    '&:active': {
      cursor: 'grabbing',
    },
  },
  noDrag: {
    '-webkit-app-region': 'no-drag',
  },
  loginInput: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 20,
    boxShadow: 'none',
  },
  loadingWrap: {
    display: 'flex',
    flex: 1,
    height: 'calc(100vh - 160px)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderMenuWrap: {
    display: 'grid',
    gridTemplateRows: '1fr 1fr 1fr 1fr',
    height: 'calc(100vh - 64px)',
    // paddingLeft: '15px !important'
  },
  orderMenu: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center !important',
    alignItems: 'center',
    width: '80%',
    borderTopLeftRadius: '10px !important',
    borderBottomLeftRadius: '10px !important',
  },
  count: {},
  orderMenuWrap02: {
    display: 'grid',
    gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    height: 'calc(100vh - 64px)',
    // paddingLeft: '15px !important'
  },
  orderMenu02: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center !important',
    alignItems: 'flex-start !important',
    width: '80%',
    borderTopLeftRadius: '15px !important',
    borderBottomLeftRadius: '15px !important',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flexRowStartCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexRowBetweenCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    position: 'absolute',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInner: {
    position: 'relative',
    textAlign: 'center',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: 5,
    boxShadow: 'none',
    padding: theme.spacing(3, 2, 3),
  },
  modalTitle: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginBottom: 10,
    marginTop: 0,
  },
  modalDescription: {
    marginBottom: 20,
  },
  formControl: {
    minWidth: 120,
  },
  filterForm: {
    minWidth: 80,
    width: 'auto',
  },
  formControl02: {
    minWidth: 64,
    width: '100%',
    height: 55,
    padding: '0 !important',
    borderColor: '#c4c4c4 !important',
  },
  selectControl: {
    minWidth: 64,
    width: '100%',
    height: 55,
  },
  formTextInput: {
    padding: '12.5px 14px !important',
    marginBottom: 20,
  },
  optionDeleteBtn: {
    width: '100%',
    height: 55,
    color: '#e63946 !important',
    border: '1px solid #c4c4c4 !important',
    marginLeft: '8px !important',
    padding: '0 !important',
  },
  multiTxtField: {
    fontSize: 30,
    lineHeight: 30,
  },
  fieldMargin: {
    marginBottom: 20,
  },
  w100: {
    width: '100%',
  },
  mt10: {
    marginTop: 10,
  },
  mt20: {
    marginTop: 20,
  },
  mt30: {
    marginTop: 30,
  },
  mt40: {
    marginTop: 40,
  },
  mt50: {
    marginTop: 50,
  },
  mb05: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mb20: {
    marginBottom: 20,
  },
  mb30: {
    marginBottom: 30,
  },
  mb40: {
    marginBottom: 40,
  },
  mb50: {
    marginBottom: 50,
  },
  mr10: {
    marginRight: 10,
  },
  mr20: {
    marginRight: 20,
  },
  mr30: {
    marginRight: 30,
  },
  mr40: {
    marginRight: 40,
  },
  mr50: {
    marginRight: 50,
  },
  ml10: {
    marginLeft: 10,
  },
  ml20: {
    marginLeft: 20,
  },
  ml30: {
    marginLeft: 30,
  },
  ml40: {
    marginLeft: 40,
  },
  ml50: {
    marginLeft: 50,
  },
  commantWrap: {
    borderRadius: 5,
    backgroundColor: '#f7f7f7',
    // background: "linear-gradient(45deg, #FFF6da, #FFF5DA)",
    padding: 30,
    color: '#222',
  },
  txtRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textField: {
    flex: 3,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  boxBlur: {
    boxShadow: '0px 0px 10px 0px #e5e5e5',
  },
  gradient: {
    // background: "linear-gradient(45deg, #D5ECC2, #EDF6E5, #FFF5DA)"
    background: 'linear-gradient(45deg, #f9f9f9, #fff9ea)',
  },
  border: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // boxShadow: '0px 0px 10px 0px #e5e5e5',
    boxShadow: 'none !important',
    background: 'transparent',
    '& .MuiPaper-root': {
      boxShadow: 'none',
    },
  },
  reviewPaper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 2px #f1f1f1 !important',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  title: {
    flexDirection: 'row',
    color: '#222',
  },
  reviewContent: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // minHeight: 100,
    overflow: 'hidden',
    textAlign: 'left',
    overflowY: 'scroll',
    height: 150,
    fontSize: 14,
    lineHeight: 2,
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#f7f7f7',
    // background: "linear-gradient(45deg, #FFF6da, #FFF5DA)"
  },
  reviewMultiTxtField: {
    fontSize: 30,
    lineHeight: 100,
  },
  confirmBtn: {
    minWidth: 150,
    height: 50,
    boxShadow: 'none',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 60,
    '& a': {
      textDecoration: 'none',
    },
  },
  alertStyle: {
    position: 'absolute',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  printModal: {
    display: 'block',
    width: '80mm',
    height: '160mm',
    overflow: 'auto',
    padding: 30,
    zIndex: 99999,
    backgroundColor: '#fff',
  },
});

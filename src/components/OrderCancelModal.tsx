import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

// Material UI Components
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

// Local Component
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import { cancelInitState } from '../assets/datas/orders';
import * as orderAction from '../redux/actions/orderAction';
interface IProps {
  isOpen: boolean;
  od_id: string;
  currJumjuId: string;
  currJumjuCode: string;
  handleClose: () => void;
}

export default function OrderCancelModal(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const history = useHistory();
  const base = baseStyles();
  const dispatch = useDispatch();
  const [openCancel, setOpenCancel] = useState(false); // 접수 완료 -> 주문 취소
  const [cancelValue, setCancelValue] = useState(''); // 접수 완료 -> 주문 취소 사유 선택
  const [cancelEtc, setCancelEtc] = useState(''); // 접수 완료 -> 주문 취소 사유 '기타' 직접 입력 값
  const cancelRef = useRef<HTMLDivElement | null>(null); // 접수 완료 -> 주문 취소 textField Reference

  // Toast(Alert) 관리
  const [toastState, setToastState] = useState({
    msg: '',
    severity: ''
  });
  const [openAlert, setOpenAlert] = useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // 접수완료 상태 -> 주문 취소 모달 핸들러
  const handleOpenCancel = () => {
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setCancelValue('');
    setCancelEtc('');
    setOpenCancel(false);
  };

  const checkCancelHandler = () => {
    handleOpenCancel();
  }

  // 현재 접수완료 주문 가져오기
  const getCheckOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '접수완료'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("접수완료 success?", arrItems);
        dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems)));
      } else {
        console.log("접수완료 faild?", arrItems);
        dispatch(orderAction.updateCheckOrder(null));
      }
    });
  }

  // 접수완료 상태 -> 주문 취소 핸들러
  const cancelHandler = (payload: string) => {
    if (payload === '5') {
      console.log("payload is ::", payload);
      cancelRef.current?.focus();
    }
    setCancelValue(payload);
  }

  // 접수완료 주문 취소 
  const sendCancelHandler = () => {
    if (cancelValue === '') {
      setToastState({ msg: '취소 사유를 선택 또는 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (cancelValue === '5' && cancelEtc === '') {
      setToastState({ msg: '기타 입력 항목에 이유를 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      let result;
      if (cancelValue !== '5') {
        let filtered = cancelInitState.filter(item => item.value === cancelValue);
        result = filtered[0].label;
      } else {
        result = cancelEtc;
      }

      let param = {
        od_id: props.od_id,
        jumju_id: props.currJumjuId,
        jumju_code: props.currJumjuCode,
        mode: 'cancle',
        od_cancle_memo: result
      };

      Api.send('store_order_cancle', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;
        if (resultItem.result === 'Y') {
          setToastState({ msg: '주문을 정상적으로 취소 처리 하였습니다.', severity: 'success' });
          handleOpenAlert();
          props.handleClose();
          getCheckOrderHandler();
          setTimeout(() => {
            history.push('/order_check');
          }, 700);
        } else {
          setToastState({ msg: '주문을 취소 처리하는데 문제가 생겼습니다.', severity: 'error' });
          handleOpenAlert();
          props.handleClose();
          getCheckOrderHandler();
        }
      });
    }
  }


  return (
    <>
      <Box className={base.alertStyle}>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={toastState.severity === 'error' ? 'error' : 'success'}>
            {toastState.msg}
          </Alert>
        </Snackbar>
      </Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={props.isOpen}
        // onClose={handleCloseCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>주문 취소 사유 등록</Typography>
            <Typography id="transition-modal-description">주문 취소 사유를 선택 또는 입력해주세요.</Typography>
            <Grid container spacing={1} style={{ margin: 20 }}>
              {cancelInitState.map((item, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <Button variant="outlined" style={{ width: '100%', padding: 10, backgroundColor: cancelValue === item.value ? theme.palette.primary.main : '#fff', color: '#222', borderColor: cancelValue === item.value ? theme.palette.primary.main : '#e6e6e6' }} onClick={() => cancelHandler(item.value)}>{item.label}</Button>
                </Grid>
              ))}
            </Grid>
            <TextField
              inputRef={cancelRef}
              value={cancelEtc}
              style={{ margin: 20 }}
              fullWidth
              id="outlined-basic"
              label="주문 취소 사유"
              variant="outlined"
              required
              onFocus={() => cancelHandler('5')}
              onChange={e => setCancelEtc(e.target.value as string)}
            />
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={sendCancelHandler}>보내기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={props.handleClose}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
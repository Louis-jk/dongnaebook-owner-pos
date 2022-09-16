import * as React from 'react';
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
import * as orderAction from '../redux/actions/orderAction';

interface IProps {
  isOpen: boolean;
  od_id: string;
  currJumjuId: string;
  currJumjuCode: string;
  handleClose: () => void;
}

export default function OrderRejectModal(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const history = useHistory();
  const base = baseStyles();
  const dispatch = useDispatch();
  const [openReject, setOpenReject] = React.useState(false); // 신규 주문 -> 주문 거부
  const [rejectValue, setRejectValue] = React.useState(''); // 신규 주문 -> 주문 거부 사유 선택
  const [rejectEtc, setRejectEtc] = React.useState(''); // 신규 주문 -> 주문 거부 사유 '기타' 직접 입력 값
  const rejectRef = React.useRef<HTMLDivElement | null>(null); // 신규 주문 -> 주문 거부 textField Reference

  // 주문 거부 선택 값
  const rejectInitState = [
    {
      label: '배달 불가 지역',
      value: '1'
    },
    {
      label: '메뉴 및 업소 정보 다름',
      value: '2'
    },
    {
      label: '재료 소진',
      value: '3'
    },
    {
      label: '배달 지연',
      value: '4'
    },
    {
      label: '고객 정보 부정확',
      value: '5'
    },
    {
      label: '기타',
      value: '6'
    },
  ]

  // Toast(Alert) 관리
  const [toastState, setToastState] = React.useState({
    msg: '',
    severity: ''
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // 현재 신규주문 건수 가져오기
  const getNewOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '신규주문'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("신규주문 success?", arrItems);
        dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)));
      } else {
        console.log("신규주문 faild?", arrItems);
        dispatch(orderAction.updateNewOrder(null));
      }
    });
  }

  // 신규주문 상태 -> 주문 거부 모달 핸들러
  const handleCloseReject = () => {
    setRejectValue('');
    setRejectEtc('');
    props.handleClose();
  };


  // 신규주문 상태 -> 주문 거부 핸들러
  const rejectHandler = (payload: string) => {
    if (payload === '6') {
      console.log("payload is ::", payload);
      rejectRef.current?.focus();
    }
    setRejectValue(payload);

  }


  // 신규주문 주문 거절
  const sendRejectHandler = () => {
    if (rejectValue === '') {
      setToastState({ msg: '거절 사유를 선택 또는 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (rejectValue === '6' && rejectEtc === '') {
      setToastState({ msg: '기타 입력 항목에 이유를 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      let result;
      if (rejectValue !== '6') {
        let filtered = rejectInitState.filter(item => item.value === rejectValue);
        result = filtered[0].label;
      } else {
        result = rejectEtc;
      }

      let param = {
        od_id: props.od_id,
        jumju_id: props.currJumjuId,
        jumju_code: props.currJumjuCode,
        mode: 'cancle',
        od_cancle_memo: result
      };

      console.log("거절처리 param", param);

      Api.send('store_order_cancle', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;
        if (resultItem.result === 'Y') {
          setToastState({ msg: '주문을 거절 처리 하였습니다.', severity: 'success' });
          handleOpenAlert();
          handleCloseReject();
          getNewOrderHandler();
          setTimeout(() => {
            history.push('/order_new');
          }, 700);
        } else {
          setToastState({ msg: '주문을 거절 처리하는데 문제가 생겼습니다.', severity: 'error' });
          handleOpenAlert();
          handleCloseReject();
          getNewOrderHandler();
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
        // onClose={handleCloseReject}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" mb={1} className={base.modalTitle}>주문 거부 사유 등록</Typography>
            <Typography id="transition-modal-description">주문 거부 사유를 선택 또는 입력해주세요.</Typography>
            <Grid container spacing={1} style={{ margin: 20 }}>
              {rejectInitState.map((item, index) => (
                <Grid key={index + item.label} item xs={6} md={4}>
                  <Button variant="outlined" style={{ width: '100%', padding: 10, backgroundColor: rejectValue === item.value ? theme.palette.primary.main : '#fff', color: '#222', borderColor: rejectValue === item.value ? '#FCDD00' : '#e6e6e6' }} onClick={() => rejectHandler(item.value)}>{item.label}</Button>
                </Grid>
              ))}
            </Grid>
            <TextField
              inputRef={rejectRef}
              value={rejectEtc}
              style={{ margin: 20 }}
              fullWidth
              id="outlined-basic"
              label="주문 거부 사유"
              variant="outlined"
              required
              onFocus={() => rejectHandler('6')}
              onChange={e => setRejectEtc(e.target.value as string)}
            />
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={sendRejectHandler}>보내기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={handleCloseReject}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
    </>
  )

}
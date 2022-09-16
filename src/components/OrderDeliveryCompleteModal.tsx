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

// Local Component
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import * as orderAction from '../redux/actions/orderAction';

interface IProps {
  isOpen: boolean;
  od_id: string;
  currJumjuId: string;
  currJumjuCode: string;
  od_type: string;
  handleClose: () => void;
}

export default function OrderDeliveryCompleteModal(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const history = useHistory();
  const base = baseStyles();
  const dispatch = useDispatch();

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

  // 현재 접수완료 주문 가져오기
  const getDeliveryOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '배달중'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("배달중 success?", arrItems);
        dispatch(orderAction.updateDeliveryOrder(JSON.stringify(arrItems)));
        getDoneOrderHandler();

      } else {
        console.log("배달중 faild?", arrItems);
        dispatch(orderAction.updateDeliveryOrder(null));
        getDoneOrderHandler();
      }
    });
  }

  // 현재 배달완료 주문 가져오기
  const getDoneOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '배달완료'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("배달완료 success?", arrItems);
        dispatch(orderAction.updateDoneOrder(JSON.stringify(arrItems)));
      } else {
        console.log("배달완료 faild?", arrItems);
        dispatch(orderAction.updateDoneOrder(null));
      }
    });
  }

  // 배달중 => 배달완료 처리 핸들러
  const sendDeliveryCompleteHandler = () => {

    let param = {
      od_id: props.od_id,
      jumju_id: props.currJumjuId,
      jumju_code: props.currJumjuCode,
      od_process_status: '배달완료',
    };

    Api.send('store_order_status_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        setToastState({ msg: '주문을 배달 완료 처리하였습니다.', severity: 'success' });
        handleOpenAlert();
        props.handleClose();
        getDeliveryOrderHandler();
        setTimeout(() => {
          history.push('/order_delivery');
        }, 700);
      } else {
        setToastState({ msg: '주문을 배달 완료 처리하는데 문제가 생겼습니다.', severity: 'error' });
        handleOpenAlert();
        props.handleClose();
        getDeliveryOrderHandler();
      }
    });
  };

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
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>배달완료</Typography>
            <Typography id="transition-modal-description" style={{ marginBottom: 20 }}>배달완료 처리를 하시겠습니까?</Typography>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={sendDeliveryCompleteHandler}>배달완료</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={props.handleClose}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
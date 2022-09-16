import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import 'moment/locale/ko';
import { withRouter, useLocation, RouteComponentProps, useParams, useHistory } from 'react-router-dom';

// Material UI Components
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

// Local Component
import Api from '../Api';
import Header from '../components/Header';
import { theme, MainBox, baseStyles, ModalConfirmButton, ModalCancelButton } from '../styles/base';
import { OrderStyles } from '../styles/custom';
import OrderCheckModal from '../components/OrderCheckModal'; // 신규주문 주문 접수 모달
import OrderRejectModal from '../components/OrderRejectModal'; // 신규주문 주문 거부 모달
import { rejectInitState, cancelInitState } from '../assets/datas/orders'; // 주문 거부/취소 리스트
import * as orderDetailAction from '../redux/actions/orderDetailAction';
import * as orderAction from '../redux/actions/orderAction';
import PrintModal from '../components/PrintModal';
import OrderDeliveryCompleteModal from '../components/OrderDeliveryCompleteModal';

interface OrderId {
  id: string;
}

interface IDetails {
  [key: string]: string;
}

interface IMenus {
  [key: string]: any[];
}

export default function OrdersDetail(od_id: string) {

  const { mt_id, mt_jumju_code, mt_store } = useSelector((state: any) => state.login);
  const { order, product, store } = useSelector((state: any) => state.orderDetail);
  const history = useHistory();
  const dispatch = useDispatch();
  const base = baseStyles();
  const orderStyle = OrderStyles();
  const params = useParams();
  const { id }: OrderId = useParams();
  // const location = useLocation();
  const { state }: any = useLocation();
  const [open, setOpen] = React.useState(false); // 신규 주문 -> 접수(배달/포장 시간 입력 모달)
  const [openDelivery, setOpenDelivery] = React.useState(false); // 접수 완료 -> 배달 | 포장 처리 모달
  const [openDone, setOpenDone] = React.useState(false); // 배달중 -> 배달완료 처리 모달
  const [openReject, setOpenReject] = React.useState(false); // 신규 주문 -> 주문 거부
  const [openCancel, setOpenCancel] = React.useState(false); // 접수 완료 -> 주문 취소

  const [detailStore, setDetailStore] = React.useState<IDetails>({});
  const [detailOrder, setDetailOrder] = React.useState<IDetails>({});
  const [detailProduct, setDetailProduct] = React.useState<IMenus[]>([]);
  const [deliveryTime, setDeliveryTime] = React.useState(''); // 신규 주문 -> 배달시간 입력
  const [rejectValue, setRejectValue] = React.useState(''); // 신규 주문 -> 주문 거부 사유 선택
  const [rejectEtc, setRejectEtc] = React.useState(''); // 신규 주문 -> 주문 거부 사유 '기타' 직접 입력 값
  const [cancelValue, setCancelValue] = React.useState(''); // 접수 완료 -> 주문 취소 사유 선택
  const [cancelEtc, setCancelEtc] = React.useState(''); // 접수 완료 -> 주문 취소 사유 '기타' 직접 입력 값
  const rejectRef = React.useRef<HTMLDivElement | null>(null); // 신규 주문 -> 주문 거부 textField Reference
  const cancelRef = React.useRef<HTMLDivElement | null>(null); // 접수 완료 -> 주문 취소 textField Reference

  const [odId, setOdId] = React.useState('');
  const [odType, setOdType] = React.useState('');

  console.log('detail params >>>>>>', params);
  console.log('detail location.state >>>>>>', state);
  console.log('detail state jumju_id >>>>>>', state.jumju_id);
  console.log('detail state jumju_code >>>>>>', state.jumju_code);


  // 프린트 모달
  const [printOpen, setPrintOpen] = React.useState(false);
  const openPrintModal = () => {
    setPrintOpen(true);
  }

  const closePrintModal = () => {
    setPrintOpen(false);
  }

  const handlePrint02 = () => {
    openPrintModal();
  }

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

  // 주문 디테일 정보 가져오기
  const getOrderDetailHandler = (jumjuId: string, jumjuCode: string) => {

    console.log('jumjuId', jumjuId);
    console.log('jumjuCode', jumjuCode);

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_id: id
    };
    Api.send('store_order_detail', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('디테일 arrItems', arrItems);
        dispatch(orderDetailAction.updateOrderDetail(JSON.stringify(arrItems)));
        setDetailStore(arrItems.store);
        setDetailOrder(arrItems.order);
        setDetailProduct(arrItems.orderDetail);
      } else {
        console.log("faild?", arrItems)
        alert('주문 정보를 받아올 수 없습니다.')
        setDetailStore({});
        setDetailOrder({});
        setDetailProduct([]);
      }
    });
  }

  React.useEffect(() => {

    console.log('state.jumju_id >>', state.jumju_id);
    console.log('state.jumju_code >>', state.jumju_code);

    getOrderDetailHandler(state.jumju_id, state.jumju_code);

  }, [])

  // 신규주문 상태 -> 접수(배달/포장 시간 입력) 모달 핸들러
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeliveryTime('');
    closePrintModal();
  };

  const newFn = () => {
    handleOpen();
  }
  const checkOrderHandler = (id: string, type: string) => {
    setOdId(id);
    setOdType(type);
    handleOpen();
  }

  // 신규주문 상태 -> 주문 거부 모달 핸들러
  const handleOpenReject = () => {
    setOpenReject(true);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
    setRejectValue('');
    setRejectEtc('');
  };

  const newRejectHandler = () => {
    handleOpenReject();
  }


  // 접수완료 상태 -> 주문 취소 모달 핸들러
  const handleOpenCancel = () => {
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
    setCancelValue('');
    setCancelEtc('');
  };

  const checkCancelHandler = () => {
    handleOpenCancel();
  }


  // 접수완료 상태 -> 주문 취소 핸들러
  const cancelHandler = (payload: string) => {
    if (payload === '5') {
      console.log("payload is ::", payload);
      cancelRef.current?.focus();
    }
    setCancelValue(payload);
  }

  // 접수완료 상태 -> 배달처리 | 포장처리 핸들러
  const handleOpenDelivery = () => {
    setOpenDelivery(true);
  };

  const handleCloseDelivery = () => {
    setOpenDelivery(false);
  };

  // 배달중 -> 배달완료 처리 핸들러
  const handleOpenDone = () => {
    setOpenDone(!openDone);
  }

  // 신규주문 -> 주문 거부 모달 핸들러
  const [rejectOopen, setRejectOpen] = React.useState(false);
  const handleRejectOpen = () => {
    setRejectOpen(true);
  };

  const handleRejectClose = () => {
    setRejectOpen(false);
  };

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
        dispatch(dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems))));
        getDeliveryOrderHandler();

      } else {
        console.log("접수완료 faild?", arrItems);
        dispatch(dispatch(orderAction.updateCheckOrder(null)));
        getDeliveryOrderHandler();
      }
    });
  }

  // 현재 배달중 주문 가져오기
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
        dispatch(dispatch(orderAction.updateDeliveryOrder(JSON.stringify(arrItems))));
      } else {
        console.log("배달중 faild?", arrItems);
        dispatch(dispatch(orderAction.updateDeliveryOrder(null)));
      }
    });
  }

  // 배달처리 (접수완료 -> 배달 중 상태)
  const sendDeliveryHandler = () => {

    let param = {
      od_id: id,
      jumju_id: state.jumju_id,
      jumju_code: state.jumju_code,
      od_process_status: detailOrder.od_type === '배달' ? '배달중' : '포장완료',
    };

    Api.send('store_order_status_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        setToastState({ msg: '주문을 배달 처리하였습니다.', severity: 'success' });
        handleOpenAlert();
        handleCloseDelivery();
        getCheckOrderHandler();
        setTimeout(() => {
          history.push('/order_check');
        }, 700);
      } else {
        setToastState({ msg: '주문을 배달 처리하는데 문제가 생겼습니다.', severity: 'error' });
        handleOpenAlert();
        handleCloseDelivery();
        getCheckOrderHandler();
      }
    });
  };

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
        od_id: id,
        jumju_id: state.jumju_id,
        jumju_code: state.jumju_code,
        mode: 'cancle',
        od_cancle_memo: result
      };

      Api.send('store_order_cancle', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;
        if (resultItem.result === 'Y') {
          setToastState({ msg: '주문을 정상적으로 취소 처리 하였습니다.', severity: 'success' });
          handleOpenAlert();
          handleCloseCancel();
          getCheckOrderHandler();
          setTimeout(() => {
            history.push('/order_check');
          }, 700);
        } else {
          setToastState({ msg: '주문을 취소 처리하는데 문제가 생겼습니다.', severity: 'error' });
          handleOpenAlert();
          handleCloseCancel();
          getCheckOrderHandler();
        }
      });
    }
  }

  console.log("detailOrder", detailOrder);

  return (
    <Box component="div" className={base.root}>
      <PrintModal isOpen={printOpen} isClose={closePrintModal} />
      {detailOrder ?
        <Header
          detail={
            detailOrder.od_process_status === '신규주문' ? 'order_new'
              : detailOrder.od_process_status === '접수완료' && detailOrder.od_type === '배달' ? 'order_check_delivery'
                : detailOrder.od_process_status === '접수완료' && detailOrder.od_type === '포장' ? 'order_check_takeout'
                  : detailOrder.od_process_status === '배달중' ? 'order_delivery'
                    : detailOrder.od_process_status === '배달완료' || '포장완료' ? 'order_done'
                      : null}
          action={
            detailOrder.od_process_status === '신규주문' ? () => newFn()
              : detailOrder.od_process_status === '접수완료' ? () => handleOpenDelivery()
                : detailOrder.od_process_status === '배달중' ? () => handleOpenDone()
                  : () => { return false }
          }
          action02={
            detailOrder.od_process_status === '신규주문' ? () => handleRejectOpen()
              : detailOrder.od_process_status === '접수완료' ? () => checkCancelHandler()
                : () => { return false }
          }
        />
        : null}
      {/* <Header detail='order' /> */}

      {detailOrder && state.jumju_id && state.jumju_code ?
        <>
          <OrderCheckModal isOpen={open} od_id={id} currJumjuId={state.jumju_id} currJumjuCode={state.jumju_code} od_type={detailOrder.od_type} handleClose={handleClose} />
          <OrderRejectModal isOpen={rejectOopen} od_id={id} currJumjuId={state.jumju_id} currJumjuCode={state.jumju_code} handleClose={handleRejectClose} />
        </>
        : null}
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

      {/* 접수하기 모달(예상 배달시간 입력 폼) */}
      {detailOrder &&
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={base.modal}
          open={openDelivery}
          // onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openDelivery}>
            <Box className={clsx(base.modalInner, base.colCenter)}>
              <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>{detailOrder.od_type === '배달' ? '배달처리' : '포장완료'}</Typography>
              <Typography id="transition-modal-description" style={{ marginBottom: 20 }}>{detailOrder.od_type === '배달' ? '배달처리' : '포장완료 처리'}를 하시겠습니까?</Typography>
              <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={sendDeliveryHandler}>{detailOrder.od_type === '배달' ? '배달처리' : '포장완료'}</ModalConfirmButton>
                <ModalConfirmButton variant="outlined" onClick={handleCloseDelivery}>취소</ModalConfirmButton>
              </ButtonGroup>
            </Box>
          </Fade>
        </Modal>
      }
      {/* // 접수하기 모달(예상 배달시간 입력 폼) */}

      {/* 배달중 -> 배달완료 모달 */}
      {detailOrder &&
        <OrderDeliveryCompleteModal isOpen={openDone} od_id={id} currJumjuId={state.jumju_id} currJumjuCode={state.jumju_code} od_type={detailOrder.od_type} handleClose={handleOpenDone} />
      }
      {/* // 배달중 -> 배달완료 모달 */}

      {/* 주문 취소 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={openCancel}
        // onClose={handleCloseCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openCancel}>
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
              <ModalCancelButton variant="outlined" onClick={handleCloseCancel}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // 주문 취소 모달 */}

      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        {detailStore && detailOrder && detailProduct ?
          <Grid container justifyContent="flex-start" alignItems="flex-start" style={{ marginBottom: 30 }}>
            <Grid item xs={12} md={6}>
              <Paper className={orderStyle.orderPaper}>
                <Typography variant="h6" component="h6" mb={2} className={orderStyle.orderTitle}>주문정보</Typography>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>주문매장 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{detailStore.mb_company}</Typography>
                </Box>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>주문일시 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{moment(detailOrder.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY년 M월 D일, HH시 mm분')}</Typography>
                </Box>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>주문방법 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{detailOrder.od_type} 주문</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={orderStyle.orderPaper}>
                <Typography variant="h6" component="h6" mb={2} className={orderStyle.orderTitle}>{detailOrder.od_type === '배달' ? '배달' : '포장'}정보</Typography>
                {detailOrder.od_type === '배달' &&
                  <Box fontSize={14} display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-start" className={orderStyle.orderBox}>
                    <Typography variant="body1" className={orderStyle.orderSubtitle03}>배달주소 : </Typography>
                    <Box style={{ textAlign: 'right' }}>
                      <Typography variant="body1">{detailOrder.order_addr1}</Typography>
                      <Typography variant="body1">{detailOrder.order_addr3}</Typography>
                    </Box>
                  </Box>
                }
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle03}>전화번호 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{Api.phoneFomatter(detailOrder.order_hp)}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={orderStyle.orderPaper}>
                <Typography variant="h6" component="h6" className={orderStyle.orderTitle}>메뉴정보</Typography>
                <Box py={1} />
                <Box fontSize={14} className={orderStyle.orderBox}>
                  {detailProduct && detailProduct.length > 0 && detailProduct.map((menu, index) => (
                    <Box key={index}>
                      <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' mb={0.5}>
                        <Typography variant="body1" style={{ marginRight: 20, fontSize: 16, textAlign: 'left', flex: 2 }}>{menu.it_name} {menu.ct_qty}개</Typography>
                        <Typography variant="body1" style={{ marginRight: 10, fontSize: 16, textAlign: 'right', flex: 0.5 }}>{Api.comma(menu.sum_price)}원</Typography>
                      </Box>
                      <Box mb={menu.cart_add_option && menu.cart_add_option.length > 0 ? 1 : 0}>
                        {menu.cart_option && menu.cart_option.length > 0 && menu.cart_option.map((defaultOption, key) => (
                          <Box mb={key === menu.cart_option.length - 1 ? 0 : 1} key={`defaultOption-${key}`}>
                            <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                              <Typography variant="body1" color='#666' mr={0.5}>└ </Typography>
                              <Typography variant="body1" color='#666'>기본옵션: {defaultOption.ct_option}</Typography>
                            </Box>
                            <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                              <Typography variant="body1" color='#666' mr={0.5}>└ </Typography>
                              <Typography variant="body1" color='#666'>옵션금액: {Api.comma(defaultOption.io_price)}원</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      {menu.cart_add_option && menu.cart_add_option.length > 0 && menu.cart_add_option.map((addOption, key) => (
                        <Box mb={key === menu.cart_add_option.length - 1 ? 0 : 1} key={`addOption-${key}`}>
                          <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                            <Typography variant="body1" color='#666' mr={0.5}>└ </Typography>
                            <Typography variant="body1" color='#666'>추가옵션: {addOption.ct_option}</Typography>
                          </Box>
                          <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                            <Typography variant="body1" color='#666' mr={0.5}>└ </Typography>
                            <Typography variant="body1" color='#666'>옵션금액: {Api.comma(addOption.io_price)}원</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={orderStyle.orderPaper}>
                <Typography variant="h6" component="h6" mb={2} className={orderStyle.orderTitle}>요청사항</Typography>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>사장님께 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{detailOrder.order_seller !== '' ? detailOrder.order_seller : '요청사항이 없습니다.'}</Typography>
                </Box>
                {detailOrder.od_type === '배달' &&
                  <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                    <Typography variant="body1" className={orderStyle.orderSubtitle}>배달기사님께 : </Typography>
                    <Typography variant="body1" className={orderStyle.orderSubDescription}>{detailOrder.order_officer !== '' ? detailOrder.order_officer : '요청사항이 없습니다.'}</Typography>
                  </Box>
                }
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle02}>일회용 수저, 포크 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{detailOrder.od_no_spoon == '1' ? '필요없음' : '필요함'}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={orderStyle.orderPaper}>
                <Typography variant="h6" component="h6" mb={2} className={orderStyle.orderTitle}>결제정보</Typography>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>총 주문금액 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{Api.comma(detailOrder.odder_cart_price)} 원</Typography>
                </Box>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>배달팁 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{Api.comma(detailOrder.order_cost)} 원</Typography>
                </Box>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>오주 포인트 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>-{Api.comma(detailOrder.order_point)} P</Typography>
                </Box>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>오주 쿠폰 할인 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>-{Api.comma(detailOrder.order_coupon_ohjoo)} 원</Typography>
                </Box>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>상점 쿠폰 할인 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>-{Api.comma(detailOrder.order_coupon_store)} 원</Typography>
                </Box>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="body1" className={orderStyle.orderSubtitle}>결제방법 : </Typography>
                  <Typography variant="body1" className={orderStyle.orderSubDescription}>{detailOrder.od_settle_case}</Typography>
                </Box>
                <Box fontSize={14} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" className={orderStyle.orderBox}>
                  <Typography variant="h6" className={orderStyle.orderSubtitle} style={{ fontWeight: 'bold' }}>총 결제금액 : </Typography>
                  <Typography variant="h6" fontWeight='bold' className={orderStyle.orderSubDescription}>{Api.comma(detailOrder.order_sumprice)} 원</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          :
          <Typography variant="h6" component="h4">잠시만 기다려주세요</Typography>
        }
      </MainBox>
    </Box>
  );
}

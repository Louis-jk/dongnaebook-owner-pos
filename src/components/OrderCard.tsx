import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Divider
} from '@material-ui/core';
import OrderCheckModal from './OrderCheckModal'; // 신규주문 주문 접수 모달
import OrderRejectModal from './OrderRejectModal'; // 신규주문 주문 거부 모달
import OrderDeliveryModal from './OrderDeliveryModal'; // 접수완료 주문 배달처리 모달
import OrderCancelModal from './OrderCancelModal'; // 접수완료 주문 취소 모달
import { theme } from '../styles/base';
import Api from '../Api';
import moment from 'moment';
import * as orderDetailAction from '../redux/actions/orderDetailAction';
import OrderDeliveryCompleteModal from './OrderDeliveryCompleteModal';

interface orderData {
  [key: string]: string;
}

type OrderType = 'new' | 'check' | 'delivery' | 'done'

interface OrderProps {
  orders: orderData[];
  type: OrderType;
}

export default function OrderCard(props: OrderProps) {

  const { orders, type } = props;
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();

  const [odId, setOdId] = React.useState(''); // 주문 id
  const [currJumjuId, setCurrJumjuId] = React.useState(''); // 주문 해당 jumju_id
  const [currJumjuCode, setCurrJumjuCode] = React.useState(''); // 주문 해당 jumju_code
  const [odType, setOdType] = React.useState(''); // 주문 타입 (배달 | 포장)  

  // 신규주문 상태 -> 접수(배달/포장 시간 입력) 모달 핸들러
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 주문 디테일 정보 가져오기
  const getOrderDetailHandler = (od_id: string, jumju_id: string, jumju_code: string) => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id,
      jumju_code,
      od_id
    };
    Api.send('store_order_detail', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(orderDetailAction.updateOrderDetail(JSON.stringify(arrItems)));
      } else {
        console.log("faild?", arrItems)
        alert('주문 정보를 받아올 수 없습니다.')
        dispatch(orderDetailAction.updateOrderDetail(''));
      }
    });
  }

  const checkOrderHandler = (id: string, jumjuId: string, jumjuCode: string, type: string) => {
    setOdId(id);
    setCurrJumjuId(jumjuId);
    setCurrJumjuCode(jumjuCode);
    setOdType(type);
    getOrderDetailHandler(id, jumjuId, jumjuCode);
    handleOpen();
  }

  // 접수완료 상태 -> 배달중 모달 핸들러
  const [deliveryOpen, setDeliveryOpen] = React.useState(false);
  const handleDeliveryOpen = () => {
    setDeliveryOpen(true);
  };

  const handleDeliveryClose = () => {
    setDeliveryOpen(false);
  };
  const deliveryOrderHandler = (id: string, jumjuId: string, jumjuCode: string, type: string) => {
    setOdId(id);
    setCurrJumjuId(jumjuId);
    setCurrJumjuCode(jumjuCode);
    setOdType(type);
    handleDeliveryOpen();
  }

  // 배달 주문일 경우 -> 배달중 -> 배달완료 모달 핸들러
  const [deliveryCompleteOpen, setDeliveryCompleteOpen] = React.useState(false);
  const handleDeliveryCompleteOpen = () => {
    setDeliveryCompleteOpen(true);
  };

  const handleDeliveryCompleteClose = () => {
    setDeliveryCompleteOpen(false);
  };
  const deliveryOrderCompleteHandler = (id: string, jumjuId: string, jumjuCode: string, type: string) => {
    setOdId(id);
    setCurrJumjuId(jumjuId);
    setCurrJumjuCode(jumjuCode);
    setOdType(type);
    handleDeliveryCompleteOpen();
  }


  // 신규주문 -> 주문 거부 모달 핸들러
  const [rejectOopen, setRejectOpen] = React.useState(false);
  const handleRejectOpen = () => {
    setRejectOpen(true);
  };

  const handleRejectClose = () => {
    setRejectOpen(false);
  };
  const rejectOrderHandler = (id: string, jumjuId: string, jumjuCode: string) => {
    setOdId(id);
    setCurrJumjuId(jumjuId);
    setCurrJumjuCode(jumjuCode);
    handleRejectOpen();
  }

  // 접수완료 상태 -> 주문 취소 모달 핸들러
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const cancelModalOpenHandler = () => {
    setCancelModalOpen(true);
  };

  const cancelModalCloseHandler = () => {
    setCancelModalOpen(false);
  };

  const checkCancelModalHandler = (id: string, jumjuId: string, jumjuCode: string) => {
    setOdId(id);
    setCurrJumjuId(jumjuId);
    setCurrJumjuCode(jumjuCode);
    cancelModalOpenHandler();
  }

  console.log('신규 주문 orders', orders);

  const renderList = (): JSX.Element[] => {
    return orders.map((order, index) =>
      <Grid xs={12} key={order.od_id + index}>
        {/* <Link to={`/details/${order.od_id}`}> */}
        <Box display="flex" flexDirection="row" justifyContent={type === 'done' ? 'flex-start' : 'space-between'} alignItems="center" pb={0.5}>
          <Box flex={1} style={{ minWidth: 155 }} display="flex" flexDirection="column" justifyContent="center" alignItems="center" mr={1}>
            <Typography mb={0.3}>주문일시</Typography>
            <Typography style={{ margin: 0 }}>{moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD(dd)')}</Typography>
            <Typography fontSize={34} fontWeight='bold' style={{ margin: 0 }}>{moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}</Typography>
          </Box>
          <Box flex={type === 'done' ? 2 : 7} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
            <Box>
              {/* 배달주문 / 포장주문 마커 */}
              <Box style={{ width: 'fit-content', padding: '2px 5px', marginBottom: 5, borderRadius: 3, backgroundColor: order.od_type === '배달' ? theme.palette.primary.main : theme.palette.info.light }}>
                <Typography variant='body1' fontSize={12} fontWeight='bold' color={theme.palette.info.contrastText}>{order.od_type === '배달' ? '배달' : '포장'}</Typography>
              </Box>
              {/* 배달주문 / 포장주문 마커 */}

              <Typography fontSize={18} fontWeight="bold" mb={1} style={{ width: '100%', maxWidth: '250px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>[메뉴] {order.od_good_name}</Typography>
              <Box display="flex" flexDirection="row" mb={1}>
                <Typography mr={1} color={order.od_settle_type === 'cash' || order.od_settle_type === 'card-face' ? 'red' : 'black'}>{order.od_settle_case}</Typography>
                <Typography>{Api.comma(order.od_receipt_price)}원</Typography>
              </Box>
              {order.od_type === '배달' &&
                <>
                  <Typography style={{ margin: 0, width: '100%', maxWidth: '250px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.od_addr1 + order.od_addr2}</Typography>
                  <Typography style={{ margin: 0, width: '100%', maxWidth: '250px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.od_addr3}</Typography>
                </>
              }
            </Box>
          </Box>
          {/* {
            type === 'done' &&
            <Box display='flex' flex={1} justifyContent='center' alignSelf='center'>
              <Box style={{ padding: '5px 20px', borderRadius: 5, backgroundColor: order.od_type === '배달' ? theme.palette.primary.main : theme.palette.info.main }}>
                <Typography variant='body1' fontWeight='bold' color={order.od_type === '배달' ? theme.palette.primary.contrastText : theme.palette.info.contrastText}>{order.od_type === '배달' ? '배달주문' : '포장주문'}</Typography>
              </Box>
            </Box>
          } */}

          <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' minWidth={350}>

            <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
              <p><img src={order.image} alt={`${order.mb_company}의 로고`} title={`${order.mb_company}의 로고`} width={40} style={{ borderRadius: 70 }} /></p>
              <Typography ml={1} fontSize={18} fontWeight='bold' color='#f36d00'>{order.mb_company}</Typography>
            </Box>

            <Box flex={type === 'new' || type === 'check' ? 3 : 1} width='100%'>
              <ButtonGroup variant="text" color="primary" style={{ float: 'right', color: theme.palette.info.contrastText, width: '100%' }} aria-label="text primary button group">
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: '#edecf3',
                    color: theme.palette.primary.contrastText,
                    minWidth: 120,
                    width: '100%',
                    height: 75,
                    boxShadow: 'none'
                  }}
                  onClick={() => {
                    history.push({
                      pathname: `orderdetail/${order.od_id}`,
                      state: {
                        jumju_id: order.jumju_id,
                        jumju_code: order.jumju_code
                      }
                    })
                  }}>상세보기</Button>
                {
                  type === 'new' ?
                    <Button variant='contained' color="primary" style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75, boxShadow: 'none' }} onClick={() => checkOrderHandler(order.od_id, order.jumju_id, order.jumju_code, order.od_type)}>접수처리</Button>
                    : type === 'check' && order.od_type === '배달' ?
                      <Button variant='contained' color="primary" style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75, boxShadow: 'none' }} onClick={() => deliveryOrderHandler(order.od_id, order.jumju_id, order.jumju_code, order.od_type)}>배달처리</Button>
                      : type === 'check' && order.od_type === '포장' ?
                        <Button variant='contained' color="primary" style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75, boxShadow: 'none' }} onClick={() => deliveryOrderHandler(order.od_id, order.jumju_id, order.jumju_code, order.od_type)}>포장완료</Button>
                        : type === 'delivery' && order.od_type === '배달' ?
                          <Button variant='contained' color="primary" style={{ color: theme.palette.primary.contrastText, minWidth: 120, width: '100%', height: 75, boxShadow: 'none' }} onClick={() => deliveryOrderCompleteHandler(order.od_id, order.jumju_id, order.jumju_code, order.od_type)}>배달완료</Button>
                          : null
                }
                {
                  type === 'new' ?
                    <Button variant='contained' color="secondary" style={{ color: theme.palette.secondary.contrastText, minWidth: 120, height: 75, boxShadow: 'none' }} onClick={() => rejectOrderHandler(order.od_id, order.jumju_id, order.jumju_code)}>거부처리</Button>
                    : type === 'check' ?
                      <Button variant='contained' color="secondary" style={{ color: theme.palette.secondary.contrastText, minWidth: 120, height: 75, boxShadow: 'none' }} onClick={() => checkCancelModalHandler(order.od_id, order.jumju_id, order.jumju_code)}>취소처리</Button>
                      : null}
              </ButtonGroup>
            </Box>
          </Box>
        </Box>
        <Divider style={{ marginTop: 20, marginBottom: 10 }} />
      </Grid >
    )
  }

  return (
    orders.length > 0 ?
      <>
        <OrderCheckModal isOpen={open} od_id={odId} currJumjuId={currJumjuId} currJumjuCode={currJumjuCode} od_type={odType} handleClose={handleClose} />
        <OrderRejectModal isOpen={rejectOopen} od_id={odId} currJumjuId={currJumjuId} currJumjuCode={currJumjuCode} handleClose={handleRejectClose} />
        <OrderDeliveryModal isOpen={deliveryOpen} od_id={odId} currJumjuId={currJumjuId} currJumjuCode={currJumjuCode} od_type={odType} handleClose={handleDeliveryClose} />
        <OrderDeliveryCompleteModal isOpen={deliveryCompleteOpen} od_id={odId} currJumjuId={currJumjuId} currJumjuCode={currJumjuCode} od_type={odType} handleClose={handleDeliveryCompleteClose} />
        <OrderCancelModal isOpen={cancelModalOpen} od_id={odId} currJumjuId={currJumjuId} currJumjuCode={currJumjuCode} handleClose={cancelModalCloseHandler} />
        <Box>
          {renderList()}
        </Box>
      </>
      :
      <Box style={{ display: 'flex', flex: 1, height: 'calc(100vh - 112px)', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>{type === 'new' ? '신규 ' : type === 'check' ? '접수완료된 ' : type === 'delivery' ? '배달중인 ' : type === 'done' ? '배달완료된 ' : null}주문이 없습니다.</Typography>
      </Box>
  )
}
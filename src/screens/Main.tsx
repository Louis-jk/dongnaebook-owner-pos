import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// Material UI Components
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Api from '../Api';
import * as storeAction from '../redux/actions/storeAction';
import * as orderAction from '../redux/actions/orderAction';
import { baseStyles, theme } from '../styles/base';


export default function Main(props: any) {

  const base = baseStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  // 등록된 스토어 가져오기
  const getStoreHandler = () => {
    const param = {
      jumju_id: mt_id,
      item_count: 0,
      limit_count: 10
    };

    Api.send('store_jumju', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      console.log("store list result ", resultItem);
      console.log("store list", arrItems);
      if (resultItem.result === 'Y') {
        // let initialSelectStore = arrItems.filter(store => store.mt_id === mt_id);
        dispatch(storeAction.updateStore(arrItems));
        getNewOrderHandler();
        // dispatch(storeAction.selectStore(initialSelectStore[0].id, initialSelectStore[0].mt_jumju_id, initialSelectStore[0].mt_jumju_code, initialSelectStore[0].mt_store, initialSelectStore[0].mt_addr));
      } else {
        console.log('arrItems', arrItems);
        dispatch(storeAction.updateStore([]));
        getNewOrderHandler();
      }

    });
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
        getCheckOrderHandler();
      } else {
        console.log("신규주문 faild?", arrItems);
        dispatch(orderAction.updateNewOrder(null));
        getCheckOrderHandler();
      }
    });
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
        getDeliveryOrderHandler();
      } else {
        console.log("접수완료 faild?", arrItems);
        dispatch(orderAction.updateCheckOrder(null));
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
        history.push('/order_new');
      } else {
        console.log("배달완료 faild?", arrItems);
        dispatch(orderAction.updateDoneOrder(null));
        history.push('/order_new');
      }
    });
  }

  useEffect(() => {
    getStoreHandler();
  }, []);

  return (
    <Box className={base.loadingWrap} style={{ flexDirection: 'column', backgroundColor: theme.palette.primary.main, height: '100vh' }}>
      <CircularProgress disableShrink color="secondary" style={{ width: 50, height: 50, marginBottom: 20 }} />
      <Typography style={{ color: theme.palette.primary.contrastText }}>등록된 상점 확인중</Typography>
    </Box>
  );
}

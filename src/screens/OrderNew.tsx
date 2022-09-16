import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';

import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import * as orderAction from '../redux/actions/orderAction';

// const { ipcRenderer } = window.require('electron');
// const electron = window.require('electron');
// const { ipcRenderer, remote } = require('electron');


export default function OrderNew() {

  const base = baseStyles();
  const dispatch = useDispatch();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const { newOrder } = useSelector((state: any) => state.order);
  const [isLoading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  // const refreshPage = () => {
  //   window.location.reload();
  // }

  const getOrderListHandler = () => {

    setLoading(true);

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
        console.log("success?", arrItems)
        setList(arrItems);
        // dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)));
        setLoading(false);
      } else {
        console.log("faild?", arrItems)
        setList([]);
        // dispatch(orderAction.updateNewOrder(null));
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    // refreshPage();
    getOrderListHandler();
  }, [mt_id, mt_jumju_code, newOrder]);

  console.log("주문 리스트", list);


  return (
    <Box component="div" className={base.root}>
      <Header />
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderBottomLeftRadius: 10 }}>
        <OrderCard orders={list} type="new" />
      </MainBox>
    </Box>
  );
}
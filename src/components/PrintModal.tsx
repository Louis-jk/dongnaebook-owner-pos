import * as React from "react";
import { useSelector } from "react-redux";
import * as path from 'path';
import moment from 'moment';
import 'moment/locale/ko';

import Api from "../Api";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { theme, baseStyles } from '../styles/base';
import { Divider, IconButton } from "@material-ui/core";
import { useReactToPrint } from 'react-to-print';

import PrintIcon from '@material-ui/icons/Print';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

// import OrderPrint from './ComponentToPrint';
import appRuntime from '../appRuntime';


const PrintModal = (props: any) => {
  const { mt_store, do_jumju_origin_use } = useSelector((state: any) => state.login);
  const { order, product, store } = useSelector((state: any) => state.orderDetail);

  const base = baseStyles();

  // 프린트 출력 부분
  const componentRef = React.useRef(null);

  //　일반적인 웹형식 프린트출력(프린트 선택 dialog 뜸) 
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // });

  // 일렉트론쪽 프린트 출력
  const handlePrint = () => {
    return new Promise((res, rej) => {
      if (order !== null && product !== null && store !== null) {

        const htmlFormat = `
      <style>
        @page { margin: 0; margin-bottom: 20px; }
        @media print {
          .print_area {
            margin-bottom: 50mm;
          }
        }
      </style>
      <div class='print_area' style='width: 100%;'>
        <h5 style='text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 15px'>매장 주문전표</h5>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>주문번호 : ${order.order_id}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>결제방식 : ${order.od_settle_case}</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.od_type}주소</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>${order.order_addr1}${order.order_addr3}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.od_addr_jibeon}</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>연락처</td>
          </tr>
          ${order.order_safety_number && order.od_settle_type !== 'cash' ?
            `<tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.order_safety_number}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.order_safety_str}</td>
            </tr>`
            :
            `<tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.phoneFomatter(order.order_hp)}</td>
            </tr>`
          }
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>요청사항</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>가게 : ${order.order_seller ? order.order_seller : '요청사항이 없습니다.'}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>배달 : ${order.order_officer ? order.order_officer : '요청사항이 없습니다.'}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>일회용 수저, 포크 : ${order.od_no_spoon == '1' ? '필요없음' : '필요함'}</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='70%' />
            <col width='30%' />
          </colgroup>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>메뉴명</td>
            <td style='text-align: right; font-size: 8pt; letter-spacing: -1;'>금액</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='70%' />
            <col width='30%' />
          </colgroup>
          ${product && product.length > 0 ?
            product.map((menu: any, index: number) => (
              `<tr key=${menu.it_name + index}>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${menu.it_name} ${menu.ct_qty}개</td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(menu.sum_price)}원</td>
            </tr>
            ${menu.cart_option && menu.cart_option.length > 0 ?
                menu.cart_option.map((defaultOption: any, key: number) => (
                  `<tr key=${'defaultOption-name-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 기본옵션 : ${defaultOption.ct_option}</td>
              </tr>
              <tr key=${'defaultOption-price-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(defaultOption.io_price)}원</td>
              </tr>
              `
                )).join('') : ''}
          ${menu.cart_add_option && menu.cart_add_option.length > 0 ? menu.cart_add_option.map((addOption: any, key: number) => (
                  `<tr key=${'addOption-name-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 추가옵션 : ${addOption.ct_option}</td>
              </tr>
              <tr key=${'addOption-price-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(addOption.io_price)}원</td>
              </tr>
              `
                )).join('') : ''}
          `
            )).join('')
            : ''
          }
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='35%' />
            <col width='65%' />
          </colgroup>
          <tr colspan='2'>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>결제정보</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>총 주문금액</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.odder_cart_price)}원</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>배달 팁</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_cost)}원</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 포인트</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_point)}원</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 쿠폰</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_ohjoo)}원</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>상점 쿠폰</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_store)}원</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='40%' />
            <col width='60%' />
          </colgroup>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.od_sum_type}</td>
            <td style='text-align:right;  font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_sumprice)}원</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>주문매장 : ${store.mb_company}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt;'>주문번호 : ${order.order_id}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt;'>주문일시 : ${moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY. MM. DD  HH:mm')}</td>
          </tr>
        </table>
        ${do_jumju_origin_use === 'Y' ?
            `<div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>원산지</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${store.do_jumju_origin}</td>
          </tr>
        </table>`
            : `<p>&nbsp;</p>`}
        <p>&nbsp;</p>
        <hr style='margin: 0 5px;' />
      </div>
    `
        res(appRuntime.send('pos_print', htmlFormat));
      } else {
        alert('주문 디테일이 없습니다.');
      }
    });
  }

  const handlePrint02 = () => {

    return new Promise((res, rej) => {
      if (order !== null && product !== null && store !== null) {

        const htmlFormat02 = `
      <style>
        @page { margin: 0; margin-bottom: 20px; }
        @media print {
          .print_area {
            margin-bottom: 50mm;
          }
        }
      </style>
      <div class='print_area' style='width: 100%;'>
        <h5 style='text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 15px'>${order.od_type} 주문전표</h5>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>주문번호 : ${order.order_id}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>결제방식 : ${order.od_settle_case}</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.od_type}주소</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>${order.order_addr1}${order.order_addr3}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.od_addr_jibeon}</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>연락처</td>
          </tr>
          ${order.order_safety_number && order.od_settle_type !== 'cash' ?
            `<tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.order_safety_number}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${order.order_safety_str}</td>
            </tr>`
            :
            `<tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.phoneFomatter(order.order_hp)}</td>
            </tr>`
          }
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>요청사항</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>가게 : ${order.order_seller ? order.order_seller : '요청사항이 없습니다.'}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>배달 : ${order.order_officer ? order.order_officer : '요청사항이 없습니다.'}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>일회용 수저, 포크 : ${order.od_no_spoon == '1' ? '필요없음' : '필요함'}</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='70%' />
            <col width='30%' />
          </colgroup>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>메뉴명</td>
            <td style='text-align: right; font-size: 8pt; letter-spacing: -1;'>금액</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='70%' />
            <col width='30%' />
          </colgroup>
         ${product && product.length > 0 ?
            product.map((menu: any, index: number) => (
              `<tr key=${menu.it_name + index}>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${menu.it_name} ${menu.ct_qty}개</td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(menu.sum_price)}원</td>
            </tr>
            ${menu.cart_option && menu.cart_option.length > 0 ?
                menu.cart_option.map((defaultOption: any, key: number) => (
                  `<tr key=${'defaultOption-name-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 기본옵션 : ${defaultOption.ct_option}</td>
              </tr>
              <tr key=${'defaultOption-price-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(defaultOption.io_price)}원</td>
              </tr>
              `
                )).join('') : ''}
          ${menu.cart_add_option && menu.cart_add_option.length > 0 ? menu.cart_add_option.map((addOption: any, key: number) => (
                  `<tr key=${'addOption-name-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 추가옵션 : ${addOption.ct_option}</td>
              </tr>
              <tr key=${'addOption-price-' + key}>
                <td style='text-align: left; font-size: 7pt; letter-spacing: -1; font-weight: bold;'>└ 옵션금액 : ${Api.comma(addOption.io_price)}원</td>
              </tr>
              `
                )).join('') : ''}
          `
            )).join('')
            : ''
          }
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='35%' />
            <col width='65%' />
          </colgroup>
          <tr colspan='2'>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>결제정보</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>배달 팁</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_cost)}원</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 포인트</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_point)}원</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>오주 쿠폰</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_ohjoo)}원</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>상점 쿠폰</td>
            <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon_store)}원</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <colgroup>
            <col width='40%' />
            <col width='60%' />
          </colgroup>
          <tr>
            <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.od_sum_type}</td>
            <td style='text-align:right;  font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_sumprice)}원</td>
          </tr>
        </table>
        <div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>주문매장 : ${store.mb_company}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt;'>주문번호 : ${order.order_id}</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt;'>주문일시 : ${moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY. MM. DD  HH:mm')}</td>
          </tr>
        </table>
        ${do_jumju_origin_use === 'Y' ?
            `<div style='display: width: 100%; border: 0.15pt solid black; margin: 5px 0;'></div>
        <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>원산지</td>
          </tr>
          <tr>
            <td style='text-align: left; font-size: 8pt; letter-spacing: -1;'>${store.do_jumju_origin}</td>
          </tr>
        </table>`
            : `<p>&nbsp;</p>`}
        <p>&nbsp;</p>
        <hr style='margin: 0 5px;' />
      </div>
    `
        setTimeout(() => {
          res(appRuntime.send('pos_print', htmlFormat02));
        }, 1000);

      } else {
        alert('주문 디테일이 없습니다.');
      }
    })
  }
  const printHandler = () => {
    handlePrint().then(() => handlePrint02()).catch((err: any) => console.error(err));
  }

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={props.isOpen}
        // onClose={props.isClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box display="flex" flexDirection="column">
            <div className='print_no_area' style={{ zIndex: 99999 }}>
              <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" style={{ backgroundColor: theme.palette.primary.main }}>
                {/* <FontAwesomeIcon icon={faPrint} size="1x" /> */}
                <IconButton
                  className='no-drag-area'
                  onClick={printHandler}
                >
                  <PrintIcon color="secondary" />
                </IconButton>
                <IconButton
                  onClick={props.isClose}
                >
                  <CloseRoundedIcon color="secondary" />
                </IconButton>
              </Box>
              <Divider />
            </div>
            {mt_store && order && product && store ?
              <Box id='printBox' className={base.printModal} style={{ backgroundColor: '#fff' }}>
                <Typography textAlign="center" fontWeight="bold" component="h5" variant="h5" mb={4}>{order.od_type} 주문전표</Typography>
                {/* <Box display="flex" flexDirection="row" mb={0.5}>
                  <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={3}>주문번호</Typography>
                  <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={10} textAlign="right">{order.order_id}</Typography>
                </Box>
                <Box display="flex" flexDirection="row" mb={1}>
                  <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={3}>결제방식</Typography>
                  <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={10} textAlign="right">{order.od_settle_case}</Typography>
                </Box> */}
                <Typography fontSize="11pt" fontWeight="bold">주문번호 : {order.order_id}</Typography>
                <Typography mb={1} fontSize="11pt" fontWeight="bold">결제방식 : {order.od_settle_case}</Typography>
                <Divider />
                <Box my={1}>
                  <Box display="flex" flexDirection="column">
                    <Typography mb={0.5} fontSize="10pt">{order.od_type}주소</Typography>
                    <Typography mb={order.od_addr_jibeon ? 0.5 : 0} fontSize="11pt" fontWeight="bold">{order.order_addr1} {order.order_addr3}</Typography>
                    <Typography fontSize="10pt">{order.od_addr_jibeon}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box my={1}>
                  <Box display="flex" flexDirection="column">
                    <Typography mb={0.5} fontSize="10pt">연락처</Typography>
                    {order.order_safety_number && order.od_settle_type !== 'cash' ?
                      <>
                        <Typography mb={0.5} fontSize="12pt" fontWeight="bold">{order.order_safety_number}</Typography>
                        <Typography fontSize="10pt">{order.order_safety_str}</Typography>
                      </>
                      :
                      <Typography fontSize="12pt" fontWeight="bold">{Api.phoneFomatter(order.order_hp)}</Typography>
                    }
                  </Box>
                </Box>
                <Divider />
                <Box mt={1} mb={2}>
                  <Typography mb={0.5} fontSize="10pt">요청사항</Typography>
                  <Typography fontSize="11pt" fontWeight="bold">가게 : {order.order_seller ? order.order_seller : "요청사항이 없습니다."}</Typography>
                  <Typography fontSize="11pt" fontWeight="bold">배달 : {order.order_officer ? order.order_officer : "요청사항이 없습니다."}</Typography>
                  <Typography mb={1} fontSize="11pt" fontWeight="bold">일회용 수저, 포크 : {order.od_no_spoon == '1' ? '필요없음' : '필요함'}</Typography>
                  {/* <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={3}>가게</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={10} textAlign="right">{order.order_seller ? order.order_seller : "요청사항이 없습니다."}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={3}>배달</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={10} textAlign="right">{order.order_officer ? order.order_officer : "요청사항이 없습니다."}</Typography>
                  </Box> */}
                </Box>
                <Divider />
                <Divider />
                <Box my={1}>
                  <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Box flex="5">
                      <Typography textAlign="left" fontSize="10pt">메뉴명</Typography>
                    </Box>
                    {/* <Box flex="1">
                      <Typography textAlign="center" fontSize="10pt">수량</Typography>
                    </Box> */}
                    <Box flex="2">
                      <Typography textAlign="right" fontSize="10pt">금액</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box my={1}>
                  {product.map((menu: any, index: number) => (
                    <>
                      <Box key={index} mb={1}>
                        <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' width='100%' mt={1} mb={0.5}>
                          <Typography variant="body1" style={{ marginRight: 10, fontSize: 15, fontWeight: 'bold', textAlign: 'left', flex: 3 }}>{menu.it_name} {menu.ct_qty}개</Typography>
                          <Typography variant="body1" style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'right', flex: 1 }}>{Api.comma(menu.sum_price)}원</Typography>
                        </Box>
                        <Box mb={menu.cart_add_option && menu.cart_add_option.length > 0 ? 1 : 0}>
                          {menu.cart_option && menu.cart_option.length > 0 && menu.cart_option.map((defaultOption: any, key: number) => (
                            <Box mb={key === menu.cart_option.length - 1 ? 0 : 1} key={`defaultOption-${key}`}>
                              <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                                <Typography variant="body1" fontSize={13} color='#222' mr={0.5}>└ </Typography>
                                <Typography variant="body1" fontSize={13} color='#222'>기본옵션: {defaultOption.ct_option}</Typography>
                              </Box>
                              <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                                <Typography variant="body1" fontSize={13} color='#222' mr={0.5}>└ </Typography>
                                <Typography variant="body1" fontSize={13} color='#222'>옵션금액: {Api.comma(defaultOption.io_price)}원</Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                        {menu.cart_add_option && menu.cart_add_option.length > 0 && menu.cart_add_option.map((addOption: any, key: number) => (
                          <Box mb={key === menu.cart_add_option.length - 1 ? 0 : 1} key={`addOption-${key}`}>
                            <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                              <Typography variant="body1" fontSize={13} color='#222' mr={0.5}>└ </Typography>
                              <Typography variant="body1" fontSize={13} color='#222'>추가옵션: {addOption.ct_option}</Typography>
                            </Box>
                            <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                              <Typography variant="body1" fontSize={13} color='#222' mr={0.5}>└ </Typography>
                              <Typography variant="body1" fontSize={13} color='#222'>옵션금액: {Api.comma(addOption.io_price)}원</Typography>
                            </Box>
                          </Box>
                        ))}
                        {/* <Box flex="5">
                          <Typography textAlign="left" fontSize="11pt" fontWeight="bold">{item.it_name}</Typography>
                          <Typography textAlign="left" fontSize="9pt">└ 옵션 : {item.io_id}</Typography>
                        </Box>
                        <Box flex="1">
                          <Typography textAlign="center" fontSize="11pt" fontWeight="bold">{item.ct_qty}</Typography>
                          <Typography textAlign="left" fontSize="9pt"></Typography>
                        </Box>
                        <Box flex="2">
                          <Typography textAlign="right" fontSize="11pt" fontWeight="bold">{Api.comma(item.sum_price)}원</Typography>
                          <Typography textAlign="right" fontSize="9pt">{Api.comma(item.io_price)}</Typography>
                        </Box> */}
                      </Box>
                      {index !== product.length - 1 ?
                        <Divider style={{ borderStyle: 'dotted' }} />
                        : null
                      }
                    </>
                  ))}
                </Box>
                <Divider />
                <Box mt={1.5} mb={1}>
                  <Typography mb={0.5} fontSize="10pt">결제정보</Typography>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={4}>총 주문금액</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.odder_cart_price)}원</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={4}>배달 팁</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_cost)}원</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={4}>오주 포인트</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_point)}원</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={4}>오주 쿠폰</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_coupon_ohjoo)}원</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={1}>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={4}>상점 쿠폰</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_coupon_store)}원</Typography>
                  </Box>
                  {/* <Box display="flex" flexDirection="row" mb={2}>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={4}>결제방법</Typography>
                    <Typography fontSize="11pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{order.od_settle_case}</Typography>
                  </Box> */}
                  <Divider />
                  <Box display="flex" flexDirection="row" my={1}>
                    <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={4}>{order.od_sum_type}</Typography>
                    <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_sumprice)}원</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box my={1}>
                  <Box display="flex" flexDirection="column">
                    <Typography fontSize="10pt">주문매장 : {store.mb_company}</Typography>
                    <Typography fontSize="10pt">주문번호 : {order.order_id}</Typography>
                    <Typography fontSize="10pt">주문일시 : {moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY.MM.DD HH:mm')}</Typography>
                  </Box>
                </Box>
                {do_jumju_origin_use === 'Y' ?
                  <>
                    <Divider />
                    <Box my={1}>
                      <Typography fontSize="10pt">원산지</Typography>
                      <Typography fontSize="10pt">{store.do_jumju_origin}</Typography>
                    </Box>
                  </>
                  : null
                }
              </Box>
              : <Typography>주문 디테일을 불러오고 있습니다.</Typography>}
          </Box>
        </Fade>
      </Modal>

      {/* <Box style={{ display: 'none' }}>
        <OrderPrint ref={componentRef} />
      </Box> */}
    </>
  )
};

export default PrintModal;